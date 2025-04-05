import React, { useState, useEffect } from "react";
import { Document, Page, Text, View, StyleSheet, Image, Font } from "@react-pdf/renderer";
import QRCode from "qrcode";

// Register fonts for better typography
Font.register({
  family: 'Roboto',
  fonts: [
    { src: 'https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-light-webfont.ttf', fontWeight: 300 },
    { src: 'https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-regular-webfont.ttf', fontWeight: 400 },
    { src: 'https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-medium-webfont.ttf', fontWeight: 500 },
    { src: 'https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-bold-webfont.ttf', fontWeight: 700 },
  ]
});

const PdfGenerator = ({ carDetails = {}, customerDetails = {}, paymentDetails = {}, pdfUrl = "" }) => {
  const [profilePicDataUrl, setProfilePicDataUrl] = useState("");
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState("");
  const [carImageDataUrl, setCarImageDataUrl] = useState("");
  const [logoDataUrl, setLogoDataUrl] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  // Function to convert image URL to data URL
  const convertImageToDataUrl = (imageUrl, fallbackUrl) => {
    return new Promise((resolve) => {
      if (!imageUrl) {
        console.log('No image URL provided, using fallback:', fallbackUrl);
        resolve(fallbackUrl);
        return;
      }

      console.log('Converting image to data URL:', imageUrl);
      const img = new window.Image();
      img.crossOrigin = "Anonymous";
      
      img.onload = () => {
        try {
          const canvas = document.createElement("canvas");
          canvas.width = img.width;
          canvas.height = img.height;
          const ctx = canvas.getContext("2d");
          ctx.drawImage(img, 0, 0);
          const dataUrl = canvas.toDataURL("image/jpeg");
          console.log('Successfully converted image to data URL');
          resolve(dataUrl);
        } catch (e) {
          console.error("Error converting image to data URL:", e);
          resolve(fallbackUrl);
        }
      };
      
      img.onerror = (error) => {
        console.error("Error loading image:", imageUrl, error);
        resolve(fallbackUrl);
      };
      
      img.src = imageUrl;
    });
  };

  // Load all images in parallel
  useEffect(() => {
    const loadAllImages = async () => {
      setIsLoading(true);
      try {
        console.log('Starting to load all images');
        
        // Load profile picture
        const profilePicUrl = customerDetails.profile_pic || "https://via.placeholder.com/80x80?text=Profile";
        console.log('Loading profile picture from:', profilePicUrl);
        const profilePicData = await convertImageToDataUrl(profilePicUrl, "https://via.placeholder.com/80x80?text=Profile");
        setProfilePicDataUrl(profilePicData);
        
        // Load car image
        const carImageUrl = carDetails.image || "https://via.placeholder.com/300x200?text=Car+Image";
        console.log('Loading car image from:', carImageUrl);
        const carImageData = await convertImageToDataUrl(carImageUrl, "https://via.placeholder.com/300x200?text=Car+Image");
        setCarImageDataUrl(carImageData);
        
        // Load logo
        const logoUrl = "https://via.placeholder.com/200x80?text=CARMELA";
        console.log('Loading logo from:', logoUrl);
        const logoData = await convertImageToDataUrl(logoUrl, "https://via.placeholder.com/200x80?text=CARMELA");
        setLogoDataUrl(logoData);
        
        // Generate QR code
        if (pdfUrl) {
          console.log('Generating QR code for URL:', pdfUrl);
          const qrData = await QRCode.toDataURL(pdfUrl, {
            width: 150,
            margin: 1,
            color: {
              dark: '#000000',
              light: '#ffffff'
            }
          });
          setQrCodeDataUrl(qrData);
          console.log('QR code generated successfully');
        }
        
        console.log('All images loaded successfully');
      } catch (error) {
        console.error('Error loading images:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadAllImages();
  }, [carDetails.image, customerDetails.profile_pic, pdfUrl]);

  // Create safe versions of the data to prevent errors
  const safeCarDetails = {
    title: carDetails.title || "N/A",
    carmodel: carDetails.carmodel || "N/A",
    price: carDetails.price || 0,
    color: carDetails.color || "N/A",
    mileage: carDetails.mileage || 0,
    year: carDetails.year || "N/A",
    condition: carDetails.condition || "N/A",
    image: carImageDataUrl || "https://via.placeholder.com/300x200?text=Car+Image"
  };

  const safeCustomerDetails = {
    name: customerDetails.name || "N/A",
    email: customerDetails.email || "N/A",
    phone_number: customerDetails.phone_number || "N/A",
    profile_pic: profilePicDataUrl || "https://via.placeholder.com/80x80?text=Profile",
    registered_date: customerDetails.registered_date || "N/A",
    balance: customerDetails.balance || 0,
    cars_count: customerDetails.cars_count || 0,
    cars: customerDetails.cars || []
  };

  const safePaymentDetails = {
    transactionId: paymentDetails.transactionId || "N/A",
    amount: paymentDetails.amount || 0,
    date: paymentDetails.date || new Date().toISOString()
  };

  // Format date function
  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      console.error('Error formatting date:', error);
      return "N/A";
    }
  };

  // If still loading, return a simple document
  if (isLoading) {
    return (
      <Document>
        <Page size="A4" style={styles.page}>
          <Text style={styles.loadingText}>Loading PDF content...</Text>
        </Page>
      </Document>
    );
  }

  return (
    <Document>
      {/* Page 1: Customer Information */}
      <Page size="A4" style={styles.page}>
        {/* Watermark */}
        <Text style={styles.watermark}>CARMELA</Text>
        
        {/* Header with Logo */}
        <View style={styles.header}>
          {logoDataUrl && <Image src={logoDataUrl} style={styles.logo} />}
          <View style={styles.headerText}>
            <Text style={styles.title}>Purchase Confirmation</Text>
            <Text style={styles.subtitle}>Transaction ID: {safePaymentDetails.transactionId}</Text>
          </View>
        </View>

        {/* Customer Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Customer Information</Text>
          <View style={styles.customerHeader}>
            {safeCustomerDetails.profile_pic && (
              <Image 
                src={safeCustomerDetails.profile_pic} 
                style={styles.profilePic} 
              />
            )}
            <View style={styles.customerInfo}>
              <View style={styles.row}>
                <Text style={styles.label}>Name:</Text>
                <Text style={styles.value}>{safeCustomerDetails.name}</Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.label}>Email:</Text>
                <Text style={styles.value}>{safeCustomerDetails.email}</Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.label}>Phone:</Text>
                <Text style={styles.value}>{safeCustomerDetails.phone_number}</Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.label}>Joining Date:</Text>
                <Text style={styles.value}>{formatDate(safeCustomerDetails.registered_date)}</Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.label}>Balance:</Text>
                <Text style={styles.value}>${safeCustomerDetails.balance?.toLocaleString() || "0.00"}</Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.label}>Cars Count:</Text>
                <Text style={styles.value}>{safeCustomerDetails.cars_count}</Text>
              </View>
            </View>
          </View>
          
          {/* Cars List */}
          {safeCustomerDetails.cars && safeCustomerDetails.cars.length > 0 && (
            <View style={styles.carsListContainer}>
              <Text style={styles.carsListTitle}>Previous Cars:</Text>
              {safeCustomerDetails.cars.map((car, index) => (
                <Text key={index} style={styles.carListItem}>
                  • {car}
                </Text>
              ))}
            </View>
          )}
        </View>

        {/* Page Number */}
        <Text style={styles.pageNumber} render={({ pageNumber, totalPages }) => (
          `${pageNumber} / ${totalPages}`
        )} />
      </Page>

      {/* Page 2: Vehicle Information */}
      <Page size="A4" style={styles.page}>
        {/* Watermark */}
        <Text style={styles.watermark}>CARMELA</Text>
        
        {/* Header with Logo */}
        <View style={styles.header}>
          {logoDataUrl && <Image src={logoDataUrl} style={styles.logo} />}
          <View style={styles.headerText}>
            <Text style={styles.title}>Vehicle Information</Text>
            <Text style={styles.subtitle}>Transaction ID: {safePaymentDetails.transactionId}</Text>
          </View>
        </View>

        {/* Car Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Vehicle Details</Text>
          
          {/* Car Image */}
          <View style={styles.carImageContainer}>
            {safeCarDetails.image && (
              <Image 
                src={safeCarDetails.image} 
                style={styles.carImage} 
              />
            )}
          </View>
          
          {/* Car Details */}
          <View style={styles.carDetailsContainer}>
            <View style={styles.carDetailItem}>
              <Text style={styles.carDetailLabel}>Make & Model</Text>
              <Text style={styles.carDetailValue}>
                {safeCarDetails.title} {safeCarDetails.carmodel}
              </Text>
            </View>
            <View style={styles.carDetailItem}>
              <Text style={styles.carDetailLabel}>Price</Text>
              <Text style={styles.carDetailValue}>
                ${safeCarDetails.price?.toLocaleString() || "N/A"}
              </Text>
            </View>
            <View style={styles.carDetailItem}>
              <Text style={styles.carDetailLabel}>Color</Text>
              <Text style={styles.carDetailValue}>
                {safeCarDetails.color}
              </Text>
            </View>
            <View style={styles.carDetailItem}>
              <Text style={styles.carDetailLabel}>Mileage</Text>
              <Text style={styles.carDetailValue}>
                {safeCarDetails.mileage ? `${safeCarDetails.mileage.toLocaleString()} miles` : "N/A"}
              </Text>
            </View>
            <View style={styles.carDetailItem}>
              <Text style={styles.carDetailLabel}>Year</Text>
              <Text style={styles.carDetailValue}>
                {safeCarDetails.year}
              </Text>
            </View>
            <View style={styles.carDetailItem}>
              <Text style={styles.carDetailLabel}>Condition</Text>
              <Text style={styles.carDetailValue}>
                {safeCarDetails.condition}
              </Text>
            </View>
          </View>
        </View>

        {/* Page Number */}
        <Text style={styles.pageNumber} render={({ pageNumber, totalPages }) => (
          `${pageNumber} / ${totalPages}`
        )} />
      </Page>

      {/* Page 3: Payment Information */}
      <Page size="A4" style={styles.page}>
        {/* Watermark */}
        <Text style={styles.watermark}>CARMELA</Text>
        
        {/* Header with Logo */}
        <View style={styles.header}>
          {logoDataUrl && <Image src={logoDataUrl} style={styles.logo} />}
          <View style={styles.headerText}>
            <Text style={styles.title}>Payment Details</Text>
            <Text style={styles.subtitle}>Transaction ID: {safePaymentDetails.transactionId}</Text>
          </View>
        </View>

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

        {/* QR Code */}
        {qrCodeDataUrl && (
          <View style={styles.qrContainer}>
            <Text style={styles.qrText}>Scan to view this document online</Text>
            <Image src={qrCodeDataUrl} style={styles.qrImage} />
          </View>
        )}



        {/* Signature Line */}
        <View style={styles.signatureLine}>
          <Text style={styles.signatureText}>Authorized Signature</Text>
        </View>

        {/* Footer */}
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

        {/* Page Number */}
        <Text style={styles.pageNumber} render={({ pageNumber, totalPages }) => (
          `${pageNumber} / ${totalPages}`
        )} />
      </Page>
    </Document>
  );
};

const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontFamily: 'Roboto',
    position: 'relative',
  },
  watermark: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: '-50%' }, { translateY: '-50%' }, { rotate: '-45deg' }],
    fontSize: 100,
    color: '#f0f0f0',
    opacity: 0.1,
    zIndex: 0,
  },
  header: {
    flexDirection: 'row',
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    paddingBottom: 10,
    zIndex: 1,
  },
  logo: {
    width: 150,
    height: 60,
    marginRight: 20,
  },
  headerText: {
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
  },
  section: {
    marginBottom: 20,
    zIndex: 1,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    paddingBottom: 5,
  },
  customerHeader: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  profilePic: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 15,
  },
  customerInfo: {
    flex: 1,
  },
  row: {
    flexDirection: 'row',
    marginBottom: 5,
    alignItems: 'center',
    flexWrap: 'nowrap',
  },
  label: {
    width: 120,
    fontWeight: 'bold',
    color: '#555',
    fontSize: 12,
    flexShrink: 0,
    paddingRight: 5,
  },
  value: {
    flex: 1,
    color: '#333',
    fontSize: 12,
    flexShrink: 1,
    numberOfLines: 1,
    ellipsizeMode: 'tail',
  },
  carImageContainer: {
    marginBottom: 15,
    alignItems: 'center',
  },
  carImage: {
    width: 300,
    height: 200,
    resizeMode: 'cover',
  },
  carDetailsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 10,
  },
  carDetailItem: {
    width: '50%',
    marginBottom: 10,
  },
  carDetailLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 2,
  },
  carDetailValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
  table: {
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  tableHeader: {
    backgroundColor: '#f5f5f5',
    fontWeight: 'bold',
  },
  tableCol: {
    flex: 1,
    padding: 8,
    fontSize: 12,
  },
  totalRow: {
    flexDirection: 'row',
    backgroundColor: '#f5f5f5',
    padding: 8,
    fontWeight: 'bold',
  },
  totalLabel: {
    flex: 1,
    fontSize: 14,
  },
  totalValue: {
    fontSize: 14,
  },
  qrContainer: {
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 20,
  },
  qrText: {
    fontSize: 12,
    color: '#666',
    marginBottom: 5,
  },
  qrImage: {
    width: 150,
    height: 150,
  },
  thankYouText: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
    marginBottom: 20,
    color: '#333',
  },
  signatureLine: {
    borderTopWidth: 1,
    borderTopColor: '#000',
    width: 200,
    marginTop: 40,
    marginBottom: 10,
  },
  signatureText: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  footer: {
    fontSize: 10,
    color: '#666',
    textAlign: 'center',
    marginTop: 30,
  },
  pageNumber: {
    position: 'absolute',
    bottom: 30,
    right: 30,
    fontSize: 10,
    color: '#666',
  },
  loadingText: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 200,
  },
  carsListContainer: {
    marginTop: 15,
    padding: 10,
    backgroundColor: '#f9f9f9',
    borderRadius: 4,
  },
  carsListTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  carListItem: {
    fontSize: 12,
    color: '#555',
    marginBottom: 3,
    paddingLeft: 5,
  },
});

export default PdfGenerator;