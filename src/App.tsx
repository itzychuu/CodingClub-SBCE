import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import HomeView from './components/HomeView';
import EventsView from './components/EventsView';
import AboutView from './components/AboutView';
import GalleryView from './components/GalleryView';
import ContactView from './components/ContactView';
import AdminView from './components/AdminView';
import { Event, Member, GalleryItem, Settings } from './types';
import { Terminal } from 'lucide-react';

export default function App() {
  const [currentTab, setTab] = useState<string>('home');
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Core synchronized database states
  const [events, setEvents] = useState<Event[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const [settings, setSettings] = useState<Settings | null>(null);

  // Authentication states
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('sbce_admin_token'));

  // Shared UX states
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

  // Fetch all core datasets from Express server
  const fetchAllData = async () => {
    try {
      const [eventsRes, membersRes, galleryRes, settingsRes] = await Promise.all([
        fetch('/api/events'),
        fetch('/api/members'),
        fetch('/api/gallery'),
        fetch('/api/settings')
      ]);

      const eventsData = await eventsRes.json();
      const membersData = await membersRes.json();
      const galleryData = await galleryRes.json();
      const settingsData = await settingsRes.json();

      setEvents(eventsData);
      setMembers(membersData);
      setGallery(galleryData);
      setSettings(settingsData);
    } catch (err) {
      console.error('Failure retrieving state databases:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Check auth session validity on launch
  const checkAuth = async (currentToken: string) => {
    try {
      const res = await fetch('/api/auth/check', {
        headers: { 'Authorization': `Bearer ${currentToken}` }
      });
      const data = await res.json();
      if (data.authenticated) {
        setIsAuthenticated(true);
      } else {
        localStorage.removeItem('sbce_admin_token');
        setToken(null);
        setIsAuthenticated(false);
      }
    } catch (err) {
      console.error('Session validation query failed:', err);
    }
  };

  useEffect(() => {
    fetchAllData();
    if (token) {
      checkAuth(token);
    }
  }, [token]);

  // Handle Login proxy trigger
  const handleLogin = async (emailInput: string, passwordInput: string): Promise<boolean> => {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: emailInput, password: passwordInput })
      });
      const result = await response.json();
      if (result.success && result.token) {
        localStorage.setItem('sbce_admin_token', result.token);
        setToken(result.token);
        setIsAuthenticated(true);
        return true;
      }
      return false;
    } catch (err) {
      console.error('Login connection error:', err);
      return false;
    }
  };

  // Handle Logout trigger
  const handleLogout = () => {
    localStorage.removeItem('sbce_admin_token');
    setToken(null);
    setIsAuthenticated(false);
    setTab('home');
  };

  // Unified routing navigation with focus trigger
  const handleSelectEventFromHome = (evt: Event) => {
    setSelectedEvent(evt);
    setTab('events');
    // Scroll window smoothly to the event detail modal height
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Render Skeleton Loading Layout
  if (isLoading || !settings) {
    return (
      <div className="min-h-screen bg-black text-neutral-500 flex flex-col items-center justify-center p-6 select-none font-mono text-sm" id="loading-fallback">
        <div className="space-y-4 max-w-sm w-full text-center">
          <Terminal className="w-8 h-8 text-orange-500 mx-auto animate-pulse" />
          <div className="space-y-2">
            <p className="text-white font-bold tracking-tight">sbce-coding-club:~# boot --full-stack</p>
            <div className="w-full bg-neutral-900 h-1.5 rounded-full overflow-hidden relative">
              <div className="bg-orange-500 h-full rounded-full animate-[shimmer_2s_infinite]" style={{ width: '65%' }}></div>
            </div>
            <p className="text-[10px] text-neutral-600">Syncing database structures & layouts...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white antialiased selection:bg-orange-500 selection:text-black font-sans" id="app-root">

      {/* Fixed transparent nav – rendered outside any constraint */}
      <Header 
        currentTab={currentTab} 
        setTab={setTab} 
        isAuthenticated={isAuthenticated} 
        onLogout={handleLogout} 
      />

      {/* Home tab: full-viewport hero + constrained sections below */}
      {currentTab === 'home' && (
        <HomeView 
          settings={settings} 
          events={events} 
          members={members} 
          setTab={setTab} 
          onSelectEvent={handleSelectEventFromHome} 
        />
      )}

      {/* All other tabs: standard constrained layout */}
      {currentTab !== 'home' && (
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24" id="constrained-layout">
          <main id="main-content-area">
            {currentTab === 'events' && (
              <EventsView 
                events={events} 
                onSelectEvent={setSelectedEvent} 
                selectedEvent={selectedEvent} 
                onCloseModal={() => setSelectedEvent(null)} 
              />
            )}

            {currentTab === 'about' && (
              <AboutView 
                settings={settings} 
                members={members} 
              />
            )}

            {currentTab === 'gallery' && (
              <GalleryView 
                gallery={gallery} 
                events={events} 
              />
            )}

            {currentTab === 'contact' && (
              <ContactView 
                settings={settings} 
              />
            )}

            {currentTab === 'admin' && (
              <AdminView 
                isAuthenticated={isAuthenticated} 
                onLogin={handleLogin} 
                events={events} 
                members={members} 
                gallery={gallery} 
                settings={settings} 
                onUpdateEvents={setEvents} 
                onUpdateMembers={setMembers} 
                onUpdateGallery={setGallery} 
                onUpdateSettings={setSettings} 
                token={token} 
              />
            )}
          </main>
        </div>
      )}
    </div>
  );
}
