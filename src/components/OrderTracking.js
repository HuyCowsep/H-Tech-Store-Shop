import React, { useState, useEffect } from "react";
import { MDBCard, MDBCardBody, MDBCol, MDBContainer, MDBRow } from "mdb-react-ui-kit";
import { Link } from "react-router-dom";
import { Button, Container, Row, Alert } from "react-bootstrap";
import "./css/style-order-tracking.css";

export default function OrderTracking() {
  const storedAccounts = localStorage.getItem("accounts");
  let currentAccount;
  if (storedAccounts) {
    const accounts = JSON.parse(storedAccounts);
    currentAccount = accounts[0];
  }

  const [order, setOrder] = useState([]);
  const [items, setItems] = useState([]);

  const fetchOrderByUser = async () => {
    try {
      const response = await fetch(
        `http://localhost:9999/orderDetailsLogged?accountId=${currentAccount.id}&status=Ordered&status=Shipped&status=Delivered`
      );
      if (response.ok) {
        const data = await response.json();
        const latestOrder = data[data.length - 1];
        console.log("Data vừa checkout bên Cart", latestOrder);
        setOrder(latestOrder);
        setItems(latestOrder.product);
      } else {
        throw new Error("Không thể tìm thấy đơn đặt hàng");
      }
    } catch (error) {
      console.error("Lỗi khi tìm đơn đặt hàng:", error);
    }
  };

  useEffect(() => {
    fetchOrderByUser();
  }, []);

  function formatPrice(price) {
    price = (price + "").replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    return price;
  }

  if (!order)
    return (
      <Container>
        <Row>
          <Alert variant="danger" style={{ margin: "150px 40px", height: "90px", fontSize: "2.5rem" }}>
            Bạn chưa thực hiện order nào! <Link to={"/productuser"}>Quay lại Shop để mua hàng! 🛒💻📱</Link>
          </Alert>
        </Row>
      </Container>
    );

  if (order)
    return (
      <>
        <section style={{ backgroundColor: "#9d9898" }}>
          <Button className="btn btn-dark mb-3 btn-lg" style={{ textDecoration: "none", color: "white", margin: "20px" }} as={Link} to="/productuser">
            &larr; Trang chủ
          </Button>
          <MDBContainer className="py-5 h-100">
            <MDBRow className="justify-content-center align-items-center h-100">
              <MDBCol lg="8" xl="6">
                <MDBCard className="border-top border-bottom border-3 border-color-custom">
                  <MDBCardBody className="p-5">
                    <p className="lead fw-bold mb-5 text-center fs-2" style={{ color: "#f37a27" }}>
                      Biên Lai Mua Hàng
                    </p>
                    <MDBRow className="text-center">
                      <MDBCol className="mb-4">
                        <p className="small text-muted mb-1 fw-bold">Ngày Đặt Hàng</p>
                        <p style={{ color: "red" }}>{new Date(order.orderAt).toLocaleDateString("vi-VN")}</p>
                      </MDBCol>
                      <MDBCol className="mb-4">
                        <p className="small text-muted mb-1 fw-bold">Ngày Yêu Cầu Nhận</p>
                        <p style={{ color: "green" }}>{new Date(order.reqDate).toLocaleDateString("vi-VN")}</p>
                      </MDBCol>
                      <MDBCol className="mb-4">
                        <p className="small text-muted mb-1 fw-bold">Mã Đơn Hàng</p>
                        <p style={{ color: "black", fontWeight: "bold" }}>{order.id}</p>
                      </MDBCol>
                    </MDBRow>
                    <div className="mx-n5 px-3 py-2" style={{ backgroundColor: "#f2f2f2" }}>
                      {items.map((item, index) => (
                        <MDBRow key={index}>
                          <MDBCol md="2">
                            <img src={item.image} alt="" style={{ width: "100%", height: "auto" }} />
                          </MDBCol>
                          <MDBCol md="3">
                            <p>{item.pName}</p>
                          </MDBCol>
                          <MDBCol md="3">
                            <p>Số lượng: {item.quantity}</p>
                          </MDBCol>
                          <MDBCol md="4">
                            <p>{formatPrice(item.price)}₫ / 1</p>
                          </MDBCol>
                        </MDBRow>
                      ))}
                    </div>
                    <MDBRow className="my-3">
                      <MDBCol md="4" className="offset-md-8 col-lg-5 offset-lg-7">
                        <p className="lead fw-bold mb-0" style={{ color: "gray", fontSize: "1.25rem", textAlign: "end" }}>
                          VAT: <span style={{ color: "red" }}>8%</span>
                        </p>
                        <p className="lead fw-bold mb-0" style={{ color: "gray", fontSize: "1.25rem", textAlign: "end" }}>
                          Tổng: <span style={{ color: "red" }}>{formatPrice(order.total)}</span>
                        </p>
                      </MDBCol>
                    </MDBRow>
                    <p className="lead fw-bold mb-4 pb-2" style={{ color: "#f37a27" }}>
                      Theo dõi quá trình đơn hàng của bạn
                    </p>
                    <MDBRow>
                      <MDBCol lg="12">
                        <div className="horizontal-timeline">
                          <ul className="list-inline items d-flex justify-content-between">
                            <li className="list-inline-item items-list" style={{ marginRight: "10px" }}>
                              <p className="py-1 px-2 rounded text-white" style={{ backgroundColor: "#f37a27" }}>
                                Đã Đặt Hàng
                              </p>
                            </li>
                            <li className="list-inline-item items-list">
                              <p className="py-1 px-2 rounded text-white" style={{ backgroundColor: "#f37a27" }}>
                                Đang Vận Chuyển
                              </p>
                            </li>
                            <li className="list-inline-item items-list text-end" style={{ marginRight: "-1px" }}>
                              <p style={{ marginRight: "-8px" }}>Đã Giao Hàng</p>
                            </li>
                          </ul>
                        </div>
                      </MDBCol>
                    </MDBRow>
                    <p className="mt-4 pt-2 mb-0">
                      Bạn cần trợ giúp gì?{" "}
                      <a href="/productuser#contact" style={{ color: "#f37a27" }}>
                        Liên hệ với chúng tôi
                      </a>
                    </p>
                  </MDBCardBody>
                </MDBCard>
              </MDBCol>
            </MDBRow>
          </MDBContainer>
        </section>
      </>
    );
}
