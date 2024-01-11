import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Stack,
  Typography,
} from "@mui/material";
import { useSelector } from "react-redux";
import { apis } from "../../apis";
import { getMyInvitations } from "../../redux/actions/teamActions";

const NotificationsPage = () => {
  const { myInvitations } = useSelector((state) => state.auth);
  const handleConfirmInvitation = async (e) => {
    try {
      await apis.confirmInvitation(e.hash);
      getMyInvitations();
    } catch (error) {}
  };
  const handleCancelInvitation = async (e) => {
    try {
      await apis.cancelTeamInvitation(e.id);
      getMyInvitations();
    } catch (error) {}
  };
  return (
    <Box>
      <Card sx={{ maxWidth: 700, mb: 2 }}>
        <CardHeader title="Notifications" />
        <CardContent>
          {myInvitations.map((invitation) => (
            <Stack
              direction="column"
              spacing={1}
              key={`invitation-${invitation.id}`}
            >
              <Typography variant="h6">Team invitation</Typography>
              <Stack direction="row" spacing={2}>
                <Typography variant="p">Team information:</Typography>
                <Typography variant="p">{invitation.id}</Typography>
              </Stack>
              <Stack direction="row" spacing={2}>
                <Typography variant="p">Invitation sent by:</Typography>
                <Typography variant="p">{invitation.sent_by}</Typography>
              </Stack>
              <Stack direction="row" spacing={2}>
                <Typography variant="p">Invitation sent at:</Typography>
                <Typography variant="p">
                  {new Date(invitation.created_at).toDateString()}
                </Typography>
              </Stack>
              <Stack direction="row" spacing={2}>
                <Typography variant="p">Your role:</Typography>
                <Typography variant="p">{invitation.role}</Typography>
              </Stack>
              <Stack direction="row" spacing={2} justifyContent="flex-end">
                <Button
                  color="error"
                  onClick={() => handleCancelInvitation(invitation)}
                >
                  Cancel
                </Button>
                <Button
                  color="primary"
                  variant="outlined"
                  onClick={() => handleConfirmInvitation(invitation)}
                >
                  Accept
                </Button>
              </Stack>
              <Divider />
            </Stack>
          ))}
        </CardContent>
      </Card>
    </Box>
  );
};

export default NotificationsPage;
