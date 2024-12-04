import React, { useState, useEffect, useRef } from "react";
import { Row, Col, Button, Container, Table, Alert, FloatingLabel, Form, Modal } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import Home from "@mui/icons-material/Home";
import DeleteIcon from "@mui/icons-material/Delete";
import "./css/Style.css";

function Cart() {
  const navigate = useNavigate();
  const [coupon, setCoupon] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [selectedVoucher, setSelectedVoucher] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [validated, setValidated] = useState(false);
  const handleOpenModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);
  //reset form dữ liệu trong thông báo modal
  const formRef = useRef(null);

  const storedAccounts = localStorage.getItem("accounts");
  let currentAccount;
  if (storedAccounts) {
    const accounts = JSON.parse(storedAccounts);
    console.log("accounts trong localStorage:", accounts);
    currentAccount = accounts[0];
  }

  const handleSaveChanges = (e) => {
    const form = document.getElementById("form-modal");
    if (form.checkValidity() === false) {
      e.preventDefault();
      alert("Hãy điền đầy đủ thông tin vận chuyển!");
      e.stopPropagation();
    } else {
      setValidated(true); // hiển thị thông báo lỗi
      alert("Thông tin của bạn đã được lưu thành công!");
      handleCloseModal();
    }
    // Cập nhật các state để lưu thông tin từ Modal
    setFullName(document.getElementById("formBasicName").value);
    setAddress(document.getElementById("formBasicAddress").value);
    setPhone(document.getElementById("formBasicPhone").value);
    setEmail(document.getElementById("formBasicEmail").value);
    setRequestDate(document.getElementById("formBasicRequestDate").value);
  };

  const handleReset = () => {
    if (window.confirm("Bạn muốn nhập lại tất cả nội dung ?")) {
      setFullName("");
      setAddress("");
      setPhone("");
      setEmail("");
      setRequestDate("");

      setValidated(false);
    }
  };

  const handleApply = () => {
    if (coupon.trim() === "") {
      setAlertMessage("Vui lòng nhập Mã Giảm Giá");
      setShowAlert(true);
    } else {
      setAlertMessage("Đã ghi nhận, chúng tôi sẽ kiểm tra Mã Giảm Giá của bạn");
      setShowAlert(true);
      setTimeout(() => {
        setShowAlert(false);
      }, 3500);
    }
  };

  const [cart, setCart] = useState(() => {
    const storedCart = JSON.parse(localStorage.getItem("cart"));
    return storedCart ? storedCart.sort((a, b) => a.id - b.id) : [];
  });

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  const calculateTotal = () => {
    let total = 0;
    cart.forEach((item) => {
      total += item.price * item.quantity;
    });
    const vat = (total * 8) / 100;
    return total + vat;
  };

  // Tính toán phần total dựa trên voucher được chọn và áp dụng giảm giá tương ứng
  const calculateTotalWithDiscount = () => {
    let total = calculateTotal(); // Tính total ban đầu
    let discountRate = 0;
    if (selectedVoucher === "voucher1") {
      discountRate = 4.5;
    } else if (selectedVoucher === "voucher2") {
      discountRate = 3.9;
    } else if (selectedVoucher === "voucher3") {
      discountRate = 6.6;
    }
    const discountAmount = total * (discountRate / 100);
    return total - discountAmount;
  };

  const handleClearAll = () => {
    const confirmed = window.confirm("Bạn có chắc chắn muốn xóa tất cả các sản phẩm trong GIỎ HÀNG không?");
    if (confirmed) {
      localStorage.removeItem("cart");
      localStorage.removeItem("cartCount");
      window.location.reload();
    }
  };

  const handleRemove = (id, name) => {
    const confirmInfo = window.confirm(`Bạn muốn loại bỏ hắn sản phẩm "${name}" này khỏi giỏ Hàng?`);
    if (confirmInfo) {
      const updatedCart = cart.filter((item) => item.id !== id);
      setCart(updatedCart);
      const remainingItemsCount = updatedCart.length;
      localStorage.setItem("cartCount", remainingItemsCount.toString());
      return true;
    } else {
      return false;
    }
  };

  const handleQuantityChange = (id, change) => {
    const itemToUpdate = cart.find((item) => item.id === id);
    if (!itemToUpdate) {
      return;
    }
    const updatedQuantity = itemToUpdate.quantity + change;
    if (updatedQuantity === 0) {
      const confirmInfo = window.confirm(`Bạn muốn loại bỏ hẳn sản phẩm "${itemToUpdate.name}" khỏi Giỏ Hàng ?`);
      if (!confirmInfo) {
        return;
      }
    }
    if (itemToUpdate.quantity === 1 && updatedQuantity === 2) {
      //không xử lý nếu tăng lên
    }
    const updatedCart = cart
      .map((item) => {
        if (item.id === id) {
          return { ...item, quantity: updatedQuantity };
        }
        return item;
      })
      .filter((item) => item.quantity > 0);
    setCart(updatedCart);
    //tính lại số lượng mặt hàng trong giỏ khi có sản phẩm nào đó bị loại về 0, quantity không liên quan đến cartCount
    const remainingItemsCount = updatedCart.length;
    localStorage.setItem("cartCount", remainingItemsCount.toString());
  };

  const handleVoucherChange = (event) => {
    setSelectedVoucher(event.target.value);
  };

  const currentDate = new Date();
  const formattedCurrentDate = currentDate.toISOString().split("T")[0];
  const [isRequestDateValid, setIsRequestDateValid] = useState(true);
  const [fullName, setFullName] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [requestDate, setRequestDate] = useState("");

  const handleCheckout = (cart) => {
    if (!cart || cart.length === 0) {
      alert("Không có sản phẩm trong giỏ hàng");
      return false;
    }
    if (!fullName || !address || !phone || !email || !requestDate) {
      alert("Vui lòng nhập đầy đủ thông tin vận chuyển.");
      return false;
    }
    const accountOrder = {
      accountId: currentAccount ? currentAccount.id : null,
      fullName,
      address,
      phone,
      email,
      product: cart.map((item) => ({
        pid: item.id,
        pName: item.name,
        price: item.price,
        quantity: item.quantity,
        image: item.image,
      })),
      vat: "8%",
      total: calculateTotalWithDiscount().toLocaleString("vi-VN", {
        style: "currency",
        currency: "VND",
      }),
      shipping: 0,
      status: "Ordered",
      orderAt: formattedCurrentDate,
      reqDate: requestDate,
    };
    const confirmInfo = window.confirm(`Bạn có muốn kiểm tra lại thông tin vận chuyển lần nữa không? Nếu "CÓ" thì nhấn "Cancel" để đóng thông báo này!`);
    if (!confirmInfo) {
      return false;
    }

    // Gửi đơn hàng mới lên cơ sở dữ liệu
    fetch("http://localhost:9999/orderDetailsLogged", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(accountOrder),
    })
      .then((response) => {
        if (response.ok) {
          localStorage.removeItem("cart");
          localStorage.removeItem("cartCount");
          alert("Đơn hàng được đặt thành công");
          navigate("/order-tracking");
        } else {
          throw new Error("Gửi đơn đặt hàng không thành công");
        }
      })
      .catch((error) => {
        console.error("Error sending order:", error);
        alert("Có lỗi khi đặt hàng. Hãy thử lại sau");
      });
  };

  const handleRequestDate = (e) => {
    const value = e.target.value;
    const currentDate = new Date();
    const formattedCurrentDate = currentDate.toISOString().split("T")[0];
    if (value && value < formattedCurrentDate) {
      setIsRequestDateValid(false); // Ngày không hợp lệ
    } else {
      setIsRequestDateValid(true); // Ngày hợp lệ
      setRequestDate(value); // Cập nhật giá trị ngày
    }
  };

  return (
    <Container fluid>
      <div className="mt-3 mb-3">
        <Row>
          <h1 style={{ textAlign: "center", fontWeight: "bold" }}>Giỏ hàng của bạn</h1>
        </Row>
        {cart.length === 0 ? (
          <Alert variant="danger" style={{ margin: "auto", height: "auto", fontSize: "1.5rem" }}>
            Giỏ hàng của bạn đang trống! <Link to={"/productuser"}>Quay lại Shop ngay 🛒💻📱</Link>
          </Alert>
        ) : (
          <Row>
            <Row>
              <Col xs={6} style={{ textAlign: "start", marginBottom: "1rem" }}>
                <Button
                  variant="dark"
                  style={{
                    textDecoration: "none",
                    color: "white",
                    marginLeft: "12px",
                  }}
                  as={Link}
                  to="/productuser"
                  onMouseEnter={(e) => (e.target.style.color = "black")}
                  onMouseLeave={(e) => (e.target.style.color = "white")}
                >
                  &larr;Trở về <Home />
                </Button>
              </Col>
              <Col xs={6} style={{ textAlign: "end", marginBottom: "1rem" }}>
                <Button
                  variant="danger"
                  onClick={() => handleClearAll()}
                  onMouseEnter={(e) => (e.target.style.color = "black")}
                  onMouseLeave={(e) => (e.target.style.color = "white")}
                >
                  Xóa Giỏ Hàng <DeleteIcon />
                </Button>
              </Col>
            </Row>
            <Col xs={12} md={8}>
              <Table hover striped bordered>
                <thead>
                  <tr>
                    <th>Id</th>
                    <th>Ảnh</th>
                    <th>Tên sản phẩm</th>
                    <th>Giá thành</th>
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
                      <td>
                        {c.price.toLocaleString("vi-VN", {
                          style: "currency",
                          currency: "VND",
                        })}
                      </td>
                      <td>
                        <Button variant="secondary" size="sm" onClick={() => handleQuantityChange(c.id, -1)}>
                          -
                        </Button>
                        <input
                          type="number"
                          min="1"
                          value={c.quantity}
                          onChange={(e) => handleQuantityChange(c.id, parseInt(e.target.value) - c.quantity)}
                          style={{
                            width: "50px",
                            textAlign: "center",
                            margin: "0 5px",
                          }}
                        />
                        <Button variant="secondary" size="sm" onClick={() => handleQuantityChange(c.id, 1)}>
                          +
                        </Button>
                      </td>
                      <td>
                        {(c.price * c.quantity).toLocaleString("vi-VN", {
                          style: "currency",
                          currency: "VND",
                        })}
                      </td>
                      <td>
                        <Button variant="danger" onClick={() => handleRemove(c.id, c.name)}>
                          X
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Col>
            <Col xs={12} md={4} style={{ textAlign: "start" }}>
              <Row>
                <div
                  style={{
                    height: "30%",
                    backgroundColor: "#fff",
                    borderRadius: "10px",
                    display: "flex",
                    alignItems: "center",
                    flexDirection: "column",
                  }}
                >
                  <div style={{ width: "90%", marginBottom: "2rem" }}>
                    <h3
                      style={{
                        textAlign: "center",
                        marginTop: "2rem",
                        marginBottom: "2rem",
                      }}
                    >
                      Bạn có mã Giảm Giá?
                    </h3>
                    <FloatingLabel controlId="floatingTextarea2" label="Nhập mã giảm giá tại đây...">
                      <Form.Control
                        as="textarea"
                        placeholder=""
                        style={{ height: "100px", borderColor: "#F86338" }}
                        value={coupon}
                        onChange={(e) => setCoupon(e.target.value)}
                      />
                    </FloatingLabel>
                    <Button
                      onClick={handleApply}
                      style={{
                        marginTop: "1.5rem",
                        padding: "0.7rem",
                        borderColor: "#F86338",
                        backgroundColor: "#F86338",
                      }}
                      onMouseEnter={(e) => (e.target.style.color = "black")}
                      onMouseLeave={(e) => (e.target.style.color = "white")}
                    >
                      Áp Dụng
                    </Button>
                    {showAlert && (
                      <Alert variant="info" style={{ marginTop: "1rem" }}>
                        {alertMessage}
                      </Alert>
                    )}
                  </div>
                </div>
              </Row>
              <Row style={{ marginTop: "1.5rem" }}>
                <Row style={{ marginLeft: "1.5rem" }}>
                  <h3 style={{ textAlign: "center" }}>Thanh Toán</h3>
                  <Row style={{ marginTop: "1.2rem" }}>
                    <Col>
                      <h6>Phí vận chuyển: </h6>
                    </Col>
                    <Col>
                      <h6 className="text-center">Miễn phí vận chuyển</h6>
                    </Col>
                  </Row>
                  <Row>
                    <iframe
                      width="300"
                      height="200"
                      frameborder="0"
                      title="Google Map"
                      marginheight="0"
                      marginwidth="0"
                      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3898.905948861246!2d105.83415995945311!3d21.027764209514614!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3135abbd1f7a573d%3A0x3027a76d0e751e0!2sHanoi!5e0!3m2!1sen!2s!4v1622518564612!5m2!1sen!2s"
                      allowfullscreen
                    ></iframe>
                  </Row>
                  <Row style={{ marginTop: "1.2rem" }}>
                    <Col className="col-md-4">
                      <h6>Vận chuyển tới: </h6>
                    </Col>
                    <Col className="col-md-4"></Col>
                    <Col className="col-md-4">
                      <Button className="button-change-infor w-100" variant="link" onClick={handleOpenModal}>
                        Thay đổi thông tin
                      </Button>
                    </Col>
                  </Row>
                  <Row style={{ marginTop: "1.2rem" }}>
                    <Col className="col-md-4">
                      <h6>Thành tiền:</h6>
                    </Col>
                    <Col className="col-md-4">
                      <h6 style={{ color: "red" }}>
                        {calculateTotalWithDiscount().toLocaleString("vi-VN", {
                          style: "currency",
                          currency: "VND",
                        })}
                      </h6>
                    </Col>
                    <Col className="col-md-4">
                      <select value={selectedVoucher} onChange={handleVoucherChange} className="button-select-voucher">
                        <option value="">-- Chọn Voucher --</option>
                        <option value="voucher1">Voucher 1(-4.5%)</option>
                        <option value="voucher2">Voucher 2(-3.9%)</option>
                        <option value="voucher3">Voucher 3(-6.6%)</option>
                      </select>
                    </Col>
                  </Row>
                </Row>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    flexDirection: "column",
                  }}
                >
                  <Row style={{ width: "95%" }}>
                    <Button
                      style={{
                        marginTop: "1.5rem",
                        padding: "0.7rem",
                        borderColor: "#F86338",
                        backgroundColor: "#F86338",
                      }}
                      onClick={() => handleCheckout(cart)}
                      onMouseEnter={(e) => (e.target.style.color = "black")}
                      onMouseLeave={(e) => (e.target.style.color = "white")}
                    >
                      Đặt Hàng
                    </Button>
                  </Row>
                  <span style={{ color: "red", paddingLeft: "15px" }}>
                    Nhấn "Đặt Hàng" đồng nghĩa với việc bạn đã hiểu rõ và đồng ý với các{" "}
                    <Link
                      to="/terms"
                      style={{
                        color: "blue",
                        cursor: "pointer",
                        textDecoration: "none",
                      }}
                      onMouseEnter={(e) => (e.target.style.color = "black")}
                      onMouseLeave={(e) => (e.target.style.color = "blue")}
                    >
                      Điều Khoản
                    </Link>{" "}
                    của chúng tôi
                  </span>
                </div>
              </Row>
            </Col>
          </Row>
        )}

        {/* Modal Show ra thông tin vận chuyển */}
        <Modal show={showModal} onHide={handleCloseModal}>
          <Modal.Header closeButton>
            <Modal.Title>Thay Đổi Thông Tin Vận Chuyển</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form noValidate validated={validated} id="form-modal" ref={formRef}>
              <Form.Group className="mb-3" controlId="formBasicName">
                <Form.Label>Tên Người Nhận</Form.Label>
                <Form.Control type="text" placeholder="Nhập Tên của bạn" value={fullName} onChange={(e) => setFullName(e.target.value)} required />
                <Form.Control.Feedback type="invalid">Vui lòng nhập tên hợp lệ.</Form.Control.Feedback>
              </Form.Group>

              <Form.Group className="mb-3" controlId="formBasicAddress">
                <Form.Label>Địa chỉ</Form.Label>
                <Form.Control as="textarea" rows={3} placeholder="Nhập địa chỉ của bạn" value={address} onChange={(e) => setAddress(e.target.value)} required />
                <Form.Control.Feedback type="invalid">Vui lòng nhập địa chỉ hợp lệ.</Form.Control.Feedback>
              </Form.Group>

              <Form.Group className="mb-3" controlId="formBasicPhone">
                <Form.Label>Số điện thoại</Form.Label>
                <Form.Control type="text" placeholder="Nhập số điện thoại của bạn" value={phone} onChange={(e) => setPhone(e.target.value)} required />
                <Form.Control.Feedback type="invalid">Vui lòng nhập số điện thoại hợp lệ.</Form.Control.Feedback>
              </Form.Group>

              <Form.Group className="mb-3" controlId="formBasicEmail">
                <Form.Label>Email</Form.Label>
                <Form.Control type="email" placeholder="Nhập Email của bạn" value={email} onChange={(e) => setEmail(e.target.value)} required />
                <Form.Control.Feedback type="invalid">Vui lòng nhập email hợp lệ.</Form.Control.Feedback>
              </Form.Group>

              <Form.Group className="mb-3" controlId="formBasicRequestDate">
                <Form.Label>Ngày yêu cầu nhận hàng</Form.Label>
                <Form.Control
                  type="date"
                  value={requestDate}
                  onChange={handleRequestDate} // Thay đổi giá trị ngay khi người dùng nhập
                  onBlur={handleRequestDate} // Kiểm tra lại ngày khi người dùng rời khỏi input
                  required
                  isInvalid={!isRequestDateValid} // Hiển thị thông báo lỗi khi không hợp lệ
                />
                <Form.Control.Feedback type="invalid">Vui lòng chọn ngày phù hợp.</Form.Control.Feedback>
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="warning" onClick={handleCloseModal}>
              Hủy
            </Button>
            <Button variant="danger" onClick={handleReset}>
              Làm mới
            </Button>
            <Button variant="primary" onClick={handleSaveChanges}>
              Lưu thay đổi
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </Container>
  );
}

export default Cart;
