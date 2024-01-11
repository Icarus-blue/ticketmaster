import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import React,{ useRef, useState } from "react";
import { useForm } from "react-hook-form";
import PasswordField from "../../components/PasswordField";
import { useSelector } from "react-redux";
import { apis } from "../../apis";
import { store } from "../../redux/store";
import { UPDATE_USER } from "../../redux/actionTypes";
import { LoadingButton } from "@mui/lab";
import { useAuth } from "../../hooks/useAuth";

const ProfilePage = () => {
  const { isLoading } = useSelector((state) => state.common);
  const infoForm = useForm();
  const { token } = useAuth()
  const passForm = useForm();
  const [openCloseAccount, setOpenCloseAccount] = useState(false);
  const [user, setUser] = useState({})
  const [changeName, setChangeName] = useState(false);
  const [changePass, setChangePass] = useState(false);

  React.useEffect(() => {
    const getProfile = async () => {
      const res = await fetch(`http://localhost:5000/api/user/`, {
        method: 'GET',
        headers: {
          'authorization': `Bearer ${token}`
        }
      })

      const data = await res.json()
      console.log(data)
      setUser(data.user)
    }
    getProfile()
  }, [])

  const newPassword = useRef({});
  newPassword.current = passForm.watch("new_password", "");

  const currentPassword = useRef({});
  currentPassword.current = passForm.watch("current_password", "");

  const handleChangeName = async (data) => {
    try {
      const res = await apis.updateUser(data);
      store.dispatch({ type: UPDATE_USER, payload: res.data.data.user });
      setChangeName(false);
    } catch (e) { }
  };

  const handleChangePass = async (data) => {
    try {
      await apis.updatePassword(data);
      setChangePass(false);
      passForm.reset();
    } catch (e) { }
  };
  if (!user) {
    return
  }
  else
    return (
      <Box maxWidth={700}>
        <Dialog
          open={openCloseAccount}
          onClose={() => setOpenCloseAccount(false)}
        >
          <DialogTitle>Close Account</DialogTitle>
          <DialogContent>Are you sure to close this account?</DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenCloseAccount(false)}>Cancel</Button>
            <LoadingButton color="error" loading={isLoading}>
              Delete
            </LoadingButton>
          </DialogActions>
        </Dialog>
        <Typography variant="h4" mb={3}>
          Profile
        </Typography>

        <Card sx={{ mb: 6 }}>
          <CardHeader title="General Info" />
          <CardContent>
            <Stack
              direction="column"
              spacing={2}
              component="form"
              onSubmit={infoForm.handleSubmit(handleChangeName)}
            >
              <TextField
                disabled
                value={user?.email}
                sx={{ maxWidth: 400 }}

              />
              <TextField
                type="text"
                value={user.fullName}
                error={!!infoForm.formState.errors.name}
                sx={{ maxWidth: 400 }}
                disabled={!changeName}
                helperText={
                  infoForm.formState.errors.name &&
                  infoForm.formState.errors.name.message
                }
                {...infoForm.register("name", {
                  required: "Name is required",
                  validate: (value) =>
                    value !== user?.name || "Please update name.",
                })}
              />


              {/* <TextField
                label="Website"
                type="text"
                defaultValue={user.name}
                error={!!infoForm.formState.errors.name}
                sx={{ maxWidth: 400 }}
                disabled={!changeName}
                helperText={
                  infoForm.formState.errors.name &&
                  infoForm.formState.errors.name.message
                }
                {...infoForm.register("name", {
                  required: "Name is required",
                  validate: (value) =>
                    value !== user?.name || "Please update name.",
                })}
              /> */}

              <TextField
                placeholder="Telegram chat ID"
                type="text"
                value={user.chatId}
                error={!!infoForm.formState.errors.name}
                sx={{ maxWidth: 400 }}
                disabled={!changeName}
                helperText={
                  infoForm.formState.errors.name &&
                  infoForm.formState.errors.name.message
                }
                {...infoForm.register("name", {
                  required: "Name is required",
                  validate: (value) =>
                    value !== user?.name || "Please update name.",
                })}
              />
              <p>Go to telegram to update chatId</p>



              <CardActions sx={{ display: "flex", justifyContent: "flex-end" }}>
                {changeName ? (
                  <>
                    <Button
                      onClick={() => {
                        setChangeName(!changeName);

                        infoForm.reset();
                      }}
                    >
                      Cancel
                    </Button>
                    <LoadingButton
                      variant="contained"
                      type="submit"
                      loading={isLoading}
                    >
                      Update now
                    </LoadingButton>
                  </>
                ) : (
                  <Button
                    variant="contained"
                    onClick={() => {
                      setChangeName(!changeName);
                      infoForm.reset();
                    }}
                  >
                    Change
                  </Button>
                )}
              </CardActions>
            </Stack>
          </CardContent>
        </Card>


        <Card sx={{ mb: 6 }}>
          <CardHeader title="Change Password" />
          <CardContent>
            <Stack
              direction="column"
              spacing={2}
              component="form"
              onSubmit={passForm.handleSubmit(handleChangePass)}
            >
              <PasswordField
                label="Current password"
                error={!!passForm.formState.errors.current_password}
                helperText={
                  passForm.formState.errors.current_password &&
                  passForm.formState.errors.current_password.message
                }
                sx={{ maxWidth: 400 }}
                disabled={!changePass}
                register={passForm.register("current_password", {
                  required: "Current password is required",
                  minLength: { value: 6, message: "At least 6 characters" },
                })}
              />
              <PasswordField
                label="New password"
                disabled={!changePass}
                error={!!passForm.formState.errors.new_password}
                sx={{ maxWidth: 400 }}
                helperText={
                  passForm.formState.errors.new_password &&
                  passForm.formState.errors.new_password.message
                }
                register={passForm.register("new_password", {
                  required: "New password is required",
                  minLength: { value: 6, message: "At least 6 characters" },
                  validate: (value) =>
                    value !== currentPassword.current ||
                    "New password cannot be same as Old one.",
                })}
              />
              <PasswordField
                label="Confirm password"
                disabled={!changePass}
                error={!!passForm.formState.errors.confirm_password}
                sx={{ maxWidth: 400 }}
                helperText={
                  passForm.formState.errors.confirm_password &&
                  passForm.formState.errors.confirm_password.message
                }
                register={passForm.register("confirm_password", {
                  required: "Confirm password is required",
                  minLength: { value: 6, message: "At least 6 characters" },
                  validate: (value) =>
                    value === newPassword.current ||
                    "The confirm password does not match",
                })}
              />
              <CardActions sx={{ display: "flex", justifyContent: "flex-end" }}>
                {changePass ? (
                  <>
                    <Button
                      onClick={() => {
                        setChangePass(!changePass);
                        passForm.reset();
                      }}
                    >
                      Cancel
                    </Button>
                    <LoadingButton
                      variant="contained"
                      type="submit"
                      loading={isLoading}
                    >
                      Update now
                    </LoadingButton>
                  </>
                ) : (
                  <Button
                    variant="contained"
                    onClick={() => {
                      setChangePass(!changePass);
                      passForm.reset();
                    }}
                  >
                    Change
                  </Button>
                )}
              </CardActions>
            </Stack>
          </CardContent>
        </Card>

        <Card>
          <CardHeader
            title="Close Account"
            subheader="Permanently delete this account."
          />
          <CardContent>
            <Stack
              direction="column"
              spacing={2}
              justifyContent="flex-start"
              alignItems="flex-start"
            >
              <Typography variant="p">
                Once this account is closed, all of its resources and data will
                be permanently deleted, Before closing this account, please
                download any data or information regarding this team that you
                wish to retain,
              </Typography>
              <Button
                variant="contained"
                color="error"
                onClick={() => setOpenCloseAccount(true)}
              >
                Close account
              </Button>
            </Stack>
          </CardContent>
        </Card>

      </Box>
    );
};

export default ProfilePage;
