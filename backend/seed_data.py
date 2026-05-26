"""
Seed the MASCOT mHealth database with sample data for development / demo.
Run from the backend/ directory:
    python seed_data.py
"""
import os
import sys

# Ensure the backend directory is on the path
sys.path.insert(0, os.path.dirname(__file__))

from dotenv import load_dotenv
load_dotenv()

from database.connection import SessionLocal, init_db
from models import (
    PreventionMethod, Clinic, SupportGroup,
    Counsellor, VideoGuide, Testimonial
)


def seed():
    init_db()
    db = SessionLocal()

    try:
        # ── Prevention Methods ────────────────────────────────────────────────
        if db.query(PreventionMethod).count() == 0:
            methods = [
                PreventionMethod(
                    name="Male Condom",
                    category="contraception",
                    description="A thin sheath worn over the penis during sex to prevent pregnancy and STIs.",
                    effectiveness=98,
                    cost="Free at clinics / low cost at pharmacies",
                    side_effects="Possible latex allergy in rare cases.",
                    how_to_use="Use a new condom every time. Check expiry date. Leave space at the tip.",
                    details={
                        "steps": ["Check expiry", "Open carefully", "Pinch tip", "Roll down fully"],
                        "availability": "All youth-friendly clinics and pharmacies",
                        "protects_against_sti": True,
                    }
                ),
                PreventionMethod(
                    name="Female Condom",
                    category="contraception",
                    description="An internal condom inserted into the vagina before sex.",
                    effectiveness=95,
                    cost="Free at selected clinics",
                    side_effects="May feel unusual at first.",
                    how_to_use="Insert up to 8 hours before sex. Remove carefully after.",
                    details={
                        "steps": ["Find comfortable position", "Squeeze inner ring", "Insert like tampon", "Guide outer ring outside"],
                        "availability": "Youth-friendly clinics",
                        "protects_against_sti": True,
                    }
                ),
                PreventionMethod(
                    name="Oral Contraceptive Pill",
                    category="contraception",
                    description="A daily hormonal pill that prevents ovulation.",
                    effectiveness=99,
                    cost="Free at government clinics",
                    side_effects="Nausea, mood changes, spotting in first months.",
                    how_to_use="Take at the same time every day. Start on day 1 of period.",
                    details={
                        "steps": ["Get prescription", "Take daily at same time", "Use back-up if missed"],
                        "availability": "All public health facilities",
                        "protects_against_sti": False,
                    }
                ),
                PreventionMethod(
                    name="PrEP (Pre-Exposure Prophylaxis)",
                    category="hiv_prevention",
                    description="A daily pill taken by HIV-negative people to greatly reduce HIV risk.",
                    effectiveness=99,
                    cost="Free at selected clinics",
                    side_effects="Mild nausea, headache — usually resolves in 2 weeks.",
                    how_to_use="Take daily. Get tested every 3 months.",
                    details={
                        "steps": ["Get HIV test", "Get prescription", "Take daily", "Follow-up every 3 months"],
                        "availability": "ZUPCO youth clinics and Joburg Health",
                        "protects_against_sti": False,
                    }
                ),
                PreventionMethod(
                    name="HIV Self-Test",
                    category="hiv_prevention",
                    description="A rapid test you can do at home to know your HIV status.",
                    effectiveness=99,
                    cost="Free at select clinics / ~$2 at pharmacies",
                    side_effects="None.",
                    how_to_use="Follow kit instructions. Confirm positives at a clinic.",
                    details={
                        "steps": ["Open kit", "Prick finger or use oral swab", "Wait 15 minutes", "Read result"],
                        "availability": "Pharmacies, health facilities",
                        "protects_against_sti": False,
                    }
                ),
                PreventionMethod(
                    name="Injectable Contraceptive (Depo)",
                    category="contraception",
                    description="A hormonal injection given every 3 months.",
                    effectiveness=99,
                    cost="Free at government clinics",
                    side_effects="Irregular periods, weight changes.",
                    how_to_use="Visit a clinic every 3 months for your injection.",
                    details={
                        "steps": ["Visit clinic", "Receive injection", "Return in 3 months"],
                        "availability": "All public health facilities",
                        "protects_against_sti": False,
                    }
                ),
                PreventionMethod(
                    name="Implant (Jadelle)",
                    category="contraception",
                    description="A small rod inserted under the skin of the upper arm. Works for up to 5 years.",
                    effectiveness=99,
                    cost="Free at public clinics",
                    side_effects="Irregular bleeding, headaches.",
                    how_to_use="Inserted by a trained health worker. No daily action needed.",
                    details={
                        "steps": ["Visit clinic", "Local anaesthetic applied", "Rod inserted", "Check yearly"],
                        "availability": "Most public health facilities",
                        "protects_against_sti": False,
                    }
                ),
                PreventionMethod(
                    name="Emergency Contraceptive Pill",
                    category="contraception",
                    description="\"Morning-after pill\" — taken within 72 hours of unprotected sex.",
                    effectiveness=95,
                    cost="~$1–$3 at pharmacies / free at clinics",
                    side_effects="Nausea, irregular next period.",
                    how_to_use="Take as soon as possible after unprotected sex. Not for regular use.",
                    details={
                        "steps": ["Take within 72 hours", "Second dose 12 hrs later (2-pill kit)"],
                        "availability": "Pharmacies nationwide",
                        "protects_against_sti": False,
                    }
                ),
            ]
            db.bulk_save_objects(methods)
            db.commit()
            print(f"  Seeded {len(methods)} prevention methods.")

        # ── Clinics ────────────────────────────────────────────────────────────
        if db.query(Clinic).count() == 0:
            clinics = [
                Clinic(
                    name="UZ Health Centre",
                    location="University of Zimbabwe, Harare",
                    latitude=-17.7839,
                    longitude=31.0534,
                    phone="+263 242 303211",
                    services=["hiv_testing", "contraception", "youth_clinic", "counselling"],
                    opening_hours="Mon-Fri 08:00-17:00",
                    is_lgbtq_friendly=True,
                    rating=4.5,
                ),
                Clinic(
                    name="Harare Central Hospital - Youth Clinic",
                    location="Mazowe Street, Harare",
                    latitude=-17.8252,
                    longitude=31.0335,
                    phone="+263 242 701531",
                    services=["hiv_testing", "contraception", "antenatal", "sti_treatment", "youth_clinic"],
                    opening_hours="Mon-Sat 07:00-18:00",
                    is_lgbtq_friendly=True,
                    rating=4.2,
                ),
                Clinic(
                    name="ZUPCO Community Health Clinic",
                    location="Mbare, Harare",
                    latitude=-17.8607,
                    longitude=31.0494,
                    phone="+263 242 552031",
                    services=["hiv_testing", "prep", "hiv_self_test", "counselling"],
                    opening_hours="Mon-Fri 08:00-16:30",
                    is_lgbtq_friendly=True,
                    rating=4.0,
                ),
                Clinic(
                    name="Avenues Clinic - Sexual Health Unit",
                    location="Baines Avenue, Harare",
                    latitude=-17.8144,
                    longitude=31.0512,
                    phone="+263 242 251180",
                    services=["hiv_testing", "sti_treatment", "contraception", "prep"],
                    opening_hours="Mon-Sun 08:00-20:00",
                    is_lgbtq_friendly=True,
                    rating=4.7,
                ),
                Clinic(
                    name="Bulawayo Youth Friendly Clinic",
                    location="Fort Street, Bulawayo",
                    latitude=-20.1500,
                    longitude=28.5830,
                    phone="+263 29 2861081",
                    services=["youth_clinic", "contraception", "hiv_testing", "counselling"],
                    opening_hours="Mon-Fri 08:00-17:00",
                    is_lgbtq_friendly=True,
                    rating=4.3,
                ),
            ]
            db.bulk_save_objects(clinics)
            db.commit()
            print(f"  Seeded {len(clinics)} clinics.")

        # ── Support Groups ─────────────────────────────────────────────────────
        if db.query(SupportGroup).count() == 0:
            groups = [
                SupportGroup(
                    name="UZ Peer Health Educators",
                    group_type="hiv_support",
                    description="Student-led group offering peer support and health education.",
                    meeting_schedule="Every Wednesday 14:00, Student Union Building",
                    location="University of Zimbabwe, Harare",
                    contact_person="Tafadzwa M.",
                    contact_phone="+263 77 123 4567",
                ),
                SupportGroup(
                    name="Young Mothers Support Circle",
                    group_type="pregnancy_support",
                    description="Safe space for young mothers and pregnant students.",
                    meeting_schedule="Every Saturday 10:00, Harare Gardens Community Hall",
                    location="Harare Gardens, Harare",
                    contact_person="Grace N.",
                    contact_phone="+263 71 987 6543",
                ),
                SupportGroup(
                    name="LGBTQ+ Wellness Alliance",
                    group_type="lgbtq_support",
                    description="Confidential support for LGBTQ+ university students.",
                    meeting_schedule="First Sunday of month 15:00, Venue shared via WhatsApp",
                    location="Harare (confidential)",
                    contact_person="Alex K.",
                    contact_phone="+263 73 555 0101",
                ),
            ]
            db.bulk_save_objects(groups)
            db.commit()
            print(f"  Seeded {len(groups)} support groups.")

        # ── Counsellors ────────────────────────────────────────────────────────
        if db.query(Counsellor).count() == 0:
            counsellors = [
                Counsellor(
                    name="Dr. Chipo Mhaka",
                    specialization="Sexual and Reproductive Health",
                    phone="+263 77 200 0001",
                    email="c.mhaka@mascot.health",
                    availability="Mon, Wed, Fri 09:00-15:00",
                    languages=["English", "Shona"],
                    is_available=True,
                    bio="10 years experience in youth SRH. Non-judgmental, confidential sessions.",
                ),
                Counsellor(
                    name="Mr. Tatenda Moyo",
                    specialization="HIV Counselling and Testing",
                    phone="+263 71 200 0002",
                    email="t.moyo@mascot.health",
                    availability="Tue, Thu 10:00-16:00",
                    languages=["English", "Shona", "Ndebele"],
                    is_available=True,
                    bio="Certified HCT counsellor. Specialises in disclosure support.",
                ),
                Counsellor(
                    name="Ms. Rudo Sithole",
                    specialization="Mental Health & Relationships",
                    phone="+263 73 200 0003",
                    email="r.sithole@mascot.health",
                    availability="Mon-Fri 08:00-12:00",
                    languages=["English", "Ndebele"],
                    is_available=True,
                    bio="Counselling psychologist. Relationship difficulties, anxiety, grief.",
                ),
            ]
            db.bulk_save_objects(counsellors)
            db.commit()
            print(f"  Seeded {len(counsellors)} counsellors.")

        # ── Video Guides ───────────────────────────────────────────────────────
        if db.query(VideoGuide).count() == 0:
            videos = [
                VideoGuide(
                    title="How to Use a Male Condom Correctly",
                    description="Step-by-step guide to ensure maximum protection.",
                    video_url="https://www.youtube.com/watch?v=example1",
                    duration_seconds=180,
                    category="condom_use",
                    thumbnail_url=None,
                    views_count=0,
                ),
                VideoGuide(
                    title="Understanding PrEP: What You Need to Know",
                    description="Who can use PrEP, where to get it, and how it works.",
                    video_url="https://www.youtube.com/watch?v=example2",
                    duration_seconds=240,
                    category="hiv_prevention",
                    thumbnail_url=None,
                    views_count=0,
                ),
                VideoGuide(
                    title="HIV Self-Test at Home — Step by Step",
                    description="How to perform an HIV self-test accurately and what to do with the result.",
                    video_url="https://www.youtube.com/watch?v=example3",
                    duration_seconds=300,
                    category="hiv_testing",
                    thumbnail_url=None,
                    views_count=0,
                ),
                VideoGuide(
                    title="Contraception Options for Young Women",
                    description="Comparing pills, injectables, implants, and IUDs.",
                    video_url="https://www.youtube.com/watch?v=example4",
                    duration_seconds=360,
                    category="contraception",
                    thumbnail_url=None,
                    views_count=0,
                ),
            ]
            db.bulk_save_objects(videos)
            db.commit()
            print(f"  Seeded {len(videos)} video guides.")

        # ── Testimonials ───────────────────────────────────────────────────────
        if db.query(Testimonial).count() == 0:
            testimonials = [
                Testimonial(
                    author_name="Anonymous Student, UZ",
                    content="I was scared to ask about PrEP at a clinic but this app explained everything clearly. Got tested and started PrEP. Changed my life.",
                    rating=5,
                    topic="hiv_prevention",
                    is_approved=True,
                ),
                Testimonial(
                    author_name="Anonymous, Bulawayo",
                    content="Found a LGBTQ+ friendly clinic near me using the app. The staff were amazing and non-judgmental.",
                    rating=5,
                    topic="find_services",
                    is_approved=True,
                ),
                Testimonial(
                    author_name="Anonymous Student",
                    content="The AI chat answered my questions at 2am when I had no one to ask. Private and helpful.",
                    rating=4,
                    topic="general_health",
                    is_approved=True,
                ),
                Testimonial(
                    author_name="Anonymous, Harare",
                    content="Booked a counselling session through the app. The counsellor was professional and I felt safe.",
                    rating=5,
                    topic="counselling",
                    is_approved=True,
                ),
            ]
            db.bulk_save_objects(testimonials)
            db.commit()
            print(f"  Seeded {len(testimonials)} testimonials.")

        print("\n  Database seeded successfully!")

    except Exception as e:
        db.rollback()
        print(f"\n  Seed failed: {e}")
        raise
    finally:
        db.close()


if __name__ == "__main__":
    print("\nSeeding MASCOT mHealth database...")
    seed()
