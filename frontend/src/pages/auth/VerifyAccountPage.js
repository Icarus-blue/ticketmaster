import {
  Box,
  Button,
  CircularProgress,
  Stack,
  Typography,
} from "@mui/material";
import { useCallback, useEffect, useState } from "react";
import { apis } from "../../apis";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";

const VerifyAccountPage = () => {
  const { hash } = useParams();
  const { isLoading } = useSelector((state) => state.common);
  const [verified, setVerified] = useState(false);
  const navigate = useNavigate();

  const verifyAccount = useCallback(async () => {
    try {
      await apis.verifyEmail({ hash });
      setVerified(true);
      setTimeout(() => {
        navigate("/login");
      }, 3000);
    } catch (e) {
      setVerified(false);
    }
  }, [hash, navigate]);

  useEffect(() => {
    verifyAccount();
  }, [verifyAccount]);
  return (
    <Box width={400}>
      {isLoading ? (
        <Stack direction="column" spacing={2}>
          <Typography variant="h4">Verifying</Typography>
          <Typography variant="p">
            We are verifying your account now,
            <br />
            Please wait for a while...
          </Typography>
          <CircularProgress />
        </Stack>
      ) : (
        <>
          {verified ? (
            <Stack direction="column" spacing={2}>
              <Typography variant="h4">Success</Typography>
              <Typography variant="p">
                Your account verified successfully. <br />
                We are redirecting to login...
              </Typography>
              <CircularProgress />
            </Stack>
          ) : (
            <Stack direction="column" spacing={2}>
              <Typography variant="h4">Failed</Typography>
              <Typography variant="p">
                Something wrong while verifying your account.
              </Typography>
              <Button variant="contained" onClick={() => navigate("/login")}>
                Go to login
              </Button>
            </Stack>
          )}
        </>
      )}
    </Box>
  );
};

export default VerifyAccountPage;
