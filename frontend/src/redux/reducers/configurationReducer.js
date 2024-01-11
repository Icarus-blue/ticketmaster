import {
    SET_QUESTION,
    SET_WIDGET,
} from "../actionTypes";

const initialState = {
    widgets: [],
    questions: [],
};

export const configurationReducer = (state = initialState, action) => {
    switch(action.type) {
        case SET_WIDGET:
            return {
                ...state,
                widgets: action.payload,
            };
        case SET_QUESTION:
            return {
                ...state,
                questions: action.payload,
            };
        default:
            return state;
    }
};