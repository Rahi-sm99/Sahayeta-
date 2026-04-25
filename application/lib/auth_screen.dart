import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:supabase_flutter/supabase_flutter.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:lucide_icons/lucide_icons.dart';
import 'register_screen.dart';
import 'home_screen.dart';

class AuthScreen extends StatelessWidget {
  const AuthScreen({super.key});

  Future<void> _handleGoogleSignIn(BuildContext context) async {
    try {
      final supabase = Supabase.instance.client;
      
      // Step 1: Sign in with Google
      await supabase.auth.signInWithOAuth(
        OAuthProvider.google,
        redirectTo: 'com.sahayeta.application://login-callback',
      );

      // Listen for auth state changes to verify approval once logged in
      supabase.auth.onAuthStateChange.listen((data) async {
        final session = data.session;
        if (session != null) {
          final email = session.user.email;
          
          // Step 2: Check approval status in volunteers table
          final volData = await supabase
              .from('volunteers')
              .select()
              .eq('email', email!)
              .maybeSingle();

          if (volData == null || volData['status'] != 'approved') {
            await supabase.auth.signOut();
            if (context.mounted) {
              _showError(context, 'ACCESS DENIED: Your volunteer status is: ${volData?['status'] ?? 'Not Found'}. Please wait for admin approval.');
            }
          } else {
            // Step 3: Proceed to Home if approved
            if (context.mounted) {
              Navigator.of(context).pushReplacement(
                MaterialPageRoute(builder: (context) => const HomeScreen()),
              );
            }
          }
        }
      });
    } catch (e) {
      if (context.mounted) {
        _showError(context, 'Auth Error: $e');
      }
    }
  }

  void _showError(BuildContext context, String message) {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text(message),
        backgroundColor: Colors.redAccent,
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Stack(
        children: [
          Positioned.fill(
            child: Container(color: Colors.black),
          ),
          SafeArea(
            child: Padding(
              padding: const EdgeInsets.symmetric(horizontal: 30.0),
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                crossAxisAlignment: CrossAxisAlignment.stretch,
                children: [
                  const Icon(LucideIcons.shield, color: Color(0xFFFF9933), size: 64)
                    .animate()
                    .fadeIn()
                    .scale(duration: 600.ms, curve: Curves.easeOutBack),
                  const SizedBox(height: 24),
                  Text(
                    'VOLUNTEER PORTAL',
                    textAlign: TextAlign.center,
                    style: GoogleFonts.outfit(
                      fontSize: 28,
                      fontWeight: FontWeight.w500,
                      letterSpacing: -1,
                      color: Colors.white,
                    ),
                  ).animate().fadeIn(delay: 200.ms),
                  Text(
                    'Join the mission to save lives',
                    textAlign: TextAlign.center,
                    style: GoogleFonts.outfit(
                      fontSize: 16,
                      color: Colors.white.withOpacity(0.5),
                    ),
                  ).animate().fadeIn(delay: 400.ms),
                  const SizedBox(height: 60),
                  
                  // Sign In Button
                  _buildButton(
                    context: context,
                    label: 'SIGN IN AS VOLUNTEER',
                    icon: LucideIcons.logIn,
                    color: const Color(0xFFFF9933),
                    textColor: Colors.black,
                    onTap: () => _handleGoogleSignIn(context),
                  ).animate().fadeIn(delay: 600.ms).slideX(begin: 0.1, end: 0),
                  
                  const SizedBox(height: 20),
                  
                  // Register Button
                  _buildButton(
                    context: context,
                    label: 'REGISTER AS VOLUNTEER',
                    icon: LucideIcons.userPlus,
                    color: Colors.white.withOpacity(0.05),
                    borderColor: Colors.white.withOpacity(0.1),
                    textColor: Colors.white,
                    onTap: () {
                      Navigator.push(
                        context,
                        MaterialPageRoute(builder: (context) => const RegisterScreen()),
                      );
                    },
                  ).animate().fadeIn(delay: 800.ms).slideX(begin: 0.1, end: 0),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildButton({
    required BuildContext context,
    required String label,
    required IconData icon,
    required Color color,
    Color? borderColor,
    required Color textColor,
    required VoidCallback onTap,
  }) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        height: 60,
        decoration: BoxDecoration(
          color: color,
          borderRadius: BorderRadius.circular(16),
          border: borderColor != null ? Border.all(color: borderColor) : null,
          boxShadow: color == const Color(0xFFFF9933) ? [
            BoxShadow(
              color: color.withOpacity(0.3),
              blurRadius: 20,
              offset: const Offset(0, 10),
            )
          ] : null,
        ),
        child: Row(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(icon, color: textColor, size: 20),
            const SizedBox(width: 12),
            Text(
              label,
              style: GoogleFonts.outfit(
                fontSize: 14,
                fontWeight: FontWeight.w500,
                letterSpacing: 1,
                color: textColor,
              ),
            ),
          ],
        ),
      ),
    );
  }
}
