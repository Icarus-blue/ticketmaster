import { Box, Link, Stack, TextField, Typography } from "@mui/material";
import { useForm } from "react-hook-form";
import { useRef } from "react";
import { apis } from "../../apis";
import PasswordField from "../../components/PasswordField";
import { useNavigate } from "react-router-dom";
import { LoadingButton } from "@mui/lab";

const SignUpPage = () => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm();
  const navigate = useNavigate();
  const password = useRef({});
  password.current = watch("password", "");

  const onSubmit = async (data) => {
    if (isSubmitting) return;
    try {
      await apis.register(data);
      navigate("/email-sent", {
        state: {
          title: "Email Sent",
          subtitle:
            "We have sent an email, Please check your inbox to active your account.",
          btnLabel: "Go to login",
          navigateTo: "/login",
          email: watch("email"),
        },
      });
    } catch (err) {}
  };
  return (
    <Box maxWidth={400} minWidth={400}>
      <Stack
        direction="column"
        spacing={2}
        onSubmit={handleSubmit(onSubmit)}
        component="form"
      >
        <Typography variant="h4" sx={{ textAlign: "center" }}>
          Welcome to Sign Up!
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
        <TextField
          label="Name"
          type="text"
          error={!!errors.fullname}
          helperText={errors.fullname && errors.fullname.message}
          {...register("fullName", { required: "fullname is required" })}
        />
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
          helperText={errors.confirmPassword && errors.confirmPassword.message}
          register={register("confirmPassword", {
            required: "Confirm password is required",
            minLength: { value: 6, message: "At least 6 characters" },
            validate: (value) =>
              value === password.current ||
              "The confirm password does not match",
          })}
        />
        <LoadingButton variant="contained" type="submit" loading={isSubmitting}>
          Sign Up
        </LoadingButton>
        <Stack direction="row" spacing={2} alignItems="center">
          <Typography variant="p">Already have an account?</Typography>
          <Link
            fontWeight="bold"
            href="#"
            onClick={(e) => {
              e.preventDefault();
              navigate("/login");
            }}
          >
            Login
          </Link>
        </Stack>
      </Stack>
    </Box>
  );
};

export default SignUpPage;
