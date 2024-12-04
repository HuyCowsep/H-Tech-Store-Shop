import { useState, useEffect } from "react";
import { Table, Button, Spinner, Modal } from "react-bootstrap";

const OrderManagement = () => {
  const [loggedOrders, setLoggedOrders] = useState([]);
  const [noLoginOrders, setNoLoginOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCompletedOrders, setShowCompletedOrders] = useState(false);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const [loggedResponse, noLoginResponse] = await Promise.all([
          fetch("http://localhost:9999/orderDetailsLogged"),
          fetch("http://localhost:9999/orderDetailsNoLogin"),
        ]);
        const loggedOrders = await loggedResponse.json();
        const noLoginOrders = await noLoginResponse.json();
        setLoggedOrders(loggedOrders);
        setNoLoginOrders(noLoginOrders);
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setLoading(false); // Dừng loading sau khi tải xong
      }
    };
    fetchOrders();
  }, []);

  const handleApproveOrder = (orderId, isNoLogin) => {
    const endpoint = isNoLogin ? `http://localhost:9999/orderDetailsNoLogin` : `http://localhost:9999/orderDetailsLogged`;
    const confirmApprove = window.confirm(`Bạn có chắc chắn muốn DUYỆT đơn hàng "${orderId}?"`);
    if (!confirmApprove) return;
    fetch(`${endpoint}/${orderId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "Approved" }),
    })
      .then((response) => {
        if (response.ok) {
          if (isNoLogin) {
            setNoLoginOrders((prev) => prev.map((order) => (order.id === orderId ? { ...order, status: "Approved" } : order)));
          } else {
            setLoggedOrders((prev) => prev.map((order) => (order.id === orderId ? { ...order, status: "Approved" } : order)));
          }
        } else {
          throw new Error("Cập nhật trạng thái không thành công");
        }
      })
      .catch((error) => {
        console.error("Error approving order:", error);
        alert("Có lỗi khi duyệt đơn hàng. Hãy thử lại sau.");
      });
  };

  const handleRejectOrder = (orderId, isNoLogin) => {
    const endpoint = isNoLogin ? `http://localhost:9999/orderDetailsNoLogin` : `http://localhost:9999/orderDetailsLogged`;
    const confirmReject = window.confirm(`Bạn có chắc chắn muốn TỪ CHỐI đơn hàng "${orderId}?"`);
    if (!confirmReject) return;
    fetch(`${endpoint}/${orderId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "Rejected" }),
    })
      .then((response) => {
        if (response.ok) {
          if (isNoLogin) {
            setNoLoginOrders((prev) => prev.map((order) => (order.id === orderId ? { ...order, status: "Rejected" } : order)));
          } else {
            setLoggedOrders((prev) => prev.map((order) => (order.id === orderId ? { ...order, status: "Rejected" } : order)));
          }
        } else {
          throw new Error("Cập nhật trạng thái không thành công");
        }
      })
      .catch((error) => {
        console.error("Error rejecting order:", error);
        alert("Có lỗi khi từ chối đơn hàng. Hãy thử lại sau.");
      });
  };
  //Lọc các đơn đã có status là archived
  const archivedOrders = [...loggedOrders.filter((order) => order.status === "Archived"), ...noLoginOrders.filter((order) => order.status === "Archived")];
  //Hàm xử lý các đơn hàng đã lưu trữ, tức là đã vận chuyển thành công
  const handleArchiveOrder = (orderId, isNoLogin = false) => {
    const confirmArchive = window.confirm(`Bạn có chắc chắn muốn lưu trữ đơn hàng "${orderId}"?`);
    if (!confirmArchive) return;

    const url = isNoLogin ? `http://localhost:9999/orderDetailsNoLogin/${orderId}` : `http://localhost:9999/orderDetailsLogged/${orderId}`;
    fetch(url, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ status: "Archived" }),
    })
      .then((response) => {
        if (response.ok) {
          // Cập nhật trạng thái và loại bỏ đơn hàng đã lưu trữ khỏi danh sách
          if (isNoLogin) {
            setNoLoginOrders((prev) => prev.filter((order) => order.id !== orderId));
          } else {
            setLoggedOrders((prev) => prev.filter((order) => order.id !== orderId));
          }
        } else {
          throw new Error("Không thể lưu trữ đơn hàng");
        }
      })
      .catch((error) => {
        console.error("Error archiving order:", error);
        alert("Có lỗi khi lưu trữ đơn hàng. Hãy thử lại sau.");
      });
  };

  const handleShowCompletedOrders = () => setShowCompletedOrders(true);
  const handleCloseCompletedOrders = () => setShowCompletedOrders(false);

  const renderTable = (orders, isNoLogin = false) => (
    <Table striped bordered hover responsive>
      <thead>
        <tr style={{ textAlign: "center" }}>
          <th>Mã đơn</th>
          <th>Họ tên</th>
          <th>Địa chỉ nhận</th>
          <th>Điện thoại</th>
          <th>Email</th>
          <th>Sản phẩm đã đặt</th>
          <th>Tổng tiền</th>
          <th>Ngày Nhận</th>
          <th>Trạng thái</th>
          <th>Hành động</th>
        </tr>
      </thead>
      <tbody>
        {orders
          .filter((order) => order.status !== "Archived") // Lọc bỏ các đơn hàng đã lưu trữ
          .map((order) => (
            <tr key={order.id}>
              <td>{order.id}</td>
              <td>{isNoLogin ? `${order.customer.firstName} ${order.customer.lastName}` : order.fullName}</td>
              <td>{isNoLogin ? order.customer.address : order.address}</td>
              <td>{isNoLogin ? order.customer.phone : order.phone}</td>
              <td>{isNoLogin ? order.customer.email : order.email}</td>
              <td>
                {order.product
                  .map((item) => (
                    <>
                      {item.pName} (<span style={{ color: "red" }}>{item.pid}</span>)
                    </>
                  ))
                  .reduce((prev, curr) => [prev, ", ", curr])}
              </td>
              <td>{order.total}</td>
              <td>{new Date(order.reqDate || order.requestDate).toLocaleDateString("vi-VN")}</td>
              <td
                style={{
                  color: order.status === "Approved" ? "green" : order.status === "Ordered" ? "orange" : order.status === "Archived" ? "blue" : "red",
                }}
              >
                {order.status}
              </td>
              <td>
                {order.status === "Ordered" && (
                  <>
                    <Button variant="success" onClick={() => handleApproveOrder(order.id, isNoLogin)} className="mr-2">
                      Đồng ý
                    </Button>
                    <Button variant="danger" onClick={() => handleRejectOrder(order.id, isNoLogin)}>
                      Từ chối
                    </Button>
                  </>
                )}
                {order.status === "Approved" && (
                  <Button variant="warning" onClick={() => handleArchiveOrder(order.id, isNoLogin)}>
                    Lưu trữ
                  </Button>
                )}
              </td>
            </tr>
          ))}
      </tbody>
    </Table>
  );

  return (
    <div style={{ marginBottom: "50px" }}>
      <div style={{ marginLeft: "20px", marginBottom: "20px", marginTop: "8px" }}>
        <a
          href="/productadmin"
          style={{ textDecoration: "none" }}
          onMouseEnter={(e) => (e.target.style.color = "red")}
          onMouseLeave={(e) => (e.target.style.color = "blue")}
        >
          Administrator
        </a>{" "}
        &gt; <strong>Quản lý đơn hàng</strong>
      </div>
      <h1 style={{ textAlign: "center", fontWeight: "bold", margin: "20px" }}>Danh sách các đơn hàng</h1>
      <div style={{ textAlign: "center", marginBottom: "30px" }}>
        <Button variant="info" onClick={handleShowCompletedOrders}>
          Các đơn hàng đã hoàn thành
        </Button>
      </div>
      <div style={{ height: "4px", backgroundColor: "orange", marginBottom: "20px" }} />
      {loading ? (
        <Spinner animation="border" variant="primary" />
      ) : (
        <>
          <h3 style={{ color: "blue", textAlign: "center", marginTop: "30px" }}>Người dùng đã đăng nhập</h3>
          {renderTable(loggedOrders)}

          <h3 style={{ color: "red", marginTop: "30px", textAlign: "center" }}>Người dùng không đăng nhập</h3>
          {renderTable(noLoginOrders, true)}
        </>
      )}

      {/* Modal cho các đơn hàng đã hoàn thành */}
      <Modal show={showCompletedOrders} onHide={handleCloseCompletedOrders} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title style={{ color: "blue" }}>Các đơn hàng đã hoàn thành và được lưu trữ</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {archivedOrders.length === 0 ? (
            <p style={{ textAlign: "center" }}>Chưa có đơn hàng nào được lưu trữ.</p>
          ) : (
            <Table striped bordered hover responsive>
              <thead>
                <tr>
                  <th>Mã đơn</th>
                  <th>Họ tên</th>
                  <th>Địa chỉ nhận</th>
                  <th>Điện thoại</th>
                  <th>Email</th>
                  <th>Sản phẩm đã đặt</th>
                  <th>Tổng tiền</th>
                  <th>Ngày nhận</th>
                </tr>
              </thead>
              <tbody>
                {archivedOrders.map((order) => (
                  <tr key={order.id}>
                    <td>{order.id}</td>
                    <td>{order.customer ? `${order.customer.firstName} ${order.customer.lastName}` : order.fullName}</td>
                    <td>{order.customer ? order.customer.address : order.address}</td>
                    <td>{order.customer ? order.customer.phone : order.phone}</td>
                    <td>{order.customer ? order.customer.email : order.email}</td>
                    <td>
                      {order.product
                        .map((item) => (
                          <>
                            {item.pName} (<span style={{ color: "red" }}>{item.pid}</span>)
                          </>
                        ))
                        .reduce((prev, curr) => [prev, ", ", curr])}
                    </td>
                    <td>{order.total}</td>
                    <td>{new Date(order.reqDate || order.requestDate).toLocaleDateString("vi-VN")}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseCompletedOrders}>
            Đóng
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default OrderManagement;
