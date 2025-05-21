import React from "react";
import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  Font,
} from "@react-pdf/renderer";

// Register font (optional)
Font.register({
  family: "Lato",
  fonts: [
    { src: "https://fonts.gstatic.com/s/lato/v23/S6uyw4BMUTPHjx4wWw.ttf" },
    {
      src: "https://fonts.gstatic.com/s/lato/v23/S6u9w4BMUTPHh6UVSwiPHA.ttf",
      fontWeight: "bold",
    },
  ],
});

// Styles
const styles = StyleSheet.create({
  page: {
    fontFamily: "Lato",
    padding: 40,
    fontSize: 11,
    lineHeight: 1.5,
    color: "#000",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 30,
  },
  logo: {
    fontSize: 30,
    fontWeight: "bold",
  },
  invoiceLabel: {
    fontSize: 20,
    letterSpacing: 1,
  },
  bold: {
    fontWeight: "bold",
  },
  customerInfo: {
    marginBottom: 20,
  },
  metaInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  table: {
    width: "100%",
    borderTop: "1px solid #000",
    borderBottom: "1px solid #000",
  },
  tableRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 6,
    borderBottom: "1px solid #ddd",
  },
  tableHeader: {
    fontWeight: "bold",
    borderBottom: "1px solid #000",
  },
  totals: {
    marginTop: 10,
    flexDirection: "column",
    alignItems: "flex-end",
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "200px",
  },
  grandTotal: {
    fontSize: 14,
    fontWeight: "bold",
    marginTop: 5,
  },
  extraDetails: {
    marginTop: 20,
    fontSize: 11,
    lineHeight: 1.5,
  },
});

// Component
const InvoicePDF = ({ order }) => {
  const items = order.items || [];
  const subtotal = items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
  const tax = 0;
  const total = subtotal + tax;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.logo}>&</Text>
          <Text style={styles.invoiceLabel}>INVOICE</Text>
        </View>

        {/* Customer Info */}
        <View style={styles.customerInfo}>
          <Text style={styles.bold}>BILLED TO:</Text>
          <Text>{order.customerName}</Text>
          <Text>{order.customerPhone}</Text>
          <Text>{order.customerAddress}</Text>
        </View>

        {/* Invoice Meta */}
        <View style={styles.metaInfo}>
          <View />
          <View>
            <Text>Invoice No. {order.invoiceNumber}</Text>
            <Text>{order.orderDate ? new Date(order.orderDate).toLocaleDateString() : "-"}</Text>
          </View>
        </View>

        {/* Table */}
        <View style={styles.table}>
          <View style={[styles.tableRow, styles.tableHeader]}>
            <Text style={{ width: "40%" }}>Item</Text>
            <Text style={{ width: "20%", textAlign: "right" }}>Quantity</Text>
            <Text style={{ width: "20%", textAlign: "right" }}>Unit Price</Text>
            <Text style={{ width: "20%", textAlign: "right" }}>Total</Text>
          </View>
          {items.map((item, i) => (
            <View key={i} style={styles.tableRow}>
              <Text style={{ width: "40%" }}>{item.name}</Text>
              <Text style={{ width: "20%", textAlign: "right" }}>{item.quantity}</Text>
              <Text style={{ width: "20%", textAlign: "right" }}>${item.unitPrice}</Text>
              <Text style={{ width: "20%", textAlign: "right" }}>
                ${item.unitPrice * item.quantity}
              </Text>
            </View>
          ))}
        </View>

        {/* Totals */}
        <View style={styles.totals}>
          <View style={styles.totalRow}>
            <Text>Subtotal</Text>
            <Text>${subtotal}</Text>
          </View>
          <View style={styles.totalRow}>
            <Text>Tax (0%)</Text>
            <Text>${tax}</Text>
          </View>
          <View style={styles.totalRow}>
            <Text style={styles.grandTotal}>Total</Text>
            <Text style={styles.grandTotal}>${total}</Text>
          </View>
        </View>

        {/* Extra Order Details */}
        <View style={styles.extraDetails}>
          <Text><Text style={styles.bold}>Product Name:</Text> {order.productName}</Text>
          <Text><Text style={styles.bold}>Fabric Name:</Text> {order.fabricName}</Text>
          <Text><Text style={styles.bold}>Quantity:</Text> {order.quantity}</Text>
          <Text><Text style={styles.bold}>Total Price:</Text> ₹{order.totalPrice}</Text>
          <Text><Text style={styles.bold}>Order Date:</Text> {order.orderDate ? new Date(order.orderDate).toLocaleDateString() : "-"}</Text>
          <Text><Text style={styles.bold}>Completion Date:</Text> {order.completionDate ? new Date(order.completionDate).toLocaleDateString() : "-"}</Text>
        </View>
      </Page>
    </Document>
  );
};

export default InvoicePDF;
