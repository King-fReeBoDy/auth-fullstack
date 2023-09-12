import { useContext } from "react";
import axios from "axios";
import jwt, { JwtPayload } from "jsonwebtoken";

import { getFromLocalStorage, saveTolocalStorage } from "./localStorage";
import { AuthAPI } from "../context/AuthContext";

const useAxios = () => {
  const { setUser } = useContext(AuthAPI);
  const axiosInstance = axios.create({
    baseURL: "http://localhost:8080",
    withCredentials: true,
  });

  const user = getFromLocalStorage();

  axiosInstance.interceptors.request.use(async (req) => {
    if (user) {
      const decodedToken = jwt.decode(user?.accessToken) as JwtPayload;

      if (decodedToken && decodedToken.exp) {
        const currentTimestamp = Math.floor(Date.now() / 1000);

        if (currentTimestamp < decodedToken.exp) {
          return req;
        }
      }
    }

    try {
      const { data } = await axiosInstance.get(
        "http://localhost:8080/refresh-token"
      );

      setUser(data);
      saveTolocalStorage(data);
    } catch (error) {
      setUser(null);
      saveTolocalStorage(null);
      console.log(error);
    }

    return req;
  });

  return axiosInstance;
};

export default useAxios;
