import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Wishlist = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [wishlist, setWishlist] = useState([]);
  const [cart, setCart] = useState([]);

  useEffect(() => {
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    if (!currentUser) {
      navigate("/login");
      return;
    }

    setUser(currentUser);
    setWishlist(currentUser.wishlist || []);
    setCart(currentUser.cart || []);
  }, [navigate]);

  const saveUser = (updatedUser) => {
    setUser(updatedUser);
    localStorage.setItem("currentUser", JSON.stringify(updatedUser));

    const users = JSON.parse(localStorage.getItem("users")) || [];
    localStorage.setItem(
      "users",
      JSON.stringify(users.map(u =>
        u.email === updatedUser.email ? updatedUser : u
      ))
    );
  };

  const addToCart = (item) => {
    let updatedCart = [...cart];
    const existing = updatedCart.find(p => p.id === item.id);

    if (existing) {
      updatedCart = updatedCart.map(p =>
        p.id === item.id
          ? { ...p, quantity: (p.quantity || 1) + 1 }
          : p
      );
    } else {
      updatedCart.push({ ...item, quantity: 1 });
    }

    const updatedWishlist = wishlist.filter(p => p.id !== item.id);

    const updatedUser = {
      ...user,
      cart: updatedCart,
      wishlist: updatedWishlist,
    };

    setCart(updatedCart);
    setWishlist(updatedWishlist);
    saveUser(updatedUser);

    window.dispatchEvent(new Event("cartUpdated"));
  };
  const removeFromWishlist = (id) => {
    const updatedWishlist = wishlist.filter(item => item.id !== id);

    const updatedUser = {
      ...user,
      wishlist: updatedWishlist,
    };

    setWishlist(updatedWishlist);
    saveUser(updatedUser);
  };

  const addAllToCart = () => {
    if (wishlist.length === 0) return;

    let updatedCart = [...cart];

    wishlist.forEach(item => {
      const existing = updatedCart.find(p => p.id === item.id);
      if (existing) {
        updatedCart = updatedCart.map(p =>
          p.id === item.id ? { ...p, quantity: (p.quantity || 1) + 1 } : p
        );
      } else {
        updatedCart.push({ ...item, quantity: 1 });
      }
    });

    const updatedUser = {
      ...user,
      cart: updatedCart,
      wishlist: [],
    };

    setCart(updatedCart);
    setWishlist([]);
    saveUser(updatedUser);

    window.dispatchEvent(new Event("cartUpdated"));
  };

  if (!user) return null;

  return (
    <div className="wishlist-page">
      <h2 className="wishlist-title">Вішліст</h2>

      {wishlist.length === 0 ? (
        <p className="empty">Вішліст порожній 😢</p>
      ) : (
        <>
          <div className="wishlist-list">
            {wishlist.map(item => (
              <div key={item.id} className="wishlist-item">
                <img
                  src={item.image || "https://via.placeholder.com/120"}
                  alt={item.name}
                  className="wishlist-img"
                />

                <div className="wishlist-info">
                  <h3>{item.name}</h3>

                  <div className="wishlist-price">
                    {item.discount ? (
                      <>
                        <span className="old-price" style={{ textDecoration: "line-through", marginRight: "8px" }}>
                          {item.price} грн
                        </span>
                        <span className="new-price">
                          {Math.round(item.price * (1 - item.discount / 100))} грн
                        </span>
                      </>
                    ) : (
                      <span className="new-price">{item.price} грн</span>
                    )}
                  </div>

                  <div className="wishlist-actions" style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
                    <button
                      className="wishlist-cart-btn"
                      onClick={() => addToCart(item)}
                    >
                      У кошик
                    </button>

                    <button
                      className="wishlist-remove-btn"
                      onClick={() => removeFromWishlist(item.id)}
                    >
                      ✕
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div style={{ textAlign: "center", marginTop: "30px" }}>
            <button
              onClick={addAllToCart}
              style={{
                padding: "14px 28px",
                fontSize: "18px",
                backgroundColor: "#2196F3",
                color: "white",
                border: "none",
                borderRadius: "8px",
                cursor: "pointer",
                transition: "transform 0.2s, background-color 0.2s",
              }}
              onMouseEnter={e => e.currentTarget.style.transform = "scale(1.05)"}
              onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}
            >
              Додати все
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Wishlist;