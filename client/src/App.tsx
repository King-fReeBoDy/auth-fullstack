import { useContext } from "react";
import { Routes, Route, Navigate, Outlet } from "react-router-dom";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Home from "./pages/Home";
import { AuthAPI } from "./context/AuthContext";

const RestrictedRoutes = () => {
  const { user } = useContext(AuthAPI);
  if (!user) {
    return <Navigate to="/" />;
  }
  return (
    <>
      <Outlet />
    </>
  );
};

const ProtectedRoutes = () => {
  const { user } = useContext(AuthAPI);
  if (user) {
    return <Navigate to="/home" />;
  }
  return (
    <>
      <Outlet />
    </>
  );
};

function App() {
  return (
    <>
      <Routes>
        <Route element={<ProtectedRoutes />}>
          <Route index element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Route>
        <Route element={<RestrictedRoutes />}>
          <Route path="/home" element={<Home />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
