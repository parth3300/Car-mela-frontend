import { useState, useEffect } from "react";
import { StarIcon } from "@heroicons/react/20/solid";
import { Link, useParams } from "react-router-dom";
import axios from "axios";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

const CarDetails = () => {
  const { id } = useParams();
  const [car, setCar] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8000/store/cars/${id}`
        );
        setCar(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data", error);
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  if (loading) {
    return <div>Loading....</div>;
  }

  if (!car) {
    return <div>Car not found</div>;
  }

  const {
    title,
    company,
    image,
    carmodel,
    color,
    registration_year,
    fuel_type,
    mileage,
    description,
    ratings,
    carowner,
  } = car;
  const formattedPrice = car.price.toLocaleString();
  return (
    <div className="bg-white">
      <div className="flex px-12">
        {/* Car Image */}
        <div className=" flex flex-col   ">
          <img
            src={image}
            alt={`${title} - ${carmodel}`}
            className="!h-[500px] !w-[500px] !max-w-[500px]  !object-cover rounded-xl"
          />
          <div className="mt-5 ">
          <h3 className="text-lg font-medium text-gray-900">
            Customer Reviews
          </h3>
          {car.reviews.length > 0 ? (
            <ul className="mt-4 space-y-4">
              {car.reviews.map((review) => (
                <li key={review.id} className="flex items-center space-x-4">
                </li>
              ))}
            </ul>
          ) : (
            <p>No reviews available</p>
          )}
        </div>
        </div>

        {/* Reviews */}
        
        <div className="mx-auto max-w-2xl px-4 pb-16 pt-10 sm:px-6 lg:grid lg:max-w-7xl lg:grid-cols-3 lg:grid-rows-[auto,auto,1fr] lg:gap-x-8 lg:px-8 lg:pb-24 lg:pt-16">
          <div className="lg:col-span-2 lg:border-r lg:border-gray-200 lg:pr-8">
            <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
              {title} - {carmodel}
            </h1>
          </div>

          <div className="mt-4  lg:row-span-3 lg:mt-0">
            <h2 className="sr-only">Car information</h2>
            <p className="text-3xl tracking-tight text-gray-900">
              ₹ {formattedPrice}
            </p>

            <div className="mt-6">
              <h3 className="sr-only">Ratings</h3>
              <div className="flex items-center">
                <div className="flex items-center">
                  {[1, 2, 3, 4, 5].map((rating) => (
                    <StarIcon
                      key={rating}
                      className={classNames(
                        ratings >= rating ? "text-gray-900" : "text-gray-200",
                        "h-5 w-5 flex-shrink-0"
                      )}
                      aria-hidden="true"
                    />
                  ))}
                </div>
                <p className="sr-only">{ratings} out of 5 stars</p>
              </div>
            </div>

            <form className="mt-5">
              <div>
                <h3 className="text-sm font-medium text-gray-900">
                  Color: <span>{color}</span>
                </h3>

                <div className="flex items-center space-x-3">
                  <div
                    className={classNames(
                      color === "White" ? "ring-gray-400" : "",
                      "relative -m-0.5 flex cursor-pointer items-center justify-center rounded-full p-0.5 focus:outline-none"
                    )}
                  >
                    <span
                      aria-hidden="true"
                      className={classNames(
                        color === "White" ? "bg-white" : "",
                        "h-8 w-8 rounded-full border border-black border-opacity-10"
                      )}
                    />
                  </div>
                </div>
              </div>

              <div className="mt-5">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-medium text-gray-900">Company</h3>
                </div>
                <p className="text-sm text-gray-600">{company}</p>
              </div>
              <div className="mt-5">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-medium text-gray-900">Year</h3>
                </div>
                <p className="text-sm text-gray-600">{registration_year}</p>
              </div>

              <div className="mt-5">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-medium text-gray-900">
                    Fuel Type
                  </h3>
                </div>
                <p className="text-sm text-gray-600">{fuel_type}</p>
              </div>

              <div className="mt-5">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-medium text-gray-900">Mileage</h3>
                </div>
                <p className="text-sm text-gray-600">{mileage} miles</p>
              </div>
              <div className="mt-5">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-medium text-gray-900">
                    Carowner
                  </h3>
                </div>
                <p className="text-sm text-gray-600">
                  {carowner ? carowner.name : "Not Owned Yet"}{" "}
                </p>
              </div>

              <div className="mt-5">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-medium text-gray-900">
                    Dealerships
                  </h3>
                </div>
                <p className="text-gray-600 dark:text-gray-400 ">
                  {car.dealerships.length > 0 ? (
                    <ul>
                      {car.dealerships.map((dealership, index) => (
                        <li key={dealership.id || index}>
                          <strong>{index + 1}.</strong>{" "}
                          <Link
                            to={`/dealerships/${dealership.id}`}
                            className="hover:text-blue-800 transition-all hover:scale-105 hover:border-2"
                          >
                            {dealership.name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    "No dealerships available"
                  )}{" "}
                </p>
              </div>

              <button
                type="submit"
                className="mt-5 flex w-full items-center justify-center rounded-md border border-transparent bg-indigo-600 px-8 py-3 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              >
                Buy Now
              </button>
            </form>
          </div>

          <div className="py-10 lg:col-span-2 lg:col-start-1 lg:border-r lg:border-gray-200 lg:pb-16 lg:pr-8 lg:pt-6">
            <div>
              <h3 className="sr-only">Description</h3>

              <div className="space-y-6">
                <p className="text-base text-gray-900">{description}</p>
              </div>
            </div>
          </div>
        </div>
        
      </div>
    </div>
  );
};

export default CarDetails;
