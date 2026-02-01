import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./App.css";

const Register = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [role, setRole] = useState("user");

  const handleRegister = (e) => {
    e.preventDefault();

    const users = JSON.parse(localStorage.getItem("users")) || [];

    const exists = users.find((u) => u.email === email);
    if (exists) {
      alert("Користувач з таким email вже існує");
      return;
    }

    const newUser = {
      email,
      password,
      phone,
      address: "",
      role,
      cart: [],
      wishlist: [],
      orders: []
    };

    users.push(newUser);
    localStorage.setItem("users", JSON.stringify(users));
    localStorage.setItem("currentUser", JSON.stringify(newUser));

    navigate("/profile");
  };

  return (
    <div className="auth-container">
      <h2 className="auth-title">Реєстрація</h2>

      <form className="auth-form" onSubmit={handleRegister}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          required
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Пароль"
          value={password}
          required
          onChange={(e) => setPassword(e.target.value)}
        />

        <input
          type="tel"
          placeholder="Номер телефону"
          value={phone}
          required
          onChange={(e) => setPhone(e.target.value)}
        />

        <select value={role} onChange={(e) => setRole(e.target.value)}>
          <option value="user">Користувач</option>
          <option value="admin">Адміністратор</option>
        </select>

        <button type="submit">Зареєструватися</button>
      </form>

      <p className="auth-link">
        Вже маєш акаунт? <Link to="/login">Увійти</Link>
      </p>
    </div>
  );
};

export default Register;