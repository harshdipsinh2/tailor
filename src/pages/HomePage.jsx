import React from "react";
import { Button, Card, Col, Row } from "antd";
import { useNavigate } from "react-router-dom";
import {
  FaClipboardList,
  FaUsers,
  FaTshirt,
  FaBoxes,
} from "react-icons/fa";

const features = [
  {
    title: "Order Management",
    icon: <FaClipboardList className="text-4xl text-blue-600" />,
    description: "Track, update, and manage all your customer orders efficiently."
  },
  {
    title: "Customer Management",
    icon: <FaUsers className="text-4xl text-green-600" />,
    description: "Add, edit, and manage your customer details and measurements."
  },
  {
    title: "Product Management",
    icon: <FaTshirt className="text-4xl text-purple-600" />,
    description: "Manage different products offered in your tailoring service."
  },
  {
    title: "Fabric Management",
    icon: <FaBoxes className="text-4xl text-orange-600" />,
    description: "Organize and keep track of your fabric stock and types."
  }
];

const HomePage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6 text-white text-center">
        <h1 className="text-3xl md:text-4xl font-bold">Tailor Management System ✃</h1>
        <p className="mt-2 text-lg md:text-xl">
          Streamline your tailoring business with a centralized management solution.
        </p>
      </header>

      {/* Features Section */}
      <main className="flex-grow p-6 md:p-10 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <Row gutter={[24, 24]}>
            {features.map((item, index) => (
              <Col key={index} xs={24} sm={12} md={12} lg={6}>
                <Card
                  hoverable
                  className="rounded-2xl shadow-md text-center h-full"
                >
                  <div className="mb-4 flex justify-center">{item.icon}</div>
                  <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                  <p className="text-gray-600">{item.description}</p>
                </Card>
              </Col>
            ))}
          </Row>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t p-4 flex justify-end">
        <Button
          type="primary"
          shape="round"
          onClick={() => navigate("/login")}
        >
          Login
        </Button>
      </footer>
    </div>
  );
};

export default HomePage;
