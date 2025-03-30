// components/PdfGenerator.js
import React from 'react';
import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';
import QRCode from 'qrcode.react';

// Create styles
const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#FFFFFF',
    padding: 40,
  },
  header: {
    marginBottom: 20,
    textAlign: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#666666',
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    borderBottom: '1 solid #eeeeee',
    paddingBottom: 5,
  },
  row: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  label: {
    width: 150,
    fontSize: 12,
    fontWeight: 'bold',
  },
  value: {
    fontSize: 12,
    flex: 1,
  },
  carImage: {
    width: '100%',
    height: 200,
    marginBottom: 20,
  },
  qrContainer: {
    marginTop: 30,
    alignItems: 'center',
  },
  footer: {
    marginTop: 30,
    fontSize: 10,
    textAlign: 'center',
    color: '#999999',
  },
});

const PdfGenerator = ({ carDetails, customerDetails, paymentDetails }) => {
  // Generate a data URL for the QR code
  const qrCodeData = JSON.stringify({
    carId: carDetails.id,
    customerId: customerDetails.id,
    purchaseDate: new Date().toISOString(),
  });

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.title}>Purchase Confirmation</Text>
          <Text style={styles.subtitle}>Thank you for your purchase</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Car Details</Text>
          {carDetails.image && (
            <Image 
              src={carDetails.image} 
              style={styles.carImage} 
              alt="Car"
            />
          )}
          <View style={styles.row}>
            <Text style={styles.label}>Model:</Text>
            <Text style={styles.value}>{carDetails.title} {carDetails.carmodel}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Price:</Text>
            <Text style={styles.value}>${carDetails.price.toLocaleString()}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Color:</Text>
            <Text style={styles.value}>{carDetails.color}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Year:</Text>
            <Text style={styles.value}>{carDetails.registration_year}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Mileage:</Text>
            <Text style={styles.value}>{carDetails.mileage} miles</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Customer Information</Text>
          <View style={styles.row}>
            <Text style={styles.label}>Name:</Text>
            <Text style={styles.value}>{customerDetails.name}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Email:</Text>
            <Text style={styles.value}>{customerDetails.email}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Phone:</Text>
            <Text style={styles.value}>
              {customerDetails.dial_code} {customerDetails.phone_number}
            </Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Payment Details</Text>
          <View style={styles.row}>
            <Text style={styles.label}>Transaction ID:</Text>
            <Text style={styles.value}>{paymentDetails.transactionId}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Amount Paid:</Text>
            <Text style={styles.value}>${paymentDetails.amount.toLocaleString()}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Payment Date:</Text>
            <Text style={styles.value}>
              {new Date(paymentDetails.date).toLocaleString()}
            </Text>
          </View>
        </View>

        <View style={styles.qrContainer}>
          <Image 
            src={`data:image/svg+xml;utf8,${encodeURIComponent(
              `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">${new QRCode({
                value: qrCodeData,
                size: 100,
                level: 'H',
              }).render()}</svg>`
            )}`}
            style={{ width: 100, height: 100 }}
          />
          <Text style={{ marginTop: 10, fontSize: 10 }}>Scan to verify purchase</Text>
        </View>

        <View style={styles.footer}>
          <Text>Thank you for choosing our dealership</Text>
          <Text>For any questions, please contact support@example.com</Text>
        </View>
      </Page>
    </Document>
  );
};

export default PdfGenerator;