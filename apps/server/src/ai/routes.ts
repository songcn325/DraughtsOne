import type { AiBestMoveRequest } from "@draughtsone/shared";
import type { FastifyInstance } from "fastify";
import { findBestMove, ScanEngineError } from "./scanEngine.js";

export function registerAiRoutes(app: FastifyInstance) {
  app.post<{ Body: AiBestMoveRequest }>("/ai/best-move", async (request, reply) => {
    try {
      const result = await findBestMove(request.body.state, request.body.moveTimeMs);
      return { ok: true, data: result };
    } catch (error) {
      if (!(error instanceof ScanEngineError)) throw error;

      const statusCode =
        error.code === "INVALID_POSITION" ? 400 : error.code === "BUSY" ? 429 : error.code === "TIMEOUT" ? 504 : 503;
      reply.code(statusCode);
      return { ok: false, error: { code: error.code, message: error.message } };
    }
  });
}
