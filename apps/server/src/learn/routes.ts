import type { FastifyInstance } from "fastify";
import type { LearnPath } from "@draughtsone/shared";

const path: LearnPath = {
  streakDays: 5,
  gems: 120,
  currentLessonId: "openings",
  units: [
    {
      id: "unit-basics",
      title: "Unit 1: The Basics",
      subtitle: "Master movement and captures",
      nodes: [
        { id: "rules", unitId: "unit-basics", title: "Rules", status: "completed", icon: "school", progressPercent: 100 },
        { id: "openings", unitId: "unit-basics", title: "Openings", status: "available", icon: "play_arrow", progressPercent: 35 }
      ]
    }
  ]
};

export function registerLearnRoutes(app: FastifyInstance) {
  app.get("/learn/path", async () => ({ ok: true, data: path }));

  app.post<{ Params: { lessonId: string } }>("/learn/lessons/:lessonId/complete", async (request) => ({
    ok: true,
    data: { lessonId: request.params.lessonId, status: "completed", completedAt: new Date().toISOString(), awardedGems: 10 }
  }));
}
