import React, { useState, useEffect, useRef } from 'react';
import { 
  Shield, 
  Heart, 
  Droplet, 
  MessageSquare, 
  Sparkles, 
  Phone, 
  MapPin, 
  User, 
  Users, 
  LogOut, 
  Volume2, 
  Bell, 
  Menu, 
  Mic, 
  X, 
  ChevronRight, 
  AlertTriangle, 
  Plus, 
  Check, 
  Loader2, 
  Share2, 
  FileText, 
  Radio, 
  Info, 
  Copy,
  VolumeX,
  Send,
  Lock,
  PhoneCall,
  Calendar,
  Activity,
  UserCheck,
  Edit,
  Trash2
} from 'lucide-react';
import {
  createContact,
  formatContactPhone,
  normalizePhoneNumber,
  readContacts,
  editContact,
  removeContact,
} from './api/trustedContacts';

// Define TS Types internally
interface Friend {
  id: string;
  name: string;
  phone: string;
  isTracking: boolean;
}

interface ForumPost {
  id: string;
  category: string;
  author: string;
  content: string;
  likes: number;
  comments: number;
  time: string;
  isLikedByUser?: boolean;
}

interface AudioRecord {
  id: string;
  name: string;
  date: string;
  duration: string;
}

interface AppNotification {
  id: string;
  title: string;
  content: string;
  time: string;
  unread: boolean;
}

