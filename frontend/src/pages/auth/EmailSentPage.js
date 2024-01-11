import { LoadingButton } from "@mui/lab";
import { Box, Button, Stack, Typography } from "@mui/material";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import { apis } from "../../apis";

const EmailSentPage = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { isLoading } = useSelector((state) => state.common);

  const handleResendEmail = async () => {
    try {
      await apis.sendEmail({ email: state.email });
    } catch (e) {}
  };
  useEffect(() => {});

  return (
    <Box width={400}>
      {state && (
        <Stack direction="column" spacing={2}>
          <Typography variant="h5">{state.title}</Typography>
          <Typography variant="p">{state.subtitle}</Typography>

          <LoadingButton
            loading={isLoading}
            variant="contained"
            onClick={handleResendEmail}
          >
            Resend email
          </LoadingButton>
          <Button variant="outlined" onClick={() => navigate(state.navigateTo)}>
            {state.btnLabel}
          </Button>
        </Stack>
      )}
    </Box>
  );
};

export default EmailSentPage;
