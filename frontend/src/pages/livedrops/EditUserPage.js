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
  MenuItem,
  Typography,
} from "@mui/material";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { initUsers } from "../../redux/actions/userActions";
import { apis } from "../../apis";
import { useEffect, useState } from "react";
import { _roles } from "../../constants/constants";
import axios from "axios";
import { useAuth } from "../../hooks/useAuth";

const EditUserPage = () => {
  const [user1, setUser1] = useState(null);
  const deleteForm = useForm();
  const params = useParams()
  const [event, setEvent] = useState(null)
  const { token } = useAuth()
  const [formData, setFormData] = useState({
    name: event?.name,
    date: event?.date,
    place: event?.place,
  })
  const [id, setId] = useState(params?.id)
  const [openDialog, setOpenDialog] = useState({
    delete: false,
  });
  const [isDeleting, setIsDeleting] = useState(false);
  // const theme = useTheme();
  const { user_id } = useParams();
  const [isSubmitting, setIsSubmitting] = useState(false)
  const navigate = useNavigate();
  useEffect(() => {
    console.log("search", params)
    if (params.event) {
      setId(params.id)
    }
  }, [params])
  const {
    register,
    formState: { errors },
    handleSubmit,
    reset,
  } = useForm({
    defaultValues: {
      user1: null,
    },
  });

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleUpdateEvent = async () => {
    setIsSubmitting(true)
    try {
      const res = await axios.put(`http://localhost:5000/events/${id}`, { ...formData }, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      const data = await res.data

      if (!data.status) return alert(data.message)
      navigate('/livedropes')
    } catch (error) {
      console.log(error);
    } finally {
      setIsSubmitting(true)
    }
  };

  // const handleDeleteUser = async () => {
  //   try {
  //     setIsDeleting(true);
  //     await apis.deleteUser(user1._id);
  //     navigate(-1);
  //   } catch (error) {
  //     console.log(error);
  //   } finally {
  //     setIsDeleting(false);
  //   }
  // };
  const handleCloseDeleteDialog = () => {
    setOpenDialog({ ...openDialog, delete: false });
  };

  useEffect(() => {

    const getEvent = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/events/${id}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })

        const data = await res.data
        if (!data.status) return alert(data.message)

        setEvent(data.event)
      } catch (error) { console.log('errror', error.message) }
    }
    getEvent()
  }, [id])

  return (
    <Box>
      {/* <Dialog open={openDialog.delete} onClose={handleCloseDeleteDialog}>
        <DialogTitle>Delete User</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure to delete this User?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Stack
            direction="row"
            justifyContent="flex-end"
            spacing={1}
            component="form"
            onSubmit={deleteForm.handleSubmit(handleDeleteUser)}
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
      </Dialog> */}
      <Card>
        <CardHeader title="Edit Event" />
        <CardContent>
          {event && (
            <Stack
              direction="column"
              spacing={2}
              gap={1}
              maxWidth={600}
              component="form"
              onSubmit={handleUpdateEvent}
            >
              <TextField
                variant="standard"
                label="Event Name"
                type="text"
                onChange={(e) => handleChange(e)}
                value={formData?.name || event?.name}
                name="name"
              />
              <Box>

                <Typography styl={{padding:'1em', fontSize:'0.4rem'}}>
                  Current Event Date: {event?.date?.split('T').join(', ')}
                </Typography>
                <TextField
                  variant="standard"
                  name="date"
                  label="Event Date"
                  onChange={(e) => handleChange(e)}
                  focused
                  type="datetime-local"
                  value={formData?.date || event?.date}
                />
              </Box>

              <TextField
                variant="standard"
                name="place"
                onChange={(e) => handleChange(e)}
                type="text"
                label="Event Place"
                value={formData?.place || event?.place}
              >

              </TextField>


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
                  loading={isSubmitting}
                  onClick={handleUpdateEvent}
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



export default EditUserPage