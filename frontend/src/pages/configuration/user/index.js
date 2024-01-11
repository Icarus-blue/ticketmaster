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
import { useNavigate } from "react-router-dom";

import { initUsers } from "../../redux/actions/userActions";

const QuestionPage = () => {
  const navigate = useNavigate();
  const [openDialog, setOpenDialog] = useState({
    delete: false,
  });
  const [selectedRow, setSelectedRow] = useState(null);
  const [rowSelectionModel, setRowSelectionModel] = useState([]);

  const { users } = useSelector((state) => state.users);
  const deleteForm = useForm();

  const columns = [
    {
      field: "fullname",
      headerName: "Full Name",
      width: 150,
      type: "string",
    },
    {
      field: "email",
      headerName: "Email",
      width: 150,
      type: "string",
    },
    {
      field: "role",
      headerName: "Role",
      width: 100,
      type: "string",
    },
    {
      field: "location",
      headerName: "Location",
      width: 200,
      type: "string",
    },
    {
      field: "isActive",
      headerName: "Is Active",
      width: 150,
      type: "boolean",
    },
    {
      field: "isLocked",
      headerName: "Is Locked",
      width: 150,
      type: "boolean",
    },
    {
      field: "created_at",
      headerName: "Created at",
      width: 150,
      type: "date",
      valueGetter: (params) => new Date(params.value),
    },
    {
      field: "updated_at",
      headerName: "Updated at",
      type: "date",
      valueGetter: (params) => new Date(params.value),
    },
    {
      field: "actions",
      headerName: "Actions",
      renderCell: (params) => {
        console.log("param", params);
        return (
          <Stack direction="row" spacing={1}>
            <IconButton
              onClick={(e) => {
                setSelectedRow(params.row);
                setOpenDialog({ ...openDialog, delete: true });
              }}
            >
              <DeleteIcon />
            </IconButton>
            <IconButton
              onClick={(e) => {
                navigate(`/user/${params.id}/edit`, {
                  params: { user_id: params.id },
                });
              }}
            >
              <EditIcon />
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

  const handleDeleteQuestion = async () => {
    try {
      const data = await apis.getUsers();
      setOpenDialog({ ...openDialog, delete: false });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    initUsers();
    console.log("users", users);
  }, []);
  return (
    <Box>
      <Dialog open={openDialog.delete} onClose={handleCloseDeleteDialog}>
        <DialogTitle>Delete Question</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure to delete selected Question?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Stack
            direction="row"
            justifyContent="flex-end"
            spacing={1}
            component="form"
            onSubmit={deleteForm.handleSubmit(handleDeleteQuestion)}
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
            <Typography variant="h5">Manage Staff </Typography>
            <Box gap={1} display="flex">
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
                onClick={() => navigate("/configuration/question/create")}
              >
                Create
              </Button>
            </Box>
          </Box>
          <DataGrid
            sx={{ height: 600, width: "100%" }}
            rows={users}
            columns={columns}
            getRowId={(params) => params._id}
            slots={{ toolbar: GridToolbar }}
            scrollbarSize={3}
            checkboxSelection
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

export default QuestionPage;
