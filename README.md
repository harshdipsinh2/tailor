# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)



tailor-management   


import React, { useEffect, useState } from "react";
import { Table, Button, Modal, Form, Row, Col, InputGroup, FormControl } from 'react-bootstrap';
import { updateCustomer, getAllCustomers } from "../api/customerapi";

const Customers = () => {
  const [customers, setCustomers] = useState([]);
  const [customerId, setCustomerID] = useState('');
  const [show, setShow] = useState(false);
  const [showMeasurement, setShowMeasurement] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    phoneNumber: "",
    email: "",
    address: "",
    gender: "male"
  });

  useEffect(() => {
    getAllCustomers()
      .then((data) => setCustomers(data))
      .catch((error) => console.error('Error fetching data:', error));
  }, []);

  const handleEditCustomer = (customerId) => {
    setCustomerID(customerId);
    setShowMeasurement(false);
    const singleCustomer = customers.find((customer) => customer.customerId === customerId);
    setFormData({ ...singleCustomer });
    setShow(true);
  };

  const handleAddMeasurements = (customerId) => {
    setShowMeasurement(true);
    setShow(true);
  };

  const handleClose = () => setShow(false);

  const handleEditSubmit = async (event) => {
    event.preventDefault();
    try {
      await updateCustomer(customerId, formData);
      alert("Customer updated successfully!");
    } catch (error) {
      alert("Failed to update customer: " + error.message);
    }
    setShow(false);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="customers-container">
      <h2>Customer List</h2>
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>Name</th>
            <th>Phone</th>
            <th>Email</th>
            <th>Address</th>
            <th>Gender</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {customers.map((customer) => (
            <tr key={customer.customerId}>
              <td>{customer.fullName}</td>
              <td>{customer.phoneNumber}</td>
              <td>{customer.email}</td>
              <td>{customer.address}</td>
              <td>{customer.gender}</td>
              <td>
                <Button variant="primary" onClick={() => handleEditCustomer(customer.customerId)}>Edit</Button>{' '}
                <Button variant="danger">Delete</Button>{' '}
                <Button onClick={() => handleAddMeasurements(customer.customerId)}>Add Measurement</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>{showMeasurement ? 'Add Measurements' : 'Update Customer Details'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleEditSubmit}>
            {showMeasurement ? (
              <Row>
                {["chest", "waist", "hip", "shoulder", "sleeveLength", "trouserLength", "inseam", "thigh", "neck", "sleeve", "arms"].map((field) => (
                  <Col md={6} key={field} className="mb-3">
                    <Form.Group>
                      <Form.Label>{field.charAt(0).toUpperCase() + field.slice(1)}</Form.Label>
                      <Form.Control type="number" name={field} value={formData[field]} onChange={handleChange} required />
                    </Form.Group>
                  </Col>
                ))}
              </Row>
            ) : (
              <>
                <Form.Group className="mb-3">
                  <Form.Label>Full Name</Form.Label>
                  <Form.Control name="fullName" value={formData.fullName} onChange={handleChange} required />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Phone Number</Form.Label>
                  <Form.Control name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} required />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Email Address</Form.Label>
                  <Form.Control type="email" name="email" value={formData.email} onChange={handleChange} required />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Address</Form.Label>
                  <Form.Control as="textarea" name="address" value={formData.address} onChange={handleChange} required />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Gender</Form.Label>
                  <InputGroup>
                    <Form.Check inline label="Male" type="radio" name="gender" value="male" checked={formData.gender === "male"} onChange={handleChange} />
                    <Form.Check inline label="Female" type="radio" name="gender" value="female" checked={formData.gender === "female"} onChange={handleChange} />
                  </InputGroup>
                </Form.Group>
              </>
            )}

            <Button type="submit" variant="primary">Update Changes</Button>{' '}
            <Button variant="secondary" onClick={handleClose}>Cancel</Button>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default Customers;
Search and Filter for products
Sort Functionality for columns
Enhanced Form Validation for better data accuracy
Image Upload Feature for product images
Detailed Product Description Field
Category Management for better organization
Bulk Actions (e.g., bulk delete or bulk update)