import { apis } from "../../apis";
import { SET_ASSETS, SET_QUESTION, SET_WIDGET } from "../actionTypes";
import { store } from "../store";

export const initAssets = async () => {
  try {
    const {
      data: {
        data: { assets },
      },
    } = await apis.getAssets();
    store.dispatch({ type: SET_ASSETS, payload: assets });
  } catch (error) {}
};

export const initQuestions = async () => {
  try {
    const {
      data: {
        data: { questions },
      },
    } = await apis.getQuestionList();
    store.dispatch({ type: SET_QUESTION, payload: questions });
  } catch (error) {}
};

export const initWidgets = async () => {
  const widget_flow_id = 1;
  try {
    const {
      data: {
        data: { widget_product },
      },
    } = await apis.getWidgetList(widget_flow_id);
    store.dispatch({ type: SET_WIDGET, payload: widget_product });
  } catch (error) {}
};