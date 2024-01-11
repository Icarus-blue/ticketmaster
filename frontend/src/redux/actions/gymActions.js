import { apis } from "../../apis";
import { GET_GYMS } from "../actionTypes";
import { store } from "../store";

export const initGyms = async () => {
  try {
    const res = await apis.getGyms();
    console.log("init Gyms->");
    store.dispatch({
      type: GET_GYMS,
      payload: res.data.gyms,
    });
  } catch (error) {
    console.log(error);
  }
};
