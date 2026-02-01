import { useNavigate } from "react-router-dom";
import "./App.css";

const Success = () => {
  const navigate = useNavigate();

  return (
    <div className="success-page">
      <div className="success-card">
        <div className="success-icon">🎉</div>
        <h2 className="success-title">Замовлення успішно оформлено!</h2>
        <p className="success-text">
          Дякуємо за покупку! Ваше замовлення додано до історії.
        </p>
        <button
          className="success-btn"
          onClick={() => navigate("/")}
        >
          Повернутися на головну
        </button>
      </div>
    </div>
  );
};

export default Success;
