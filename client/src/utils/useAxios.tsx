import { useContext } from "react";
import axios from "axios";
import jwt_decode from "jwt-decode";

axios.defaults.withCredentials = true;

import { getFromLocalStorage, saveTolocalStorage } from "./localStorage";
import { AuthAPI } from "../context/AuthContext";

interface DecodedToken {
  exp: number;
}

const useAxios = () => {
  const { setUser } = useContext(AuthAPI);
  const user = getFromLocalStorage();

  const axiosInstance = axios.create({
    baseURL: "http://localhost:8080",
    headers: {
      Authorization: `Bearer ${user?.accessToken}`,
    },
  });

  axiosInstance.interceptors.request.use(async (req) => {
    if (user) {
      const decodedToken = jwt_decode<DecodedToken>(user?.accessToken);

      if (decodedToken && decodedToken.exp) {
        const currentTimestamp = Math.floor(Date.now() / 1000);
        if (currentTimestamp <= decodedToken.exp) {
          return req;
        }
      }
    }

    try {
      const { data } = await axios("http://localhost:8080/refresh_token", {
        withCredentials: true,
      });

      req.headers.Authorization = `Bearer ${data.accessToken}`;

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
