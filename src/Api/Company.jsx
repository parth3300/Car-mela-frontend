// CompanyList.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import CompanyModal from "./CompanyModal";

const Company = () => {
  const [companies, setCompanies] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8000/store/companies/"
        );
        setCompanies(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const openModal = (company) => {
    setSelectedCompany(company);
  };

  const closeModal = () => {
    setSelectedCompany(null);
  };

  return (
    <div className="bg-gray-100 min-h-screen p-8">
      <h1 className="text-4xl font-bold mb-8 text-center text-blue-800">
        Company List
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {companies.map((company) => (
          <div
            key={company.id}
            id={`company-${company.id}`}
            className="relative bg-white p-4 rounded-lg shadow-md transition-transform transform cursor-pointer group hover:scale-105 hover:border-2 border-blue-800"
            onClick={() => openModal(company)}
          >
            <div className="relative group-hover:bg-black bg-opacity-100">
              <img
                className="rounded-t-lg object-cover mb-4 w-full transition-opacity group-hover:opacity-70"
                src={company.logo}
                alt={`Company ${company.title}`}
              />
              <div className="text-white text-2xl font-bold text-center">
                {company.title}
              </div>
            </div>
          </div>
        ))}
      </div>

      {selectedCompany && (
        <CompanyModal
          isOpen={!!selectedCompany}
          closeModal={closeModal}
          company={selectedCompany}
        />
      )}
    </div>
  );
};

export default Company;
