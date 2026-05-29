import 'package:flutter/material.dart';
import '../screens/sign_in_screen.dart';

class MascotHeader extends StatefulWidget {
  const MascotHeader({super.key});

  @override
  State<MascotHeader> createState() => _MascotHeaderState();
}

class _MascotHeaderState extends State<MascotHeader> {
  static const Color mascotGreen = Color(0xFF93C962);
  static const Color mascotDarkGreen = Color(0xFF76A44E);

  void _showAccountMenu() {
    showDialog(
      context: context,
      barrierColor: Colors.black.withOpacity(0.35),
      builder: (_) {
        return Dialog(
          backgroundColor: Colors.white,
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(22),
          ),
          child: ValueListenableBuilder<String?>(
            valueListenable: AuthSession.username,
            builder: (context, username, __) {
              final loggedIn = username != null && username.isNotEmpty;

              return Padding(
                padding: const EdgeInsets.all(20),
                child: Column(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    Icon(
                      Icons.account_circle_outlined,
                      size: 58,
                      color: loggedIn ? mascotGreen : mascotDarkGreen,
                    ),
                    const SizedBox(height: 10),
                    Text(
                      loggedIn ? username : 'Account',
                      overflow: TextOverflow.ellipsis,
                      style: const TextStyle(
                        fontSize: 18,
                        fontWeight: FontWeight.w800,
                        color: mascotDarkGreen,
                      ),
                    ),
                    const SizedBox(height: 18),
                    if (!loggedIn) ...[
                      _MenuButton(
                        label: 'Login',
                        filled: true,
                        onTap: () {
                          Navigator.pop(context);
                          Navigator.push(
                            context,
                            MaterialPageRoute(
                              builder: (_) => const SignInScreen(),
                            ),
                          );
                        },
                      ),
                      const SizedBox(height: 10),
                      _MenuButton(
                        label: 'Sign up',
                        filled: false,
                        onTap: () {
                          Navigator.pop(context);
                          Navigator.push(
                            context,
                            MaterialPageRoute(
                              builder: (_) => const SignUpScreen(),
                            ),
                          );
                        },
                      ),
                    ] else
                      _MenuButton(
                        label: 'Logout',
                        filled: false,
                        onTap: () {
                          AuthSession.logout();
                          Navigator.pop(context);
                        },
                      ),
                  ],
                ),
              );
            },
          ),
        );
      },
    );
  }

  @override
  Widget build(BuildContext context) {
    return SliverAppBar(
      expandedHeight: 82,
      floating: false,
      pinned: true,
      backgroundColor: Colors.white,
      surfaceTintColor: Colors.white,
      elevation: 0,
      flexibleSpace: FlexibleSpaceBar(
        background: Container(
          color: Colors.white,
          child: SafeArea(
            child: Padding(
              padding: const EdgeInsets.fromLTRB(14, 10, 14, 8),
              child: Row(
                children: [
                  Expanded(
                    child: Row(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        Flexible(
                          child: Image.asset(
                            'assets/left.png',
                            height: 68,
                            fit: BoxFit.contain,
                          ),
                        ),
                        const SizedBox(width: 3),
                        Flexible(
                          child: Image.asset(
                            'assets/right.png',
                            height: 34,
                            fit: BoxFit.contain,
                          ),
                        ),
                      ],
                    ),
                  ),
                  Row(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      InkWell(
                        borderRadius: BorderRadius.circular(10),
                        onTap: () {
                          ScaffoldMessenger.of(context).showSnackBar(
                            const SnackBar(
                              content: Text('Feature coming soon'),
                              duration: Duration(seconds: 2),
                            ),
                          );
                        },
                        child: Padding(
                          padding: const EdgeInsets.symmetric(
                            horizontal: 9,
                            vertical: 7,
                          ),
                          child: Text(
                            'SN',
                            style: TextStyle(
                              color: mascotGreen,
                              fontWeight: FontWeight.w700,
                              fontSize: 12,
                            ),
                          ),
                        ),
                      ),
                      Container(
                        padding: const EdgeInsets.symmetric(
                          horizontal: 9,
                          vertical: 7,
                        ),
                        decoration: BoxDecoration(
                          color: mascotGreen,
                          borderRadius: BorderRadius.circular(10),
                        ),
                        child: const Text(
                          'EN',
                          style: TextStyle(
                            color: Colors.white,
                            fontWeight: FontWeight.w700,
                            fontSize: 12,
                          ),
                        ),
                      ),
                      const SizedBox(width: 6),
                      GestureDetector(
                        onTap: _showAccountMenu,
                        child: ValueListenableBuilder<String?>(
                          valueListenable: AuthSession.username,
                          builder: (context, username, _) {
                            return SizedBox(
                              width: 42,
                              child: Column(
                                mainAxisSize: MainAxisSize.min,
                                children: [
                                  const Icon(
                                    Icons.account_circle_outlined,
                                    color: mascotDarkGreen,
                                    size: 27,
                                  ),
                                  if (username != null && username.isNotEmpty)
                                    Text(
                                      username,
                                      maxLines: 1,
                                      overflow: TextOverflow.ellipsis,
                                      textAlign: TextAlign.center,
                                      style: const TextStyle(
                                        color: mascotDarkGreen,
                                        fontSize: 8,
                                        fontWeight: FontWeight.w700,
                                      ),
                                    ),
                                ],
                              ),
                            );
                          },
                        ),
                      ),
                    ],
                  ),
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }
}

class _MenuButton extends StatelessWidget {
  final String label;
  final bool filled;
  final VoidCallback onTap;

  const _MenuButton({
    required this.label,
    required this.filled,
    required this.onTap,
  });

  static const Color mascotGreen = Color(0xFF93C962);
  static const Color mascotDarkGreen = Color(0xFF76A44E);

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      width: double.infinity,
      height: 48,
      child: GestureDetector(
        onTap: onTap,
        child: Container(
          alignment: Alignment.center,
          decoration: BoxDecoration(
            color: filled ? mascotGreen : Colors.transparent,
            borderRadius: BorderRadius.circular(14),
            border: Border.all(color: mascotGreen, width: 1.4),
          ),
          child: Text(
            label,
            style: TextStyle(
              color: filled ? Colors.white : mascotDarkGreen,
              fontWeight: FontWeight.w800,
            ),
          ),
        ),
      ),
    );
  }
}
