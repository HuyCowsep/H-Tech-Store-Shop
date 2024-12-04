import React, { useState, useEffect } from "react";
import { Form, Button, Row } from "react-bootstrap";
import { Fab, Zoom } from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowUp } from "@fortawesome/free-solid-svg-icons";
import styled from "@emotion/styled";
import { keyframes } from "@emotion/react";
// npm install --save @fortawesome/fontawesome-free

// effect button back-to-top Start
const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

const fadeOut = keyframes`
  from {
    opacity: 1;
  }
  to {
    opacity: 0;
  }
`;

const BackToTopButton = styled(Fab)`
  position: fixed;
  bottom: 50px;
  right: 30px;
  z-index: 1000;
  color: white;
  animation: ${({ isVisible }) => (isVisible ? fadeIn : fadeOut)} 0.5s;
`;
// End back-to-top

// Footer Start
function Footer() {
  const [email, setEmail] = useState("");
  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowButton(true);
      } else {
        setShowButton(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (window.confirm("Email của bạn đã chính xác chưa?")) {
      alert("Thank you for subscribing!");
      setEmail("");
    } else {
    }
  };

  return (
    <footer className="footer">
      <div className="container">
        <div className="row">
          <div className="col-md-3">
            <section id="about" style={{ marginTop: "20px" }}>
              <h3>Giới Thiệu</h3>
              <p>
                Chào mừng bạn đến với Website của chúng tôi - nơi mà công nghệ đỉnh cao và chất lượng hoàn hảo gặp gỡ. Tại [H-Tech Store], chúng tôi
                không chỉ bán đơn thuần các sản phẩm điện tử, mà còn mang đến một trải nghiệm mua sắm đích thực, đầy sự tận tâm và chuyên nghiệp !
              </p>
            </section>
          </div>
          <div className="col-md-3">
            <section id="contact" style={{ marginTop: "20px" }}>
              <h3>Liên Hệ</h3>
              <p>Địa chỉ: Thôn 2, Thạch Hòa, Thạch Thất, Hà Nội (FPT University)</p>
              <p>Điện thoại: 0123 456 789</p>
              <p>Email: userFSA@fpt.edu.vn</p>
            </section>
          </div>
          <div className="col-md-3">
            <Row style={{ marginTop: "20px" }}>
              <h3>Mạng Xã Hội</h3>
              <ul className="social-icons">
                <Row>
                  <li>
                    {" "}
                    <a href="https://react-bootstrap.netlify.app/">
                      {" "}
                      <i className="fab fa-facebook"> </i> Facebook
                    </a>{" "}
                  </li>{" "}
                </Row>
                <Row>
                  <li>
                    {" "}
                    <a href="https://react-bootstrap.netlify.app/">
                      {" "}
                      <i className="fab fa-twitter"> </i> Twitter
                    </a>{" "}
                  </li>{" "}
                </Row>
                <Row>
                  <li>
                    {" "}
                    <a href="https://react-bootstrap.netlify.app/">
                      {" "}
                      <i className="fab fa-instagram"> </i> Instagram
                    </a>{" "}
                  </li>{" "}
                </Row>
                <Row>
                  <li>
                    {" "}
                    <a href="https://react-bootstrap.netlify.app/">
                      {" "}
                      <i className="fab fa-linkedin"> </i> Linkedin
                    </a>{" "}
                  </li>{" "}
                </Row>
                <Row>
                  <li>
                    {" "}
                    <a href="https://react-bootstrap.netlify.app/">
                      {" "}
                      <i className="fab fa-youtube"> </i> YouTube
                    </a>{" "}
                  </li>{" "}
                </Row>
                <Row>
                  <li>
                    <a href="https://react-bootstrap.netlify.app/">
                      {" "}
                      <i className="fab fa-telegram"></i> Telegram
                    </a>
                  </li>{" "}
                </Row>
              </ul>
            </Row>
          </div>
          <div className="col-md-3" style={{ marginTop: "20px" }}>
            <h3 className="font-weight-bold text-black mb-4">Đăng ký nhận tin</h3>
            <Form onSubmit={handleSubmit}>
              <Form.Group controlId="formEmail">
                <Form.Control
                  type="email"
                  placeholder="Nhập email của bạn"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="border-0 py-4"
                />
              </Form.Group>
              <Button type="submit" className="btn-danger btn-block border-0 py-3 mt-3">
                Đăng Ký Ngay
              </Button>
            </Form>
          </div>
        </div>
      </div>
      <div className="copy-right">
        <div className="container">
          <div className="row">
            <div className="col-md-12 text-start">
              <p className="text-center">
                &copy; CopyRight 2024. All rights reserved. Design by{" "}
                <a href="https://www.facebook.com/....../" style={{ color: "blue", textDecoration: "none" }}>
                  Nguyễn Đức Huy
                </a>
                <a href="https://www.dmca.com/Protection.aspx" title="DMCA.com Protection Status" target="_blank" rel="noopener noreferrer"></a>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/*Nút back-to-top quay lại đầu trang */}
      <Zoom in={showButton}>
        <BackToTopButton color="success" onClick={scrollToTop}>
          <FontAwesomeIcon icon={faArrowUp} />
        </BackToTopButton>
      </Zoom>
    </footer>
  );
}

export default Footer;
