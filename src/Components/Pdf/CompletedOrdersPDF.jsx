import React from "react";
import { Page, Text, View, Document, StyleSheet } from "@react-pdf/renderer";

// Styles
const styles = StyleSheet.create({
  page: {
    padding: 20,
    fontSize: 10,
  },
  title: {
    fontSize: 16,
    marginBottom: 10,
    textAlign: "center",
  },
  tableHeader: {
    flexDirection: "row",
    borderBottom: 1,
    marginBottom: 5,
    fontWeight: "bold",
  },
  tableRow: {
    flexDirection: "row",
    borderBottom: 1,
    paddingVertical: 2,
  },
  cell: {
    flex: 1,
    paddingHorizontal: 2,
  },
});

const CompletedOrdersPDF = ({ orders }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <Text style={styles.title}>Completed Orders</Text>

      {/* Header Row */}
      <View style={styles.tableHeader}>
        <Text style={styles.cell}>Customer</Text>
        <Text style={styles.cell}>Product</Text>
        <Text style={styles.cell}>Fabric</Text>
        <Text style={styles.cell}>Length</Text>
        <Text style={styles.cell}>Qty</Text>
        <Text style={styles.cell}>Price</Text>
        <Text style={styles.cell}>Order Date</Text>
        <Text style={styles.cell}>Completion Date</Text>
        <Text style={styles.cell}>Assigned To</Text>
      </View>

      {/* Data Rows */}
      {orders.map((order, index) => (
        <View key={index} style={styles.tableRow}>
          <Text style={styles.cell}>{order.customerName}</Text>
          <Text style={styles.cell}>{order.productName}</Text>
          <Text style={styles.cell}>{order.fabricName}</Text>
          <Text style={styles.cell}>{order.fabricLength}</Text>
          <Text style={styles.cell}>{order.quantity}</Text>
          <Text style={styles.cell}>₹{order.totalPrice}</Text>
          <Text style={styles.cell}>{order.orderDate ? new Date(order.orderDate).toLocaleDateString() : "-"}</Text>
          <Text style={styles.cell}>{order.completionDate ? new Date(order.completionDate).toLocaleDateString() : "-"}</Text>
          <Text style={styles.cell}>{order.assignedToName}</Text>
        </View>
      ))}
    </Page>
  </Document>
);

export default CompletedOrdersPDF;
