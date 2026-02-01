import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState("Всі товари");

  useEffect(() => {
    const savedProducts = JSON.parse(localStorage.getItem("products")) || [];
    setProducts(savedProducts);

    const uniqueCategories = [
      "Всі товари",
      ...new Set(savedProducts.map((p) => p.category)),
    ];
    setCategories(uniqueCategories);
  }, []);

  const filteredProducts =
    activeCategory === "Всі товари"
      ? products
      : products.filter((p) => p.category === activeCategory);

  const handleAddToCart = (product) => {
    const user = JSON.parse(localStorage.getItem("currentUser"));
    if (!user) return alert("Спершу увійдіть!");

    const cart = user.cart || [];
    const existingItem = cart.find((item) => item.id === product.id);

    const updatedCart = existingItem
      ? cart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: (item.quantity || 1) + 1 }
            : item
        )
      : [...cart, { ...product, quantity: 1 }];

    const updatedUser = { ...user, cart: updatedCart };
    localStorage.setItem("currentUser", JSON.stringify(updatedUser));
    window.dispatchEvent(new Event("cartUpdated"));

    alert(`${product.name} додано до кошику`);
  };

  const handleAddToWishlist = (product) => {
    const user = JSON.parse(localStorage.getItem("currentUser"));
    if (!user) return alert("Спершу увійдіть!");

    const wishlist = user.wishlist || [];
    if (wishlist.some((item) => item.id === product.id)) {
      return alert(`${product.name} вже у вішлісті ❤️`);
    }

    const updatedUser = { ...user, wishlist: [...wishlist, product] };
    localStorage.setItem("currentUser", JSON.stringify(updatedUser));
    window.dispatchEvent(new Event("wishlistUpdated"));
    alert(`${product.name} додано до вішліста ❤️`);
  };

  return (
    <div className="category-container">
      <div className="categories">
        {categories.map((cat) => (
          <button
            key={cat}
            className={cat === activeCategory ? "active" : ""}
            onClick={() => setActiveCategory(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      <h2 className="category-title">Категорія: {activeCategory}</h2>

      {filteredProducts.length === 0 ? (
        <p className="empty">Товарів немає</p>
      ) : (
        <div className="product-grid">
          {filteredProducts.map((p) => {
            const discountedPrice =
              p.discount > 0
                ? Math.round(p.price * (1 - p.discount / 100))
                : p.price;

            return (
              <div key={p.id} className="product-card">
                {p.discount > 0 && (
                  <span className="discount-label">-{p.discount}%</span>
                )}

                <img
                  src={p.image}
                  alt={p.name}
                  className="product-img"
                  onClick={() => navigate(`/product/${p.id}`)}
                  style={{ cursor: "pointer" }}
                />

                <h3
                  className="product-name"
                  onClick={() => navigate(`/product/${p.id}`)}
                  style={{ cursor: "pointer" }}
                >
                  {p.name}
                </h3>

                <div className="product-price">
                  {p.discount > 0 ? (
                    <>
                      <span className="old-price">{p.price} грн</span>{" "}
                      <span className="new-price">{discountedPrice} грн</span>
                    </>
                  ) : (
                    <span className="new-price">{p.price} грн</span>
                  )}
                </div>

                <div className="product-actions">
                  <button className="btn-cart" onClick={() => handleAddToCart(p)}>
                    Додати до кошику
                  </button>

                  <button
                    className="btn-wishlist"
                    onClick={() => handleAddToWishlist(p)}
                  >
                    Додати до вішліста
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Home;