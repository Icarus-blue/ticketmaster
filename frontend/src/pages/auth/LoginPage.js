import { Box, Link, Stack, TextField, Typography } from "@mui/material";
import { useForm } from "react-hook-form";
import { store } from "../../redux/store";
import { LOGIN_FALIED, LOGIN_SUCCESS } from "../../redux/actionTypes";
import { useNavigate, Navigate, useSearchParams } from "react-router-dom";
import { apis } from "../../apis";
import PasswordField from "../../components/PasswordField";
import { useAuth } from "../../hooks/useAuth";
import { LoadingButton } from "@mui/lab";

const LoginPage = () => {
  const [searchParams] = useSearchParams();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();

  const { tokens, login } = useAuth();

  const navigate = useNavigate();

  const onSubmit = async (data) => {
    if (isSubmitting) return;
    try {

      console.log(data);
      const res = await apis.login(data);
      console.log("login Data", res.data.user);
      store.dispatch({ type: LOGIN_SUCCESS, payload: res.data.user });
      login(res.data.tokens.accessToken);
      const redirectTo = searchParams.get("redirect");
      if (redirectTo === null || redirectTo === undefined) {
        navigate("/dashboard/overview");
      } else {
        navigate(decodeURIComponent(redirectTo));
      }
    } catch (err) {
      store.dispatch({ type: LOGIN_FALIED });
    }
  };

  if (tokens) return <Navigate to="/dashboard/overview" />;
  else
    return (
      <Box maxWidth={400} minWidth={400}>
        <Stack
          direction="column"
          spacing={3}
          component="form"
          onSubmit={handleSubmit(onSubmit)}
        >
          <Typography variant="h4" sx={{ textAlign: "center" }}>
            Welcome to Login!
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

          <PasswordField
            label="Password"
            helperText={errors.password && errors.password.message}
            error={!!errors.password}
            register={register("password", {
              minLength: { value: 6, message: "At least 6 characters" },
              required: "Password is required",
            })}
          />

          <LoadingButton
            variant="contained"
            type="submit"
            loading={isSubmitting}
          >
            Login
          </LoadingButton>

          <Stack direction="column" spacing={1}>
            <Stack direction="row" spacing={2} alignItems="center">
              <Typography variant="p">Don't have an account yet?</Typography>
              <Link
                fontWeight="bold"
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  navigate("/register");
                }}
              >
                Sign Up
              </Link>
            </Stack>
            <Link
              fontWeight="bold"
              href="#"
              onClick={(e) => {
                e.preventDefault();
                navigate("/forgot-password");
              }}
            >
              Forgot password
            </Link>
          </Stack>
          
        </Stack>
      </Box>
    );
};

export default LoginPage;
