import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../lib/axios";

function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleClick = async () => {
    try {
      const { data } = await api.post("/auth/register", formData);

      console.log(data);
      navigate("/");
    } catch (error) {
      console.error(error.response?.data?.message || error.message);
    }
  };

  return (
    <div>
      <h1>Welcome to Register</h1>

      <input
        type="text"
        name="username"
        placeholder="Add username"
        value={formData.username}
        onChange={handleChange}
      />

      <input
        type="email"
        name="email"
        placeholder="Add email"
        value={formData.email}
        onChange={handleChange}
      />

      <input
        type="password"
        name="password"
        placeholder="Add password"
        value={formData.password}
        onChange={handleChange}
      />

      <button onClick={handleClick}>Submit</button>
    </div>
  );
}

export default Register;
