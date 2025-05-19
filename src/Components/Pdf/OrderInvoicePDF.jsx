// components/OrderInvoicePDF.jsx
import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
} from "@react-pdf/renderer";
import dayjs from "dayjs";

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontSize: 12,
    fontFamily: "Helvetica",
  },
  header: {
    fontSize: 28,
    color: "#0f4c5c",
    textAlign: "right",
    marginBottom: 10,
  },
  sectionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  section: {
    flexDirection: "column",
    gap: 4,
  },
  label: {
    fontSize: 10,
    color: "#666",
  },
  bold: {
    fontWeight: "bold",
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#0f4c5c",
    color: "#fff",
    padding: 6,
    marginTop: 20,
  },
  tableRow: {
    flexDirection: "row",
    borderBottom: "1px solid #ccc",
    padding: 6,
  },
  descriptionCol: {
    flex: 2,
  },
  priceCol: {
    flex: 1,
    textAlign: "right",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 10,
    paddingRight: 10,
  },
  total: {
    fontSize: 14,
    fontWeight: "bold",
  },
  bottomSignature: {
    marginTop: 40,
    flexDirection: "row",
    justifyContent: "space-between",
    fontSize: 10,
    paddingTop: 20,
    borderTop: "1px solid #ccc",
  },
});

const OrderInvoicePDF = ({ order }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <Text style={styles.header}>Invoice</Text>

      <View style={styles.sectionRow}>
        {/* Left Section - Company Info */}
        <View style={styles.section}>
          <Text style={styles.label}>Company Name:</Text>
          <Text>TailorCrafts Pvt Ltd</Text>

          <Text style={styles.label}>Address/City/ZIP Code:</Text>
          <Text>Main Street, Fashion City, 560001</Text>

          <Text style={styles.label}>Contact:</Text>
          <Text>+91 9876543210</Text>
        </View>

        {/* Right Section - Invoice Info */}
        <View style={styles.section}>
          <Text style={styles.label}>Date:</Text>
          <Text>{dayjs().format("DD/MM/YYYY")}</Text>

          <Text style={styles.label}>Invoice No.:</Text>
          <Text>{order.orderId}</Text>

          <Text style={styles.label}>Invoice Total:</Text>
          <Text style={{ fontWeight: "bold", fontSize: 14 }}>
            ₹{order.totalPrice}
          </Text>
        </View>
      </View>

      {/* Customer Info Section */}
      <View style={{ marginTop: 20 }}>
        <Text style={[styles.label, { color: "#0f4c5c" }]}>
          Amount Received To:
        </Text>
        <Text>Name: {order.customerName}</Text>
        <Text>Contact: {order.customerContact || "N/A"}</Text>
      </View>

      {/* Table */}
      <View style={styles.tableHeader}>
        <Text style={styles.descriptionCol}>Description</Text>
        <Text style={styles.priceCol}>Unit Price</Text>
        <Text style={styles.priceCol}>Amount</Text>
      </View>

      <View style={styles.tableRow}>
        <Text style={styles.descriptionCol}>
          {order.productName} (Fabric: {order.fabricName})
        </Text>
        <Text style={styles.priceCol}>₹{order.unitPrice}</Text>
        <Text style={styles.priceCol}>₹{order.totalPrice}</Text>
      </View>

      {/* Total */}
      <View style={styles.footer}>
        <Text style={styles.total}>Total Amount: ₹{order.totalPrice}</Text>
      </View>

      {/* Signatures */}
      <View style={styles.bottomSignature}>
        <Text>Authorized Person</Text>
        <Text>Title</Text>
        <Text>Date</Text>
        <Text>Contact</Text>
        <Text>Signature</Text>
      </View>
    </Page>
  </Document>
);

export default OrderInvoicePDF;
