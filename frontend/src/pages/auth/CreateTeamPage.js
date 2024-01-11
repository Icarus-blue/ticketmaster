import { LoadingButton } from "@mui/lab";
import {
  Autocomplete,
  Box,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Grid,
  InputAdornment,
  Stack,
  TextField,
} from "@mui/material";
import AddressAutocomplete from "mui-address-autocomplete";
import { MuiTelInput, matchIsValidTel } from "mui-tel-input";
import { Controller, useForm } from "react-hook-form";
import { apis } from "../../apis";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";

const CreateTeamPage = () => {
  const { countries, currencies, timezones } = useSelector(
    (state) => state.common
  );
  const { teams } = useSelector((state) => state.team);
  const {
    register,
    handleSubmit,
    setValue,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
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
      email: null,
    },
  });
  const { user } = useSelector((state) => state.auth);
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

    setValue("address", address || "");
    setValue("city", city || "");
    setValue("state", state || "");
    setValue("zip", zip || "");
    setValue("country", country || "");
    setAddress(value);
  };

  const getComponentValue = (components, type) => {
    const component = components?.find((c) => c.types.includes(type));
    return component ? component.long_name : "";
  };

  const handleCreateTeam = async (data) => {
    try {
      await apis.createTeam(data);
      reset();
      setValue("email", user.email);
    } catch (e) {
    }
  };

  useEffect(() => {
    if (user) {
      setValue("email", user.email);
    }
  }, [user, setValue]);

  if (!user) return;
  else
    return (
      <Box maxWidth={700}>
        <Card>
          <CardHeader
            title="Create a team"
            subheader="Let's team up to increase our network."
          />
          <CardContent>
            <Stack
              direction="column"
              spacing={2}
              component="form"
              onSubmit={handleSubmit(handleCreateTeam)}
            >
              <TextField
                label="Email"
                sx={{ maxWidth: 400 }}
                {...register("email")}
                disabled
              />
              <TextField
                label="Team Name"
                sx={{ maxWidth: 400 }}
                {...register("name", {
                  required: "Team name is required",
                  validate: (value) => {
                    var teamNameExist = false;
                    teams.forEach((e) => {
                      if (e.name === value) teamNameExist = true;
                    });
                    return !teamNameExist || "This team name already exist";
                  },
                })}
                error={!!errors.name}
                helperText={errors.name && errors.name.message}
              />
              <Controller
                name="phone"
                control={control}
                rules={{ validate: matchIsValidTel }}
                render={({ field, fieldState }) => (
                  <MuiTelInput
                    {...field}
                    label="Phone"
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
                      sx={{ width: "100%" }}
                      {...register("address", {
                        required: "This field is required.",
                      })}
                      error={!!errors.address}
                      helperText={errors.address && errors.address.message}
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
                      {...register("city", {
                        required: "This field is required.",
                      })}
                      error={!!errors.city}
                      helperText={errors.city && errors.city.message}
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
                      {...register("state", {
                        required: "This field is required.",
                      })}
                      error={!!errors.state}
                      helperText={errors.state && errors.state.message}
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
                      sx={{ width: "100%" }}
                      {...register("zip", {
                        required: "This field is required",
                      })}
                      error={!!errors.zip}
                      helperText={errors.zip && errors.zip.message}
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
                      control={control}
                      render={({ field: { value, onChange } }) => (
                        <Autocomplete
                          options={countries}
                          sx={{ maxWidth: 400 }}
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
                              error={!!errors.country}
                              helperText={
                                errors.country && errors.country.message
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
                {...register("website", {
                  pattern: {
                    value: /^(ftp|http|https):\/\/[^ "]+$/,
                    message: "Invalide url",
                  },
                })}
                helperText={errors.website && errors.website.message}
                error={!!errors.website}
              />
              <Controller
                name="currency"
                rules={{ required: "This field is required" }}
                control={control}
                render={({ field: { value, onChange } }) => (
                  <Autocomplete
                    options={currencies}
                    sx={{ maxWidth: 400 }}
                    value={value}
                    onChange={(_, data) => {
                      onChange(data);
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Currency"
                        error={!!errors.currency}
                        helperText={errors.currency && errors.currency.message}
                      />
                    )}
                  />
                )}
              />
              <Controller
                name="timezone"
                rules={{ required: "This field is required" }}
                control={control}
                render={({ field: { value, onChange } }) => (
                  <Autocomplete
                    options={timezones}
                    sx={{ maxWidth: 400 }}
                    value={value}
                    onChange={(_, data) => {
                      onChange(data);
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Timezone"
                        error={!!errors.timezone}
                        helperText={errors.timezone && errors.timezone.message}
                      />
                    )}
                  />
                )}
              />
              <CardActions sx={{ display: "flex", justifyContent: "flex-end" }}>
                <LoadingButton
                  variant="contained"
                  type="submit"
                  loading={isSubmitting}
                >
                  Create now
                </LoadingButton>
              </CardActions>
            </Stack>
          </CardContent>
        </Card>
      </Box>
    );
};

export default CreateTeamPage;
