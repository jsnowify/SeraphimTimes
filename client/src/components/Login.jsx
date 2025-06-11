import React, { useState, useContext, useEffect } from "react";
import API from "../api";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import UserContext from "../context/UserContext";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { setUserData } = useContext(UserContext);
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "Seraphim Times - Login";
  }, []);

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const loginUser = { username, password };
      const loginPromise = API.post("/users/login", loginUser);
      toast.promise(loginPromise, {
        loading: "Logging in...",
        success: (res) => {
          setUserData({
            token: res.data.token,
            user: res.data.user,
          });
          localStorage.setItem("auth-token", res.data.token);
          localStorage.setItem("user", JSON.stringify(res.data.user));
          navigate("/");
          return <b>Login Successful!</b>;
        },
        error: (err) => <b>{err.response.data.msg || "An error occurred."}</b>,
      });
    } catch (err) {
      toast.error("An unexpected error occurred.");
    }
  };

  return (
    <div>
      <h3 className="font-sans text-3xl font-bold mb-8 text-black">Login</h3>
      <form onSubmit={onSubmit}>
        <div className="mb-6">
          <label className="block mb-2 text-sm font-medium text-black uppercase">
            Username
          </label>
          <input
            type="text"
            required
            className="font-mono bg-white border border-black text-black text-sm rounded-none focus:ring-black focus:border-black block w-full p-2.5"
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div className="mb-6">
          <label className="block mb-2 text-sm font-medium text-black uppercase">
            Password
          </label>
          <input
            type="password"
            required
            className="font-mono bg-white border border-black text-black text-sm rounded-none focus:ring-black focus:border-black block w-full p-2.5"
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button
          type="submit"
          className="font-sans text-white bg-black hover:bg-white hover:text-black border border-black font-medium text-sm px-5 py-2.5 text-center transition-colors"
        >
          Login
        </button>
      </form>
      <p className="mt-4 text-sm">
        Don't have an account?{" "}
        <Link to="/register" className="underline hover:opacity-70">
          Register here.
        </Link>
      </p>
    </div>
  );
};
export default Login;
