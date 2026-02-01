import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Cart = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [cart, setCart] = useState([]);

  useEffect(() => {
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    if (!currentUser) {
      navigate("/login");
      return;
    }
    setUser(currentUser);

    const initializedCart = (currentUser.cart || []).map((item) => ({
      ...item,
      quantity: item.quantity && item.quantity > 0 ? item.quantity : 1,
    }));
    setCart(initializedCart);

    const handleCartUpdate = () => {
      const updatedUser = JSON.parse(localStorage.getItem("currentUser"));
      setCart(updatedUser?.cart || []);
      setUser(updatedUser);
    };

    window.addEventListener("cartUpdated", handleCartUpdate);

    return () => window.removeEventListener("cartUpdated", handleCartUpdate);
  }, [navigate]);

  const saveCart = (updatedCart) => {
    setCart(updatedCart);
    const updatedUser = { ...user, cart: updatedCart };
    setUser(updatedUser);
    localStorage.setItem("currentUser", JSON.stringify(updatedUser));

    window.dispatchEvent(new Event("cartUpdated"));
  };

  const updateQuantity = (id, newQuantity) => {
    if (newQuantity < 1) newQuantity = 1;
    const updatedCart = cart.map((item) =>
      item.id === id ? { ...item, quantity: newQuantity } : item
    );
    saveCart(updatedCart);
  };

  const removeFromCart = (id) => {
    const updatedCart = cart.filter((item) => item.id !== id);
    saveCart(updatedCart);
  };

  const totalPrice = cart.reduce((sum, item) => {
    const price = item.discount
      ? Math.round(item.price * (1 - item.discount / 100))
      : item.price;
    return sum + price * (item.quantity || 1);
  }, 0);

  if (!user) return null;

  return (
    <div className="category-container">
      <h2 style={{ marginBottom: "20px" }}>Кошик</h2>

      {cart.length === 0 ? (
        <p className="empty">Кошик порожній</p>
      ) : (
        <>
          <div className="cart-list">
            {cart.map((item) => {
              const price = item.discount
                ? Math.round(item.price * (1 - item.discount / 100))
                : item.price;
              const qty = item.quantity || 1;
              const totalItemPrice = price * qty;

              return (
                <div
                  key={item.id}
                  className="cart-item"
                  style={{
                    display: "flex",
                    gap: "15px",
                    alignItems: "center",
                    padding: "15px",
                    borderRadius: "10px",
                    boxShadow: "0 5px 20px rgba(0,0,0,0.08)",
                    marginBottom: "15px",
                  }}
                >
                  <div style={{ position: "relative" }}>
                    <img
                      src={item.image}
                      alt={item.name}
                      style={{
                        width: "150px",
                        height: "150px",
                        objectFit: "cover",
                        borderRadius: "10px",
                        boxShadow: "0 4px 15px rgba(0,0,0,0.15)",
                      }}
                    />
                    {item.discount > 0 && (
                      <span
                        style={{
                          position: "absolute",
                          top: "5px",
                          left: "5px",
                          backgroundColor: "#ef4444",
                          color: "#fff",
                          padding: "4px 8px",
                          fontSize: "12px",
                          fontWeight: 700,
                          borderRadius: "5px",
                        }}
                      >
                        -{item.discount}%
                      </span>
                    )}
                  </div>

                  <div style={{ flex: 1 }}>
                    <h3 style={{ margin: "0 0 5px 0" }}>{item.name}</h3>
                    <p style={{ margin: "0 0 5px 0", color: "#6b7280" }}>
                      Категорія: {item.category}
                    </p>

                    <div style={{ marginTop: "5px" }}>
                      <label>Кількість: </label>
                      <input
                        type="number"
                        min="1"
                        value={qty}
                        onChange={(e) =>
                          updateQuantity(item.id, Number(e.target.value))
                        }
                        style={{
                          width: "60px",
                          padding: "6px 8px",
                          borderRadius: "6px",
                          border: "1px solid #ccc",
                          textAlign: "center",
                        }}
                      />
                    </div>
                  </div>

                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "flex-end",
                      gap: "10px",
                    }}
                  >
                    <p
                      style={{
                        margin: 0,
                        fontWeight: 600,
                        fontSize: "16px",
                        color: "#4f46e5",
                      }}
                    >
                      {totalItemPrice} грн
                    </p>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      style={{
                        padding: "8px 12px",
                        borderRadius: "6px",
                        border: "none",
                        backgroundColor: "#ef4444",
                        color: "#fff",
                        fontWeight: 600,
                        cursor: "pointer",
                        height: "35px",
                      }}
                    >
                      Видалити
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          <p
            style={{
              textAlign: "right",
              fontWeight: 700,
              fontSize: "18px",
              marginTop: "20px",
            }}
          >
            Загальна ціна: {totalPrice} грн
          </p>

          <div style={{ textAlign: "right", marginTop: "15px" }}>
            <button
              onClick={() => navigate("/checkout")}
              style={{
                padding: "10px 20px",
                backgroundColor: "#4f46e5",
                color: "#fff",
                border: "none",
                borderRadius: "8px",
                cursor: "pointer",
                fontWeight: 600,
                fontSize: "16px",
                transition: "0.2s",
              }}
              onMouseEnter={(e) => (e.target.style.backgroundColor = "#4338ca")}
              onMouseLeave={(e) => (e.target.style.backgroundColor = "#4f46e5")}
            >
              Перейти до оформлення
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Cart;
