import 'package:flutter/material.dart';
import '../theme/app_theme.dart';
import '../models/models.dart';

class AIChatScreen extends StatefulWidget {
  const AIChatScreen({super.key});

  @override
  State<AIChatScreen> createState() => _AIChatScreenState();
}

class _AIChatScreenState extends State<AIChatScreen> {
  final _controller = TextEditingController();
  final _scrollController = ScrollController();
  final List<ChatMessage> _messages = [];

  bool _isTyping = false;

  static const Color mascotGreen = Color(0xFF93C962);
  static const Color mascotDarkGreen = Color(0xFF76A44E);
  static const Color mascotLightGreen = Color(0xFFF2F9E6);
  static const Color mascotSoftGreen = Color(0xFFE0F2C4);

  final List<String> _suggestions = [
    'How do condoms prevent HIV?',
    'What are the side effects of the pill?',
    'Where can I get an HIV test?',
    'Is the morning-after pill safe?',
    'How effective is PrEP?',
    'What is an IUD?',
  ];

  @override
  void initState() {
    super.initState();
    _addWelcomeMessage();
  }

  void _addWelcomeMessage() {
    _messages.add(
      ChatMessage(
        role: 'assistant',
        content:
            'Hi! I\'m MASCOT AI, your confidential health assistant. 🌿\n\n'
            'I can help you with questions about:\n'
            '• HIV prevention & testing\n'
            '• Contraception options\n'
            '• Sexual health & wellness\n'
            '• Finding health services near you\n\n'
            'All conversations are private and anonymous. What would you like to know?',
        timestamp: DateTime.now(),
      ),
    );
  }

  Future<void> _sendMessage(String text) async {
    if (text.trim().isEmpty) return;

    final userMessage = text.trim();
    _controller.clear();

    setState(() {
      _messages.add(
        ChatMessage(
          role: 'user',
          content: userMessage,
          timestamp: DateTime.now(),
        ),
      );
      _isTyping = true;
    });

    _scrollToBottom();

    await Future.delayed(const Duration(milliseconds: 900));

    if (!mounted) return;

    setState(() {
      _messages.add(
        ChatMessage(
          role: 'assistant',
          content: _generateHardcodedResponse(userMessage),
          timestamp: DateTime.now(),
        ),
      );
      _isTyping = false;
    });

    _scrollToBottom();
  }

