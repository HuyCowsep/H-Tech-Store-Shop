import React, { useState } from "react";
import { Nav, Button, Row, Col, Dropdown, Image } from "react-bootstrap";
import { useNavigate, Link } from "react-router-dom";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { useTheme } from "./ThemeProvider";
import LogoutIcon from "@mui/icons-material/Logout";
import LockIcon from "@mui/icons-material/Lock";
import SyncAltIcon from "@mui/icons-material/SyncAlt";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import AvatarModal from "../hooks/AvatarModal";
import { toast } from "react-toastify";
import "./css/Style.css";

function Header({ isLogin, setIsLogin }) {
  const navigate = useNavigate();
  const { toggleTheme } = useTheme();
  let accountLogged;
  let accountRole;
  const [showAvatarModal, setShowAvatarModal] = useState(false);
  // show ảnh ava
  const handleOpenAvatarModal = () => {
    setShowAvatarModal(true);
  };
  // đóng ảnh ava
  const handleCloseAvatarModal = () => {
    setShowAvatarModal(false);
  };

  if (isLogin) {
    const accounts = JSON.parse(localStorage.getItem("accounts"));
    accountLogged = accounts[0].name;
    accountRole = accounts[0].role;
  }

  const handleLogout = () => {
    if (window.confirm("Bạn muốn đăng xuất tài khoản ngay bây giờ?")) {
      setIsLogin(false);
      toast.success(`Đăng xuất thành công!`, {
        autoClose: 2000,
        closeButton: false,
        hideProgressBar: true,
        position: "top-center",
      });
      localStorage.removeItem("accounts");
      navigate("/productuser");
    }
  };

  const handleChangeAccount = () => {
    if (window.confirm("Nếu bạn muốn đổi tài khoản, bạn sẽ bị đăng xuất")) {
      setIsLogin(false);
      toast.success(`Hẹn gặp lại bạn!`, {
        autoClose: 2000,
        closeButton: false,
        hideProgressBar: true,
        position: "top-center",
      });
      localStorage.removeItem("accounts");
      navigate("/auth/login");
    }
  };

  return (
    <div>
      <Row className="bg-secondary pt-3 pb-3">
        {/* Cột trái chứa avata và tên shop */}
        <Col>
          <h2 class="m-0 display-5 font-weight-semi-bold">
            <Image
              src="/assets/images/avartashop.png"
              alt="H Logo"
              class="img-fluid"
              style={{ width: "75px", height: "75px", border: "1px solid #ccc", borderRadius: "48px" }}
              onClick={handleOpenAvatarModal}
            />
            <a href="/productuser" class="text-decoration-none text-white">
              {" "}
              -Tech Store
            </a>
          </h2>
          {/* show ảnh */}
          <AvatarModal show={showAvatarModal} handleClose={handleCloseAvatarModal} imageSrc="/assets/images/avartashop.png" />
        </Col>
        {/* cột phải chứa nút login-register */}
        <Col className="ml-auto">
          <Nav className="justify-content-end">
            {isLogin ? (
              <>
                {accountRole === "admin" && (
                  <>
                    <Nav.Item justify-content-center>
                      <Nav.Link href="/productadmin" style={{ color: "white" }}>
                        <Button className="bg-danger text-white px-4 py-2 border-0">Administrator</Button>
                      </Nav.Link>
                    </Nav.Item>
                    <Nav.Item className="justify-content-center mt-2">
                      <Dropdown drop="center">
                        <Dropdown.Toggle variant="secondary" id="dropdown-basic" className="bg-danger text-white px-4 py-2">
                          Xin Chào: {accountLogged} <AccountCircleIcon />
                        </Dropdown.Toggle>
                        <Dropdown.Menu className="dropdown-menu-end">
                          <Dropdown.Item href="/view-profile">
                            <AccountCircleIcon />
                            Thông Tin Cá Nhân
                          </Dropdown.Item>
                          <Dropdown.Item as={Link} to={`/change-password`}>
                            <LockIcon /> Đổi mật khẩu
                          </Dropdown.Item>
                          <Dropdown.Item onClick={handleLogout}>
                            <LogoutIcon /> Đăng Xuất
                          </Dropdown.Item>
                          <Dropdown.Item onClick={handleChangeAccount}>
                            <SyncAltIcon /> Chuyển Tài Khoản
                          </Dropdown.Item>
                          <Dropdown.Item onClick={toggleTheme}>{toggleTheme ? <Brightness4Icon /> : <Brightness7Icon />} Mode: Sáng|Tối</Dropdown.Item>
                        </Dropdown.Menu>
                      </Dropdown>
                    </Nav.Item>
                  </>
                )}

                {accountRole === "user" && (
                  <>
                    <Nav.Item justify-content-center>
                      <Nav.Link href="/order-tracking" style={{ color: "white" }}>
                        <Button className="bg-danger text-white px-4 py-2 border-0">
                          Theo dõi đơn hàng <ShoppingCartIcon />
                        </Button>
                      </Nav.Link>
                    </Nav.Item>
                    <Nav.Item className="justify-content-center mt-2">
                      <Dropdown>
                        <Dropdown.Toggle variant="secondary" id="dropdown-basic" className="bg-danger text-white px-4 py-2 border-0">
                          Xin Chào: {accountLogged} <AccountCircleIcon />
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                          <Dropdown.Item href="/view-profile">
                            <AccountCircleIcon />
                            Thông Tin Cá Nhân
                          </Dropdown.Item>
                          <Dropdown.Item as={Link} to={`/change-password`}>
                            <LockIcon /> Đổi mật khẩu
                          </Dropdown.Item>
                          <Dropdown.Item onClick={handleLogout}>
                            <LogoutIcon /> Đăng Xuất
                          </Dropdown.Item>
                          <Dropdown.Item onClick={handleChangeAccount}>
                            <SyncAltIcon /> Chuyển Tài Khoản
                          </Dropdown.Item>
                          <Dropdown.Item onClick={toggleTheme}>{toggleTheme ? <Brightness4Icon /> : <Brightness7Icon />} Mode: Sáng|Tối</Dropdown.Item>
                        </Dropdown.Menu>
                      </Dropdown>
                    </Nav.Item>
                  </>
                )}
              </>
            ) : (
              <>
                <Nav.Item>
                  <Nav.Link href="/auth/login" style={{ color: "white" }}>
                    <Button className="btn-danger px-3 py-2">Đăng Nhập</Button>
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link href="/auth/register" style={{ color: "white" }}>
                    <Button className="btn-danger px-3 py-2">Đăng Ký</Button>
                  </Nav.Link>
                </Nav.Item>
              </>
            )}
          </Nav>
        </Col>
      </Row>
    </div>
  );
}

export default Header;
