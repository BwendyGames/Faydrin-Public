import { createContext, useContext, useEffect, useState, ReactNode, useMemo } from "react";
import { supabase } from "../supabase-client";
import { User } from "@supabase/supabase-js";

interface Profile {
  id: string;
  user_name: string | null;
  avatar_url: string | null;
  banner_url: string | null;
}

interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  loading: boolean;
  signInWithDiscord: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  async function loadUserAndProfile(sessionUser: User | null) {
    setLoading(true);
    setUser(sessionUser);

    if (sessionUser) {
      const user_name =
        sessionUser.user_metadata?.display_name ||
        sessionUser.user_metadata?.full_name ||
        sessionUser.email?.split("@")[0] ||
        "User";

      const { data: profileData, error } = await supabase
        .from("profiles")
        .upsert({
          id: sessionUser.id,
          user_name: user_name,
          avatar_url: sessionUser.user_metadata?.avatar_url || null,
          banner_url: null,
        })
        .select()
        .single();

      if (error) {
        console.error("Profile upsert error:", error.message);
      } else {
        setProfile(profileData);
      }
    } else {
      setProfile(null);
    }

    setLoading(false);
  }

  useEffect(() => {
    const getSession = async () => {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error) {
        console.error("Session error:", error.message);
      }
      await loadUserAndProfile(session?.user ?? null);
    };

    getSession();

    const { data: subscription } = supabase.auth.onAuthStateChange((_event, session) => {
      loadUserAndProfile(session?.user ?? null);
    });

    return () => {
      subscription?.subscription.unsubscribe();
    };
  }, []);

  const signInWithDiscord = async () => {
    const { error } = await supabase.auth.signInWithOAuth({ provider: "discord" });
    if (error) {
      console.error("Discord login error:", error.message);
    }
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("Logout error:", error.message);
    }
  };

  const value = useMemo(() => ({
    user,
    profile,
    loading,
    signInWithDiscord,
    signOut,
  }), [user, profile, loading]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

