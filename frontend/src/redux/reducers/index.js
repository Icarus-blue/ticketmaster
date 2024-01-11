import { combineReducers } from "redux";
import { authReducer } from "./authReducer";
import { commonReducer } from "./commonReducer";
import { teamReducer } from "./teamReducer";
import { rentalProductReducer } from "./rentalProductReducer";
import { configurationReducer } from "./configurationReducer";
import { userReducer } from "./userReducer";
import { gymReducer } from "./gymReducer";

export const rootReducer = combineReducers({
  auth: authReducer,
  team: teamReducer,
  common: commonReducer,
  product: rentalProductReducer,
  configuration: configurationReducer,
  users: userReducer,
  gyms: gymReducer,
});
