import { Box, Button, Stack, TextField, Typography } from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { LoadingButton } from "@mui/lab";
import { useSelector } from "react-redux";
import { apis } from "../../apis";

const ForgotPasswordPage = () => {
  const navigate = useNavigate();
  const [emailSent, setEmailSent] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const { isLoading, error } = useSelector((state) => state.common);

  const sendEmail = async (data) => {
    try {
      await apis.forgotPassword({ email: data.email });
      setEmailSent(true);
    } catch (e) {
      setEmailSent(false);
    }
  };

  return (
    <Box width={400}>
      {!emailSent ? (
        <Stack
          direction="column"
          spacing={2}
          component="form"
          onSubmit={handleSubmit(sendEmail)}
        >
          <Typography variant="h4">Forgot Password</Typography>
          <Typography variant="p">
            Please input your email to reset your password
          </Typography>
          <TextField 
            label="Email"
            helperText={errors.email && errors.email.message}
            error={!!errors.email}
            {...register("email", {
              required: "Email is required",
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: "Invalid email address",
              },
            })}
          />
          <LoadingButton variant="contained" type="submit" loading={isLoading}>
            Send email
          </LoadingButton>
          <Button
            variant="text"
            onClick={() => {
              navigate(-1);
            }}
          >
            Go back
          </Button>
        </Stack>
      ) : (
        <>
          {!error ? (
            <Stack direction="column" spacing={2}>
              <Typography variant="h4">Success</Typography>
              <Typography variant="p">
                We have sent an email to reset your password. <br />
                Please check your inbox.
              </Typography>
              <Button variant="contained" onClick={() => navigate("/login")}>
                Go to login
              </Button>
            </Stack>
          ) : (
            <Stack direction="column" spacing={2}>
              <Typography variant="h4">Failed</Typography>
              <Typography variant="p">
                Something wrong while sending email.
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

export default ForgotPasswordPage;
