import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Container } from "react-bootstrap";

function ChangePassword() {
  const navigate = useNavigate();
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordStrength, setPasswordStrength] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleChangePassword = async (currentAccount) => {
    const updatedAccount = {
      ...currentAccount,
      password: newPassword,
    };
    try {
      const response = await fetch(`http://localhost:9999/accounts/${currentAccount.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedAccount),
      });

      if (!response.ok) {
        throw new Error("Không thể thay đổi mật khẩu");
      }
      alert("Mật khẩu của bạn đã được thay đổi thành công! Bạn cần đăng nhập lại");
      navigate("/auth/login");
    } catch (error) {
      setErrorMessage("Có lỗi xảy ra khi thay đổi mật khẩu. Vui lòng thử lại sau.");
    }
  };

  const handleNewPasswordChange = (newPassword) => {
    setNewPassword(newPassword);
    if (/^[0-9]+$/.test(newPassword) || /^[a-zA-Z]+$/.test(newPassword)) {
      setPasswordStrength("Bảo mật yếu");
    } else if (/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/.test(newPassword)) {
      setPasswordStrength("Bảo mật mạnh");
    } else {
      setPasswordStrength("Bảo mật trung bình");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const currentUser = JSON.parse(localStorage.getItem("accounts"))[0];
      const { id: currentUserId } = currentUser;
      const response = await fetch("http://localhost:9999/accounts"); //fetch data
      if (!response.ok) {
        throw new Error("Không thể lấy dữ liệu tài khoản");
      }
      const accounts = await response.json();
      const currentAccount = accounts.find((account) => account.id === currentUserId); // tìm acc theo id ở LocalStorage
      if (!currentAccount) {
        throw new Error("Không tìm thấy tài khoản hiện tại trong danh sách");
      }
      if (newPassword.length < 6) {
        setErrorMessage("Mật khẩu phải chứa ít nhất 6 kí tự");
        return;
      }
      if (oldPassword !== currentAccount.password) {
        setErrorMessage("Mật khẩu cũ không chính xác");
      } else if (newPassword !== confirmPassword) {
        setErrorMessage("Mật khẩu mới không trùng khớp nhau. Hãy nhập lại");
      } else {
        setErrorMessage("");
        handleChangePassword(currentAccount);
      }
    } catch (error) {
      console.error("Lỗi khi xử lý mật khẩu:", error);
    }
  };

  const handleCancel = () => {
    navigate("/productuser");
  };

  return (
    <Container fluid className="container-password">
      <div className="form-container">
        <h2 style={{ fontWeight: "bold" }}>Thay Đổi Mật Khẩu</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Nhập mật khẩu cũ:</label>
            <input type="password" value={oldPassword} onChange={(e) => setOldPassword(e.target.value)} required />
          </div>
          <div className="form-group">
            <label>Nhập mật khẩu mới:</label>
            <input type="password" value={newPassword} onChange={(e) => handleNewPasswordChange(e.target.value)} required />
            <span className={`password-strength ${passwordStrength.toLowerCase()}`}>{passwordStrength}</span>
          </div>
          <div className="form-group">
            <label>Xác nhận lại mật khẩu mới:</label>
            <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
          </div>
          {errorMessage && <div className="error-message">{errorMessage}</div>}
          <div className="button-container">
            <button type="submit" className="change-password-button">
              Đổi mật khẩu
            </button>
            <button type="button" onClick={handleCancel} className="back-to-shop-button">
              Về trang chủ
            </button>
          </div>
        </form>
      </div>
    </Container>
  );
}

export default ChangePassword;
