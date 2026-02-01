import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    if (!currentUser) {
      navigate("/login");
      return;
    }

    setUser(currentUser);
    setPhone(currentUser.phone || "");
    setAddress(currentUser.address || "");
  }, [navigate]);

  const saveProfile = () => {
    const updatedUser = { ...user, phone, address };
    setUser(updatedUser);
    localStorage.setItem("currentUser", JSON.stringify(updatedUser));

    const users = JSON.parse(localStorage.getItem("users")) || [];
    const updatedUsers = users.map(u =>
      u.email === user.email ? updatedUser : u
    );
    localStorage.setItem("users", JSON.stringify(updatedUsers));

    setIsEditing(false);
    alert("Дані збережено ✅");
  };

  const handleLogout = () => {
    if (!window.confirm("Вийти з акаунту?")) return;
    localStorage.removeItem("currentUser");
    navigate("/login");
  };

  if (!user) return null;

  return (
    <div className="profile-page">
      <h2 className="profile-title">Мій кабінет</h2>
      <p className="profile-email">{user.email}</p>

      <section className="profile-section">
        <h3 className="section-title">Особисті дані</h3>

        <div className="profile-form">
          <div className="form-group">
            <label>Телефон</label>
            <input
              value={phone}
              onChange={e => setPhone(e.target.value)}
              disabled={!isEditing}
            />
          </div>

          <div className="form-group">
            <label>Адреса доставки</label>
            <input
              value={address}
              onChange={e => setAddress(e.target.value)}
              disabled={!isEditing}
            />
          </div>

          <div className="form-actions">
            {isEditing ? (
              <button onClick={saveProfile}>Зберегти</button>
            ) : (
              <button onClick={() => setIsEditing(true)}>Редагувати</button>
            )}
          </div>
        </div>
      </section>
      <section className="profile-section">
        <div className="profile-columns">

          <div className="info-card">
            <h3>Історія замовлень</h3>

            {user.orders?.length === 0 ? (
              <p className="empty">Замовлень ще немає</p>
            ) : (
              user.orders.map((order, index) => (
                <div
                  key={order.id}
                  style={{
                    border: "1px solid #e5e7eb",
                    borderRadius: "8px",
                    padding: "10px",
                    marginBottom: "10px",
                  }}
                >
                  <p style={{ fontWeight: 600 }}>
                    Замовлення #{index + 1}
                  </p>
                  <p style={{ fontSize: "14px", color: "#6b7280" }}>
                    {order.date}
                  </p>

                  <ul style={{ paddingLeft: "18px", marginTop: "5px" }}>
                    {order.items.map(item => (
                      <li key={item.id}>
                        {item.name} — {item.quantity} шт.
                      </li>
                    ))}
                  </ul>

                  <p style={{ fontWeight: 600, marginTop: "5px" }}>
                    Сума: {order.total} грн
                  </p>
                </div>
              ))
            )}
          </div>

          <div className="info-card">
            <h3>Вішліст</h3>
            {user.wishlist?.length === 0 ? (
              <p className="empty">Вішліст порожній</p>
            ) : (
              <ul>
                {user.wishlist.map((item, i) => (
                  <li key={i}>{item.name}</li>
                ))}
              </ul>
            )}
          </div>

        </div>
      </section>

      <div className="profile-logout">
        <button className="logout-danger" onClick={handleLogout}>
          Вийти з акаунту
        </button>
      </div>
    </div>
  );
};

export default Profile;