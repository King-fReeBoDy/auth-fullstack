import { useContext } from "react";
import { AuthAPI } from "../context/AuthContext";

const Home = () => {
  const { user } = useContext(AuthAPI);
  return (
    <section className="flex justify-between items-center p-5 text-white bg-blue-500">
      <h1>Auth-fullStack</h1>
      <p>{user?.username}</p>
    </section>
  );
};

export default Home;
