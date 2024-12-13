import { Row, Col, Card, Pagination, Button, Nav, Navbar, Carousel, Form } from "react-bootstrap";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import SearchIcon from "@mui/icons-material/Search";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleUp, faAngleDown } from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify";
import "./css/Style.css";

export default function ProductUser({ isLogin }) {
  const navigate = useNavigate();
  const [isSticky, setIsSticky] = useState(false);
  const { categoryID } = useParams();
  const [search, setSearch] = useState("");
  const [catID, setCatID] = useState(0);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);

  const [cartCount, setCartCount] = useState(() => {
    const storedCount = localStorage.getItem("cartCount");
    return storedCount ? parseInt(storedCount) : 0;
  });

  const [cart, setCart] = useState(() => {
    const storedCart = JSON.parse(localStorage.getItem("cart"));
    return storedCart || [];
  });

  //Hàm fetch dữ liệu để search, dữ liệu Categories và dữ liệu của Products
  useEffect(() => {
    fetch("http://localhost:9999/categories")
      .then((res) => res.json())
      .then((result) => setCategories(result));

    fetch(categoryID ? `http://localhost:9999/products?catID=${categoryID}` : "http://localhost:9999/products")
      .then((res) => res.json())
      .then((result) => {
        let searchResult = [];
        if (catID === 0) {
          searchResult = result.filter((p) => p.name.toLowerCase().includes(search.toLowerCase()) || p.descreption.toLowerCase().includes(search.toLowerCase()));
        } else {
          // eslint-disable-next-line eqeqeq
          searchResult = result.filter((p) => p.catID == catID && p.name.toLowerCase().includes(search.toLowerCase()));
        }
        setProducts(searchResult);
      });
  }, [catID, search, categoryID]);

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
  };

  useEffect(() => {
    localStorage.setItem("cartCount", JSON.stringify(cartCount));
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cartCount, cart]);

  const handleAddToCart = (product) => {
    let storedCart = JSON.parse(JSON.stringify(cart));
    let updatedCart = [];
    let updatedCount = cartCount;
    const ProductExist = storedCart.findIndex((item) => item.id === product.id);

    if (ProductExist !== -1) {
      storedCart[ProductExist].quantity = (storedCart[ProductExist].quantity || 1) + 1;
      updatedCart = [...storedCart];
    } else {
      product.quantity = 1;
      updatedCart = [...storedCart, product];
      updatedCount++; // Tăng số lượng sản phẩm trong giỏ hàng khi thêm sản phẩm mới
    }
    setCart(updatedCart);
    setCartCount(updatedCount); // Cập nhật số lượng sản phẩm trong giỏ hàng
    toast.success(`Thêm sản phẩm: ${product.name} thành công!`, {
      autoClose: 2000,
      closeButton: false,
      hideProgressBar: true,
      position: "top-right",
    });
  };
  // Hàm Show Cart so sánh với Login
  const handleShowCart = () => navigate(isLogin ? "/cart" : "/verifyorder");
  // Hàm sort
  const [sortOrder, setSortOrder] = useState("default");
  const sortProducts = (products, sortOrder) => {
    if (sortOrder === "default") {
      return products.slice();
    } else if (sortOrder === "desc") {
      return products.slice().sort((a, b) => b.price - a.price);
    } else if (sortOrder === "asc") {
      return products.slice().sort((a, b) => a.price - b.price);
    }
    return products.slice();
  };
  //Hàm sắp xếp giá
  const handleSortChange = (e) => {
    setSortOrder(e.target.value);
    setCurrentPage(1);
  };

  // tính số trang dựa trên số sản phẩm
  const sortedProducts = sortProducts(products, sortOrder);
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage] = useState(8);
  const totalPages = Math.ceil(sortedProducts.length / productsPerPage);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const handleCategoryChange = (e) => {
    const categoryId = parseInt(e.target.value);
    console.log("Selected Category ID:", categoryId);
    setSelectedCategory(categoryId);
    setCatID(categoryId);
  };
  // Phân trang
  const renderPagination = () => {
    const pages = [];
    for (let i = 1; i <= totalPages; i++) {
      // Hiển thị trang đầu, cuối, hoặc các trang gần vs currentPage
      if (i === 1 || i === totalPages || (i >= currentPage - 1 && i <= currentPage + 1)) {
        pages.push(
          <Pagination.Item
            key={i}
            active={i === currentPage}
            onClick={() => {
              setCurrentPage(i);
              window.scrollTo({
                top: 450, //Về đầu trang nhưng cách đỉnh 520px để không hiện 1 phần có carousel
                behavior: "smooth",
              });
            }}
          >
            {i}
          </Pagination.Item>
        );
      } else if (i === currentPage - 2 || i === currentPage + 2) {
        // Thêm dấu "..."
        pages.push(<Pagination.Ellipsis key={`ellipsis-${i}`} />);
      }
    }
    return pages;
  };

  // Carousels
  const carousels = [
    { id: 1, image: "assets/images/carousel1.png", alt: "Mô tả cho carousel 1" },
    { id: 2, image: "assets/images/carousel2.png", alt: "Mô tả cho carousel 2" },
    { id: 3, image: "assets/images/carousel3.png", alt: "Mô tả cho carousel 3" },
    { id: 4, image: "assets/images/carousel4.png", alt: "Mô tả cho carousel 4" },
  ];

  // Sự kiện Sroll cho thanh điều hướng Navigation, khi lăn chuột nó sẽ đi theo header
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 500) {
        setIsSticky(true);
      } else {
        setIsSticky(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  /* Click vào chữ giới thiệu */
  const scrollToAbout = () => {
    const aboutSection = document.getElementById("about");
    if (aboutSection) {
      window.scrollTo({
        top: aboutSection.offsetTop,
        behavior: "smooth",
      });
    }
  };
  /* Click vào chữ Liên hệ */
  const scrollToContact = () => {
    const contactSection = document.getElementById("contact");
    if (contactSection) {
      window.scrollTo({
        top: contactSection.offsetTop,
        behavior: "smooth",
      });
    }
  };

  return (
    <div style={{ overflow: "hidden" }}>
      {/* Carousel và Vị trí cửa hàng */}
      {/* Carousel */}
      <Row className="d-none d-sm-flex">
        <Col xs={12} sm={10}>
          <Carousel interval={2200}>
            {carousels.map((c) => (
              <Carousel.Item key={c.id}>
                <img src={c.image} alt={c.alt} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center" }} />
              </Carousel.Item>
            ))}
          </Carousel>
        </Col>
        {/* Cột vị trí cửa hàng và số zalo đi kèm */}
        <Col sm={2} style={{ overflow: "hidden", position: "relative", height: "350px" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              position: "absolute",
              top: "0", // Đặt nút Lên ở trên cùng
              width: "100%",
              zIndex: 1,
              marginLeft: "-20px",
            }}
          >
            <Button
              style={{
                width: "150px",
                height: "24px",
                backgroundColor: "orange",
                border: "none",
                borderRadius: "10px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                boxShadow: "0 2px 5px rgba(0,0,0,0.2)",
              }}
              onClick={() => {
                const list = document.getElementById("store-list");
                list.scrollTop -= 50;
              }}
            >
              <FontAwesomeIcon icon={faAngleUp} style={{ color: "white", fontSize: "24px" }} />
            </Button>
          </div>
          <div id="store-list" style={{ overflowY: "hidden", height: "250px", paddingRight: "12px", justifyContent: "center", marginTop: "50px" }}>
            <ul style={{ listStyleType: "none", padding: 0 }}>
              <li style={{ marginBottom: "10px" }}>
                <strong>123 Lý Thường Kiệt, TP.HCM</strong>
                <br />
                <span
                  style={{
                    backgroundColor: "orange",
                    color: "white",
                    borderRadius: "20px",
                    padding: "2px 20px",
                    display: "inline-block",
                    marginTop: "5px",
                    width: "100%",
                    textAlign: "center",
                  }}
                >
                  <a href="https://chat.zalo.me/login" target="_blank" rel="noopener noreferrer" style={{ color: "white", textDecoration: "none" }}>
                    Zalo: 0111.111.111
                  </a>
                </span>
              </li>
              <li style={{ marginBottom: "10px" }}>
                <strong>456 Trần Hưng Đạo, Hà Nội</strong>
                <br />
                <span
                  style={{
                    backgroundColor: "orange",
                    color: "white",
                    borderRadius: "20px",
                    padding: "2px 20px",
                    display: "inline-block",
                    marginTop: "5px",
                    width: "100%",
                    textAlign: "center",
                  }}
                >
                  <a href="https://chat.zalo.me/login" target="_blank" rel="noopener noreferrer" style={{ color: "white", textDecoration: "none" }}>
                    Zalo: 0222.222.222
                  </a>
                </span>
              </li>
              <li style={{ marginBottom: "10px" }}>
                <strong>789 Nguyễn Trãi, Đà Nẵng</strong>
                <br />
                <span
                  style={{
                    backgroundColor: "orange",
                    color: "white",
                    borderRadius: "20px",
                    padding: "2px 20px",
                    display: "inline-block",
                    marginTop: "5px",
                    width: "100%",
                    textAlign: "center",
                  }}
                >
                  <a href="https://chat.zalo.me/login" target="_blank" rel="noopener noreferrer" style={{ color: "white", textDecoration: "none" }}>
                    Zalo: 0333.333.333
                  </a>
                </span>
              </li>
              <li style={{ marginBottom: "10px" }}>
                <strong>321 Phạm Văn Đồng, Cần Thơ</strong>
                <br />
                <span
                  style={{
                    backgroundColor: "orange",
                    color: "white",
                    borderRadius: "20px",
                    padding: "2px 20px",
                    display: "inline-block",
                    marginTop: "5px",
                    width: "100%",
                    textAlign: "center",
                  }}
                >
                  <a href="https://chat.zalo.me/login" target="_blank" rel="noopener noreferrer" style={{ color: "white", textDecoration: "none" }}>
                    Zalo: 0444.444.444
                  </a>
                </span>
              </li>
              <li style={{ marginBottom: "10px" }}>
                <strong>654 Nguyễn Huệ, Nha Trang</strong>
                <br />
                <span
                  style={{
                    backgroundColor: "orange",
                    color: "white",
                    borderRadius: "20px",
                    padding: "2px 20px",
                    display: "inline-block",
                    marginTop: "5px",
                    width: "100%",
                    textAlign: "center",
                  }}
                >
                  <a href="https://chat.zalo.me/login" target="_blank" rel="noopener noreferrer" style={{ color: "white", textDecoration: "none" }}>
                    Zalo: 0555.555.555
                  </a>
                </span>
              </li>
              <li style={{ marginBottom: "10px" }}>
                <strong>987 Lê Lợi, Hải Phòng</strong>
                <br />
                <span
                  style={{
                    backgroundColor: "orange",
                    color: "white",
                    borderRadius: "20px",
                    padding: "2px 20px",
                    display: "inline-block",
                    marginTop: "5px",
                    width: "100%",
                    textAlign: "center",
                  }}
                >
                  <a href="https://chat.zalo.me/login" target="_blank" rel="noopener noreferrer" style={{ color: "white", textDecoration: "none" }}>
                    Zalo: 0123.456.789
                  </a>
                </span>
              </li>
            </ul>
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              position: "absolute",
              bottom: "0",
              width: "100%",
              zIndex: 1,
              marginLeft: "-20px",
            }}
          >
            <Button
              style={{
                width: "150px",
                height: "24px",
                backgroundColor: "orange",
                border: "none",
                borderRadius: "10px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                boxShadow: "0 2px 5px rgba(0,0,0,0.2)",
              }}
              onClick={() => {
                const list = document.getElementById("store-list");
                list.scrollTop += 50;
              }}
            >
              <FontAwesomeIcon icon={faAngleDown} style={{ color: "white", fontSize: "24px" }} />
            </Button>
          </div>
        </Col>
      </Row>

      {/* Thanh điều hướng sản phẩm, giới thiệu, liên hệ*/}
      <Row>
        <Navbar bg="secondary" expand="lg" className={`navbar ${isSticky ? "sticky" : ""}`} id="navbar">
          <Navbar.Brand style={{ border: "1px solid yellow", marginLeft: "30px", padding: "5px 10px", borderRadius: "10px", backgroundColor: "yellow" }}>
            Trang chủ
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" aria-label="Toggle navigation" style={{ backgroundColor: "white" }} />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="mr-auto">
              <Nav.Link
                style={{ color: "white" }}
                as={Link}
                to="/productuser"
                onClick={() => {
                  if (window.scrollY === 0) {
                    window.location.reload();
                  } else {
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }
                }}
                onMouseEnter={(e) => (e.target.style.color = "yellow")}
                onMouseLeave={(e) => (e.target.style.color = "white")}
              >
                Sản phẩm
              </Nav.Link>

              <Nav.Link
                style={{ color: "white" }}
                as={Link}
                onClick={scrollToAbout}
                to="#about"
                onMouseEnter={(e) => (e.target.style.color = "yellow")}
                onMouseLeave={(e) => (e.target.style.color = "white")}
              >
                Giới thiệu
              </Nav.Link>
              <Nav.Link
                style={{ color: "white" }}
                as={Link}
                onClick={scrollToContact}
                to="#contact"
                onMouseEnter={(e) => (e.target.style.color = "yellow")}
                onMouseLeave={(e) => (e.target.style.color = "white")}
              >
                Liên hệ
              </Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Navbar>
      </Row>

      {/* Hiện sản phẩm giao diện */}
      <Row className="mb-3 mt-3">
        {/* Thanh tìm kiếm */}
        <Col xs={12} md={8}>
          <Form>
            <div style={{ display: "flex", alignItems: "center", marginLeft: "6px" }}>
              <Form.Control
                type="text"
                placeholder="Nhập tên sản phẩm bạn muốn tìm kiếm..."
                style={{ border: "2px solid rgb(0, 191, 255)", marginRight: "10px", borderRadius: "10px" }}
                onChange={handleSearchChange}
              />
              <span className="Search-icon-user">
                <SearchIcon style={{ color: "white", cursor: "pointer" }} />
              </span>
            </div>
          </Form>
        </Col>
        {/* Nút giỏ hàng */}
        <Col className="text-end" xs={12} md={4}>
          <div
            style={{ marginRight: "15px" }}
            onClick={handleShowCart}
            className="btn btn-danger px-4 py-2"
            onMouseEnter={(e) => (e.target.style.color = "lightgrey")}
            onMouseLeave={(e) => (e.target.style.color = "white")}
          >
            🛒 Giỏ Hàng [ <span style={{ fontFamily: "fantasy" }}>{cartCount}</span> ]
          </div>
        </Col>
      </Row>

      {/* Hiện các sản phẩm và cột menu trái */}
      <Row>
        {/* Cột Menu Trái */}
        <Col md={2}>
          {/* xếp theo giá tiền */}
          <div style={{ backgroundColor: "lightgrey", padding: "20px", borderRadius: "10px" }}>
            <Form>
              <Form.Group controlId="sortOrder">
                <Form.Label style={{ fontWeight: "bold" }}>Sắp xếp theo giá:</Form.Label>
                <Form.Control as="select" value={sortOrder} onChange={handleSortChange}>
                  <option value="default">Không sắp xếp</option>
                  <option value="asc">Giá tăng dần</option>
                  <option value="desc">Giá giảm dần</option>
                </Form.Control>
              </Form.Group>
            </Form>
          </div>
          {/* xếp theo thể loại mặt hàng */}
          <div style={{ backgroundColor: "lightgrey", padding: "20px", borderRadius: "10px", marginTop: "10px" }}>
            <Form>
              <Form.Label style={{ fontWeight: "bold" }}>Lựa chọn theo loại:</Form.Label>
              <Form.Select onChange={handleCategoryChange} value={selectedCategory || 0}>
                <option key={0} value={0}>
                  {" "}
                  Tất cả sản phẩm
                </option>
                {categories?.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </Form.Select>
            </Form>
          </div>
          {/* Mục các logo ngân hàng */}
          <div style={{ backgroundColor: "lightgrey", padding: "20px", borderRadius: "10px", marginTop: "10px" }}>
            <Form>
              <Form.Group controlId="paymentMethods">
                <Form.Label style={{ fontWeight: "bold", fontSize: "0.9rem" }}>Phương thức thanh toán:</Form.Label>
                <Row>
                  <Col xs={4}>
                    <img src="https://upload.wikimedia.org/wikipedia/commons/4/41/Visa_Logo.png" alt="Visa" style={{ width: "100%" }} />
                  </Col>
                  <Col xs={4}>
                    <img src="https://upload.wikimedia.org/wikipedia/commons/a/a4/Mastercard_2019_logo.svg" alt="Mastercard" style={{ width: "100%" }} />
                  </Col>
                  <Col xs={4}>
                    <img src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg" alt="Paypal" style={{ width: "100%" }} />
                  </Col>
                </Row>
                <Row>
                  <Col xs={4}>
                    <img src="https://upload.wikimedia.org/wikipedia/commons/3/30/American_Express_logo.svg" alt="Amex" style={{ width: "100%" }} />
                  </Col>
                  <Col xs={4}>
                    <img src="https://upload.wikimedia.org/wikipedia/vi/f/fe/MoMo_Logo.png" alt="Momo" style={{ width: "100%" }} />
                  </Col>
                  <Col xs={4}>
                    <img
                      src="https://upload.wikimedia.org/wikipedia/commons/thumb/1/13/Apple_Pay_Acceptance_Mark.svg/640px-Apple_Pay_Acceptance_Mark.svg.png"
                      alt="Apple Pay"
                      style={{ width: "100%" }}
                    />
                  </Col>
                </Row>
                <Row className="mt-2">
                  <Col xs={4}>
                    <img src="https://cdn.haitrieu.com/wp-content/uploads/2022/10/Logo-ZaloPay-350x350.png" alt="ZaloPay" style={{ width: "100%" }} />
                  </Col>
                  <Col xs={4}>
                    <img
                      src="https://downloadlogomienphi.com/sites/default/files/logos/download-logo-vector-vietqr-mien-phi.jpg"
                      alt="VietQR"
                      style={{ width: "100%" }}
                    />
                  </Col>
                  <Col xs={4}>
                    <img src="https://fintechnews.sg/wp-content/uploads/2019/06/03-moca.png" alt="Moca" style={{ width: "100%" }} />
                  </Col>
                </Row>
              </Form.Group>
            </Form>
          </div>
          {/* Liên hệ phục vụ cho các mục đích */}
          <div style={{ backgroundColor: "lightgrey", padding: "20px", borderRadius: "10px", marginTop: "10px" }}>
            <Form.Label style={{ fontWeight: "bold", fontSize: "0.9rem" }}>Tổng Đài Hỗ Trợ Miễn Phí:</Form.Label>
            <ul style={{ listStyleType: "none", paddingLeft: 0 }}>
              <li>
                Mua hàng: <span style={{ color: "blue", fontWeight: "bold" }}>0111.111.111</span>
              </li>
              <li>
                Khiếu nại: <span style={{ color: "blue", fontWeight: "bold" }}>0222.222.222</span>
              </li>
              <li>
                Bảo hành: <span style={{ color: "blue", fontWeight: "bold" }}>0333.333.333</span>
              </li>
            </ul>
          </div>
          {/* Các chính sách, điều khoản, gửi góp ý, khiếu nại */}
          <div style={{ backgroundColor: "lightgrey", padding: "20px", borderRadius: "10px", marginTop: "10px" }}>
            <Form.Label style={{ fontWeight: "bold", fontSize: "1rem" }}>Chính Sách Sử dụng:</Form.Label>
            <ul style={{ listStyleType: "none", paddingLeft: "10px" }}>
              <li>
                <a
                  href="/terms"
                  style={{ color: "blue", textDecoration: "none", marginLeft: "5px" }}
                  onMouseEnter={(e) => (e.target.style.color = "red")}
                  onMouseLeave={(e) => (e.target.style.color = "blue")}
                >
                  Điều Khoản Và Dịch Vụ
                </a>
              </li>
              <li>
                <a
                  href="/rules"
                  style={{ color: "blue", textDecoration: "none", marginLeft: "5px" }}
                  onMouseEnter={(e) => (e.target.style.color = "red")}
                  onMouseLeave={(e) => (e.target.style.color = "blue")}
                >
                  Nội quy cửa hàng
                </a>
              </li>
              <li>
                <a
                  href="/answerquestion"
                  style={{ color: "blue", textDecoration: "none", marginLeft: "5px" }}
                  onMouseEnter={(e) => (e.target.style.color = "red")}
                  onMouseLeave={(e) => (e.target.style.color = "blue")}
                >
                  Gửi góp ý, khiếu nại
                </a>
              </li>
            </ul>
          </div>
        </Col>

        {/* Cột chứa sản phẩm */}
        <Col md={10}>
          <Row>
            {sortedProducts.slice((currentPage - 1) * productsPerPage, currentPage * productsPerPage).map((p, index) => (
              <Col key={index} md={3} xs={12} sm={6} style={{ marginBottom: "22px" }}>
                <Card className="mb-4" style={{ display: "flex", flexDirection: "column", height: "100%" }}>
                  <Card.Link
                    href={`/product/${p.id}/detail`}
                    style={{ height: "200px", overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center" }}
                  >
                    <Card.Img variant="top" src={p.image} alt={p.descreption} style={{ objectFit: "contain", width: "100%", height: "100%" }} />
                  </Card.Link>
                  <Card.Body style={{ flex: "1 1 auto" }}>
                    <Card.Title className="text-center">
                      <Link
                        to={`/product/${p.id}/detail`}
                        style={{ textDecoration: "none", fontWeight: "bold", fontSize: "1.5rem" }}
                        onMouseEnter={(e) => (e.target.style.color = "orange")}
                        onMouseLeave={(e) => (e.target.style.color = "blue")}
                      >
                        {p.name}
                      </Link>
                    </Card.Title>
                    <Card.Text style={{ color: "red", fontWeight: "bold" }}>
                      <span style={{ marginRight: "9px", marginLeft: "2px" }}>{p.price.toLocaleString("vi-VN", { style: "currency", currency: "VND" })}</span>
                      <span style={{ textDecoration: "line-through", color: "gray", marginRight: "3px" }}>
                        &nbsp;
                        {((p.price * 100) / 87).toLocaleString("vi-VN", { style: "currency", currency: "VND" })}
                      </span>{" "}
                      <small style={{ color: "red", backgroundColor: "pink", borderRadius: "5px", padding: "2px 4px" }}>-14%</small>
                    </Card.Text>
                    <Card.Text>{p.descreption}</Card.Text>
                  </Card.Body>
                  <Button
                    variant="success"
                    onClick={() => handleAddToCart(p)}
                    onMouseEnter={(e) => (e.target.style.color = "black")}
                    onMouseLeave={(e) => (e.target.style.color = "white")}
                  >
                    Thêm vào giỏ hàng
                  </Button>
                  <Button
                    style={{ margin: "5px" }}
                    variant="warning"
                    as={Link}
                    to={`/product/${p.id}/detail`}
                    onMouseEnter={(e) => (e.target.style.color = "white")}
                    onMouseLeave={(e) => (e.target.style.color = "black")}
                  >
                    Xem chi tiết
                  </Button>
                </Card>
              </Col>
            ))}
          </Row>
        </Col>
      </Row>

      {/* Phân trang */}
      <Row variant="round" className="mt-3">
        <Pagination style={{ justifyContent: "center" }}>{renderPagination()}</Pagination>
      </Row>
    </div>
  );
}
