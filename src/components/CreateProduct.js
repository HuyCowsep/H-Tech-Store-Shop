import React, { useState, useEffect } from "react";
import { Link, useNavigate, Navigate } from "react-router-dom";
import { Container, Row, Form, Button, Col } from "react-bootstrap";
import "./css/StyleAdmin.css";

function CreateProduct(props) {
  const navigate = useNavigate();
  const [errors, setErrorsMessage] = useState({});
  const [product, setProduct] = useState([]);
  const [createAt, setCreateAt] = useState("");
  const [isAdmin, setIsAdmin] = useState(null);

  const currentDate = new Date();

  useEffect(() => {
    fetch("http://localhost:9999/products")
      .then((res) => res.json())
      .then((json) => setProduct(json));
  }, []);

  useEffect(() => {
    const accountsData = localStorage.getItem("accounts");
    if (accountsData) {
      const accounts = JSON.parse(accountsData);
      const loggedInAccount = accounts[0];

      if (loggedInAccount && loggedInAccount.role === "admin") {
        setIsAdmin(true);
      } else {
        setIsAdmin(false);
      }
    } else {
      setIsAdmin(false);
    }
  }, []);

  if (isAdmin === null) {
    return <div>Loading...</div>;
  }
  if (!isAdmin) {
    return <Navigate to="/accessdenied" />;
  }

  // Lấy dữ liệu từ form
  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    // Lấy giá trị các trường từ form
    const id = formData.get("productId");
    const name = formData.get("productName");
    const price = parseFloat(formData.get("productPrice"));
    const quantity = parseInt(formData.get("productQuantity"));
    const category = formData.get("productCategory");
    const date = formData.get("productDate");
    const descreption = formData.get("productDescreption");
    const images = formData.get("productImageLink");
    const status = formData.get("productStatus");

    const errorsMessage = {};

    if (!id) {
      errorsMessage.productId = "ID của sản phẩm không được bỏ trống";
    } else if (!id.match(/^P\d{4}$/)) {
      errorsMessage.productId = "ID không hợp lệ, Mẫu: Pxxxx, VD: P1234";
    } else if (product?.find((p) => p.id === id)) {
      errorsMessage.productId = "ID này đã tồn tại 1 sản phẩm";
    }

    if (!name.trim()) {
      errorsMessage.productName = "Tên sản phẩm không được bỏ trống";
    }

    if (!date) {
      errorsMessage.productDate = "Hãy nhập ngày hợp lệ";
    }

    if (isNaN(price) || price < 1000) {
      errorsMessage.productPrice = "Giá tiền phải là số và lớn hơn hoặc bằng 1.000đ";
    }

    if (isNaN(quantity) || quantity < 0) {
      errorsMessage.productQuantity = "Số lượng phải là chữ số và lớn hơn hoặc bằng 0";
    }

    if (!category || category === "select category") {
      errorsMessage.productCategory = "Hãy chọn thể loại của sản phẩm";
    }

    if (!descreption.trim()) {
      errorsMessage.productDescreption = "Không được để trống mô tả cho sản phẩm";
    }

    if (!images) {
      errorsMessage.productImageLink = "Hãy điền đường dẫn của ảnh";
    }

    if (!status || status === "no_select") {
      errorsMessage.productStatus = "Chưa cập nhật trạng thái";
    }

    if (Object.keys(errorsMessage).length === 0) {
      const newProduct = {
        id: id,
        name: name,
        price: price,
        quantity: quantity,
        catID: category,
        descreption: descreption,
        date: date,
        status: status,
        images: images,
      };

      fetch("http://localhost:9999/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newProduct),
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Failed to add product");
          }
          return response.json();
        })
        .then((data) => {
          alert(`"${newProduct.name}" created successfully`);
          navigate("/productadmin");
        })
        .catch((error) => {
          console.error("Error:", error);
          setErrorsMessage({ global: "Failed to add product" });
        });
    } else {
      setErrorsMessage(errorsMessage);
    }
  };

  return (
    <Container fluid className="proCreate-container-fluid">
      <Row>
        <h1 className="proCreate-h1">THÊM SẢN PHẨM MỚI</h1>
      </Row>
      <Row className="proCreate-row">
        <Col className="col-md-5">
          <Link to={"/productadmin"} className="proCreate-btn-primary btn">
            <span className="text-white"> &larr; Trở về</span>
          </Link>
        </Col>
        <Col className="col-md-7">
          <p></p>
        </Col>
      </Row>
      <Row>
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="productId" className="proCreate-form-group">
            <Form.Label className="proCreate-form-label">ID(*)</Form.Label>
            <Form.Control type="text" name="productId" placeholder="Nhập ID" className="proCreate-form-control" isInvalid={!!errors.productId} />
            <Form.Control.Feedback type="invalid">{errors.productId}</Form.Control.Feedback>
          </Form.Group>
          <Form.Group controlId="productName" className="proCreate-form-group">
            <Form.Label className="proCreate-form-label">Tên Sản Phẩm (*)</Form.Label>
            <Form.Control type="text" name="productName" placeholder="Nhập tên sản phẩm" className="proCreate-form-control" isInvalid={!!errors.productName} />
            <Form.Control.Feedback type="invalid">{errors.productName}</Form.Control.Feedback>
          </Form.Group>
          <Form.Group controlId="productPrice" className="proCreate-form-group">
            <Form.Label className="proCreate-form-label">Giá Tiền (*)</Form.Label>
            <Form.Control type="number" name="productPrice" placeholder="Nhập giá tiền" className="proCreate-form-control" isInvalid={!!errors.productPrice} />
            <Form.Control.Feedback type="invalid">{errors.productPrice}</Form.Control.Feedback>
          </Form.Group>
          <Form.Group controlId="productQuantity" className="proCreate-form-group">
            <Form.Label className="proCreate-form-label">Số Lượng (*)</Form.Label>
            <Form.Control type="number" name="productQuantity" placeholder="Nhập số lượng" className="proCreate-form-control" isInvalid={!!errors.productQuantity} />
            <Form.Control.Feedback type="invalid">{errors.productQuantity}</Form.Control.Feedback>
          </Form.Group>
          <Form.Group controlId="productCategory" className="proCreate-form-group">
            <Form.Label className="proCreate-form-label">Thể Loại (*)</Form.Label>
            <Form.Select name="productCategory" className="proCreate-form-select" isInvalid={!!errors.productCategory}>
              <option value={""}>Chọn thể loại</option>
              {props.categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </Form.Select>
            <Form.Control.Feedback type="invalid">{errors.productCategory}</Form.Control.Feedback>
          </Form.Group>
          <Form.Group controlId="productDescreption" className="proCreate-form-group">
            <Form.Label className="proCreate-form-label">Mô tả (*)</Form.Label>
            <Form.Control
              as="textarea"
              name="productDescreption"
              placeholder="Viết mô tả cho sản phẩm"
              className="proCreate-form-control"
              isInvalid={!!errors.productDescreption}
            />
            <Form.Control.Feedback type="invalid">{errors.productDescreption}</Form.Control.Feedback>
          </Form.Group>
          <Form.Group controlId="productImageLink">
            <Form.Label className="proCreate-form-label">Đường dẫn của Ảnh (*)</Form.Label>
            <Form.Control type="text" name="productImageLink" placeholder="/assets/images/productX.png | Thay X = số" isInvalid={!!errors.productImageLink} />
            <Form.Control.Feedback type="invalid">{errors.productImageLink}</Form.Control.Feedback>
          </Form.Group>
          <p style={{ color: "red" }}>(*)Lưu ý: Phải đưa ảnh sản phẩm vào folder "/public/assets/images" trước rồi mới điền link. Đặt tên product theo số tiếp theo</p>
          <Form.Group controlId="productDate" className="proCreate-form-group">
            <Form.Label className="proCreate-form-label">Ngày thêm (*)</Form.Label>
            <Form.Control
              type="date"
              name="productDate"
              defaultValue={currentDate}
              pattern="yyyy-mm-dd"
              onChange={(e) => setCreateAt(e.target.value)}
              className="proCreate-form-control"
              isInvalid={!!errors.productDate}
            />
            <Form.Control.Feedback type="invalid">{errors.productDate}</Form.Control.Feedback>
          </Form.Group>
          <Form.Group controlId="productStatus" className="proCreate-form-group">
            <Form.Label className="proCreate-form-label">Trạng thái</Form.Label>
            <Form.Select name="productStatus" className="proCreate-form-control" isInvalid={!!errors.productStatus}>
              <option value="no_select">Chưa Lựa Chọn</option>
              <option value="in_stock">Còn hàng</option>
              <option value="out_of_stock">Hết hàng</option>
            </Form.Select>
            <Form.Control.Feedback type="invalid">{errors.productStatus}</Form.Control.Feedback>
          </Form.Group>
          <Button type="submit" variant="primary" className="proCreate-button-submit">
            Hoàn tất
          </Button>{" "}
          <Button
            type="reset"
            variant="primary"
            className="proCreate-button-reset"
            onClick={(e) => {
              e.preventDefault();
              if (window.confirm("Bạn muốn nhập lại tất cả nội dung ?")) {
                e.target.form.reset();
              }
            }}
          >
            Làm mới
          </Button>
          <Button type="button" variant="secondary" className="proCreate-button-cancel" onClick={() => navigate("/productadmin")}>
            Hủy Bỏ
          </Button>
          <p style={{ color: "purple" }}>(*)Kiểm tra kỹ lưỡng thông tin sản phẩm trước khi tạo mới</p>
        </Form>
      </Row>
    </Container>
  );
}

export default CreateProduct;
