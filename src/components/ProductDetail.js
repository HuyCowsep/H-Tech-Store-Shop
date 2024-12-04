import React from "react";
import { useEffect, useState } from "react";
import { Container, Row, Col, Image, Button, Form } from "react-bootstrap";
import { useParams, Link, useNavigate } from "react-router-dom";
import Footer from "./Footer";
import "./css/Style.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar, faThumbsUp } from "@fortawesome/free-solid-svg-icons";
import Countdown from "react-countdown";
import useCountdown from "../hooks/useCountdown";
import ReportProduct from "../hooks/ReportProduct";
import ChatWithShop from "../hooks/ChatWithShop";
import AvatarModal from "../hooks/AvatarModal";
import { toast } from "react-toastify";
import { Facebook, Twitter, Instagram, Message, Pinterest } from "@mui/icons-material";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import StorefrontIcon from "@mui/icons-material/Storefront";

export default function ProductDetail({ isLogin }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState({});
  const [categories, setCategories] = useState([]);
  const [similarProducts, setSimilarProducts] = useState([]);
  //đếm ngược flash sale
  const initialTime = 24 * 60 * 60 * 1000; // 24 tiếng - mili giây
  const date = useCountdown(initialTime);
  //tố cáo sản phẩm
  const [showReportModal, setShowReportModal] = useState(false);
  //Hiện thanh chat để chat với shop
  const [showChat, setShowChat] = useState(false);
  const handleOpenChat = () => setShowChat(true);
  const handleCloseChat = () => setShowChat(false);

  const [showAvatarModal, setShowAvatarModal] = useState(false);
  // show ảnh ava
  const handleOpenAvatarModal = () => {
    setShowAvatarModal(true);
  };
  // đóng ảnh ava
  const handleCloseAvatarModal = () => {
    setShowAvatarModal(false);
  };

  const renderer = ({ hours, minutes, seconds }) => {
    return (
      <span className="countdown-timer">
        <span className="time-block">{hours} giờ</span>
        <span className="time-block">{minutes} phút</span>
        <span className="time-block">{seconds} giây</span>
      </span>
    );
  };
  // Tạo số lượng đã bán được ngẫu nhiên
  const generateRandomSoldCount = () => Math.floor(Math.random() * (9999 - 1000 + 1)) + 1000;

  // lấy sản phẩm theo id
  useEffect(() => {
    fetch(`http://localhost:9999/products/${id}`)
      .then((res) => res.json())
      .then((result) => {
        setProduct(result);

        fetch(`http://localhost:9999/products`)
          .then((res) => res.json())
          .then((allProducts) => {
            const similar = allProducts.filter((p) => p.catID == product.catID && p.id !== product.id).map((p) => ({ ...p, soldCount: generateRandomSoldCount() }));
            setSimilarProducts(similar);
          });
      });
    fetch(`http://localhost:9999/categories`)
      .then((res) => res.json())
      .then((result) => setCategories(result));
  }, [id, product.catID, product.id]);

  const [cartCount, setCartCount] = useState(() => {
    const storedCount = localStorage.getItem("cartCount");
    return storedCount ? parseInt(storedCount) : 0;
  });

  const [cart, setCart] = useState(() => {
    const storedCart = JSON.parse(localStorage.getItem("cart"));
    return storedCart || [];
  });

  const handleShowCart = () => {
    if (isLogin) {
      navigate("/cart");
    } else {
      navigate("/verifyorder");
    }
  };

  useEffect(() => {
    localStorage.setItem("cartCount", JSON.stringify(cartCount));
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cartCount, cart]);

  const handleAddToCart = (product, navigateToCart = false) => {
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

    setTimeout(() => {
      if (navigateToCart) {
        if (isLogin) {
          navigate("/cart");
        } else {
          navigate("/verifyorder");
        }
      }
    }, 0);
  };

  //khai báo biến review để xem đánh giá của user
  const [reviews, setReviews] = useState([]);
  const [likes, setLikes] = useState(0);
  const [showMoreReviews, setShowMoreReviews] = useState(false);
  const [newReview, setNewReview] = useState({
    rating: 1,
    review: "",
  });
  //fetch dữ liệu của mảng review ra
  useEffect(() => {
    fetch(`http://localhost:9999/reviews?productId=${product.id}`)
      .then((response) => response.json())
      .then((data) => {
        setReviews(data);
      })
      .catch((error) => console.error("Error fetching reviews:", error));
  }, [product.id]);
  // hàm xử lý tăng like ở nút hữu ích
  const handleLike = (reviewId, currentCount) => {
    const updatedCount = currentCount + 1;

    fetch(`http://localhost:9999/reviews/${reviewId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ helpfulCount: updatedCount }),
    })
      .then((res) => res.json())
      .then((updatedReview) => {
        setReviews((prevReviews) => prevReviews.map((review) => (review.id === reviewId ? updatedReview : review)));
      })
      .catch((error) => console.error("Error updating helpful count:", error));
  };

  // Xử lý thay đổi rating mới khi người dùng chọn sao
  const handleRatingChange = (rating) => {
    setNewReview({ ...newReview, rating });
  };
  // Xử lý thay đổi nội dung review
  const handleReviewChange = (e) => {
    setNewReview({ ...newReview, review: e.target.value });
  };
  // Hiển thị thêm hoặc ẩn các đánh giá
  const handleShowMore = () => {
    setShowMoreReviews(!showMoreReviews);
  };
  // Hàm xử lý gửi review mới
  const handleSubmitReview = () => {
    const storedAccounts = localStorage.getItem("accounts");
    let currentAccount;
    if (storedAccounts) {
      const accounts = JSON.parse(storedAccounts);
      currentAccount = accounts[0];
    }

    if (!currentAccount) {
      alert("Vui lòng đăng nhập để viết đánh giá!");
      return;
    }
    if (currentAccount.role === "admin") {
      alert("Admin không thể viết đánh giá!");
      return;
    }

    const newReviewData = {
      id: `R${reviews.length + 1}`,
      productId: product.id,
      userId: currentAccount.id,
      rating: newReview.rating,
      review: newReview.review,
      date: new Date().toLocaleDateString("vi-VN"),
      userName: currentAccount.name,
      productName: product.name,
      helpfulCount: 0,
    };
    fetch(`http://localhost:9999/reviews`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newReviewData),
    })
      .then((response) => response.json())
      .then((data) => {
        setReviews([data, ...reviews]);
        setNewReview({ rating: 1, review: "" });
        console.log("Dữ liệu review sau khi gửi:", newReviewData);
      })
      .catch((error) => console.error("Có lỗi khi gửi đánh giá:", error));
  };

  return (
    <Container fluid>
      <Row className="product-detail">
        <Row>
          <Col className="col-md-4">
            <Link to={"/productuser"} className="btn btn-dark mb-3 btn-lg">
              &larr; Trang chủ
            </Link>
          </Col>
          <Col className="col-md-4">
            <h2
              style={{
                backgroundColor: "#DCDCE6",
                border: "2px solid black",
                padding: "10px",
                borderRadius: "10px",
                textAlign: "center",
              }}
            >
              Thông tin chi tiết sản phẩm
            </h2>
          </Col>
          <Col className="col-md-4" style={{ textAlign: "end" }}>
            <div onClick={handleShowCart} className="btn btn-danger btn-lg">
              🛒 Giỏ Hàng [ <span style={{ fontFamily: "fantasy" }}>{cartCount}</span> ]
            </div>
          </Col>
        </Row>

        <Row>
          <Col md={6}>
            <Row>
              <div className="product-detail-info">
                <Row>
                  <p>
                    <span style={{ textDecoration: "underline", color: "#D0011B" }}>4.9</span>{" "}
                    {[...Array(5)].map((star, index) => (
                      <FontAwesomeIcon key={index} icon={faStar} color="#D0011B" />
                    ))}
                    &nbsp;&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;&nbsp;
                    <span
                      style={{
                        textDecoration: "underline",
                        color: "#D0011B",
                        marginRight: "5px",
                      }}
                    >
                      {generateRandomSoldCount().toLocaleString("vi-VN")}
                    </span>{" "}
                    Đánh Giá &nbsp;&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;&nbsp;
                    <span
                      style={{
                        textDecoration: "underline",
                        color: "#D0011B",
                        marginRight: "5px",
                      }}
                    >
                      {generateRandomSoldCount().toLocaleString("vi-VN")}
                    </span>{" "}
                    <span style={{ marginRight: "130px" }}>Đã Bán</span>
                    <a
                      href="#!"
                      style={{ textDecoration: "none", color: "red" }}
                      onClick={() => setShowReportModal(true)}
                      onMouseEnter={(e) => (e.target.style.color = "blue")}
                      onMouseLeave={(e) => (e.target.style.color = "red")}
                    >
                      Tố Cáo Sản Phẩm
                    </a>
                    {showReportModal && (
                      <div className="modal-overlay">
                        <ReportProduct />
                        <Button className="button-close-report" onClick={() => setShowReportModal(false)}>
                          Đóng
                        </Button>
                      </div>
                    )}
                  </p>
                </Row>
                <Row className="flash-sale-row">
                  <Col className="flash-sale-title" md={4}>
                    ⚡Flash Sale
                  </Col>
                  <Col className="flash-sale-timer" md={8}>
                    <span className="flash-sale-timer-span">🕧Kết thúc trong</span> <Countdown date={date} renderer={renderer} />
                  </Col>
                </Row>
                <div
                  className="product-detail-title"
                  style={{
                    fontWeight: "bold",
                    fontSize: "1.8rem",
                    textAlign: "start",
                    fontFamily: "-moz-initial",
                  }}
                >
                  <span className="product-detail-mall">Mall</span> {product?.name}
                </div>
                <div className="product-detail-item">
                  <strong>ID sản phẩm:</strong> {product?.id}
                </div>
                <div className="product-detail-item">
                  <strong>Giá tiền: </strong>
                  <span
                    style={{
                      marginLeft: "2px",
                      color: "red",
                      fontWeight: "bold",
                    }}
                  >
                    {product?.price
                      ? product.price.toLocaleString("vi-VN", {
                          style: "currency",
                          currency: "VND",
                        })
                      : "N/A"}
                  </span>
                  <span
                    style={{
                      textDecoration: "line-through",
                      color: "gray",
                      marginLeft: "8px",
                      marginRight: "9px",
                      fontWeight: "bold",
                    }}
                  >
                    {product?.price
                      ? (product.price / 0.88).toLocaleString("vi-VN", {
                          style: "currency",
                          currency: "VND",
                        })
                      : "N/A"}
                  </span>
                  <small
                    style={{
                      color: "white",
                      backgroundColor: "darkorange",
                      borderRadius: "5px",
                      padding: "2px 4px",
                      fontWeight: "bold",
                    }}
                  >
                    -12% GIẢM
                  </small>
                </div>
                <div className="product-detail-item">
                  <strong>Số lượng:</strong>{" "}
                  <span
                    style={{
                      color: "green",
                      fontSize: "1.2rem",
                      fontWeight: "bold",
                      backgroundColor: "#e0f7e0",
                      padding: "0.2rem 0.5rem",
                      borderRadius: "5px",
                    }}
                  >
                    {product?.quantity}
                  </span>{" "}
                  sản phẩm có sẵn
                </div>
                <div className="product-detail-item">
                  <strong>Thể loại:</strong> {/* eslint-disable-next-line eqeqeq*/}
                  {(categories && categories?.find((c) => c.id == product.catID)?.name) || "N/A"}
                </div>{" "}
                <div className="product-detail-item">
                  <strong>Deal Sốc: </strong> <span className="product-detail-item-deal">Mua để nhận quà</span>
                </div>
                <div className="product-detail-item">
                  <strong>Mô tả sản phẩm: </strong> {product?.descreption}
                </div>
                <div className="product-detail-item">
                  <strong>Ngày ra mắt:</strong> {new Date(product?.date).toLocaleDateString("vi-VN")}
                </div>
                <div className="product-detail-item">
                  <strong>Trạng thái:</strong> {product?.status}
                </div>
              </div>
            </Row>
          </Col>

          <Col md={6} style={{ paddingLeft: "150px" }}>
            <div className="product-detail-image">
              <img src={product?.image} alt={product?.name} className="img-fluid" style={{ maxWidth: "87%" }} />
            </div>
          </Col>
        </Row>
        <Row className="mt-3">
          <Col className="col-md-6 text-center">
            Chia Sẻ Tới: <Facebook className="iconicon" />
            <Twitter className="iconicon" />
            <Instagram className="iconicon" />
            <Message className="iconicon" />
            <Pinterest className="iconicon" />{" "}
            <span
              style={{
                color: "red",
                fontFamily: "fantasy",
                border: "1px solid black",
                padding: "5px",
                backgroundColor: "#DCDCE6",
                borderRadius: "8px",
                marginRight: "50px",
                marginLeft: "50px",
              }}
            >
              Shopping Mall
            </span>
            <span style={{ fontSize: "2.0rem", color: "red", marginRight: "10px" }}>♡</span>{" "}
            <span style={{ fontSize: "1.5rem" }}>Đã thích ({generateRandomSoldCount()})</span>
          </Col>
          <Col className="col-md-6 text-end">
            <span>
              <Button className="Button-add-detail" onClick={() => handleAddToCart(product)}>
                🛒 Thêm vào giỏ hàng
              </Button>
            </span>
            <span>
              <button className="Button-buynow-detail" onClick={() => handleAddToCart(product, true)}>
                Mua Ngay
              </button>
            </span>
          </Col>
        </Row>
      </Row>

      <Row className="shop-info-row" style={{ height: "200px", padding: "20px 40px", alignItems: "center" }}>
        {/* Cột đầu tiên */}
        <Col md={4} className="shop-info-col">
          <div className="shop-info">
            <Image src="/assets/images/avartashop.png" roundedCircle className="shop-avatar" onClick={handleOpenAvatarModal} style={{ cursor: "pointer" }} />
            <div className="shop-details">
              <h5>H-Tech Store</h5>
              <p className="shop-status">
                <span className="status-indicator online"></span> Đang hoạt động
              </p>
              <Button variant="primary" size="sm" className="chat-now" onClick={handleOpenChat} sx={{ mt: 1 }}>
                <ChatBubbleOutlineIcon /> Chat Ngay
              </Button>{" "}
              <Button variant="secondary" size="sm" className="view-shop" as={Link} to={`/productuser`}>
                <StorefrontIcon /> Xem Shop
              </Button>
            </div>
            {/* Modal cho ảnh Avatar */}
            <AvatarModal show={showAvatarModal} handleClose={handleCloseAvatarModal} imageSrc="/assets/images/avartashop.png" />
          </div>
          <ChatWithShop show={showChat} handleClose={handleCloseChat} />
        </Col>

        {/* Cột thứ hai */}
        <Col md={8} className="shop-stats-col">
          <Row>
            <Col md={4}>
              <div className="shop-stat">
                <h6>Đánh Giá</h6>
                <p>68,8k</p>
              </div>
            </Col>
            <Col md={4}>
              <div className="shop-stat">
                <h6>Tỉ Lệ Phản Hồi</h6>
                <p>96%</p>
              </div>
            </Col>
            <Col md={4}>
              <div className="shop-stat">
                <h6>Tham Gia</h6>
                <p>8 năm</p>
              </div>
            </Col>
          </Row>
          <Row>
            <Col md={4}>
              <div className="shop-stat">
                <h6>Sản Phẩm</h6>
                <p>266</p>
              </div>
            </Col>
            <Col md={4}>
              <div className="shop-stat">
                <h6>Thời Gian Phản Hồi</h6>
                <p>Trong vài giờ</p>
              </div>
            </Col>
            <Col md={4}>
              <div className="shop-stat">
                <h6>Người Theo Dõi</h6>
                <p>87,2k</p>
              </div>
            </Col>
          </Row>
        </Col>
      </Row>

      {/*phần Đánh giá sản phẩm của khách hàng*/}
      <Row className="product-review">
        <h5 className="text-center fw-bold fs-2 pb-2">Đánh giá sản phẩm</h5>

        {reviews.length > 0 ? (
          reviews
            .slice(0, showMoreReviews ? reviews.length : 3) // Hiển thị tối đa 3 đánh giá ban đầu
            .map((review) => (
              <Col key={review.id} sm={12} md={6} lg={4}>
                <div className="product-review-user">Người đánh giá: {review.userName}</div>
                <div className="product-review-stars">
                  {[...Array(review.rating)].map((star, index) => (
                    <FontAwesomeIcon key={index} icon={faStar} color="gold" />
                  ))}
                </div>
                <div className="product-review-user">
                  <p>Phân loại hàng: {review.productName}</p>
                </div>
                <div className="product-review-comment">
                  <p>{review.review}</p>
                </div>
                <Button variant="primary" onClick={() => handleLike(review.id, review.helpfulCount)} size="sm" className="d-flex align-items-center">
                  <FontAwesomeIcon icon={faThumbsUp} className="me-2" />
                  {`Hữu ích (${review.helpfulCount})`}
                </Button>
              </Col>
            ))
        ) : (
          <p style={{ textAlign: "center", fontFamily: "cursive", color: "red" }}>Chưa có đánh giá nào cho sản phẩm này.</p>
        )}
        <p style={{ textAlign: "center" }}>
          <Button onClick={handleShowMore}>{showMoreReviews ? "Ẩn bớt đánh giá" : "Xem Thêm Các Lượt Đánh Giá Khác"}</Button>
        </p>

        {/* Form viết đánh giá của khách hàng*/}
        <div style={{ marginTop: "20px" }}>
          <h5>Đánh giá sản phẩm này</h5>
          <Form>
            <Form.Group controlId="formRating">
              <Form.Label>Chọn số sao:</Form.Label>
              {[1, 2, 3, 4, 5].map((star) => (
                <FontAwesomeIcon
                  key={star}
                  icon={faStar}
                  color={newReview.rating >= star ? "gold" : "gray"}
                  onClick={() => handleRatingChange(star)}
                  style={{ cursor: "pointer" }}
                />
              ))}
            </Form.Group>

            <Form.Group controlId="formReview">
              <Form.Label>Nhập đánh giá của bạn:</Form.Label>
              <Form.Control as="textarea" rows={3} value={newReview.review} onChange={handleReviewChange} />
            </Form.Group>

            <Button variant="primary" onClick={handleSubmitReview}>
              Gửi Đánh Giá
            </Button>
          </Form>
        </div>
      </Row>

      {/* Danh sách sản phẩm tương tự */}
      <Row>
        <div className="m-2">
          <h3>
            <span className="fw-bold fs-2">Các sản phẩm tương tự: </span>
            <span
              style={{
                backgroundColor: "#f8ded6",
                border: "2px solid black",
                padding: "10px",
                borderRadius: "10px",
              }}
            >
              {/* eslint-disable-line no-mixed-operators  */} {/* eslint-disable-next-line eqeqeq*/}
              {(categories && categories?.find((c) => c.id == product.catID)?.name) || "N/A"}{" "}
            </span>
          </h3>
        </div>

        <Row className="similar-products-container">
          <Col className="col-md-8">
            <div className="row row-cols-md-3">
              {similarProducts.map((product) => (
                <div key={product.id} className="col-md-4">
                  <div className="similar-product">
                    <Link to={`/product/${product.id}/detail`} className="similar-product-link" onClick={() => window.scrollTo(0, 0)}>
                      <img src={product.image} alt={product.name} className="similar-product-image" />
                      <h2 className="similar-product-name">{product.name}</h2>
                      <Row>
                        <Col md={6}>
                          <p style={{ color: "red" }}>
                            {product?.price
                              ? product.price.toLocaleString("vi-VN", {
                                  style: "currency",
                                  currency: "VND",
                                })
                              : "N/A"}
                          </p>
                        </Col>
                        <Col md={6}>
                          <p style={{ color: "black" }}>Đã bán {product.soldCount.toLocaleString("vi-VN")}</p>
                        </Col>
                      </Row>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </Col>
          <Col className="col-md-4"></Col>
        </Row>
      </Row>

      {/* Footer */}
      <Row>
        <Footer />
      </Row>
    </Container>
  );
}
