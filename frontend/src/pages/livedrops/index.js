import {
  Box,
  Typography,
  Stack,
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
  Card,
  CardContent,
} from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { useEffect, useState } from "react";
import { apis } from "../../apis";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { useForm } from "react-hook-form";
import { LoadingButton } from "@mui/lab";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

import { initUsers } from "../../redux/actions/userActions";
import dayjs from "dayjs";
import { useAuth } from "../../hooks/useAuth";
import { Edit } from "@mui/icons-material";

const Livedropes = () => {
  const navigate = useNavigate();
  const { token } = useAuth()
  const [openDialog, setOpenDialog] = useState({
    delete: false,
  });
  const [drops, setDrops] = useState([])
  const [selectedRow, setSelectedRow] = useState(null);
  const [rowSelectionModel, setRowSelectionModel] = useState([]);

  const { users } = useSelector((state) => state.users);
  const deleteForm = useForm();

  const columns = [
    {
      field: "name",
      headerName: "Event Name",
      width: 150,
      type: "string",
      renderCell: (params) => {
        console.log("params", params);
        return <Link style={{ color: 'lightblue' }} to={params.row.url}>{params.value}</Link>
      }
    },
    {
      field: "date",
      headerName: "	Event Date",
      width: 100,
      type: "string",
    },
    {
      field: "place",
      headerName: "Event Place",
      width: 100,
      type: "string",
    },
    {
      field: "criteria",
      headerName: "Check Criteria",
      width: 150,
      type: "string",
      renderCell: (params) => {
        return 'Any Ticket Type / Best Available / 2 / Any Price'
      }
    },

    {
      field: "time",
      headerName: "	Drop Time",
      width: 100,
      type: "string",
    },
    {
      field: "Section",
      headerName: "Section",
      width: 150,
      type: "string",
      renderCell: (params) => {
        return <Typography>BLOCK - <Link style={{ color: 'lightblue' }}>Block</Link> </Typography>
      }
    },
    {
      field: "Row",
      headerName: "Row",
      type: "string",
      renderCell: (params) => {
        return 'B'
      }
    },
    {
      field: "Manage",
      headerName: "Manage",
      renderCell: (params) => {
        return (
          <Stack direction="row" spacing={1}>
            <IconButton
              onClick={(e) => {
                navigate(`/livedropes/${params.row._id}`)
              }}
            >
              <Edit />
            </IconButton>

          </Stack>
        );
      },
    },
  ];

  const handleCloseDeleteDialog = () => {
    setSelectedRow(null);
    setOpenDialog({ ...openDialog, delete: false });
  };

  const handleDeleteEvent = async () => {
    console.log("deleted data", selectedRow);
    try {
      var data;
      if (selectedRow) data = [selectedRow._id];
      else data = rowSelectionModel;
      console.log("deleted data--", data);
      const res = await fetch(`http://localhost:5000/events`, {
        method: 'DELETE',
        headers: {
          'authorization': `Bearer ${token}`,
          'data': JSON.stringify(data)
        },
      })
      let json = await res.json();

      setOpenDialog({ ...openDialog, delete: false });
      if (!json.status) return alert(json.message)
      setDrops(prev => {
        return prev.filter(ev => !data.includes(ev._id))
      })
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const getDrops = async () => {
      try {
        const res = await fetch(`http://localhost:5000/live-drops`)
        const data = await res.json()
        if (!data.status) return alert(data.message)
        setDrops(data?.liveDrops)
      } catch (err) {
        console.log(err.message)
      }
    }

    getDrops()
  }, [])

  return (
    <Box>
      <Dialog open={openDialog.delete} onClose={handleCloseDeleteDialog}>
        <DialogTitle>Delete User</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure to delete selected User?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Stack
            direction="row"
            justifyContent="flex-end"
            spacing={1}
            component="form"
            onSubmit={deleteForm.handleSubmit(handleDeleteEvent)}
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
        <CardContent>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 2,
              gap: 1,
            }}
          >
            <div>
              <Typography variant="h5">Live Drops</Typography>
              <p>
                * Drops you received in the last 3 days are listed below.
              </p>
              <p >
                * This page will alert you when you get a new notification.
              </p>
              <p >
                * If your drop times are shown in incorrect time zone, you can change your time zone settings from your profile page.
              </p>
            </div>

            {/* <Box gap={1} display="flex">
              <Button
                variant="contained"
                color="error"
                onClick={() => {
                  setOpenDialog({ ...openDialog, delete: true });
                }}
                disabled={!rowSelectionModel.length}
              >
                Delete
              </Button>
              <Button
                variant="contained"
                onClick={() => navigate("/user/create")}
              >
                Create
              </Button>
            </Box> */}
          </Box>
          <DataGrid
            sx={{ height: 600, width: "100%" }}
            rows={drops}
            columns={columns}
            getRowId={(params) => params._id}
            slots={{ toolbar: GridToolbar }}
            scrollbarSize={3}
            slotProps={{
              toolbar: {
                showQuickFilter: true,
                quickFilterProps: { debounceMs: 500 },
              },
            }}
            pageSizeOptions={[20, 50, 100]}
            initialState={{
              pagination: {
                paginationModel: { pageSize: 20, page: 0 },
              },
            }}
            onRowSelectionModelChange={(newRowSelectionModel) => {
              setRowSelectionModel(newRowSelectionModel);
            }}
            rowSelectionModel={rowSelectionModel}
            disableRowSelectionOnClick
          // onRowClick={(params) => setSelectedRow(params.row)}
          />
        </CardContent>
      </Card>
    </Box>
  );
};

export default Livedropes;
