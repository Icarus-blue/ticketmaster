import { LoadingButton } from "@mui/lab";
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Stack,
  TextField,
} from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { apis } from "../../apis";
import { useNavigate } from "react-router-dom";
import { MuiTelInput, matchIsValidTel } from "mui-tel-input";
import { initGyms } from "../../redux/actions/gymActions";
import { useState } from "react";
import { useAuth } from "../../hooks/useAuth";

const CreateGymPage = () => {
  const { token } = useAuth()
  const [url, setUrl] = useState('')
  const navigate = useNavigate();
  const {
    register,
    formState: { isSubmitting, errors },
    handleSubmit,
    reset,
    control,
  } = useForm({
    defaultValues: {
      numbers: "",
    },
  });

  const handleAddEvent = async (data) => {
    try {
      const res = await fetch(`http://localhost:5000/watch?url=${url}`, {
        headers: {
          'authorization': `Bearer ${token}`
        }
      })
      const data = await res.json()
      if (!data.status) return alert(data.message)
      navigate('/myevents')
    } catch (error) {
      console.log(error);
    }
    console.log("endpoint")
  };

  return (
    <Box>
      <Card>
        <CardHeader title="Create Event" />
        <CardContent>
          <Stack direction="row" spacing={2}>
            <Stack
              direction="column"
              maxWidth={600}
              width="100%"
              spacing={2}
              component="form"
              onSubmit={handleSubmit(handleAddEvent)}
            // maxWidth={700}
            >
              <TextField
                label="Event Url"
                name="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                helperText={errors.name ? errors.name.message : ""}
                error={!!errors.name}
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

export default CreateGymPage;
