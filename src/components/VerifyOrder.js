import React, { useState, useEffect } from "react";
import { Row, Col, Button, Table, Form, Container, Alert } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import Home from "@mui/icons-material/Home";
import DeleteIcon from "@mui/icons-material/Delete";

function VerifyOrder() {
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [orderDate, setOrderDate] = useState("");
  const [requestDate, setRequestDate] = useState("");
  const [email, setEmail] = useState("");
  const [user, setUser] = useState(() => {
    const existUser = JSON.parse(localStorage.getItem("user"));
    return existUser || null;
  });

  const [cart, setCart] = useState(() => {
    const storedCart = JSON.parse(localStorage.getItem("cart"));
    return storedCart ? storedCart.sort((a, b) => a.id - b.id) : [];
  });

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
    localStorage.setItem("user", JSON.stringify(user));
  }, [cart, user]);

  const calculateTotal = () => {
    let total = 0;
    cart.forEach((item) => {
      total += item.price * item.quantity;
    });
    const vat = (total * 8) / 100;
    const priceTotal = total + vat;
    return priceTotal;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // lấy ngày hiện tại
    // "2024-04-24T15:30:00" => ["2024-04-24", "15:30:00"];
    const currentDate = new Date();
    const formattedCurrentDate = currentDate.toISOString().split("T")[0];
    let errors = [];

    if (firstName.trim() === "") {
      errors.push("Vui lòng điền First Name");
    }
    if (lastName.trim() === "") {
      errors.push("Vui lòng điền Last Name");
    }
    if (address.trim() === "") {
      errors.push("Vui lòng điền địa chỉ của bạn");
    }
    if (phone.trim() === "") {
      errors.push("Vui lòng điền số điện thoại");
    }
    if (requestDate === "") {
      errors.push("Vui lòng điền Ngày Yêu Cầu Nhận Hàng");
    }
    if (requestDate < formattedCurrentDate) {
      errors.push("Ngày yêu cầu nhận hàng phải là các ngày trong tương lai");
    }
    if (email.trim() === "") {
      errors.push("Hãy điền Email của bạn");
    }
    if (!phone.match(/^\d{10}$/)) {
      errors.push("Số điện thoại không đúng định dạng");
    }

    if (errors.length > 0) {
      alert(errors.join("\n"));
      return false;
    }
    const confirmInfo = window.confirm(`Bạn có chắc chắn rằng các thông tin của mình là chính xác, đặc biệt là Email ??`);
    if (!confirmInfo) {
      return false; // Không thực hiện checkout nếu người dùng chọn Cancel
    }

    const customerNoLoginOrder = {
      orderDate: formattedCurrentDate,
      requestDate: requestDate,
      status: "Ordered",
      customer: {
        firstName,
        lastName,
        address,
        phone,
        email,
      },
      product: cart.map((item) => ({
        pid: item.id,
        pName: item.name,
        price: item.price,
        quantity: item.quantity,
      })),
      vat: "8%",
      total: calculateTotal(),
    };
    fetch("http://localhost:9999/orderDetailsNoLogin", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(customerNoLoginOrder),
    })
      .then((response) => {
        if (response.ok) {
          localStorage.removeItem("cart");
          localStorage.removeItem("cartCount");
          alert("Đơn hàng của bạn đã được đặt thành công");
          navigate("/");
        } else {
          throw new Error("Gửi đơn đặt hàng không thành công");
        }
      })
      .catch((error) => {
        console.error("Có lỗi khi gửi đơn:", error);
        alert("Có lỗi khi đặt hàng. Hãy thử lại sau");
      });
  };

  const handleClearAll = () => {
    localStorage.removeItem("cart");
    localStorage.removeItem("cartCount");
    window.location.reload();
  };

  const handleRemove = (id) => {
    const updatedCart = cart.filter((item) => item.id !== id);
    setCart(updatedCart);
    const remainingItemsCount = updatedCart.length;
    localStorage.setItem("cartCount", remainingItemsCount.toString());
  };

  const handleQuantityChange = (id, change) => {
    const updatedCart = cart
      .map((item) => {
        if (item.id === id) {
          return { ...item, quantity: item.quantity + change };
        }
        return item;
      })
      .filter((item) => item.quantity > 0); // Loại bỏ các sản phẩm có số lượng <= 0
    setCart(updatedCart);
    const remainingItemsCount = updatedCart.length;
    localStorage.setItem("cartCount", remainingItemsCount.toString());
  };

  return (
    <Container fluid>
      <Row style={{ textAlign: "center", fontWeight: "bold", marginTop: "19px", marginBottom: "20px" }}>
        <h1 style={{ border: "2px solid black", borderRadius: "10px", padding: "10px", backgroundColor: "#DCDCE6" }}>XÁC MINH CHI TIẾT ĐƠN HÀNG</h1>
      </Row>
      {cart.length === 0 ? (
        <Alert variant="danger" style={{ margin: "auto", height: "auto", fontSize: "1.5rem" }}>
          Giỏ Hàng của bạn đang trống! <Link to={"/productuser"}>Quay lại Shop ngay 🛒💻📱</Link>
        </Alert>
      ) : (
        <>
          <Row className="mt-3 mb-3">
            <Row>
              <Col xs={6} style={{ textAlign: "start", marginBottom: "1rem", marginTop: "5px" }}>
                <Button variant="dark" style={{ textDecoration: "none", color: "white" }} as={Link} to="/productuser">
                  &larr;Trở về <Home />
                </Button>
              </Col>
              <Col xs={6} style={{ textAlign: "end", marginBottom: "1rem" }}>
                <Button
                  variant="danger"
                  onMouseEnter={(e) => (e.target.style.color = "black")}
                  onMouseLeave={(e) => (e.target.style.color = "white")}
                  onClick={() => handleClearAll()}
                >
                  Xóa Giỏ Hàng <DeleteIcon />{" "}
                </Button>
              </Col>
            </Row>
            <p style={{ color: "red", textAlign: "center", fontWeight: "bold" }}>
              (Vì bạn không có tài khoản nên chúng tôi cần thực hiện các bước xác minh để chắc chắn rằng bạn có thể nhận được sản phẩm khi mua tại Cửa
              Hàng của chúng tôi)
            </p>
            <Table hover striped bordered>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Ảnh</th>
                  <th>Tên sản phẩm</th>
                  <th>Giá Thành</th>
                  <th>Số Lượng</th>
                  <th>Tổng</th>
                  <th>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {cart.map((c) => (
                  <tr key={c.id}>
                    <td>{c.id}</td>
                    <td>
                      <img src={`${c.image}`} style={{ width: "100px" }} alt={c.name} />
                    </td>
                    <td>{c.name}</td>
                    <td>{c.price.toLocaleString("vi-VN", { style: "currency", currency: "VND" })}</td>
                    <td>
                      <Button variant="secondary" size="sm" onClick={() => handleQuantityChange(c.id, -1)}>
                        -
                      </Button>
                      <input
                        type="number"
                        min="1"
                        value={c.quantity}
                        onChange={(e) => handleQuantityChange(c.id, parseInt(e.target.value) - c.quantity)}
                        style={{ width: "50px", textAlign: "center", margin: "0 5px" }}
                      />
                      <Button variant="secondary" size="sm" onClick={() => handleQuantityChange(c.id, 1)}>
                        +
                      </Button>
                    </td>
                    <td>{(c.price * c.quantity).toLocaleString("vi-VN", { style: "currency", currency: "VND" })}</td>
                    <td>
                      <Button variant="danger" onClick={() => handleRemove(c.id)}>
                        X
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
            <Row style={{ textAlign: "end" }}>
              <h3>
                VAT:
                <span style={{ color: "red" }}> 8%</span>
              </h3>
              <h3>
                Thành Tiền:
                <span style={{ color: "red" }}> {calculateTotal().toLocaleString("vi-VN", { style: "currency", currency: "VND" })}</span>
              </h3>
            </Row>
          </Row>

          {/* Form điền thông tin cho người mua ko đăng nhập */}
          <Row style={{ marginTop: "20px" }}>
            <h3>Thông tin vận chuyển cho đơn hàng</h3>
            <Form onSubmit={(e) => handleSubmit(e)}>
              <Row className="mt-2">
                <Form.Group as={Col} sm={6}>
                  <Form.Label>Họ(*)</Form.Label>
                  <Col sm={9}>
                    <Form.Control
                      type="text"
                      name="firstName"
                      defaultValue={user ? user.firstName : ""}
                      onChange={(e) => setFirstName(e.target.value)}
                    />
                  </Col>
                </Form.Group>
                <Form.Group as={Col} sm={6}>
                  <Form.Label>Tên(*)</Form.Label>
                  <Col sm={9}>
                    <Form.Control
                      name="lastName"
                      defaultValue={user ? user.lastName : ""}
                      type="text"
                      onChange={(e) => setLastName(e.target.value)}
                    />
                  </Col>
                </Form.Group>
              </Row>
              <Row className="mt-2">
                <Form.Group as={Col} sm={6}>
                  <Form.Label>Địa chỉ của bạn(*)</Form.Label>
                  <Col sm={9}>
                    <Form.Control name="address" as="textarea" rows={3} onChange={(e) => setAddress(e.target.value)} />
                  </Col>
                </Form.Group>
                <Form.Group as={Col} sm={6}>
                  <Form.Label>Số điện thoại(*)</Form.Label>
                  <Col sm={9}>
                    <Form.Control name="phone" type="text" onChange={(e) => setPhone(e.target.value)} />
                  </Col>
                </Form.Group>
              </Row>
              <Row className="mt-2">
                <Form.Group as={Col} sm={6}>
                  <Form.Label>Email(*)</Form.Label>
                  <Col sm={9}>
                    <Form.Control
                      name="email"
                      type="email"
                      defaultValue={user ? user.email : ""}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Chúng tôi không chịu trách nhiệm nếu email không tồn tại"
                    />
                  </Col>
                </Form.Group>
                <Form.Group as={Col} sm={6}>
                  <Form.Label>Ngày yêu cầu nhận hàng(*)</Form.Label>
                  <Col sm={9}>
                    <Form.Control
                      name="requestDate"
                      type="date"
                      min={orderDate}
                      defaultValue={requestDate}
                      onChange={(e) => setRequestDate(e.target.value)}
                    />
                  </Col>
                </Form.Group>
              </Row>
              <Row className="mt-3">
                <Col>
                  <div>
                    <span>
                      <Button
                        type="submit"
                        style={{ borderColor: "orange", backgroundColor: "orange", color: "white", marginBottom: "5px", marginLeft: "-4px" }}
                      >
                        Thanh Toán Ngay
                      </Button>
                    </span>{" "}
                    <span style={{ color: "red", paddingBottom: "20px" }}>
                      Nhấn "Thanh Toán" đồng nghĩa với việc bạn đã đồng ý với các thông tin của mình là chính xác. Có thể bạn sẽ muốn kiểm tra lại
                      Email.
                      <Link to={"/auth/login"} style={{ textDecoration: "none" }}>
                        {" "}
                        "Đăng nhập"{" "}
                      </Link>
                      ngay để có thể xem Lịch Sử Đặt Hàng và sử dụng các Voucher từ Shop
                    </span>
                  </div>
                </Col>
              </Row>
            </Form>
          </Row>
        </>
      )}
    </Container>
  );
}

export default VerifyOrder;
