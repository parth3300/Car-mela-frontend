import React, { useState, useEffect } from "react";
import { Document, Page, Text, View, StyleSheet, Image } from "@react-pdf/renderer";
import QRCode from "qrcode";

const PdfGenerator = ({ carDetails, customerDetails, paymentDetails, pdfUrl }) => {
  // Generate a data URL for the QR code
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState("");

  useEffect(() => {
    // Generate QR code as data URL
    QRCode.toDataURL(pdfUrl)
      .then((url) => {
        setQrCodeDataUrl(url);
      })
      .catch((err) => {
        console.error("Error generating QR code:", err);
      });
  }, [pdfUrl]);

  const styles = StyleSheet.create({
    page: {
      fontFamily: "Helvetica",
      padding: 40,
      backgroundColor: "#ffffff",
    },
    header: {
      marginBottom: 20,
      borderBottomWidth: 1,
      borderBottomColor: "#cccccc",
      paddingBottom: 10,
    },
    title: {
      fontSize: 24,
      fontWeight: "bold",
      marginBottom: 10,
      color: "#333333",
    },
    subtitle: {
      fontSize: 14,
      color: "#666666",
      marginBottom: 5,
    },
    section: {
      marginBottom: 20,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: "bold",
      marginBottom: 10,
      color: "#333333",
    },
    row: {
      flexDirection: "row",
      marginBottom: 5,
    },
    label: {
      width: 150,
      fontSize: 12,
      fontWeight: "bold",
      color: "#555555",
    },
    value: {
      fontSize: 12,
      color: "#333333",
    },
    carImage: {
      width: 200,
      height: 120,
      marginBottom: 10,
      borderRadius: 4,
    },
    table: {
      width: "100%",
      marginTop: 10,
    },
    tableRow: {
      flexDirection: "row",
      borderBottomWidth: 1,
      borderBottomColor: "#eeeeee",
      paddingVertical: 8,
    },
    tableHeader: {
      fontWeight: "bold",
      backgroundColor: "#f5f5f5",
      paddingVertical: 8,
    },
    tableCol: {
      width: "25%",
      paddingHorizontal: 5,
    },
    totalRow: {
      flexDirection: "row",
      marginTop: 10,
      paddingTop: 10,
      borderTopWidth: 1,
      borderTopColor: "#cccccc",
    },
    totalLabel: {
      width: "75%",
      textAlign: "right",
      fontSize: 14,
      fontWeight: "bold",
    },
    totalValue: {
      width: "25%",
      fontSize: 14,
      fontWeight: "bold",
    },
    qrContainer: {
      marginTop: 20,
      alignItems: "center",
    },
    qrImage: {
      width: 100,
      height: 100,
      borderWidth: 1,
      borderColor: "#eeeeee",
      padding: 5,
    },
    qrText: {
      fontSize: 10,
      marginTop: 5,
      color: "#666666",
    },
    footer: {
      position: "absolute",
      bottom: 30,
      left: 40,
      right: 40,
      fontSize: 10,
      textAlign: "center",
      color: "#999999",
    },
  });

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Purchase Confirmation</Text>
          <Text style={styles.subtitle}>Order #: {paymentDetails.transactionId}</Text>
          <Text style={styles.subtitle}>Date: {new Date(paymentDetails.date).toLocaleDateString()}</Text>
        </View>

        {/* Customer Details */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Customer Information</Text>
          <View style={styles.row}>
            <Text style={styles.label}>Customer ID:</Text>
            <Text style={styles.value}>{customerDetails.id}</Text>
          </View>
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

        {/* Vehicle Details */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Vehicle Purchased</Text>
          {carDetails.image && <Image src={carDetails.image} style={styles.carImage} alt={carDetails.title} />}
          <View style={styles.row}>
            <Text style={styles.label}>Make & Model:</Text>
            <Text style={styles.value}>
              {carDetails.title} {carDetails.carmodel}
            </Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>VIN:</Text>
            <Text style={styles.value}>{carDetails.vin || "N/A"}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Year:</Text>
            <Text style={styles.value}>{carDetails.year || "N/A"}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Color:</Text>
            <Text style={styles.value}>{carDetails.color || "N/A"}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Mileage:</Text>
            <Text style={styles.value}>{carDetails.mileage ? `${carDetails.mileage.toLocaleString()} miles` : "N/A"}</Text>
          </View>
        </View>

        {/* Payment Details */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Payment Information</Text>
          <View style={styles.table}>
            {/* Table Header */}
            <View style={[styles.tableRow, styles.tableHeader]}>
              <View style={styles.tableCol}>
                <Text>Description</Text>
              </View>
              <View style={styles.tableCol}>
                <Text>Quantity</Text>
              </View>
              <View style={styles.tableCol}>
                <Text>Unit Price</Text>
              </View>
              <View style={styles.tableCol}>
                <Text>Amount</Text>
              </View>
            </View>

            {/* Vehicle Row */}
            <View style={styles.tableRow}>
              <View style={styles.tableCol}>
                <Text>
                  {carDetails.title} {carDetails.carmodel}
                </Text>
              </View>
              <View style={styles.tableCol}>
                <Text>1</Text>
              </View>
              <View style={styles.tableCol}>
                <Text>${carDetails.price.toLocaleString()}</Text>
              </View>
              <View style={styles.tableCol}>
                <Text>${carDetails.price.toLocaleString()}</Text>
              </View>
            </View>

            {/* Taxes and Fees */}
            <View style={styles.tableRow}>
              <View style={styles.tableCol}>
                <Text>Sales Tax (8%)</Text>
              </View>
              <View style={styles.tableCol}>
                <Text>1</Text>
              </View>
              <View style={styles.tableCol}>
                <Text>${(carDetails.price * 0.08).toLocaleString(undefined, { maximumFractionDigits: 2 })}</Text>
              </View>
              <View style={styles.tableCol}>
                <Text>${(carDetails.price * 0.08).toLocaleString(undefined, { maximumFractionDigits: 2 })}</Text>
              </View>
            </View>

            {/* Delivery Fee */}
            <View style={styles.tableRow}>
              <View style={styles.tableCol}>
                <Text>Delivery Fee</Text>
              </View>
              <View style={styles.tableCol}>
                <Text>1</Text>
              </View>
              <View style={styles.tableCol}>
                <Text>$500.00</Text>
              </View>
              <View style={styles.tableCol}>
                <Text>$500.00</Text>
              </View>
            </View>
          </View>

          {/* Total */}
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total:</Text>
            <Text style={styles.totalValue}>
              ${(carDetails.price * 1.08 + 500).toLocaleString(undefined, { maximumFractionDigits: 2 })}
            </Text>
          </View>
        </View>

        {/* QR Code Section */}
        {qrCodeDataUrl && (
          <View style={styles.qrContainer}>
            <Image src={qrCodeDataUrl} style={styles.qrImage} alt="QR Code to access this document" />
            <Text style={styles.qrText}>Scan to view this document online</Text>
          </View>
        )}

        {/* Terms and Conditions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Terms & Conditions</Text>
          <Text style={{ fontSize: 10, lineHeight: 1.5 }}>
            1. All sales are final. No returns or exchanges unless otherwise specified by law.
            {"\n"}
            2. Vehicle availability is subject to prior sale. Prices are subject to change without notice.
            {"\n"}
            3. Taxes, title, license fees, and any other fees due at the time of purchase are the responsibility of the buyer.
            {"\n"}
            4. The dealer is not responsible for typographical errors in price or equipment.
          </Text>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text>
            Thank you for your business! • {new Date().getFullYear()} © AutoDealer Inc.
          </Text>
        </View>
      </Page>
    </Document>
  );
};

export default PdfGenerator;