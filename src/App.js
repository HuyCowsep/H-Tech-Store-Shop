import "bootstrap/dist/css/bootstrap.min.css";
import "./components/css/Style.css";
import "react-toastify/dist/ReactToastify.css";
import React, { useState, useEffect } from "react";
import AccessDenied from "./components/AccessDenied";
import AnswerQuestion from "./hooks/AnswerQuestion";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import CreateProduct from "./components/CreateProduct";
import ChangePassword from "./components/ChangePassword";
import Cart from "./components/Cart";
import EditProduct from "./components/EditProduct";
import Footer from "./components/Footer";
import Header from "./components/Header";
import Login from "./components/Login";
import OrderTracking from "./components/OrderTracking";
import OrderManagement from "./components/OrderManagement";
import ProductAdmin from "./components/ProductAdmin";
import ProductDetail from "./components/ProductDetail";
import ProductUser from "./components/ProductUser";
import Register from "./components/Register";
import StoreRules from "./hooks/StoreRules";
import { ThemeProvider } from "./components/ThemeProvider";
import { Term } from "./hooks/Term";
import { ToastContainer } from "react-toastify";
import UserManagement from "./components/UsersManagerAdmin";
import VerifyOrder from "./components/VerifyOrder";
import ViewProfile from "./components/ViewProfile";

function App() {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [isLogin, setIsLogin] = useState(false);

  useEffect(() => {
    let accounts = JSON.parse(localStorage.getItem("accounts"));
    if (accounts) {
      setIsLogin(true);
    }
  }, []);

  useEffect(() => {
    fetch("http://localhost:9999/products")
      .then((res) => res.json())
      .then((result) => setProducts(result));
  }, []);

  useEffect(() => {
    fetch("http://localhost:9999/categories")
      .then((res) => res.json())
      .then((result) => setCategories(result));
  }, []);

  return (
    <ThemeProvider>
      <div style={{ overflow: "hidden" }}>
        <BrowserRouter>
          <Routes>
            <Route
              path="/auth/register"
              element={
                <>
                  {" "}
                  <Header /> <Register />
                </>
              }
            />
            <Route path="/auth/login" element={<Login isLogin={isLogin} setIsLogin={setIsLogin} />} />
            <Route
              path="/view-profile"
              element={
                <>
                  <Header isLogin={isLogin} setIsLogin={setIsLogin} />
                  <ViewProfile isLogin={isLogin} />
                </>
              }
            />
            <Route
              path="/change-password"
              element={
                <>
                  <Header isLogin={isLogin} setIsLogin={setIsLogin} />
                  <ChangePassword />
                </>
              }
            />
            <Route
              path="/"
              element={
                <>
                  <Header isLogin={isLogin} setIsLogin={setIsLogin} />

                  <ProductUser products={products} isLogin={isLogin} setIsLogin={setIsLogin} />

                  <Footer />
                </>
              }
            />
            <Route
              path="/productadmin"
              element={
                <>
                  <Header isLogin={isLogin} setIsLogin={setIsLogin} />
                  <ProductAdmin />
                  <Footer />{" "}
                </>
              }
            />
            <Route
              path="/product/category/:categoryID"
              element={
                <>
                  <Header isLogin={isLogin} setIsLogin={setIsLogin} /> <ProductAdmin /> <Footer />
                </>
              }
            />
            <Route
              path="/product/create"
              element={
                <>
                  <Header isLogin={isLogin} setIsLogin={setIsLogin} />
                  <CreateProduct categories={categories} />
                </>
              }
            />
            <Route
              path="/product/:id/detail"
              element={
                <>
                  <Header isLogin={isLogin} setIsLogin={setIsLogin} />
                  <ProductDetail isLogin={isLogin} setIsLogin={setIsLogin} />
                </>
              }
            />
            <Route
              path="/product/edit/:id"
              element={
                <>
                  <Header isLogin={isLogin} setIsLogin={setIsLogin} />
                  <EditProduct categories={categories} />
                </>
              }
            />
            <Route
              path="/product/ordermanagement"
              element={
                <>
                  <Header isLogin={isLogin} setIsLogin={setIsLogin} />
                  <OrderManagement />
                </>
              }
            />
            <Route
              path="/productuser"
              element={
                <>
                  <Header isLogin={isLogin} setIsLogin={setIsLogin} />
                  <ProductUser products={products} isLogin={isLogin} setIsLogin={setIsLogin} />

                  <Footer />
                </>
              }
            />
            {/* Trang Error 403 */}
            <Route path="/accessdenied" element={<AccessDenied />} />
            {/* Giỏ hàng */}
            <Route
              path="/cart"
              element={
                <>
                  <Header isLogin={isLogin} setIsLogin={setIsLogin} /> <Cart isLogin={isLogin} setIsLogin={setIsLogin} />{" "}
                </>
              }
            />
            <Route
              path="/verifyorder"
              element={
                <>
                  <Header isLogin={isLogin} setIsLogin={setIsLogin} />
                  <VerifyOrder />{" "}
                </>
              }
            />
            <Route
              path="/order-tracking"
              element={
                <>
                  <Header isLogin={isLogin} setIsLogin={setIsLogin} />
                  <OrderTracking />
                </>
              }
            />
            <Route
              path="/terms"
              element={
                <>
                  <Header isLogin={isLogin} setIsLogin={setIsLogin} />
                  <Term />
                </>
              }
            />
            <Route
              path="/rules"
              element={
                <>
                  <Header isLogin={isLogin} setIsLogin={setIsLogin} />
                  <StoreRules />
                </>
              }
            />
            <Route
              path="/answerquestion"
              element={
                <>
                  <Header isLogin={isLogin} setIsLogin={setIsLogin} />
                  <AnswerQuestion />
                  <Footer />
                </>
              }
            />
            <Route
              path="/User/productUser"
              element={
                <>
                  <Header isLogin={isLogin} setIsLogin={setIsLogin} />
                  <UserManagement />
                </>
              }
            />
          </Routes>
          <ToastContainer />
        </BrowserRouter>
      </div>
    </ThemeProvider>
  );
}

export default App;
