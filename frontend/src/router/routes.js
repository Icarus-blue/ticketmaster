import { Navigate, createBrowserRouter } from "react-router-dom";
import PrivateLayout from "../layout/PrivateLayout";
import PublicLayout from "../layout/PublicLayout";
import SignUpPage from "../pages/auth/SignUpPage";
import LoginPage from "../pages/auth/LoginPage";
import NotFoundPage from "../pages/NotFoundPage";
import Overview from "../pages/dashboard/Overview";
import EmailSentPage from "../pages/auth/EmailSentPage";
import VerifyAccountPage from "../pages/auth/VerifyAccountPage";
import ForgotPasswordPage from "../pages/auth/ForgotPasswordPage";
import ResetPasswordPage from "../pages/auth/ResetPasswordPage";
import ProfilePage from "../pages/auth/ProfilePage"; 
import EditLiveDrop from "../pages/livedrops/EditLiveDrop";
import Livedropes from "../pages/livedrops";
import MyEvents from "../pages/myevents";
import Faqs from "../pages/faqs/Faqs";
import CreateEvent from "../pages/myevents/CreateEvent";

export const routes = createBrowserRouter([
  {
    path: "/", 
    element: <PrivateLayout children={<Navigate to="/login" />} />,
  },

  {
    path: "/dashboard/overview",
    element: <PrivateLayout children={<Overview />} />,
  },

  {
    path: "/faqs",
    element: <PrivateLayout children={<Faqs />} />,
  },

  {
    path: "/Livedropes",
    element: <PrivateLayout children={<Livedropes />} />,
  },

  {
    path: "/livedropes/:id",
    element: <PrivateLayout children={<EditLiveDrop />} />,
  },

  //
  {
    path: "/myevents",
    element: <PrivateLayout children={<MyEvents />} />,
  },
  {
    path: "/myevents/new",
    element: <PrivateLayout children={<CreateEvent />} />,
  },



  //auth routes
  {
    path: "/login",
    element: <PublicLayout children={<LoginPage />} />,
  },
  {
    path: "/register",
    element: <PublicLayout children={<SignUpPage />} />,
  },

  {
    path: "/email-sent",
    element: <PublicLayout children={<EmailSentPage />} />,
  },
  {
    path: "/verify-email/:hash",
    element: <PublicLayout children={<VerifyAccountPage />} />,
  },
  {
    path: "/forgot-password",
    element: <PublicLayout children={<ForgotPasswordPage />} />,
  },
  {
    path: "/reset-password/:token",
    element: <PublicLayout children={<ResetPasswordPage />} />,
  },
  {
    path: "/profile",
    element: <PrivateLayout children={<ProfilePage />} />,
  },

  {
    path: "*",
    element: <PublicLayout children={<NotFoundPage />} />,
  },
]);
