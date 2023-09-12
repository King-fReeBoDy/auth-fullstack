import { useContext, useState } from "react";
import { AuthAPI } from "../context/AuthContext";
import axios from "axios";
import { saveTolocalStorage } from "../utils/localStorage";
import { useNavigate } from "react-router-dom";
import useAxios from "../utils/useAxios";

interface IUsers {
  username: string;
  email: string;
}

const Home = () => {
  const { user, setUser } = useContext(AuthAPI);
  const [users, setUsers] = useState<IUsers[] | null>(null);
  const api = useAxios();
  const navigate = useNavigate();

  const getAllUsers = async () => {
    try {
      const data: IUsers[] | null = await api.get("");
      setUsers(data);
    } catch (error) {
      console.error(error);
    }
  };

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

      <p className="py-2 px-5 bg-black text-white" onClick={getAllUsers}>
        Get all users
      </p>

      <section>
        {users?.map((user) => {
          return (
            <div>
              <p>{user.username}</p>
              <p>{user.email}</p>
            </div>
          );
        })}
      </section>
    </section>
  );
};

export default Home;
