import { LoadingButton } from "@mui/lab";
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Stack,
  TextField,
  // useTheme,
} from "@mui/material";
import { MuiTelInput, matchIsValidTel } from "mui-tel-input";
import { useForm, Controller } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { initGyms } from "../../redux/actions/gymActions";
import { apis } from "../../apis";
import { useEffect, useState } from "react";

const EditGymPage = () => {
  const [gym, setGym] = useState(null);
  const deleteForm = useForm();
  const [openDialog, setOpenDialog] = useState({
    delete: false,
  });
  const [isDeleting, setIsDeleting] = useState(false);
  // const theme = useTheme();
  const { gym_id } = useParams();
  const navigate = useNavigate();
  const {
    register,
    formState: { isSubmitting, errors },
    handleSubmit,
    reset,
    control,
  } = useForm();

  const [phone, setPhone] = useState("");

  const handleEditGym = async (data) => {
    console.log("update data", data);
    try {
      const data1 = await apis.updateGymById(gym._id, data);
      console.log("updated data", data1);
      initGyms();
      navigate(-1);
      reset();
    } catch (error) {
      console.log(error);
    }
  };

  const handleDeleteGym = async () => {
    try {
      setIsDeleting(true);
      await apis.deleteGym(gym._id);
      navigate(-1);
    } catch (error) {
      console.log(error);
    } finally {
      setIsDeleting(false);
    }
  };
  const handleCloseDeleteDialog = () => {
    setOpenDialog({ ...openDialog, delete: false });
  };

  const init = async () => {
    try {
      const {
        data: { gym },
      } = await apis.getGymById(gym_id);

      setGym(gym);
      console.log("Gym data", gym);
      setPhone(gym.numbers);
    } catch (error) {}
  };

  useEffect(() => {
    init();
  }, []);

  return (
    <Box>
      <Dialog open={openDialog.delete} onClose={handleCloseDeleteDialog}>
        <DialogTitle>Delete Gym</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure to delete this Gym?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Stack
            direction="row"
            justifyContent="flex-end"
            spacing={1}
            component="form"
            onSubmit={deleteForm.handleSubmit(handleDeleteGym)}
          >
            <Button variant="text" onClick={handleCloseDeleteDialog}>
              Cancel
            </Button>
            <LoadingButton
              variant="contained"
              color="error"
              type="submit"
              loading={deleteForm.formState.isSubmitting}
            >
              Delete
            </LoadingButton>
          </Stack>
        </DialogActions>
      </Dialog>
      <Card>
        <CardHeader title="Edit Gym" />
        <CardContent>
          {gym && (
            <Stack
              direction="column"
              spacing={2}
              gap={1}
              maxWidth={600}
              component="form"
              onSubmit={handleSubmit(handleEditGym)}
            >
              <TextField
                variant="standard"
                label="Gym Name"
                type="text"
                defaultValue={gym?.name}
                error={Boolean(errors.name)}
                helperText={errors.name && errors.name.message}
                {...register("name", {
                  required: "This field is required",
                })}
              />

              <TextField
                variant="standard"
                label="location"
                type="text"
                multiline
                defaultValue={gym?.location}
                error={Boolean(errors.location)}
                helperText={errors.location && errors.location.message}
                {...register("location", {
                  required: "This field is required",
                })}
              />

              <Controller
                name="numbers"
                defaultValue={phone}
                control={control}
                rules={{ validate: matchIsValidTel }}
                render={({ field, fieldState }) => (
                  <MuiTelInput
                    {...field}
                    // onlyCountries={["NG"]}
                    defaultCountry="NG"
                    helperText={fieldState.invalid ? "Tel is invalid" : ""}
                    error={fieldState.invalid}
                  />
                )}
              />

              <Stack direction="row" spacing={1} justifyContent="flex-end">
                <Button
                  variant="text"
                  onClick={() => navigate(-1)}
                  sx={{ width: "fit-content" }}
                >
                  Go back
                </Button>
                <LoadingButton
                  variant="contained"
                  color="error"
                  loading={isDeleting}
                  onClick={() => {
                    setOpenDialog({ ...openDialog, delete: true });
                  }}
                >
                  Delete
                </LoadingButton>
                <LoadingButton
                  variant="contained"
                  type="submit"
                  loading={isSubmitting}
                  sx={{ width: "fit-content" }}
                >
                  Update now
                </LoadingButton>
              </Stack>
            </Stack>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};

export default EditGymPage;
