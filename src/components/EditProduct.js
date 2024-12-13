import React, { useState, useEffect } from "react";
import { Form, Button, Container, Row, Col } from "react-bootstrap";
import { Link, useParams, useNavigate, Navigate } from "react-router-dom";

export default function EditProduct(props) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState({});
  const [isAdmin, setIsAdmin] = useState(null);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetch(`http://localhost:9999/products/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setProduct(data);
      })
      .catch((error) => console.error("Error:", error));
  }, [id]);

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
  // kiểm tra xem các trường bắt buộc có được điền đầy đủ hay không!
  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const name = formData.get("productName");
    const price = parseFloat(formData.get("productPrice"));
    const quantity = parseInt(formData.get("productQuantity"));
    const catID = formData.get("productCategory");
    const descreption = formData.get("productDescreption");
    const date = formData.get("productDate");
    const status = formData.get("productStatus");
    const image = formData.get("productImageLink");

    let errorsMessage = {};

    if (!name) errorsMessage.productName = "Tên sản phẩm không được để trống.";
    if (!price || isNaN(price) || price <= 0) errorsMessage.productPrice = "Giá sản phẩm phải là số lớn hơn 0.";
    if (!quantity || isNaN(quantity) || quantity <= 0) errorsMessage.productQuantity = "Số lượng sản phẩm phải là số lớn hơn 0.";
    if (!catID || catID === "select category") errorsMessage.productCategory = "Vui lòng chọn thể loại.";
    if (!descreption) errorsMessage.productDescreption = "Mô tả không được để trống.";
    if (!date) errorsMessage.productDate = "Ngày tạo không được để trống.";
    if (!status || status === "no_select") errorsMessage.productStatus = "Vui lòng chọn trạng thái.";
    if (!image) errorsMessage.productImageLink = "Đường dẫn ảnh không được để trống.";

    if (Object.keys(errorsMessage).length > 0) {
      setErrors(errorsMessage);
      return;
    }
    setErrors({}); // Xóa lỗi khi không có lỗi

    const updatedProduct = {
      id: product.id,
      name,
      price,
      quantity,
      catID,
      descreption,
      date,
      status,
      image,
    };

    fetch(`http://localhost:9999/products/${product.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedProduct),
    })
      .then((response) => {
        if (!response.ok) throw new Error("Có lỗi khi cập nhật sản phẩm");
        return response.json();
      })
      .then((data) => {
        alert(`Sản phẩm "${data.name}" đã được cập nhật thành công`);
        navigate("/productadmin");
      })
      .catch((error) => {
        console.error("Error:", error);
        alert("Có lỗi khi cập nhật sản phẩm");
      });
  };

  return (
    <Container>
      <Row>
        <Col>
          <h1 style={{ textAlign: "center", color: "Black" }}>Chỉnh Sửa Thông Tin Sản Phẩm</h1>
        </Col>
      </Row>
      <Row style={{ marginBottom: "20px" }}>
        <Col className="col-md-5">
          <Link to={"/productadmin"} className="btn btn-primary">
            {" "}
            &larr; Trở về{" "}
          </Link>
        </Col>
        <Col className="col-md-7">
          <p></p>
        </Col>
      </Row>
      <Row>
        <Col>
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="productId">
              <Form.Label className="proCreate-form-label">ID sản phẩm(*)</Form.Label>
              <Form.Control type="text" name="productId" defaultValue={product.id} readOnly />
            </Form.Group>

            <Form.Group controlId="productName">
              <Form.Label className="proCreate-form-label">Tên sản phẩm(*)</Form.Label>
              <Form.Control type="text" name="productName" defaultValue={product.name} isInvalid={!!errors.productName} />
              <Form.Control.Feedback type="invalid">{errors.productName}</Form.Control.Feedback>
            </Form.Group>

            <Form.Group controlId="productPrice">
              <Form.Label className="proCreate-form-label">Giá tiền(*)</Form.Label>
              <Form.Control type="number" name="productPrice" defaultValue={product.price} isInvalid={!!errors.productPrice} />
              <Form.Control.Feedback type="invalid">{errors.productPrice}</Form.Control.Feedback>
            </Form.Group>

            <Form.Group controlId="productQuantity">
              <Form.Label className="proCreate-form-label">Số lượng(*)</Form.Label>
              <Form.Control type="number" name="productQuantity" defaultValue={product.quantity} isInvalid={!!errors.productQuantity} />
              <Form.Control.Feedback type="invalid">{errors.productQuantity}</Form.Control.Feedback>
            </Form.Group>

            <Form.Group controlId="productCategory">
              <Form.Label className="proCreate-form-label">Category ID(*)</Form.Label>
              <Form.Select name="productCategory" defaultValue={product.catID} isInvalid={!!errors.productCategory}>
                <option value="select category">Lựa chọn thể loại</option>
                {props.categories &&
                  props.categories.map((c) => (
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
                defaultValue={product.descreption}
                placeholder="Enter product description"
                className="proCreate-form-control"
                isInvalid={!!errors.productDescreption}
              />
              <Form.Control.Feedback type="invalid">{errors.productDescreption}</Form.Control.Feedback>
            </Form.Group>

            <Form.Group controlId="productImageLink">
              <Form.Label className="proCreate-form-label">Đường dẫn của Ảnh (*)</Form.Label>
              <Form.Control
                type="text"
                name="productImageLink"
                defaultValue={product.image}
                placeholder="/assets/images/productX.png | Thay X = số"
                isInvalid={!!errors.productImageLink}
              />
              <Form.Control.Feedback type="invalid">{errors.productImageLink}</Form.Control.Feedback>
            </Form.Group>

            <Form.Group controlId="productDate">
              <Form.Label className="proCreate-form-label">Được tạo vào ngày (*)</Form.Label>
              <Form.Control type="date" name="productDate" defaultValue={product.date} pattern="yyyy-MM-dd" isInvalid={!!errors.productDate} />
              <Form.Control.Feedback type="invalid">{errors.productDate}</Form.Control.Feedback>
            </Form.Group>

            <Form.Group controlId="productStatus" className="proCreate-form-group">
              <Form.Label className="proCreate-form-label">Trạng thái (*)</Form.Label>
              <Form.Select name="productStatus" className="proCreate-form-control" defaultValue={product.status} isInvalid={!!errors.productStatus}>
                <option value="no_select">Chưa Lựa Chọn</option>
                <option value="Còn hàng">Còn hàng</option>
                <option value="Hết hàng">Hết hàng</option>
              </Form.Select>
              <Form.Control.Feedback type="invalid">{errors.productStatus}</Form.Control.Feedback>
            </Form.Group>

            <div className="mb-3">
              <Button type="submit" variant="primary">
                Hoàn Tất
              </Button>
              <Button type="reset" className="btn btn-danger ms-2">
                Làm mới
              </Button>
              <Link to="/productadmin" className="btn btn-secondary ms-2">
                Hủy Bỏ
              </Link>
            </div>
          </Form>
        </Col>
      </Row>
    </Container>
  );
}
