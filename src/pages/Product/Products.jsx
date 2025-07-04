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
  Select,
  Row,
  Col
} from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
  SearchOutlined
} from "@ant-design/icons";
import {
  addProduct,
  getAllProducts,
  updateProduct,
  deleteProduct,
  getAllBranches
} from "../../api/AdminApi";

const Products = () => {
  const role = localStorage.getItem("role");
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [productId, setProductId] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [branches, setBranches] = useState([]);
  const [shopOptions, setShopOptions] = useState([]);
  const [selectedShopId, setSelectedShopId] = useState(null);
  const [selectedBranchId, setSelectedBranchId] = useState(null);

  const fetchBranches = async () => {
    try {
      const data = await getAllBranches();
      setBranches(data || []);
      const uniqueShops = [
        ...new Map(data.map((b) => [b.ShopId, { label: b.ShopName, value: b.ShopId }])).values()
      ];
      setShopOptions(uniqueShops);
    } catch {
      message.error("Failed to load branches");
    }
  };

  const fetchProducts = async (shopId, branchId) => {
    try {
      setLoading(true);
      const data = await getAllProducts(shopId, branchId); // Pass filters if API supports
      setProducts(data);
      setFilteredProducts(data);
    } catch (error) {
      message.error(error.message || "Failed to fetch products.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const payload = JSON.parse(atob(token.split(".")[1]));
    const shopId = parseInt(payload.shopId);
    const branchId = parseInt(payload.branchId);

    if (role === "Admin" || role === "SuperAdmin") {
      fetchBranches();
    }

    if (shopId && branchId) {
      setSelectedShopId(shopId);
      setSelectedBranchId(branchId);
      fetchProducts(shopId, branchId);
    }
  }, []);

  useEffect(() => {
    const filtered = products.filter((product) =>
      (product.ProductName || "").toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredProducts(filtered);
  }, [searchQuery, products]);

  const handleEditProduct = (id) => {
    const selected = products.find((p) => p.ProductID === id);
    if (selected) {
      form.setFieldsValue({
        productName: selected.ProductName,
        makingPrice: selected.MakingPrice,
        productType: selected.ProductType
      });
      setProductId(id);
      setIsEditing(true);
      setShowModal(true);
    } else {
      message.error("Product not found");
    }
  };

  const handleDeleteProduct = async (id) => {
    try {
      await deleteProduct(id);
      message.success("Product deleted successfully");
      fetchProducts(selectedShopId, selectedBranchId);
    } catch (error) {
      message.error(error.message);
    }
  };

  const handleSubmit = async (values) => {
    const payload = {
      ProductName: values.productName,
      MakingPrice: parseFloat(values.makingPrice),
      ProductType: values.productType
    };

    try {
      if (isEditing) {
        await updateProduct(productId, payload);
        message.success("Product updated successfully");
      } else {
        await addProduct(payload);
        message.success("Product added successfully");
      }
      setShowModal(false);
      form.resetFields();
      fetchProducts(selectedShopId, selectedBranchId);
    } catch (error) {
      message.error(error.message || "Failed to submit product");
    }
  };

  const columns = [
    { title: "Name", dataIndex: "ProductName", key: "ProductName" },
    {
      title: "Making Price",
      dataIndex: "MakingPrice",
      key: "MakingPrice",
      render: (price) => `Rs. ${price}`
    },
    {
      title: "Product Type",
      dataIndex: "ProductType",
      key: "ProductType"
    },
    ...(role === "Admin" || role === "Manager" || role === "SuperAdmin"
      ? [
          {
            title: "Actions",
            key: "actions",
            render: (_, record) => (
              <Space size="middle">
                <Button icon={<EditOutlined />} onClick={() => handleEditProduct(record.ProductID)}>
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
          }
        ]
      : [])
  ];

  return (
    <div style={{ padding: "20px" }}>
      <Card
        title={<h2 style={{ margin: 0 }}>Product Records</h2>}
        extra={
          <Space>
            <Input
              placeholder="Search by product name"
              prefix={<SearchOutlined />}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ width: 250 }}
            />
            {(role === "Admin" || role === "Manager" || role === "SuperAdmin") && (
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={() => {
                  setIsEditing(false);
                  form.resetFields();
                  setShowModal(true);
                }}
              >
                Add Product
              </Button>
            )}
          </Space>
        }
      >
        {(role === "Admin" || role === "SuperAdmin") && (
          <Row gutter={16} style={{ marginBottom: 16 }}>
            <Col span={6}>
              <Select
                placeholder="Filter by Shop"
                options={shopOptions}
                allowClear
                value={selectedShopId}
                onChange={(value) => {
                  setSelectedShopId(value);
                  setSelectedBranchId(null);
                }}
                style={{ width: "100%" }}
              />
            </Col>
            <Col span={6}>
              <Select
                placeholder="Select Branch"
                allowClear
                value={selectedBranchId}
                onChange={setSelectedBranchId}
                disabled={!selectedShopId}
                style={{ width: "100%" }}
              >
                {branches
                  .filter((b) => b.ShopId === selectedShopId)
                  .map((b) => (
                    <Select.Option key={b.BranchId} value={b.BranchId}>
                      {b.BranchName}
                    </Select.Option>
                  ))}
              </Select>
            </Col>
            <Col>
              <Button
                type="primary"
                onClick={() => fetchProducts(selectedShopId, selectedBranchId)}
              >
                Apply Filters
              </Button>
            </Col>
          </Row>
        )}

        <Spin spinning={loading}>
          <Table
            dataSource={filteredProducts}
            columns={columns}
            rowKey="ProductID"
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
