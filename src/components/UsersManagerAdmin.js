import { Container, Row, Col, Form, Button, Table, Spinner, Modal } from "react-bootstrap";
import { useState, useEffect } from "react";
import { Link, Navigate } from "react-router-dom";

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [isAdmin, setIsAdmin] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalContent, setModalContent] = useState({});
  const [error, setError] = useState(null);

  // Check role từ "accounts" trong localStorage
  useEffect(() => {
    const loggedInAccount = JSON.parse(localStorage.getItem("accounts"));
    if (loggedInAccount && loggedInAccount.role === "admin") {
      setIsAdmin(true);
    } else {
      setIsAdmin(false);
    }
  }, []);

  // Fetch danh sách mảng accounts
  useEffect(() => {
    setLoading(true);
    fetch("http://localhost:9999/accounts")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch user data");
        return res.json();
      })
      .then((result) => setUsers(result))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  // Hàm xử lý trạng thái hoạt động của từng tài khoản
  const handleToggleActive = (userId, currentStatus) => {
    setLoading(true);
    fetch(`http://localhost:9999/accounts/${userId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ isActive: !currentStatus }),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to update status");
        return res.json();
      })
      .then(() => {
        setUsers(users.map((user) => (user.id === userId ? { ...user, isActive: !currentStatus } : user)));
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  };

  // Hàm xử lý thay đổi Role của từng tài khoản
  const handleRoleChange = (userId, newRole) => {
    setLoading(true);
    fetch(`http://localhost:9999/accounts/${userId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ role: newRole }),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to update role");
        return res.json();
      })
      .then(() => {
        setUsers(users.map((user) => (user.id === userId ? { ...user, role: newRole } : user)));
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  };

  const handleRemoveAccount = async (accountId) => {
    try {
      // Gửi yêu cầu xóa tài khoản từ API
      const response = await fetch(`http://localhost:9999/accounts/${accountId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Không thể xóa tài khoản.");
      }
      setUsers((prevUsers) => prevUsers.filter((user) => user.id !== accountId));
    } catch (error) {
      console.error("Lỗi khi xóa tài khoản:", error);
      alert("Có lỗi xảy ra khi xóa tài khoản. Vui lòng thử lại sau.");
    }
  };

  //Phân quyền các role User k đc vào các trang của admin
  const accounts = JSON.parse(localStorage.getItem("accounts")); // Lấy danh sách tài khoản từ localStorage
  const currentAccount = accounts?.find((account) => account.role === "admin" && account.isActive === true);
  if (!currentAccount) {
    return <Navigate to="/accessdenied" />;
  }

  // Handle modal confirmation
  const handleShowModal = (content) => {
    setModalContent(content);
    setShowModal(true);
  };

  const handleModalAction = () => {
    modalContent.action();
    setShowModal(false);
  };

  return (
    <Container>
      <Row className="mt-4">
        <div style={{ marginLeft: "20px", marginBottom: "20px", marginTop: "8px" }}>
          <a
            href="/productadmin"
            style={{ textDecoration: "none" }}
            onMouseEnter={(e) => (e.target.style.color = "red")}
            onMouseLeave={(e) => (e.target.style.color = "blue")}
          >
            Administrator
          </a>{" "}
          &gt; <strong>Quản lý tài khoản</strong>
        </div>
        {/* Sidebar */}
        <Col
          xs={12}
          sm={3}
          md={2}
          className="categories-container"
          style={{ backgroundColor: "#f8f9fa", padding: "15px", borderRadius: "8px", boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)", marginBottom: "20px" }}
        >
          <div>
            <h3
              style={{
                textAlign: "center",
                borderRadius: "10px",
                padding: "2px",
                backgroundColor: "grey",
                color: "white",
                marginBottom: "50px",
                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.5)",
              }}
            >
              Quản Trị Viên
            </h3>
            <Button variant="success" as={Link} to={"/productuser"} style={{ display: "block", width: "100%", marginTop: "10px" }}>
              Giao Diện Của Khách
            </Button>
            <Button variant="warning" as={Link} to={"/product/ordermanagement"} style={{ display: "block", width: "100%", marginTop: "10px" }}>
              Quản lý đơn hàng
            </Button>
            <Button variant="info" as={Link} to="/User/productUser" style={{ display: "block", width: "100%", marginTop: "10px" }}>
              Quản lý tài khoản
            </Button>
            <Button variant="dark" as={Link} to="/productadmin" style={{ display: "block", width: "100%", marginTop: "10px" }}>
              Quản lý sản phẩm
            </Button>
          </div>
        </Col>

        {/* User List */}
        <Col xs={12} sm={9} md={10}>
          <h3 style={{ textAlign: "center", fontWeight: "bold", fontSize: "32px" }}>Danh sách các tài khoản</h3>
          {loading && <Spinner animation="border" />}
          {error && <div className="text-danger mb-3">Error: {error}</div>}
          <Table hover striped bordered>
            <thead>
              <tr>
                <th>ID</th>
                <th>Tên người dùng</th>
                <th>Email</th>
                <th>Vai trò</th>
                <th>Trạng thái</th>
                <th colSpan={2}>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <td>{user.id}</td>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>
                    <Form.Select
                      value={user.role}
                      onChange={(e) =>
                        handleShowModal({
                          title: "Xác nhận thay đổi vai trò",
                          message: `Bạn có chắc muốn thay đổi vai trò của ${user.name}?`,
                          action: () => handleRoleChange(user.id, e.target.value),
                        })
                      }
                    >
                      <option value="admin">Admin</option>
                      <option value="user">User</option>
                    </Form.Select>
                  </td>
                  <td>
                    <Form.Check
                      type="switch"
                      id={`switch-${user.id}`}
                      checked={user.isActive}
                      onChange={() =>
                        handleShowModal({
                          title: "Xác nhận thay đổi trạng thái",
                          message: `Bạn có chắc muốn thay đổi trạng thái của ${user.name}?`,
                          action: () => handleToggleActive(user.id, user.isActive),
                        })
                      }
                      label={user.isActive ? "Hoạt động" : "Vô hiệu"}
                    />
                  </td>
                  <td>
                    <Button
                      variant={user.isActive ? "danger" : "success"}
                      onClick={() =>
                        handleShowModal({
                          title: user.isActive ? "Vô hiệu hóa tài khoản" : "Kích hoạt tài khoản",
                          message: `Bạn có chắc muốn ${user.isActive ? "vô hiệu hóa" : "kích hoạt"} tài khoản của ${user.name}?`,
                          action: () => handleToggleActive(user.id, user.isActive),
                        })
                      }
                    >
                      {user.isActive ? "Vô hiệu hóa" : "Kích hoạt"}
                    </Button>
                  </td>
                  <td>
                    <Button
                      variant="warning"
                      onClick={() =>
                        handleShowModal({
                          title: "Xoá vĩnh viễn tài khoản khỏi danh sách",
                          message: `Bạn có chắc muốn xoá vĩnh viễn tài khoản của "${user.name}" ?`,
                          action: () => handleRemoveAccount(user.id),
                        })
                      }
                    >
                      Xoá
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Col>
      </Row>

      {/* Confirmation Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{modalContent.title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>{modalContent.message}</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Hủy
          </Button>
          <Button variant="primary" onClick={handleModalAction}>
            Xác nhận
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}
