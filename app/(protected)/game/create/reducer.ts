import { Role } from "@prisma/client";

type AddTeamAction = {
  type: "team_added";
  teamName: string;
};

type RemoveTeamAction = {
  type: "team_removed";
  teamName: string;
};

type AddMemberAction = {
  type: "member_added";
  teamName: string;
  user: User;
};

type RemoveMemberAction = {
  type: "member_removed";
  teamName: string;
  userId: string;
};

type SetRoleAction = {
  type: "role_set";
  teamName: string;
  role: Role;
};

export type GameAction =
  | AddTeamAction
  | RemoveTeamAction
  | AddMemberAction
  | RemoveMemberAction
  | SetRoleAction;

export interface GameState {
  teams: Team[];
}

export type Team = {
  name: string;
  role: Role;
  members: User[];
};

export type User = { id: string; username: string };

export default function reducer(game: GameState, action: GameAction) {
  switch (action.type) {
    case "member_added": {
      const nextTeams = [...game.teams].map((team) => {
        if (team.name === action.teamName) {
          return {
            ...team,
            members: [...team.members, action.user],
          };
        }
        return team;
      });

      return { ...game, teams: nextTeams } satisfies GameState;
    }
    case "member_removed": {
      const nextTeams = [...game.teams].map((team) => {
        if (team.name === action.teamName) {
          const nextTeamMembers = [...team.members].filter(({ id }) => id !== action.userId);
          return { ...team, members: nextTeamMembers };
        }
        return team;
      });

      return { ...game, teams: nextTeams } satisfies GameState;
    }
    case "team_added": {
      const newTeam: Team = {
        name: action.teamName,
        role: Role.HIDER,
        members: [],
      };
      return { ...game, teams: [...game.teams, newTeam] } satisfies GameState;
    }
    case "team_removed": {
      const nextTeams = [...game.teams].filter((team) => team.name !== action.teamName);
      return { ...game, teams: nextTeams } satisfies GameState;
    }
    case "role_set": {
      const nextTeams = [...game.teams].map((team) => {
        if (team.name === action.teamName) {
          return { ...team, role: action.role };
        }
        return team;
      });
      return { ...game, teams: nextTeams } satisfies GameState;
    }
  }
}
