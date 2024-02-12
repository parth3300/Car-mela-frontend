import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

const DealershipDetails = () => {
  const { id } = useParams();
  const [dealership, setDealership] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/store/dealerships/${id}`);
        setDealership(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!dealership) {
    return <div>Dealership not found</div>;
  }

  return (
    <div>
      <h1 className="text-4xl font-bold mb-8 text-center text-blue-800">
        Dealership Details
      </h1>
      <div>
        <p className="text-gray-600 dark:text-gray-400">
          <strong>Name:</strong> {dealership.dealership_name}
        </p>
        <p className="text-gray-600 dark:text-gray-400">
          <strong>Contact:</strong> {dealership.contact}
        </p>
        <p className="text-gray-600 dark:text-gray-400">
          <strong>Address:</strong> {dealership.address}
        </p>
        <p className="text-gray-600 dark:text-gray-400">
          <strong>Ratings:</strong> {dealership.ratings}
        </p>
      </div>
    </div>
  );
};

export default DealershipDetails;
