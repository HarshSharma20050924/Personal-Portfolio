import React, { useState, useEffect, useRef } from 'react';
import type {
  HeroData,
  Skill,
  Project,
  SocialLink,
  Article,
  Experience,
  Education,
  PlaygroundConfig,
  Message
} from '../types';

import ManageHero from './ManageHero';
import ManageSkills from './ManageSkills';
import ManageProjects from './ManageProjects';
import ManageSocials from './ManageSocials';
import ManageBlog from './ManageBlog';
import ManageTheme from './ManageTheme';
import ManagePlayground from './ManagePlayground';
import ManageSecurity from './ManageSecurity';
import ManageExperience from './ManageExperience';
import ManageMessages from './ManageMessages';
import ManageAI from './ManageAI';

import {
  AlertTriangle,
  Loader2,
  Menu,
  X,
  Bell,
  BellOff,
  MonitorDown
} from 'lucide-react';

type AdminView =
  | 'hero'
  | 'theme'
  | 'skills'
  | 'projects'
  | 'socials'
  | 'blog'
  | 'experience'
  | 'messages'
  | 'playground'
  | 'security'
  | 'ai';

/* =========================
   AUDIO (MOBILE SAFE)
========================= */
let audioCtx: AudioContext | null = null;

const initAudio = () => {
  if (!audioCtx) {
    const Ctx = window.AudioContext || (window as any).webkitAudioContext;
    if (!Ctx) return;
    audioCtx = new Ctx();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume().catch(() => {});
  }
};

const playNotificationSound = () => {
  if (!audioCtx || audioCtx.state !== 'running') return;
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();

  osc.type = 'sine';
  osc.frequency.value = 800;
  gain.gain.value = 0.05;

  osc.connect(gain);
  gain.connect(audioCtx.destination);

  osc.start();
  osc.stop(audioCtx.currentTime + 0.15);
};

/* =========================
   NOTIFICATION (SAFE)
========================= */
const isIOS = /iphone|ipad|ipod/i.test(navigator.userAgent);

const showNotification = async (title: string, body: string) => {
  if (!('Notification' in window)) return;
  if (Notification.permission !== 'granted') return;
  if (isIOS) return;

  const options: NotificationOptions = {
    body,
    icon: '/favicon.svg',
    tag: 'new-message'
  };

  if ('serviceWorker' in navigator) {
    const reg = await navigator.serviceWorker.getRegistration();
    if (reg) {
      reg.showNotification(title, options);
      return;
    }
  }

  try {
    new Notification(title, options);
  } catch {}
};

/* =========================
   COMPONENT
========================= */
const Dashboard: React.FC<any> = (props) => {
  const [view, setView] = useState<AdminView>('hero');
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'success' | 'error' | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notificationPermission, setNotificationPermission] =
    useState<NotificationPermission>('default');

  const installPromptRef = useRef<any>(null);
  const lastMessageCount = useRef<number | null>(null);
  const [messageTrigger, setMessageTrigger] = useState(0);

  /* =========================
     INSTALL PROMPT
  ========================= */
  useEffect(() => {
    const handler = (e: any) => {
      e.preventDefault();
      installPromptRef.current = e;
    };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  /* =========================
     PERMISSION
  ========================= */
  useEffect(() => {
    if ('Notification' in window && !isIOS) {
      setNotificationPermission(Notification.permission);
    }
  }, []);

  /* =========================
     MESSAGE POLLING (SAFE)
  ========================= */
  useEffect(() => {
    let interval: number | null = null;

    const checkMessages = async () => {
      try {
        const apiKey = sessionStorage.getItem('apiKey');
        const res = await fetch('/api/messages', {
          headers: { Authorization: `Bearer ${apiKey}` }
        });
        if (!res.ok) return;

        const data: Message[] = await res.json();
        const count = data.length;

        if (
          lastMessageCount.current !== null &&
          count > lastMessageCount.current
        ) {
          const msg = data[0];
          setMessageTrigger((v) => v + 1);

          await showNotification(
            `New Message from ${msg?.name || 'Visitor'}`,
            msg?.message?.slice(0, 60) || 'New message'
          );

          playNotificationSound();
        }

        lastMessageCount.current = count;
      } catch {}
    };

    const start = () => {
      if (!interval) interval = window.setInterval(checkMessages, 5000);
    };
    const stop = () => {
      if (interval) clearInterval(interval);
      interval = null;
    };

    document.addEventListener('visibilitychange', () => {
      document.hidden ? stop() : start();
    });

    start();
    return stop;
  }, []);

  /* =========================
     REQUEST NOTIFICATION
  ========================= */
  const requestPermission = async () => {
    initAudio();
    if (!('Notification' in window) || isIOS) return;
    const p = await Notification.requestPermission();
    setNotificationPermission(p);
    if (p === 'granted') {
      showNotification('Notifications Enabled', 'Alerts active');
      playNotificationSound();
    }
  };

  /* =========================
     INSTALL
  ========================= */
  const handleInstall = async () => {
    const prompt = installPromptRef.current;
    if (!prompt) return;
    await prompt.prompt();
    installPromptRef.current = null;
  };

  /* =========================
     SAVE
  ========================= */
  const handleSave = async () => {
    initAudio();
    setIsSaving(true);
    try {
      await props.onSave();
      setSaveStatus('success');
    } catch {
      setSaveStatus('error');
    } finally {
      setIsSaving(false);
      setTimeout(() => setSaveStatus(null), 2500);
    }
  };

  /* =========================
     VIEW
  ========================= */
  const renderView = () => {
    switch (view) {
      case 'hero':
        return <ManageHero {...props} />;
      case 'theme':
        return <ManageTheme {...props} />;
      case 'skills':
        return <ManageSkills {...props} />;
      case 'experience':
        return <ManageExperience {...props} />;
      case 'projects':
        return <ManageProjects {...props} />;
      case 'socials':
        return <ManageSocials {...props} />;
      case 'blog':
        return <ManageBlog {...props} />;
      case 'messages':
        return <ManageMessages refreshTrigger={messageTrigger} />;
      case 'playground':
        return <ManagePlayground {...props} />;
      case 'ai':
        return <ManageAI />;
      case 'security':
        return <ManageSecurity />;
      default:
        return null;
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* SIDEBAR */}
      <aside className={`fixed md:static w-64 ${sidebarOpen ? '' : 'hidden md:block'}`}>
        <button onClick={() => setSidebarOpen(false)}><X /></button>
        <button onClick={handleInstall}><MonitorDown /> Install</button>
        {notificationPermission === 'granted' ? (
          <span><Bell /> Alerts On</span>
        ) : (
          <button onClick={requestPermission}><BellOff /> Enable Alerts</button>
        )}
      </aside>

      {/* MAIN */}
      <main className="flex-1">
        <header className="flex justify-between">
          <button onClick={() => setSidebarOpen(true)}><Menu /></button>
          <button onClick={handleSave} disabled={isSaving}>
            {isSaving ? <Loader2 className="animate-spin" /> : 'Save'}
          </button>
        </header>

        {saveStatus === 'success' && <div>Saved</div>}
        {saveStatus === 'error' && <div>Error</div>}

        {renderView()}
      </main>
    </div>
  );
};

export default Dashboard;
