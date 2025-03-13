import React, { useEffect, useState } from "react";
import "../Css/Products.css";
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { getProducts, deleteProduct, addProduct } from "../api/Productsapi";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [productId, setProductId] = useState('');
  const [show, setShow] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false); // New Add Product Modal State
  const [formData, setFormData] = useState({
    productName: "",
    mrp: "",
    price: "",
  });
  const [newProductData, setNewProductData] = useState({ // New Product Form Data
    productID: "",
    productName: "",
    price: ""
  });

  useEffect(() => {
    getProducts()
      .then((data) => setProducts(data))
      .catch((error) => console.error("Error fetching products:", error));
  }, []);

  const handleEditProduct = (productId) => {
    const selectedProduct = products.find((product) => product.productID === productId);
    setProductId(productId);
    setFormData({
      productName: selectedProduct.productName,
      mrp: selectedProduct.price,  // Assuming price is treated as MRP
      price: selectedProduct.price,
    });
    setShow(true);
  };

  const handleDeleteProduct = async (productId) => {
    await deleteProduct(productId);
    setProducts(products.filter((product) => product.productID !== productId));
  };

  const handleClose = () => setShow(false);
  const handleCloseAddModal = () => setShowAddModal(false);

  const handleEditSubmit = async () => {
    const updatedProduct = { ...formData, productID: productId };
    await addProduct(updatedProduct); // Assuming `addProduct` is your update method.
    const updatedProducts = products.map((product) =>
      product.productID === productId ? updatedProduct : product
    );
    setProducts(updatedProducts);
    setShow(false);
  };

  const handleAddSubmit = async () => {
    try {
      console.log("Adding new product with data:", newProductData); // Add logging
      await addProduct(newProductData);
      setProducts([...products, newProductData]);
      setShowAddModal(false);
    } catch (error) {
      console.error("Error adding product:", error.message);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleNewProductChange = (e) => {
    setNewProductData({ ...newProductData, [e.target.name]: e.target.value });
  };

  return (
    <div className="products-container">
      <h2>Product List</h2>
      <Button variant="primary" onClick={() => setShowAddModal(true)}>Add Product</Button>
      <table className="products-table">
        <thead>
          <tr>
            <th>Product ID</th>
            <th>Name</th>
            <th>MRP</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.length > 0 ? (
            products.map((product) => (
              <tr key={product.productID}>
                <td>{product.productID}</td>
                <td>{product.productName}</td>
                <td>Rs. {product.price}</td>
                <td>
                  <DropdownButton id="dropdown-basic-button" title="Actions">
                    <Dropdown.Item onClick={() => handleEditProduct(product.productID)}>
                      Edit
                    </Dropdown.Item>
                    <Dropdown.Item onClick={() => handleDeleteProduct(product.productID)}>
                      Delete
                    </Dropdown.Item>
                  </DropdownButton>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4">No products found</td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Edit Product Modal */}
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Product Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form className="form">
            <input
              type="text"
              name="productName"
              placeholder="Product Name"
              value={formData.productName}
              onChange={handleChange}
              required
            />
            <input
              type="number"
              name="mrp"
              placeholder="MRP"
              value={formData.mrp}
              onChange={handleChange}
              required
            />
            <input
              type="number"
              name="price"
              placeholder="Price"
              value={formData.price}
              onChange={handleChange}
              required
            />
          </form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>Cancel</Button>
          <Button variant="primary" onClick={handleEditSubmit}>Update Changes</Button>
        </Modal.Footer>
      </Modal>

      {/* Add Product Modal */}
      <Modal show={showAddModal} onHide={handleCloseAddModal}>
        <Modal.Header closeButton>
          <Modal.Title>Add New Product</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form className="form">
            <input
              type="text"
              name="productID"
              placeholder="Product ID"
              value={newProductData.productID}
              onChange={handleNewProductChange}
              required
            />
            <input
              type="text"
              name="productName"
              placeholder="Product Name"
              value={newProductData.productName}
              onChange={handleNewProductChange}
              required
            />
            <input
              type="number"
              name="price"
              placeholder="Price"
              value={newProductData.price}
              onChange={handleNewProductChange}
              required
            />
          </form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseAddModal}>Cancel</Button>
          <Button variant="primary" onClick={handleAddSubmit}>Add Product</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Products;