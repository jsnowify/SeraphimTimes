import React, { useState, useEffect } from "react";
import API from "../api";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const Register = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    middleName: "",
    lastName: "",
    email: "",
    username: "",
    password: "",
  });
  const navigate = useNavigate();
  const { firstName, middleName, lastName, email, username, password } =
    formData;
  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  useEffect(() => {
    document.title = "Seraphim Times - Register";
  }, []);

  const onSubmit = async (e) => {
    e.preventDefault();
    const registerPromise = API.post("/users/register", formData);
    toast.promise(registerPromise, {
      loading: "Creating account...",
      success: () => {
        navigate("/login");
        return <b>Registration successful! Please log in.</b>;
      },
      error: (err) => <b>{err.response.data.msg || "Registration failed."}</b>,
    });
  };

  return (
    <div>
      <h3 className="font-sans text-3xl font-bold mb-8 text-black">Register</h3>
      <form onSubmit={onSubmit}>
        <div className="grid md:grid-cols-2 md:gap-6">
          <div className="mb-6">
            <label className="block mb-2 text-sm font-medium text-black uppercase">
              First Name
            </label>
            <input
              type="text"
              name="firstName"
              value={firstName}
              onChange={onChange}
              required
              className="font-mono bg-white border border-black text-black text-sm rounded-none focus:ring-black focus:border-black block w-full p-2.5"
            />
          </div>
          <div className="mb-6">
            <label className="block mb-2 text-sm font-medium text-black uppercase">
              Last Name
            </label>
            <input
              type="text"
              name="lastName"
              value={lastName}
              onChange={onChange}
              required
              className="font-mono bg-white border border-black text-black text-sm rounded-none focus:ring-black focus:border-black block w-full p-2.5"
            />
          </div>
        </div>
        <div className="mb-6">
          <label className="block mb-2 text-sm font-medium text-black uppercase">
            Middle Name (Optional)
          </label>
          <input
            type="text"
            name="middleName"
            value={middleName}
            onChange={onChange}
            className="font-mono bg-white border border-black text-black text-sm rounded-none focus:ring-black focus:border-black block w-full p-2.5"
          />
        </div>
        <div className="mb-6">
          <label className="block mb-2 text-sm font-medium text-black uppercase">
            Email
          </label>
          <input
            type="email"
            name="email"
            value={email}
            onChange={onChange}
            required
            className="font-mono bg-white border border-black text-black text-sm rounded-none focus:ring-black focus:border-black block w-full p-2.5"
          />
        </div>
        <div className="mb-6">
          <label className="block mb-2 text-sm font-medium text-black uppercase">
            Username
          </label>
          <input
            type="text"
            name="username"
            value={username}
            onChange={onChange}
            required
            className="font-mono bg-white border border-black text-black text-sm rounded-none focus:ring-black focus:border-black block w-full p-2.5"
          />
        </div>
        <div className="mb-6">
          <label className="block mb-2 text-sm font-medium text-black uppercase">
            Password
          </label>
          <input
            type="password"
            name="password"
            value={password}
            onChange={onChange}
            required
            className="font-mono bg-white border border-black text-black text-sm rounded-none focus:ring-black focus:border-black block w-full p-2.5"
          />
        </div>
        <button
          type="submit"
          className="font-sans text-white bg-black hover:bg-white hover:text-black border border-black font-medium text-sm px-5 py-2.5 text-center transition-colors"
        >
          Register
        </button>
      </form>
    </div>
  );
};
export default Register;
