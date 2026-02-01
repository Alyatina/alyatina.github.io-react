import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();

    const users = JSON.parse(localStorage.getItem("users")) || [];
    const user = users.find(
      (u) => u.email === email && u.password === password
    );

    if (!user) {
      alert("Невірний email або пароль");
      return;
    }

    localStorage.setItem("currentUser", JSON.stringify(user));

    if (user.role === "admin") {
      navigate("/admin");
    } else {
      navigate("/profile");
    }
  };

  return (
    <div className="auth-container">
      <h2 className="auth-title">Вхід</h2>

      <form className="auth-form" onSubmit={handleLogin}>
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

        <button type="submit">Увійти</button>
      </form>

      <p className="auth-link">
        Немає акаунту? <Link to="/register">Зареєструватися</Link>
      </p>
    </div>
  );
};

export default Login;