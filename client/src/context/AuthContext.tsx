import { useState, useEffect, ReactNode, createContext } from "react";
import { getFromLocalStorage } from "../utils/localStorage";

export interface IUser {
  id: string;
  username: string;
  email: string;
  password: string;
  accessToken: string;
}

interface IAuth {
  user: IUser | null;
  setUser: (user: IUser | null) => void;
}

export const AuthAPI = createContext<IAuth>({
  user: null,
  setUser: () => {},
});

const AuthContext = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<IUser | null>(null);

  useEffect(() => {
    const loggedInUser: IUser | null = getFromLocalStorage();
    setUser(loggedInUser);
  }, []);

  return (
    <AuthAPI.Provider value={{ user, setUser }}>{children}</AuthAPI.Provider>
  );
};

export default AuthContext;
