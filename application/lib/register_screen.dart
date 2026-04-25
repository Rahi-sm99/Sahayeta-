import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:supabase_flutter/supabase_flutter.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:lucide_icons/lucide_icons.dart';

class RegisterScreen extends StatefulWidget {
  const RegisterScreen({super.key});

  @override
  State<RegisterScreen> createState() => _RegisterScreenState();
}

class _RegisterScreenState extends State<RegisterScreen> {
  final _formKey = GlobalKey<FormState>();
  bool _isLoading = false;

  final TextEditingController _nameController = TextEditingController();
  final TextEditingController _emailController = TextEditingController();
  final TextEditingController _phoneController = TextEditingController();
  final TextEditingController _skillsController = TextEditingController();
  final TextEditingController _daysController = TextEditingController();
  final TextEditingController _expController = TextEditingController();

  Future<void> _submitForm() async {
    if (!_formKey.currentState!.validate()) return;

    setState(() => _isLoading = true);
    try {
      final supabase = Supabase.instance.client;
      await supabase.from('volunteers').insert([{
        'name': _nameController.text,
        'email': _emailController.text,
        'phone': _phoneController.text,
        'skills': _skillsController.text.split(',').map((s) => s.trim()).join('|'),
        'availability_days': _daysController.text.split(',').map((s) => s.trim()).join('|'),
        'experience': _expController.text,
        'status': 'pending',
      }]);

      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Application submitted successfully!')),
        );
        Navigator.pop(context);
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Submission Error: $e')),
        );
      }
    } finally {
      if (mounted) setState(() => _isLoading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        backgroundColor: Colors.transparent,
        elevation: 0,
        title: Text('BECOME A VOLUNTEER', style: GoogleFonts.outfit(fontSize: 14, letterSpacing: 2)),
        centerTitle: true,
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(30.0),
        child: Form(
          key: _formKey,
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              _buildField('Full Name', _nameController, LucideIcons.user),
              _buildField('Email Address', _emailController, LucideIcons.mail, keyboardType: TextInputType.emailAddress),
              _buildField('Phone Number', _phoneController, LucideIcons.phone, keyboardType: TextInputType.phone),
              _buildField('Skills (e.g., Medical, Rescue)', _skillsController, LucideIcons.zap),
              _buildField('Availability (e.g., Weekends)', _daysController, LucideIcons.calendar),
              _buildField('Years of Experience', _expController, LucideIcons.briefcase),
              
              const SizedBox(height: 40),
              
              ElevatedButton(
                onPressed: _isLoading ? null : _submitForm,
                style: ElevatedButton.styleFrom(
                  backgroundColor: const Color(0xFFFF9933),
                  foregroundColor: Colors.black,
                  padding: const EdgeInsets.symmetric(vertical: 20),
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                  elevation: 0,
                ),
                child: _isLoading 
                  ? const SizedBox(width: 20, height: 20, child: CircularProgressIndicator(strokeWidth: 2, color: Colors.black))
                  : Text('SUBMIT APPLICATION', style: GoogleFonts.outfit(fontWeight: FontWeight.w600, letterSpacing: 1)),
              ).animate().fadeIn(delay: 500.ms),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildField(String label, TextEditingController controller, IconData icon, {TextInputType? keyboardType}) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 24.0),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(label, style: GoogleFonts.outfit(fontSize: 12, color: Colors.white.withOpacity(0.5), letterSpacing: 1)),
          const SizedBox(height: 10),
          TextFormField(
            controller: controller,
            keyboardType: keyboardType,
            style: GoogleFonts.outfit(fontSize: 16, color: Colors.white, fontWeight: FontWeight.w400),
            decoration: InputDecoration(
              prefixIcon: Icon(icon, size: 18, color: const Color(0xFFFF9933)),
              filled: true,
              fillColor: Colors.white.withOpacity(0.05),
              border: OutlineInputBorder(borderRadius: BorderRadius.circular(12), borderSide: BorderSide.none),
              contentPadding: const EdgeInsets.symmetric(horizontal: 20, vertical: 18),
            ),
            validator: (v) => v!.isEmpty ? 'Field required' : null,
          ),
        ],
      ),
    ).animate().fadeIn().slideY(begin: 0.05, end: 0);
  }
}
