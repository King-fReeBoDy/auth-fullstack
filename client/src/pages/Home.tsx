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
      const data: IUsers[] | [] = await api.get("");
      setUsers(data);
    } catch (error) {
      console.error(error);
    }
  };

  console.log(users);

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
          className="py-2 px-5 mt-10 bg-black text-white rounded-lg"
          onClick={getAllUsers}
        >
          Get all users
        </button>
        {/* <div>
          {users?.map((user) => {
            return (
              <div>
                <p>{user.username}</p>
                <p>{user.email}</p>
              </div>
            );
          })}
        </div> */}
      </section>
    </>
  );
};

export default Home;
