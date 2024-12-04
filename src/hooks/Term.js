import React from "react";
import "./css/Hooks.css";
import { Container } from "react-bootstrap";

export const Term = () => {
  return (
    <Container>
      <div className="term-div">
        <div style={{ marginLeft: "20px", marginBottom: "20px", marginTop: "8px" }}>
          <a
            href="/productuser"
            style={{ textDecoration: "none" }}
            onMouseEnter={(e) => (e.target.style.color = "red")}
            onMouseLeave={(e) => (e.target.style.color = "blue")}
          >
            Trang chủ
          </a>{" "}
          &gt; <span>Các điều khoản</span>
        </div>
        <h2
          style={{
            textAlign: "center",
            fontWeight: "bold",
            fontSize: "2.5rem",
            marginTop: "20px",
          }}
        >
          Điều khoản và Điều kiện sử dụng dịch vụ
        </h2>
        <p style={{ fontWeight: "bold" }}>1. Chấp Nhận Điều Khoản</p>
        <p1>
          <li style={{ marginLeft: "40px" }}>
            Bằng việc đặt hàng trên trang web của chúng tôi, quý khách xác nhận rằng đã đọc, hiểu và đồng ý tuân thủ các điều khoản và điều kiện này.
          </li>
        </p1>
        <p style={{ fontWeight: "bold" }}>2. Thông Tin Sản Phẩm</p>
        <p2>
          <li style={{ marginLeft: "40px" }}>
            Chúng tôi cam kết cung cấp thông tin sản phẩm chính xác và đầy đủ. Tuy nhiên, chúng tôi không đảm bảo rằng mô tả sản phẩm hoặc các nội
            dung khác trên trang web là hoàn toàn chính xác, đầy đủ, đáng tin cậy, hiện thời, hoặc không có lỗi.
          </li>
        </p2>
        <p style={{ fontWeight: "bold" }}>3. Giá Cả và Thanh Toán</p>
        <p3>
          <li style={{ marginLeft: "40px" }}>
            Tất cả giá cả được niêm yết trên trang web của chúng tôi có thể thay đổi mà không cần thông báo trước. Giá của sản phẩm không bao gồm phí
            vận chuyển. Phí vận chuyển sẽ được tính thêm vào đơn hàng và hiển thị tại thời điểm thanh toán.
          </li>
        </p3>
        <p3>
          <li style={{ marginLeft: "40px" }}>
            Chúng tôi chấp nhận các phương thức thanh toán bao gồm thẻ tín dụng, chuyển khoản ngân hàng và các hình thức thanh toán trực tuyến khác.
          </li>
        </p3>
        <p style={{ fontWeight: "bold" }}>4. Vận Chuyển và Giao Hàng</p>
        <p4>
          <li style={{ marginLeft: "40px" }}>
            Chúng tôi sẽ cố gắng giao hàng trong khoảng thời gian ước tính được nêu ra trên trang web. Tuy nhiên, chúng tôi không chịu trách nhiệm cho
            bất kỳ sự chậm trễ nào trong quá trình giao hàng do các lý do ngoài tầm kiểm soát của chúng tôi.
          </li>
        </p4>
        <p style={{ fontWeight: "bold" }}>5. Đổi Trả và Hoàn Tiền</p>
        <p5>
          <li style={{ marginLeft: "40px" }}>
            Chúng tôi chấp nhận đổi trả sản phẩm trong vòng 7 ngày kể từ ngày nhận hàng đối với các sản phẩm còn nguyên tem, nhãn và chưa qua sử dụng.
            Để yêu cầu đổi trả, quý khách vui lòng liên hệ với bộ phận chăm sóc khách hàng của chúng tôi.
          </li>
        </p5>
        <p style={{ fontWeight: "bold" }}>6. Bảo Mật Thông Tin Khách Hàng</p>
        <p6>
          <li style={{ marginLeft: "40px" }}>
            Chúng tôi cam kết bảo mật thông tin cá nhân của quý khách. Thông tin của quý khách sẽ chỉ được sử dụng cho mục đích xử lý đơn hàng và cung
            cấp dịch vụ tốt nhất cho quý khách.
          </li>
        </p6>
        <p style={{ fontWeight: "bold" }}>7. Điều Khoản Sử Dụng Khác</p>
        <p7>
          <li style={{ marginLeft: "40px" }}>
            {" "}
            Chúng tôi có quyền thay đổi, chỉnh sửa, bổ sung hoặc loại bỏ bất kỳ phần nào trong Điều khoản và Điều kiện này vào bất kỳ lúc nào. Các
            thay đổi sẽ có hiệu lực ngay khi được đăng tải trên trang web mà không cần thông báo trước.
          </li>
        </p7>
        <br></br>
        <hr></hr>
        <p style={{ color: "purple" }}>
          Nếu quý khách có bất kỳ câu hỏi nào về các điều khoản và điều kiện này, vui lòng liên hệ với chúng tôi qua Email hoặc số điện thoại hỗ trợ
          khách hàng.
        </p>
        <p style={{ color: "purple", fontWeight: "bold" }}>* Email: huyndhe176876@fpt.edu.vn </p>
        <p style={{ color: "purple", fontWeight: "bold" }}>* Điện thoại: 0123 456 789</p>
      </div>
    </Container>
  );
};
