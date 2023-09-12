import { IUser } from "../context/AuthContext";

export const saveTolocalStorage = (user: IUser | null) => {
  localStorage.setItem("user", JSON.stringify(user));
};

export const getFromLocalStorage = (): IUser | null => {
  const storage = localStorage.getItem("user");
  if (storage) {
    return JSON.parse(storage);
  }
  return null;
};
