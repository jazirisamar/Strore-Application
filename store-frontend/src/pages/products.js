import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getProducts, addProduct, deleteProduct } from "../services/productsService";
import { getCategories } from "../services/categoryService";
import "../css/product.css";

function ProductList() {

  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);

  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [image, setImage] = useState(null);

  const [filterCategory, setFilterCategory] = useState("");
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    loadProducts();
    loadCategories();
  }, []);

  const loadProducts = () => {
    getProducts().then(res => setProducts(res.data));
  };

  const loadCategories = () => {
    getCategories().then(res => setCategories(res.data));
  };

  const handleAddProduct = () => {
    if (!name || !price || !categoryId || !image) {
      alert("Please fill all fields");
      return;
    }

    const formData = new FormData();
    formData.append("name", name);
    formData.append("price", price);
    formData.append("categoryId", categoryId);
    formData.append("image", image);

    addProduct(formData).then(() => {
      loadProducts();
      setName("");
      setPrice("");
      setCategoryId("");
      setImage(null);
      setShowModal(false);
    });
  };

  const handleDelete = (id) => {
    deleteProduct(id).then(() => loadProducts());
  };

  const filteredProducts = filterCategory
    ? products.filter(p => p.category && p.category.id === Number(filterCategory))
    : products;

  return (
    <div className="container">

      {/* NAVBAR */}
      <nav className="navbar">
        <h1 className="logo">StoreApp</h1>
        <div className="nav-links">
          <button onClick={() => navigate("/")}>Home</button>
          <button onClick={() => navigate("/product")}>Products</button>
          <button onClick={() => navigate("/contact")}>Contact</button>

        </div>
      </nav>

     <div className="header">
  <div className="title-section">
    <h1 className="page-title">🛍️ Product Management</h1>
    <p className="page-subtitle">
      Manage your products, categories, and inventory easily
    </p>
  </div>
  <button className="add-btn" onClick={() => setShowModal(true)}>
    + Add Product
  </button>
</div>

      {/* FILTER */}
      <div className="filter">
        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
        >
          <option value="">All Categories</option>
          {categories.map(c => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>

        <button className="reset" onClick={() => setFilterCategory("") }>
          Reset
        </button>
      </div>

      {/* MODAL */}
      {showModal && (
        <div className="modalOverlay">
          <div className="modal">
            <h2>Add Product</h2>

            <input
              placeholder="Product name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />

            <input
              placeholder="Price"
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />

            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
            >
              <option value="">Category</option>
              {categories.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>

            <input
              type="file"
              accept="image/*"
              onChange={(e) => setImage(e.target.files[0])}
            />

            <div className="modalButtons">
              <button className="save" onClick={handleAddProduct}>Save</button>
              <button className="cancel" onClick={() => setShowModal(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* LIST */}
      <div className="list">
        {filteredProducts.length === 0 && (
          <p className="empty">No products available</p>
        )}

        {filteredProducts.map(p => (
          <div className="card" key={p.id}>

            {p.imageUrl && (
              <img src={p.imageUrl} alt={p.name} className="productImage" />
            )}

            <div className="card-body">
              <h3>{p.name}</h3>
              <p className="price">{p.price} DT</p>
              {p.category && (
                <span className="category">{p.category.name}</span>
              )}
            </div>

            <button className="delete" onClick={() => handleDelete(p.id)}>
              Delete
            </button>

          </div>
        ))}
      </div>

    </div>
  );
}

export default ProductList;