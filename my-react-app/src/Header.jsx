import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import CartSidebar from "./CartSidebar";

const getTotalCount = (cart = []) =>
  cart.reduce((sum, item) => sum + (item.quantity || 1), 0);

const Header = () => {
  const navigate = useNavigate();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    const syncCart = () => {
      const user = JSON.parse(localStorage.getItem("currentUser"));
      setCartCount(getTotalCount(user?.cart));
    };

    syncCart();
    window.addEventListener("cartUpdated", syncCart);

    return () => {
      window.removeEventListener("cartUpdated", syncCart);
    };
  }, []);

  const currentUser = JSON.parse(localStorage.getItem("currentUser"));

  const handleProfileClick = () => {
    navigate(currentUser ? "/profile" : "/login");
  };

  const handleWishlistClick = () => {
    if (!currentUser) {
      setIsCartOpen(false);
      navigate("/login");
    } else {
      navigate("/wishlist");
    }
  };

  return (
    <>
      <header className="header">
        <div className="header-logo">
          <Link to="/" style={{ textDecoration: "none", color: "inherit" }}>
            <h1>MyShop</h1>
          </Link>
        </div>

        <nav className="header-nav">
          <Link to="/" className="nav-btn">Головна</Link>

          <button className="nav-btn" onClick={handleProfileClick}>
            Кабінет
          </button>

          <button className="nav-btn" onClick={handleWishlistClick}>
            Вішліст
          </button>

          {currentUser?.role === "admin" && (
            <Link to="/admin" className="nav-btn">Адмін</Link>
          )}

          <button
            className="nav-btn"
            onClick={() => setIsCartOpen(true)}
            style={{ marginLeft: "auto", position: "relative" }}>
            Кошик
            {cartCount > 0 && (
              <span
                style={{
                  position: "absolute",
                  top: "-6px",
                  right: "-10px",
                  background: "red",
                  color: "white",
                  borderRadius: "50%",
                  padding: "2px 6px",
                  fontSize: "12px",
                  minWidth: "20px",
                  textAlign: "center",
                }}
              >
                {cartCount}
              </span>
            )}
          </button>
        </nav>
      </header>

      <CartSidebar
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        isAuth={!!currentUser}
        onCartChange={(updatedCart) => {
          const user = JSON.parse(localStorage.getItem("currentUser"));
          if (user) {
            user.cart = updatedCart;
            localStorage.setItem("currentUser", JSON.stringify(user));
            window.dispatchEvent(new Event("cartUpdated"));
          }
        }}
      />
    </>
  );
};

export default Header;