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
  Spin,
  Popconfirm,
  Select
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
  const role = localStorage.getItem('role'); // Get user role
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [productId, setProductId] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [messageApi, contextHolder] = message.useMessage();

  const showMessage = (type, content) => {
    messageApi.open({
      type,
      content,
    });
  };

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const data = await getAllProducts();
      setProducts(data);
      setFilteredProducts(data);
    } catch (error) {
      showMessage('error', error.message || "Failed to fetch products.");
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
    const selected = products.find((p) => p.ProductID === id);
    if (selected) {
      // Transform the data to match form field names
      const formData = {
        productName: selected.ProductName,
        makingPrice: selected.MakingPrice,
        productType: selected.ProductType // Add ProductType
      };
      
      setProductId(id);
      setIsEditing(true);
      form.setFieldsValue(formData); // Set transformed data
      setShowModal(true);
    } else {
      message.error("Product not found");
    }
  };

  const handleDeleteProduct = async (id) => {
    try {
      await deleteProduct(id);
      showMessage('success', "Product deleted successfully");
      fetchProducts();
    } catch (error) {
      showMessage('error', error.message);
    }
  };

  const handleSubmit = async (values) => {
    try {
      // Transform form values to match API expectations
      const apiData = {
        ProductName: values.productName,
        MakingPrice: parseFloat(values.makingPrice),
        ProductType: values.productType // Add ProductType
      };

      if (isEditing) {
        await updateProduct(productId, apiData);
        showMessage('success', "Product updated successfully");
      } else {
        await addProduct(apiData);
        showMessage('success', "Product added successfully");
      }
      setShowModal(false);
      form.resetFields();
      fetchProducts();
    } catch (error) {
      showMessage('error', error.message || "Failed to submit product");
    }
  };

  const columns = [
    { title: 'Name', dataIndex: 'ProductName', key: 'ProductName' },
    {
      title: 'Making Price',
      dataIndex: 'MakingPrice',
      key: 'MakingPrice',
      render: (price) => `Rs. ${price}`
    },
    {
      title: 'Product Type',
      dataIndex: 'ProductType',
      key: 'ProductType'
    },
    // Only show actions column for admin and manager
    ...(role === 'Admin' || role === 'Manager' ? [{
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space size="middle">
          <Button
            icon={<EditOutlined />}
            onClick={() => handleEditProduct(record.ProductID)}
          >
            Edit
          </Button>
          <Popconfirm
            title="Delete Product"
            description="Are you sure you want to delete this product?"
            onConfirm={() => handleDeleteProduct(record.ProductID)}
            okText="Yes"
            cancelText="No"
            okButtonProps={{ danger: true }}
          >
            <Button danger icon={<DeleteOutlined />}>
              Delete
            </Button>
          </Popconfirm>
        </Space>
      )
    }] : [])
  ];

  return (
    <div style={{ padding: "20px" }}>
      {contextHolder}
      <Card
        title={<h2>Product Records</h2>}
        extra={
          <Space>
            <Input
              placeholder="Search by product name"
              prefix={<SearchOutlined />}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ width: 250 }}
            />
            {/* Only show Add Product button for admin and manager */}
            {(role === 'Admin' || role === 'Manager') && (
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={() => {
                  setIsEditing(false);
                  setShowModal(true);
                }}
              >
                Add Product
              </Button>
            )}
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
            name="productName" // matches the transformed data
            rules={[{ required: true, message: "Please enter product name" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Making Price"
            name="makingPrice" // matches the transformed data
            rules={[{ required: true, message: "Enter price" }]}
          >
            <Input type="number" />
          </Form.Item>
          <Form.Item
            label="Product Type"
            name="productType"
            rules={[{ required: true, message: "Please select product type" }]}
          >
            <Select>
              <Select.Option value="Upper">Upper</Select.Option>
              <Select.Option value="Lower">Lower</Select.Option>
            </Select>
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
