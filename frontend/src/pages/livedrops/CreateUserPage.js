import { LoadingButton } from "@mui/lab";
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Stack,
  TextField,
  MenuItem,
} from "@mui/material";
import { useForm } from "react-hook-form";
import { apis } from "../../apis";
import { useNavigate } from "react-router-dom";
import { useEffect} from "react";
import { initUsers } from "../../redux/actions/userActions";
import { _roles } from "../../constants/constants";

const CreateUserPage = () => {
  const navigate = useNavigate();
  // const [role, setRole] = useState(_roles[0]);
  const {
    register,
    formState: { isSubmitting, errors },
    handleSubmit,
    reset,
  } = useForm({
    defaultValues: {
      password: 12345678,
    },
  });

  const handleCreateUser = async (data) => {
    try {
      await apis.createUser(data);
      initUsers();
      navigate(-1);
      reset();
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(()=>{

  },[]);

  return (
    <Box>
      <Card>
        <CardHeader title="Create User" />
        <CardContent>
          <Stack direction="row" spacing={2}>
            <Stack
              direction="column"
              maxWidth={600}
              width="100%"
              spacing={2}
              component="form"
              onSubmit={handleSubmit(handleCreateUser)}
              // maxWidth={700}
            >
              <TextField
                label="Full Name"
                {...register("fullname", {
                  required: "This Field is required",
                })}
                helperText={errors.fullname ? errors.fullname.message : ""}
                error={!!errors.fullname}
              />
              <TextField
                variant="standard"
                label="email"
                type="text"
                error={Boolean(errors.email)}
                helperText={errors.email && errors.email.message}
                {...register("email", {
                  required: "This field is required",
                })}
              />
              <TextField
                select
                variant="standard"
                type="text"
                label="role"
                helperText={errors.role && errors.role.message}
                error={Boolean(errors.role)}
                {...register("role", {
                  required: "This field is required",
                })}
              >
                {_roles.map((option, index) => (
                  <MenuItem
                    key={option}
                    value={option}
                    // onClick={() => {
                    //   return setRole(option);
                    // }}
                  >
                    {option}
                  </MenuItem>
                ))}
              </TextField>

              <TextField
                variant="standard"
                label="location"
                type="text"
                error={Boolean(errors.location)}
                helperText={errors.location && errors.location.message}
                {...register("location", {
                  required: "This field is required",
                })}
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
                  type="submit"
                  loading={isSubmitting}
                  sx={{ width: "fit-content" }}
                >
                  Create
                </LoadingButton>
              </Stack>
            </Stack>
          </Stack>
        </CardContent>
      </Card>
    </Box>
  );
};

export default CreateUserPage;
