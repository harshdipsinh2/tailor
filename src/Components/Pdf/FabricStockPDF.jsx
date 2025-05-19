import React from 'react';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import dayjs from 'dayjs';

// Styles
const styles = StyleSheet.create({
  page: {
    padding: 20,
    fontSize: 12,
    fontFamily: 'Helvetica'
  },
  title: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
    fontWeight: 'bold',
    textTransform: 'uppercase'
  },
  table: {
    display: 'table',
    width: 'auto',
    marginTop: 10,
  },
  tableRow: {
    flexDirection: 'row',
    borderBottom: '1px solid #ccc',
    padding: 5,
  },
  tableHeader: {
    fontWeight: 'bold',
    backgroundColor: '#eee'
  },
  col: {
    flex: 1,
    padding: 2,
  }
});

const FabricStockPDF = ({ stocks }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <Text style={styles.title}>Fabric Stock Report</Text>

      <View style={[styles.table, styles.tableHeader]}>
        <View style={styles.tableRow}>
          <Text style={styles.col}>Fabric Name</Text>
          <Text style={styles.col}>Stock In</Text>
          <Text style={styles.col}>Stock Out</Text>
          <Text style={styles.col}>Stock Add Date</Text>
        </View>
      </View>

      <View style={styles.table}>
        {stocks.map((item, index) => (
          <View key={index} style={styles.tableRow}>
            <Text style={styles.col}>{item.fabricName}</Text>
            <Text style={styles.col}>{item.stockIn}</Text>
            <Text style={styles.col}>{item.stockOut}</Text>
            <Text style={styles.col}>{dayjs(item.stockAddDate).format('DD/MM/YYYY HH:mm')}</Text>
          </View>
        ))}
      </View>
    </Page>
  </Document>
);

export default FabricStockPDF;
