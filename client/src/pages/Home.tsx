import { useContext } from "react";
import { AuthAPI } from "../context/AuthContext";
import axios from "axios";
import { saveTolocalStorage } from "../utils/localStorage";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const { user, setUser } = useContext(AuthAPI);
  const navigate = useNavigate();

  const logout = async () => {
    try {
      await axios("http://localhost:8080/logout");
      saveTolocalStorage(null);
      setUser(null);
      navigate("/");
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <section className="flex justify-between items-center p-5 text-white bg-black">
      <h1>Auth-fullStack</h1>
      <div className="flex items-center space-x-3">
        <p>{user?.username}</p>
        <p onClick={logout} className="p-2 border rounded-lg text-white">
          Logout
        </p>
      </div>
    </section>
  );
};

export default Home;
