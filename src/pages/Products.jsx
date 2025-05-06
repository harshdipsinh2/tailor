import React, { useEffect, useState } from "react";
import { Table, Button, Modal, Form, Input, Space, message, Card, Spin } from 'antd';
import { EditOutlined, DeleteOutlined, PlusOutlined, SearchOutlined } from '@ant-design/icons';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [productId, setProductId] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchProducts = () => {
    setLoading(true);
    // Simulated static product data
    const mockProducts = [
      {
        productID: 1,
        productName: "Shirt",
        makingPrice: "800"
      },
      {
        productID: 2,
        productName: "Pants",
        makingPrice: "1200"
      }
    ];
    setProducts(mockProducts);
    setFilteredProducts(mockProducts);
    setLoading(false);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    const filteredData = products.filter((product) =>
      product.productName.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredProducts(filteredData);
  }, [searchQuery, products]);

  const handleEditProduct = (productId) => {
    const selectedProduct = products.find((product) => product.productID === productId);
    setProductId(productId);
    form.setFieldsValue(selectedProduct);
    setIsEditing(true);
    setShowModal(true);
  };

  const handleDeleteProduct = (productId) => {
    setProducts(products.filter((product) => product.productID !== productId));
    message.success("Product deleted successfully (mock)");
  };

  const handleSubmit = (values) => {
    if (isEditing) {
      const updatedProducts = products.map((product) =>
        product.productID === productId ? { ...product, ...values } : product
      );
      setProducts(updatedProducts);
      message.success("Product updated successfully (mock)");
    } else {
      const newProduct = {
        ...values,
        productID: Date.now() // simple unique ID
      };
      setProducts([...products, newProduct]);
      message.success("Product added successfully (mock)");
    }

    setShowModal(false);
    form.resetFields();
  };

  const columns = [
    { title: 'Product ID', dataIndex: 'productID', key: 'productID' },
    { title: 'Name', dataIndex: 'productName', key: 'productName' },
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
    <div className="products-container" style={{ padding: "20px" }}>
      <Card
        title={<h2>Product List</h2>}
        extra={
          <Space>
            <Input
              placeholder="Search by Product Name"
              prefix={<SearchOutlined />}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ width: 250 }}
            />
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => { setShowModal(true); setIsEditing(false); form.resetFields(); }}
            >
              Add Product
            </Button>
          </Space>
        }
      >
        <Spin spinning={loading}>
          <Table
            dataSource={filteredProducts}
            columns={columns}
            rowKey="productID"
            pagination={{ pageSize: 5 }}
            scroll={{ x: "max-content" }}
          />
        </Spin>
      </Card>

      <Modal
        title={isEditing ? "Edit Product" : "Add Product"}
        open={showModal}
        onCancel={() => setShowModal(false)}
        footer={null}
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item label="Product Name" name="productName" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item label="Making Price" name="makingPrice" rules={[{ required: true }]}>
            <Input type="number" />
          </Form.Item>
          <Space>
            <Button type="primary" htmlType="submit">Submit</Button>
            <Button onClick={() => setShowModal(false)}>Cancel</Button>
          </Space>
        </Form>
      </Modal>
    </div>
  );
};

export default Products;
