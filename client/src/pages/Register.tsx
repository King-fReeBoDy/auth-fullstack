import axios from "axios";
import { ChangeEvent, FormEvent, useState } from "react";

import { Link } from "react-router-dom";

const Register = () => {
  const [register, setRegister] = useState({
    username: "",
    email: "",
    password: "",
    confirmpassword: "",
  });

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setRegister((prev) => {
      return {
        ...prev,
        [name]: value,
      };
    });
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (
      !register.username ||
      !register.email ||
      !register.password ||
      !register.confirmpassword
    ) {
      return;
    }
    if (register.password !== register.confirmpassword) {
      return;
    }
    try {
      const { data } = await axios.post(
        "http://localhost:8080/register",
        register
      );

      console.log(data);

      setRegister({
        username: "",
        email: "",
        password: "",
        confirmpassword: "",
      });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <section className="h-screen flex justify-center items-center">
      <form onSubmit={handleSubmit} className="w-[500px] mx-auto space-y-5">
        <h1 className="text-3xl text-center mb-5 font-bold ">REGISTER</h1>
        <div className="grid">
          <label htmlFor="" className="text-xs mb-1">
            Username
          </label>
          <input
            type="text"
            value={register.username}
            name="username"
            onChange={handleChange}
            className="border p-2 rounded-lg"
          />
        </div>
        <div className="grid">
          <label htmlFor="" className="text-xs mb-1">
            Email
          </label>
          <input
            type="email"
            name="email"
            value={register.email}
            onChange={handleChange}
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
            value={register.password}
            onChange={handleChange}
            className="border p-2 rounded-lg"
          />
        </div>
        <div className="grid">
          <label htmlFor="" className="text-xs mb-1">
            Confirm password
          </label>
          <input
            type="password"
            name="confirmpassword"
            value={register.confirmpassword}
            onChange={handleChange}
            className="border p-2 rounded-lg"
          />
        </div>
        <button className="w-full p-2 bg-black text-white rounded-lg">
          Register
        </button>
        <p className="text-center text-xs">
          <Link to="/">Already have account</Link>
        </p>
      </form>
    </section>
  );
};

export default Register;