export default function App() {
  // Mobile shell screen controller
  const [currentScreen, setCurrentScreen] = useState<'home' | 'record' | 'fakecall' | 'help' | 'profile' | 'contacts'>('home');
  
  // App profile configuration
  const [profile, setProfile] = useState({
    name: 'Aarya',
    phone: '+91 9119892200',
    avatarLetter: 'A'
  });
  const [showEditProfileModal, setShowEditProfileModal] = useState(false);

  // Notifications
  const [notifications, setNotifications] = useState<AppNotification[]>([
    { id: '1', title: 'Location shared!', content: 'Live location successfully shared with Mom.', time: 'Just now', unread: true },
    { id: '2', title: 'Stress check-in', content: 'You scored low stress today! Great job.', time: '2 hours ago', unread: true },
    { id: '3', title: 'Siren armed', content: 'Accidental SOS trigger auto-cancellation set to 3s.', time: '1 day ago', unread: false }
  ]);
  const [showNotificationDrawer, setShowNotificationDrawer] = useState(false);
  const [unreadCount, setUnreadCount] = useState(3);

  // SOS States
  const [sosCountdown, setSosCountdown] = useState<number | null>(null);
  const [isSOSActive, setIsSOSActive] = useState(false);
  const [sirenMuted, setSirenMuted] = useState(false);
  const audioContextRef = useRef<AudioContext | null>(null);
  const sirenIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Live Location Simulation
  const [isSharingLocation, setIsSharingLocation] = useState(false);
  const [locCoordinates, setLocCoordinates] = useState<{lat: number, lng: number} | null>(null);
  const [locationPulse, setLocationPulse] = useState(false);

  // Friends List
  const [friends, setFriends] = useState<Friend[]>([]);
  const [showAddFriendModal, setShowAddFriendModal] = useState(false);
  const [newFriendForm, setNewFriendForm] = useState({ name: '', phone: '' });
  const [contactsLoading, setContactsLoading] = useState(true);
  const [savingContact, setSavingContact] = useState(false);
  
  // Selected & Edit Contact States
  const [selectedContact, setSelectedContact] = useState<Friend | null>(null);
  const [showContactDetailsModal, setShowContactDetailsModal] = useState(false);
  const [editingContact, setEditingContact] = useState<Friend | null>(null);
  const [showEditContactModal, setShowEditContactModal] = useState(false);
  const [editContactForm, setEditContactForm] = useState({ name: '', phone: '', isSOS: true });
  const [savingEditContact, setSavingEditContact] = useState(false);
  const [removingContact, setRemovingContact] = useState(false);
  const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState(false);
  const [contactToDeleteId, setContactToDeleteId] = useState<string | null>(null);


  // Fake Call setup
  const [callerSetup, setCallerSetup] = useState({
    name: 'Mom',
    phone: '+91 98765 43210'
  });
  const [showEditCallerModal, setShowEditCallerModal] = useState(false);
  const [fakeCallState, setFakeCallState] = useState<'idle' | 'countdown' | 'ringing' | 'active'>('idle');
  const [callCountdownSecs, setCallCountdownSecs] = useState<number>(3);
  const [activeCallDuration, setActiveCallDuration] = useState<number>(0);
  const [isSpeakerOn, setIsSpeakerOn] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [callDialLog, setCallDialLog] = useState<string[]>([]);
  const callTimerRef = useRef<NodeJS.Timeout | null>(null);
  const incomingCallIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Audio Recorder
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [autoUploadSOS, setAutoUploadSOS] = useState(true);
  const [recordedClips, setRecordedClips] = useState<AudioRecord[]>([
    { id: '1', name: 'Safe Transit - Metro Trip', date: 'June 18, 2026 10:15 PM', duration: '02:45' },
    { id: '2', name: 'Uber Ride - Central Link', date: 'June 17, 2026 08:30 PM', duration: '15:10' }
  ]);
  const recordingTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Sub-modules state
  const [activeQuiz, setActiveQuiz] = useState(false);
  const [quizStep, setQuizStep] = useState(0);
  const [quizAnswers, setQuizAnswers] = useState<number[]>([]);
  const [quizResult, setQuizResult] = useState<string | null>(null);

  const [activeCycle, setActiveCycle] = useState(false);
  const [lastPeriodDate, setLastPeriodDate] = useState('2026-06-05');
  const [cycleSymptoms, setCycleSymptoms] = useState<string[]>(['Cramps', 'Headache']);

  const [activeForum, setActiveForum] = useState(false);
  const [selectedForumCategory, setSelectedForumCategory] = useState('Safety Tips');
  const [newForumPost, setNewForumPost] = useState('');
  const [forumPosts, setForumPosts] = useState<ForumPost[]>([
    { id: '1', category: 'Safety Tips', author: 'Anjali_98', content: 'Always walk with confidence and map your path before leaving. If a cab driver goes off course, open your live tracker and call mom loudly.', likes: 24, comments: 5, time: '30m ago' },
    { id: '2', category: 'General', author: 'SereneMind', content: 'What are the best self defense seminars in south Delhi? Looking to register next weekend.', likes: 11, comments: 8, time: '2h ago' },
    { id: '3', category: 'Alerts', author: 'SafeExplorer', content: 'Streetlights are broken near Sector 4 transit hub. Please walk key sectors in groups or request police patrolling.', likes: 45, comments: 12, time: '4h ago' }
  ]);

  const [activePCOS, setActivePCOS] = useState(false);
  const [pcosChecklist, setPcosChecklist] = useState({
    irregularCycles: true,
    acne: false,
    moodSwings: true,
    tiredness: true
  });

  // Outbound Dial Screen Mock (for Help Section)
  const [outboundCallingCode, setOutboundCallingCode] = useState<string | null>(null);
  const [outboundCallStatus, setOutboundCallStatus] = useState<string | null>(null);

  // Hamburger drawer menu
  const [showMenuDrawer, setShowMenuDrawer] = useState(false);

  // Code exporter modal
  const [showExportModal, setShowExportModal] = useState(false);
  const [wasCopied, setWasCopied] = useState(false);

  // Calculate unread notifications
  useEffect(() => {
    setUnreadCount(notifications.filter(n => n.unread).length);
  }, [notifications]);

  // Audio recording timer simulation
  useEffect(() => {
    if (isRecording) {
      recordingTimerRef.current = setInterval(() => {
        setRecordingSeconds(prev => prev + 1);
      }, 1000);
    } else {
      if (recordingTimerRef.current) clearInterval(recordingTimerRef.current);
    }
    return () => {
      if (recordingTimerRef.current) clearInterval(recordingTimerRef.current);
    };
  }, [isRecording]);

  // Handle Location Sharing Tracker pulse
  useEffect(() => {
    let pulse: NodeJS.Timeout;
    if (isSharingLocation) {
      pulse = setInterval(() => {
        setLocationPulse(p => !p);
      }, 1500);
    }
    return () => clearInterval(pulse);
  }, [isSharingLocation]);

  // Siren alert tone synthesis logic
  const startSirenAudio = () => {
    if (sirenMuted) return;
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      
      const ctx = new AudioCtx();
      audioContextRef.current = ctx;

      let up = true;
      let freq = 600;

      sirenIntervalRef.current = setInterval(() => {
        if (ctx.state === 'suspended') {
          ctx.resume();
        }
        
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        
        osc.type = 'sawtooth';
        
        if (up) freq += 150;
        else freq -= 150;
        
        if (freq > 1100) up = false;
        if (freq < 500) up = true;

        osc.frequency.setValueAtTime(freq, ctx.currentTime);
        gain.gain.setValueAtTime(0.3, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);
        
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.15);
      }, 160);

    } catch (e) {
      console.warn('Audio Web API error', e);
    }
  };

  const stopSirenAudio = () => {
    if (sirenIntervalRef.current) {
      clearInterval(sirenIntervalRef.current);
      sirenIntervalRef.current = null;
    }
    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }
  };

  // SOS Countdown handle
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (sosCountdown !== null && sosCountdown > 0) {
      timer = setTimeout(() => {
        setSosCountdown(sosCountdown - 1);
      }, 1000);
    } else if (sosCountdown === 0) {
      setSosCountdown(null);
      setIsSOSActive(true);
      pushNotification('EMERGENCY ACTIVE!', 'SOS siren sounding and contacts notified.');
      startSirenAudio();
    }
    return () => clearTimeout(timer);
  }, [sosCountdown]);

  useEffect(() => {
    let cancelled = false;

    const loadContacts = async () => {
      setContactsLoading(true);
      try {
        const contacts = await readContacts();
        if (cancelled) return;

        setFriends(
          contacts.map((contact) => ({
            id: String(contact.id),
            name: contact.name,
            phone: formatContactPhone(contact),
            isTracking: contact.isSOS,
          }))
        );
      } catch (error) {
        if (!cancelled) {
          pushNotification(
            'Could not load contacts',
            error instanceof Error ? error.message : 'Failed to fetch emergency contacts.'
          );
        }
      } finally {
        if (!cancelled) {
          setContactsLoading(false);
        }
      }
    };

    loadContacts();

    return () => {
      cancelled = true;
    };
  }, []);

  // Fake Phone Call active durational stopwatch
  useEffect(() => {
    if (fakeCallState === 'active') {
      callTimerRef.current = setInterval(() => {
        setActiveCallDuration(prev => prev + 1);
      }, 1000);
    } else {
      if (callTimerRef.current) {
        clearInterval(callTimerRef.current);
        callTimerRef.current = null;
      }
      setActiveCallDuration(0);
    }
    return () => {
      if (callTimerRef.current) clearInterval(callTimerRef.current);
    };
  }, [fakeCallState]);

  // Ringtone synthesizer trigger helper
  const playFakeRingtone = () => {
    let beepCount = 0;
    incomingCallIntervalRef.current = setInterval(() => {
      try {
        const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
        if (!AudioCtx) return;
        const ctx = new AudioCtx();
        const osc = ctx.createOscillator();
        const osc2 = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.frequency.setValueAtTime(440, ctx.currentTime);
        osc2.frequency.setValueAtTime(480, ctx.currentTime);
        gain.gain.setValueAtTime(0.2, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 1.2);

        osc.connect(gain);
        osc2.connect(gain);
        gain.connect(ctx.destination);

        osc.start();
        osc2.start();
        osc.stop(ctx.currentTime + 1.2);
        osc2.stop(ctx.currentTime + 1.2);
        
        beepCount++;
        if (beepCount > 10 && fakeCallState === 'ringing') {
          // auto decline after 10 rings
          declineCall();
        }
      } catch (err) {
        // fallback
      }
    }, 2500);
  };

  // Trigger Fake Call sequence with armed notification timer
  const triggerFakeCallNow = () => {
    setFakeCallState('countdown');
    setCallCountdownSecs(3);
    pushNotification('Call Armed', 'Incoming call is scheduled in 3 seconds.');
    
    const countInterval = setInterval(() => {
      setCallCountdownSecs(prev => {
        if (prev <= 1) {
          clearInterval(countInterval);
          setFakeCallState('ringing');
          playFakeRingtone();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const acceptCall = () => {
    if (incomingCallIntervalRef.current) {
      clearInterval(incomingCallIntervalRef.current);
    }
    setFakeCallState('active');
    setCallDialLog([
      'Hello dear, are you there?',
      "I am waiting near the cafe. Let's head out.",
      'Just walk calmly, I have called your dad too.',
      'Stay on the line, okay? I am right here.'
    ]);
  };

  const declineCall = () => {
    if (incomingCallIntervalRef.current) {
      clearInterval(incomingCallIntervalRef.current);
    }
    setFakeCallState('idle');
  };

  // Format stopwatch digits
  const formatTime = (secs: number) => {
    const mm = Math.floor(secs / 60).toString().padStart(2, '0');
    const ss = (secs % 60).toString().padStart(2, '0');
    return `${mm}:${ss}`;
  };

  const pushNotification = (title: string, content: string) => {
    const newNo = {
      id: Date.now().toString(),
      title,
      content,
      time: 'Just now',
      unread: true
    };
    setNotifications(prev => [newNo, ...prev]);
  };

  const toggleLocationSharing = () => {
    if (!isSharingLocation) {
      setIsSharingLocation(true);
      setLocCoordinates({ lat: 12.9716, lng: 77.5946 }); 
      pushNotification('Location Sharing On', 'Your emergency contacts can track you live now.');
    } else {
      setIsSharingLocation(false);
      setLocCoordinates(null);
      pushNotification('Location Sharing Off', 'Stopped sharing live coordinates.');
    }
  };

  const handleAddFriend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFriendForm.name || !newFriendForm.phone || savingContact) return;

    setSavingContact(true);
    try {
      const phoneNumber = normalizePhoneNumber(newFriendForm.phone);
      const contact = await createContact({
        name: newFriendForm.name.trim(),
        phone_number: phoneNumber,
        is_sos_contact: true,
      });

      const newFr: Friend = {
        id: String(contact.id),
        name: contact.name,
        phone: formatContactPhone(contact),
        isTracking: contact.isSOS,
      };

      setFriends((prev) => [...prev, newFr]);
      setNewFriendForm({ name: '', phone: '' });
      setShowAddFriendModal(false);
      pushNotification('Added Friend', `${newFr.name} is now added for emergency SOS tracking.`);
    } catch (error) {
      pushNotification(
        'Could not add contact',
        error instanceof Error ? error.message : 'Failed to save emergency contact.'
      );
    } finally {
      setSavingContact(false);
    }
  };

  const handleEditContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingContact || !editContactForm.name || !editContactForm.phone || savingEditContact) return;

    setSavingEditContact(true);
    try {
      const phoneNumber = normalizePhoneNumber(editContactForm.phone);
      const contact = await editContact(Number(editingContact.id), {
        name: editContactForm.name.trim(),
        phone_number: phoneNumber,
        is_sos_contact: editContactForm.isSOS,
      });

      const updatedFr: Friend = {
        id: String(contact.id),
        name: contact.name,
        phone: formatContactPhone(contact),
        isTracking: contact.isSOS,
      };

      setFriends((prev) => prev.map((f) => (f.id === updatedFr.id ? updatedFr : f)));
      setShowEditContactModal(false);
      setEditingContact(null);
      
      if (selectedContact?.id === updatedFr.id) {
        setSelectedContact(updatedFr);
      }

      pushNotification('Updated Contact', `${updatedFr.name}'s details successfully updated.`);
    } catch (error) {
      pushNotification(
        'Could not update contact',
        error instanceof Error ? error.message : 'Failed to update emergency contact.'
      );
    } finally {
      setSavingEditContact(false);
    }
  };

  const initiateRemoveContact = (id: string) => {
    setContactToDeleteId(id);
    setShowDeleteConfirmModal(true);
  };

  const confirmRemoveContact = async () => {
    if (!contactToDeleteId) return;

    setRemovingContact(true);
    try {
      await removeContact(Number(contactToDeleteId));
      setFriends((prev) => prev.filter((f) => f.id !== contactToDeleteId));
      
      if (selectedContact?.id === contactToDeleteId) {
        setShowContactDetailsModal(false);
        setSelectedContact(null);
      }

      pushNotification('Removed Contact', 'Emergency contact successfully removed.');
    } catch (error) {
      pushNotification(
        'Could not remove contact',
        error instanceof Error ? error.message : 'Failed to delete emergency contact.'
      );
    } finally {
      setRemovingContact(false);
      setShowDeleteConfirmModal(false);
      setContactToDeleteId(null);
    }
  };

  const toggleTrackFriend = (id: string) => {
    setFriends(prev => prev.map(f => f.id === id ? { ...f, isTracking: !f.isTracking } : f));
  };

  // STRESS QUIZ logic handling
  const startStressQuiz = () => {
    setActiveQuiz(true);
    setQuizStep(0);
    setQuizAnswers([]);
    setQuizResult(null);
  };

  const handleQuizAnswer = (weight: number) => {
    const newAnswers = [...quizAnswers, weight];
    setQuizAnswers(newAnswers);

    if (quizStep < 4) {
      setQuizStep(quizStep + 1);
    } else {
      const sum = newAnswers.reduce((a, b) => a + b, 0);
      let res = '';
      if (sum < 8) res = 'Low Stress - You are calm and stable. Keep doing your mindfulness!';
      else if (sum < 15) res = 'Moderate Anxiety - Try focusing on breathing for 2 minutes.';
      else res = 'High Tension detected. Consider sending a calm text or trigger a chat.';
      setQuizResult(res);
      pushNotification('Wellness Completed', 'Quiz assessment record logged.');
    }
  };

  const handleCycleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLastPeriodDate(e.target.value);
  };

  const toggleSymptom = (sym: string) => {
    if (cycleSymptoms.includes(sym)) {
      setCycleSymptoms(cycleSymptoms.filter(s => s !== sym));
    } else {
      setCycleSymptoms([...cycleSymptoms, sym]);
    }
  };

  // FORUM interaction
  const handleLikePost = (postId: string) => {
    setForumPosts(posts => posts.map(p => {
      if (p.id === postId) {
        return {
          ...p,
          likes: p.isLikedByUser ? p.likes - 1 : p.likes + 1,
          isLikedByUser: !p.isLikedByUser
        };
      }
      return p;
    }));
  };

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newForumPost.trim()) return;
    const np: ForumPost = {
      id: Date.now().toString(),
      category: selectedForumCategory,
      author: 'Anonymous Sister',
      content: newForumPost,
      likes: 1,
      comments: 0,
      time: 'Just now'
    };
    setForumPosts([np, ...forumPosts]);
    setNewForumPost('');
    pushNotification('Forum Post Submitted', 'Sent anonymously to the community wall.');
  };

  // AUDIO RECORD actions
  const toggleRecording = () => {
    if (!isRecording) {
      setIsRecording(true);
      setRecordingSeconds(0);
      pushNotification('Audio Record On', 'Quietly recording ambient sound for your records.');
    } else {
      setIsRecording(false);
      const newCl: AudioRecord = {
        id: Date.now().toString(),
        name: `Audio log - SafeWalk ${new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}`,
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        duration: formatTime(recordingSeconds)
      };
      setRecordedClips([newCl, ...recordedClips]);
      pushNotification('Audio clip saved', `Securely stored log: ${newCl.duration}`);
    }
  };

  // Outbound Dialers Simulation
  const triggerEmergencyOutbound = (code: string, desc: string) => {
    setOutboundCallingCode(code);
    setOutboundCallStatus('Establishing secure digital link...');
    // Simulated steps
    setTimeout(() => {
      setOutboundCallStatus(`Connecting to the emergency operator standard cell...`);
    }, 1500);
    setTimeout(() => {
      setOutboundCallStatus(`Sending GPS Coordinates to dispatch control terminal!`);
    }, 3000);
  };

  const closeNotifications = () => {
    // mark all read
    setNotifications(prev => prev.map(n => ({ ...n, unread: false })));
    setShowNotificationDrawer(false);
  };

  const copyExportCode = () => {
    const rawHTML = generateRawStandaloneHtml();
    navigator.clipboard.writeText(rawHTML);
    setWasCopied(true);
    setTimeout(() => setWasCopied(false), 2000);
  };

  // STANDALONE SINGLE-FILE HTML GENERATOR FOR EASY COPY-CONFORMANCE
  const generateRawStandaloneHtml = () => {
    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>SafeHer - Personal Safety Companion</title>
  <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap" rel="stylesheet">
  <style>
    /* SafeHer Raw Standalone CSS stylesheet styling */
    :root {
      --font-sans: 'Poppins', sans-serif;
      --bg-app: #FAF6F8;
      --primary: #E91E63;
      --primary-hover: #D81B60;
      --primary-light: #FCE4EC;
      --dark-purple: #3F1D38;
      --card-bg: #FFFFFF;
      --text-main: #2C2529;
      --text-muted: #7D7379;
      --shadow-subtle: 0 4px 12px rgba(63, 29, 56, 0.05);
      --radius-card: 24px;
    }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: var(--font-sans);
      background-color: #120F11;
      color: var(--text-main);
      min-height: 100vh;
      display: flex;
      justify-content: center;
      align-items: center;
    }
    .device {
      width: 100%;
      max-width: 412px;
      height: 846px;
      background-color: var(--bg-app);
      border-radius: 40px;
      box-shadow: 0 25px 50px rgba(0,0,0,0.5), 0 0 0 12px #2A2428;
      position: relative;
      overflow: hidden;
      display: flex;
      flex-direction: column;
    }
    @media (max-width: 450px) {
      .device { max-width: 100%; height: 100vh; border-radius: 0; }
    }
    /* Top Bar */
    .top-bar {
      height: 72px;
      background: var(--card-bg);
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 24px;
      box-shadow: var(--shadow-subtle);
    }
    .brand { display: flex; align-items: center; gap: 12px; color: var(--primary); font-weight: 700; font-size: 20px; }
    .brand-logo { width: 36px; height: 36px; background: var(--primary); border-radius: 10px; display: flex; align-items: center; justify-content: center; color: white; }
    /* Screens container */
    .content { flex: 1; overflow-y: auto; padding: 24px 24px 96px; }
    .screen { display: none; }
    .screen.active { display: block; }
    /* Cards */
    .m-card { background: white; border-radius: var(--radius-card); padding: 20px; box-shadow: var(--shadow-subtle); margin-bottom: 20px; }
    /* Bottom Navigation bar */
    .nav { position: absolute; bottom: 0; left: 0; right: 0; height: 80px; background: white; display: flex; justify-content: space-around; align-items: center; }
    .nav-tab { background: none; border: none; color: var(--text-muted); cursor: pointer; font-size: 11px; font-weight: 500; display: flex; flex-direction: column; align-items: center; gap: 4px; }
    .nav-tab.active { color: var(--primary); font-weight: bold; }
    .sos-btn { width: 64px; height: 64px; background: var(--primary); border: 4px solid var(--bg-app); border-radius: 50%; color: white; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 10px rgba(0,0,0,0.1); margin-top: -30px; font-weight: 700; font-size: 14px; cursor: pointer; }
    /* Styled buttons */
    .vibrant-btn { background: var(--primary); color: white; border: none; padding: 14px 24px; border-radius: 30px; font-weight: 600; cursor: pointer; width: 100%; text-align: center; font-size: 14px; }
  </style>
