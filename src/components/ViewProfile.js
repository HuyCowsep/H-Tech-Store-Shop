import React, { useState, useEffect } from "react";
import { CircularProgress } from "@mui/material";
import { faUser, faEnvelope, faCalendarAlt, faGenderless, faShieldAlt, faEye, faEyeSlash, faKey } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Footer from "./Footer";

function ViewProfile() {
  const [user, setUser] = useState(null);
  const [loggedInUserId, setLoggedInUserId] = useState(null);
  const [passwordVisible, setPasswordVisible] = useState(false);

  useEffect(() => {
    const storedAccounts = localStorage.getItem("accounts");
    if (storedAccounts) {
      const accounts = JSON.parse(storedAccounts);
      const loggedInUser = accounts[0];

      if (loggedInUser) {
        setLoggedInUserId(loggedInUser.id); // Lưu id của người dùng vào state

        fetch(`http://localhost:9999/accounts/${loggedInUser.id}`)
          .then((response) => response.json())
          .then((data) => {
            setUser(data);
          })
          .catch((error) => {
            console.error("Lỗi khi lấy dữ liệu tài khoản:", error);
          });
      }
    }
  }, [loggedInUserId]);

  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh", backgroundColor: "#f9f9f9" }}>
      <h2 style={{ margin: "20px 0", fontSize: "50px", textAlign: "center", color: "#333", textShadow: "1px 1px 5px rgba(0,0,0,0.1)" }}>Thông tin cá nhân</h2>
      <div style={{ flex: 1, display: "flex", justifyContent: "center", alignItems: "center" }}>
        {user ? (
          <div
            style={{
              border: "1px solid #ddd",
              borderRadius: "12px",
              padding: "30px",
              backgroundColor: "#ffffff",
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
              maxWidth: "500px",
              width: "100%",
              transition: "transform 0.2s, box-shadow 0.2s",
            }}
          >
            <div style={{ marginBottom: "20px", display: "flex", alignItems: "center" }}>
              <FontAwesomeIcon icon={faUser} style={{ marginRight: "15px", fontSize: "20px", color: "#3498db" }} />
              <p style={{ fontSize: "20px", fontWeight: "bold", margin: "0", color: "#555" }}>
                Tên Đăng Nhập: <span style={{ color: "#333" }}>{user.name}</span>
              </p>
            </div>
            <div style={{ marginBottom: "20px", display: "flex", alignItems: "center" }}>
              <FontAwesomeIcon icon={faEnvelope} style={{ marginRight: "15px", fontSize: "20px", color: "#e74c3c" }} />
              <p style={{ fontSize: "20px", fontWeight: "bold", margin: "0", color: "#555" }}>
                Email: <span style={{ color: "#333" }}>{user.email}</span>
              </p>
            </div>
            <div style={{ marginBottom: "20px", display: "flex", alignItems: "center" }}>
              <FontAwesomeIcon icon={faCalendarAlt} style={{ marginRight: "15px", fontSize: "20px", color: "#f1c40f" }} />
              <p style={{ fontSize: "20px", fontWeight: "bold", margin: "0", color: "#555" }}>
                Ngày sinh: <span style={{ color: "#333" }}>{new Date(user.dob).toLocaleDateString("vi-VN")}</span>
              </p>
            </div>
            <div style={{ marginBottom: "20px", display: "flex", alignItems: "center" }}>
              <FontAwesomeIcon icon={faGenderless} style={{ marginRight: "15px", fontSize: "20px", color: "#9b59b6" }} />
              <p style={{ fontSize: "20px", fontWeight: "bold", margin: "0", color: "#555" }}>
                Giới Tính: <span style={{ color: "#333" }}>{user.gender}</span>
              </p>
            </div>
            <div style={{ marginBottom: "20px", display: "flex", alignItems: "center" }}>
              <FontAwesomeIcon icon={faShieldAlt} style={{ marginRight: "15px", fontSize: "20px", color: "#2ecc71" }} />
              <p style={{ fontSize: "20px", fontWeight: "bold", margin: "0", color: "#555" }}>
                Vai Trò: <span style={{ color: "#333" }}>{user.role === "admin" ? "Quản trị viên" : "Khách Hàng"}</span>
              </p>
            </div>
            <div style={{ marginBottom: "20px", display: "flex", alignItems: "center" }}>
              <FontAwesomeIcon icon={faKey} style={{ marginRight: "15px", fontSize: "20px", color: "#2ecc71" }} />
              <p style={{ fontSize: "20px", fontWeight: "bold", margin: "0", color: "#555" }}>
                Mật khẩu:{" "}
                <span style={{ color: "#333" }}>
                  <input
                    type={passwordVisible ? "text" : "password"}
                    value={user.password}
                    readOnly
                    style={{
                      border: "none",
                      backgroundColor: "transparent",
                      fontSize: "20px",
                      color: "#333",
                    }}
                  />
                  <FontAwesomeIcon
                    icon={passwordVisible ? faEyeSlash : faEye}
                    onClick={() => setPasswordVisible(!passwordVisible)}
                    style={{ cursor: "pointer", marginLeft: "10px", color: "#3498db" }}
                  />
                </span>
              </p>
            </div>
          </div>
        ) : (
          <CircularProgress style={{ marginTop: "50px", color: "#3498db" }} />
        )}
      </div>
      <Footer />
    </div>
  );
}

export default ViewProfile;
