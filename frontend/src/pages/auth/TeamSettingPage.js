import {
  Autocomplete,
  Avatar,
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
  FormControl,
  FormControlLabel,
  FormHelperText,
  FormLabel,
  Grid,
  InputAdornment,
  MenuItem,
  Radio,
  RadioGroup,
  Stack,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { MuiTelInput, matchIsValidTel } from "mui-tel-input";
import AddressAutocomplete from "mui-address-autocomplete";
import { toCapitalize } from "../../utils/toCapitalize";
import { Controller, useForm } from "react-hook-form";
import { LoadingButton } from "@mui/lab";
import { apis } from "../../apis";
import { useNavigate } from "react-router-dom";
import { getTeamInfor, getTeamInvitations, getTeamMembers } from "../../redux/actions/teamActions";

const TeamSettingPage = () => {
  const { isLoading, countries, currencies, timezones } = useSelector(
    (state) => state.common
  );
  const { currentTeam, teams, teamMembers, teamInvitations } = useSelector(
    (state) => state.team
  );
  const teamInfoForm = useForm({
    defaultValues: {
      phone: "",
      country: null,
      website: null,
      name: null,
      timezone: null,
      currency: null,
      city: null,
      state: null,
      zip: null,
      address: null,
    },
  });
  const addTeamMemberForm = useForm();
  const switchTeamForm = useForm();
  const [isDeletingTeam, setIsDeletingTeam] = useState(false);
  const [isRemovingTeamMember, setIsRemovingTeamMember] = useState(false);
  const [isCancelingInvitation, setIsCancelingInvitation] = useState(false);
  const [changeTeamInfo, setChangeTeamInfo] = useState(false);
  const [selectedInvitation, setSelectedInvitation] = useState(null);
  const [selectedTeamMember, setSelectedTeamMember] = useState(null);
  const theme = useTheme();
  const navigate = useNavigate();

  const [openCancelInviteDialog, setOpenCancelInviteDialog] = useState(false);
  const [openDeleteTeamDialog, setOpenDeleteTeamDialog] = useState(false);
  const [openRemoveTeamMemberDialog, setOpenRemoveTeamMemberDialog] =
    useState(false);
  const handleCloseDeleteTeamDialog = () => {
    setOpenDeleteTeamDialog(false);
  };
  const handleOpenDeleteTeamDialog = () => {
    setOpenDeleteTeamDialog(true);
  };
  const handleDeleteTeam = async () => {
    try {
      setIsDeletingTeam(true);
      await apis.deleteTeam(currentTeam.id);
      var team_id;
      teams.forEach((team) => {
        if (team.id !== currentTeam.id) {
          team_id = team.id;
          return;
        }
      });
      await apis.switchTeam(team_id);
      setOpenDeleteTeamDialog(false);
      init();
      switchTeamForm.setValue("team_id", currentTeam.id);
    } catch (error) {
      console.log(error);
    } finally {
      setIsDeletingTeam(false);
    }
  };

  const handleCloseCancelInvitationDialog = () => {
    setSelectedInvitation(null);
    setOpenCancelInviteDialog(false);
  };
  const handleOpenCancelInvitationDialog = (data) => {
    setSelectedInvitation(data);
    setOpenCancelInviteDialog(true);
  };
  const handleCancelInvitation = async () => {
    try {
      setIsCancelingInvitation(true);
      await apis.cancelTeamInvitation(selectedInvitation.id);
      getTeamInvitations();
      setSelectedInvitation(null);
      setOpenCancelInviteDialog(false);
    } catch (e) {
    } finally {
      setIsCancelingInvitation(false);
    }
  };

  const handleCloseRemoveTeamMemberDialog = () => {
    setSelectedTeamMember(null);
    setOpenRemoveTeamMemberDialog(false);
  };
  const handleOpenRemoveTeamMemberDialog = (data) => {
    setSelectedTeamMember(data);
    setOpenRemoveTeamMemberDialog(true);
  };
  const handleRemoveTeamMember = async () => {
    try {
      setIsRemovingTeamMember(true);
      await apis.removeTeamMember(selectedTeamMember.id);
      getTeamMembers();
      setSelectedTeamMember(null);
      setOpenRemoveTeamMemberDialog(false);
    } catch (e) {
    } finally {
      setIsRemovingTeamMember(false);
    }
  };

  const handleUpdateTeamInfo = async (data) => {
    if (isLoading) return;
    try {
      await apis.updateTeam(currentTeam.id, data);
      setChangeTeamInfo(false);
      init();
    } catch (e) {}
  };

  const [address, setAddress] = useState("");
  const handleSelectAddress = (_, value) => {
    const addressComponents = value?.address_components;
    const address = value?.formatted_address || "";
    const city = getComponentValue(addressComponents, "locality");
    const state = getComponentValue(
      addressComponents,
      "administrative_area_level_1"
    );
    const zip = getComponentValue(addressComponents, "postal_code");
    const country = getComponentValue(addressComponents, "country");

    teamInfoForm.setValue("address", address || "");
    teamInfoForm.setValue("city", city || "");
    teamInfoForm.setValue("state", state || "");
    teamInfoForm.setValue("zip", zip || "");
    teamInfoForm.setValue("country", country || "");
    setAddress(value);
  };

  const getComponentValue = (components, type) => {
    const component = components?.find((c) => c.types.includes(type));
    return component ? component.long_name : "";
  };

  const initTeamInfo = useCallback(() => {
    teamInfoForm.setValue("currency", currentTeam.currency);
    teamInfoForm.setValue("name", currentTeam.name);
    teamInfoForm.setValue("timezone", currentTeam.timezone);
    teamInfoForm.setValue("website", currentTeam.website);
    teamInfoForm.setValue("address", currentTeam.address);
    teamInfoForm.setValue("city", currentTeam.city);
    teamInfoForm.setValue("state", currentTeam.state);
    teamInfoForm.setValue("zip", currentTeam.zip);
    teamInfoForm.setValue("country", currentTeam.country);
    teamInfoForm.setValue("phone", currentTeam.phone || "");
  }, [currentTeam, teamInfoForm]);

  const handleAddTeamMember = async (data) => {
    try {
      await apis.addTeamMember(data);
      getTeamInvitations();
    } catch (e) {}
  };

  const handleSubmitSwitchTeam = async (data) => {
    try {
      await apis.switchTeam(data.team_id);
      init();
    } catch (e) {}
  };

  useEffect(() => {
    if (currentTeam) {
      initTeamInfo();
    }
  }, [currentTeam, initTeamInfo]);

  const init = () => {
    getTeamInfor();
    getTeamMembers();
    getTeamInvitations();
  };

  useEffect(() => {
    init();
  }, []);

  if (!currentTeam)
    return (
      <Box maxWidth={700}>
        {!isLoading && (
          <Stack direction="column" spacing={2} alignItems="flex-start">
            <Typography variant="h5">No team yet</Typography>
            <Typography variant="p">
              Please click below button to create a new team.
            </Typography>
            <Button
              variant="contained"
              onClick={() => navigate("/create-team")}
            >
              Create a new team
            </Button>
          </Stack>
        )}
      </Box>
    );
  else
    return (
      <Box maxWidth={700}>
        <Dialog
          open={openDeleteTeamDialog}
          onClose={handleCloseDeleteTeamDialog}
        >
          <DialogTitle>Delete team</DialogTitle>
          <DialogContent>Are you sure to delete this team?</DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDeleteTeamDialog}>Cancel</Button>
            <LoadingButton
              color="error"
              onClick={handleDeleteTeam}
              loading={isDeletingTeam}
            >
              Delete
            </LoadingButton>
          </DialogActions>
        </Dialog>
        <Dialog
          open={openCancelInviteDialog}
          onClose={handleCloseCancelInvitationDialog}
        >
          <DialogTitle>Cancel invitation</DialogTitle>
          <DialogContent>Are you sure to cancel this invitation?</DialogContent>
          <DialogActions>
            <Button onClick={handleCloseCancelInvitationDialog}>Cancel</Button>
            <LoadingButton
              color="error"
              onClick={handleCancelInvitation}
              loading={isCancelingInvitation}
            >
              Ok
            </LoadingButton>
          </DialogActions>
        </Dialog>
        <Dialog
          open={openRemoveTeamMemberDialog}
          onClose={handleCloseRemoveTeamMemberDialog}
        >
          <DialogTitle>Remove team member</DialogTitle>
          <DialogContent>
            Are you sure to remove this team member?
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseRemoveTeamMemberDialog}>Cancel</Button>
            <LoadingButton
              color="error"
              onClick={handleRemoveTeamMember}
              loading={isRemovingTeamMember}
            >
              Ok
            </LoadingButton>
          </DialogActions>
        </Dialog>
        <Typography variant="h4" mb={3}>
          Team setting
        </Typography>
        <Card sx={{ mb: 6 }}>
          <CardHeader title="Switch team" />
          <CardContent>
            <Stack
              direction="column"
              spacing={2}
              component="form"
              onSubmit={switchTeamForm.handleSubmit(handleSubmitSwitchTeam)}
            >
              <TextField
                select
                label="Select team"
                defaultValue={currentTeam.id}
                error={!!switchTeamForm.formState.errors.team_id}
                helperText="Please select another team to switch"
                sx={{ maxWidth: 400 }}
                {...switchTeamForm.register("team_id", {
                  required: "This field is required",
                  validate: (value) =>
                    value !== currentTeam.id || "Please select another team",
                })}
              >
                {teams.map((option) => (
                  <MenuItem key={option.id} value={option.id}>
                    {option.name}
                  </MenuItem>
                ))}
              </TextField>
              <CardActions sx={{ display: "flex", justifyContent: "flex-end" }}>
                <LoadingButton
                  variant="contained"
                  type="submit"
                  loading={switchTeamForm.formState.isSubmitting}
                >
                  Switch now
                </LoadingButton>
              </CardActions>
            </Stack>
          </CardContent>
        </Card>
        <Card sx={{ mb: 6 }}>
          <CardHeader
            title="Team information"
            subheader="The team's name and owner information"
          />
          <CardContent>
            <Stack
              direction="column"
              spacing={2}
              component="form"
              onSubmit={teamInfoForm.handleSubmit(handleUpdateTeamInfo)}
            >
              <Stack direction="row" spacing={2} alignItems="center" mb={2}>
                <Avatar sx={{ bgcolor: theme.palette.primary.main }}>
                  {toCapitalize(currentTeam.name[0])}
                </Avatar>
                <Stack direction="column">
                  <Typography variant="p">{currentTeam.name}</Typography>
                  <Typography variant="p">{currentTeam.email}</Typography>
                </Stack>
              </Stack>
              <TextField
                label="Team Name"
                sx={{ maxWidth: 400 }}
                disabled={!changeTeamInfo}
                {...teamInfoForm.register("name", {
                  required: "Team name is required",
                  validate: (value) => {
                    var teamNameExist = false;
                    teams.forEach((e) => {
                      if (e.name === value && e.name !== currentTeam.name)
                        teamNameExist = true;
                    });
                    return !teamNameExist || "This team name already exist";
                  },
                })}
                error={!!teamInfoForm.formState.errors.name}
                helperText={
                  teamInfoForm.formState.errors.name &&
                  teamInfoForm.formState.errors.name.message
                }
              />
              <Controller
                name="phone"
                control={teamInfoForm.control}
                rules={{ validate: matchIsValidTel }}
                render={({ field, fieldState }) => (
                  <MuiTelInput
                    {...field}
                    label="phone"
                    disabled={!changeTeamInfo}
                    sx={{ maxWidth: 400 }}
                    defaultCountry="US"
                    helperText={
                      fieldState.invalid ? "Phone number is invalid" : ""
                    }
                    error={fieldState.invalid}
                  />
                )}
              />
              <AddressAutocomplete
                apiKey={process.env.REACT_APP_GOOGLE_MAP_API_KEY}
                fields={["geometry"]}
                disabled={!changeTeamInfo}
                value={address}
                onChange={handleSelectAddress}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Select address"
                    sx={{ maxWidth: 400 }}
                    inputProps={{
                      ...params.inputProps,
                      autoComplete: "new-password", // disable autocomplete and autofill
                    }}
                  />
                )}
              />
              <Box maxWidth={400}>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField
                      disabled={!changeTeamInfo}
                      sx={{ width: "100%" }}
                      {...teamInfoForm.register("address", {
                        required: "This field is required.",
                      })}
                      error={!!teamInfoForm.formState.errors.address}
                      helperText={
                        teamInfoForm.formState.errors.address &&
                        teamInfoForm.formState.errors.address.message
                      }
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            Address:
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      sx={{ width: "100%" }}
                      disabled={!changeTeamInfo}
                      {...teamInfoForm.register("city", {
                        required: "This field is required.",
                      })}
                      error={!!teamInfoForm.formState.errors.city}
                      helperText={
                        teamInfoForm.formState.errors.city &&
                        teamInfoForm.formState.errors.city.message
                      }
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            City:
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      sx={{ width: "100%" }}
                      disabled={!changeTeamInfo}
                      {...teamInfoForm.register("state", {
                        required: "This field is required.",
                      })}
                      error={!!teamInfoForm.formState.errors.state}
                      helperText={
                        teamInfoForm.formState.errors.state &&
                        teamInfoForm.formState.errors.state.message
                      }
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            State:
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      disabled={!changeTeamInfo}
                      sx={{ width: "100%" }}
                      {...teamInfoForm.register("zip", {
                        required: "This field is required",
                      })}
                      error={!!teamInfoForm.formState.errors.zip}
                      helperText={
                        teamInfoForm.formState.errors.zip &&
                        teamInfoForm.formState.errors.zip.message
                      }
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            Zipcode:
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Controller
                      name="country"
                      rules={{ required: "This field is required" }}
                      control={teamInfoForm.control}
                      render={({ field: { value, onChange } }) => (
                        <Autocomplete
                          options={countries}
                          sx={{ maxWidth: 400 }}
                          disabled={!changeTeamInfo}
                          value={value}
                          onChange={(_, data) => {
                            onChange(data);
                          }}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              InputProps={{
                                ...params.InputProps,
                                startAdornment: (
                                  <InputAdornment position="start">
                                    Country:
                                  </InputAdornment>
                                ),
                              }}
                              error={!!teamInfoForm.formState.errors.country}
                              helperText={
                                teamInfoForm.formState.errors.country &&
                                teamInfoForm.formState.errors.country.message
                              }
                            />
                          )}
                        />
                      )}
                    />
                  </Grid>
                </Grid>
              </Box>
              <TextField
                label="Website"
                placeholder="https://example.com"
                sx={{ maxWidth: 400 }}
                disabled={!changeTeamInfo}
                {...teamInfoForm.register("website", {
                  pattern: {
                    value: /^(ftp|http|https):\/\/[^ "]+$/,
                    message: "Invalide url",
                  },
                })}
                helperText={
                  teamInfoForm.formState.errors.website &&
                  teamInfoForm.formState.errors.website.message
                }
                error={!!teamInfoForm.formState.errors.website}
              />
              <Controller
                name="currency"
                rules={{ required: "This field is required" }}
                control={teamInfoForm.control}
                render={({ field: { value, onChange } }) => (
                  <Autocomplete
                    options={currencies}
                    sx={{ maxWidth: 400 }}
                    disabled={!changeTeamInfo}
                    value={value}
                    onChange={(_, data) => {
                      onChange(data);
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Currency"
                        error={!!teamInfoForm.formState.errors.currency}
                        helperText={
                          teamInfoForm.formState.errors.currency &&
                          teamInfoForm.formState.errors.currency.message
                        }
                      />
                    )}
                  />
                )}
              />
              <Controller
                name="timezone"
                rules={{ required: "This field is required" }}
                control={teamInfoForm.control}
                render={({ field: { value, onChange } }) => (
                  <Autocomplete
                    options={timezones}
                    sx={{ maxWidth: 400 }}
                    disabled={!changeTeamInfo}
                    value={value}
                    onChange={(_, data) => {
                      onChange(data);
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Timezone"
                        error={!!teamInfoForm.formState.errors.timezone}
                        helperText={
                          teamInfoForm.formState.errors.timezone &&
                          teamInfoForm.formState.errors.timezone.message
                        }
                      />
                    )}
                  />
                )}
              />
              <CardActions sx={{ display: "flex", justifyContent: "flex-end" }}>
                {changeTeamInfo ? (
                  <>
                    <Button
                      onClick={() => {
                        setChangeTeamInfo(false);
                        initTeamInfo();
                        teamInfoForm.clearErrors();
                      }}
                    >
                      Cancel
                    </Button>
                    <LoadingButton
                      variant="contained"
                      type="submit"
                      loading={teamInfoForm.formState.isSubmitting}
                    >
                      Update now
                    </LoadingButton>
                  </>
                ) : (
                  <Button
                    variant="contained"
                    onClick={() => {
                      setChangeTeamInfo(true);
                    }}
                  >
                    Update
                  </Button>
                )}
              </CardActions>
            </Stack>
          </CardContent>
        </Card>
        <Card sx={{ mb: 6 }}>
          <CardHeader
            title="Add Team Member"
            subheader="Add a new team member to your team, allowing them to collaborate with you."
          />
          <CardContent>
            <Stack
              direction="column"
              spacing={2}
              component="form"
              onSubmit={addTeamMemberForm.handleSubmit(handleAddTeamMember)}
            >
              <Typography variant="p">
                Please provide the email address of the person you would like to
                add to this team.
              </Typography>
              <TextField
                label="Email"
                sx={{ maxWidth: 400 }}
                helperText={
                  addTeamMemberForm.formState.errors.email &&
                  addTeamMemberForm.formState.errors.email.message
                }
                error={!!addTeamMemberForm.formState.errors.email}
                {...addTeamMemberForm.register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "Invalid email address",
                  },
                })}
              />
              <Controller
                rules={{ required: true }}
                control={addTeamMemberForm.control}
                name="role"
                defaultValue="editor"
                render={({ field }) => (
                  <FormControl>
                    <FormLabel
                      error={!!addTeamMemberForm.formState.errors.role}
                    >
                      Role
                    </FormLabel>
                    <RadioGroup
                      {...field}
                      // {...addTeamMemberForm.register("role", {
                      //   required: "Role is required.",
                      // })}
                    >
                      <FormControlLabel
                        value="administrator"
                        control={<Radio />}
                        label="Administrator"
                      />
                      <FormHelperText>
                        Administrator users can perform any action.
                      </FormHelperText>
                      <FormControlLabel
                        value="editor"
                        control={<Radio />}
                        label="Editor"
                      />
                      <FormHelperText>
                        Editor users have the ability to read, create, and
                        update.
                      </FormHelperText>
                      {!!addTeamMemberForm.formState.errors.role && (
                        <FormHelperText error>
                          {addTeamMemberForm.formState.errors.role &&
                            addTeamMemberForm.formState.errors.role.message}
                        </FormHelperText>
                      )}
                    </RadioGroup>
                  </FormControl>
                )}
              />
              <CardActions sx={{ display: "flex", justifyContent: "flex-end" }}>
                <LoadingButton
                  variant="contained"
                  type="submit"
                  loading={addTeamMemberForm.formState.isSubmitting}
                >
                  Add
                </LoadingButton>
              </CardActions>
            </Stack>
          </CardContent>
        </Card>
        <Card sx={{ mb: 6 }}>
          <CardHeader
            title="Pending Team Invitations"
            subheader="These people have been invited to your taem and have been sent an invitation email, They may join the team by accepting the email invitation."
          />
          <CardContent>
            {teamInvitations.length ? (
              teamInvitations.map((e) => (
                <Stack
                  direction="row"
                  spacing={2}
                  justifyContent="space-between"
                  key={`team-invaitions-${e.id}`}
                >
                  <Typography variant="p">{e.email}</Typography>
                  <Button
                    color="error"
                    onClick={() => handleOpenCancelInvitationDialog(e)}
                  >
                    Cancel
                  </Button>
                </Stack>
              ))
            ) : (
              <Typography variant="p">No invitations yet</Typography>
            )}
          </CardContent>
        </Card>
        <Card sx={{ mb: 6 }}>
          <CardHeader
            title="Team Members"
            subheader="All of the people that are part of this team."
          />
          <CardContent>
            {teamMembers.length ? (
              teamMembers.map((e) => (
                <Stack
                  direction="row"
                  spacing={2}
                  justifyContent="space-between"
                  key={`team-member-${e.user.id}`}
                >
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Avatar sx={{ bgcolor: theme.palette.primary.main }}>
                      G
                    </Avatar>
                    <Typography variant="p">galileo</Typography>
                  </Stack>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Button>Edit</Button>
                    <Button
                      color="error"
                      onClick={() => handleOpenRemoveTeamMemberDialog(e)}
                    >
                      Remove
                    </Button>
                  </Stack>
                </Stack>
              ))
            ) : (
              <Typography variant="p">No team members yet</Typography>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader
            title="Delete Team"
            subheader="Permanently delete this team."
          />
          <CardContent>
            <Stack
              direction="column"
              spacing={2}
              justifyContent="flex-start"
              alignItems="flex-start"
              component="form"
            >
              <Typography variant="p">
                Once a team is deleted, all of its resources and data will be
                permanently deleted, Before deleting this team, please download
                any data or information regarding this team that you wish to
                retain,
              </Typography>
              <Button
                variant="contained"
                color="error"
                onClick={handleOpenDeleteTeamDialog}
              >
                Delete Team
              </Button>
            </Stack>
          </CardContent>
        </Card>
      </Box>
    );
};

export default TeamSettingPage;
