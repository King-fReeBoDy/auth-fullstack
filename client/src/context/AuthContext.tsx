import { useState, ReactNode, createContext } from "react";

type IUser = {
  id: string;
  username: string;
  email: string;
  password: string;
};

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

  return (
    <AuthAPI.Provider value={{ user, setUser }}>{children}</AuthAPI.Provider>
  );
};

export default AuthContext;
