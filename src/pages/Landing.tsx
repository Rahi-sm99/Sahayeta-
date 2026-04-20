/**
 * Sahayeta Landing Page
 * 
 * A premium AI-driven GIS platform for humanitarian aid coordination.
 * Features:
 * - Real-time GIS Mapping & Deployment Simulation
 * - AI Urgency Scoring & Smart Resource Allocation
 * - NGO Mission Broadcasting & Volunteer Enrollment
 * - Live Impact Analytics & Dashboard
 */
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import LottieImport from 'lottie-react';
const Lottie = (LottieImport as any).default || LottieImport;
import welcomeAnimation from '../assets/Animation - 1699325091268.json';
import uploadingAnimation from '../assets/uploading (1).json';
import { useCountUp } from '../hooks/useCountUp';
import { useRealtimeTasks } from '../hooks/useRealtimeTasks';
import { useRealtimeVolunteers } from '../hooks/useRealtimeVolunteers';
import { useApp } from '../context/AppContext';
import SahayetaMap from '../components/map/SahayetaMap';
import { rankVolunteers } from '../lib/matching';
import { supabase } from '../lib/supabase';
import { 
  Brain, 
  CheckCircle2, 
  XCircle,
  Target,
  User,
  LogOut,
  Shield,
  Briefcase,
  Users,
  ClipboardList,
  MapPin,
  Phone,
  Mail,
  Camera,
  Plus,
  Zap,
  Clock,
  Globe,
  ChevronDown,
  ChevronUp,
  Play,
  Navigation
} from 'lucide-react';
import type { Volunteer, MatchResult, Task } from '../types';

