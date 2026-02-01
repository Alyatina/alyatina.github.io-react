import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./App.css";

const CartSidebar = ({ isOpen, onClose, isAuth, onCartChange }) => {
  const navigate = useNavigate();
  const [cart, setCart] = useState([]);

  useEffect(() => {
    if (!isAuth) return setCart([]);
    const user = JSON.parse(localStorage.getItem("currentUser"));
    setCart(user?.cart || []);
  }, [isAuth, isOpen]);

  const getItemPrice = (item) =>
    item.discount
      ? Math.round(item.price * (1 - item.discount / 100))
      : item.price;

  const updateCart = (updatedCart) => {
    setCart(updatedCart);
    const user = JSON.parse(localStorage.getItem("currentUser"));
    if (user) {
      user.cart = updatedCart;
      localStorage.setItem("currentUser", JSON.stringify(user));
      window.dispatchEvent(new Event("cartUpdated"));
    }
    if (onCartChange) onCartChange(updatedCart);
  };

  const handleQuantityChange = (id, quantity) => {
    if (quantity < 1) quantity = 1;
    const updatedCart = cart.map((item) =>
      item.id === id ? { ...item, quantity } : item
    );
    updateCart(updatedCart);
  };

  const removeItem = (id) => {
    const updatedCart = cart.filter((item) => item.id !== id);
    updateCart(updatedCart);
  };

  const totalPrice = cart.reduce(
    (sum, item) => sum + getItemPrice(item) * (item.quantity || 1),
    0
  );

  return (
    <>
      {isOpen && <div className="cart-overlay" onClick={onClose} />}

      <aside className={`cart-sidebar ${isOpen ? "open" : ""}`}>
        <h3 className="cart-title">Ваш кошик</h3>

        {!isAuth && (
          <div className="cart-login-wrapper">
            <p className="empty">Увійдіть в акаунт, щоб користуватися кошиком</p>
            <button
              className="cart-login-btn"
              onClick={() => {
                onClose();
                navigate("/login");
              }}
            >
              Увійти в акаунт
            </button>
          </div>
        )}

        {isAuth && cart.length === 0 && (
          <div className="empty-cart">
            <p className="empty">Кошик порожній 😢</p>
            <button
              className="cart-btn-empty"
              onClick={() => {
                onClose();
                navigate("/cart");
              }}
            >
              Перейти до кошику
            </button>
          </div>
        )}

        {isAuth && cart.length > 0 && (
          <>
            <ul className="cart-list">
              {cart.map((item) => {
                const price = getItemPrice(item);
                const itemTotal = price * (item.quantity || 1);

                return (
                  <li key={item.id} className="cart-item">
                    <div className="cart-left">
                      <img src={item.image} alt={item.name} className="cart-item-img" />
                      <div className="cart-item-info">
                        <strong>{item.name}</strong>
                        <input
                          type="number"
                          min="1"
                          value={item.quantity || 1}
                          onChange={(e) =>
                            handleQuantityChange(item.id, Number(e.target.value))
                          }
                          className="cart-qty-input"
                        />
                      </div>
                    </div>

                    <div className="cart-right">
                      <strong>{itemTotal} грн</strong>
                      <button className="remove-btn" onClick={() => removeItem(item.id)}>
                        ✕
                      </button>
                    </div>
                  </li>
                );
              })}
            </ul>

            <div className="cart-footer">
              <p className="cart-total">Разом: {totalPrice} грн</p>
              <button
                className="cart-btn"
                onClick={() => {
                  onClose();
                  navigate("/cart");
                }}
              >
                Оформити замовлення
              </button>
            </div>
          </>
        )}
      </aside>
    </>
  );
};

export default CartSidebar;