  String _generateHardcodedResponse(String message) {
    final msg = message.toLowerCase();

    if (msg.contains('condom')) {
      return '''
Condoms help prevent HIV by creating a barrier that stops body fluids from passing between partners during sex.

Benefits:
• Help prevent HIV
• Help prevent pregnancy
• Protect against many STIs
• Available at clinics and pharmacies

Tips:
• Use a new condom every time
• Check the expiry date
• Open carefully
• Use from start to finish

For extra protection, condoms can be used together with another prevention method like PrEP or contraception.
''';
    }

    if (msg.contains('prep')) {
      return '''
PrEP is medicine taken by an HIV-negative person to reduce the risk of getting HIV.

Important:
• Very effective when taken correctly
• Usually taken daily
• Requires regular HIV testing
• Does not prevent pregnancy or other STIs

Possible side effects:
• Mild nausea
• Headache
• Tiredness

These often improve after a short time. Visit a clinic for testing and advice before starting PrEP.
''';
    }

    if (msg.contains('pep')) {
      return '''
PEP is emergency HIV prevention medicine taken after possible HIV exposure.

Important:
• Start as soon as possible
• Must be started within 72 hours
• Usually taken for 28 days
• Available through clinics or emergency services

PEP is not for regular prevention. For ongoing protection, ask about PrEP.
''';
    }

    if (msg.contains('pill') || msg.contains('birth control')) {
      return '''
Birth control pills help prevent pregnancy by stopping ovulation.

Possible side effects:
• Nausea
• Headache
• Mood changes
• Breast tenderness
• Spotting between periods

Tips:
• Take one pill every day
• Try to take it at the same time
• Missing pills can reduce protection
• Pills do not protect against HIV or STIs

Use condoms too if you also want STI protection.
''';
    }

    if (msg.contains('morning') || msg.contains('emergency contraception')) {
      return '''
Emergency contraception can reduce the chance of pregnancy after unprotected sex or condom breakage.

Important:
• Take it as soon as possible
• Works best within 72 hours
• It is not meant for regular use
• It does not protect against HIV or STIs

Possible side effects:
• Nausea
• Tiredness
• Changes in next period

Visit a clinic or pharmacy for advice.
''';
    }

    if (msg.contains('iud')) {
      return '''
An IUD is a small device placed inside the uterus by a trained health worker to prevent pregnancy.

Types:
• Copper IUD
• Hormonal IUD

Benefits:
• Long-lasting
• Very effective
• No daily action needed

Important:
• It does not protect against HIV or STIs
• Must be inserted and removed by a trained provider

Use condoms too for STI protection.
''';
    }

    if (msg.contains('depo') || msg.contains('injection')) {
      return '''
Depo is a contraceptive injection used to prevent pregnancy.

Important:
• Usually given every 3 months
• Very effective when taken on time
• Does not protect against HIV or STIs

Possible side effects:
• Irregular periods
• Weight changes
• Headaches
• Delayed return to fertility for some people

Visit a clinic for advice and your next injection date.
''';
    }

    if (msg.contains('implant')) {
      return '''
The implant is a small rod placed under the skin of the upper arm to prevent pregnancy.

Benefits:
• Long-lasting
• Very effective
• No daily action needed
• Can be removed by a trained provider

Possible side effects:
• Irregular bleeding
• Headaches
• Mood changes

It does not protect against HIV or STIs, so condoms are still useful.
''';
    }

    if (msg.contains('hiv test') ||
        msg.contains('testing') ||
        msg.contains('self-test')) {
      return '''
HIV testing helps you know your status early and get support.

Options:
• Clinic testing
• HIV self-test kits
• Community testing services

Self-test steps:
1. Open the kit
2. Follow the instructions
3. Wait for the required time
4. Read the result
5. Confirm a positive result at a clinic

Testing is private and confidential.
''';
    }

    if (msg.contains('clinic') || msg.contains('where')) {
      return '''
You can access youth-friendly health services at clinics, hospitals, pharmacies, and some community health centres.

Services may include:
• HIV testing
• PrEP
• Condoms
• Contraception
• Counselling
• STI treatment

You can also check the Clinics section in the app to find nearby services.
''';
    }

    if (msg.contains('pregnan') || msg.contains('contraception')) {
      return '''
Pregnancy prevention options include:

• Condoms
• Birth control pills
• Depo injection
• Implant
• Copper IUD
• Emergency contraception

Each method works differently. A clinic can help you choose what fits your body, routine, and needs.
''';
    }

    return '''
Get started by sending me a question from my domain 🌿

I can help with:
• HIV prevention
• Condoms
• PrEP and PEP
• HIV testing
• Pregnancy prevention
• Birth control options
• Clinics and counselling support

Try asking something like:
• How does PrEP work?
• What are pill side effects?
• Where can I get tested?
''';
  }

  void _scrollToBottom() {
    Future.delayed(const Duration(milliseconds: 100), () {
      if (_scrollController.hasClients) {
        _scrollController.animateTo(
          _scrollController.position.maxScrollExtent,
          duration: const Duration(milliseconds: 300),
          curve: Curves.easeOut,
        );
      }
    });
  }

