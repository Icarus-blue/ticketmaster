import * as React from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Grid,
  IconButton,
} from "@mui/material";
import { Stack } from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import logo from '../../assets/img/logo_full.jpg';
import background from '../../assets/img/background.jpg';
import { MarginTwoTone } from "@mui/icons-material";
import { Link } from "react-router-dom";

const Overview = () => {
  return (
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
          <Typography variant="h4" >
            <Link style={{ color: 'white' }} to={`https://www.ptsdrop.com`}>
              www.ptsdrop.com
            </Link>
          </Typography>
        </Box>

        <Box sx={{ display: "flex", justifyContent: "space-around", alignItems: "center", mt: 4 }}>
          <img src={logo} alt="Big Image" style={{ width: 200,height:300 }} />
          <img src={background} alt="Big Image" style={{ maxWidth: "100%" }} />
        </Box>


        <Grid container spacing={2} sx={{ marginTop: 10, marginBottom: 30 }}>

          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="subtitle1">Supported Sites</Typography>
            <Typography variant="body1">
              You can search for tickets by using every option on the primary ticketing sites.
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="subtitle1">Easy-to-use Interface</Typography>
            <Typography variant="body1">
              Adding and deleting events are as easy as 1-2-3. There is no waiting after adding, events are accepted by the system immediately.
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="subtitle1">Different Scale Accounts</Typography>
            <Typography variant="body1">
              You are not limited to certain scale memberships. You can sign up for any scale account by contacting us.
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="subtitle1">Excellent Support</Typography>
            <Typography variant="body1">
              We are committed to providing our customers high-quality support.
            </Typography>
          </Grid>
        </Grid>

      </CardContent>
    </Card>
  );
};

export default Overview;

