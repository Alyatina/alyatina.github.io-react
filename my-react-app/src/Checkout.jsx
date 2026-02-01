import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./App.css";

const Checkout = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [cart, setCart] = useState([]);
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");

  useEffect(() => {
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    if (!currentUser) {
      navigate("/login");
      return;
    }
    setUser(currentUser);
    setCart(currentUser.cart || []);
    setPhone(currentUser.phone || "");
    setAddress(currentUser.address || "");
  }, [navigate]);

  const getItemPrice = (item) =>
    item.discount ? Math.round(item.price * (1 - item.discount / 100)) : item.price;

  const handleQuantityChange = (id, quantity) => {
    if (quantity < 1) quantity = 1;
    const updatedCart = cart.map((item) =>
      item.id === id ? { ...item, quantity } : item
    );
    setCart(updatedCart);

    const updatedUser = { ...user, cart: updatedCart, phone, address };
    setUser(updatedUser);
    localStorage.setItem("currentUser", JSON.stringify(updatedUser));

    const users = JSON.parse(localStorage.getItem("users")) || [];
    localStorage.setItem(
      "users",
      JSON.stringify(users.map(u => u.email === updatedUser.email ? updatedUser : u))
    );

    window.dispatchEvent(new Event("cartUpdated"));
  };

  const removeItem = (id) => {
    const updatedCart = cart.filter((item) => item.id !== id);
    handleQuantityChange(null, 0);
    setCart(updatedCart);

    const updatedUser = { ...user, cart: updatedCart, phone, address };
    setUser(updatedUser);
    localStorage.setItem("currentUser", JSON.stringify(updatedUser));

    const users = JSON.parse(localStorage.getItem("users")) || [];
    localStorage.setItem(
      "users",
      JSON.stringify(users.map(u => u.email === updatedUser.email ? updatedUser : u))
    );

    window.dispatchEvent(new Event("cartUpdated"));
  };

  const totalPrice = cart.reduce((sum, item) => sum + getItemPrice(item) * (item.quantity || 1), 0);

  const handlePlaceOrder = () => {
    if (!cart.length) return alert("Кошик порожній 😢");

    const newOrder = {
      id: Date.now(),
      items: cart,
      total: totalPrice,
      date: new Date().toLocaleString(),
      phone,
      address,
    };

    const updatedUser = {
      ...user,
      orders: [...(user.orders || []), newOrder],
      cart: [],
      phone,
      address,
    };

    setUser(updatedUser);
    setCart([]);
    localStorage.setItem("currentUser", JSON.stringify(updatedUser));

    const users = JSON.parse(localStorage.getItem("users")) || [];
    localStorage.setItem(
      "users",
      JSON.stringify(users.map(u => u.email === updatedUser.email ? updatedUser : u))
    );

    window.dispatchEvent(new Event("cartUpdated"));
    navigate("/success");
  };

  if (!user) return null;

  return (
    <div className="checkout-container">
      <h2 className="checkout-title">Оформлення замовлення</h2>

      <div className="checkout-user-info">
        <input
          type="text"
          placeholder="Телефон"
          value={phone}
          onChange={e => setPhone(e.target.value)}
        />
        <input
          type="text"
          placeholder="Адреса"
          value={address}
          onChange={e => setAddress(e.target.value)}
        />
      </div>

      <div className="checkout-cart">
        {cart.length === 0 ? (
          <p className="empty">Кошик порожній 😢</p>
        ) : (
          cart.map(item => {
            const price = getItemPrice(item);
            return (
              <div key={item.id} className="checkout-item">
                <img src={item.image || "https://via.placeholder.com/80"} alt={item.name} className="checkout-item-img" />
                <div className="checkout-item-info">
                  <h4>{item.name}</h4>
                  <div className="checkout-item-price">
                    {item.discount > 0 && (
                      <span className="old-price">{item.price} грн</span>
                    )}
                    <span className="new-price">{price} грн</span>
                  </div>
                  <input
                    type="number"
                    min="1"
                    value={item.quantity || 1}
                    onChange={e => handleQuantityChange(item.id, Number(e.target.value))}
                    className="checkout-item-qty"
                  />
                </div>
                <button className="checkout-item-remove" onClick={() => removeItem(item.id)}>✕</button>
              </div>
            );
          })
        )}
      </div>

      <div className="checkout-footer">
        <p className="checkout-total">Разом: {totalPrice} грн</p>
        <button
          className="checkout-place-order"
          onClick={handlePlaceOrder}
        >
          Оформити замовлення
        </button>
      </div>
    </div>
  );
};

export default Checkout;