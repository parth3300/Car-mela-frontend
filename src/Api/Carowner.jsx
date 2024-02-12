// Carowners.jsx
import axios from "axios";
import React, { useEffect, useState } from "react";
import CarownersModal from "./CarownersModal";

const Carowners = () => {
  const [carowners, setCarowners] = useState([]);
  const [selectedCarowner, setSelectedCarowner] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8000/store/carowners/"
        );
        setCarowners(response.data);
      } catch (error) {
        console.error("Error fetching data", error);
      }
    };
    fetchData();
  }, []);

  const openModel = (carowner) => {
    setSelectedCarowner(carowner);
  };

  const closeModal = () => {
    setSelectedCarowner(null);
  };

  return (
    <div>
      <h1 className="text-4xl font-bold mb-8 text-center text-blue-800">
        Carowners
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {carowners.map((carowner) => (
          <div
            key={carowner.id}
            className="relative bg-white p-4 rounded-lg shadow-md transition-transform h-[300px] w-[300px] object-cover transform cursor-pointer group hover:scale-105 hover:border-2 border-blue-800"
            onClick={() => openModel(carowner)}
          >
            <img
              src={carowner.profile_pic}
              alt=""
              className="h-full w-full object-cover rounded-lg"
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
              <div>{carowner.name}</div>
              <div className="text-blue-500">CARS {carowner.cars_count}</div>
            </div>
          </div>
        ))}
      </div>
      {selectedCarowner && (
        <CarownersModal
          isOpen={true}
          closeModal={closeModal}
          carowner={selectedCarowner}
        />
      )}
    </div>
  );
};

export default Carowners;
