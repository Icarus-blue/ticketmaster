import { apis } from "../../apis";
import {
  SET_AVAILABILITIES,
  SET_DURATIONS,
  SET_EQUIPMENTS,
  SET_PRICES,
  SET_RENTAL_PRODUCTS,
  SET_ASSIGN_QUESTIONS,
} from "../actionTypes";
import { store } from "../store";

export const initRentalProducts = async () => {
  try {
    const res = await apis.getRentalProducts();
    store.dispatch({
      type: SET_RENTAL_PRODUCTS,
      payload: res.data.data.products,
    });
  } catch (error) { }
};

export const initEquipments = async (product_id) => {
  try {
    const res = await apis.getEquipmentList(product_id);
    store.dispatch({
      type: SET_EQUIPMENTS,
      payload: res.data.data.equipmentTypes,
    });
  } catch (error) { }
};

export const initAvailabilities = async (product_id) => {
  try {
    const {
      data: {
        data: { availabilities },
      },
    } = await apis.getAvailabilityList(product_id);
    store.dispatch({ type: SET_AVAILABILITIES, payload: availabilities });
  } catch (error) { }
};

export const initDurations = async (product_id) => {
  try {
    const {
      data: {
        data: { durations },
      },
    } = await apis.getDurationList(product_id);
    store.dispatch({ type: SET_DURATIONS, payload: durations });
  } catch (error) { }
};

export const initPrices = async (product_id, equipment_id) => {
  try {
    const { data: { data: { prices } } } =
      await apis.getPrices(product_id, equipment_id)
    store.dispatch({ type: SET_PRICES, payload: prices })
  } catch (error) {

  }
}

export const initAssignQuestions = async (product_id) => {
  try {
    const res = await apis.getAssignQuestionList(product_id);
    store.dispatch({
      type: SET_ASSIGN_QUESTIONS,
      payload: res.data.data.rental_questions,
    });
  } catch (error) { }
};