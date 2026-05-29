"""
RAG (Retrieval-Augmented Generation) Pipeline for MASCOT Health Assistant.

Loads .txt health documents, chunks them, embeds with OpenAI, stores in
ChromaDB, and generates grounded answers via GPT-4o-mini.
Falls back to keyword search when OpenAI is unavailable.
"""

import os
import logging
from pathlib import Path
from typing import List, Dict, Optional

logger = logging.getLogger(__name__)

DOCS_DIR = Path(__file__).parent / "health_documents"
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY", "")
OPENAI_MODEL = os.getenv("OPENAI_MODEL", "gpt-4o-mini")


class RAGPipeline:
    """Retrieval-Augmented Generation pipeline for MASCOT health queries."""

    def __init__(self):
        self._ready = False
        self._docs: List[Dict] = []          # {"content": str, "source": str, "chunk_id": int}
        self._vector_store = None
        self._llm = None
        self._embeddings = None

    async def initialize(self):
        """Load health documents and set up vector store."""
        try:
            raw_docs = self._load_documents()
            if not raw_docs:
                logger.warning("No health documents found — AI will use keyword fallback")
                self._ready = False
                return

            chunks = self._chunk_documents(raw_docs)
            self._docs = chunks
            logger.info(f"Loaded {len(chunks)} document chunks from {len(raw_docs)} files")

            if OPENAI_API_KEY and not OPENAI_API_KEY.startswith("sk-your"):
                await self._setup_vector_store(chunks)
            else:
                logger.warning("No valid OPENAI_API_KEY — running in keyword-search mode")

            self._ready = True
            logger.info("RAG pipeline ready")
        except Exception as e:
            logger.error(f"RAG init failed: {e}")
            self._ready = True   # still usable via keyword fallback

    def _load_documents(self) -> List[Dict]:
        """Read all .txt files from health_documents/."""
        docs = []
        if not DOCS_DIR.exists():
            logger.warning(f"Health documents directory not found: {DOCS_DIR}")
            return docs
        for path in DOCS_DIR.glob("*.txt"):
            try:
                text = path.read_text(encoding="utf-8")
                docs.append({"content": text, "source": path.name})
                logger.info(f"Loaded document: {path.name} ({len(text)} chars)")
            except Exception as e:
                logger.error(f"Failed to read {path.name}: {e}")
        return docs

    def _chunk_documents(self, docs: List[Dict], chunk_size: int = 800, overlap: int = 100) -> List[Dict]:
        """Split documents into overlapping chunks."""
        chunks = []
        for doc in docs:
            text = doc["content"]
            start = 0
            chunk_id = 0
            while start < len(text):
                end = min(start + chunk_size, len(text))
                chunk_text = text[start:end].strip()
                if chunk_text:
                    chunks.append({
                        "content": chunk_text,
                        "source": doc["source"],
                        "chunk_id": chunk_id,
                    })
                    chunk_id += 1
                start += chunk_size - overlap
        return chunks

    async def _setup_vector_store(self, chunks: List[Dict]):
        """Create ChromaDB vector store with OpenAI embeddings."""
        try:
            from langchain_openai import OpenAIEmbeddings, ChatOpenAI
            from langchain_chroma import Chroma
            from langchain.schema import Document

            self._embeddings = OpenAIEmbeddings(openai_api_key=OPENAI_API_KEY)
            self._llm = ChatOpenAI(
                model=OPENAI_MODEL,
                temperature=0.3,
                openai_api_key=OPENAI_API_KEY,
            )

            lc_docs = [
                Document(
                    page_content=c["content"],
                    metadata={"source": c["source"], "chunk_id": c["chunk_id"]}
                )
                for c in chunks
            ]

            self._vector_store = Chroma.from_documents(
                documents=lc_docs,
                embedding=self._embeddings,
                collection_name="mascot_health",
                persist_directory=str(Path(__file__).parent / "chroma_db"),
            )
            logger.info("ChromaDB vector store created")
        except ImportError as e:
            logger.warning(f"LangChain/ChromaDB not available: {e} — using keyword fallback")
        except Exception as e:
            logger.error(f"Vector store setup failed: {e} — using keyword fallback")

    async def query(self, question: str, language: str = "en") -> Dict:
        """
        Answer a health question using RAG.
        Falls back to keyword search + template answer when LLM unavailable.
        """
        if not self._docs:
            await self.initialize()

        relevant = self._retrieve_relevant_chunks(question)

        if self._vector_store and self._llm:
            return await self._llm_answer(question, relevant, language)

        return self._keyword_answer(question, relevant, language)

    def _retrieve_relevant_chunks(self, question: str, top_k: int = 4) -> List[Dict]:
        """Retrieve relevant chunks — vector search or keyword fallback."""
        if self._vector_store:
            try:
                results = self._vector_store.similarity_search(question, k=top_k)
                return [
                    {"content": r.page_content, "source": r.metadata.get("source", "")}
                    for r in results
                ]
            except Exception as e:
                logger.warning(f"Vector search failed: {e} — falling back to keyword")

        return self._keyword_search(question, top_k)

    def _keyword_search(self, question: str, top_k: int = 4) -> List[Dict]:
        """Simple keyword overlap search over loaded chunks."""
        if not self._docs:
            return []
        words = set(question.lower().split())
        scored = []
        for chunk in self._docs:
            chunk_words = set(chunk["content"].lower().split())
            score = len(words & chunk_words)
            if score > 0:
                scored.append((score, chunk))
        scored.sort(key=lambda x: x[0], reverse=True)
        return [c for _, c in scored[:top_k]]

    _LANG_INSTRUCTIONS = {
        "sn": (
            "CRITICAL: You MUST respond ENTIRELY in ChiShona (Zimbabwe Shona). "
            "Every sentence must be in ChiShona. Only keep medical terms that have "
            "no Shona equivalent in English (e.g. HIV, PrEP, IUD, condom). "
            "Do not write any full sentences in English."
        ),
        "nd": (
            "CRITICAL: You MUST respond ENTIRELY in IsiNdebele (Zimbabwe Ndebele). "
            "Every sentence must be in IsiNdebele. Only keep medical terms that have "
            "no Ndebele equivalent in English (e.g. HIV, PrEP, IUD, condom). "
            "Do not write any full sentences in English."
        ),
    }

    async def _llm_answer(self, question: str, context_chunks: List[Dict], language: str = "en") -> Dict:
        """Generate answer via GPT-4o-mini with retrieved context."""
        from langchain.schema import HumanMessage, SystemMessage

        context = "\n\n---\n\n".join(c["content"] for c in context_chunks)
        sources = list({c["source"] for c in context_chunks})

        lang_instruction = self._LANG_INSTRUCTIONS.get(language, "")
        system_prompt = (
            "You are MASCOT, a friendly and non-judgmental sexual health assistant "
            "for young people in Zimbabwe. Answer ONLY based on the provided health "
            "information. If the answer is not in the context, say so clearly and "
            "recommend visiting a clinic. Keep answers concise and youth-friendly. "
            "Never shame or judge."
            + (f" {lang_instruction}" if lang_instruction else "")
        )

        user_prompt = f"""Health information context:
{context}

Question: {question}

Please answer based only on the above health information."""

        try:
            response = await self._llm.ainvoke([
                SystemMessage(content=system_prompt),
                HumanMessage(content=user_prompt),
            ])
            return {
                "response": response.content,
                "confidence": 0.9,
                "sources": sources,
            }
        except Exception as e:
            logger.error(f"LLM invocation failed: {e}")
            return self._keyword_answer(question, context_chunks)

    _NO_INFO = {
        "en": (
            "I don't have specific information about that in my health documents. "
            "Please visit a clinic or call the MASCOT helpline for personalised advice."
        ),
        "sn": (
            "Handina ruzivo rwakakwana pamusoro pezvo mumabhuku angu ehutano. "
            "Ndapota shanyirai chipatara kana fonai MASCOT helpline kuti muwane mazano anokukodzera."
        ),
        "nd": (
            "Angilwazi olwanele mayelana nalokho emibhalweni yami yezempilo. "
            "Sicela uvakashele ikhliniki noma usithumelele i-MASCOT helpline ukuze uthole izeluleko ezikhethele wena."
        ),
    }

    _INTRO = {
        "en": "Based on MASCOT health resources:\n\n{excerpt}\n\nFor more personalised advice, please visit a clinic or speak to a counsellor.",
        "sn": "Zvichienderana nemabhuku ehutano ezveMASCOT:\n\n{excerpt}\n\nKuti uwane mazano anokukodzera, shanyirai chipatara kana kutaura nenurse kana counsellor.",
        "nd": "Ngokwezincwadi zempilo ze-MASCOT:\n\n{excerpt}\n\nUkuze uthole izeluleko ezikhethele wena, sicela uvakashele ikhliniki noma ukhulume lomhlengikazi.",
    }

    def _keyword_answer(self, question: str, context_chunks: List[Dict], language: str = "en") -> Dict:
        """Generate a template answer when LLM is unavailable."""
        if not context_chunks:
            return {
                "response": self._NO_INFO.get(language, self._NO_INFO["en"]),
                "confidence": 0.3,
                "sources": [],
            }

        top = context_chunks[0]["content"]
        excerpt = top[:600].strip()
        if len(top) > 600:
            excerpt += "..."

        sources = list({c["source"].replace(".txt", "").replace("_", " ") for c in context_chunks})
        template = self._INTRO.get(language, self._INTRO["en"])

        return {
            "response": template.format(excerpt=excerpt),
            "confidence": 0.6,
            "sources": sources,
        }


# Module-level singleton
rag_pipeline = RAGPipeline()
