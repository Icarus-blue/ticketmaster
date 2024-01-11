import { enqueueSnackbar } from "notistack";
import { apis } from "../../apis";
import { LOGIN_SUCCESS } from "../actionTypes";
import { store } from "../store";

export const getUserInfor = async (logout) => {
  try {
    const {
      data: {
        data: { user },
      },
    } = await apis.getUserInfor();
    store.dispatch({
      type: LOGIN_SUCCESS,
      payload: user,
    });
  } catch (error) {
    logout();
    enqueueSnackbar({
      variant: "error",
      message: "Token expired or invalid",
    });
  }
};
