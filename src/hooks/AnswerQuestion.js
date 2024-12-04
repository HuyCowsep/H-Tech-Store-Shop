import React, { useState } from "react";
import { Row, Col } from "react-bootstrap";
import "./css/Hooks.css";

const AnswerQuestion = () => {
  const [topic, setTopic] = useState("");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!topic || !title || !content || !fullName || !email || !phone) {
      alert("Vui lòng nhập đầy đủ các thông tin để chúng tôi có thể hiểu rõ nhất vấn đề bạn đang gặp !");
      return;
    }
  };

  return (
    <Row>
      <div style={{ marginLeft: "72px", marginBottom: "20px", marginTop: "8px" }}>
        <a
          href="/productuser"
          style={{ textDecoration: "none" }}
          onMouseEnter={(e) => (e.target.style.color = "red")}
          onMouseLeave={(e) => (e.target.style.color = "blue")}
        >
          Trang chủ
        </a>{" "}
        &gt; <span>Góp ý</span>
      </div>
      <Col md={6}>
        <p className="title-welcome">H-TECH STORE XIN HÂN HẠNH ĐƯỢC HỖ TRỢ BẠN</p>
        <div className="answer-question-container" onSubmit={handleSubmit}>
          <h2>Đóng góp ý kiến của bạn</h2>
          <form className="answer-form">
            <div className="form-group">
              <label htmlFor="topic">Bạn đang quan tâm về vấn đề:</label>
              <select id="topic" name="topic" className="form-control" value={topic} onChange={(e) => setTopic(e.target.value)}>
                <option value="select">Chọn chủ đề</option>
                <option value="advice">Tư vấn</option>
                <option value="complaint">Khiếu nại - phản ánh</option>
                <option value="cooperation">Hợp tác với H-Tech Store</option>
                <option value="improvement">Góp ý cải tiến</option>
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="title">Tiêu đề:(*)</label>
              <input type="text" id="title" name="title" className="form-control" value={title} onChange={(e) => setTitle(e.target.value)} />
            </div>
            <div className="form-group">
              <label htmlFor="content">Nội dung:(*)</label>
              <textarea
                id="content"
                name="content"
                className="form-control"
                rows="3"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Bạn vui lòng mô tả chi tiết"
              ></textarea>
            </div>
            <div className="form-group">
              <label htmlFor="fullname">Họ và tên:(*)</label>
              <input
                type="text"
                id="fullname"
                name="fullname"
                className="form-control"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Nhập tên của bạn"
              />
            </div>
            <div className="form-group">
              <label htmlFor="email">Địa chỉ email:(*)</label>
              <input
                type="email"
                id="email"
                name="email"
                className="form-control"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Nhập địa chỉ email"
              />
            </div>
            <div className="form-group">
              <label htmlFor="phone">Số điện thoại:(*)</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                className="form-control"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Nhập số điện thoại"
              />
            </div>
            <button type="submit" className="btn btn-primary">
              Gửi ý kiến
            </button>
          </form>
        </div>
      </Col>

      <Col md={6}>
        <Row style={{ marginRight: "50px", marginTop: "20px" }}>
          <hr className="hr"></hr>
          <p className="information-contact">THÔNG TIN LIÊN LẠC</p>
          <p>
            Tìm siêu thị H-Tech Store? Xin mời ghé thăm trang{" "}
            <a href="/productuser" style={{ textDecoration: "none", fontWeight: "bold" }}>
              Tìm siêu thị
            </a>{" "}
            để xem bản đồ và địa chỉ các siêu thị trên toàn quốc.
          </p>
          <hr className="hr"></hr>
          <p>
            Báo chí, hợp tác: liên hệ <span style={{ color: "blue", fontWeight: "bold" }}>ccoolls147@gmail.com || (Nguyễn Đức Huy)</span>
          </p>
          <p>
            Tổng đài tư vấn, hỗ trợ khách hàng (7:30 - 23:00): <span style={{ color: "#f60", fontWeight: "bold" }}>0902 345 678</span>
          </p>
          <p>
            Tổng đài khiếu nại (8:00 - 22:30): <span style={{ color: "#f60", fontWeight: "bold" }}>1900.3103</span>
          </p>
          <p>
            Email: <span style={{ color: "blue", fontWeight: "bold" }}>huyndhe176876@fpt.edu.vn</span>
          </p>
          <Row className="end-answerquestion">
            <Col md={4}>
              <p className="title2-end-answerquestion">CỬA HÀNG THIẾT BỊ ĐIỆN TỬ H-TECH STORE</p>
              <hr></hr>
              <p>Tòa nhà Delta, Đại Học FPT cơ sở Hà Nội, Khu Công Nghệ Cao Láng Hòa Lạc, KM 29, Đại lộ Thăng Long, Thủ Đô Hà Nội, Việt Nam</p>
              <p>Địa chỉ đăng ký Kinh Doanh: Thôn 2, Thạch Hòa, Thạch Thất, Hà Nội, Việt Nam</p>
              <p>
                Điện thoại: <span style={{ color: "#f60", fontWeight: "bold" }}>0912 202 885</span>
              </p>
              <p>
                Fax: <span style={{ color: "#f60", fontWeight: "bold" }}>0123 456 789</span>
              </p>
            </Col>
            <Col md={6}>
              <iframe
                title="FPT University Map"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3724.8766880580335!2d105.5179713!3d21.012069099999998!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3135abc60e7d3f19%3A0x2be9d7d0b5abcbf4!2sFPT%20University!5e0!3m2!1sen!2s!4v1623391714133!5m2!1sen!2s"
                width="453.5"
                height="520"
                style={{
                  border: "0px",
                  marginTop: "3px",
                  borderRadius: "10px",
                }}
                allowFullScreen=""
                loading="lazy"
              ></iframe>
            </Col>
          </Row>
        </Row>
      </Col>
    </Row>
  );
};

export default AnswerQuestion;
