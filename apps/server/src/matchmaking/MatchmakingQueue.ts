import type { MatchmakingStatusPayload, TimeControl } from "@draughtsone/shared";

export type MatchmakingTicket = {
  socketId: string;
  userId: string;
  timeControl: TimeControl;
  rating: number;
  queuedAtMs: number;
};

export type MatchPair = {
  first: MatchmakingTicket;
  second: MatchmakingTicket;
};

export class MatchmakingQueue {
  constructor(
    private readonly timeoutMs = 10 * 60 * 1000,
    private readonly delayedAfterMs = 2 * 60 * 1000
  ) {}

  join(ticket: MatchmakingTicket): MatchPair | undefined {
    this.cancelByUser(ticket.userId);
    const opponentIndex = this.tickets.findIndex((candidate) =>
      candidate.userId !== ticket.userId &&
      candidate.timeControl.initialSeconds === ticket.timeControl.initialSeconds &&
      candidate.timeControl.incrementSeconds === ticket.timeControl.incrementSeconds &&
      Math.abs(candidate.rating - ticket.rating) <= Math.max(
        this.ratingWindow(candidate, ticket.queuedAtMs),
        this.ratingWindow(ticket, ticket.queuedAtMs)
      )
    );
    if (opponentIndex === -1) {
      this.tickets.push(ticket);
      return undefined;
    }
    const [first] = this.tickets.splice(opponentIndex, 1);
    return { first, second: ticket };
  }

  cancelByUser(userId: string): MatchmakingTicket | undefined {
    const index = this.tickets.findIndex((ticket) => ticket.userId === userId);
    if (index === -1) return undefined;
    return this.tickets.splice(index, 1)[0];
  }

  cancelBySocket(socketId: string): MatchmakingTicket | undefined {
    const index = this.tickets.findIndex((ticket) => ticket.socketId === socketId);
    if (index === -1) return undefined;
    return this.tickets.splice(index, 1)[0];
  }

  getExpired(nowMs: number): MatchmakingTicket[] {
    const expired = this.tickets.filter((ticket) => nowMs - ticket.queuedAtMs >= this.timeoutMs);
    this.tickets = this.tickets.filter((ticket) => nowMs - ticket.queuedAtMs < this.timeoutMs);
    return expired;
  }

  getStatus(ticket: MatchmakingTicket, nowMs: number): MatchmakingStatusPayload {
    const waitedMs = Math.max(0, nowMs - ticket.queuedAtMs);
    return {
      status: waitedMs >= this.delayedAfterMs ? "delayed" : "searching",
      queuedAt: new Date(ticket.queuedAtMs).toISOString(),
      expiresAt: new Date(ticket.queuedAtMs + this.timeoutMs).toISOString(),
      waitedSeconds: Math.floor(waitedMs / 1000)
    };
  }

  list(): MatchmakingTicket[] {
    return [...this.tickets];
  }

  private tickets: MatchmakingTicket[] = [];

  private ratingWindow(ticket: MatchmakingTicket, nowMs: number) {
    const waitedMinutes = Math.floor(Math.max(0, nowMs - ticket.queuedAtMs) / 60_000);
    return Math.min(400, 100 + waitedMinutes * 50);
  }
}
