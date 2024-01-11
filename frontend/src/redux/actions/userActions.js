import { apis } from "../../apis";
import { GET_USERS } from "../actionTypes";
import { store } from "../store";

export const initUsers = async () => {
  try {
    const res = await apis.getUsers();
    console.log('res',res)
    store.dispatch({
      type: GET_USERS,
      payload: res.data.users,
    });
  } catch (error) {
    console.log(error);
  }
};
