import React, { useEffect, useState } from "react";
import { Table, Button, Modal, Form, Input, Space, Dropdown, Menu } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { getProducts, deleteProduct, addProduct } from "../api/Productsapi";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [productId, setProductId] = useState('');
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [formData, setFormData] = useState({
    productName: "",
    makingPrice: "",
  });
  const [newProductData, setNewProductData] = useState({
    productID: "",
    productName: "",
    makingPrice: "",
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
      makingPrice: selectedProduct.makingPrice,
    });
    setShowEditModal(true);
  };

  const handleDeleteProduct = async (productId) => {
    await deleteProduct(productId);
    setProducts(products.filter((product) => product.productID !== productId));
  };

  const handleEditSubmit = async () => {
    const updatedProduct = { ...formData, productID: productId };
    await addProduct(updatedProduct);
    const updatedProducts = products.map((product) =>
      product.productID === productId ? updatedProduct : product
    );
    setProducts(updatedProducts);
    setShowEditModal(false);
  };

  const handleAddSubmit = async () => {
    await addProduct(newProductData);
    setProducts([...products, newProductData]);
    setShowAddModal(false);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleNewProductChange = (e) => {
    setNewProductData({ ...newProductData, [e.target.name]: e.target.value });
  };

  const columns = [
    {
      title: 'Product ID',
      dataIndex: 'productID',
      key: 'productID',
    },
    {
      title: 'Name',
      dataIndex: 'productName',
      key: 'productName',
    },
    {
      title: 'Making Price',
      dataIndex: 'makingPrice',
      key: 'makingPrice',
      render: (price) => `Rs. ${price}`
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space size="middle">
          <Button icon={<EditOutlined />} onClick={() => handleEditProduct(record.productID)}>Edit</Button>
          <Button icon={<DeleteOutlined />} danger onClick={() => handleDeleteProduct(record.productID)}>Delete</Button>
        </Space>
      )
    }
  ];

  return (
    <div className="products-container">
      <h2>Product List</h2>
      <Button type="primary" onClick={() => setShowAddModal(true)}>Add Product</Button>

      <Table
        dataSource={products}
        columns={columns}
        rowKey="productID"
        pagination={{ pageSize: 5 }}
        scroll={{ x: true }}
      />

      {/* Edit Product Modal */}
      <Modal
        title="Edit Product Details"
        visible={showEditModal}
        onCancel={() => setShowEditModal(false)}
        onOk={handleEditSubmit}
      >
        <Form layout="vertical">
          <Form.Item label="Product Name">
            <Input name="productName" value={formData.productName} onChange={handleChange} />
          </Form.Item>
          <Form.Item label="Making Price">
            <Input name="makingPrice" value={formData.makingPrice} onChange={handleChange} />
          </Form.Item>
        </Form>
      </Modal>

      {/* Add Product Modal */}
      <Modal
        title="Add New Product"
        visible={showAddModal}
        onCancel={() => setShowAddModal(false)}
        onOk={handleAddSubmit}
      >
        <Form layout="vertical">
          <Form.Item label="Product ID">
            <Input name="productID" value={newProductData.productID} onChange={handleNewProductChange} />
          </Form.Item>
          <Form.Item label="Product Name">
            <Input name="productName" value={newProductData.productName} onChange={handleNewProductChange} />
          </Form.Item>
          <Form.Item label="Making Price">
            <Input name="makingPrice" value={newProductData.makingPrice} onChange={handleNewProductChange} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Products;