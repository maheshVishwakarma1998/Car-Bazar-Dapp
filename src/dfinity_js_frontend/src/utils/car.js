import { transferICP } from "./ledger";

export async function getCars() {
  try {
    return await window.canister.car.getCars();
  } catch (err) {
    if (err.name === "AgentHTTPResponseError") {
      const authClient = window.auth.client;
      await authClient.logout();
    }
    return [];
  }
}

export async function getReservationFee() {
  try {
    return await window.canister.car.getReservationFee();
  } catch (err) {
    if (err.name === "AgentHTTPResponseError") {
      const authClient = window.auth.client;
      await authClient.logout();
    }
    return [];
  }
}

export async function addCar(car) {
  const result = await window.canister.car.addCar(car);

  if (result.Err) {
    let error = Object.entries(result.Err);
    let errorMsg = `${error[0][0]} : ${error[0][1]}`;
    throw new Error(errorMsg);
  }

  return result.Ok;
}

export async function makeReservation(id, noOfCars) {
  const carCanister = window.canister.car;
  const orderResponse = await carCanister.createReservationOrder(
    id,
    noOfCars
  );
  if (orderResponse.Err) {
    let error = Object.entries(orderResponse.Err);
    let errorMsg = `${error[0][0]} : ${error[0][1]}`;
    throw new Error(errorMsg);
  }
  const canisterAddress = await carCanister.getCanisterAddress();
  const block = await transferICP(
    canisterAddress,
    orderResponse.Ok.amount,
    orderResponse.Ok.memo
  );
  const result = await carCanister.completeReservation(
    id,
    noOfCars,
    block,
    orderResponse.Ok.memo
  );
  if (result.Err) {
    let error = Object.entries(result.Err);
    let errorMsg = `${error[0][0]} : ${error[0][1]}`;
    throw new Error(errorMsg);
  }
  return result.Ok;
}

export async function endReservation(id) {
  const result = await window.canister.car.endReservation(id);
  if (result.Err) {
    let error = Object.entries(result.Err);
    let errorMsg = `${error[0][0]} : ${error[0][1]}`;
    throw new Error(errorMsg);
  }

  return result.Ok;
}

export async function deleteCar(id) {
  const result = await window.canister.car.deleteCar(id);
  if (result.Err) {
    let error = Object.entries(result.Err);
    let errorMsg = `${error[0][0]} : ${error[0][1]}`;
    throw new Error(errorMsg);
  }
  return result.Ok;
}
