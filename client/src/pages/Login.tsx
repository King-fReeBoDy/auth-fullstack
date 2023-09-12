import axios from "axios";
import { useContext, ChangeEvent, FormEvent, useState } from "react";
import { Link } from "react-router-dom";
import { AuthAPI } from "../context/AuthContext";
import { saveTolocalStorage } from "../utils/localStorage";

const Login = () => {
  const { setUser } = useContext(AuthAPI);
  const [login, setLogin] = useState({
    email: "",
    password: "",
  });

  const handleLogin = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setLogin((prev) => {
      return {
        ...prev,
        [name]: value,
      };
    });
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!login.email || !login.password) {
      return;
    }

    try {
      const { data } = await axios.post("http://localhost:8080/login", login);
      setUser(data);
      saveTolocalStorage(data);
      setLogin({
        email: "",
        password: "",
      });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <section className="h-screen flex justify-center items-center">
      <form onSubmit={handleSubmit} className="w-[500px] mx-auto space-y-5">
        <h1 className="text-3xl text-center mb-5 font-bold">LOGIN</h1>
        <div className="grid">
          <label htmlFor="" className="text-xs mb-1">
            Email
          </label>
          <input
            type="email"
            name="email"
            value={login.email}
            onChange={handleLogin}
            className="border p-2 rounded-lg"
          />
        </div>
        <div className="grid">
          <label htmlFor="" className="text-xs mb-1">
            Password
          </label>
          <input
            type="password"
            name="password"
            value={login.password}
            onChange={handleLogin}
            className="border p-2 rounded-lg"
          />
        </div>
        <button className="w-full p-2 bg-black text-white rounded-lg">
          Login
        </button>
        <p className="text-center text-xs">
          <Link to="/register">Register an account</Link>
        </p>
      </form>
    </section>
  );
};

export default Login;
