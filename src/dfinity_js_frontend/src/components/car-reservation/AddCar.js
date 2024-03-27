import React, { useCallback, useState } from "react";
import PropTypes from "prop-types";
import { Button, FloatingLabel, Form, Modal } from "react-bootstrap";
import { LoadingButton } from "@mui/lab";

// import { stringToMicroAlgos } from "../../utils/conversions";

const addCar = ({ createNewCar, loading }) => {
  const [name, setName] = useState("");
  const [imageUrl, setImage] = useState("");
  const [model, setModel] = useState("");
  const [price, setPrice] = useState(0);
  const [companyName, setCompanyName] = useState("");
  const [topSpeed, setTopSpeed] = useState(0);

  const isFormFilled = useCallback(() => {
    return name && imageUrl && model && companyName && topSpeed && price > 0;
  }, [name, imageUrl, model, companyName, topSpeed, price]);

  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <>
      <Button
        onClick={handleShow}
        variant="dark"
        className="rounded-pill px-0"
        style={{ width: "38px" }}
      >
        <i className="bi bi-plus"></i>
      </Button>
      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>New Car</Modal.Title>
        </Modal.Header>
        <Form>
          <Modal.Body>
            <FloatingLabel
              controlId="inputName"
              label="Car name"
              className="mb-3"
            >
              <Form.Control
                type="text"
                onChange={(e) => {
                  setName(e.target.value);
                }}
                placeholder="Enter Car name"
              />
            </FloatingLabel>
            <FloatingLabel
              controlId="inputUrl"
              label="Image URL"
              className="mb-3"
            >
              <Form.Control
                type="text"
                placeholder="Image URL"
                value={imageUrl}
                onChange={(e) => {
                  setImage(e.target.value);
                }}
              />
            </FloatingLabel>
            <FloatingLabel
              controlId="inputModel"
              label="Model"
              className="mb-3"
            >
              <Form.Control
                as="textarea"
                placeholder="model"
                style={{ height: "80px" }}
                max={115}
                onChange={(e) => {
                  setDescription(e.target.value);
                }}
              />
            </FloatingLabel>
            <FloatingLabel
              controlId="inputCompanyName"
              label="CompanyName"
              className="mb-3"
            >
              <Form.Control
                as="textarea"
                placeholder="companyName"
                style={{ height: "80px" }}
                max={115}
                onChange={(e) => {
                  setDescription(e.target.value);
                }}
              />
            </FloatingLabel>
            <FloatingLabel
              controlId="inputTopSpeed"
              label="TopSpeed"
              className="mb-3"
            >
              <Form.Control
                as="textarea"
                placeholder="topSpeed"
                style={{ height: "80px" }}
                max={115}
                onChange={(e) => {
                  setDescription(e.target.value);
                }}
              />
            </FloatingLabel>
            <FloatingLabel
              controlId="inputPrice"
              label="Price Per Car in ICP"
              className="mb-3"
            >
              <Form.Control
                type="text"
                placeholder="Price"
                onChange={(e) => {
                  setPrice(e.target.value);
                }}
              />
            </FloatingLabel>
          </Modal.Body>
        </Form>
        <Modal.Footer>
          <Button variant="outline-secondary" onClick={handleClose}>
            Close
          </Button>
          <Button
            variant="dark"
            disabled={!isFormFilled()}
            onClick={() => {
              createNewCar({
                name,
                imageUrl,
                model,
                price,
              });
              handleClose();
            }}
          >
            Save new Car
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

addCar.propTypes = {
  createNewCar: PropTypes.func.isRequired,
};

export default addCar;
