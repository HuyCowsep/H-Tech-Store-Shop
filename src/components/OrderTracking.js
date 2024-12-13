import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button, Container, Row, Alert, Col, Card } from "react-bootstrap";
import "./css/style-order-tracking.css";
import Swal from "sweetalert2";

export default function OrderTracking() {
  const [orders, setOrders] = useState([]); // Danh sách đơn hàng

  const storedAccounts = localStorage.getItem("accounts");
  let currentAccount;
  if (storedAccounts) {
    const accounts = JSON.parse(storedAccounts);
    currentAccount = accounts[0];
  }

  const fetchOrderByUser = async () => {
    try {
      const response = await fetch(`http://localhost:9999/orderDetailsLogged`);
      if (response.ok) {
        const data = await response.json();

        // Lọc các đơn hàng của tài khoản đang đăng nhập hiện tại
        const filteredOrders = data.filter((order) => order.accountId === currentAccount.id);
        setOrders(filteredOrders);
      } else {
        throw new Error("Không thể tìm thấy đơn đặt hàng");
      }
    } catch (error) {
      console.error("Lỗi khi tìm đơn đặt hàng:", error);
    }
  };

  const cancelOrder = async (orderId) => {
    const confirmResult = await Swal.fire({
      title: "Bạn có chắc chắn muốn huỷ đơn hàng?",
      text: `Mã đơn hàng: ${orderId}`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Huỷ đơn hàng",
      cancelButtonText: "Không",
    });

    if (confirmResult.isConfirmed) {
      try {
        const response = await fetch(`http://localhost:9999/orderDetailsLogged/${orderId}`, {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
        });

        if (response.ok) {
          await Swal.fire({
            title: "Đơn hàng đã bị huỷ",
            text: `Order ${orderId} đã bị huỷ bởi H-Tech Store. H-Tech Store xin lỗi bạn nếu gây ra sự bất tiện nào cho bạn.`,
            icon: "success",
            confirmButtonText: "OK",
          });
          fetchOrderByUser(); // Cập nhật lại danh sách đơn hàng sau khi huỷ
        } else {
          throw new Error("Không thể huỷ đơn hàng");
        }
      } catch (error) {
        console.error("Lỗi khi huỷ đơn hàng:", error);
        Swal.fire({
          title: "Lỗi",
          text: "Có lỗi xảy ra khi huỷ đơn hàng. Vui lòng thử lại sau.",
          icon: "error",
          confirmButtonText: "OK",
        });
      }
    }
  };

  useEffect(() => {
    fetchOrderByUser();
  }, []);

  function formatPrice(price) {
    return price.toLocaleString("vi-VN", { style: "currency", currency: "VND" });
  }

  if (!orders || orders.length === 0) {
    return (
      <Container>
        <Row>
          <Alert
            variant="danger"
            style={{
              margin: "150px 40px",
              height: "90px",
              fontSize: "2.5rem",
            }}
          >
            Bạn chưa thực hiện order nào! <Link to={"/productuser"}>Quay lại Shop để mua hàng! 🛒💻📱</Link>
          </Alert>
        </Row>
      </Container>
    );
  }

  return (
    <>
      <section>
        <Button
          className="btn btn-dark mb-3 btn-lg"
          style={{
            textDecoration: "none",
            color: "white",
            margin: "20px",
          }}
          as={Link}
          to="/productuser"
        >
          &larr; Trang chủ
        </Button>
        <Container>
          <h1
            style={{
              textAlign: "center",
              marginBottom: "40px",
            }}
          >
            Danh Sách Các Đơn Hàng Của Bạn
          </h1>

          {/* Đơn hàng đang xử lý */}
          <h3>
            {" "}
            Trạng Thái: <span style={{ color: "orange", marginTop: "20px" }}>Đang Xử Lý</span>{" "}
          </h3>
          {orders
            .filter((order) => order.status === "Ordered")
            .map((order) => (
              <Card
                key={order.id}
                style={{
                  marginBottom: "20px",
                  border: "1px solid #ddd",
                  padding: "15px",
                  borderRadius: "8px",
                  backgroundColor: "#fff",
                }}
              >
                <Row>
                  <Col>
                    <p>
                      <strong>Mã đơn hàng:</strong> {order.id}
                    </p>
                    <p>
                      <strong>Ngày đặt hàng:</strong> {new Date(order.orderAt).toLocaleDateString("vi-VN")}
                    </p>
                  </Col>
                  <Col>
                    <p>
                      <strong>Ngày yêu cầu nhận:</strong> {new Date(order.reqDate).toLocaleDateString("vi-VN")}
                    </p>
                    <p>
                      <strong>Tổng tiền:</strong> <span style={{ color: "red" }}>{formatPrice(order.total)}</span>
                    </p>
                  </Col>
                </Row>
                {/* Gọi hàm renderOrderProducts */}
                {renderOrderProducts(order.product)}
                <Button variant="danger" onClick={() => cancelOrder(order.id)} style={{ marginTop: "20px" }}>
                  Huỷ đơn hàng
                </Button>
              </Card>
            ))}

          {/* Đơn hàng đã duyệt */}
          {orders.filter((order) => order.status === "Approved").length > 0 && (
            <>
              <h3>
                {" "}
                Trạng Thái: <span style={{ color: "green", marginTop: "20px" }}>Đã Được Duyệt</span>{" "}
              </h3>
              {orders
                .filter((order) => order.status === "Approved")
                .map((order) => (
                  <Card
                    key={order.id}
                    style={{
                      marginBottom: "20px",
                      border: "1px solid #ddd",
                      padding: "15px",
                      borderRadius: "8px",
                      backgroundColor: "#fff",
                    }}
                  >
                    <Row>
                      <Col>
                        <p>
                          <strong>Mã đơn hàng:</strong> {order.id}
                        </p>
                        <p>
                          <strong>Ngày đặt hàng:</strong> {new Date(order.orderAt).toLocaleDateString("vi-VN")}
                        </p>
                      </Col>
                      <Col>
                        <p>
                          <strong>Ngày yêu cầu nhận:</strong> {new Date(order.reqDate).toLocaleDateString("vi-VN")}
                        </p>
                        <p>
                          <strong>Tổng tiền:</strong> <span style={{ color: "red" }}>{formatPrice(order.total)}</span>
                        </p>
                      </Col>
                    </Row>
                    <Row>
                      <Col>
                        <h5>Sản phẩm:</h5>
                        {order.product.map((item, i) => (
                          <div
                            key={item.id || i}
                            style={{
                              borderBottom: "1px solid #ddd",
                              marginBottom: "10px",
                              paddingBottom: "10px",
                            }}
                          >
                            <Row>
                              <Col md="2">
                                <img
                                  src={item.image}
                                  alt={item.pName}
                                  style={{
                                    width: "100%",
                                    height: "auto",
                                  }}
                                />
                              </Col>
                              <Col md="6">
                                <p>{item.pName}</p>
                              </Col>
                              <Col md="2">
                                <p>Số lượng: {item.quantity}</p>
                              </Col>
                              <Col md="2">
                                <p>{formatPrice(item.price)}</p>
                              </Col>
                            </Row>
                          </div>
                        ))}
                      </Col>
                    </Row>
                    {/* Gọi hàm renderOrderProducts */}
                    {renderOrderProducts(order.product)}
                  </Card>
                ))}
            </>
          )}

          {/* Đơn hàng đã giao thành công */}
          {orders.filter((order) => order.status === "Archived").length > 0 && (
            <>
              <h3>
                {" "}
                Trạng Thái: <span style={{ color: "blue", marginTop: "20px" }}>Đã Giao Thành Công</span>{" "}
              </h3>
              {orders
                .filter((order) => order.status === "Archived")
                .map((order) => (
                  <Card
                    key={order.id}
                    style={{
                      marginBottom: "20px",
                      border: "1px solid #ddd",
                      padding: "15px",
                      borderRadius: "8px",
                      backgroundColor: "#fff",
                    }}
                  >
                    <Row>
                      <Col>
                        <p>
                          <strong>Mã đơn hàng:</strong> {order.id}
                        </p>
                        <p>
                          <strong>Ngày đặt hàng:</strong> {new Date(order.orderAt).toLocaleDateString("vi-VN")}
                        </p>
                      </Col>
                      <Col>
                        <p>
                          <strong>Ngày yêu cầu nhận:</strong> {new Date(order.reqDate).toLocaleDateString("vi-VN")}
                        </p>
                        <p>
                          <strong>Tổng tiền:</strong> <span style={{ color: "red" }}>{formatPrice(order.total)}</span>
                        </p>
                      </Col>
                    </Row>
                    {/* Gọi hàm renderOrderProducts */}
                    {renderOrderProducts(order.product)}
                    <Button variant="primary" as={Link} to={`/productuser/${order.product[0].id}`} style={{ marginTop: "20px" }}>
                      Mua lại sản phẩm này
                    </Button>
                  </Card>
                ))}
            </>
          )}

          {/* Đơn hàng bị từ chối */}
          {orders.filter((order) => order.status === "Rejected").length > 0 && (
            <>
              <h3>
                {" "}
                Trạng Thái: <span style={{ color: "red", marginTop: "20px" }}>Bị Từ Chối</span>{" "}
              </h3>
              {orders
                .filter((order) => order.status === "Rejected")
                .map((order) => (
                  <Card
                    key={order.id}
                    style={{
                      marginBottom: "20px",
                      border: "1px solid #ddd",
                      padding: "15px",
                      borderRadius: "8px",
                      backgroundColor: "#fff",
                    }}
                  >
                    <Row>
                      <Col>
                        <p>
                          <strong>Mã đơn hàng:</strong> {order.id}
                        </p>
                        <p>
                          <strong>Ngày đặt hàng:</strong> {new Date(order.orderAt).toLocaleDateString("vi-VN")}
                        </p>
                      </Col>
                      <Col>
                        <p>
                          <strong>Ngày yêu cầu nhận:</strong> {new Date(order.reqDate).toLocaleDateString("vi-VN")}
                        </p>
                        <p>
                          <strong>Tổng tiền:</strong> <span style={{ color: "red" }}>{formatPrice(order.total)}</span>
                        </p>
                      </Col>
                    </Row>
                    {/* Gọi hàm renderOrderProducts */}
                    {renderOrderProducts(order.product)}
                  </Card>
                ))}
            </>
          )}
        </Container>
      </section>
    </>
  );

  function renderOrderProducts(products) {
    return (
      <Row>
        <Col>
          <h5>Sản phẩm:</h5>
          {products.map((item, i) => (
            <div
              key={item.id || i}
              style={{
                borderBottom: "1px solid #ddd",
                marginBottom: "10px",
                paddingBottom: "10px",
              }}
            >
              <Row>
                <Col md="2">
                  <img
                    src={item.image}
                    alt={item.pName}
                    style={{
                      width: "100%",
                      height: "auto",
                    }}
                  />
                </Col>
                <Col md="6">
                  <p>{item.pName}</p>
                </Col>
                <Col md="2">
                  <p>Số lượng: {item.quantity}</p>
                </Col>
                <Col md="2">
                  <p>{formatPrice(item.price)}</p>
                </Col>
              </Row>
            </div>
          ))}
        </Col>
      </Row>
    );
  }
}
