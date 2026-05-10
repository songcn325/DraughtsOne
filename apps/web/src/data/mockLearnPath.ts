import type { LearnPath } from "@draughtsone/shared";

export const mockLearnPath: LearnPath = {
  units: [
    {
      id: "unit-basics",
      title: "Unit 1: The Basics",
      subtitle: "Master movement and captures",
      nodes: [
        { id: "rules", unitId: "unit-basics", title: "Rules", status: "completed", icon: "school" },
        { id: "openings", unitId: "unit-basics", title: "Openings", status: "available", icon: "play_arrow" },
        { id: "positions", unitId: "unit-basics", title: "Positions", status: "locked", icon: "lock" }
      ]
    },
    {
      id: "unit-tactics",
      title: "Unit 2: Tactical Play",
      subtitle: "Combinations and sacrifices",
      nodes: [
        { id: "tempo", unitId: "unit-tactics", title: "Tempo", status: "locked", icon: "bolt" },
        { id: "endgames", unitId: "unit-tactics", title: "Endgames", status: "locked", icon: "flag" }
      ]
    }
  ]
};

