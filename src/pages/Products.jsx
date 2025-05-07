import React, { useEffect, useState } from "react";
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  Space,
  message,
  Card,
  Spin
} from 'antd';
import {
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
  SearchOutlined
} from '@ant-design/icons';
import {
  addProduct,
  getProduct,
  getAllProducts,
  updateProduct,
  deleteProduct
} from "../api/AdminApi";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [productId, setProductId] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const data = await getAllProducts();
      setProducts(data);
      setFilteredProducts(data);
    } catch (error) {
      message.error(error.message || "Failed to fetch products.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // useEffect(() => {
  //   const filtered = products.filter((product) =>
  //     product.productName.includes(searchQuery.toLowerCase())
  //   );
  //   setFilteredProducts(filtered);
  // }, [searchQuery, products]);

  const handleEditProduct = (id) => {
    const selected = products.find((p) => p.productID === id);
    setProductId(id);
    setIsEditing(true);
    form.setFieldsValue(selected);
    setShowModal(true);
  };

  const handleDeleteProduct = async (id) => {
    try {
      await deleteProduct(id);
      message.success("Product deleted successfully.");
      fetchProducts();
    } catch (error) {
      message.error(error.message);
    }
  };

  const handleSubmit = async (values) => {
    try {
      if (isEditing) {
        await updateProduct(productId, values);
        message.success("Product updated successfully.");
      } else {
        await addProduct(values);
        message.success("Product added successfully.");
      }
      setShowModal(false);
      form.resetFields();
      fetchProducts();
    } catch (error) {
      message.error(error.message);
    }
  };

  const columns = [
    { title: 'Product ID', dataIndex: 'ProductID', key: 'ProductID' },
    { title: 'Name', dataIndex: 'ProductName', key: 'ProductName' },
    {
      title: 'Making Price',
      dataIndex: 'MakingPrice',
      key: 'MakingPrice',
      render: (price) => `Rs. ${price}`
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space size="middle">
          <Button
            icon={<EditOutlined />}
            onClick={() => handleEditProduct(record.productID)}
          >
            Edit
          </Button>
          <Button
            icon={<DeleteOutlined />}
            danger
            onClick={() => handleDeleteProduct(record.productID)}
          >
            Delete
          </Button>
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
              onClick={() => {
                setShowModal(true);
                setIsEditing(false);
                form.resetFields();
              }}
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
        destroyOnClose
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item
            label="Product Name"
            name="productName"
            rules={[{ required: true, message: "Please enter product name" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Making Price"
            name="makingPrice"
            rules={[{ required: true, message: "Enter price" }]}
          >
            <Input type="number" />
          </Form.Item>
          <Space style={{ marginTop: 16 }}>
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
            <Button onClick={() => setShowModal(false)}>Cancel</Button>
          </Space>
        </Form>
      </Modal>
    </div>
  );
};

export default Products;
