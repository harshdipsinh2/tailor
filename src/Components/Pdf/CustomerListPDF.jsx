import React from "react";
import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  Font,
} from "@react-pdf/renderer";

// Optional: custom font (you can use built-in too)
Font.register({
  family: "Helvetica-Bold",
  fonts: [
    { src: "https://fonts.gstatic.com/s/helvetica/v6/helveticabold.woff2" }, // fallback if needed
  ],
});

const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontSize: 11,
    fontFamily: "Helvetica",
    lineHeight: 1.5,
  },
  header: {
    fontSize: 20,
    textAlign: "center",
    marginBottom: 20,
    textTransform: "uppercase",
    color: "#333",
  },
  section: {
    marginBottom: 15,
    padding: 10,
    border: "1px solid #ccc",
    borderRadius: 4,
    backgroundColor: "#f9f9f9",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 5,
  },
  label: {
    fontWeight: "bold",
    color: "#333",
    width: "30%",
  },
  value: {
    width: "68%",
    textAlign: "right",
    color: "#555",
  },
});

const CustomerListPDF = ({ customers }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <Text style={styles.header}>Customer List</Text>
      {customers.map((cust, index) => (
        <View key={index} style={styles.section}>
          <View style={styles.row}>
            <Text style={styles.label}>Name:</Text>
            <Text style={styles.value}>{cust.fullName}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Phone:</Text>
            <Text style={styles.value}>{cust.phoneNumber}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Email:</Text>
            <Text style={styles.value}>{cust.email}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Gender:</Text>
            <Text style={styles.value}>{cust.gender}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Address:</Text>
            <Text style={styles.value}>{cust.address}</Text>
          </View>
        </View>
      ))}
    </Page>
  </Document>
);

export default CustomerListPDF;
