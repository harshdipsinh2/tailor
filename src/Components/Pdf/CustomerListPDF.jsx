import React from "react";
import { Page, Text, View, Document, StyleSheet } from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: { padding: 20 },
  title: { fontSize: 18, marginBottom: 10 },
  section: { marginBottom: 10 },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
    borderBottom: "1px solid #eee",
    paddingBottom: 2,
  },
});

const CustomerListPDF = ({ customers }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <Text style={styles.title}>Customer List</Text>
      {customers.map((cust, index) => (
        <View key={index} style={styles.section}>
          <View style={styles.row}>
            <Text>Name: {cust.fullName}</Text>
            <Text>Phone: {cust.phoneNumber}</Text>
          </View>
          <View style={styles.row}>
            <Text>Email: {cust.email}</Text>
            <Text>Gender: {cust.gender}</Text>
          </View>
          <View style={styles.row}>
            <Text>Address: {cust.address}</Text>
          </View>
        </View>
      ))}
    </Page>
  </Document>
);

export default CustomerListPDF;
