// src/hooks/ReportProduct.js
import React, { useState } from "react";

const reasons = [
  "Sản phẩm bị cấm buôn bán (động vật hoang dã, 18+,...)",
  "Sản phẩm có dấu hiệu lừa đảo",
  "Hàng giả, hàng nhái",
  "Sản phẩm không rõ nguồn gốc, xuất xứ",
  "Hình ảnh sản phẩm không rõ ràng",
  "Sản phẩm có hình ảnh, nội dung phản cảm",
  "Tên sản phẩm không phù hợp với hình ảnh sản phẩm",
  "Sản phẩm có dấu hiệu tăng đơn ảo",
  "Shop đề cập đến việc thực hiện giao dịch bên ngoài nền tảng Shopee",
  "Lý do khác",
];

const ReportProduct = () => {
  const [selectedReason, setSelectedReason] = useState(null);
  const [additionalInfo, setAdditionalInfo] = useState("");
  const [error, setError] = useState("");

  const handleReasonClick = (reason) => {
    setSelectedReason(reason);
    setError("");
  };

  const handleSubmit = () => {
    if (!additionalInfo.trim()) {
      setError("Không được để trống mô tả, vui lòng nhập lại");
      return;
    }
    console.log("Selected reason:", selectedReason);
    console.log("Additional info:", additionalInfo);
    setSelectedReason(null);
    setAdditionalInfo("");
    setError("");
  };

  return (
    <div className="report-product-modal">
      {!selectedReason ? (
        <div>
          <h1>Chọn lý do</h1>
          <hr />
          <ul className="wrap fadescaled-enter-done">
            {reasons.map((reason, index) => (
              <li key={index} onClick={() => handleReasonClick(reason)}>
                {reason}
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <div>
          <h3>Lý do: {selectedReason}</h3>
          <textarea
            value={additionalInfo}
            onChange={(e) => setAdditionalInfo(e.target.value)}
            placeholder="Mô tả tố cáo. (Vui lòng nhập từ 10-50 kí tự)"
          />
          {error && <p style={{ color: "red" }}>{error}</p>}
          <button onClick={handleSubmit}>Gửi</button>
          <button onClick={() => setSelectedReason(null)}>Quay lại</button>
        </div>
      )}
    </div>
  );
};

export default ReportProduct;
