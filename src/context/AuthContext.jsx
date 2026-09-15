import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

const AuthContext = createContext({
  user: null,
  profile: null,
  session: null,
  loading: true,
  isConfigured: false,
  signOut: async () => {},
  refreshProfile: async () => {},
  setDemoUser: () => {},
});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const isConfigured = isSupabaseConfigured();

  // Fetch profile from public.profiles
  const fetchProfile = async (userId) => {
    if (!userId || !isConfigured) return null;
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching profile:', error);
      }
      return data || null;
    } catch (err) {
      console.error('Profile fetch catch error:', err);
      return null;
    }
  };

  const refreshProfile = async () => {
    if (user?.id) {
      if (isConfigured) {
        const p = await fetchProfile(user.id);
        setProfile(p);
      } else {
        const stored = localStorage.getItem(`kadam_demo_profile_${user.id}`);
        if (stored) {
          try { setProfile(JSON.parse(stored)); } catch (e) { console.error(e); }
        }
      }
    }
  };

  const setDemoUser = (demoUser, demoSession, demoProfile = null) => {
    setUser(demoUser);
    setSession(demoSession);
    setProfile(demoProfile || {
      id: demoUser.id,
      full_name: demoUser.user_metadata?.full_name || 'Traveler',
      date_of_birth: '1998-05-15',
      bio: 'Excited solo traveler exploring new destinations and connecting with verified travel buddies.',
      completion_score: 85
    });
    localStorage.setItem('kadam_demo_user', JSON.stringify(demoUser));
    localStorage.setItem('kadam_demo_session', JSON.stringify(demoSession));
  };

  useEffect(() => {
    if (!isConfigured) {
      // Check for persisted demo user in unconfigured test sandbox mode
      const storedUser = localStorage.getItem('kadam_demo_user');
      const storedSession = localStorage.getItem('kadam_demo_session');
      if (storedUser && storedSession) {
        try {
          const parsedUser = JSON.parse(storedUser);
          const parsedSession = JSON.parse(storedSession);
          setUser(parsedUser);
          setSession(parsedSession);
          
          const storedProf = localStorage.getItem(`kadam_demo_profile_${parsedUser.id}`);
          if (storedProf) {
            setProfile(JSON.parse(storedProf));
          } else {
            setProfile({
              id: parsedUser.id,
              full_name: parsedUser.user_metadata?.full_name || 'Traveler',
              date_of_birth: '1998-05-15',
              bio: 'Excited solo traveler exploring new destinations and connecting with verified travel buddies.',
              completion_score: 85
            });
          }
        } catch (e) {
          console.error('Error loading demo user:', e);
        }
      }
      setLoading(false);
      return;
    }

    // Initialize real Supabase session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchProfile(session.user.id).then((p) => {
          setProfile(p);
          setLoading(false);
        });
      } else {
        setLoading(false);
      }
    });

    // Listen to real Supabase auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        const p = await fetchProfile(session.user.id);
        setProfile(p);
      } else {
        setProfile(null);
      }
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [isConfigured]);

  const signOut = async () => {
    localStorage.removeItem('kadam_demo_user');
    localStorage.removeItem('kadam_demo_session');
    if (!isConfigured) {
      setUser(null);
      setSession(null);
      setProfile(null);
      return;
    }
    try {
      await supabase.auth.signOut();
    } catch (err) {
      console.error('Sign out error:', err);
    } finally {
      setUser(null);
      setSession(null);
      setProfile(null);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        session,
        loading,
        isConfigured,
        signOut,
        refreshProfile,
        setDemoUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
