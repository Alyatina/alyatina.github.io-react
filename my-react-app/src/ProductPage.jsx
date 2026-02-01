import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

const ProductPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const products = JSON.parse(localStorage.getItem("products")) || [];
    const foundProduct = products.find((p) => p.id === Number(id));
    setProduct(foundProduct || null);
  }, [id]);

  const handleAddToCart = () => {
    const user = JSON.parse(localStorage.getItem("currentUser"));
    if (!user) return alert("Спершу увійдіть!");

    const updatedCart = [...(user.cart || [])];
    const existingIndex = updatedCart.findIndex((item) => item.id === product.id);

    if (existingIndex > -1) {
      updatedCart[existingIndex].quantity += quantity;
    } else {
      updatedCart.push({ ...product, quantity });
    }

    const updatedUser = { ...user, cart: updatedCart };
    localStorage.setItem("currentUser", JSON.stringify(updatedUser));

    window.dispatchEvent(new Event("cartUpdated"));

    alert(`${product.name} успішно додано до кошику!`);

    setQuantity(1);
  };

  const handleAddToWishlist = () => {
    const user = JSON.parse(localStorage.getItem("currentUser"));
    if (!user) return alert("Спершу увійдіть!");

    const updatedWishlist = [...(user.wishlist || [])];
    if (!updatedWishlist.find((item) => item.id === product.id)) {
      updatedWishlist.push(product);
      localStorage.setItem(
        "currentUser",
        JSON.stringify({ ...user, wishlist: updatedWishlist })
      );
      alert(`${product.name} додано до вішлісту!`);
    } else {
      alert(`${product.name} вже у вішлісті`);
    }
  };

  if (!product) {
    return (
      <div style={{ textAlign: "center", marginTop: "50px" }}>
        <h2>Товар не знайдено 😢</h2>
        <button onClick={() => navigate("/")}>Повернутися на головну</button>
      </div>
    );
  }

  const discountedPrice =
    product.discount > 0
      ? Math.round(product.price * (1 - product.discount / 100))
      : product.price;

  return (
    <div className="category-container">

      <div className="breadcrumbs" style={{ marginBottom: "20px" }}>
        <span
          onClick={() => navigate("/")}
          style={{ cursor: "pointer", color: "#4f46e5" }}>
          Головна
        </span>{" "}
        / <span>{product.category}</span>
      </div>

      <div
        className="product-page-container"
        style={{
          display: "flex",
          gap: "40px",
          flexWrap: "wrap",
          alignItems: "flex-start",
        }}>
        <div
          style={{
            flex: "1 1 400px",
            textAlign: "center",
            position: "relative",
          }}>
          {product.discount > 0 && (
            <span
              className="discount-label"
              style={{
                position: "absolute",
                top: "10px",
                left: "10px",
                zIndex: 10,
                backgroundColor: "#ef4444",
                color: "#fff",
                padding: "5px 10px",
                fontWeight: 700,
                borderRadius: "6px",
                fontSize: "14px",
              }}
            >
              -{product.discount}%
            </span>
          )}
          <img
            src={product.image}
            alt={product.name}
            style={{
              width: "350px",
              height: "350px",
              objectFit: "cover",
              borderRadius: "12px",
              boxShadow: "0 8px 25px rgba(0,0,0,0.2)",
              transition: "transform 0.3s ease, box-shadow 0.3s ease",
              cursor: "pointer",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "scale(1.05)";
              e.currentTarget.style.boxShadow = "0 15px 40px rgba(0,0,0,0.3)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "scale(1)";
              e.currentTarget.style.boxShadow = "0 8px 25px rgba(0,0,0,0.2)";
            }}
          />
        </div>

        <div style={{ flex: "1 1 400px" }}>
          <h2 style={{ fontSize: "28px", fontWeight: 700, marginBottom: "10px" }}>
            {product.name}
          </h2>
          <p style={{ marginBottom: "10px", color: "#6b7280", fontSize: "16px" }}>
            Категорія: {product.category}
          </p>
          <div className="product-price" style={{ marginBottom: "20px", fontSize: "20px" }}>
            {product.discount > 0 ? (
              <>
                <span
                  className="old-price"
                  style={{
                    textDecoration: "line-through",
                    color: "#9ca3af",
                    marginRight: "8px",
                  }}
                >
                  {product.price} грн
                </span>
                <span
                  className="new-price"
                  style={{ fontWeight: 700, color: "#4f46e5" }}
                >
                  {discountedPrice} грн
                </span>
              </>
            ) : (
              <span className="new-price" style={{ fontWeight: 700, color: "#4f46e5" }}>
                {product.price} грн
              </span>
            )}
          </div>

          <div style={{ marginBottom: "20px" }}>
            <label style={{ marginRight: "10px", fontSize: "16px" }}>Кількість:</label>
            <input
              type="number"
              min="1"
              value={quantity}
              onChange={(e) => setQuantity(Math.max(1, Number(e.target.value)))}
              style={{
                width: "70px",
                padding: "5px",
                fontSize: "16px",
                borderRadius: "6px",
                border: "1px solid #ccc",
              }}
            />
          </div>

          <div style={{ display: "flex", gap: "15px", flexWrap: "wrap" }}>
            <button
              className="btn-cart"
              style={{
                flex: "1",
                padding: "14px 20px",
                fontSize: "16px",
                fontWeight: 600,
                borderRadius: "8px",
                transition: "transform 0.2s ease",
              }}
              onClick={handleAddToCart}
              onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
              onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
            >
              Додати до кошику
            </button>
            <button
              className="btn-wishlist"
              style={{
                flex: "1",
                padding: "14px 20px",
                fontSize: "16px",
                fontWeight: 600,
                borderRadius: "8px",
                transition: "transform 0.2s ease",
              }}
              onClick={handleAddToWishlist}
              onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
              onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
            >
              Додати до вішлісту
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductPage;