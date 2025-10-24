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

export type Team = {
  name: string;
  role: Role;
  members: User[];
};

export type User = { id: string; username: string };

export default function reducer(teams: Team[], action: GameAction) {
  switch (action.type) {
    case "member_added": {
      const nextTeams = [...teams].map((team) => {
        if (team.name === action.teamName) {
          return {
            ...team,
            members: [...team.members, action.user],
          };
        }
        return team;
      });

      return nextTeams satisfies Team[];
    }
    case "member_removed": {
      const nextTeams = [...teams].map((team) => {
        if (team.name === action.teamName) {
          const nextTeamMembers = [...team.members].filter(({ id }) => id !== action.userId);
          return { ...team, members: nextTeamMembers };
        }
        return team;
      });

      return nextTeams satisfies Team[];
    }
    case "team_added": {
      const newTeam: Team = {
        name: action.teamName,
        role: Role.HIDER,
        members: [],
      };
      return [...teams, newTeam] satisfies Team[];
    }
    case "team_removed": {
      const nextTeams = [...teams].filter((team) => team.name !== action.teamName);
      return nextTeams satisfies Team[];
    }
    case "role_set": {
      const nextTeams = [...teams].map((team) => {
        if (team.name === action.teamName) {
          return { ...team, role: action.role };
        }
        return team;
      });
      return nextTeams satisfies Team[];
    }
  }
}