</head>
<body>
  <div class="device">
    <!-- Top Bar -->
    <div class="top-bar">
      <div class="brand">
        <div class="brand-logo">🛡️</div>
        <span>SafeHer</span>
      </div>
      <div>🔔</div>
    </div>

    <!-- Screen Container -->
    <div class="content">
      <!-- Screen 1: Home View -->
      <div id="home" class="screen active">
        <p style="color: var(--text-muted); margin-bottom: 20px;">Share live location with friends</p>
        <div class="m-card" style="background:#EFE9EC; height: 200px; display: flex; flex-direction: column; justify-content: center; align-items: center; text-align: center; padding: 24px;">
          <p style="margin-bottom: 16px; color: var(--text-muted);">Enable location to continue</p>
          <button class="vibrant-btn" onclick="alert('Location sharing simulation started!')">Share my location</button>
        </div>
        <div class="m-card" style="display: flex; justify-content: space-between; align-items: center;">
          <div>
            <h4 style="font-size: 14px;">No friends yet</h4>
            <p style="font-size: 11px; color: var(--text-muted);">Add friends for SOS & Track me</p>
          </div>
          <button style="background: var(--dark-purple); color: white; border: none; padding: 8px 16px; border-radius: 12px; font-weight: 600; cursor: pointer;" onclick="alert('Add contact modal triggered!')">Add</button>
        </div>
        
        <h3 style="margin-top: 20px; margin-bottom: 15px;">Quick Access</h3>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
          <div class="m-card" onclick="alert('Stress Check triggers quiz')">
            <div style="font-size: 24px; margin-bottom: 10px;">❤️</div>
            <h4 style="font-size: 13px;">Stress Check</h4>
            <p style="font-size: 10px; color: var(--text-muted)">Quick quiz</p>
          </div>
          <div class="m-card" onclick="alert('Cycle Tracker active')">
            <div style="font-size: 24px; margin-bottom: 10px;">💧</div>
            <h4 style="font-size: 13px;">Cycle Tracker</h4>
            <p style="font-size: 10px; color: var(--text-muted)">Period & fertility</p>
          </div>
          <div class="m-card" onclick="alert('Anonymous Forum loaded')">
            <div style="font-size: 24px; margin-bottom: 10px;">💬</div>
            <h4 style="font-size: 13px;">Anonymous Forum</h4>
            <p style="font-size: 10px; color: var(--text-muted)">Community</p>
          </div>
          <div class="m-card" onclick="alert('PCOS Support guide')">
            <div style="font-size: 24px; margin-bottom: 10px;">🌸</div>
            <h4 style="font-size: 13px;">PCOS Support</h4>
            <p style="font-size: 10px; color: var(--text-muted)">Health tips</p>
          </div>
        </div>
      </div>

      <!-- Other screens follow layout constraints but are simplified in standard output -->
    </div>

    <!-- Bottom Nav -->
    <div class="nav">
      <button class="nav-tab active" onclick="switchTab('home')">Home</button>
      <button class="nav-tab" onclick="alert('Audio recorder feature enabled')">Record</button>
      <button class="sos-btn" onclick="alert('ACTIVE EMERGENCY SOS PROTOCOLS LAUNCHED!')">SOS</button>
      <button class="nav-tab" onclick="alert('Incoming fake call armed!')">Fake Call</button>
      <button class="nav-tab" onclick="alert('Emergency Dial list loaded')">Help</button>
    </div>
  </div>

  <script>
    function switchTab(id) {
       document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
       const sc = document.getElementById(id);
       if(sc) sc.classList.add('active');
       document.querySelectorAll('.nav-tab').forEach(t => t.classList.remove('active'));
       event.currentTarget.classList.add('active');
    }
  </script>
