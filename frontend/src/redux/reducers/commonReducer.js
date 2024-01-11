import {
  API_REQUEST,
  ERROR_RESPONSE,
  SET_COMMON_STATUS,
  SET_CONSTANTS,
  SET_LOADING,
  SUCCESS_RESPONSE,
} from "../actionTypes";

const initialState = {
  isLoading: false,
  error: false,
  message: "",
  countries: [],
  timezones: [],
  roles: [],
  currencies: [],
};

export const commonReducer = (state = initialState, action) => {
  switch (action.type) {
    case API_REQUEST:
      return {
        ...state,
        isLoading: true,
        error: false,
        message: "",
      };
    case SUCCESS_RESPONSE:
      return {
        ...state,
        isLoading: false,
        error: false,
        message: action.payload,
      };
    case ERROR_RESPONSE:
      return {
        ...state,
        isLoading: false,
        error: true,
        message: action.payload,
      };
    case SET_COMMON_STATUS:
      return {
        ...state,
        isLoading: action.payload[0],
        error: action.payload[1],
        message: action.payload[2],
      };
    case SET_LOADING:
      return {
        ...state,
        isLoading: action.payload,
      };
    case SET_CONSTANTS:
      return {
        ...state,
        countries: action.payload.countries,
        timezones: action.payload.timezones,
        roles: action.payload.roles,
        currencies: action.payload.currencies,
      };
    default:
      return state;
  }
};
