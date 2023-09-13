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
  const [users, setUsers] = useState<IUsers[] | []>([]);
  const api = useAxios();
  const navigate = useNavigate();

  const getAllUsers = async () => {
    try {
      const res = await api.get("");
      const users: IUsers[] | [] = res.data;
      setUsers(users);
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
    <>
      <section className="flex justify-between items-center p-5 text-white bg-black">
        <h1>Auth-fullStack</h1>
        <div className="flex items-center space-x-3">
          <p>{user?.username}</p>
          <button onClick={logout} className="p-2 border rounded-lg text-white">
            Logout
          </button>
        </div>
      </section>
      <section>
        <button
          className="py-2 px-5 mt-10 bg-black text-white rounded-lg m-10"
          onClick={getAllUsers}
        >
          Get all users
        </button>
        <div className="grid grid-cols-2 mt-10 w-[90%] lg:w-[900px] mx-auto">
          {users.map((user, idx) => {
            return (
              <div key={idx} className="mb-5">
                <p className="font-bold">{user.username}</p>
                <p>{user.email}</p>
              </div>
            );
          })}
        </div>
      </section>
    </>
  );
};

export default Home;