export function Landing() {
  const { state, dispatch } = useApp();
  const { tasks: localTasks } = useRealtimeTasks(state.user?.id);
  const { volunteers: localVolunteers } = useRealtimeVolunteers(state.user?.id);
  
  const [activeSection, setActiveSection] = useState<'home' | 'ai-engine' | 'matching' | 'simulation' | 'compare' | 'volunteer-form' | 'ngo-tasks' | 'volunteer-list' | 'assigned-tasks' | 'manage-admins' | 'login-portal'>('home');
  const [isUploading, setIsUploading] = useState(false);
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [aiExpandedTaskId, setAiExpandedTaskId] = useState<string | null>(null);
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShowSplash(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  const isAdmin = state.user?.role === 'admin' || state.user?.email === 'spandanmondal15@gmail.com';
  const isVolunteer = state.user?.role === 'volunteer';

  const handleManualLogin = (role: 'admin' | 'volunteer') => {
    if (role === 'admin' && loginEmail === 'admin123@gmail.com' && loginPassword === 'admin123') {
      dispatch({ type: 'SET_USER', payload: { id: 'admin-hardcoded', email: loginEmail, role: 'admin', user_metadata: { full_name: 'System Admin' } } });
      setActiveSection('volunteer-list');
    } else if (role === 'volunteer' && loginEmail === 'volunteer123@gmail.com' && loginPassword === 'volunteer123') {
      dispatch({ type: 'SET_USER', payload: { id: 'vol-hardcoded', email: loginEmail, role: 'volunteer', user_metadata: { full_name: 'Test Volunteer' } } });
      setActiveSection('home');
    } else {
      alert('Invalid test credentials. Please use: admin123@gmail.com / admin123 or volunteer123@gmail.com / volunteer123');
    }
  };

  // Mock data for public demonstration
  const publicMockTasks: Task[] = [
    { task_id: 'M-001', ngo_name: 'Health First', location: 'Delhi', requirements: 'Medical Aid & Vaccines', priority: 'High', status: 'open', severity_score: 85, latitude: 28.6139, longitude: 77.2090, required_skills: ['Medical'], required_days: ['All'] },
    { task_id: 'M-002', ngo_name: 'Teach Mission', location: 'Mumbai', requirements: 'Rescue Support & Education', priority: 'Critical', status: 'open', severity_score: 95, latitude: 19.0760, longitude: 72.8777, required_skills: ['Rescue'], required_days: ['Weekend'] },
    { task_id: 'M-003', ngo_name: 'Green Earth', location: 'Bangalore', requirements: 'Sanitation & Water', priority: 'Medium', status: 'open', severity_score: 65, latitude: 12.9716, longitude: 77.5946, required_skills: ['Sanitation'], required_days: ['Mon-Fri'] },
    { task_id: 'M-004', ngo_name: 'Food For All', location: 'Kolkata', requirements: 'Dry Rations & Logistics', priority: 'High', status: 'open', severity_score: 80, latitude: 22.5726, longitude: 88.3639, required_skills: ['Logistics'], required_days: ['All'] },
    { task_id: 'M-005', ngo_name: 'Shelter Plus', location: 'Chennai', requirements: 'Temporary Housing', priority: 'Medium', status: 'open', severity_score: 70, latitude: 13.0827, longitude: 80.2707, required_skills: ['Shelter'], required_days: ['Immediate'] }
  ];

  const publicMockVolunteers: Volunteer[] = [
    { volunteer_id: 'V-001', name: 'Rahul Sharma', email: 'rahul@demo.com', skills: ['Medical', 'First Aid'], availability: 'All Days', experience_years: 5, status: 'available', latitude: 8.5241, longitude: 76.9366 }, // Trivandrum (South)
    { volunteer_id: 'V-002', name: 'Priya Singh', email: 'priya@demo.com', skills: ['Rescue', 'Logistics'], availability: 'Weekends', experience_years: 3, status: 'available', latitude: 34.0837, longitude: 74.7973 }, // Srinagar (North)
    { volunteer_id: 'V-003', name: 'Amit Patel', email: 'amit@demo.com', skills: ['Sanitation', 'Water'], availability: 'Mon-Fri', experience_years: 4, status: 'available', latitude: 23.0225, longitude: 72.5714 }, // Ahmedabad (West)
    { volunteer_id: 'V-004', name: 'Sneha Rao', email: 'sneha@demo.com', skills: ['Shelter', 'Cooking'], availability: 'Immediate', experience_years: 2, status: 'available', latitude: 26.1445, longitude: 91.7362 }, // Guwahati (East)
    { volunteer_id: 'V-005', name: 'Vikram Das', email: 'vikram@demo.com', skills: ['Rescue', 'Medical'], availability: 'All Days', experience_years: 6, status: 'available', latitude: 21.1458, longitude: 79.0882 }  // Nagpur (Center)
  ];

  // Demo NGO tasks for the logged-out matching panel (rich descriptions)
  const demoNGOTasks = [
    {
      id: 'NGO-001',
      ngoName: 'Health First NGO',
      location: 'Delhi, Zone A',
      description: 'Emergency medical aid for flood-affected families. Volunteer doctors and first-aiders needed for on-ground vaccination drives.',
      requiredDays: ['All Days', 'Immediate'],
      requiredSkills: ['Medical', 'First Aid'],
      priority: 'Critical',
      latitude: 28.6139, longitude: 77.2090
    },
    {
      id: 'NGO-002',
      ngoName: 'Teach Mission',
      location: 'Mumbai, Zone B',
      description: 'Post-disaster educational support & rescue coordination for displaced children in relief camps. Involve structured learning sessions.',
      requiredDays: ['Weekends', 'Mon-Fri'],
      requiredSkills: ['Teaching', 'Rescue'],
      priority: 'High',
      latitude: 19.0760, longitude: 72.8777
    },
    {
      id: 'NGO-003',
      ngoName: 'Green Earth',
      location: 'Bangalore, Zone C',
      description: 'Water purification and sanitation management in under-resourced colonies. Manual labor and technical know-how required.',
      requiredDays: ['Mon-Fri'],
      requiredSkills: ['Sanitation', 'Water'],
      priority: 'Medium',
      latitude: 12.9716, longitude: 77.5946
    },
    {
      id: 'NGO-004',
      ngoName: 'Food For All',
      location: 'Kolkata, Zone D',
      description: 'Dry ration distribution and logistics management for 2,000+ families. Truck loading, routing, and inventory tracking required.',
      requiredDays: ['All Days'],
      requiredSkills: ['Logistics', 'Cooking'],
      priority: 'High',
      latitude: 22.5726, longitude: 88.3639
    },
    {
      id: 'NGO-005',
      ngoName: 'Shelter Plus',
      location: 'Chennai, Zone E',
      description: 'Temporary housing construction and maintenance support for cyclone survivors. Shelter building, repair, and camp management.',
      requiredDays: ['Immediate', 'Weekends'],
      requiredSkills: ['Shelter', 'First Aid'],
      priority: 'Medium',
      latitude: 13.0827, longitude: 80.2707
    }
  ];

  const displayTasks = (isAdmin || isVolunteer) && localTasks.length > 0 ? localTasks : demoNGOTasks;
  const displayVolunteers = (isAdmin || isVolunteer) && localVolunteers.length > 0 ? localVolunteers : publicMockVolunteers;

  
  // Forms state
  const [volForm, setVolForm] = useState({ name: '', phone: '', email: '', days: '', skills: '', experience: '', photo: '' });
  const [ngoForm, setNgoForm] = useState({ name: '', location: '', phone: '', requirements: '', payment: '' });
  
  const [matchingTaskId, setMatchingTaskId] = useState<string | null>(null);
  const [isMatching, setIsMatching] = useState(false);
  const [animationVol, setAnimationVol] = useState<Volunteer | null>(null);
  const [topMatches, setTopMatches] = useState<MatchResult[]>([]);
  const [selectedVolunteer, setSelectedVolunteer] = useState<MatchResult | null>(null);
  const [appointmentDone, setAppointmentDone] = useState(false);

  // Demo matching panel state (logged-out view)
  const [expandedVolId, setExpandedVolId] = useState<string | null>(null);
  const [expandedTaskId, setExpandedTaskId] = useState<string | null>(null);
  const [demoSelectedTask, setDemoSelectedTask] = useState<string | null>(null);
  const [demoMatchResult, setDemoMatchResult] = useState<{volunteer: typeof publicMockVolunteers[0], task: typeof demoNGOTasks[0], score: number} | null>(null);
  const [isDemoMatching, setIsDemoMatching] = useState(false);
  const [demoMatchStep, setDemoMatchStep] = useState(0);
  const [isLiveSimulating, setIsLiveSimulating] = useState(false);
  const [simVolPos, setSimVolPos] = useState({ x: 15, y: 60 });
  const [simProgress, setSimProgress] = useState(0);
  const simIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const [simComplete, setSimComplete] = useState(false);

  const handleGoogleAuth = async (targetRole: 'admin' | 'volunteer') => {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin
        }
      });
      if (error) throw error;
      localStorage.setItem('targetRole', targetRole);
    } catch (err: any) {
      alert(err.message);
    }
  };

  useEffect(() => {
    const checkRole = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        const email = session.user.email;
        const targetRole = localStorage.getItem('targetRole');
        
        if (targetRole === 'admin' && email !== 'spandanmondal15@gmail.com') {
          alert('ACCESS DENIED: You are not an admin.');
          await supabase.auth.signOut();
          return;
        }
        
        if (targetRole === 'volunteer') {
          // Check if user is in volunteers table and is approved
          const { data: vol } = await supabase
            .from('volunteers')
            .select('*')
            .eq('email', email)
            .single();

          if (!vol || vol.status !== 'approved') {
            alert('ACCESS DENIED: You are not a verified volunteer. Please fill out the volunteer form first or wait for admin approval (Status: ' + (vol?.status || 'Not Found') + ')');
            await supabase.auth.signOut();
            setActiveSection('volunteer-form');
            return;
          }
          
          // Once approved, set the user role in global state
          dispatch({ 
            type: 'SET_USER', 
            payload: { 
              id: session.user.id, 
              email: session.user.email!, 
              role: 'volunteer', 
              is_approved: true 
            } 
          });
        } else if (targetRole === 'admin') {
           dispatch({ 
            type: 'SET_USER', 
            payload: { 
              id: session.user.id, 
              email: session.user.email!, 
              role: 'admin', 
              is_approved: true 
            } 
          });
        }
        localStorage.removeItem('targetRole');
      }
    };
    checkRole();
  }, [state.user]);

  const handleSignOut = async (e: React.MouseEvent) => {
    e.stopPropagation();
    await supabase.auth.signOut();
    setActiveSection('home');
  };

  // Haversine distance in km
  const haversine = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat/2)**2 + Math.cos(lat1*Math.PI/180)*Math.cos(lat2*Math.PI/180)*Math.sin(dLon/2)**2;
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  };

  const handleDemoMatch = () => {
    if (!demoSelectedTask) return;
    setIsDemoMatching(true);
    setDemoMatchResult(null);
    setDemoMatchStep(0);
    setSimComplete(false);
    setIsLiveSimulating(false);

    const task = demoNGOTasks.find(t => t.id === demoSelectedTask);
    if (!task) return;

    let step = 0;
    const stepInterval = setInterval(() => {
      step++;
      setDemoMatchStep(step);
      if (step >= 3) {
        clearInterval(stepInterval);
        // Score each volunteer by skill match + inverse distance
        const scored = publicMockVolunteers.map(v => {
          const skillMatch = task.requiredSkills.filter(s => (v.skills as string[]).includes(s)).length / task.requiredSkills.length;
          const dist = haversine(v.latitude!, v.longitude!, task.latitude, task.longitude);
          const distScore = Math.max(0, 1 - dist / 5000);
          const score = Math.round((skillMatch * 0.6 + distScore * 0.4) * 100);
          return { volunteer: v, score };
        });
        scored.sort((a, b) => b.score - a.score);
        setDemoMatchResult({ volunteer: scored[0].volunteer, task, score: scored[0].score });
        setIsDemoMatching(false);
      }
    }, 700);
  };

  const handleLiveSimulate = () => {
    if (!demoMatchResult) return;
    setIsLiveSimulating(true);
    setSimProgress(0);
    setSimComplete(false);
    setActiveSection('simulation');

    // Coordinate projection logic (same as map markers)
    const getProjection = (lat: number, lon: number) => {
      const x = ((lon - 68.1) / (97.4 - 68.1)) * 100;
      const y = 100 - ((lat - 6.5) / (35.5 - 6.5)) * 100;
      return { x, y };
    };

    const start = getProjection(demoMatchResult.volunteer.latitude!, demoMatchResult.volunteer.longitude!);
    const target = getProjection(demoMatchResult.task.latitude, demoMatchResult.task.longitude);

    setSimVolPos(start);
    let progress = 0;

    if (simIntervalRef.current) clearInterval(simIntervalRef.current);
    simIntervalRef.current = setInterval(() => {
      progress += 1;
      setSimProgress(progress);
      const t = progress / 100;
      setSimVolPos({
        x: start.x + (target.x - start.x) * t,
        y: start.y + (target.y - start.y) * t
      });
      
      if (progress >= 100) {
        clearInterval(simIntervalRef.current!);
        setSimComplete(true);
      }
    }, 50);
  };

  const handleMatch = (taskId: string) => {
    setMatchingTaskId(taskId);
    setIsMatching(true);
    setTopMatches([]);
    setSelectedVolunteer(null);
    setAppointmentDone(false);
    
    const task = displayTasks.find(t => (t.task_id || t.id) === taskId);
    if (!task) return;

    let iterations = 0;
    const maxIterations = 20;
    const interval = setInterval(() => {
      try {
        const randomVol = displayVolunteers[Math.floor(Math.random() * displayVolunteers.length)];
        if (randomVol) setAnimationVol(randomVol);
        iterations++;
        
        if (iterations >= maxIterations) {
          clearInterval(interval);
          const matches = rankVolunteers(task, displayVolunteers).slice(0, 4);
          setTopMatches(matches);
          setIsMatching(false);
        }
      } catch (err) {
        clearInterval(interval);
        setIsMatching(false);
        console.error('Matching error:', err);
      }
    }, 100);
  };

  const handleAppoint = async () => {
    if (!selectedVolunteer || !matchingTaskId) return;
    
    try {
      const { error } = await supabase
        .from('tasks')
        .update({ 
          assigned_volunteer_id: selectedVolunteer.volunteer.volunteer_id,
          status: 'assigned'
        })
        .eq('id', matchingTaskId);

      if (error) throw error;
      
      setAppointmentDone(true);
      setTimeout(() => setActiveSection('simulation'), 1500);
    } catch (err: any) {
      alert('Assignment failed: ' + err.message);
    }
  };

  const submitVolunteerForm = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUploading(true);
    try {
      const { error } = await supabase.from('volunteers').insert([{
        name: volForm.name,
        email: volForm.email,
        phone: volForm.phone,
        skills: volForm.skills.split(',').map(s => s.trim()).join('|'),
        availability_days: volForm.days.split(',').map(s => s.trim()).join('|'),
        experience: volForm.experience,
        status: 'pending',
        photo_url: volForm.photo
      }]);
      if (error) throw error;
      setTimeout(() => {
        setIsUploading(false);
        alert('Application submitted! Admin will verify your request.');
        setActiveSection('home');
      }, 2000);
    } catch (err: any) {
      alert(err.message);
      setIsUploading(false);
    }
  };

  const submitNgoForm = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUploading(true);
    try {
      const { error } = await supabase.from('tasks').insert([{
        ngo_name: ngoForm.name,
        location: ngoForm.location,
        phone: ngoForm.phone,
        requirements: ngoForm.requirements,
        payment: ngoForm.payment,
        status: 'open',
        priority: 'High',
        severity_score: 75,
        latitude: 12.9716 + (Math.random() - 0.5) * 0.1,
        longitude: 77.5946 + (Math.random() - 0.5) * 0.1,
        required_skills: ['General Aid'],
        required_days: ['Immediate']
      }]);
      if (error) throw error;
      setTimeout(() => {
        setIsUploading(false);
        alert('Task request published to global command center!');
        setActiveSection('home');
      }, 2000);
    } catch (err: any) {
      alert(err.message);
      setIsUploading(false);
    }
  };

  const openTasks = localTasks.filter(t => t.status === 'open').sort((a,b) => b.severity_score - a.severity_score);
  const pendingVolunteers = displayVolunteers.filter(v => v.status?.toLowerCase() === 'pending');
  const verifiedVolunteers = displayVolunteers.filter(v => v.status?.toLowerCase() !== 'pending');



  return (
    <AnimatePresence mode="wait">
      {showSplash ? (
        <motion.div
          key="splash"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.1, filter: 'blur(20px)' }}
          transition={{ duration: 1, ease: 'circOut' }}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9999,
            background: '#000',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '20px'
          }}
        >
          <div className="bg-mesh" style={{ opacity: 0.3 }} />
          <motion.div
            initial={{ y: 20, opacity: 0, filter: 'blur(10px)' }}
            animate={{ y: 0, opacity: 1, filter: 'blur(0px)' }}
            transition={{ duration: 1.2, delay: 0.2, ease: 'easeOut' }}
            style={{
              fontSize: '6rem',
              fontWeight: 900,
              color: '#fff',
              letterSpacing: '8px',
              textShadow: '0 0 30px rgba(255,255,255,0.3)',
              fontFamily: 'inherit'
            }}
          >
            सहायता
          </motion.div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            transition={{ duration: 1, delay: 0.8 }}
            style={{
              fontSize: '0.8rem',
              letterSpacing: '4px',
              color: '#fff',
              fontWeight: 500,
            }}
          >
            Sahayeta (Hindi: सहायता, meaning Assistance) 
          </motion.div>
          <motion.div 
            style={{ 
              position: 'absolute', 
              bottom: '40px', 
              width: '200px', 
              height: '1px', 
              background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)' 
            }}
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 2, ease: 'easeInOut' }}
          />
        </motion.div>
      ) : (
        <motion.div 
          key="content"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
          className="app-container"
        >
          <div className="bg-mesh" />
          
          <nav>
        <div className={`nav-link ${activeSection === 'home' ? 'active' : ''}`} onClick={() => setActiveSection('home')}>
          <span>HOME</span>
          <span className="hindi-text">होम</span>
        </div>
        <div className={`nav-link ${activeSection === 'ai-engine' ? 'active' : ''}`} onClick={() => setActiveSection('ai-engine')}>
          <span>AI ENGINE</span>
          <span className="hindi-text">एआई इंजन</span>
        </div>
        
        {isAdmin ? (
          <>
            <div className={`nav-link ${activeSection === 'volunteer-list' ? 'active' : ''}`} onClick={() => setActiveSection('volunteer-list')}>
              <span>ADMIN COMMAND CENTER</span>
              <span className="hindi-text">कमांड सेंटर</span>
            </div>
            <div className={`nav-link ${activeSection === 'simulation' ? 'active' : ''}`} onClick={() => setActiveSection('simulation')}>
              <span>GIS MAPPING</span>
              <span className="hindi-text">जीआईएस मानचित्रण</span>
            </div>
          </>
        ) : isVolunteer ? (
          <>
            <div className={`nav-link ${activeSection === 'assigned-tasks' ? 'active' : ''}`} onClick={() => setActiveSection('assigned-tasks')}>
              <span>MY FIELD TASKS</span>
              <span className="hindi-text">मेरे कार्य</span>
            </div>
            <div className={`nav-link ${activeSection === 'simulation' ? 'active' : ''}`} onClick={() => setActiveSection('simulation')}>
              <span>GIS MAPPING</span>
              <span className="hindi-text">जीआईएस मानचित्रण</span>
            </div>
          </>
        ) : (
          <>
            <div className={`nav-link ${activeSection === 'matching' ? 'active' : ''}`} onClick={() => setActiveSection('matching')}>
              <span>MATCHING</span>
              <span className="hindi-text">मिलान</span>
            </div>
            <div className={`nav-link ${activeSection === 'simulation' ? 'active' : ''}`} onClick={() => setActiveSection('simulation')}>
              <span>SIMULATION</span>
              <span className="hindi-text">सिमुलेशन</span>
            </div>
          </>
        )}

        <div className={`nav-link ${activeSection === 'compare' ? 'active' : ''}`} onClick={() => setActiveSection('compare')}>
          <span>RESULTS</span>
          <span className="hindi-text">परिणाम</span>
        </div>

        <div style={{ width: '1px', background: '#333', margin: '0 10px' }} />
        
        {!state.user ? (
          <div className={`nav-link ${activeSection === 'login-portal' ? 'active' : ''}`} onClick={() => setActiveSection('login-portal')} style={{ border: '1px solid #222' }}>
            <span>LOGIN</span>
            <span className="hindi-text">लॉगिन</span>
          </div>
        ) : (
          <div className="nav-link profile-link" style={{ position: 'relative', border: '1px solid var(--primary)', background: 'rgba(255,153,51,0.05)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <User size={14} />
              <span style={{ color: 'var(--primary)', fontWeight: 900 }}>{state.user.role?.toUpperCase() || 'USER'}</span>
            </div>
            <div className="profile-dropdown">
              <div onClick={handleSignOut} style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#ff5c7a', padding: '12px', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 800 }}>
                <LogOut size={16} /> SIGN OUT
              </div>
            </div>
            <style>{`
              .profile-link:hover .profile-dropdown { 
                opacity: 1 !important; 
                visibility: visible !important; 
                transform: translateY(0) !important;
              }
              .profile-dropdown {
                position: absolute; 
                top: 100%; 
                right: 0; 
                padding-top: 10px;
                background: transparent;
                z-index: 5000; 
                opacity: 0;
                visibility: hidden;
                transform: translateY(10px);
                transition: all 0.2s ease;
                display: flex;
                flex-direction: column;
              }
              .profile-dropdown::before {
                content: '';
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 10px;
                background: transparent;
              }
              .profile-dropdown div {
                background: #0a0a0a;
                border: 1px solid #222;
                border-radius: 12px;
                min-width: 160px;
                box-shadow: 0 10px 30px rgba(0,0,0,0.8);
              }
              .profile-dropdown div:hover { background: rgba(255,255,255,0.05); }
            `}</style>
          </div>
        )}
      </nav>

      <main>
        {activeSection === 'home' && (
          <div className="section-content animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '60px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '40px', alignItems: 'center' }}>
              <div>
                <h1 className="hero-title">SAHAYETA<br/>PLATFORM</h1>
                <p style={{ color: 'var(--text-secondary)', maxWidth: '600px', marginBottom: '30px', lineHeight: 1.4 }}>
                  The digital backbone for global crisis response. Sahayeta transforms community data into actionable field missions using AI-driven matching and real-time GIS mapping.
                  <span className="hindi-text" style={{ marginTop: '8px' }}>संकट प्रतिक्रिया के लिए वैश्विक डिजिटल रीढ़। सहायता एआई-आधारित मिलान और वास्तविक समय जीआईएस मानचित्रण का उपयोग करके सामुदायिक डेटा को कार्रवाई योग्य मिशनों में बदलता है।</span>
                </p>
                
                <div className="hero-stats">
                  <div className="stat-card">
                    <div className="stat-value">1,240+</div>
                    <div style={{ fontWeight: 800, fontSize: '0.75rem', color: 'var(--text-muted)' }}>MISSIONS COMPLETED<span className="hindi-text">मिशन पूरा हुआ</span></div>
                  </div>
                  <div className="stat-card">
                    <div className="stat-value" style={{ color: 'var(--accent)' }}>22</div>
                    <div style={{ fontWeight: 800, fontSize: '0.75rem', color: 'var(--text-muted)' }}>DISTRICTS COVERED<span className="hindi-text">जिले कवर किए गए</span></div>
                  </div>
                  <div className="stat-card">
                    <div className="stat-value" style={{ color: 'var(--secondary)' }}>4.2m</div>
                    <div style={{ fontWeight: 800, fontSize: '0.75rem', color: 'var(--text-muted)' }}>RESPONSE SPEED<span className="hindi-text">प्रतिक्रिया गति</span></div>
                  </div>
                </div>

                <div style={{ marginTop: '40px', display: 'flex', gap: '15px' }}>
                  <button className="btn-premium" onClick={() => setActiveSection('ai-engine')}>
                    <span>ENTER PIPELINE</span>
                    <span className="hindi-text">पाइपलाइन में प्रवेश करें</span>
                  </button>
                  {!state.user && (
                    <>
                      <button className="btn-premium" style={{ background: 'transparent', border: '1px solid #333', color: '#fff' }} onClick={() => setActiveSection('volunteer-form')}>
                        <span>JOIN AS VOLUNTEER</span>
                        <span className="hindi-text">स्वयंसेवक बनें</span>
                      </button>
                      <button className="btn-premium" style={{ background: 'transparent', border: '1px solid #333', color: '#fff' }} onClick={() => setActiveSection('ngo-tasks')}>
                        <span>NGO TASK REQUEST</span>
                        <span className="hindi-text">एनजीओ कार्य</span>
                      </button>
                    </>
                  )}
                  {isVolunteer && (
                    <button className="btn-premium" style={{ background: 'rgba(19,136,8,0.1)', border: '1px solid var(--secondary)', color: 'var(--secondary)' }} onClick={() => setActiveSection('assigned-tasks')}>
                      <span>MY FIELD TASKS</span>
                      <span className="hindi-text">मेरे कार्य</span>
                    </button>
                  )}
                </div>
              </div>

              <div style={{ width: '100%', maxWidth: '650px', margin: '0 auto', minHeight: '300px' }}>
                {welcomeAnimation && (
                  <Lottie animationData={welcomeAnimation} loop={true} style={{ width: '100%', height: '100%', filter: 'invert(1) brightness(1.2)' }} />
                )}
              </div>
            </div>
          </div>
        )}

        {activeSection === 'login-portal' && !state.user && (
          <div className="section-content animate-fade-in" style={{ textAlign: 'center' }}>
            <div style={{ marginBottom: '40px' }}>
              <h1 style={{ fontSize: '3.5rem !important' }}>SECURE ACCESS</h1>
              <p style={{ color: 'var(--text-muted)' }}>Enter credentials or use Google to access the platform.</p>
            </div>
            
            <div className="glass-card" style={{ maxWidth: '450px', margin: '0 auto 40px', padding: '30px', border: '1px solid #222' }}>
               <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                 <div style={{ textAlign: 'left' }}>
                   <label style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginBottom: '5px', display: 'block' }}>EMAIL ADDRESS</label>
                   <input type="email" placeholder="e.g. admin123@gmail.com" 
                     className="glass-card" style={{ width: '100%', padding: '12px', background: '#000', border: '1px solid #333', color: '#fff' }}
                     value={loginEmail} onChange={e => setLoginEmail(e.target.value)} />
                 </div>
                 <div style={{ textAlign: 'left' }}>
                   <label style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginBottom: '5px', display: 'block' }}>PASSWORD</label>
                   <input type="password" placeholder="••••••••" 
                     className="glass-card" style={{ width: '100%', padding: '12px', background: '#000', border: '1px solid #333', color: '#fff' }}
                     value={loginPassword} onChange={e => setLoginPassword(e.target.value)} />
                 </div>
                 <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginTop: '10px' }}>
                   <button className="btn-premium" style={{ fontSize: '0.7rem' }} onClick={() => handleManualLogin('admin')}>ADMIN LOGIN</button>
                   <button className="btn-premium" style={{ fontSize: '0.7rem', background: 'var(--secondary)' }} onClick={() => handleManualLogin('volunteer')}>VOLUNTEER LOGIN</button>
                 </div>
               </div>
               
               <div style={{ margin: '25px 0', display: 'flex', alignItems: 'center', gap: '15px' }}>
                 <div style={{ flex: 1, height: '1px', background: '#222' }} />
                 <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>OR</span>
                 <div style={{ flex: 1, height: '1px', background: '#222' }} />
               </div>

               <button className="btn-premium login-btn" style={{ width: '100%', background: '#fff', color: '#000', fontWeight: 600, height: '50px' }} onClick={() => handleGoogleAuth('admin')}>
                 CONTINUE WITH GOOGLE
               </button>
            </div>
            
            <div style={{ marginTop: '50px', borderTop: '1px solid #111', paddingTop: '30px' }}>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '15px' }}>Not registered yet?</p>
              <button className="btn-premium" style={{ background: 'transparent', border: '1px solid #333', color: '#fff' }} onClick={() => setActiveSection('volunteer-form')}>
                ENROLL AS A VOLUNTEER
              </button>
            </div>
          </div>
        )}

        {(activeSection === 'volunteer-form' || activeSection === 'ngo-tasks') && isUploading && (
          <div className="section-content animate-fade-in" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
            <Lottie animationData={uploadingAnimation} loop={true} style={{ width: '300px', height: '300px' }} />
            <h2 style={{ marginTop: '20px', color: 'var(--primary)' }}>UPLOADING DATA...</h2>
            <p style={{ color: 'var(--text-muted)' }}>Broadcasting to global Sahayeta nodes.</p>
          </div>
        )}

        {activeSection === 'volunteer-form' && !isUploading && (
          <div className="section-content animate-fade-in">
            <h1 style={{ marginBottom: '30px' }}>VOLUNTEER ENROLLMENT</h1>
            <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '40px', alignItems: 'center' }}>
              <div className="glass-card">
                <form style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }} onSubmit={submitVolunteerForm}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <label style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>FULL NAME *</label>
                    <input type="text" className="glass-card" style={{ padding: '12px', background: '#000', borderRadius: '12px' }} value={volForm.name} onChange={e => setVolForm({...volForm, name: e.target.value})} required />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <label style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>PHONE NUMBER *</label>
                    <input type="tel" className="glass-card" style={{ padding: '12px', background: '#000', borderRadius: '12px' }} value={volForm.phone} onChange={e => setVolForm({...volForm, phone: e.target.value})} required />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <label style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>EMAIL ADDRESS *</label>
                    <input type="email" className="glass-card" style={{ padding: '12px', background: '#000', borderRadius: '12px' }} value={volForm.email} onChange={e => setVolForm({...volForm, email: e.target.value})} required />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <label style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>AVAILABILITY *</label>
                    <input type="text" placeholder="e.g. Weekends, Mon-Fri" className="glass-card" style={{ padding: '12px', background: '#000', borderRadius: '12px' }} value={volForm.days} onChange={e => setVolForm({...volForm, days: e.target.value})} required />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', gridColumn: 'span 2' }}>
                    <label style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>SKILLS (Comma separated) *</label>
                    <textarea className="glass-card" style={{ padding: '12px', background: '#000', height: '80px', borderRadius: '12px' }} value={volForm.skills} onChange={e => setVolForm({...volForm, skills: e.target.value})} required />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', gridColumn: 'span 2' }}>
                    <label style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>EXPERIENCE YEARS *</label>
                    <input type="number" className="glass-card" style={{ padding: '12px', background: '#000', borderRadius: '12px' }} value={volForm.experience} onChange={e => setVolForm({...volForm, experience: e.target.value})} required />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', gridColumn: 'span 2' }}>
                    <label style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>PHOTO URL *</label>
                    <input type="url" className="glass-card" style={{ padding: '12px', background: '#000', borderRadius: '12px' }} value={volForm.photo} onChange={e => setVolForm({...volForm, photo: e.target.value})} required />
                  </div>
                  <button className="btn-premium" style={{ gridColumn: 'span 2', borderRadius: '12px' }} type="submit">SUBMIT APPLICATION</button>
                </form>
              </div>
              <div style={{ width: '100%', maxWidth: '500px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div style={{ width: '100%', height: '400px', position: 'relative' }}>
                  {welcomeAnimation && (
                    <Lottie animationData={welcomeAnimation} loop={true} style={{ width: '100%', height: '100%', filter: 'invert(1) brightness(1.2)' }} />
                  )}
                </div>
                <div style={{ textAlign: 'center', marginTop: '20px' }}>
                  <h3 style={{ color: 'var(--secondary)', marginBottom: '10px', fontSize: '1.2rem' }}>JOIN THE NETWORK</h3>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Your skills can save lives. Register now to be part of the global Sahayeta response team.</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeSection === 'ngo-tasks' && !isUploading && (
          <div className="section-content animate-fade-in">
            <h1 style={{ marginBottom: '30px' }}>NGO TASK REQUEST</h1>
            <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '40px', alignItems: 'center' }}>
              <div className="glass-card">
                <form style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }} onSubmit={submitNgoForm}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <label style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>NGO NAME *</label>
                    <input type="text" className="glass-card" style={{ padding: '12px', background: '#000', borderRadius: '12px' }} value={ngoForm.name} onChange={e => setNgoForm({...ngoForm, name: e.target.value})} required />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <label style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>LOCATION *</label>
                    <input type="text" className="glass-card" style={{ padding: '12px', background: '#000', borderRadius: '12px' }} value={ngoForm.location} onChange={e => setNgoForm({...ngoForm, location: e.target.value})} required />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <label style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>CONTACT PHONE *</label>
                    <input type="tel" className="glass-card" style={{ padding: '12px', background: '#000', borderRadius: '12px' }} value={ngoForm.phone} onChange={e => setNgoForm({...ngoForm, phone: e.target.value})} required />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <label style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>COMPENSATION INFO</label>
                    <input type="text" className="glass-card" style={{ padding: '12px', background: '#000', borderRadius: '12px' }} value={ngoForm.payment} onChange={e => setNgoForm({...ngoForm, payment: e.target.value})} />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', gridColumn: 'span 2' }}>
                    <label style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>MISSION DESCRIPTION *</label>
                    <textarea className="glass-card" style={{ padding: '12px', background: '#000', height: '150px', borderRadius: '12px' }} value={ngoForm.requirements} onChange={e => setNgoForm({...ngoForm, requirements: e.target.value})} required />
                  </div>
                  <button className="btn-premium" style={{ gridColumn: 'span 2', borderRadius: '12px' }} type="submit">PUBLISH MISSION</button>
                </form>
              </div>
              <div style={{ width: '100%', maxWidth: '500px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div style={{ width: '100%', height: '400px', position: 'relative' }}>
                  {welcomeAnimation && (
                    <Lottie animationData={welcomeAnimation} loop={true} style={{ width: '100%', height: '100%', filter: 'invert(1) hue-rotate(45deg) brightness(1.2)' }} />
                  )}
                </div>
                <div style={{ textAlign: 'center', marginTop: '20px' }}>
                  <h3 style={{ color: 'var(--primary)', marginBottom: '10px', fontSize: '1.2rem' }}>BROADCAST MISSION</h3>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Get instant help from our verified field agents. Your request will be prioritized by urgency and location.</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeSection === 'volunteer-list' && isAdmin && (
          <div className="section-content animate-fade-in" style={{ maxWidth: '1400px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
              <div>
                <h1 style={{ fontSize: '2.5rem !important' }}>COMMAND CENTER</h1>
                <p style={{ color: 'var(--text-muted)' }}>Manage global missions and field personnel.</p>
              </div>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button className="btn-premium" style={{ background: 'var(--accent)', color: '#000' }} onClick={() => setActiveSection('manage-admins')}>
                  <Shield size={16} /> NEW VOLUNTEERS ({pendingVolunteers.length})
                </button>
              </div>
            </div>

            {/* Row 1: NGO Tasks */}
            <div className="glass-card" style={{ marginBottom: '30px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
                <ClipboardList style={{ color: 'var(--primary)' }} />
                <h3>GLOBAL NGO TASKS</h3>
              </div>
              <div style={{ overflowX: 'auto' }}>
                <table className="task-table">
                  <thead>
                    <tr>
                      <th style={{ textAlign: 'left', padding: '15px' }}>TASK ID</th>
                      <th style={{ textAlign: 'left', padding: '15px' }}>NGO NAME</th>
                      <th style={{ textAlign: 'left', padding: '15px' }}>LOCATION</th>
                      <th style={{ textAlign: 'left', padding: '15px' }}>REQUIREMENTS</th>
                      <th style={{ textAlign: 'left', padding: '15px' }}>SEVERITY</th>
                      <th style={{ textAlign: 'left', padding: '15px' }}>STATUS</th>
                      <th style={{ textAlign: 'left', padding: '15px' }}>ACTIONS</th>
                    </tr>
                  </thead>
                  <tbody>
                    {displayTasks && displayTasks.length > 0 ? displayTasks.map(t => (
                      <tr key={t.task_id || t.id}>
                        <td style={{ padding: '15px', color: 'var(--primary)', fontWeight: 900 }}>{t.task_id || t.id}</td>
                        <td style={{ padding: '15px', fontWeight: 800 }}>{t.ngo_name || 'Unnamed NGO'}</td>
                        <td style={{ padding: '15px' }}>{t.location || 'Unknown'}</td>
                        <td style={{ padding: '15px', fontSize: '0.75rem', opacity: 0.7 }}>{(t.requirements || t.description || '').substring(0, 50)}...</td>
                        <td style={{ padding: '15px' }}><span className={`badge ${t.priority === 'Critical' ? 'red' : 'yellow'}`}>{t.severity_score || 0}</span></td>
                        <td style={{ padding: '15px' }}><span style={{ fontSize: '0.65rem', textTransform: 'uppercase' }}>{t.status || 'open'}</span></td>
                        <td style={{ padding: '15px' }}>
                          {(t.status === 'open' || !t.status) && (
                            <button className="btn-premium" style={{ padding: '6px 12px', fontSize: '0.6rem' }} onClick={() => { setActiveSection('matching'); handleMatch(t.task_id || t.id); }}>
                              MATCH FIELD AGENT
                            </button>
                          )}
                        </td>
                      </tr>
                    )) : (
                      <tr><td colSpan={7} style={{ textAlign: 'center', padding: '20px', color: 'var(--text-muted)' }}>No tasks found in system.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Row 2: Verified Volunteers — uses normalizedLocalVolunteers so field names always resolve */}
            <div className="glass-card">
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
                <Users style={{ color: 'var(--secondary)' }} />
                <h3>VERIFIED FIELD AGENTS</h3>
                <span style={{ marginLeft: 'auto', fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                  {verifiedVolunteers.length} agent{verifiedVolunteers.length !== 1 ? 's' : ''}
                </span>
              </div>
              <div style={{ overflowX: 'auto' }}>
                <table className="task-table">
                  <thead>
                    <tr>
                      <th style={{ textAlign: 'left', padding: '15px' }}>ID</th>
                      <th style={{ textAlign: 'left', padding: '15px' }}>AGENT NAME</th>
                      <th style={{ textAlign: 'left', padding: '15px' }}>EMAIL</th>
                      <th style={{ textAlign: 'left', padding: '15px' }}>SKILLS</th>
                      <th style={{ textAlign: 'left', padding: '15px' }}>EXPERIENCE</th>
                      <th style={{ textAlign: 'left', padding: '15px' }}>AVAILABILITY</th>
                      <th style={{ textAlign: 'left', padding: '15px' }}>STATUS</th>
                    </tr>
                  </thead>
                  <tbody>
                    {verifiedVolunteers.length > 0 ? verifiedVolunteers.map(v => (
                      <tr key={v.volunteer_id || v.id}>
                        <td style={{ padding: '15px', color: 'var(--secondary)', fontWeight: 900, fontSize: '0.6rem', maxWidth: '80px', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {v.volunteer_id || v.id}
                        </td>
                        <td style={{ padding: '15px', fontWeight: 800 }}>{v.name}</td>
                        <td style={{ padding: '15px' }}>{v.email}</td>
                        <td style={{ padding: '15px', fontSize: '0.75rem' }}>
                          {Array.isArray(v.skills) ? v.skills.join(', ') : (v.skills || 'None')}
                        </td>
                        <td style={{ padding: '15px' }}>{v.experience_years || 0} years</td>
                        <td style={{ padding: '15px' }}>
                          {/* availability is normalized from availability_days in Supabase */}
                          {v.availability || 'Not set'}
                        </td>
                        <td style={{ padding: '15px' }}>
                          <span className={`badge ${v.status === 'available' ? 'green' : 'yellow'}`}>
                            {v.status || 'available'}
                          </span>
                        </td>
                      </tr>
                    )) : (
                      <tr>
                        <td colSpan={7} style={{ textAlign: 'center', padding: '20px', color: 'var(--text-muted)' }}>
                          No verified agents available.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeSection === 'manage-admins' && isAdmin && (
          <div className="section-content animate-fade-in">
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '30px' }}>
              <button onClick={() => setActiveSection('volunteer-list')} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer' }}>← BACK</button>
              <h1>PENDING VOLUNTEER REQUESTS</h1>
            </div>
            
            <div className="glass-card">
              {pendingVolunteers.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>No pending verification requests.</div>
              ) : (
                <div style={{ overflowX: 'auto' }}>
                  <table className="task-table">
                    <thead>
                      <tr>
                        <th>NAME</th>
                        <th>EMAIL</th>
                        <th>PHONE</th>
                        <th>SKILLS</th>
                        <th>EXPERIENCE</th>
                        <th>ACTIONS</th>
                      </tr>
                    </thead>
                    <tbody>
                      {pendingVolunteers.map(v => (
                        <tr key={v.volunteer_id || v.id}>
                          <td style={{ fontWeight: 800 }}>{v.name}</td>
                          <td>{v.email}</td>
                          <td>{(v as any).phone || '—'}</td>
                          <td style={{ fontSize: '0.75rem' }}>
                            {Array.isArray(v.skills) ? v.skills.join(', ') : (v.skills || 'None')}
                          </td>
                          <td>{v.experience_years || 0} yrs</td>
                          <td style={{ display: 'flex', gap: '10px' }}>
                            <button className="btn-premium" style={{ background: 'var(--secondary)', padding: '6px 12px', fontSize: '0.6rem' }} 
                              onClick={async () => {
                                await supabase.from('volunteers').update({ status: 'approved' }).eq('id', v.volunteer_id || v.id);
                                alert('Volunteer approved!');
                              }}>
                              APPROVE
                            </button>
                            <button className="btn-premium" style={{ background: '#ff5c7a', padding: '6px 12px', fontSize: '0.6rem' }}
                              onClick={async () => {
                                await supabase.from('volunteers').delete().eq('id', v.volunteer_id || v.id);
                                alert('Request rejected.');
                              }}>
                              REJECT
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {activeSection === 'ai-engine' && (
          <div className="section-content animate-fade-in" style={{ maxWidth: '1400px' }}>
            <div style={{ marginBottom: '40px' }}>
              <h1 style={{ fontSize: '3rem !important' }}>DECISION INTELLIGENCE</h1>
              <p style={{ color: 'var(--text-muted)' }}>AI-driven resource optimization and urgency scoring.</p>
            </div>
            
            <div className="dashboard-grid">
              <div className="glass-card" style={{ padding: '30px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '25px' }}>
                  <Brain style={{ color: 'var(--primary)' }} size={32} />
                  <h3>URGENCY ANALYSIS</h3>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  {(isAdmin || isVolunteer ? displayTasks : demoNGOTasks).slice(0, 5).map((t: any, i) => {
                    const score = t.severity_score || (t.priority === 'Critical' ? 95 : t.priority === 'High' ? 80 : 50);
                    const color = score > 80 ? '#ff5c7a' : score > 60 ? '#ffb84d' : '#7ed957';
                    const isExpanded = aiExpandedTaskId === (t.id || t.task_id);
                    const matchedVol = demoMatchResult && isLiveSimulating && (demoMatchResult.task.id === t.id) ? demoMatchResult.volunteer.name : null;

                    return (
                      <div key={i} style={{ borderBottom: '1px solid #111', paddingBottom: '15px' }}>
                        <div 
                          style={{ display: 'flex', alignItems: 'center', gap: '15px', cursor: 'pointer' }}
                          onClick={() => setAiExpandedTaskId(isExpanded ? null : (t.id || t.task_id))}
                        >
                          <div style={{ width: '50px', height: '50px', borderRadius: '50%', background: `${color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: color, fontWeight: 900, fontSize: '0.9rem' }}>{score}%</div>
                          <div style={{ flex: 1 }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <div style={{ fontSize: '0.9rem', fontWeight: 500, letterSpacing: '0.5px', color: '#fff' }}>{t.ngo_name || t.ngoName}</div>
                              <div style={{ color: 'var(--text-muted)' }}>{isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}</div>
                            </div>
                            <div style={{ height: '4px', background: '#111', borderRadius: '2px', marginTop: '8px' }}>
                              <div style={{ height: '100%', width: `${score}%`, background: color, borderRadius: '2px' }} />
                            </div>
                          </div>
                        </div>
                        
                        {isExpanded && (
                          <div className="animate-fade-in" style={{ marginTop: '15px', padding: '15px', background: 'rgba(255,255,255,0.02)', borderRadius: '12px', border: '1px solid #222' }}>
                            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '10px' }}>{t.description || t.requirements}</p>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                              <div>
                                <div style={{ fontSize: '0.6rem', color: 'var(--text-muted)', letterSpacing: '1px' }}>LOCATION</div>
                                <div style={{ fontSize: '0.75rem', fontWeight: 600 }}>{t.location}</div>
                              </div>
                              <div>
                                <div style={{ fontSize: '0.6rem', color: 'var(--text-muted)', letterSpacing: '1px' }}>AGENT STATUS</div>
                                {matchedVol ? (
                                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                    <div className="animate-pulse" style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--secondary)' }} />
                                    <div style={{ fontSize: '0.75rem', color: 'var(--secondary)', fontWeight: 800 }}>{matchedVol} · WORK IN PROGRESS</div>
                                  </div>
                                ) : (
                                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Awaiting Deployment</div>
                                )}
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="glass-card" style={{ padding: '30px', background: 'rgba(19,136,8,0.02)', border: '1px solid rgba(19,136,8,0.2)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '25px' }}>
                  <Zap style={{ color: 'var(--secondary)' }} size={32} />
                  <h3>SMART ALLOCATION</h3>
                </div>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '20px' }}>Our AI engine cross-references 12+ variables to find the optimal agent for every mission.</p>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                  <div className="stat-card" style={{ background: 'rgba(0,0,0,0.3)' }}>
                    <div className="stat-value" style={{ fontSize: '1.5rem', color: 'var(--secondary)' }}>94%</div>
                    <div style={{ fontSize: '0.6rem' }}>MATCH PRECISION</div>
                  </div>
                  <div className="stat-card" style={{ background: 'rgba(0,0,0,0.3)' }}>
                    <div className="stat-value" style={{ fontSize: '1.5rem', color: 'var(--secondary)' }}>4.2m</div>
                    <div style={{ fontSize: '0.6rem' }}>AVG. RESPONSE</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeSection === 'matching' && !state.user && (
          <div className="section-content animate-fade-in" style={{ maxWidth: '1400px' }}>
            <div style={{ marginBottom: '40px' }}>
              <h1 style={{ fontSize: '3rem' }}>COORDINATION</h1>
              <span className="hindi-text" style={{ fontSize: '1.2rem' }}>समन्वय</span>
              <p style={{ color: 'var(--text-muted)', marginTop: '8px' }}>Select a task and match volunteers using AI — by skill and proximity.</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px', alignItems: 'start' }}>
              {/* COLUMN 1: 10 VOLUNTEERS */}
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
                  <Users size={18} style={{ color: 'var(--secondary)' }} />
                  <h3 style={{ fontSize: '0.85rem', letterSpacing: '2px' }}>VOLUNTEER ROSTER</h3>
                  <span style={{ marginLeft: 'auto', fontSize: '0.65rem', color: 'var(--text-muted)', background: '#111', border: '1px solid #222', borderRadius: '100px', padding: '2px 10px' }}>5 AGENTS</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {publicMockVolunteers.map(v => (
                    <div key={v.volunteer_id} className={`match-item ${expandedVolId === v.volunteer_id ? 'expanded' : ''}`} style={{ borderRadius: '14px', border: `1px solid ${expandedVolId === v.volunteer_id ? 'var(--secondary)' : '#1a1a1a'}`, background: expandedVolId === v.volunteer_id ? 'rgba(19,136,8,0.06)' : 'rgba(255,255,255,0.02)', overflow: 'hidden' }}>
                      <div onClick={() => setExpandedVolId(expandedVolId === v.volunteer_id ? null : v.volunteer_id!)}
                        style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontWeight: 500, fontSize: '0.9rem' }}>{v.name}</div>
                          <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{(v.skills as string[]).slice(0, 2).join(' · ')}</div>
                        </div>
                        {expandedVolId === v.volunteer_id ? <ChevronUp size={14} style={{ color: 'var(--secondary)' }} /> : <ChevronDown size={14} style={{ color: '#444' }} />}
                      </div>
                      {expandedVolId === v.volunteer_id && (
                        <div className="animate-fade-in" style={{ padding: '0 16px 14px', borderTop: '1px solid #1a1a1a', paddingTop: '12px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px 16px' }}>
                          <div style={{ fontSize: '0.7rem' }}><span style={{ color: 'var(--text-muted)' }}>Email: </span><span style={{ color: '#ccc' }}>{v.email}</span></div>
                          <div style={{ fontSize: '0.7rem' }}><span style={{ color: 'var(--text-muted)' }}>Location: </span><span style={{ color: '#ccc' }}>{v.latitude?.toFixed(2)}°N, {v.longitude?.toFixed(2)}°E</span></div>
                          <div style={{ fontSize: '0.7rem' }}><span style={{ color: 'var(--text-muted)' }}>Available: </span><span style={{ color: 'var(--secondary)' }}>{v.availability}</span></div>
                          <div style={{ fontSize: '0.7rem' }}><span style={{ color: 'var(--text-muted)' }}>Exp: </span><span style={{ color: '#ccc' }}>{v.experience_years} yrs</span></div>
                          <div style={{ fontSize: '0.7rem', gridColumn: 'span 2' }}><span style={{ color: 'var(--text-muted)' }}>Skills: </span>{(v.skills as string[]).map(s => <span key={s} style={{ background: 'rgba(19,136,8,0.15)', color: 'var(--secondary)', borderRadius: '4px', padding: '1px 8px', marginRight: '4px', fontSize: '0.65rem' }}>{s}</span>)}</div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* COLUMN 2: 5 NGO TASKS */}
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
                  <ClipboardList size={18} style={{ color: 'var(--primary)' }} />
                  <h3 style={{ fontSize: '0.85rem', letterSpacing: '2px' }}>NGO MISSIONS</h3>
                  <span style={{ marginLeft: 'auto', fontSize: '0.65rem', color: 'var(--text-muted)', background: '#111', border: '1px solid #222', borderRadius: '100px', padding: '2px 10px' }}>5 TASKS</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {demoNGOTasks.map(task => {
                    const isSelected = demoSelectedTask === task.id;
                    const isExpanded = expandedTaskId === task.id;
                    const pColor = task.priority === 'Critical' ? '#ff5c7a' : task.priority === 'High' ? '#ffb84d' : '#7ed957';
                    return (
                      <div key={task.id} className={`match-item ${isExpanded ? 'expanded' : ''}`} style={{ borderRadius: '14px', border: `1px solid ${isSelected ? 'var(--primary)' : isExpanded ? '#333' : '#1a1a1a'}`, background: isSelected ? 'rgba(255,153,51,0.06)' : 'rgba(255,255,255,0.02)', overflow: 'hidden' }}>
                        <div style={{ padding: '12px 16px', display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}
                          onClick={() => { setExpandedTaskId(isExpanded ? null : task.id); setDemoSelectedTask(task.id); setDemoMatchResult(null); }}>
                          <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: pColor, flexShrink: 0, boxShadow: `0 0 8px ${pColor}` }} />
                          <div style={{ flex: 1 }}>
                            <div style={{ fontWeight: 500, fontSize: '0.9rem' }}>{task.ngoName}</div>
                            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{task.location}</div>
                          </div>
                          <span style={{ fontSize: '0.6rem', fontWeight: 800, color: pColor, border: `1px solid ${pColor}33`, background: `${pColor}11`, borderRadius: '6px', padding: '2px 8px' }}>{task.priority}</span>
                          {isExpanded ? <ChevronUp size={14} style={{ color: 'var(--primary)' }} /> : <ChevronDown size={14} style={{ color: '#444' }} />}
                        </div>
                        {isExpanded && (
                          <div className="animate-fade-in" style={{ padding: '0 16px 14px', borderTop: '1px solid #1a1a1a', paddingTop: '12px' }}>
                            <p style={{ fontSize: '0.78rem', color: '#aaa', marginBottom: '10px', lineHeight: 1.5 }}>{task.description}</p>
                            <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', fontSize: '0.7rem' }}>
                              <div><span style={{ color: 'var(--text-muted)' }}>Required Days: </span>{task.requiredDays.map(d => <span key={d} style={{ background: 'rgba(255,153,51,0.1)', color: 'var(--primary)', borderRadius: '4px', padding: '1px 8px', marginRight: '4px' }}>{d}</span>)}</div>
                              <div style={{ marginTop: '6px' }}><span style={{ color: 'var(--text-muted)' }}>Skills Needed: </span>{task.requiredSkills.map(s => <span key={s} style={{ background: 'rgba(255,92,122,0.1)', color: '#ff9999', borderRadius: '4px', padding: '1px 8px', marginRight: '4px' }}>{s}</span>)}</div>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* MATCH BUTTON + RESULT */}
            <div style={{ marginTop: '40px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '24px' }}>
              {!demoSelectedTask && (
                <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>← Select an NGO task above to enable matching</p>
              )}
              {demoSelectedTask && !isDemoMatching && !demoMatchResult && (
                <button className="btn-premium" style={{ padding: '18px 60px', fontSize: '1rem', background: 'var(--primary)', color: '#000' }} onClick={handleDemoMatch}>
                  <Brain size={18} style={{ marginBottom: '4px' }} /> RUN AI MATCH
                </button>
              )}
              {isDemoMatching && (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
                  <Brain size={48} style={{ color: 'var(--primary)', animation: 'pulse 1s infinite' }} />
                  <div style={{ fontWeight: 800, fontSize: '1rem' }}>ANALYZING {publicMockVolunteers.length} AGENTS...</div>
                  <div style={{ display: 'flex', gap: '10px', marginTop: '8px' }}>
                    {['Scoring Skills', 'Computing Distance', 'Ranking Matches'].map((s, i) => (
                      <span key={s} style={{ fontSize: '0.65rem', padding: '4px 12px', borderRadius: '100px', border: `1px solid ${demoMatchStep > i ? 'var(--secondary)' : '#333'}`, color: demoMatchStep > i ? 'var(--secondary)' : '#555', background: demoMatchStep > i ? 'rgba(19,136,8,0.1)' : 'transparent', transition: 'all 0.4s' }}>{s}</span>
                    ))}
                  </div>
                </div>
              )}
              {demoMatchResult && (
                <div className="animate-fade-in" style={{ width: '100%', maxWidth: '700px' }}>
                  <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', letterSpacing: '3px', marginBottom: '8px' }}>BEST MATCH FOUND</div>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(19,136,8,0.1)', border: '1px solid rgba(19,136,8,0.3)', borderRadius: '100px', padding: '6px 20px' }}>
                      <CheckCircle2 size={14} style={{ color: 'var(--secondary)' }} />
                      <span style={{ fontSize: '0.75rem', color: 'var(--secondary)', fontWeight: 800 }}>MATCH SCORE: {demoMatchResult.score}%</span>
                    </div>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', gap: '20px', alignItems: 'center' }}>
                    <div className="glass-card" style={{ padding: '20px', border: '1px solid rgba(19,136,8,0.4)', textAlign: 'center' }}>
                      <User size={28} style={{ color: 'var(--secondary)', marginBottom: '8px' }} />
                      <div style={{ fontWeight: 900, fontSize: '1rem', marginBottom: '4px' }}>{demoMatchResult.volunteer.name}</div>
                      <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', marginBottom: '8px' }}>{demoMatchResult.volunteer.email}</div>
                      <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap', justifyContent: 'center' }}>
                        {(demoMatchResult.volunteer.skills as string[]).map(s => <span key={s} style={{ background: 'rgba(19,136,8,0.15)', color: 'var(--secondary)', borderRadius: '4px', padding: '1px 8px', fontSize: '0.6rem' }}>{s}</span>)}
                      </div>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
                      <Navigation size={24} style={{ color: 'var(--primary)' }} />
                      <div style={{ width: '60px', height: '2px', background: 'linear-gradient(to right, var(--secondary), var(--primary))', borderRadius: '2px' }} />
                      <span style={{ fontSize: '0.6rem', color: 'var(--text-muted)' }}>DEPLOYING</span>
                    </div>
                    <div className="glass-card" style={{ padding: '20px', border: '1px solid rgba(255,153,51,0.4)', textAlign: 'center' }}>
                      <MapPin size={28} style={{ color: 'var(--primary)', marginBottom: '8px' }} />
                      <div style={{ fontWeight: 900, fontSize: '1rem', marginBottom: '4px' }}>{demoMatchResult.task.ngoName}</div>
                      <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', marginBottom: '8px' }}>{demoMatchResult.task.location}</div>
                      <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap', justifyContent: 'center' }}>
                        {demoMatchResult.task.requiredSkills.map(s => <span key={s} style={{ background: 'rgba(255,153,51,0.15)', color: 'var(--primary)', borderRadius: '4px', padding: '1px 8px', fontSize: '0.6rem' }}>{s}</span>)}
                      </div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '16px', marginTop: '24px', justifyContent: 'center' }}>
                    <button className="btn-premium" style={{ background: 'transparent', border: '1px solid #333', color: '#fff', padding: '12px 28px' }} onClick={() => { setDemoMatchResult(null); setDemoSelectedTask(null); }}>RE-MATCH</button>
                    <button className="btn-premium" style={{ background: 'var(--primary)', color: '#000', padding: '12px 36px', display: 'flex', alignItems: 'center', gap: '8px' }} onClick={handleLiveSimulate}>
                      <Play size={16} /> LIVE SIMULATE
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* DISCLAIMER */}
            <div style={{ marginTop: '60px', borderTop: '1px solid #1a1a1a', paddingTop: '20px', textAlign: 'center' }}>
              <p style={{ fontSize: '0.75rem', color: '#555', fontStyle: 'normal', letterSpacing: '0.5px' }}>
                The volunteer names and NGO tasks listed above are fictional and used solely for demonstration purposes to illustrate how the Sahayeta AI matching system works.
              </p>
            </div>
            <style>{`
              .match-item { transition: all 0.3s ease; }
              .match-item:hover { background: rgba(255,255,255,0.05) !important; transform: translateX(5px); }
              .match-item.expanded { background: rgba(255,255,255,0.04) !important; }
            `}</style>
          </div>
        )}

        {activeSection === 'matching' && state.user && (

          <div className="section-content animate-fade-in">
            <div style={{ marginBottom: '40px' }}>
              <h1 style={{ fontSize: '3rem !important' }}>COORDINATION</h1>
              <span className="hindi-text" style={{ fontSize: '1.2rem' }}>समन्वय</span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '30px', alignItems: 'start' }}>
              <div className="glass-card" style={{ padding: '15px' }}>
                <h3 style={{ marginBottom: '15px', padding: '0 10px', fontSize: '0.9rem' }}>ACTIVE SELECTION</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {displayTasks.filter(t => (t.task_id || t.id) === matchingTaskId).map(t => (
                    <div key={t.task_id || t.id} style={{ padding: '15px', borderRadius: '15px', border: '1px solid var(--primary)', background: 'rgba(255,153,51,0.05)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <div><div style={{ fontWeight: 800, fontSize: '0.9rem' }}>{t.ngo_name}</div><div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{t.location}</div></div>
                        <div className={`badge ${t.priority === 'Critical' ? 'red' : 'yellow'}`} style={{ fontSize: '0.6rem', padding: '2px 8px' }}>{t.priority}</div>
                      </div>
                      <div style={{ marginTop: '15px', paddingTop: '15px', borderTop: '1px solid #222', fontSize: '0.8rem' }}>
                        <div style={{ marginBottom: '10px' }}><strong style={{ color: 'var(--primary)', display: 'block', marginBottom: '4px' }}>REQUIREMENTS:</strong><p style={{ opacity: 0.7 }}>{t.requirements}</p></div>
                        <div style={{ marginBottom: '10px' }}><strong style={{ color: 'var(--primary)', display: 'block', marginBottom: '4px' }}>SEVERITY INDEX:</strong><span style={{ color: 'var(--primary)', fontWeight: 900, fontSize: '1.2rem' }}>{t.severity_score}</span></div>
                      </div>
                    </div>
                  ))}
                  <button className="btn-premium" style={{ background: 'transparent', border: '1px solid #333' }} onClick={() => setActiveSection(isAdmin ? 'volunteer-list' : 'home')}>BACK TO LIST</button>
                </div>
              </div>

              <div className="glass-card" style={{ minHeight: '450px' }}>
                {isMatching ? (
                  <div style={{ height: '350px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                    <Brain size={60} className="animate-pulse" style={{ color: 'var(--primary)', marginBottom: '15px' }} />
                    <div style={{ fontSize: '1.2rem', fontWeight: 800 }}>ANALYZING AGENT SYNERGY...</div>
                    <div style={{ color: 'var(--primary)', fontSize: '1rem' }}>{animationVol?.name}</div>
                  </div>
                ) : topMatches.length > 0 ? (
                  <div>
                    <h3 style={{ marginBottom: '15px', fontSize: '0.9rem' }}>TOP 4 FIELD MATCHES</h3>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '25px' }}>
                      {topMatches.map((m, i) => (
                        <div key={m.volunteer.volunteer_id || m.volunteer.id} onClick={() => setSelectedVolunteer(m)} 
                          style={{
                            padding: '20px', borderRadius: '15px', cursor: 'pointer',
                            border: '1px solid',
                            borderColor: selectedVolunteer?.volunteer.volunteer_id === (m.volunteer.volunteer_id || m.volunteer.id) ? 'var(--secondary)' : '#111',
                            background: selectedVolunteer?.volunteer.volunteer_id === (m.volunteer.volunteer_id || m.volunteer.id) ? 'rgba(19,136,8,0.1)' : 'rgba(255,255,255,0.02)',
                            transition: 'all 0.3s'
                          }}
                        >
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                             <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: '0.6rem' }}>{i+1}</div>
                             <div style={{ fontWeight: 900, color: 'var(--secondary)' }}>{m.score}%</div>
                          </div>
                          <div style={{ fontWeight: 800, fontSize: '0.9rem', marginBottom: '5px' }}>{m.volunteer.name}</div>
                          <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                            {Array.isArray(m.volunteer.skills) ? m.volunteer.skills.slice(0,2).join(', ') : ''}
                          </div>
                        </div>
                      ))}
                    </div>
                    {selectedVolunteer && !appointmentDone && <button className="btn-premium" onClick={handleAppoint} style={{ width: '100%' }}>DEPLOY SELECTED AGENT</button>}
                    {appointmentDone && <div className="animate-fade-in" style={{ textAlign: 'center', color: 'var(--secondary)', fontWeight: 900, fontSize: '1.2rem' }}>MISSION DEPLOYED SUCCESSFULY</div>}
                  </div>
                ) : (
                  <div style={{ height: '350px', overflowY: 'auto', padding: '10px' }}>
                    <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                      <Target size={40} style={{ opacity: 0.2, marginBottom: '10px' }} />
                      <p style={{ fontWeight: 800 }}>SELECT A MISSION TO START AI MATCHING</p>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      {displayTasks.filter(t => t.status === 'open').map(t => (
                        <div key={t.task_id || t.id} className="glass-card" style={{ padding: '15px', cursor: 'pointer', border: '1px solid #111' }} onClick={() => handleMatch(t.task_id || t.id)}>
                          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <span style={{ fontWeight: 800 }}>{t.ngo_name}</span>
                            <span className="badge yellow">{t.priority}</span>
                          </div>
                          <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{t.location}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {activeSection === 'simulation' && (
          <div className="section-content animate-fade-in" style={{ maxWidth: '1400px' }}>
            {(!isVolunteer) && (
              <div style={{ marginBottom: '30px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <h1 style={{ fontSize: '2.8rem', fontWeight: 900, letterSpacing: '-1px' }}>{isAdmin ? 'GIS COMMAND MAPPING' : 'LIVE SEVERITY MAP'}</h1>
                  <p style={{ color: 'var(--text-muted)', marginTop: '8px', fontSize: '1rem' }}>{isAdmin ? 'A live tactical dashboard monitoring verified agent movements, mission hotspots, and real-time deployment status across global zones.' : 'Witness Sahayeta in action: Critical markers blink as our AI engine deploys the optimal volunteer to mission hotspots in real-time.'}</p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', background: 'rgba(255,153,51,0.08)', border: '1px solid rgba(255,153,51,0.2)', borderRadius: '16px', padding: '12px 20px' }}>
                  <div className="animate-pulse" style={{ width: '12px', height: '12px', borderRadius: '50%', background: 'var(--primary)', boxShadow: '0 0 15px var(--primary)' }} />
                  <div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--primary)', fontWeight: 900, letterSpacing: '1px' }}>{isAdmin ? 'GIS ACTIVE' : 'LIVE MODE'}</div>
                    <div style={{ fontSize: '0.6rem', color: 'var(--text-muted)', fontWeight: 700 }}>v4.2 INTERFACE</div>
                  </div>
                </div>
              </div>
            )}

            {/* MAP CONTAINER - Dual Mode (OSM for Admin/Volunteer, Tactical for Public) */}
            <div className="glass-card" style={{ padding: '0', border: '1px solid #222', borderRadius: '20px', overflow: 'hidden', height: '500px', position: 'relative', background: '#050505' }}>
              {isAdmin || isVolunteer ? (
                <>
                  <iframe 
                    width="100%" 
                    height="100%" 
                    frameBorder="0" 
                    scrolling="no" 
                    marginHeight={0} 
                    marginWidth={0} 
                    src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d15000000!2d78.9629!3d20.5937!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sen!2sin!4v1620000000000!5m2!1sen!2sin"
                    style={{ filter: 'invert(90%) hue-rotate(180deg) brightness(0.9) contrast(1.1)', opacity: 0.9 }}
                  />
                  <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', background: 'radial-gradient(circle at 50% 50%, transparent 0%, rgba(0,0,0,0.2) 100%)' }} />
                </>
              ) : (
                <>
                  <div style={{ position: 'absolute', inset: 0, opacity: 0.1, backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', backgroundSize: '50px 50px' }} />
                  {/* Tactical Cross paths */}
                  <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }}>
                    <line x1="20%" y1="20%" x2="80%" y2="80%" stroke="#1a3a5a" strokeWidth="8" strokeDasharray="15 10" opacity="0.3" />
                    <line x1="10%" y1="90%" x2="90%" y2="10%" stroke="#134e4a" strokeWidth="8" strokeDasharray="15 10" opacity="0.3" />
                  </svg>
                </>
              )}

              {/* Simulation markers - Using displayTasks and displayVolunteers (Names, not IDs) */}
              {(!isAdmin && !isVolunteer) && demoNGOTasks.slice(0, 5).map((task, i) => {
                const lat = task.latitude || (20 + (i * 2) % 10);
                const lon = task.longitude || (75 + (i * 3) % 10);
                const x = ((lon - 68.1) / (97.4 - 68.1)) * 100;
                const y = 100 - ((lat - 6.5) / (35.5 - 6.5)) * 100;
                const pColor = task.priority === 'Critical' ? '#ff5c7a' : task.priority === 'High' ? '#ffb84d' : '#7ed957';
                
                return (
                  <div key={task.id} style={{ position: 'absolute', left: `${x}%`, top: `${y}%`, transform: 'translate(-50%, -50%)', zIndex: 20 }}>
                    <div style={{ width: '14px', height: '14px', borderRadius: '50%', background: pColor, boxShadow: `0 0 15px ${pColor}`, animation: 'simPulseGen 2s infinite' }} />
                    <div style={{ position: 'absolute', top: '120%', left: '50%', transform: 'translateX(-50%)', whiteSpace: 'nowrap', background: 'rgba(15,15,20,0.85)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '100px', padding: '4px 12px', fontSize: '0.7rem', color: '#fff', marginTop: '6px', fontWeight: 500 }}>
                      {task.ngoName}
                    </div>
                  </div>
                );
              })}

              {(!isAdmin && !isVolunteer) && displayVolunteers.slice(0, 5).map((v, i) => {
                const isMatched = isLiveSimulating && demoMatchResult && v.volunteer_id === demoMatchResult.volunteer.volunteer_id;
                if (isMatched) return null;

                const lat = v.latitude || (15 + (i * 4) % 15);
                const lon = v.longitude || (72 + (i * 5) % 15);
                const x = ((lon - 68.1) / (97.4 - 68.1)) * 100;
                const y = 100 - ((lat - 6.5) / (35.5 - 6.5)) * 100;
                
                return (
                  <div key={v.id || v.volunteer_id} style={{ position: 'absolute', left: `${x}%`, top: `${y}%`, transform: 'translate(-50%, -50%)', zIndex: 15 }}>
                    <div style={{ width: '26px', height: '26px', borderRadius: '50%', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', fontWeight: 600, color: '#000', boxShadow: '0 0 12px rgba(255,255,255,0.3)' }}>
                      {v.name.substring(0, 1)}
                    </div>
                    <div style={{ position: 'absolute', top: '120%', left: '50%', transform: 'translateX(-50%)', whiteSpace: 'nowrap', background: 'rgba(255,255,255,0.95)', border: '1px solid rgba(0,0,0,0.1)', borderRadius: '100px', padding: '2px 10px', fontSize: '0.65rem', color: '#000', marginTop: '5px', fontWeight: 500 }}>
                      {v.name}
                    </div>
                  </div>
                );
              })}

              {/* Moving matched volunteer - Only for public simulation */}
              {(!isAdmin && !isVolunteer) && demoMatchResult && isLiveSimulating && (() => {
                const startX = ((demoMatchResult.volunteer.longitude! - 68.1) / (97.4 - 68.1)) * 100;
                const startY = 100 - ((demoMatchResult.volunteer.latitude! - 6.5) / (35.5 - 6.5)) * 100;
                const targetX = ((demoMatchResult.task.longitude - 68.1) / (97.4 - 68.1)) * 100;
                const targetY = 100 - ((demoMatchResult.task.latitude - 6.5) / (35.5 - 6.5)) * 100;
                
                return (
                  <>
                    <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 25 }}>
                      <line 
                        x1={`${startX}%`} y1={`${startY}%`} 
                        x2={`${targetX}%`} y2={`${targetY}%`} 
                        stroke="rgba(255,153,51,0.4)" strokeWidth="2" strokeDasharray="5 5" 
                      />
                    </svg>
                    <div style={{ position: 'absolute', left: `${simVolPos.x}%`, top: `${simVolPos.y}%`, transform: 'translate(-50%, -50%)', zIndex: 30, transition: 'left 0.05s linear, top 0.05s linear' }}>
                      <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: '0.8rem', color: '#000', boxShadow: '0 0 20px rgba(255,255,255,0.6)' }}>
                        {demoMatchResult.volunteer.name.substring(0, 1)}
                      </div>
                      <div style={{ position: 'absolute', bottom: '120%', left: '50%', transform: 'translateX(-50%)', whiteSpace: 'nowrap', zIndex: 40 }}>
                        {!simComplete ? (
                          <div style={{ background: 'var(--primary)', color: '#000', padding: '4px 12px', borderRadius: '100px', fontSize: '0.65rem', fontWeight: 800 }}>
                            DEPLOYING: {demoMatchResult.volunteer.name}
                          </div>
                        ) : (
                          <div style={{ background: '#22c55e', color: '#fff', padding: '4px 12px', borderRadius: '100px', fontSize: '0.65rem', fontWeight: 800, border: '1px solid #fff', display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <CheckCircle2 size={10} /> {demoMatchResult.volunteer.name} ARRIVED
                          </div>
                        )}
                      </div>
                    </div>
                  </>
                );
              })()}

              {/* CSS keyframes in style tag */}
              <style>{`
                @keyframes simPulseRed { 0%,100%{ box-shadow: 0 0 0 0 rgba(255,92,122,0.6); } 50%{ box-shadow: 0 0 0 10px rgba(255,92,122,0); } }
                @keyframes simPulseGen { 0%,100%{ box-shadow: 0 0 0 0 rgba(255,255,255,0.2); } 50%{ box-shadow: 0 0 0 8px rgba(255,255,255,0); } }
                @keyframes simPulseOrange { 0%,100%{ box-shadow: 0 0 0 0 rgba(255,153,51,0.5); } 50%{ box-shadow: 0 0 0 12px rgba(255,153,51,0); } }
                @keyframes pulse { 0%,100%{ opacity:1; } 50%{ opacity:0.4; } }
                @keyframes scan { from { transform: translateY(-100%); } to { transform: translateY(100%); } }
                @keyframes float { 0%, 100% { transform: translate(-50%, -50%) translateY(0); } 50% { transform: translate(-50%, -50%) translateY(-5px); } }
              `}</style>
            </div>

            {/* Legend styled like Image 2 */}
            <div style={{ display: 'flex', gap: '16px', marginTop: '24px', flexWrap: 'wrap', justifyContent: 'center' }}>
              {[
                { color: '#ff5c7a', label: 'Critical issue' },
                { color: '#ffb84d', label: 'Moderate issue' },
                { color: '#7ed957', label: 'Low issue' },
                { color: '#ffffff', label: 'Moving volunteer', solid: true },
              ].map(l => (
                <div key={l.label} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.85rem', color: '#fff', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '100px', padding: '10px 20px', fontWeight: 500 }}>
                  <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: l.color, boxShadow: l.solid ? 'none' : `0 0 10px ${l.color}` }} />
                  {l.label}
                </div>
              ))}
            </div>
          </div>
        )}


        {activeSection === 'compare' && (
          <div className="section-content animate-fade-in" style={{ maxWidth: '1400px' }}>
            <div style={{ marginBottom: '40px' }}>
              <h1 style={{ fontSize: '3rem !important' }}>IMPACT ANALYTICS</h1>
              <p style={{ color: 'var(--text-muted)' }}>Real-time comparative analysis of humanitarian interventions.</p>
            </div>
            
            <div className="dashboard-grid">
              <div className="glass-card" style={{ height: '400px' }}>
                <h3>RESOURCE ALLOCATION</h3>
                <div style={{ height: '300px', display: 'flex', alignItems: 'flex-end', gap: '20px', padding: '20px' }}>
                  {[45, 80, 55, 90, 65].map((h, i) => (
                    <div key={i} style={{ flex: 1, height: `${h}%`, background: 'var(--primary)', borderRadius: '5px 5px 0 0', position: 'relative' }}>
                      <span style={{ position: 'absolute', top: '-25px', left: '50%', transform: 'translateX(-50%)', fontSize: '0.7rem' }}>{h}%</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="glass-card" style={{ height: '400px' }}>
                <h3>RESPONSE TIME (MINUTES)</h3>
                <div style={{ height: '300px', display: 'flex', alignItems: 'flex-end', gap: '20px', padding: '20px' }}>
                  {[12, 8, 15, 6, 10].map((h, i) => (
                    <div key={i} style={{ flex: 1, height: `${(h/20)*100}%`, background: 'var(--secondary)', borderRadius: '5px 5px 0 0', position: 'relative' }}>
                      <span style={{ position: 'absolute', top: '-25px', left: '50%', transform: 'translateX(-50%)', fontSize: '0.7rem' }}>{h}m</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeSection === 'assigned-tasks' && isVolunteer && (
          <div className="section-content animate-fade-in" style={{ maxWidth: '1000px' }}>
            <h1 style={{ marginBottom: '40px' }}>MY FIELD ASSIGNMENTS</h1>
            <div className="glass-card" style={{ padding: '30px' }}>
              <h3 style={{ marginBottom: '30px', borderBottom: '1px solid #222', paddingBottom: '15px' }}>CURRENT MISSION STATUS</h3>
              {(() => {
                const myVolId = localVolunteers.find(v => v.email === state.user?.email)?.volunteer_id;
                const myTasks = localTasks.filter(t => t.assigned_volunteer_id === myVolId);
                if (myTasks.length === 0) {
                  return (
                    <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text-muted)' }}>
                      <Zap size={48} style={{ opacity: 0.2, marginBottom: '20px' }} />
                      <p style={{ fontSize: '1.1rem' }}>No active missions have been assigned to your account yet.</p>
                    </div>
                  );
                }
                return (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    {myTasks.map(t => (
                      <div key={t.task_id} className="glass-card" style={{ background: 'rgba(255,255,255,0.03)', padding: '25px', border: '1px solid #333' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '15px' }}>
                          <div>
                            <span className={`badge ${t.priority.toLowerCase()}`} style={{ marginBottom: '10px', display: 'inline-block' }}>{t.priority} PRIORITY</span>
                            <h2 style={{ fontSize: '1.4rem', fontWeight: 900 }}>{t.ngo_name}</h2>
                          </div>
                          <div style={{ fontWeight: 800 }}>ID: {t.task_id}</div>
                        </div>
                        <p style={{ color: 'var(--text-secondary)', marginBottom: '20px' }}>{t.requirements}</p>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', background: 'rgba(0,0,0,0.2)', padding: '15px', borderRadius: '12px' }}>
                          <div><div style={{ fontSize: '0.6rem', color: 'var(--text-muted)' }}>LOCATION</div><div style={{ fontWeight: 700 }}>{t.location}</div></div>
                          <div><div style={{ fontSize: '0.6rem', color: 'var(--text-muted)' }}>SEVERITY</div><div style={{ fontWeight: 700, color: 'var(--primary)' }}>{t.severity_score}% Intensity</div></div>
                        </div>
                      </div>
                    ))}
                  </div>
                );
              })()}
            </div>
          </div>
        )}
      </main>

      <footer style={{ padding: '40px', borderTop: '1px solid #111', marginTop: '60px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div><div style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', color: 'var(--primary)' }}>SAHAYETA</div><div style={{ color: 'var(--text-muted)', fontSize: '0.65rem' }}>AI MISSION CONTROL v2.5.0</div></div>
          <div style={{ color: 'var(--text-muted)', fontSize: '0.65rem' }}>© 2026 SAHAYETA INTEL</div>
        </div>
      </footer>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
