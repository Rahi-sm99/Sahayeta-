import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ynptsqackqcxwygpehfj.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlucHRzcWFja3FjeHd5Z3BlaGZqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzcyNTI3NTEsImV4cCI6MjA5MjgyODc1MX0.SsrhlEkq6O5xilxf11iZsYUsdjyi-RkYTjORFDJD8qw';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
