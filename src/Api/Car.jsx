// Car.js
import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import StarRating from "../components/StarRating";

const Car = () => {
  const [car, setCar] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:8000/store/cars/");
        setCar(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="bg-gray-100 min-h-screen p-8">
      <h1 className="text-4xl font-bold mb-8 text-center text-blue-800">
        Car List
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {car.map((car) => (
          <Link
            key={car.id}
            to={`/cars/${car.id}`}
            className="relative bg-white p-4 rounded-lg shadow-md transition-transform transform cursor-pointer group hover:scale-105 hover:0"
          >
            <div className="relative group-hover:bg-black bg-opacity-100">
              <img
                className="relative bg-white p-4 rounded-lg shadow-md transition-transform h-[300px] w-[300px] object-cover transform cursor-pointer group hover:scale-105 hover:border-2 border-blue-800"
                src={car.image}
                alt={`Car ${car.id}`}
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
                <div>{car.title}</div>
                <div>₹{car.price}</div>
                <div><StarRating rating={parseFloat(car.ratings)} /></div>
                <div className=" text-blue-500">
                  {car.carowner ? car.carowner.name : ""}
                </div>
              </div>
            </div>

          </Link>
        ))}
      </div>
    </div>
  );
};

export default Car;
