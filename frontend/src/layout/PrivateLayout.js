import * as React from "react";
import Box from "@mui/material/Box";
// import LinearProgress from "@mui/material/LinearProgress";
import { Navigate } from "react-router-dom";
// import { useSelector } from "react-redux";
import { useAuth } from "../hooks/useAuth";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";


export default function PrivateLayout({ children }) {
  // const { isLoading } = useSelector((state) => state.common);
  const { token } = useAuth();

  if (!token) return <Navigate to={`/login`} />;

  return (
    <Box sx={{ display: "flex" }}>
      <Sidebar />
      <Box sx={{ flex: 1 }} width={`calc(100% - 250px)`}>
        <Header />
        <Box component="main" flex={1} p={2}>
          {children}
        </Box>
      </Box>
    </Box>
  );
}
