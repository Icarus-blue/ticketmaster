import { GET_GYMS } from "../actionTypes";

const initialState = {
  gyms: [],
};

export const gymReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_GYMS:
      return {
        ...state,
        gyms: action.payload,
      };
    default:
      return state;
  }
};
