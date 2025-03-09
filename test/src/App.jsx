import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./components/home/Home"
import Register from "./components/register/Register"
import Users from "./components/users/Users"
import Product from "./components/product/Product"
import Productdetail from "./components/productdetail/Productdetail"
import Editproduct from "./components/productdetail/EditProduct"
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/users/:id" element={<Users />} />
        <Route path="/product" element={<Product />} />
        <Route path="/productdetail" element={<Productdetail />} />
        <Route path="/editproduct/:pid" element={<Editproduct />} />

      </Routes>
    </Router>
  );
}

export default App;