import { Box, Button, Stack, Typography } from "@mui/material";
import { useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { LoadingButton } from "@mui/lab";
import { useSelector } from "react-redux";
import { apis } from "../../apis";
import PasswordField from "../../components/PasswordField";
const ResetPasswordPage = () => {
  const navigate = useNavigate();
  const { token } = useParams();
  const [done, setDone] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();
  const password = useRef({});
  password.current = watch("password", "");
  const { isLoading, error } = useSelector((state) => state.common);

  const resetPassword = async (data) => {
    try {
      await apis.resetPassword({
        token: token,
        password: data.password,
      });
      setDone(true);
    } catch (e) {
      setDone(false);
    }
  };

  return (
    <Box width={400}>
      {!done ? (
        <Stack
          direction="column"
          spacing={2}
          component="form"
          onSubmit={handleSubmit(resetPassword)}
        >
          <Typography variant="h4">Reset Password</Typography>
          <Typography variant="p">Please input your new password</Typography>
          <PasswordField
            label="Password"
            error={!!errors.password}
            helperText={errors.password && errors.password.message}
            register={register("password", {
              required: true,
              minLength: { value: 6, message: "At least 6 characters" },
            })}
          />
          <PasswordField
            label="Confirm Password"
            error={!!errors.confirmPassword}
            helperText={
              errors.confirmPassword && errors.confirmPassword.message
            }
            register={register("confirmPassword", {
              required: "Confirm password is required",
              minLength: { value: 6, message: "At least 6 characters" },
              validate: (value) =>
                value === password.current ||
                "The confirm password does not match",
            })}
          />
          <LoadingButton variant="contained" type="submit" loading={isLoading}>
            Reset password
          </LoadingButton>
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

export default ResetPasswordPage;
