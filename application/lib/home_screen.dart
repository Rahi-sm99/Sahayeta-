import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:supabase_flutter/supabase_flutter.dart';
import 'package:lucide_icons/lucide_icons.dart';

class HomeScreen extends StatelessWidget {
  const HomeScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final user = Supabase.instance.client.auth.currentUser;

    return Scaffold(
      appBar: AppBar(
        backgroundColor: Colors.transparent,
        elevation: 0,
        title: Text('SAHAYETA COMMAND', style: GoogleFonts.outfit(fontSize: 14, letterSpacing: 2)),
        actions: [
          IconButton(
            icon: const Icon(LucideIcons.logOut, size: 20),
            onPressed: () async {
              await Supabase.instance.client.auth.signOut();
              if (context.mounted) Navigator.of(context).pushReplacementNamed('/');
            },
          ),
        ],
      ),
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            const Icon(LucideIcons.checkCircle2, color: Color(0xFFFF9933), size: 64),
            const SizedBox(height: 24),
            Text(
              'WELCOME, AGENT',
              style: GoogleFonts.outfit(fontSize: 24, fontWeight: FontWeight.w600),
            ),
            Text(
              user?.email ?? '',
              style: GoogleFonts.outfit(color: Colors.white.withOpacity(0.5)),
            ),
            const SizedBox(height: 40),
            Container(
              padding: const EdgeInsets.all(30),
              margin: const EdgeInsets.symmetric(horizontal: 30),
              decoration: BoxDecoration(
                color: Colors.white.withOpacity(0.05),
                borderRadius: BorderRadius.circular(24),
                border: Border.all(color: Colors.white.withOpacity(0.1)),
              ),
              child: const Text(
                'YOUR MISSION DASHBOARD IS BEING INITIALIZED. STAY ALERT FOR FIELD ASSIGNMENTS.',
                textAlign: TextAlign.center,
                style: TextStyle(fontSize: 12, height: 1.5, letterSpacing: 1),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
