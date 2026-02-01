import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Admin = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [products, setProducts] = useState([]);

  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [discount, setDiscount] = useState("");
  const [imageURL, setImageURL] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState(null);

  const [editingId, setEditingId] = useState(null);
  const [editValues, setEditValues] = useState({});

  useEffect(() => {
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    if (!currentUser || currentUser.role !== "admin") {
      navigate("/login");
      return;
    }
    setUser(currentUser);

    const savedProducts = JSON.parse(localStorage.getItem("products")) || [];
    setProducts(savedProducts);
  }, [navigate]);

  const handleAddProduct = () => {
    if (!name || !price || !category) {
      alert("Заповніть всі обов'язкові поля!");
      return;
    }
    if (+price < 0) {
      alert("Ціна не може бути від’ємною!");
      return;
    }
    if (discount !== "" && (+discount < 0 || +discount > 100)) {
      alert("Знижка має бути від 0 до 100%!");
      return;
    }

    const img = imageFile
      ? URL.createObjectURL(imageFile)
      : imageURL || "https://via.placeholder.com/150";

    const newProduct = {
      id: Date.now(),
      name,
      price: +price,
      discount: discount === "" ? 0 : +discount,
      category,
      image: img,
    };

    const updatedProducts = [...products, newProduct];
    setProducts(updatedProducts);
    localStorage.setItem("products", JSON.stringify(updatedProducts));

    setName("");
    setPrice("");
    setCategory("");
    setDiscount("");
    setImageURL("");
    setImageFile(null);
    setPreview(null);
  };

  const handleDelete = (id) => {
    const confirm = window.confirm("Ви впевнені, що хочете видалити цей товар?");
    if (!confirm) return;

    const updated = products.filter((p) => p.id !== id);
    setProducts(updated);
    localStorage.setItem("products", JSON.stringify(updated));
  };

  const handleStartEdit = (product) => {
    setEditingId(product.id);
    setEditValues({ ...product });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditValues({});
  };

  const handleSaveEdit = (id) => {
    if (!editValues.name || editValues.price === "" || !editValues.category) {
      alert("Заповніть всі обов'язкові поля!");
      return;
    }
    if (editValues.price < 0) {
      alert("Ціна не може бути від’ємною!");
      return;
    }
    if (editValues.discount < 0 || editValues.discount > 100) {
      alert("Знижка має бути від 0 до 100%!");
      return;
    }

    const updatedProducts = products.map((p) =>
      p.id === id ? { ...editValues } : p
    );
    setProducts(updatedProducts);
    localStorage.setItem("products", JSON.stringify(updatedProducts));
    setEditingId(null);
    setEditValues({});
  };

  const handleFileChange = (e, key) => {
    const file = e.target.files[0];
    if (file) {
      const imgURL = URL.createObjectURL(file);
      setEditValues((prev) => ({ ...prev, [key]: imgURL }));
    }
  };

  if (!user) return null;

  return (
    <div className="admin-container">
      <h2 className="admin-title">Адмін панель</h2>

      <div className="admin-card">
        <h3>Додати новий товар</h3>
        <div className="admin-form">
          <input
            placeholder="Назва товару"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            placeholder="Ціна"
            type="number"
            min="0"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />
          <input
            placeholder="Категорія"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          />
          <input
            placeholder="Знижка %"
            type="number"
            min="0"
            max="100"
            value={discount}
            onChange={(e) => setDiscount(e.target.value)}
          />
          <label>Завантажити файл:</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              setImageFile(e.target.files[0]);
              setPreview(URL.createObjectURL(e.target.files[0]));
            }}
          />
          <label>Або вставити URL картинки:</label>
          <input
            type="text"
            placeholder="https://example.com/image.jpg"
            value={imageURL}
            onChange={(e) => {
              setImageURL(e.target.value);
              setPreview(e.target.value);
            }}
          />
          {preview && <img src={preview} alt="preview" className="admin-preview" />}
          <button onClick={handleAddProduct}>Додати товар</button>
        </div>
      </div>

      <div className="admin-card">
        <h3>Список товарів</h3>
        {products.length === 0 ? (
          <p className="empty">Товарів немає</p>
        ) : (
          <ul className="admin-product-list">
            {products.map((p) => {
              const discountedPrice =
                p.discount > 0 ? Math.round(p.price * (1 - p.discount / 100)) : p.price;
              const isEditing = editingId === p.id;

              return (
                <li key={p.id} className="admin-product-item">
                  <img src={p.image} alt={p.name} className="admin-product-img" />
                  <div className="admin-product-info">
                    <strong>{p.name}</strong>
                    <span>
                      Ціна:{" "}
                      {p.discount > 0 ? (
                        <>
                          <span className="old-price">{p.price} грн</span>{" "}
                          <span className="new-price">{discountedPrice} грн</span>
                        </>
                      ) : (
                        <span>{p.price} грн</span>
                      )}
                    </span>
                    <span>Знижка: {p.discount}%</span>
                    <span>Категорія: {p.category}</span>

                    {isEditing && (
                      <div className="edit-block">
                        <input
                          type="text"
                          value={editValues.name}
                          onChange={(e) =>
                            setEditValues((prev) => ({ ...prev, name: e.target.value }))
                          }
                        />
                        <input
                          type="number"
                          min="0"
                          value={editValues.price}
                          onChange={(e) =>
                            setEditValues((prev) => ({ ...prev, price: +e.target.value }))
                          }
                        />
                        <input
                          type="number"
                          min="0"
                          max="100"
                          value={editValues.discount}
                          onChange={(e) =>
                            setEditValues((prev) => ({ ...prev, discount: +e.target.value }))
                          }
                        />
                        <input
                          type="text"
                          value={editValues.category}
                          onChange={(e) =>
                            setEditValues((prev) => ({ ...prev, category: e.target.value }))
                          }
                        />
                        <label>Завантажити нове зображення:</label>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleFileChange(e, "image")}
                        />
                        <div className="edit-actions">
                          <button onClick={() => handleSaveEdit(p.id)}>Зберегти</button>
                          <button onClick={handleCancelEdit}>Відмінити зміни</button>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="admin-product-actions">
                    {!isEditing && (
                      <>
                        <button onClick={() => handleStartEdit(p)}>Редагувати</button>
                        <button className="delete-btn" onClick={() => handleDelete(p.id)}>
                          Видалити
                        </button>
                      </>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
};
export default Admin;