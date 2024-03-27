import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import AddCar from "./AddCar";
import Car from "./Car";
import Loader from "../utils/Loader";
import { NotificationError, NotificationSuccess } from "../utils/Notifications";
import {
  getCars as getCarList,
  getReservationFee as getFee,
  addCar as addCar,
  makeReservation as makeReservationAction,
  endReservation as endReservationAction,
  deleteCar as deletecarAction,
} from "../../utils/car";
import PropTypes from "prop-types";
import { Row } from "react-bootstrap";
import { formatE8s } from "../../utils/conversions";

const Cars = ({ fetchBalance }) => {
  const [cars, setCars] = useState([]);
  const [reservationFee, setReservationFee] = useState(0);
  const [loading, setLoading] = useState(false);

  const getCars = async () => {
    setLoading(true);
    getCarList()
      .then((cars) => {
        if (cars) {
          setCars(cars);
        }
      })
      .catch((error) => {
        console.log(error);
      })
      .finally((_) => {
        setLoading(false);
      });
  };

  const getReservationFee = async () => {
    setLoading(true);
    getFee()
      .then((fee) => {
        if (fee) {
          setReservationFee(fee);
        }
      })
      .catch((error) => {
        console.log(error);
      })
      .finally((_) => {
        setLoading(false);
      });
  };

  useEffect(() => {
    getCars();
    getReservationFee();
  }, []);

  const createNewCar = async (data) => {
    setLoading(true);
    const priceStr = data.price;
    data.price = parseInt(priceStr, 10) * 10 ** 8;
    addCar(data)
      .then(() => {
        toast(<NotificationSuccess text="Car added successfully." />);
        getCars();
        fetchBalance();
      })
      .catch((error) => {
        console.log(error);
        toast(<NotificationError text="Failed to create car." />);
        setLoading(false);
      });
  };

  const makeReservation = async (car, noOfCars) => {
    setLoading(true);
    makeReservationAction(car, noOfCars)
      .then(() => {
        toast(<NotificationSuccess text="Reservation made successfully" />);
        getCars();
        fetchBalance();
      })
      .catch((error) => {
        console.log(error);
        toast(<NotificationError text="Failed to make reservation." />);
        setLoading(false);
      });
  };

  const endReservation = async (id) => {
    setLoading(true);
    endReservationAction(id)
      .then(() => {
        toast(<NotificationSuccess text="Reservation ended successfully" />);
        getCars();
        fetchBalance();
      })
      .catch((error) => {
        console.log(error);
        toast(<NotificationError text="Failed to end reservation." />);
        setLoading(false);
      });
  };

  const deleteCar = async (id) => {
    setLoading(true);
    deletecarAction(id)
      .then(() => {
        toast(<NotificationSuccess text="Car deleted successfully" />);
        getCars();
        fetchBalance();
      })
      .catch((error) => {
        console.log(error);
        toast(<NotificationError text="Failed to delete car." />);
        setLoading(false);
      });
  };

  if (loading) {
    return <Loader />;
  }
  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="fs-4 fw-bold mb-0 text-light">
          Best Deals With Cars{" "}
        </h1>
        <AddCar createNewCar={createNewCar} />
      </div>
      <div className="mb-3 text-light">
        <i className="bi bi-bell-fill"></i> Holding fee for any reservation is{" "}
        {formatE8s(reservationFee)} ICP.
      </div>
      <Row xs={1} sm={2} lg={3} className="g-3 mb-5 g-xl-4 g-xxl-5">
        <>
          {cars.map((car, index) => (
            <Car
              car={car}
              makeReservation={makeReservation}
              endReservation={endReservation}
              deleteCar={deleteCar}
              key={index}
            />
          ))}
        </>
      </Row>
    </>
  );
};

Cars.propTypes = {
  fetchBalance: PropTypes.func.isRequired,
};

export default Cars;
