import { apis } from "../../apis";
import {
  SET_MY_TEAM_INVITATIONS,
  SET_TEAM_INVITATIONS,
  SET_TEAM_MEMBERS,
  UPDATE_CURRENT_TEAM,
  UPDATE_TEAMS,
} from "../actionTypes";
import { store } from "../store";

export const getMyInvitations = async () => {
  try {
    const {
      data: {
        data: { invitations },
      },
    } = await apis.getMyInvitations();
    store.dispatch({ type: SET_MY_TEAM_INVITATIONS, payload: invitations });
  } catch (error) {}
};

export const getTeamInfor = async () => {
  try {
    const {
      data: {
        data: { teams, current_team },
      },
    } = await apis.getTeamsInfor();
    store.dispatch({ type: UPDATE_TEAMS, payload: teams });
    store.dispatch({ type: UPDATE_CURRENT_TEAM, payload: current_team[0] });
  } catch (error) {}
};

export const getTeamMembers = async () => {
  try {
    const {
      data: {
        data: { teamMembers },
      },
    } = await apis.getTeamMembers();
    store.dispatch({ type: SET_TEAM_MEMBERS, payload: teamMembers });
  } catch (error) {
  }
};

export const getTeamInvitations = async () => {
  try {
    const {
      data: {
        data: { teamInvitations },
      },
    } = await apis.getTeamInvitations();
    store.dispatch({ type: SET_TEAM_INVITATIONS, payload: teamInvitations });
  } catch (error) {}
};
