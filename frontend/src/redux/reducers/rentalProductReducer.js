import {
  SET_ASSETS,
  SET_AVAILABILITIES,
  SET_DURATIONS,
  SET_EQUIPMENTS,
  SET_PRICES,
  SET_RENTAL_PRODUCTS,
  SET_ASSIGN_QUESTIONS,
} from "../actionTypes";

const initialState = {
  products: [],
  equipments: [],
  availabilities: [],
  durations: [],
  assets: [],
  prices: [],
  assignquestions: [],
};

export const rentalProductReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_RENTAL_PRODUCTS:
      return {
        ...state,
        products: action.payload,
      };
    case SET_EQUIPMENTS:
      return {
        ...state,
        equipments: action.payload,
      };
    case SET_ASSIGN_QUESTIONS:
      return {
        ...state,
        assignquestions: action.payload,
      };
    case SET_DURATIONS:
      return {
        ...state,
        durations: action.payload,
      };
    case SET_AVAILABILITIES:
      return {
        ...state,
        availabilities: action.payload,
      };
    case SET_ASSETS:
      return {
        ...state,
        assets: action.payload,
      };
    case SET_PRICES:
      return {
        ...state,
        prices: action.payload
      };
    default:
      return state;
  }
};