  @override
  void dispose() {
    _controller.dispose();
    _scrollController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: mascotLightGreen,
      body: SafeArea(
        child: Column(
          children: [
            _buildChatHeader(),
            _buildPrivacyBanner(),
            Expanded(
              child: ListView.builder(
                controller: _scrollController,
                padding: const EdgeInsets.fromLTRB(16, 16, 16, 10),
                itemCount: _messages.length + (_isTyping ? 1 : 0),
                itemBuilder: (context, i) {
                  if (i == _messages.length) return _buildTypingIndicator();
                  return _MessageBubble(message: _messages[i]);
                },
              ),
            ),
            if (_messages.length == 1) _buildSuggestions(),
            _buildInputArea(),
          ],
        ),
      ),
    );
  }

  Widget _buildChatHeader() {
    return Container(
      margin: const EdgeInsets.fromLTRB(16, 10, 16, 0),
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(22),
        boxShadow: [
          BoxShadow(
            color: mascotGreen.withOpacity(0.08),
            blurRadius: 14,
            offset: const Offset(0, 4),
          ),
        ],
      ),
      child: Row(
        children: [
          Container(
            width: 54,
            height: 54,
            decoration: BoxDecoration(
              gradient: const LinearGradient(
                colors: [mascotGreen, mascotDarkGreen],
              ),
              borderRadius: BorderRadius.circular(18),
            ),
            child: const Icon(
              Icons.smart_toy_rounded,
              color: Colors.white,
              size: 30,
            ),
          ),
          const SizedBox(width: 14),
          const Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  'MASCOT AI',
                  style: TextStyle(
                    color: mascotDarkGreen,
                    fontSize: 24,
                    fontWeight: FontWeight.w800,
                    height: 1.08,
                  ),
                ),
                SizedBox(height: 3),
                Text(
                  'Private health assistant',
                  style: TextStyle(
                    color: Colors.black54,
                    fontSize: 13,
                    fontWeight: FontWeight.w500,
                  ),
                ),
              ],
            ),
          ),
          GestureDetector(
            onTap: _showPrivacyInfo,
            child: Container(
              padding: const EdgeInsets.symmetric(horizontal: 14),
              height: 44,
              decoration: BoxDecoration(
                color: mascotSoftGreen,
                borderRadius: BorderRadius.circular(14),
              ),
              child: const Row(
                mainAxisSize: MainAxisSize.min,
                children: [
                  CircleAvatar(
                    radius: 4,
                    backgroundColor: Colors.green,
                  ),
                  SizedBox(width: 8),
                  Text(
                    'Online',
                    style: TextStyle(
                      color: mascotDarkGreen,
                      fontSize: 14,
                      fontWeight: FontWeight.w700,
                    ),
                  ),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildPrivacyBanner() {
    return Container(
      margin: const EdgeInsets.fromLTRB(16, 10, 16, 0),
      padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 11),
      decoration: BoxDecoration(
        color: mascotSoftGreen,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: mascotGreen.withOpacity(0.25)),
      ),
      child: const Row(
        children: [
          Icon(Icons.lock_rounded, size: 17, color: mascotDarkGreen),
          SizedBox(width: 8),
          Expanded(
            child: Text(
              'Private & anonymous — no personal data stored',
              style: TextStyle(
                fontSize: 12,
                color: mascotDarkGreen,
                fontWeight: FontWeight.w700,
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildSuggestions() {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.fromLTRB(16, 4, 16, 10),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text(
            'Popular questions',
            style: TextStyle(
              fontSize: 12,
              color: AppColors.textSecondary,
              fontWeight: FontWeight.w700,
            ),
          ),
          const SizedBox(height: 9),
          SingleChildScrollView(
            scrollDirection: Axis.horizontal,
            child: Row(
              children: _suggestions
                  .map(
                    (s) => Padding(
                      padding: const EdgeInsets.only(right: 8),
                      child: GestureDetector(
                        onTap: () => _sendMessage(s),
                        child: Container(
                          constraints: const BoxConstraints(maxWidth: 210),
                          padding: const EdgeInsets.symmetric(
                            horizontal: 13,
                            vertical: 9,
                          ),
                          decoration: BoxDecoration(
                            color: Colors.white,
                            borderRadius: BorderRadius.circular(18),
                            border: Border.all(
                              color: mascotGreen.withOpacity(0.35),
                            ),
                            boxShadow: [
                              BoxShadow(
                                color: mascotGreen.withOpacity(0.06),
                                blurRadius: 8,
                                offset: const Offset(0, 2),
                              ),
                            ],
                          ),
                          child: Text(
                            s,
                            overflow: TextOverflow.ellipsis,
                            style: const TextStyle(
                              fontSize: 12,
                              color: mascotDarkGreen,
                              fontWeight: FontWeight.w700,
                            ),
                          ),
                        ),
                      ),
                    ),
                  )
                  .toList(),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildTypingIndicator() {
    return Padding(
      padding: const EdgeInsets.only(bottom: 12),
      child: Row(
        children: [
          _AvatarBubble(),
          const SizedBox(width: 8),
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(16).copyWith(
                topLeft: const Radius.circular(4),
              ),
              boxShadow: [
                BoxShadow(
                  color: mascotGreen.withOpacity(0.08),
                  blurRadius: 8,
                  offset: const Offset(0, 2),
                ),
              ],
            ),
            child: Row(
              mainAxisSize: MainAxisSize.min,
              children: [
                _TypingDot(delay: const Duration(milliseconds: 0)),
                const SizedBox(width: 4),
                _TypingDot(delay: const Duration(milliseconds: 200)),
                const SizedBox(width: 4),
                _TypingDot(delay: const Duration(milliseconds: 400)),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildInputArea() {
    return Container(
      padding: const EdgeInsets.fromLTRB(16, 10, 16, 14),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: const BorderRadius.only(
          topLeft: Radius.circular(24),
          topRight: Radius.circular(24),
        ),
        boxShadow: [
          BoxShadow(
            color: mascotGreen.withOpacity(0.10),
            blurRadius: 18,
            offset: const Offset(0, -4),
          ),
        ],
      ),
      child: Row(
        children: [
          Expanded(
            child: TextField(
              controller: _controller,
              maxLines: null,
              textCapitalization: TextCapitalization.sentences,
              decoration: InputDecoration(
                hintText: 'Ask about your health...',
                hintStyle: const TextStyle(
                  color: AppColors.textLight,
                  fontSize: 14,
                ),
                border: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(24),
                  borderSide: BorderSide(color: AppColors.divider),
                ),
                enabledBorder: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(24),
                  borderSide: BorderSide(color: AppColors.divider),
                ),
                focusedBorder: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(24),
                  borderSide: const BorderSide(color: mascotGreen),
                ),
                contentPadding: const EdgeInsets.symmetric(
                  horizontal: 16,
                  vertical: 10,
                ),
                filled: true,
                fillColor: mascotSoftGreen.withOpacity(0.45),
              ),
              onSubmitted: _sendMessage,
            ),
          ),
          const SizedBox(width: 10),
          GestureDetector(
            onTap: () => _sendMessage(_controller.text),
            child: AnimatedContainer(
              duration: const Duration(milliseconds: 200),
              width: 46,
              height: 46,
              decoration: BoxDecoration(
                color: _isTyping ? AppColors.textLight : mascotGreen,
                borderRadius: BorderRadius.circular(16),
              ),
              child: Icon(
                _isTyping ? Icons.hourglass_empty_rounded : Icons.send_rounded,
                color: Colors.white,
                size: 20,
              ),
            ),
          ),
        ],
      ),
    );
  }

  void _showPrivacyInfo() {
    showModalBottomSheet(
      context: context,
      backgroundColor: Colors.white,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(22)),
      ),
      builder: (_) => Padding(
        padding: const EdgeInsets.all(24),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            const Icon(Icons.lock_rounded, size: 40, color: mascotGreen),
            const SizedBox(height: 12),
            const Text(
              'Privacy First',
              style: TextStyle(fontSize: 18, fontWeight: FontWeight.w800),
            ),
            const SizedBox(height: 8),
            const Text(
              'MASCOT AI gives general health education only. For personal medical advice, visit a clinic or speak to a counsellor.',
              textAlign: TextAlign.center,
              style: TextStyle(color: AppColors.textSecondary, height: 1.5),
            ),
            const SizedBox(height: 16),
            SizedBox(
              width: double.infinity,
              height: 46,
              child: ElevatedButton(
                onPressed: () => Navigator.pop(context),
                style: ElevatedButton.styleFrom(
                  backgroundColor: mascotGreen,
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(14),
                  ),
                ),
                child: const Text(
                  'Got it',
                  style: TextStyle(fontWeight: FontWeight.w800),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class _MessageBubble extends StatelessWidget {
  final ChatMessage message;

  const _MessageBubble({required this.message});

  static const Color mascotGreen = Color(0xFF93C962);
  static const Color mascotDarkGreen = Color(0xFF76A44E);

  @override
  Widget build(BuildContext context) {
    final isUser = message.isUser;

    return Padding(
      padding: const EdgeInsets.only(bottom: 12),
      child: Row(
        mainAxisAlignment:
            isUser ? MainAxisAlignment.end : MainAxisAlignment.start,
        crossAxisAlignment: CrossAxisAlignment.end,
        children: [
          if (!isUser) ...[
            _AvatarBubble(),
            const SizedBox(width: 8),
          ],
          Flexible(
            child: Container(
              constraints: BoxConstraints(
                maxWidth: MediaQuery.of(context).size.width * 0.76,
              ),
              padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 11),
              decoration: BoxDecoration(
                color: isUser ? mascotGreen : Colors.white,
                borderRadius: BorderRadius.circular(18).copyWith(
                  bottomLeft: Radius.circular(isUser ? 18 : 4),
                  bottomRight: Radius.circular(isUser ? 4 : 18),
                ),
                boxShadow: [
                  BoxShadow(
                    color: mascotGreen.withOpacity(0.08),
                    blurRadius: 8,
                    offset: const Offset(0, 2),
                  ),
                ],
              ),
              child: Text(
                message.content,
                style: TextStyle(
                  color: isUser ? Colors.white : AppColors.textPrimary,
                  fontSize: 14,
                  height: 1.5,
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }
}

class _AvatarBubble extends StatelessWidget {
  static const Color mascotGreen = Color(0xFF93C962);
  static const Color mascotDarkGreen = Color(0xFF76A44E);

  @override
  Widget build(BuildContext context) {
    return Container(
      width: 32,
      height: 32,
      decoration: BoxDecoration(
        gradient: const LinearGradient(
          colors: [mascotGreen, mascotDarkGreen],
        ),
        borderRadius: BorderRadius.circular(11),
      ),
      child: const Icon(
        Icons.smart_toy_rounded,
        size: 18,
        color: Colors.white,
      ),
    );
  }
}

class _TypingDot extends StatefulWidget {
  final Duration delay;

  const _TypingDot({required this.delay});

  @override
  State<_TypingDot> createState() => _TypingDotState();
}

class _TypingDotState extends State<_TypingDot>
    with SingleTickerProviderStateMixin {
  late AnimationController _ctrl;
  late Animation<double> _anim;

  static const Color mascotGreen = Color(0xFF93C962);

  @override
  void initState() {
    super.initState();

    _ctrl = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 600),
    );

    _anim = Tween<double>(begin: 0, end: 1).animate(
      CurvedAnimation(parent: _ctrl, curve: Curves.easeInOut),
    );

    Future.delayed(widget.delay, () {
      if (mounted) _ctrl.repeat(reverse: true);
    });
  }

  @override
  void dispose() {
    _ctrl.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return AnimatedBuilder(
      animation: _anim,
      builder: (_, __) => Container(
        width: 8,
        height: 8,
        decoration: BoxDecoration(
          color: Color.lerp(AppColors.textLight, mascotGreen, _anim.value),
          shape: BoxShape.circle,
        ),
      ),
    );
  }
}
