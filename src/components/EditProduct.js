import React, { useState, useEffect } from "react";
import { Form, Button, Container, Row, Col } from "react-bootstrap";
import { Link, useParams, useNavigate, Navigate } from "react-router-dom";

export default function EditProduct(props) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState({});
  const [isAdmin, setIsAdmin] = useState(null);

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
    const quantity = formData.get("productQuantity");
    const price = formData.get("productPrice");
    const category = formData.get("productCategory");
    const images = formData.get("productImageLink");
    const date = formData.get("productDate");
    const status = formData.get("productStatus");

    let msg = "";
    if (!name) {
      msg += "Hãy điền tên sản phẩm\n";
    }
    if (!quantity) {
      msg += "Hãy điền số lượng sản phẩm\n";
    }
    if (!price) {
      msg += "Hãy điền giá sản phẩm\n";
    }
    if (images === "") {
      msg += "Hãy điền đường dẫn ảnh\n ";
    }
    if (!date) {
      msg += "Hãy điền ngày tạo sản phẩm\n";
    }

    if (category === "select category") {
      msg += "Hãy chọn thể loại\n";
    }
    if (status === "no_select") {
      msg += "Hãy chọn trạng thái";
    }
    if (msg !== "") {
      alert(msg);
      return;
    }

    const updatedProduct = {
      id: id,
      name: name,
      price: parseFloat(price),
      quantity: parseInt(quantity),
      category: category,
      date: date,
      status: status,
    };

    fetch(`http://localhost:9999/products/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedProduct),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Có lỗi khi update sản phẩm");
        }
        return response.json();
      })
      .then((data) => {
        alert(`Sản phẩm "${data.name}" được cập nhật thành công`);
        navigate("/productadmin");
      })
      .catch((error) => {
        console.error("Error:", error);
        alert("Có lỗi khi update");
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
              <Form.Label className="proCreate-form-label">ID(*)</Form.Label>
              <Form.Control type="text" name="productId" defaultValue={product.id} readOnly />
            </Form.Group>
            <Form.Group controlId="productName">
              <Form.Label className="proCreate-form-label">Name(*)</Form.Label>
              <Form.Control type="text" name="productName" defaultValue={product.name} />
            </Form.Group>

            <Form.Group controlId="productPrice">
              <Form.Label className="proCreate-form-label">Price(*)</Form.Label>
              <Form.Control type="number" name="productPrice" defaultValue={product.price} />
            </Form.Group>

            <Form.Group controlId="productQuantity">
              <Form.Label className="proCreate-form-label">Quantity(*)</Form.Label>
              <Form.Control type="number" name="productQuantity" defaultValue={product.quantity} />
            </Form.Group>

            <Form.Group controlId="productCategory">
              <Form.Label className="proCreate-form-label">catID(*)</Form.Label>
              <Form.Select name="productCategory" defaultValue={product.catID}>
                <option value="select category">Lựa chọn thể loại</option>
                {props.categories &&
                  props.categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
              </Form.Select>
            </Form.Group>
            <Form.Group controlId="productDescreption" className="proCreate-form-group">
              <Form.Label className="proCreate-form-label">Mô tả (*)</Form.Label>
              <Form.Control
                as="textarea"
                name="productDescreption"
                defaultValue={product.descreption}
                placeholder="Enter product description"
                className="proCreate-form-control"
              />
            </Form.Group>
            <Form.Group controlId="productImageLink">
              <Form.Label className="proCreate-form-label">Đường dẫn của Ảnh (*)</Form.Label>
              <Form.Control
                type="text"
                name="productImageLink"
                defaultValue={product.image}
                placeholder="/assets/images/productX.png | Thay X = số"
              />
            </Form.Group>

            <Form.Group controlId="productDate">
              <Form.Label className="proCreate-form-label">Create At (*)</Form.Label>
              <Form.Control type="date" name="productDate" defaultValue={product.date} pattern="yyyy-MM-dd" />
            </Form.Group>

            <Form.Group controlId="productStatus" className="proCreate-form-group">
              <Form.Label className="proCreate-form-label">Status (*)</Form.Label>
              <Form.Select name="productStatus" className="proCreate-form-control" defaultValue={product.status}>
                <option value="no_select">Chưa Lựa Chọn</option>
                <option value="in_stock">Còn hàng</option>
                <option value="out_of_stock">Hết hàng</option>
              </Form.Select>
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
