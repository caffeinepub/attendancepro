import {
  type ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import type { UserProfile } from "../backend";
import { UserRole } from "../backend";
import { useActor } from "../hooks/useActor";

type AuthContextType = {
  profile: UserProfile | null;
  loading: boolean;
  login: (profile: UserProfile) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType>({
  profile: null,
  loading: true,
  login: async () => {},
  logout: () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const { actor, isFetching } = useActor();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isFetching || !actor) return;
    actor
      .getCallerUserProfile()
      .then((p) => {
        setProfile(p);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [actor, isFetching]);

  const login = async (p: UserProfile) => {
    setProfile(p);
    if (actor) {
      try {
        await actor.saveCallerUserProfile(p);
      } catch (e) {
        console.error("Failed to save profile to backend:", e);
      }
    }
  };

  const logout = () => {
    setProfile(null);
    window.location.hash = "/login";
  };

  return (
    <AuthContext.Provider value={{ profile, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}

export { UserRole };
