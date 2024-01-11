import {
  SET_TEAM_INVITATIONS,
  SET_TEAM_MEMBERS,
  UPDATE_CURRENT_TEAM,
  UPDATE_TEAMS,
} from "../actionTypes";

const initialState = {
  currentTeam: null,
  teams: [],
  teamInvitations: [],
  teamMembers: [],
};

export const teamReducer = (state = initialState, action) => {
  switch (action.type) {
    case UPDATE_CURRENT_TEAM:
      return {
        ...state,
        currentTeam: action.payload,
      };
    case UPDATE_TEAMS:
      return {
        ...state,
        teams: action.payload,
      };
    case SET_TEAM_MEMBERS:
      return {
        ...state,
        teamMembers: action.payload,
      };
    case SET_TEAM_INVITATIONS:
      return {
        ...state,
        teamInvitations: action.payload,
      };
    default:
      return state;
  }
};
