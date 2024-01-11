import { apis } from "../../apis";
import { SET_CONSTANTS } from "../actionTypes";
import { store } from "../store";

export const getConstants = async () => {
  try {
    const {
      data: {
        data: { countries, currencies, timezones, roles },
      },
    } = await apis.getConstants();
    store.dispatch({
      type: SET_CONSTANTS,
      payload: { countries, currencies, timezones, roles },
    });
  } catch (error) {
  }
};
