import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import StarRating from "../components/StarRating";
// ...

const Dealership = () => {
  const [dealerships, setDealerships] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8000/store/dealerships/"
        );
        setDealerships(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

 
  return (
    <div>
      <h1 className="text-4xl font-bold mb-8 text-center text-blue-800">
        Dealerships
      </h1>
      <div className="grid grid-cols-3 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 bg-white">
        {dealerships.map((dealership) => (
          <Link
            key={dealership.id}
            to={`/dealerships/${dealership.id}`}
            className="relative bg-white p-4 rounded-lg shadow-md transition-transform transform cursor-pointer group hover:scale-105 hover:border-2 border-blue-800"
          >
            <div>
              <div className="relative group-hover:bg-black bg-opacity-100">
                <img
                  className="rounded-t-lg object-cover mb-4 w-full transition-opacity group-hover:opacity-70"
                  src="https://via.placeholder.com/800x600/2d2d2d"
                  alt={`Dealership ${dealership.id}`}
                />
                <div
                  className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white text-2xl font-bold text-center opacity-0 transition-opacity group-hover:opacity-100"
                  style={{
                    fontSize: "2vw",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                  }}
                >
                  <div>{dealership.dealership_name}</div>
                  <div>
                    {" "}
                    <StarRating rating={parseFloat(dealership.ratings)} />
                  </div>
                </div>
              </div>

            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Dealership;
