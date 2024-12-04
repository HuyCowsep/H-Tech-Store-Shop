import React from "react";
import { Link } from "react-router-dom";
import "./css/Style.css";

export default function AccessDenied() {
  const bodyStyle = {
    backgroundColor: "black",
    color: "white",
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  };
  const h1Style = {
    color: "red",
  };
  const h6Style = {
    color: "red",
    textDecoration: "underline",
  };
  const divStyle = {
    textAlign: "center",
    animation: "zoom 0.6s",
  };

  return (
    <div style={bodyStyle}>
      <div className="w3-display-middle" style={divStyle}>
        <h1 className="w3-jumbo w3-animate-top w3-center" style={h1Style}>
          <code>TRUY CẬP BỊ TỪ CHỐI</code>
        </h1>
        <hr className="w3-border-white w3-animate-left" style={{ margin: "auto", width: "50%" }} />
        <h3 className="w3-center w3-animate-right">Bạn không có quyền xem trang WEB này.</h3>
        <h3 className="w3-center w3-animate-right">(Hoặc có thể tài khoản của bạn bị CẤM)</h3>
        <h3 className="w3-center w3-animate-zoom">🚫🚫🚫🚫</h3>
        <h6 className="w3-center w3-animate-zoom" style={h6Style}>
          Error Code: 403 forbidden
        </h6>
        <Link to={"/productuser"} className="nav-item nav-link active">
          &larr; Trở về trang chủ
        </Link>
      </div>
    </div>
  );
}
