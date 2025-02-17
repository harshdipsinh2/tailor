import React, { useState } from "react";
import "./Products.css";

const Products = () => {
  const [products] = useState([
    { id: 1, name: "Shirt", mrp: 999, price: 749, image: "" },
    { id: 2, name: "Pant", mrp: 1299, price: 999, image: "" },
    { id: 3, name: "Suit", mrp: 2499, price: 1999, image: "" },
    { id: 4, name: "Palazzo", mrp: 799, price: 599, image: "" },
    { id: 5, name: "Kurti", mrp: 1199, price: 899, image: "" },
    { id: 6, name: "Saree", mrp: 2999, price: 2499, image: "" },
  ]);

  return (
    <div className="products-grid">
      {products.map((product) => (
        <div className="product-box" key={product.id}>
          <div className="product-image">
            {product.image ? (
              <img src={product.image} alt={product.name} />
            ) : (
              <div className="no-image">Image not added</div>
            )}
          </div>
          <div className="product-details">
            <h3 className="product-name">{product.name}</h3>
            <p className="product-price">
              <span className="product-mrp">Rs. {product.mrp}</span>
              <span className="product-discount">Rs. {product.price}</span>
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Products;
