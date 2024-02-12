import React, { useRef, useEffect } from "react";
import { Link } from "react-router-dom";

const CompanyModal = ({ isOpen, closeModal, company }) => {
  const modalRef = useRef();

  useEffect(() => {
    const focusModal = () => {
      if (modalRef.current) {
        setTimeout(() => {
          requestAnimationFrame(() => {
            modalRef.current.focus();
          });
        }, 0);
      }
    };

    if (isOpen) {
      focusModal();
    }
  }, [isOpen]);

  const handleOverlayClick = (event) => {
    if (event.target.classList.contains("modal-overlay")) {
      closeModal();
    }
  };

  if (!company) {
    return null;
  }

  return (
    <div
      className="fixed top-0 left-0 w-full h-full bg-gray-800 bg-opacity-75 flex items-center justify-center z-50 modal-overlay"
      onClick={handleOverlayClick}
      tabIndex={-1}
    >
      <div
        className="bg-white p-8 rounded-lg max-w-md w-full overflow-y-auto"
        autoFocus
        ref={modalRef}
        style={{ maxHeight: "80vh" }}
      >
        <h2 className="text-3xl font-bold mb-4 text-blue-800">
          {company.title}
        </h2>
        <div className="mb-4">
          <img
            className="rounded-t-lg object-cover w-full transition-opacity group-hover:opacity-70"
            src={company.logo}
            alt={company.title}
          />
        </div>

        <div className="mb-4">
          <p className="text-gray-600 dark:text-gray-400">
            <strong>Country:</strong> {company.country}
          </p>
          <p className="text-gray-600 dark:text-gray-400">
            <strong>Since:</strong> {company.since}
          </p>
          <p className="text-gray-600 dark:text-gray-400">
            <strong>Listed Cars:</strong>{" "}
            {company.listed_cars.length > 0 ? (
              <ul>
                {company.listed_cars.map((car, index) => (
                  <li key={car.id || index}>
                    <strong>{index + 1}.</strong>{" "}
                    <Link to={`/cars/${car.id}`}
                     className="hover:text-blue-800 transition-all hover:scale-105 hover:border-2">
                      {car.title}
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              "No listed cars available."
            )}
          </p>
        </div>
      </div>
    </div>
  );
};

export default CompanyModal;
