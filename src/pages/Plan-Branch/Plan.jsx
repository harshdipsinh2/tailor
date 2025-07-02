import React, { useEffect, useState } from "react";
import { Card, Button, Row, Col, message } from "antd";
import { getAllPlans, buyPlan } from "../../api/AdminApi"; // ✅ Adjust if path is different

const Plan = () => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(false);

  // ✅ Fetch all plans
  const fetchPlans = async () => {
    try {
      setLoading(true);
      const data = await getAllPlans();
      setPlans(data);
    } catch (error) {
      message.error("Failed to load plans: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Buy plan -> open Stripe URL in new tab
  const handleBuy = async (planId) => {
    try {
      message.info("Redirecting to Stripe...");
      const stripeUrl = await buyPlan(planId); // Response contains `url`
      if (stripeUrl) {
        window.open(stripeUrl, "_blank"); // ✅ open link in new tab
      } else {
        message.error("No Stripe URL returned.");
      }
    } catch (error) {
      message.error("Payment failed: " + error.message);
    }
  };

  useEffect(() => {
    fetchPlans();
  }, []);

  return (
    <div style={{ padding: "24px" }}>
      <h2>Select a Subscription Plan</h2>
      <Row gutter={[24, 24]}>
        {plans.map((plan) => (
          <Col xs={24} md={12} key={plan.PlanId}>
            <Card title={plan.Name} bordered hoverable>
              <p><strong>Price:</strong> ₹{plan.PricePerMonth} / month</p>
              <Button 
                type="primary" 
                onClick={() => handleBuy(plan.PlanId)} 
                loading={loading}
              >
                Buy Plan
              </Button>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default Plan;
