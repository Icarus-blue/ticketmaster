import {
  Box,
  Button,
  CircularProgress,
  Stack,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { apis } from "../../apis";
import { Navigate, useNavigate, useParams } from "react-router-dom";

const ConfirmTeamInvitationPage = () => {
  const { hash } = useParams();
  const [invitationState, setInvitationState] = useState("pending");
  const { isLoggedin } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  useEffect(() => {
    const confirmInvitation = async () => {
      try {
        await apis.confirmInvitation(hash);
        setInvitationState("success");
        setTimeout(() => {
          navigate("/login");
        }, 3000);
      } catch (error) {
        setInvitationState("failed");
      }
    };
    if (isLoggedin) confirmInvitation();
  }, [hash, navigate, isLoggedin]);

  if (!isLoggedin)
    return (
      <Navigate
        to={`/login?redirect=${encodeURIComponent(window.location.pathname)}`}
      />
    );
  else
    return (
      <Box maxWidth={400}>
        {invitationState === "pending" ? (
          <Stack direction="column" spacing={2}>
            <Typography variant="h4">Team invitation</Typography>
            <Typography variant="p">
              Please wait for a while to verifying invitation...
            </Typography>
            <CircularProgress />
          </Stack>
        ) : invitationState === "success" ? (
          <Stack direction="column" spacing={2}>
            <Typography variant="h4">Team invitation</Typography>
            <Typography variant="p">
              You have invited to x-team successfully
            </Typography>
            {isLoggedin ? (
              <Typography variant="p">
                Please wait for a while to redirect to homepage...
              </Typography>
            ) : (
              <Typography variant="p">
                Please wait for a while to redirect to login page...
              </Typography>
            )}
            <CircularProgress />
          </Stack>
        ) : (
          <Stack direction="column" spacing={2}>
            <Typography variant="h4">Team invitation</Typography>
            <Typography variant="p">
              This team invitation failed for some reason.
            </Typography>
            <Button variant="contained" onClick={() => navigate("/login")}>
              Redirect to login
            </Button>
          </Stack>
        )}
      </Box>
    );
};

export default ConfirmTeamInvitationPage;
