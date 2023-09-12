import { Link } from "react-router-dom";

const Login = () => {
  return (
    <section className="h-screen flex justify-center items-center">
      <div className="w-[500px] mx-auto space-y-5">
        <h1 className="text-2xl text-center mb-5">LOGIN</h1>
        <div className="grid">
          <label htmlFor="" className="text-sm mb-2">
            Email
          </label>
          <input type="email" name="" id="" className="border p-2 rounded-lg" />
        </div>
        <div className="grid">
          <label htmlFor="" className="text-sm mb-2">
            Password
          </label>
          <input
            type="password"
            name=""
            id=""
            className="border p-2 rounded-lg"
          />
        </div>
        <p className="text-center text-sm">
          <Link to="/register">Register an account</Link>
        </p>
      </div>
    </section>
  );
};

export default Login;
