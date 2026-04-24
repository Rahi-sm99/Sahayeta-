import 'package:flutter/material.dart';
import 'package:supabase_flutter/supabase_flutter.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'auth_screen.dart';
import 'home_screen.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  
  await Supabase.initialize(
    url: 'https://ynptsqackqcxwygpehfj.supabase.co',
    anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlucHRzcWFja3FjeHd5Z3BlaGZqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzcyNTI3NTEsImV4cCI6MjA5MjgyODc1MX0.SsrhlEkq6O5xilxf11iZsYUsdjyi-RkYTjORFDJD8qw',
  );

  runApp(const SahayetaApp());
}

class SahayetaApp extends StatelessWidget {
  const SahayetaApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Sahayeta',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        brightness: Brightness.dark,
        scaffoldBackgroundColor: const Color(0xFF000000),
        textTheme: GoogleFonts.outfitTextTheme(ThemeData.dark().textTheme),
        primaryColor: const Color(0xFFFF9933),
      ),
      home: const SplashScreen(),
    );
  }
}

class SplashScreen extends StatefulWidget {
  const SplashScreen({super.key});

  @override
  State<SplashScreen> createState() => _SplashScreenState();
}

class _SplashScreenState extends State<SplashScreen> {
  @override
  void initState() {
    super.initState();
    _navigateToNext();
  }

  _navigateToNext() async {
    await Future.delayed(const Duration(seconds: 4));
    if (mounted) {
      Navigator.of(context).pushReplacement(
        MaterialPageRoute(builder: (context) => const AuthScreen()),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Stack(
        children: [
          // Background Mesh simulation
          Positioned.fill(
            child: Opacity(
              opacity: 0.3,
              child: Container(
                decoration: BoxDecoration(
                  gradient: RadialGradient(
                    colors: [
                      const Color(0xFFFF9933).withOpacity(0.1),
                      Colors.transparent,
                    ],
                    center: const Alignment(0.5, 0.5),
                    radius: 1.5,
                  ),
                ),
              ),
            ),
          ),
          Center(
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Text(
                  'सहायता',
                  style: GoogleFonts.notoSansDevanagari(
                    fontSize: 72,
                    fontWeight: FontWeight.w900,
                    color: Colors.white,
                    letterSpacing: 8,
                  ),
                ).animate()
                  .fadeIn(duration: 1200.ms)
                  .blur(begin: const Offset(10, 10), end: Offset.zero, duration: 1200.ms)
                  .slideY(begin: 0.2, end: 0, curve: Curves.easeOut),
                const SizedBox(height: 16),
                Text(
                  'EMPOWERING NGO MISSION MATCHING',
                  textAlign: TextAlign.center,
                  style: GoogleFonts.outfit(
                    fontSize: 14,
                    letterSpacing: 4,
                    color: Colors.white.withOpacity(0.5),
                    fontWeight: FontWeight.w500,
                  ),
                ).animate()
                  .fadeIn(delay: 800.ms, duration: 1000.ms),
              ],
            ),
          ),
          // Animated Line
          Align(
            alignment: Alignment.bottomCenter,
            child: Padding(
              padding: const EdgeInsets.only(bottom: 60.0),
              child: Container(
                width: 200,
                height: 1,
                decoration: BoxDecoration(
                  gradient: LinearGradient(
                    colors: [
                      Colors.transparent,
                      Colors.white.withOpacity(0.3),
                      Colors.transparent,
                    ],
                  ),
                ),
              ).animate()
                .scaleX(begin: 0, end: 1, duration: 2000.ms, curve: Curves.easeInOut),
            ),
          ),
        ],
      ),
    );
  }
}