</body>
</html>`;
  };

  return (
    <div id="safeher-app-root">
      {/* Centering phone simulation container */}
      <div className="device-container">
        
        {/* Simulated Status Bar top */}
        <div className="mobile-system-status-bar">
          <span style={{ fontSize: '11px', fontWeight: 600 }}>09:41</span>
          <div className="mobile-system-icons">
            <Radio className="system-icon" style={{ transform: 'scale(0.8)', strokeWidth: '3' }} />
            <span style={{ fontSize: '10px' }}>5G</span>
            <span style={{ marginLeft: '4px' }}>🔋 100%</span>
          </div>
        </div>

        {/* Top App Bar Header */}
        <header className="top-bar" id="safeher-header">
          <div className="brand-section" onClick={() => { setCurrentScreen('home'); setActiveQuiz(false); setActiveCycle(false); setActiveForum(false); setActivePCOS(false); }}>
            <div className="brand-logo-container">
              <Shield fill="#FFFFFF" stroke="#FFFFFF" />
            </div>
            <h1 className="brand-title">SafeHer</h1>
          </div>

          <div className="header-actions">
            {/* Notification bell */}
            <button className="icon-btn" id="bell-notif-btn" onClick={() => setShowNotificationDrawer(true)}>
              <Bell size={21} />
              {unreadCount > 0 && <span className="badge"></span>}
            </button>
            {/* Hamburger menu */}
            <button className="icon-btn" id="menu-drawer-btn" onClick={() => setShowMenuDrawer(true)}>
              <Menu size={22} strokeWidth={2.5} />
            </button>
          </div>
        </header>

        {/* Main Content Area supporting scrolling */}
        <main className="screens-container">

          {/* SCREEN 1: HOME VIEW */}
          <section className={`screen ${currentScreen === 'home' && !activeQuiz && !activeCycle && !activeForum && !activePCOS ? 'active' : ''}`} id="screen-home">
            <p className="screen-subtitle">Share live location with friends</p>
            
            {/* Interactive Location Placeholder Card */}
            <div className="map-placeholder" id="card-location-dashboard">
              <div className="map-background-visual"></div>
              <div className="map-grid-lines"></div>
              
              <div className="map-status-overlay">
                <div className="logo-pin-pulsing">
                  <MapPin size={28} className="map-pin" fill={isSharingLocation ? "#E91E63" : "#7D7379"} />
                  {isSharingLocation && <div className="map-pin-pulse"></div>}
                </div>
                {isSharingLocation ? (
                  <div>
                    <h4 style={{ color: '#2C2529', fontWeight: '700', fontSize: '15px' }}>Live tracking initialized</h4>
                    <p style={{ fontSize: '11px', marginTop: '2px', fontFamily: 'var(--font-mono)' }}>
                      Lat: {locCoordinates?.lat.toFixed(4)}, Lng: {locCoordinates?.lng.toFixed(4)}
                    </p>
                  </div>
                ) : (
                  <p style={{ fontWeight: 500 }}>Enable location to continue</p>
                )}
              </div>

              <button 
                className="vibrant-pink-btn" 
                id="btn-share-location" 
                onClick={toggleLocationSharing}
              >
                {isSharingLocation ? (
                  <>
                    <X size={16} /> Stop Sharing
                  </>
                ) : (
                  <>
                    <Share2 size={16} /> Share my location
                  </>
                )}
              </button>
            </div>

            {/* Horizontal Friends List section */}
            <div 
              className="friends-tracker-card" 
              id="card-friends-summary"
              onClick={() => setCurrentScreen('contacts')}
              style={{ cursor: 'pointer' }}
            >
              <div className="friends-tracker-details">
                {contactsLoading ? (
                  <>
                    <h4 className="friends-tracker-title">Loading contacts...</h4>
                    <p className="friends-tracker-subtext">Fetching your emergency contacts</p>
                  </>
                ) : friends.length === 0 ? (
                  <>
                    <h4 className="friends-tracker-title">No friends yet</h4>
                    <p className="friends-tracker-subtext">Add friends for SOS & Track me</p>
                  </>
                ) : (
                  <>
                    <h4 className="friends-tracker-title">{friends.length} Emergency contact{friends.length > 1 ? 's' : ''} armed</h4>
                    <p className="friends-tracker-subtext">
                      Click to view and manage your trusted list
                    </p>
                  </>
                )}
              </div>
              <button 
                className="add-compact-btn" 
                id="btn-add-friend-trigger" 
                onClick={(e) => {
                  e.stopPropagation();
                  setShowAddFriendModal(true);
                }}
              >
                <Plus size={15} strokeWidth={3} /> Add
              </button>
            </div>



            <h2 className="section-title">Quick Access</h2>
            
            {/* Quick Access category Grid (2 columns) */}
            <div className="quick-access-grid">
              
              {/* Stress Check Card */}
              <div className="quick-card" id="qa-stress-check" onClick={startStressQuiz}>
                <div className="icon-container-pink">
                  <Heart size={22} fill="currentColor" />
                </div>
                <h3 className="quick-card-title quick-card-title-p">Stress Check</h3>
                <p className="quick-card-subtext">Quick quiz</p>
              </div>

              {/* Cycle Tracker Card */}
              <div className="quick-card" id="qa-cycle-tracker" onClick={() => setActiveCycle(true)}>
                <div className="icon-container-pink">
                  <Droplet size={22} fill="currentColor" />
                </div>
                <h3 className="quick-card-title quick-card-title-c">Cycle Tracker</h3>
                <p className="quick-card-subtext">Period & fertility</p>
              </div>

              {/* Anonymous Forum Card */}
              <div className="quick-card" id="qa-anonymous-forum" onClick={() => setActiveForum(true)}>
                <div className="icon-container-blue">
                  <MessageSquare size={22} fill="currentColor" />
                </div>
                <h3 className="quick-card-title quick-card-title-f">Anonymous Forum</h3>
                <p className="quick-card-subtext">Community discussion</p>
              </div>

              {/* PCOS Support card */}
              <div className="quick-card" id="qa-pcos-support" onClick={() => setActivePCOS(true)}>
                <div className="icon-container-green">
                  <Sparkles size={22} fill="currentColor" />
                </div>
                <h3 className="quick-card-title quick-card-title-pcos">PCOS Support</h3>
                <p className="quick-card-subtext">Health & updates</p>
              </div>

            </div>

            {/* Quick Disclaimer / App Exporter promotion */}
            <div className="export-code-panel">
              <h3 className="export-code-header">
                <FileText size={18} />
                Standalone HTML Exporter
              </h3>
              <p className="export-code-desc">
                Perfect for developers. Extract the complete pure HTML, offline CSS styles, and vanilla JS logic in a single file with one copy!
              </p>
              <button className="export-trigger-btn" onClick={() => setShowExportModal(true)}>
                <Copy size={15} /> Export Clean Layout Code
              </button>
            </div>

          </section>


          {/* SUB-SCREEN: STRESS CHECK QUIZ MODULE */}
          {activeQuiz && (
            <section className="screen active" id="sub-stress-quiz">
              <div className="modal-header-row" style={{ marginBottom: '12px' }}>
                <h2 className="section-title" style={{ marginTop: '0', marginBottom: '0' }}>Stress Assessment</h2>
                <button className="icon-btn" onClick={() => setActiveQuiz(false)}>
                  <X size={20} />
                </button>
              </div>
              <p className="screen-subtitle">Mindfulness diagnostic wellness checker</p>
              
              <div className="m-card">
                <div className="quiz-progress-bar-container">
                  <div className="quiz-progress-fill" style={{ width: `${((quizStep + (quizResult ? 1 : 0)) / 5) * 100}%` }}></div>
                </div>

                {!quizResult ? (
                  <div className="quiz-question-card">
                    <span className="forum-post-tag-custom" style={{ marginBottom: '12px', display: 'inline-block' }}>QUESTION {quizStep + 1} OF 5</span>
                    <h3 className="quiz-question-title">
                      {quizStep === 0 && "How physically safe do you feel in your current environment or transit path?"}
                      {quizStep === 1 && "Do you feel rapid heart rates, sweaty palms, or hypervigilance?"}
                      {quizStep === 2 && "How composed do you feel about coordinating dynamic navigation decisions?"}
                      {quizStep === 3 && "Have you practiced your mindful focus breathing sequences today?"}
                      {quizStep === 4 && "Choose your primary psychological priority right now:"}
                    </h3>
                    <div className="quiz-option-list">
                      <button className="quiz-option-btn" onClick={() => handleQuizAnswer(1)}>
                        {quizStep === 0 && "Totally secure & well-lit"}
                        {quizStep === 1 && "Not at all, very calm"}
                        {quizStep === 2 && "Extremely composed"}
                        {quizStep === 3 && "Yes, did my exercises"}
                        {quizStep === 4 && "Rest and recover safely"}
                      </button>
                      <button className="quiz-option-btn" onClick={() => handleQuizAnswer(2)}>
                        {quizStep === 0 && "Slight discomfort / suspicious alleys"}
                        {quizStep === 1 && "Occasionally mild heart thumps"}
                        {quizStep === 2 && "Somewhat anxious but coping"}
                        {quizStep === 3 && "Not yet, planning soon"}
                        {quizStep === 4 && "Increase situational awareness"}
                      </button>
                      <button className="quiz-option-btn" onClick={() => handleQuizAnswer(4)}>
                        {quizStep === 0 && "Highly apprehensive / dark surroundings"}
                        {quizStep === 1 && "Very intense feeling, nervous"}
                        {quizStep === 2 && "Completely disoriented/nervous"}
                        {quizStep === 3 && "No, too stressed or busy"}
                        {quizStep === 4 && "Immediate emergency protection"}
                      </button>
                    </div>
                  </div>
                ) : (
                  <div style={{ textAlign: 'center', padding: '24px 0' }}>
                    <div className="icon-container-pink" style={{ margin: '0 auto 16px', width: '56px', height: '56px' }}>
                      <Heart size={28} fill="currentColor" />
                    </div>
                    <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '12px' }}>Your Stress Level</h3>
                    <p style={{ fontSize: '14px', color: 'var(--text-main)', padding: '0 10px', lineHeight: '1.6', marginBottom: '24px' }}>
                      {quizResult}
                    </p>
                    
                    {/* Interactive Guided Breath Simulator */}
                    <div style={{ backgroundColor: 'var(--bg-app)', borderRadius: '16px', padding: '16px', marginBottom: '24px' }}>
                      <h4 style={{ fontSize: '12px', fontWeight: '700', color: 'var(--primary)', textTransform: 'uppercase', marginBottom: '12px' }}>Interactive Guided Breathing</h4>
                      <div className="record-mic-button recording" style={{ margin: '0 auto 12px', width: '64px', height: '64px', animation: 'beat 4s infinite ease-in-out' }}>
                        <span style={{ fontSize: '11px', fontWeight: 'bold' }}>BREATHE</span>
                      </div>
                      <p style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Follow the pulsing circle. Inhale... Hold... Exhale...</p>
                    </div>

                    <button className="vibrant-pink-btn" onClick={() => setActiveQuiz(false)}>
                      Return to Dashboard
                    </button>
                  </div>
                )}
              </div>
            </section>
          )}


          {/* SUB-SCREEN: CYCLE TRACKER period tracker */}
          {activeCycle && (
            <section className="screen active" id="sub-cycle-tracker">
              <div className="modal-header-row" style={{ marginBottom: '12px' }}>
                <h2 className="section-title" style={{ marginTop: '0', marginBottom: '0' }}>Cycle Tracker</h2>
                <button className="icon-btn" onClick={() => setActiveCycle(false)}>
                  <X size={20} />
                </button>
              </div>
              <p className="screen-subtitle">Period, fertility, and wellness calculator</p>

              <div className="m-card" style={{ textAlign: 'center' }}>
                <div className="calendar-circle-widget">
                  <span className="calendar-counter">14</span>
                  <span className="calendar-label">Days Until Period</span>
                </div>

                <div className="m-form-group" style={{ textAlign: 'left' }}>
                  <label className="m-form-label">When did your last cycle start?</label>
                  <input 
                    type="date" 
                    className="m-form-input" 
                    value={lastPeriodDate} 
                    onChange={handleCycleDateChange}
                  />
                </div>

                <div style={{ textAlign: 'left', marginTop: '20px' }}>
                  <h4 style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-main)' }}>Log Today's Symptoms</h4>
                  <div className="symptoms-selector-flex">
                    {['Cramps', 'Headache', 'Bloating', 'Mood Swings', 'Fatigue', 'Acne', 'Nausea'].map(symptom => (
                      <span 
                        key={symptom} 
                        className={`symptom-tag ${cycleSymptoms.includes(symptom) ? 'active' : ''}`}
                        onClick={() => toggleSymptom(symptom)}
                      >
                        {cycleSymptoms.includes(symptom) ? '✓ ' : ''}{symptom}
                      </span>
                    ))}
                  </div>
                </div>

                <div style={{ marginTop: '24px', textAlign: 'left', backgroundColor: 'var(--primary-light)', padding: '16px', borderRadius: '16px' }}>
                  <h4 style={{ fontSize: '12px', fontWeight: '700', color: 'var(--primary)', marginBottom: '4px' }}>💡 Period Wellness tip</h4>
                  <p style={{ fontSize: '11px', color: 'var(--text-main)', lineHeight: '1.5' }}>
                    Slight pelvic cramps are estimated. Magnesium-rich foods (dark chocolate, pumpkin seeds, bananas) and hydration aid muscular recovery.
                  </p>
                </div>
              </div>
            </section>
          )}


          {/* SUB-SCREEN: ANONYMOUS FORUM feed */}
          {activeForum && (
            <section className="screen active" id="sub-anonymous-forum">
              <div className="modal-header-row" style={{ marginBottom: '12px' }}>
                <h2 className="section-title" style={{ marginTop: '0', marginBottom: '0' }}>Sister Circle Forum</h2>
                <button className="icon-btn" onClick={() => setActiveForum(false)}>
                  <X size={20} />
                </button>
              </div>
              <p className="screen-subtitle">Safe, anonymous discussion wall for mutual aid</p>

              {/* Category tabs */}
              <div className="forum-tab-row">
                {['Safety Tips', 'Alerts', 'General', 'Metroparks'].map(cat => (
                  <button 
                    key={cat} 
                    className={`forum-tab-pill ${selectedForumCategory === cat ? 'active' : ''}`}
                    onClick={() => setSelectedForumCategory(cat)}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Submit Post Form */}
              <form onSubmit={handleCreatePost} className="m-card" style={{ padding: '16px' }}>
                <div className="m-form-group" style={{ marginBottom: '10px' }}>
                  <textarea 
                    className="m-form-input" 
                    placeholder={`Post anonymously in ${selectedForumCategory}...`}
                    rows={2}
                    value={newForumPost}
                    onChange={(e) => setNewForumPost(e.target.value)}
                    style={{ resize: 'none', height: '60px' }}
                  />
                </div>
                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <button type="submit" className="add-compact-btn" style={{ padding: '8px 16px' }}>
                    <Send size={12} /> Post
                  </button>
                </div>
              </form>

              {/* Feed items list */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12.5px' }}>
                {forumPosts.filter(p => selectedForumCategory === 'General' || p.category === selectedForumCategory).map(post => (
                  <div className="forum-chat-post-box" key={post.id}>
                    <div className="forum-post-header">
                      <div className="forum-poster-tag-box">
                        <div className="forum-poster-avatar-anon">👤</div>
                        <span className="forum-poster-username">{post.author}</span>
                      </div>
                      <span className="forum-post-tag-custom">{post.category}</span>
                    </div>
                    <p className="forum-post-content">{post.content}</p>
                    <div className="forum-post-footer">
                      <button 
                        className={`forum-footer-item ${post.isLikedByUser ? 'liked' : ''}`}
                        onClick={() => handleLikePost(post.id)}
                      >
                        <Heart size={14} fill={post.isLikedByUser ? "currentColor" : "none"} /> {post.likes}
                      </button>
                      <span className="forum-footer-item">
                        <MessageSquare size={14} /> {post.comments} comments
                      </span>
                      <span className="forum-footer-item" style={{ marginLeft: 'auto', fontSize: '10px' }}>
                        {post.time}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}


          {/* SUB-SCREEN: PCOS SUPPORT MODULE */}
          {activePCOS && (
            <section className="screen active" id="sub-pcos-guide">
              <div className="modal-header-row" style={{ marginBottom: '12px' }}>
                <h2 className="section-title" style={{ marginTop: '0', marginBottom: '0' }}>PCOS Health Portal</h2>
                <button className="icon-btn" onClick={() => setActivePCOS(false)}>
                  <X size={20} />
                </button>
              </div>
              <p className="screen-subtitle">Clinical guidance on endocrine & ovarian wellness</p>

              <div className="pcos-meter-box">
                <h4 className="pcos-tag">Health Screen Checklist</h4>
                <p className="pcos-desc">Check common hormonal/PCOS indicators for assessment:</p>
              </div>

              <div className="m-card">
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  
                  <div className="pcos-checklist-item" onClick={() => setPcosChecklist({ ...pcosChecklist, irregularCycles: !pcosChecklist.irregularCycles })}>
                    <div className={`pcos-checkbox ${pcosChecklist.irregularCycles ? 'checked' : ''}`}>
                      {pcosChecklist.irregularCycles && <Check size={14} />}
                    </div>
                    <div>
                      <h4 style={{ fontSize: '13px', fontWeight: '600' }}>Irregular Cycles</h4>
                      <p style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Missed, erratic, or severely delayed cycles.</p>
                    </div>
                  </div>

                  <div className="pcos-checklist-item" onClick={() => setPcosChecklist({ ...pcosChecklist, acne: !pcosChecklist.acne })}>
                    <div className={`pcos-checkbox ${pcosChecklist.acne ? 'checked' : ''}`}>
                      {pcosChecklist.acne && <Check size={14} />}
                    </div>
                    <div>
                      <h4 style={{ fontSize: '13px', fontWeight: '600' }}>Hormonal Acne / Hair Thinning</h4>
                      <p style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Stubborn skin breakouts or androgen-based thinning.</p>
                    </div>
                  </div>

                  <div className="pcos-checklist-item" onClick={() => setPcosChecklist({ ...pcosChecklist, moodSwings: !pcosChecklist.moodSwings })}>
                    <div className={`pcos-checkbox ${pcosChecklist.moodSwings ? 'checked' : ''}`}>
                      {pcosChecklist.moodSwings && <Check size={14} />}
                    </div>
                    <div>
                      <h4 style={{ fontSize: '13px', fontWeight: '600' }}>Severe Mood Cycles / Irritability</h4>
                      <p style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Progesterone level rapid fluctuations impacting moods.</p>
                    </div>
                  </div>

                  <div className="pcos-checklist-item" onClick={() => setPcosChecklist({ ...pcosChecklist, tiredness: !pcosChecklist.tiredness })}>
                    <div className={`pcos-checkbox ${pcosChecklist.tiredness ? 'checked' : ''}`}>
                      {pcosChecklist.tiredness && <Check size={14} />}
                    </div>
                    <div>
                      <h4 style={{ fontSize: '13px', fontWeight: '600' }}>Chronic Insulin Fatigue</h4>
                      <p style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Constant low stamina or weight-loss blockades.</p>
                    </div>
                  </div>

                </div>
              </div>

              <div className="m-card">
                <h4 style={{ fontSize: '14px', fontWeight: '700', marginBottom: '8px', color: '#1A5F35' }}>🥑 PCOS Active Diet Planner</h4>
                <p style={{ fontSize: '11.5px', color: 'var(--text-main)', lineHeight: '1.6' }}>
                  Targeting an Insulin-resistant safe menu is critical. Focus heavily on lean proteins, low-glycemic complexes (quinoa, sweet potatoes), fibrous greens, and natural anti-inflammatory fats (olive oil, walnuts, avocados). Avoid refined carbs post-noon, and consider introducing Spearmint tea for natural testosterone blocks.
                </p>
              </div>
            </section>
          )}


          {/* SCREEN 2: FAKE CALL VIEW (TAB 4) */}
          <section className={`screen ${currentScreen === 'fakecall' ? 'active' : ''}`} id="screen-fakecall">
            
            <div className="fake-call-header-card">
              <div className="fake-call-shield">
                <Shield size={26} fill="currentColor" />
              </div>
              <h3 className="fake-call-tag">Emergency Fake Call</h3>
              <p className="fake-call-desc">
                Trigger a highly realistic incoming phone call to help you safely exit uncomfortable or dangerous situations.
              </p>
            </div>

            <div className="m-card" style={{ padding: '20px 24px' }}>
              <div className="setup-card-header">
                <span className="setup-card-title">Caller Setup</span>
                <button className="setup-edit-btn" onClick={() => setShowEditCallerModal(true)}>
                  <Sparkles size={12} /> Edit caller details
                </button>
              </div>

              {/* Caller profile mockup */}
              <div className="caller-display-info">
                <div className="caller-avatar-circle">
                  <span className="caller-avatar-placeholder">
                    {callerSetup.name ? callerSetup.name[0].toUpperCase() : 'C'}
                  </span>
                </div>
                <div className="caller-details">
                  <h4 className="caller-name">{callerSetup.name}</h4>
                  <p className="caller-number">{callerSetup.phone}</p>
                </div>
              </div>
            </div>

            {/* Arming Timer instructions */}
            <div style={{ textAlign: 'center', margin: '24px 0' }}>
              <p style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                🚨 Clinically designed: Triggering initiates a subtle 3s pocket countdown warning so you have time to lock your screen or simulate pocket rustle!
              </p>
            </div>

            <button 
              className="vibrant-pink-btn" 
              style={{ padding: '16px 28px', fontSize: '15px' }}
              onClick={triggerFakeCallNow}
            >
              <Phone size={18} fill="currentColor" /> Trigger Call Now
            </button>
          </section>


          {/* SCREEN: AMBIENT AUDIO RECORDER (TAB 2) */}
          <section className={`screen ${currentScreen === 'record' ? 'active' : ''}`} id="screen-record">
            <p className="screen-subtitle">Record and upload ambient transit sounds</p>

            {/* Micro/Mic audio visualizer interaction block */}
            <div className="record-mic-visualizer">
              <button 
                className={`record-mic-button ${isRecording ? 'recording' : ''}`}
                onClick={toggleRecording}
              >
                <Mic size={36} />
                {isRecording && <div className="record-pulse-radar"></div>}
              </button>

              <div className="record-digital-tracker">
                {formatTime(recordingSeconds)}
              </div>
              <span className="record-status-string">
                {isRecording ? "SECURE AMBIENT CAPTURE ACTIVE" : "TAP MIC TO REC BACKGROUND AUDIO"}
              </span>

              {/* Bouncing waves bar indicators */}
              <div className="record-wave-bars-flex">
                {[...Array(8)].map((_, i) => (
                  <div 
                    key={i} 
                    className={`record-wave-bar ${isRecording ? 'animated' : ''}`}
                  ></div>
                ))}
              </div>
            </div>

            {/* Upload automation preferences */}
            <div className="m-card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px' }}>
              <div>
                <h4 style={{ fontSize: '13px', fontWeight: '600' }}>Cloud Auto-Upload</h4>
                <p style={{ fontSize: '10.5px', color: 'var(--text-muted)' }}>Transmit sound logs automatically during SOS</p>
              </div>
              <div 
                style={{
                  width: '44px',
                  height: '24px',
                  borderRadius: '12px',
                  backgroundColor: autoUploadSOS ? 'var(--primary)' : '#E0DCDD',
                  padding: '2px',
                  cursor: 'pointer',
                  display: 'flex',
                  justifyContent: autoUploadSOS ? 'flex-end' : 'flex-start',
                  transition: 'background-color 0.2s'
                }}
                onClick={() => setAutoUploadSOS(!autoUploadSOS)}
              >
                <div style={{ width: '20px', height: '20px', borderRadius: '50%', backgroundColor: '#FFFFFF', boxShadow: '0 1px 3px rgba(0,0,0,0.15)' }}></div>
              </div>
            </div>

            <h3 className="audio-history-header">Recorded Logs History</h3>
            
            {/* Record log listing */}
            <div className="audio-history-stack">
              {recordedClips.map(clip => (
                <div className="audio-log-item" key={clip.id}>
                  <div className="audio-log-left">
                    <div className="audio-icon-wrap">
                      <Volume2 size={16} />
                    </div>
                    <div className="audio-log-meta">
                      <h4 className="audio-log-title">{clip.name}</h4>
                      <span className="audio-log-date">{clip.date}</span>
                    </div>
                  </div>
                  <div className="audio-log-right">
                    <span className="audio-duration">{clip.duration}</span>
                    <button className="play-audio-btn" onClick={() => alert(`Simulated playing secure file: ${clip.name}`)}>
                      <Phone size={14} style={{ transform: 'rotate(90deg)' }} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

          </section>


          {/* SCREEN 3: PROFILE / USER DASHBOARD VIEW */}
          <section className={`screen ${currentScreen === 'profile' ? 'active' : ''}`} id="screen-profile">
            
            {/* Full-width Pink profile block */}
            <div className="profile-block">
              <div className="profile-main-info">
                <div className="profile-avatar-token">
                  {profile.avatarLetter}
                </div>
                <div className="profile-meta-details">
                  <h3>{profile.name}</h3>
                  <p>{profile.phone}</p>
                </div>
              </div>
              <button className="profile-edit-trigger" onClick={() => setShowEditProfileModal(true)}>
                <Sparkles size={16} />
              </button>
            </div>

            {/* Profile actions/details grid */}
            <div className="profile-util-grid">
              
              <div className="profile-btn" onClick={() => { setCurrentScreen('home'); setIsSharingLocation(true); }}>
                <div className="profile-btn-icon-wrapper">
                  <MapPin size={22} />
                </div>
                <span className="profile-btn-label">Live Location</span>
              </div>

              <div className="profile-btn" onClick={() => { setCurrentScreen('home'); startStressQuiz(); }}>
                <div className="profile-btn-icon-wrapper">
                  <Heart size={22} />
                </div>
                <span className="profile-btn-label">Stress Assessment</span>
              </div>

              <div className="profile-btn" onClick={() => { setCurrentScreen('contacts'); }}>
                <div className="profile-btn-icon-wrapper">
                  <Users size={22} />
                </div>
                <span className="profile-btn-label">Friends List</span>
              </div>

              <div className="profile-btn profile-btn-logout" onClick={() => {
                if (window.confirm('Simulate Logout from SafeHer secure server?')) {
                  pushNotification('User Logged Out', 'Authentication tokens successfully purged.');
                  alert('Logged out! Resetting to base client credential.');
                  setProfile({ name: 'Aarya', phone: '+91 9119892200', avatarLetter: 'A' });
                }
              }}>
                <div className="profile-btn-icon-wrapper">
                  <LogOut size={22} />
                </div>
                <span className="profile-btn-label" style={{ color: '#D32F2F' }}>Log Out</span>
              </div>

            </div>

            <div className="m-card" style={{ marginTop: '24px', backgroundColor: '#FFFFFF' }}>
              <h4 style={{ fontSize: '13px', fontWeight: '700', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Shield size={16} style={{ color: 'var(--primary)' }} /> Secure Profile Shield
              </h4>
              <p style={{ fontSize: '11px', color: 'var(--text-muted)', lineHeight: '1.5' }}>
                All coordinates, forum footprints, and local audio tracks are locked using device-level AES-GCM standards. No databases compromise SafeHer telemetry files.
              </p>
            </div>

          </section>


          {/* SCREEN 4: EMERGENCY HELP VIEW (TAB 5) */}
          <section className={`screen ${currentScreen === 'help' ? 'active' : ''}`} id="sub-emergency-help-view">
            <h2 className="section-title" style={{ marginTop: '0', marginBottom: '4px' }}>Emergency Help</h2>
            <p className="help-desc">
              Immediate access to national emergency services. Tap any card below to call for help instantly.
            </p>

            <div className="help-list-stack">
              
              {/* 112 National Emergency */}
              <div className="help-dial-card" onClick={() => triggerEmergencyOutbound('112', 'National Emergency')}>
                <div className="help-card-icon-container bg-indicator-112">
                  <Shield size={20} fill="currentColor" />
                </div>
                <div className="help-card-details">
                  <span className="help-card-code">112</span>
                  <span className="help-card-desc">National Emergency</span>
                </div>
                <button className="help-call-circle-btn">
                  <Phone size={16} fill="currentColor" />
                </button>
              </div>

              {/* 108 Ambulance */}
              <div className="help-dial-card" onClick={() => triggerEmergencyOutbound('108', 'Ambulance')}>
                <div className="help-card-icon-container bg-indicator-108">
                  <Heart size={20} fill="currentColor" />
                </div>
                <div className="help-card-details">
                  <span className="help-card-code">108</span>
                  <span className="help-card-desc">Ambulance</span>
                </div>
                <button className="help-call-circle-btn">
                  <Phone size={16} fill="currentColor" />
                </button>
              </div>

              {/* 102 Pregnancy Medic */}
              <div className="help-dial-card" onClick={() => triggerEmergencyOutbound('102', 'Pregnancy Medic')}>
                <div className="help-card-icon-container bg-indicator-102">
                  <Droplet size={20} fill="currentColor" />
                </div>
                <div className="help-card-details">
                  <span className="help-card-code">102</span>
                  <span className="help-card-desc">Pregnancy Medic</span>
                </div>
                <button className="help-call-circle-btn">
                  <Phone size={16} fill="currentColor" />
                </button>
              </div>

              {/* 1091 Women Helpline */}
              <div className="help-dial-card" onClick={() => triggerEmergencyOutbound('1091', 'Women Helpline')}>
                <div className="help-card-icon-container bg-indicator-1091">
                  <User size={20} fill="currentColor" />
                </div>
                <div className="help-card-details">
                  <span className="help-card-code">1091</span>
                  <span className="help-card-desc">Women Helpline</span>
                </div>
                <button className="help-call-circle-btn">
                  <Phone size={16} fill="currentColor" />
                </button>
              </div>

              {/* 100 Police */}
              <div className="help-dial-card" onClick={() => triggerEmergencyOutbound('100', 'Police')}>
                <div className="help-card-icon-container bg-indicator-100">
                  <Users size={20} fill="currentColor" />
                </div>
                <div className="help-card-details">
                  <span className="help-card-code">100</span>
                  <span className="help-card-desc">Police Department</span>
                </div>
                <button className="help-call-circle-btn">
                  <Phone size={16} fill="currentColor" />
                </button>
              </div>

              {/* 101 Fire */}
              <div className="help-dial-card" onClick={() => triggerEmergencyOutbound('101', 'Fire Service')}>
                <div className="help-card-icon-container bg-indicator-101">
                  <Sparkles size={20} fill="currentColor" />
                </div>
                <div className="help-card-details">
                  <span className="help-card-code">101</span>
                  <span className="help-card-desc">Fire Service Control</span>
                </div>
                <button className="help-call-circle-btn">
                  <Phone size={16} fill="currentColor" />
                </button>
              </div>

            </div>

          </section>

          {/* SCREEN: TRUSTED CONTACTS LIST VIEW */}
          {currentScreen === 'contacts' && (
            <section className="screen active" id="screen-contacts">
              <div className="modal-header-row" style={{ marginBottom: '16px' }}>
                <h2 className="section-title" style={{ marginTop: '0', marginBottom: '0' }}>Trusted Contacts</h2>
                <button 
                  className="add-compact-btn" 
                  onClick={() => setShowAddFriendModal(true)}
                  style={{ backgroundColor: 'var(--primary)' }}
                >
                  <Plus size={15} strokeWidth={3} /> Add New
                </button>
              </div>
              <p className="screen-subtitle">Manage emergency connections for SOS and route safety tracking</p>

              {friends.length === 0 ? (
                <div className="m-card" style={{ textAlign: 'center', padding: '40px 24px' }}>
                  <Users size={48} style={{ color: 'var(--text-muted)', margin: '0 auto 16px', opacity: 0.5 }} />
                  <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '8px' }}>No contacts added yet</h3>
                  <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '24px' }}>Add friends or family to enable SOS alert broadcasts and live tracking.</p>
                  <button className="vibrant-pink-btn" style={{ maxWidth: '200px', margin: '0 auto' }} onClick={() => setShowAddFriendModal(true)}>
                    <Plus size={16} /> Add First Contact
                  </button>
                </div>
              ) : (
                <div className="contacts-list-container" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {friends.map((friend) => (
                    <div 
                      key={friend.id} 
                      className="contact-item-row"
                      onClick={() => {
                        setSelectedContact(friend);
                        setShowContactDetailsModal(true);
                      }}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        backgroundColor: 'var(--card-bg)',
                        borderRadius: '16px',
                        padding: '14px 18px',
                        boxShadow: 'var(--shadow-subtle)',
                        cursor: 'pointer',
                        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                        border: '1px solid rgba(63, 29, 56, 0.03)'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'translateY(-1px)';
                        e.currentTarget.style.boxShadow = '0 4px 12px rgba(63, 29, 56, 0.08)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = 'var(--shadow-subtle)';
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div 
                          style={{
                            width: '40px',
                            height: '40px',
                            borderRadius: '50%',
                            backgroundColor: 'var(--primary-light)',
                            color: 'var(--primary)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontWeight: '600',
                            fontSize: '15px'
                          }}
                        >
                          {friend.name ? friend.name[0].toUpperCase() : 'U'}
                        </div>
                        <div>
                          <h4 style={{ fontSize: '14px', fontWeight: '600', color: 'var(--text-main)' }}>{friend.name}</h4>
                          <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{friend.phone}</p>
                        </div>
                      </div>
                      
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }} onClick={(e) => e.stopPropagation()}>
                        <span 
                          style={{
                            fontSize: '10px',
                            fontWeight: '600',
                            color: friend.isTracking ? 'var(--primary)' : 'var(--text-muted)',
                            backgroundColor: friend.isTracking ? 'var(--primary-light)' : 'var(--bg-app)',
                            padding: '3px 8px',
                            borderRadius: '6px'
                          }}
                        >
                          {friend.isTracking ? 'SOS + Live' : 'SOS Only'}
                        </span>
                        <button 
                          className="icon-btn" 
                          onClick={() => {
                            setEditContactForm({
                              name: friend.name,
                              phone: friend.phone.replace(/\D/g, '').slice(-10),
                              isSOS: friend.isTracking
                            });
                            setEditingContact(friend);
                            setShowEditContactModal(true);
                          }}
                          style={{ padding: '6px', color: 'var(--text-muted)' }}
                        >
                          <Edit size={14} />
                        </button>
                        <button 
                          className="icon-btn" 
                          onClick={() => initiateRemoveContact(friend.id)}
                          style={{ padding: '6px', color: '#D32F2F' }}
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <button 
                className="outline-btn" 
                onClick={() => setCurrentScreen('home')}
                style={{ marginTop: '24px', width: '100%' }}
              >
                Back to Dashboard
              </button>
            </section>
          )}

        </main>

        {/* Fixed Navigation Bottom Bar */}
        <nav className="bottom-nav" id="safeher-bottom-nav">
          
          <button 
            className={`nav-tab ${currentScreen === 'home' ? 'active' : ''}`} 
            onClick={() => { setCurrentScreen('home'); setActiveQuiz(false); setActiveCycle(false); setActiveForum(false); setActivePCOS(false); }}
          >
            <Shield strokeWidth={currentScreen === 'home' ? 2.5 : 2} />
            <span>Home</span>
          </button>

          <button 
            className={`nav-tab ${currentScreen === 'record' ? 'active' : ''}`} 
            onClick={() => { setCurrentScreen('record'); setActiveQuiz(false); setActiveCycle(false); setActiveForum(false); setActivePCOS(false); }}
          >
            <Mic strokeWidth={currentScreen === 'record' ? 2.5 : 2} />
            <span>Record</span>
          </button>

          {/* Core SOS Raised Button in navigation */}
          <div className="sos-nav-container">
            <div className="sos-ripple-ring"></div>
            <button 
              className="sos-nav-btn" 
              id="sos-trigger-nav-btn" 
              onClick={() => {
                setSosCountdown(3); 
                stopSirenAudio();
              }}
            >
              <AlertTriangle strokeWidth={2.5} />
            </button>
          </div>

          <button 
            className={`nav-tab ${currentScreen === 'fakecall' ? 'active' : ''}`} 
            onClick={() => { setCurrentScreen('fakecall'); setActiveQuiz(false); setActiveCycle(false); setActiveForum(false); setActivePCOS(false); }}
          >
            <Phone strokeWidth={currentScreen === 'fakecall' ? 2.5 : 2} />
            <span>Fake Call</span>
          </button>

          <button 
            className={`nav-tab ${currentScreen === 'help' ? 'active' : ''}`} 
            onClick={() => { setCurrentScreen('help'); setActiveQuiz(false); setActiveCycle(false); setActiveForum(false); setActivePCOS(false); }}
          >
            <AlertTriangle strokeWidth={currentScreen === 'help' ? 2.5 : 2} />
            <span>Help</span>
          </button>

        </nav>


        {/* =======================================================
            OVERLAYS, TIMERS, ACTIVE SIMULATORS 
            ======================================================= */}

        {/* SOS OVERLAY COUNTDOWN & SIREN SYSTEM */}
        {(sosCountdown !== null || isSOSActive) && (
          <div className={`sos-overlay-fullscreen siren-pulse-screen`} id="sos-active-overlay">
            <div className="fake-call-shield" style={{ backgroundColor: '#D32F2F', width: '64px', height: '64px' }}>
              <AlertTriangle size={32} />
            </div>

            <h2 className="sos-danger-title">
              {sosCountdown !== null ? "SOS DIALER INITIATING" : "SOS ACTIVE PROTOCOLS"}
            </h2>

            {sosCountdown !== null ? (
              <div className="sos-countdown-display">{sosCountdown}</div>
            ) : (
              <div className="sos-countdown-display" style={{ animation: 'pulse-ring 1.5s infinite' }}>🚨</div>
            )}

            <p className="sos-desc-subtext">
              {sosCountdown !== null 
                ? "Simulating automatic dispatch of emergency SMS, live maps tracking, and audio surveillance recordings. Tap cancel to stop accidental panic alert."
                : "The SafeHer emergency cell is actively broadcasting live trace telemetry to coordinates center. Nearby community cells are alerted."
              }
            </p>

            {isSOSActive && (
              <div className="sos-immed-sms-panel">
                <span className="sms-badge">Sent SMS Link to {friends.map(f => f.name).join(', ')}</span>
                <div className="sms-content-box">
                  🔑 SAFEHER SOS ALERT! {profile.name} needs assistance. Last trace: 12.9716, 77.5946. Tracking URL: https://safeher.org/track/{profile.name.toLowerCase()}
                </div>
              </div>
            )}

            <div className="sos-action-buttons-flex">
              {isSOSActive && (
                <button 
                  className="outline-btn" 
                  onClick={() => { setSirenMuted(!sirenMuted); if(sirenMuted) startSirenAudio(); else stopSirenAudio(); }}
                  style={{ backgroundColor: '#FFFFFF', borderColor: '#D32F2F', color: '#D32F2F' }}
                >
                  {sirenMuted ? '🔊 Unmute Alarm Siren' : '🔇 Mute Alarm Siren'}
                </button>
              )}
              
              <button 
                className="sos-cancel-btn" 
                onClick={() => {
                  setSosCountdown(null);
                  setIsSOSActive(false);
                  stopSirenAudio();
                  pushNotification('SOS Cancelled', 'Alert sequence safely aborted by user PIN passcode.');
                }}
              >
                {sosCountdown !== null ? 'Tap to Cancel Alert' : 'Deactivate Emergency protocol'}
              </button>
            </div>
          </div>
        )}


        {/* FAKE CALL COUNTDOWN TICKER OVERLAY */}
        {fakeCallState === 'countdown' && (
          <div className="sos-overlay-fullscreen" style={{ backgroundColor: '#1A1215', color: '#FFFFFF' }} id="call-countdown-overlay">
            <Loader2 className="animate-spin" size={32} style={{ color: 'var(--primary)', marginBottom: '16px' }} />
            <h3 style={{ fontSize: '18px', fontWeight: 'bold' }}>Arming Incoming Phone Call</h3>
            <div className="sos-countdown-display" style={{ backgroundColor: 'rgba(255,255,255,0.04)', color: 'var(--primary)' }}>
              {callCountdownSecs}
            </div>
            <p style={{ fontSize: '12px', opacity: 0.6, maxWidth: '280px' }}>
              Hide your smartphone screen or place inside purse. Call activates in {callCountdownSecs}s.
            </p>
          </div>
        )}


        {/* FAKE CALL RINGING SCREEN OVERLAY */}
        {fakeCallState === 'ringing' && (
          <div className="call-fullscreen-overlay" id="ringing-fullscreen">
            <div className="call-header-info">
              <span className="call-subheading">Incoming Fake Call</span>
              <h2 className="call-contact-name">{callerSetup.name}</h2>
              <span className="call-status-subtitle">SafeHer Guardian Service</span>
            </div>

            <div className="call-avatar-interactive">
              <span>{callerSetup.name[0]}</span>
              <div className="call-avatar-pulse-circle"></div>
            </div>

            <div className="call-actions-row-swipe">
              <div className="call-action-col">
                <button className="call-circle-btn-decline" onClick={declineCall}>
                  <Phone size={28} />
                </button>
                <span className="call-btn-label">Decline</span>
              </div>

              <div className="call-action-col">
                <button className="call-circle-btn-accept" onClick={acceptCall}>
                  <Phone size={28} />
                </button>
                <span className="call-btn-label">Accept</span>
              </div>
            </div>
          </div>
        )}


        {/* FAKE CALL ACTIVE ONGOING SCREEN OVERLAY */}
        {fakeCallState === 'active' && (
          <div className="call-fullscreen-overlay" style={{ justifyContent: 'space-between' }} id="active-call-fullscreen">
            <div className="call-header-info">
              <h2 className="call-contact-name">{callerSetup.name}</h2>
              <span className="call-status-subtitle" style={{ color: '#4CAF50', fontWeight: 'bold' }}>
                On Air • {formatTime(activeCallDuration)}
              </span>
            </div>

            {/* Audio waveform / sub-text chat feedback log */}
            <div className="active-call-chatwave-display">
              <span className="chatwave-header font-mono">Incoming sound transcription</span>
              <p className="chatwave-text">
                "{callDialLog[activeCallDuration % callDialLog.length] || "Listening..."}"
              </p>
            </div>

            <div className="active-call-grid-controls">
              
              <div className="active-call-control-item" onClick={() => setIsMuted(!isMuted)}>
                <div className={`active-call-control-circle ${isMuted ? 'active' : ''}`}>
                  <VolumeX size={18} />
                </div>
                <span className="active-call-control-label">Mute</span>
              </div>

              <div className="active-call-control-item">
                <div className="active-call-control-circle">
                  <Users size={18} />
                </div>
                <span className="active-call-control-label">Contacts</span>
              </div>

              <div className="active-call-control-item" onClick={() => setIsSpeakerOn(!isSpeakerOn)}>
                <div className={`active-call-control-circle ${isSpeakerOn ? 'active' : ''}`}>
                  <Volume2 size={18} />
                </div>
                <span className="active-call-control-label">Speaker</span>
              </div>

            </div>

            <button className="call-circle-btn-decline" onClick={declineCall} style={{ width: '64px', height: '64px' }}>
              <Phone size={24} />
            </button>
          </div>
        )}


        {/* DIRECT SIMULATED DIALING FOR HELP HELPLINE */}
        {outboundCallingCode && (
          <div className="call-fullscreen-overlay" style={{ background: '#0F121C' }} id="outbound-calling-overlay">
            <div className="call-header-info">
              <span className="call-subheading" style={{ color: '#E91E63' }}>Emergency Dial Protocol</span>
              <h1 style={{ fontSize: '56px', fontWeight: '800', marginTop: '20px', letterSpacing: '1px' }}>{outboundCallingCode}</h1>
              <span className="call-status-subtitle" style={{ marginTop: '24px', maxWidth: '280px', lineHeight: '1.6' }}>
                {outboundCallStatus}
              </span>
            </div>

            <div className="record-wave-bars-flex" style={{ margin: '40px 0' }}>
              {[...Array(6)].map((_, i) => (
                <div key={i} className="record-wave-bar animated" style={{ backgroundColor: '#E91E63', width: '5px' }}></div>
              ))}
            </div>

            <button 
              className="vibrant-pink-btn" 
              onClick={() => setOutboundCallingCode(null)}
              style={{ backgroundColor: '#D32F2F', maxWidth: '240px' }}
            >
              Cancel Emergency Call
            </button>
          </div>
        )}


        {/* =======================================================
            MODAL DRAWER COMPONENT LAYOUTS
            ======================================================= */}

        {/* CUSTOM THEMED CENTERED DELETE CONFIRMATION MODAL */}
        {showDeleteConfirmModal && contactToDeleteId && (
          <div 
            className="m-modal-backdrop" 
            onClick={() => { if (!removingContact) { setShowDeleteConfirmModal(false); setContactToDeleteId(null); } }} 
            id="modal-delete-confirm"
            style={{ alignItems: 'center' }}
          >
            <div 
              className="m-modal-card" 
              onClick={(e) => e.stopPropagation()}
              style={{
                borderRadius: '24px',
                margin: '20px',
                width: '90%',
                maxWidth: '340px',
                animation: 'fade-in 0.25s ease forwards',
                transform: 'none',
                padding: '24px'
              }}
            >
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '16px' }}>
                <div 
                  style={{
                    width: '56px',
                    height: '56px',
                    borderRadius: '50%',
                    backgroundColor: '#FFEBEE',
                    color: '#D32F2F',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: 'var(--shadow-subtle)'
                  }}
                >
                  <AlertTriangle size={28} />
                </div>
                
                <div>
                  <h3 style={{ fontSize: '18px', fontWeight: '700', color: 'var(--text-main)', marginBottom: '8px' }}>Remove Contact?</h3>
                  <p style={{ fontSize: '12px', color: 'var(--text-muted)', lineHeight: '1.5' }}>
                    Are you sure you want to remove <strong>{friends.find(f => f.id === contactToDeleteId)?.name || 'this contact'}</strong> from your emergency list? They will no longer receive SOS alerts.
                  </p>
                </div>
              </div>

              <div className="modal-action-row" style={{ marginTop: '20px' }}>
                <button 
                  type="button" 
                  className="outline-btn" 
                  onClick={() => { setShowDeleteConfirmModal(false); setContactToDeleteId(null); }}
                  disabled={removingContact}
                  style={{ padding: '12px 20px', fontSize: '13px' }}
                >
                  Cancel
                </button>
                <button 
                  type="button" 
                  className="vibrant-pink-btn" 
                  onClick={confirmRemoveContact}
                  disabled={removingContact}
                  style={{ 
                    flex: '1.5', 
                    padding: '12px 20px', 
                    fontSize: '13px', 
                    backgroundColor: '#D32F2F', 
                    boxShadow: '0 4px 14px rgba(211, 47, 47, 0.3)' 
                  }}
                >
                  {removingContact ? (
                    <>
                      <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} /> Removing...
                    </>
                  ) : (
                    'Remove Contact'
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* MODAL: VIEW CONTACT DETAILS */}
        {showContactDetailsModal && selectedContact && (
          <div className="m-modal-backdrop" onClick={() => { setShowContactDetailsModal(false); setSelectedContact(null); }} id="modal-view-contact">
            <div className="m-modal-card" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header-row">
                <h3 className="modal-header-title">Emergency Contact Details</h3>
                <button className="icon-btn" onClick={() => { setShowContactDetailsModal(false); setSelectedContact(null); }}>
                  <X size={20} />
                </button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', margin: '20px 0', gap: '12px' }}>
                <div 
                  style={{
                    width: '72px',
                    height: '72px',
                    borderRadius: '50%',
                    backgroundColor: 'var(--primary-light)',
                    color: 'var(--primary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: '700',
                    fontSize: '28px',
                    boxShadow: 'var(--shadow-subtle)'
                  }}
                >
                  {selectedContact.name ? selectedContact.name[0].toUpperCase() : 'U'}
                </div>
                <h2 style={{ fontSize: '20px', fontWeight: '700', color: 'var(--text-main)' }}>{selectedContact.name}</h2>
                <span 
                  style={{
                    fontSize: '11px',
                    fontWeight: '600',
                    color: selectedContact.isTracking ? 'var(--primary)' : 'var(--text-muted)',
                    backgroundColor: selectedContact.isTracking ? 'var(--primary-light)' : 'var(--bg-app)',
                    padding: '4px 12px',
                    borderRadius: '8px'
                  }}
                >
                  {selectedContact.isTracking ? '✓ SOS Enabled + Live Tracking' : 'SOS Enabled Only'}
                </span>
              </div>

              <div className="m-card" style={{ display: 'flex', flexDirection: 'column', gap: '12px', padding: '16px', backgroundColor: 'var(--bg-app)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(63, 29, 56, 0.05)', paddingBottom: '8px' }}>
                  <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: '500' }}>Contact ID</span>
                  <span style={{ fontSize: '12px', color: 'var(--text-main)', fontWeight: '600', fontFamily: 'var(--font-mono)' }}>{selectedContact.id}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(63, 29, 56, 0.05)', paddingBottom: '8px' }}>
                  <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: '500' }}>Phone Number</span>
                  <span style={{ fontSize: '12px', color: 'var(--text-main)', fontWeight: '600' }}>{selectedContact.phone}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '4px' }}>
                  <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: '500' }}>SOS Tracker status</span>
                  <span style={{ fontSize: '12px', color: selectedContact.isTracking ? 'var(--primary)' : 'var(--text-muted)', fontWeight: '600' }}>
                    {selectedContact.isTracking ? 'Active Live Monitor' : 'SOS Emergency Alert'}
                  </span>
                </div>
              </div>

              <div className="modal-action-row">
                <button 
                  type="button" 
                  className="outline-btn" 
                  onClick={() => {
                    setEditContactForm({
                      name: selectedContact.name,
                      phone: selectedContact.phone.replace(/\D/g, '').slice(-10),
                      isSOS: selectedContact.isTracking
                    });
                    setEditingContact(selectedContact);
                    setShowContactDetailsModal(false);
                    setShowEditContactModal(true);
                  }}
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                >
                  <Edit size={16} /> Edit Contact
                </button>
                <button 
                  type="button" 
                  className="outline-btn" 
                  onClick={() => initiateRemoveContact(selectedContact.id)}
                  style={{ borderColor: '#D32F2F', color: '#D32F2F', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                >
                  <Trash2 size={16} /> Remove
                </button>
              </div>
            </div>
          </div>
        )}

        {/* MODAL: EDIT FRIEND CONTACT */}
        {showEditContactModal && editingContact && (
          <div className="m-modal-backdrop" onClick={() => { setShowEditContactModal(false); setEditingContact(null); }} id="modal-edit-contact">
            <div className="m-modal-card" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header-row">
                <h3 className="modal-header-title">Edit Emergency Contact</h3>
                <button className="icon-btn" onClick={() => { setShowEditContactModal(false); setEditingContact(null); }}>
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleEditContactSubmit}>
                <div className="m-form-group">
                  <label className="m-form-label">Friend Name</label>
                  <input 
                    type="text" 
                    className="m-form-input" 
                    placeholder="e.g. Shreya Sis"
                    required
                    value={editContactForm.name}
                    onChange={(e) => setEditContactForm({ ...editContactForm, name: e.target.value })}
                  />
                </div>

                <div className="m-form-group">
                  <label className="m-form-label">Phone Number</label>
                  <input 
                    type="tel" 
                    className="m-form-input" 
                    placeholder="e.g. 9876543210"
                    required
                    minLength={10}
                    maxLength={10}
                    pattern="\d{10}"
                    value={editContactForm.phone}
                    onChange={(e) => setEditContactForm({ ...editContactForm, phone: e.target.value.replace(/\D/g, '').slice(0, 10) })}
                  />
                </div>

                <div className="m-form-group" style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid rgba(63, 29, 56, 0.05)', marginBottom: '20px' }}>
                  <div>
                    <label className="m-form-label" style={{ marginBottom: '2px' }}>Live Tracking / SOS contact</label>
                    <p style={{ fontSize: '10.5px', color: 'var(--text-muted)' }}>Enable tracking support for emergency routes</p>
                  </div>
                  <div 
                    style={{
                      width: '44px',
                      height: '24px',
                      borderRadius: '12px',
                      backgroundColor: editContactForm.isSOS ? 'var(--primary)' : '#E0DCDD',
                      padding: '2px',
                      cursor: 'pointer',
                      display: 'flex',
                      justifyContent: editContactForm.isSOS ? 'flex-end' : 'flex-start',
                      transition: 'background-color 0.2s',
                      flexShrink: 0
                    }}
                    onClick={() => setEditContactForm({ ...editContactForm, isSOS: !editContactForm.isSOS })}
                  >
                    <div style={{ width: '20px', height: '20px', borderRadius: '50%', backgroundColor: '#FFFFFF', boxShadow: '0 1px 3px rgba(0,0,0,0.15)' }}></div>
                  </div>
                </div>

                <div className="modal-action-row">
                  <button type="button" className="outline-btn" onClick={() => { setShowEditContactModal(false); setEditingContact(null); }} disabled={savingEditContact}>Cancel</button>
                  <button type="submit" className="vibrant-pink-btn" style={{ flex: '1.5' }} disabled={savingEditContact}>
                    {savingEditContact ? (
                      <>
                        <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} /> Saving...
                      </>
                    ) : (
                      'Save Changes'
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* MODAL: ADD FRIEND CONTACT */}
        {showAddFriendModal && (
          <div className="m-modal-backdrop" onClick={() => setShowAddFriendModal(false)} id="modal-add-friend">
            <div className="m-modal-card" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header-row">
                <h3 className="modal-header-title">Add Emergency Contact</h3>
                <button className="icon-btn" onClick={() => setShowAddFriendModal(false)}>
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleAddFriend}>
                <div className="m-form-group">
                  <label className="m-form-label">Friend Name</label>
                  <input 
                    type="text" 
                    className="m-form-input" 
                    placeholder="e.g. Shreya Sis"
                    required
                    value={newFriendForm.name}
                    onChange={(e) => setNewFriendForm({ ...newFriendForm, name: e.target.value })}
                  />
                </div>

                <div className="m-form-group">
                  <label className="m-form-label">Phone Number</label>
                  <input 
                    type="tel" 
                    className="m-form-input" 
                    placeholder="e.g. 9876543210"
                    required
                    minLength={10}
                    maxLength={10}
                    pattern="\d{10}"
                    value={newFriendForm.phone}
                    onChange={(e) => setNewFriendForm({ ...newFriendForm, phone: e.target.value.replace(/\D/g, '').slice(0, 10) })}
                  />
                </div>

                <div className="modal-action-row">
                  <button type="button" className="outline-btn" onClick={() => setShowAddFriendModal(false)} disabled={savingContact}>Cancel</button>
                  <button type="submit" className="vibrant-pink-btn" style={{ flex: '1.5' }} disabled={savingContact}>
                    {savingContact ? (
                      <>
                        <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} /> Saving...
                      </>
                    ) : (
                      'Save Friend'
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}


        {/* MODAL: EDIT CALLER DETAILS */}
        {showEditCallerModal && (
          <div className="m-modal-backdrop" onClick={() => setShowEditCallerModal(false)} id="modal-edit-caller">
            <div className="m-modal-card" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header-row">
                <h3 className="modal-header-title">Configure Fake Caller</h3>
                <button className="icon-btn" onClick={() => setShowEditCallerModal(false)}>
                  <X size={20} />
                </button>
              </div>

              <div className="m-form-group">
                <label className="m-form-label">Caller Name</label>
                <input 
                  type="text" 
                  className="m-form-input" 
                  value={callerSetup.name}
                  onChange={(e) => setCallerSetup({ ...callerSetup, name: e.target.value })}
                />
              </div>

              <div className="m-form-group">
                <label className="m-form-label">Caller Number</label>
                <input 
                  type="tel" 
                  className="m-form-input" 
                  value={callerSetup.phone}
                  onChange={(e) => setCallerSetup({ ...callerSetup, phone: e.target.value })}
                />
              </div>

              <div className="modal-action-row">
                <button className="outline-btn" onClick={() => setShowEditCallerModal(false)}>Cancel</button>
                <button className="vibrant-pink-btn" style={{ flex: '1.5' }} onClick={() => {
                  setShowEditCallerModal(false);
                  pushNotification('Caller updated', `Incoming alias: ${callerSetup.name}`);
                }}>
                  Update Caller
                </button>
              </div>
            </div>
          </div>
        )}


        {/* MODAL: EDIT USER PROFILE */}
        {showEditProfileModal && (
          <div className="m-modal-backdrop" onClick={() => setShowEditProfileModal(false)} id="modal-edit-profile">
            <div className="m-modal-card" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header-row">
                <h3 className="modal-header-title">Edit Personal Details</h3>
                <button className="icon-btn" onClick={() => setShowEditProfileModal(false)}>
                  <X size={20} />
                </button>
              </div>

              <div className="m-form-group">
                <label className="m-form-label">Profile Name</label>
                <input 
                  type="text" 
                  className="m-form-input" 
                  value={profile.name}
                  onChange={(e) => setProfile({ ...profile, name: e.target.value, avatarLetter: e.target.value ? e.target.value[0].toUpperCase() : 'U' })}
                />
              </div>

              <div className="m-form-group">
                <label className="m-form-label">Emergency Phone</label>
                <input 
                  type="tel" 
                  className="m-form-input" 
                  value={profile.phone}
                  onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                />
              </div>

              <div className="modal-action-row">
                <button className="outline-btn" onClick={() => setShowEditProfileModal(false)}>Cancel</button>
                <button className="vibrant-pink-btn" style={{ flex: '1.5' }} onClick={() => {
                  setShowEditProfileModal(false);
                  pushNotification('Profile customized', `Welcome, ${profile.name}!`);
                }}>
                  Save profile
                </button>
              </div>
            </div>
          </div>
        )}


        {/* NOTIFICATION SLIDE OVER DRAWER */}
        {showNotificationDrawer && (
          <div className="notif-drawer-backdrop" onClick={closeNotifications} id="drawer-notifications">
            <div className="notif-drawer" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header-row">
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Bell size={20} style={{ color: 'var(--primary)' }} />
                  <h3 className="modal-header-title">Notifications</h3>
                </div>
                <button className="icon-btn" onClick={closeNotifications}>
                  <X size={20} />
                </button>
              </div>

              <div className="notif-list-scroller">
                {notifications.map(no => (
                  <div key={no.id} className="notif-item" style={{ borderLeftColor: no.unread ? 'var(--primary)' : '#7D7379', opacity: no.unread ? 1 : 0.8 }}>
                    <h4 className="notif-title">{no.title}</h4>
                    <p style={{ fontSize: '11px', color: 'var(--text-main)', marginBottom: '4px' }}>{no.content}</p>
                    <span className="notif-time">{no.time}</span>
                  </div>
                ))}
              </div>

              <button className="vibrant-pink-btn" style={{ marginTop: '20px' }} onClick={closeNotifications}>
                Dismiss notifications
              </button>
            </div>
          </div>
        )}


        {/* HAMBURGER SIDE-DRAWER */}
        {showMenuDrawer && (
          <div className="notif-drawer-backdrop" onClick={() => setShowMenuDrawer(false)} id="drawer-hamburger-menu">
            <div className="notif-drawer" style={{ width: '85%' }} onClick={(e) => e.stopPropagation()}>
              
              <div className="modal-header-row">
                <div className="brand-section">
                  <div className="brand-logo-container" style={{ width: '32px', height: '32px' }}>
                    <Shield size={18} fill="#FFFFFF" stroke="#FFFFFF" />
                  </div>
                  <h3 className="brand-title" style={{ fontSize: '18px' }}>SafeHer App</h3>
                </div>
                <button className="icon-btn" onClick={() => setShowMenuDrawer(false)}>
                  <X size={20} />
                </button>
              </div>

              {/* Drawer Links */}
              <div className="notif-list-scroller" style={{ gap: '6px' }}>
                <div className="forum-chat-post-box" style={{ padding: '12px', cursor: 'pointer', marginBottom: '0' }} onClick={() => { setCurrentScreen('home'); setShowMenuDrawer(false); }}>
                  <h4 style={{ fontSize: '13px', fontWeight: '600' }}>🛡️ Safety Shield Dashboard</h4>
                  <p style={{ fontSize: '10px', color: 'var(--text-muted)' }}>Location and community aid hub</p>
                </div>
                
                <div className="forum-chat-post-box" style={{ padding: '12px', cursor: 'pointer', marginBottom: '0' }} onClick={() => { setCurrentScreen('record'); setShowMenuDrawer(false); }}>
                  <h4 style={{ fontSize: '13px', fontWeight: '600' }}>🎙️ Background Audio Recorder</h4>
                  <p style={{ fontSize: '10px', color: 'var(--text-muted)' }}>Continuous ambient sound locker</p>
                </div>

                <div className="forum-chat-post-box" style={{ padding: '12px', cursor: 'pointer', marginBottom: '0' }} onClick={() => { setCurrentScreen('fakecall'); setShowMenuDrawer(false); }}>
                  <h4 style={{ fontSize: '13px', fontWeight: '600' }}>📞 Phone Call Simulation</h4>
                  <p style={{ fontSize: '10px', color: 'var(--text-muted)' }}>realistic sound-enabled call driver</p>
                </div>

                <div className="forum-chat-post-box" style={{ padding: '12px', cursor: 'pointer', marginBottom: '0' }} onClick={() => { setCurrentScreen('help'); setShowMenuDrawer(false); }}>
                  <h4 style={{ fontSize: '13px', fontWeight: '600' }}>🚨 Fast Dial Emergency list</h4>
                  <p style={{ fontSize: '10px', color: 'var(--text-muted)' }}>National call protocol dispatchers</p>
                </div>

                <div className="forum-chat-post-box" style={{ padding: '12px', cursor: 'pointer', marginBottom: '0' }} onClick={() => { setCurrentScreen('contacts'); setShowMenuDrawer(false); }}>
                  <h4 style={{ fontSize: '13px', fontWeight: '600' }}>👥 Trusted Contacts List</h4>
                  <p style={{ fontSize: '10px', color: 'var(--text-muted)' }}>View and edit emergency contacts</p>
                </div>

                <div className="forum-chat-post-box" style={{ padding: '12px', cursor: 'pointer', marginBottom: '0' }} onClick={() => { setCurrentScreen('profile'); setShowMenuDrawer(false); }}>
                  <h4 style={{ fontSize: '13px', fontWeight: '600' }}>👤 Manage Identity Shield</h4>
                  <p style={{ fontSize: '10px', color: 'var(--text-muted)' }}>Adjust primary credentials & contacts</p>
                </div>
              </div>

              <div style={{ marginTop: 'auto', borderTop: '1px solid rgba(63,29,56,0.1)', paddingTop: '16px' }}>
                <span className="forum-post-tag-custom" style={{ display: 'block', textTransform: 'uppercase', textAlign: 'center', marginBottom: '12px' }}>
                  VERSION 2.4 SECURE STABLE
                </span>
                <button className="vibrant-pink-btn" onClick={() => { setShowMenuDrawer(false); setShowExportModal(true); }}>
                  Export Source Code
                </button>
              </div>
            </div>
          </div>
        )}


        {/* STANDALONE CODE EXPORTER OVERLAY */}
        {showExportModal && (
          <div className="m-modal-backdrop" onClick={() => setShowExportModal(false)} id="modal-exporter-code">
            <div className="m-modal-card" style={{ height: '75%' }} onClick={(e) => e.stopPropagation()}>
              <div className="modal-header-row">
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <FileText size={20} style={{ color: 'var(--primary)' }} />
                  <h3 className="modal-header-title">Export Clean Layout</h3>
                </div>
                <button className="icon-btn" onClick={() => setShowExportModal(false)}>
                  <X size={20} />
                </button>
              </div>
              <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '16px' }}>
                Copy the entire self-contained SafeHer production layout code. Paste directly as an `.html` file – it runs beautifully with embedded CSS3 styles and native response features.
              </p>

              <div className="code-preview-container">
                <textarea 
                  className="code-preview-textarea" 
                  readOnly 
                  value={generateRawStandaloneHtml()}
                />
                
                <button className="vibrant-pink-btn" onClick={copyExportCode}>
                  {wasCopied ? <><Check size={16} /> Copied to clipboard!</> : <><Copy size={16} /> Copy HTML-CSS-JS Bundle Code</>}
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
