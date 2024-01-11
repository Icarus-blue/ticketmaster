import { Navigate, createBrowserRouter } from "react-router-dom";
import PrivateLayout from "../layout/PrivateLayout";
import PublicLayout from "../layout/PublicLayout";
import SignUpPage from "../pages/auth/SignUpPage";
import LoginPage from "../pages/auth/LoginPage";
import NotFoundPage from "../pages/NotFoundPage";
import Overview from "../pages/dashboard/Overview";
import ManifestPage from "../pages/dashboard/Manifest";
import Emailpage from "../pages/configuration/Emailpage";
import Taxes from "../pages/configuration/Taxes";
import Tickets from "../pages/configuration/Tickets";
import Reports from "../pages/ReportPage";
import SearchPage from "../pages/customer/SearchPage";
import BookingPage from "../pages/customer/BookingPage";
import Reviewspage from "../pages/marketing/Reviewspage";
import Cartspage from "../pages/marketing/Cartspage";
import EmailSentPage from "../pages/auth/EmailSentPage";
import VerifyAccountPage from "../pages/auth/VerifyAccountPage";
import ForgotPasswordPage from "../pages/auth/ForgotPasswordPage";
import ResetPasswordPage from "../pages/auth/ResetPasswordPage";
import ProfilePage from "../pages/auth/ProfilePage";
import TeamSettingPage from "../pages/auth/TeamSettingPage";
import CreateTeamPage from "../pages/auth/CreateTeamPage";
import ConfirmTeamInvitationPage from "../pages/auth/ConfirmTeamInvitationPage";
import NotificationsPage from "../pages/notification/NotificationsPage";

import CreateUserPage from "../pages/livedrops/CreateUserPage";
import EditUserPage from "../pages/livedrops/EditUserPage";
import Livedropes from "../pages/livedrops";

import CreateGymPage from "../pages/myevents/CreateGymPage";
import EditGymPage from "../pages/myevents/EditGymPage";
import MyEvents from "../pages/myevents";
import Faqs from "../pages/faqs/Faqs";

export const routes = createBrowserRouter([
  {
    path: "/",
    element: <PrivateLayout children={<Navigate to="/login" />} />,
  },

  /* Dashboard route */
  {
    path: "/dashboard",
    element: <PrivateLayout children={<Overview />} />,
  },
  {
    path: "/dashboard/overview",
    element: <PrivateLayout children={<Overview />} />,
  },
  {
    path: "/dashboard/manifest",
    element: <PrivateLayout children={<ManifestPage />} />,
  },
  {
    path: "/faqs",
    element: <PrivateLayout children={<Faqs />} />,
  },

  //User
  {
    path: "/Livedropes",
    element: <PrivateLayout children={<Livedropes />} />,
  },
  {
    path: "/user/create",
    element: <PrivateLayout children={<CreateUserPage />} />,
  },
  {
    path: "/livedropes/:id",
    element: <PrivateLayout children={<EditUserPage />} />,
  },

  //Gym
  {
    path: "/myevents",
    element: <PrivateLayout children={<MyEvents />} />,
  },
  {
    path: "/gym/create",
    element: <PrivateLayout children={<CreateGymPage />} />,
  },
  {
    path: "/gym/:gym_id/edit",
    element: <PrivateLayout children={<EditGymPage />} />,
  },

  /* Configuration */
  //widget
  {
    path: "/email-template",
    element: <PrivateLayout children={<Emailpage />} />,
  },
  {
    path: "/ticket",
    element: <PrivateLayout children={<Tickets />} />,
  },

  {
    path: "/tax-template",
    element: <PrivateLayout children={<Taxes />} />,
  },

  {
    path: "/report",
    element: <PrivateLayout children={<Reports />} />,
  },

  /* Customer */
  {
    path: "/customer",
    element: <PrivateLayout children={<SearchPage />} />,
  },
  {
    path: "/customer/search",
    element: <PrivateLayout children={<SearchPage />} />,
  },
  {
    path: "/customer/booking",
    element: <PrivateLayout children={<BookingPage />} />,
  },

  /* Marketing */
  {
    path: "/marketing",
    element: <PrivateLayout children={<Reviewspage />} />,
  },
  {
    path: "/marketing/reviews",
    element: <PrivateLayout children={<Reviewspage />} />,
  },
  {
    path: "/marketing/carts",
    element: <PrivateLayout children={<Cartspage />} />,
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
    path: "/team-setting",
    element: <PrivateLayout children={<TeamSettingPage />} />,
  },
  {
    path: "/create-team",
    element: <PrivateLayout children={<CreateTeamPage />} />,
  },
  {
    path: "/team-invitation/:hash",
    element: <PublicLayout children={<ConfirmTeamInvitationPage />} />,
  },
  {
    path: "/notifications",
    element: <PrivateLayout children={<NotificationsPage />} />,
  },

  {
    path: "*",
    element: <PublicLayout children={<NotFoundPage />} />,
  },
]);
