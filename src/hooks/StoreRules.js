import React from "react";
import { Row, Col, Container } from "react-bootstrap";

const StoreRules = () => {
  return (
    <Container>
      <div className="rules-div">
        <div style={{ marginLeft: "20px", marginBottom: "20px", marginTop: "8px" }}>
          <a
            href="/productuser"
            style={{ textDecoration: "none" }}
            onMouseEnter={(e) => (e.target.style.color = "red")}
            onMouseLeave={(e) => (e.target.style.color = "blue")}
          >
            Trang chủ
          </a>{" "}
          &gt; <span>Nội Quy</span>
        </div>
        <Row style={{ fontWeight: "bold", marginTop: "30px" }}>
          <Col md={6} className="text-center">
            <Row>
              <p>Cửa Hàng Điện Tử H-Tech Store</p>
              <p>FPT University, KM29 Khu CNC Hòa Lạc</p>
            </Row>
          </Col>
          <Col md={6} className="text-center">
            <Row>
              <p>CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</p>
              <p>Độc lập - Tự do - Hạnh Phúc</p>
              <p>Hà Nội, ngày 11 tháng 4 năm 2024</p>
            </Row>
          </Col>
        </Row>

        <Row
          style={{
            textAlign: "center",
            fontWeight: "bold",
            fontSize: "50px",
            margin: "30px",
          }}
        >
          <p>NỘI QUY CỬA HÀNG</p>
        </Row>
        <p style={{ textAlign: "center", fontWeight: "bold" }}>(Áp dụng từ ngày 11 tháng 4 năm 2024)</p>

        <hr></hr>

        <Row style={{ marginLeft: "10px" }}>
          <h3>ĐIỀU 1: THỜI GIAN HOẠT ĐỘNG CỬA HÀNG</h3>
          <p>Cửa hàng hoạt động từ 8h đến 22h hàng ngày. Tết và các ngày khác sẽ có thông báo riêng.</p>
          <h3>ĐIỀU 2: QUY ĐỊNH HÀNG HOÁ, DỊCH VỤ KINH DOANH TẠI CỬA HÀNG</h3>
          <ul style={{ textDecoration: "none" }}>
            <li>
              Hàng hóa, dịch vụ kinh doanh tại cửa hàng phải phù hợp với các mặt hàng đã đăng ký trong giấy chứng nhận đăng ký kinh doanh và không
              thuộc danh mục pháp luật cấm kinh doanh.
            </li>
            <li>Không kinh doanh hàng nhái, hàng lậu, hàng giả, hàng không rõ nguồn gốc.</li>
            <li>
              Hàng hóa có bảo hành thì giấy bảo hành phải ghi rõ thời gian bảo hành và địa điểm bảo hành. Tất cả hàng hóa dịch vụ kinh doanh tại cửa
              hàng phải có thương mại, giá bán phải niêm yết tại địa điểm kinh doanh bằng VNĐ.
            </li>
          </ul>
          <h3>ĐIỀU 3: QUY ĐỊNH VỀ NGƯỜI ĐẾN GIAO DỊCH MUA BÁN, THAM QUAN, THI HÀNH CÔNG VỤ TẠI CỬA HÀNG</h3>
          <ul>
            <li>
              Mọi người đến cửa hàng giao dịch mua bán, tham quan, thi hành công vụ phải chấp hành nghiêm chỉnh nội quy tại cửa hàng, các quy định
              pháp luật hiện hành và sự hướng dẫn của cán bộ nhân viên cửa hàng.
            </li>
            <li>
              CBNV cơ quan nhà nước vào cửa hàng để thi hành nhiệm vụ phải thông báo, xuất trình chứng minh nhân dân và các giấy tờ có liên quan đến
              việc thi hành nhiệm vụ với người có thẩm quyền ở cửa hàng.
            </li>
          </ul>
          <h3>ĐIỀU 4: QUY ĐỊNH ĐỐI VỚI CÁN BỘ NHÂN VIÊN CỬA HÀNG</h3>
          <ul>
            <li>
              Thực hiện đúng chức trách, nhiệm vụ được phân công, có tác phong đúng mực, thái độ hòa nhã, khiêm tốn khi giao tiếp và giải quyết công
              việc.
            </li>
            <li>
              Hướng dẫn tận tình cho mọi người trong cửa hàng hiểu rõ và chấp hành theo đúng quy định của cửa hàng và các quy định của nhà nước.
            </li>
            <li>Nghiêm cấm mọi biểu hiện tiêu cực, gian lận, gây cản trở khó khăn trong kinh doanh của cửa hàng.</li>
            <li>Nghiêm cấm uống rượu bia, sử dụng chất kích thích trong thời gian thực hiện nhiệm vụ.</li>
          </ul>
          <h3>ĐIỀU 5: QUY ĐỊNH VỀ ĐẢM BẢO AN TOÀN PHÒNG CHÁY CHỮA CHÁY (PCCC)</h3>
          <ul>
            <li>
              Mọi người nghiêm chỉnh thực hiện đúng quy định về PCCC, phòng chống cháy nổ, các hiệu lệnh, bảng chỉ dẫn thoát hiểm, bảng cấm theo quy
              định pháp luật PCCC được đặt treo nơi dễ thấy.
            </li>
            <li>Nghiêm cấm mua bán, tàng trữ, vận chuyển, sử dụng các chất, vật liệu, dụng cụ dễ cháy, nổ.</li>
            <li>Không đun nấu, thắp hương, đốt nến, vàng mã trong cửa hàng.</li>
            <li>Các hành vi vi phạm về quy định PCCC để xảy ra sự cố phải chịu trách nhiệm trước pháp luật.</li>
            <li>
              Bộ phận phụ trách về PCCC của cửa hàng có trách nhiệm đôn đốc, kiểm tra mọi người thực hiện tốt các quy định về PCCC. Khi có sự cố xảy
              ra phải bình tĩnh báo động và tìm cách báo ngay cho phòng cảnh sát PCCC TP.
            </li>
          </ul>
          <h3>ĐIỀU 6: QUY ĐỊNH VỀ ĐẢM BẢO AN NINH TRẬT TỰ TẠI CỬA HÀNG</h3>
          <ul>
            <li>Nghiêm cấm mọi hành vi gây rối trật tự trị an trong phạm vi cửa hàng.</li>
            <li>Nghiêm cấm tổ chức tham gia đánh đề, hụi, cá cược, bói toán mê tín. Không phổ biến các loại văn hóa phẩm đồi trụy, phản động.</li>
            <li>
              Người đang mắc bệnh truyền nhiễm nhưng không áp dụng các biện pháp phòng chống lây lan, người ăn xin, người đang say rượu bia, người
              đang mắc bệnh tâm thần không được phép vào cửa hàng.
            </li>
            <li>
              Lực lượng bảo vệ trong cửa hàng, trong ca trực có trách nhiệm đảm bảo an ninh, an toàn tài sản, hàng hóa tại cửa hàng, cuối ca trực có
              bàn giao báo cáo cụ thể tình hình ca trực.
            </li>
          </ul>
          <h3>ĐIỀU 7: QUY ĐỊNH VỀ VĂN MINH THƯƠNG MẠI</h3>
          <ul>
            <li>Thực hiện văn minh thương mại: ăn mặc gọn gàng, lịch sự, hòa nhã trong giao tiếp ứng xử với mọi người.</li>
            <li>Trung thực trong kinh doanh, thực hiện mua bán hàng hóa dịch vụ đúng giá niêm yết tại điểm kinh doanh.</li>
            <li>Hàng hóa được sắp xếp gọn gàng, ngăn nắp theo khu vực kinh doanh đảm bảo thẩm mỹ, thông thoáng và yêu cầu phòng chống cháy nổ.</li>
          </ul>
          <h3>ĐIỀU 8: QUY ĐỊNH VỀ XỬ LÝ VI PHẠM TẠI CỬA HÀNG</h3>
          <ul>
            <li>Vi phạm liên quan đến pháp luật, cửa hàng sẽ lập văn bản và chuyển cho cơ quan nhà nước có thẩm quyền xử lý.</li>
            <li>
              Vi phạm nội quy cửa hàng: Công ty sẽ có các hình thức phê bình, cảnh cáo, đình chỉ tạm thời, xử lý riêng đối với các cá nhân vi phạm là
              CBNV công ty.
            </li>
          </ul>
          <br></br>
          <Col md={6}></Col>
          <Col md={6}>
            <Row className="text-end" style={{ marginRight: "50px" }}>
              <p className="fw-bold fs-4">Đại diện theo pháp luật của thương nhân</p>
              <p style={{ color: "purple" }}>ĐÃ KÝ TÊN</p>
              <p style={{ color: "red" }}>Nguyễn Đức Huy</p>
            </Row>
          </Col>
        </Row>
      </div>
    </Container>
  );
};

export default StoreRules;
