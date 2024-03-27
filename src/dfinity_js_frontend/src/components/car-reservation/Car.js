import React, { useState } from "react";
import PropTypes from "prop-types";
import {
  Badge,
  Button,
  Card,
  Col,
  FloatingLabel,
  Form,
  Stack,
} from "react-bootstrap";
import {
  truncateAddress,
  convertTime,
  formatE8s,
} from "../../utils/conversions";
import Identicon from "../utils/Identicon";
import { Principal } from "@dfinity/principal";
import { deleteCar } from "../../utils/car";

const Car = ({ car, makeReservation, endReservation, deleteCar }) => {
  const {
    id,
    name,
    imageUrl,
    model,
    price,
    companyName,
    toSpeed,
    currentReservedTo,
    currentReservationEnds,
    isReserved,
    creator,
  } = car;
  const [noOfCars, setNoOfCars] = useState(1);
  const principal = window.auth.principalText;
  const isCreator = () => Principal.from(creator).toString() === principal;

  const reservationEnded = () => {
    let now = new Date();
    let endTime = new Date(Number(currentReservationEnds[0] / BigInt(10 ** 6)));
    return now >= endTime;
  };
  return (
    <Col key={id}>
      <Card className="h-100">
        <Card.Header>
          <Stack direction="horizontal" gap={2}>
            <Identicon
              size={28}
              address={
                currentReservedTo.length > 0
                  ? Principal.from(currentReservedTo[0]).toString()
                  : Principal.from(creator).toString()
              }
            />
            <span className="font-monospace text-secondary">
              {currentReservedTo.length > 0 ? (
                truncateAddress(Principal.from(currentReservedTo[0]).toString())
              ) : (
                <></>
              )}
            </span>
            <Badge bg="secondary" className="ms-auto">
              {isReserved ? "RESERVED" : "AVAILABLE"}
            </Badge>
          </Stack>
        </Card.Header>
        <div className="ratio ratio-4x3">
          <img src={imageUrl} alt={name} style={{ objectFit: "cover" }} />
        </div>
        <Card.Body className="d-flex flex-column text-center">
          <Card.Title>{name}</Card.Title>
          <Card.Text className="flex-grow-1">{model}</Card.Text>
          <Card.Text className="flex-grow-1">
            {currentReservationEnds.length > 0
              ? `Reservation ends: ${convertTime(currentReservationEnds[0])}`
              : ""}
          </Card.Text>
          <Form className="d-flex align-content-stretch flex-row gap-2">
            {Principal.from(
              currentReservedTo[0] ? currentReservedTo[0] : creator
            ).toString() === principal && isReserved ? (
              <Button
                variant="outline-dark"
                onClick={() => endReservation(id)}
                disabled={!reservationEnded()}
                className="w-100 py-3"
              >
                End Reservation
              </Button>
            ) : isReserved ? (
              <>
                <Button
                  variant="outline-dark"
                  disabled={isReserved}
                  className="w-100 py-3"
                >
                  Reserved
                </Button>
              </>
            ) : (
              <>
                <FloatingLabel
                  controlId="inputCount"
                  label="Cars"
                  className="w-25"
                >
                  <Form.Control
                    type="number"
                    value={noOfCars}
                    min="1"
                    disabled={isReserved || isCreator()}
                    onChange={(e) => {
                      setNoOfPersons(Number(e.target.value));
                    }}
                  />
                </FloatingLabel>
                <Button
                  variant="outline-dark"
                  disabled={isReserved || isCreator()}
                  onClick={() => makeReservation(id, noOfCars)}
                  className="w-75 py-3"
                >
                  {isCreator()
                    ? "Owner cannot reserve car"
                    : `Reserve for ${
                        formatE8s(price) * noOfCars
                      } ICP`}
                </Button>
              </>
            )}
            {isCreator() && (
              <Button
                variant="outline-danger"
                onClick={() => deleteCar(id)}
                className="btn"
              >
                <i className="bi bi-trash"></i>
              </Button>
            )}
          </Form>
        </Card.Body>
      </Card>
    </Col>
  );
};

Car.propTypes = {
  car: PropTypes.instanceOf(Object).isRequired,
  makeReservation: PropTypes.func.isRequired,
  endReservation: PropTypes.func.isRequired,
  deleteCar: PropTypes.func.isRequired,
};

export default Car;
