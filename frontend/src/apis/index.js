import Axios from "axios";
import { store } from "../redux/store";
import {
  API_REQUEST,
  ERROR_RESPONSE,
  SUCCESS_RESPONSE,
} from "../redux/actionTypes";
import { enqueueSnackbar } from "notistack";

export const SERVER_URL =
  process.env.REACT_APP_BACKEND_SERVER || "http://localhost:5000";
const axios = Axios.create({ baseURL: SERVER_URL, timeout: 10000 });

axios.interceptors.request.use((config) => {
  store.dispatch({ type: API_REQUEST, payload: true });
  let token = JSON.parse(localStorage.getItem("token"));
  config.headers.set("Authorization", `Bearer ${token}`);
  return config;
});

axios.interceptors.response.use(
  (response) => {
    store.dispatch({ type: SUCCESS_RESPONSE, payload: response.data?.message });
    if (response.data.message)
      enqueueSnackbar({ variant: "success", message: response.data?.message });
    return response;
  },
  (error) => {
    console.log(error);
    if (error.response?.status === 401) {
      localStorage.removeItem("tokens");
      window.location.replace(window.location.origin + "/login");
    } else {
      store.dispatch({
        type: ERROR_RESPONSE,
        payload: error.response?.data.message || error.message,
      });
      enqueueSnackbar({
        variant: "error",
        message: error.response?.data?.message || error.message,
      });
    }

    return Promise.reject(error);
  }
);

//auth apis
const login = (data) => axios.post("/api/auth/login", data);
const register = (data) => axios.post("/api/auth/register", data);
const verifyEmail = (data) => axios.post(`/api/verify-email/`, data);
const forgotPassword = (data) => axios.post(`/api/forgot-password/`, data);
const resetPassword = (data) => axios.post("/api/reset-password", data);
const sendEmail = (data) => axios.post("/api/email-verification", data);
const updateUser = (data) => axios.post("/api/user", data);
const getUserInfor = () => axios.get("/api/user");
const updatePassword = (data) => axios.post("/api/update-password", data);



const getConstants = () => axios.get("/api/constants");

//User
const getUsers = () => axios.get("/api/admin/user");
const getUserById = (id) => axios.get(`/api/admin/user/${id}`);
const updateUserById = (id, data) => axios.post(`/api/admin/user/${id}`, data);
const createUser = (data) => {
  axios.post("/api/admin/user", data);
};
const deleteUser = (ids) => axios.delete(`/api/admin/user/${ids}`);

export const apis = {
  login,
  register,
  verifyEmail,
  forgotPassword,
  resetPassword,
  sendEmail,
  updateUser,
  getUserInfor,
  updatePassword,
  getConstants,
  getUsers,
  createUser,
  getUserById,
  updateUserById,
  deleteUser,
};
