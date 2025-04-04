import React, { useState, useEffect } from "react";
import { Document, Page, Text, View, StyleSheet, Image } from "@react-pdf/renderer";

const PdfGenerator = ({ carDetails = {}, customerDetails = {}, paymentDetails = {}, pdfUrl = "" }) => {
  const [profilePicDimensions, setProfilePicDimensions] = useState({ width: 80, height: 80 });
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState("");

  useEffect(() => {
    // Function to get image dimensions from URL
    const getImageDimensions = (url) => {
      return new Promise((resolve) => {
        const img = new window.Image();
        img.onload = () => {
          resolve({ width: img.width, height: img.height });
        };
        img.onerror = () => {
          resolve({ width: 80, height: 80 }); // Default dimensions if image fails to load
        };
        img.src = url;
      });
    };

    if (customerDetails.profile_pic) {
      getImageDimensions(customerDetails.profile_pic).then(setProfilePicDimensions);
    }
  }, [customerDetails.profile_pic]);

  useEffect(() => {
    // Generate QR code when pdfUrl changes
    if (pdfUrl) {
      // Using a reliable QR code generation service
      const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(pdfUrl)}`;
      setQrCodeDataUrl(qrCodeUrl);
    }
  }, [pdfUrl]);

  // Function to filter out excluded fields from carDetails
  const getFilteredCarDetails = (details) => {
    const excludedFields = [
      'id', 
      'ratings', 
      'company', 
      'carowner', 
      'reviews', 
      'dealerships', 
      'last_update'
    ];
    
    const filtered = {};
    for (const [key, value] of Object.entries(details)) {
      if (!excludedFields.includes(key)) {
        filtered[key] = value;
      }
    }
    return filtered;
  };

  // Function to filter out excluded fields from customerDetails (carOwnerDetails)
  const getFilteredCustomerDetails = (details) => {
    const excludedFields = [
      'id',
      'user',
      'view_cars'
    ];
    
    const filtered = {};
    for (const [key, value] of Object.entries(details)) {
      if (!excludedFields.includes(key)) {
        filtered[key] = value;
      }
    }
    return filtered;
  };

  // Safely format labels and values
  const formatLabel = (str) => {
    if (!str) return "";
    return str
      .replace(/_/g, ' ')
      .replace(/(?:^\w|[A-Z]|\b\w)/g, (word, index) => 
        index === 0 ? word.toUpperCase() : word.toLowerCase()
      );
  };

  const formatValue = (key, value) => {
    if (value === undefined || value === null) return "N/A";
    if (typeof value === "number") {
      if (key === "price") return `$${value.toLocaleString()}`;
      if (key === "mileage") return `${value.toLocaleString()} miles`;
      return value.toLocaleString();
    }
    return value.toString();
  };

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
    customerHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 15,
    },
    profilePic: {
      width: profilePicDimensions.width,
      height: profilePicDimensions.height,
      borderRadius: 40,
      marginRight: 20,
      borderWidth: 1,
      borderColor: '#eeeeee',
    },
    customerInfo: {
      flex: 1,
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

  // Safely extract values with defaults and apply filters
  const safeCarDetails = {
    title: "",
    carmodel: "",
    price: 0,
    image: null,
    color: "",
    mileage: 0,
    average_rating: null,
    ...getFilteredCarDetails(carDetails)
  };

  const safeCustomerDetails = {
    name: "",
    email: "",
    phone_number: "",
    profile_pic: null,
    ...getFilteredCustomerDetails(customerDetails)
  };

  const safePaymentDetails = {
    transactionId: "",
    amount: 0,
    date: new Date().toISOString(),
    ...paymentDetails
  };

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Purchase Confirmation</Text>
          <Text style={styles.subtitle}>Order #: {safePaymentDetails.transactionId || "N/A"}</Text>
          <Text style={styles.subtitle}>Date: {new Date(safePaymentDetails.date).toLocaleDateString()}</Text>
        </View>

        {/* Customer Details */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Customer Information</Text>
          <View style={styles.customerHeader}>
            {safeCustomerDetails.profile_pic && (
              <Image 
                src={safeCustomerDetails.profile_pic} 
                style={styles.profilePic}
                alt="Customer Profile"
              />
            )}
            <View style={styles.customerInfo}>
              {safeCustomerDetails.name && (
                <Text style={{ fontSize: 16, fontWeight: 'bold', marginBottom: 5 }}>
                  {safeCustomerDetails.name}
                </Text>
              )}
              {safeCustomerDetails.email && (
                <Text style={{ fontSize: 12, color: '#666666', marginBottom: 3 }}>
                  {safeCustomerDetails.email}
                </Text>
              )}
              {safeCustomerDetails.phone_number && (
                <Text style={{ fontSize: 12, color: '#666666' }}>
                  +{safeCustomerDetails.dial_code} {safeCustomerDetails.phone_number}
                </Text>
              )}
            </View>
          </View>
          {Object.entries(safeCustomerDetails).map(([key, value]) => {
            if (['name', 'email', 'dial_code', 'phone_number', 'profile_pic'].includes(key)) return null;

            let formattedValue = value;

            if (key === 'registered_date' && typeof value === 'string') {
              formattedValue = new Date(value).toLocaleDateString(undefined, {
                year: "numeric",
                month: "long",
                day: "numeric",
              });
            }

            if (Array.isArray(value)) {
              formattedValue = value.join(', ');
            }

            return (
              <View style={styles.row} key={key}>
                <Text style={styles.label}>{formatLabel(key)}</Text>
                <Text style={styles.value}>: {formattedValue}</Text>
              </View>
            );
          })}
        </View>
      </Page>

      <Page size="A4" style={styles.page}>
        {/* Vehicle Details */}
        <View style={styles.header}>
          <Text style={styles.sectionTitle}>Vehicle Purchased</Text>
        </View>

        <View style={styles.section}>
          {safeCarDetails.image && (
            <Image 
              src={safeCarDetails.image} 
              style={styles.carImage} 
              alt={`${safeCarDetails.title} ${safeCarDetails.carmodel}`}
            />
          )}
          
          {Object.entries(safeCarDetails).map(([key, value]) => {
            if (key === "image") return null;

            if (key === "average_rating" && !isNaN(value)) {

              return (
                <View style={styles.row} key={key}>
                  <Text style={styles.label}>{formatLabel(key)}:</Text>
                  <Text style={styles.value}>: ({(Number(value)).toFixed(1)} / 5.0)</Text>
                  </View>
              );
            }

            return (
              <View style={styles.row} key={key}>
                <Text style={styles.label}>{formatLabel(key)}</Text>
                <Text style={styles.value}>: {formatValue(key, value)}</Text>
                </View>
            );
          })}
        </View>
      </Page>

      <Page size="A4" style={styles.page}>
        {/* Payment Details */}
        <View style={styles.header}>
          <Text style={styles.sectionTitle}>Payment Information</Text>
        </View>

        <View style={styles.section}>
          <View style={styles.table}>
            <View style={[styles.tableRow, styles.tableHeader]}>
              <View style={styles.tableCol}><Text>Description</Text></View>
              <View style={styles.tableCol}><Text>Quantity</Text></View>
              <View style={styles.tableCol}><Text>Unit Price</Text></View>
              <View style={styles.tableCol}><Text>Amount</Text></View>
            </View>
            
            <View style={styles.tableRow}>
              <View style={styles.tableCol}>
                <Text>{safeCarDetails.title} {safeCarDetails.carmodel}</Text>
              </View>
              <View style={styles.tableCol}><Text>1</Text></View>
              <View style={styles.tableCol}>
                <Text>${safeCarDetails.price.toLocaleString()}</Text>
              </View>
              <View style={styles.tableCol}>
                <Text>${safeCarDetails.price.toLocaleString()}</Text>
              </View>
            </View>
            
            <View style={styles.tableRow}>
              <View style={styles.tableCol}><Text>Sales Tax (8%)</Text></View>
              <View style={styles.tableCol}><Text>1</Text></View>
              <View style={styles.tableCol}>
                <Text>${(safeCarDetails.price * 0.08).toLocaleString(undefined, { maximumFractionDigits: 2 })}</Text>
              </View>
              <View style={styles.tableCol}>
                <Text>${(safeCarDetails.price * 0.08).toLocaleString(undefined, { maximumFractionDigits: 2 })}</Text>
              </View>
            </View>
            
            <View style={styles.tableRow}>
              <View style={styles.tableCol}><Text>Delivery Fee</Text></View>
              <View style={styles.tableCol}><Text>1</Text></View>
              <View style={styles.tableCol}><Text>$500.00</Text></View>
              <View style={styles.tableCol}><Text>$500.00</Text></View>
            </View>
          </View>
          
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total:</Text>
            <Text style={styles.totalValue}>
              ${(safeCarDetails.price * 1.08 + 500).toLocaleString(undefined, { maximumFractionDigits: 2 })}
            </Text>
          </View>
        </View>

        {qrCodeDataUrl && (
          <View style={styles.qrContainer}>
            <Image src={qrCodeDataUrl} style={styles.qrImage} alt="QR Code" />
            <Text style={styles.qrText}>Scan to view this document online</Text>
          </View>
        )}

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

        <View style={styles.footer}>
          <Text>Thank you for your business! • {new Date().getFullYear()} © AutoDealer Inc.</Text>
        </View>
      </Page>
    </Document>
  );
};

export default PdfGenerator;