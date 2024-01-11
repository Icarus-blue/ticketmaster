import { LoadingButton } from "@mui/lab";
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../../hooks/useAuth";

const EditUserPage = () => {
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
  const [isSubmitting, setIsSubmitting] = useState(false)
  const navigate = useNavigate();
  useEffect(() => {
    console.log("search", params)
    if (params.event) {
      setId(params.id)
    }
  }, [params])


  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleUpdateEvent = async () => {
    setIsSubmitting(true)
    try {
      const res = await axios.put(`${process.env.REACT_APP_BACKEND_SERVER}/events/${id}`, { ...formData }, {
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

  const handleCloseDeleteDialog = () => {
    setOpenDialog({ ...openDialog, delete: false });
  };

  useEffect(() => {

    const getEvent = async () => {
      try {
        const res = await axios.get(`${process.env.REACT_APP_BACKEND_SERVER}/events/${id}`, {
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