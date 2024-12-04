import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Form } from "react-bootstrap";

export default function Register() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [dob, setDob] = useState("");
  const [gender, setGender] = useState("");
  const [accounts, setAccounts] = useState([]);
  const [isAgreed, setIsAgreed] = useState(false);

  useEffect(() => {
    const storedAccounts = JSON.parse(localStorage.getItem("accounts")) || [];
    setAccounts(storedAccounts);
  }, []);
  useEffect(() => {
    fetch("http://localhost:9999/accounts")
      .then((res) => res.json())
      .then((json) => setAccounts(json));
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    const errors = [];

    if (name.trim() === "") {
      errors.push("Hãy nhập tên của bạn.");
    }
    if (!email.includes("@")) {
      errors.push('Địa chỉ email không hợp lệ: "@" là biểu tượng bắt buộc.');
    } else if ((email.match(/@/g) || []).length > 1) {
      errors.push('Địa chỉ email không hợp lệ: chứa 2 biểu tượng "@"');
    } else if (!/^\S+@\S+\.\S+$/.test(email)) {
      errors.push("Địa chỉ email không hợp lệ. Đây không phải là địa chỉ email");
    } else {
      if (accounts?.find((account) => account.email === email)) {
        errors.push("Địa chỉ email đã tồn tại. Hãy chọn địa chỉ khác");
      }
    }
    if (dob.trim() === "") {
      errors.push("Hãy nhập ngày sinh.");
    }
    if (!gender) {
      errors.push("Hãy chọn giới tính.");
    }
    if (password.trim() === "") {
      errors.push("Mật khẩu không được để trống");
    } else if (password.length < 6) {
      errors.push("Mật khẩu phải chứa ít nhất 6 ký tự!");
    }
    // kiểm tra khớp mật khẩu
    if (password !== confirmPassword) {
      errors.push("Xác nhận lại mật khẩu không trùng khớp!");
    }

    if (errors.length > 0) {
      alert(errors.join("\n"));
      return;
    }

    const maxId = accounts.reduce((max, account) => (account.id > max ? account.id : max), 0);
    const newId = maxId + 1;

    const isAdmin = /^admin\d*@gmail\.com$/.test(email);

    const newAccount = {
      id: newId,
      name: name,
      email: email,
      password: password,
      dob: dob,
      gender: gender,
      role: isAdmin ? "admin" : "user",
    };
    setAccounts([newAccount, ...accounts]);

    localStorage.setItem("accounts", JSON.stringify([newAccount, ...accounts]));
    fetch("http://localhost:9999/accounts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newAccount),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Error creating account");
        }
        return response.json();
      })
      .then((data) => {
        alert("Tài khoản của bạn đã được tạo thành công!");
        navigate("/auth/login");
        setName("");
        setEmail("");
        setPassword("");
        setConfirmPassword("");
        setDob("");
        setGender("");
      })
      .catch((error) => {
        alert("Error creating account!");
      });
  };

  return (
    <div className=" mt-5 register-container">
      <div className="row">
        <div className="col-md-6 register-image">
          <img
            src="https://static.vecteezy.com/system/resources/previews/016/181/833/original/register-now-banner-design-vector.jpg"
            alt="Register"
            style={{ width: "100%", height: "100%" }}
          />
        </div>
        <div className="col-md-6 register-form">
          <h2 className="text-center mt-2">Đăng Ký Tài Khoản</h2>
          <Link style={{ marginBottom: "20px" }} to={"/productuser"} className="btn btn-dark">
            {" "}
            &larr; Trở về trang chủ{" "}
          </Link>
          <Form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="name" className="form-label">
                Tên Đăng Nhập (*)
              </label>
              <input type="text" className="form-control" id="name" value={name} placeholder="Đây là tên hiển thị trong Shop" onChange={(e) => setName(e.target.value)} />
            </div>
            <div className="mb-3">
              <label htmlFor="email" className="form-label">
                Email (*)
              </label>
              <input
                type="email"
                className="form-control"
                id="email"
                value={email}
                placeholder=" Email của bạn dùng để đăng nhập"
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="password" className="form-label">
                Mật Khẩu (*)
              </label>
              <div className="input-group">
                <input
                  type="password"
                  className="form-control"
                  id="password"
                  value={password}
                  placeholder="Nhập mật khẩu của bạn"
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>
            <div className="mb-3">
              <label htmlFor="confirmPassword" className="form-label">
                Xác Nhận Lại Mật Khẩu (*)
              </label>
              <div className="input-group">
                <input
                  type="password"
                  className="form-control"
                  id="confirmPassword"
                  value={confirmPassword}
                  placeholder="Xác nhận lại mật khẩu của bạn"
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>
            </div>
            <div className="mb-3">
              <label htmlFor="dob" className="form-label">
                Ngày sinh
              </label>
              <input type="date" className="form-control" id="dob" value={dob} onChange={(e) => setDob(e.target.value)} />
            </div>
            <div className="mb-3">
              <label className="form-label">Giới Tính (*)</label>
              <div>
                <div className="form-check form-check-inline">
                  <input className="form-check-input" type="radio" name="gender" id="male" value="male" checked={gender === "male"} onChange={() => setGender("male")} />
                  <label className="form-check-label" htmlFor="male">
                    Nam
                  </label>
                </div>
                <div className="form-check form-check-inline">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="gender"
                    id="female"
                    value="female"
                    checked={gender === "female"}
                    onChange={() => setGender("female")}
                  />
                  <label className="form-check-label" htmlFor="female">
                    Nữ
                  </label>
                </div>
                <div className="form-check form-check-inline">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="gender"
                    id="other"
                    value="other"
                    checked={gender === "other"}
                    onChange={() => setGender("other")}
                  />
                  <label className="form-check-label" htmlFor="other">
                    Khác
                  </label>
                </div>
                <div style={{ paddingTop: "10px" }}>
                  <input type="checkbox" id="receive-promotions" />
                  <label htmlFor="receive-promotions" className="ml-2">
                    Đăng ký nhận tin khuyến mãi từ H-Tech Store
                  </label>
                </div>
                <div style={{ paddingTop: "10px", paddingBottom: "20px" }}>
                  <input type="radio" id="agree-privacy-policy" name="privacy-policy" onChange={(e) => setIsAgreed(e.target.checked)} />
                  <label htmlFor="agree-privacy-policy" style={{ marginLeft: "10px", fontSize: "16px", cursor: "pointer" }}>
                    Tôi đồng ý với các điều khoản bảo mật cá nhân
                  </label>
                </div>
              </div>
            </div>
            <div className="text-center">
              <button type="submit" className="btn btn-dark btn-lg" disabled={!isAgreed}>
                Đăng Ký
              </button>
            </div>
            <div className="mt-3 text-center">
              <p>
                Bạn Đã Có Tài Khoản Rồi?{" "}
                <Link
                  to={"/auth/login"}
                  style={{ textDecoration: "none" }}
                  onMouseEnter={(e) => (e.target.style.color = "red")}
                  onMouseLeave={(e) => (e.target.style.color = "blue")}
                >
                  ĐĂNG NHẬP NGAY
                </Link>
              </p>
            </div>
          </Form>
        </div>
      </div>
    </div>
  );
}
