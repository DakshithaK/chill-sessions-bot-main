import { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface UserContextType {
  userName: string | null;
  isLoggedIn: boolean;
  login: (name: string) => void;
  logout: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

const USER_NAME_KEY = "chill-sessions-user-name";

interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider = ({ children }: UserProviderProps) => {
  const [userName, setUserName] = useState<string | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Load user name from localStorage on mount
  useEffect(() => {
    const savedName = localStorage.getItem(USER_NAME_KEY);
    if (savedName) {
      setUserName(savedName);
      setIsLoggedIn(true);
    }
  }, []);

  const login = (name: string) => {
    setUserName(name);
    setIsLoggedIn(true);
    localStorage.setItem(USER_NAME_KEY, name);
  };

  const logout = () => {
    setUserName(null);
    setIsLoggedIn(false);
    localStorage.removeItem(USER_NAME_KEY);
  };

  return (
    <UserContext.Provider value={{ userName, isLoggedIn, login, logout }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};


