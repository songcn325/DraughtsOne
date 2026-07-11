import { describe, expect, it } from "vitest";
import { MatchmakingQueue } from "./MatchmakingQueue.js";

const tenMinutes = { initialSeconds: 600, incrementSeconds: 0 };

describe("MatchmakingQueue", () => {
  it("matches the oldest compatible opponent", () => {
    const queue = new MatchmakingQueue();
    expect(queue.join({ socketId: "one", userId: "user-one", rating: 1200, timeControl: tenMinutes, queuedAtMs: 1000 })).toBeUndefined();
    expect(queue.join({ socketId: "two", userId: "user-two", rating: 1200, timeControl: tenMinutes, queuedAtMs: 2000 })).toEqual({
      first: { socketId: "one", userId: "user-one", rating: 1200, timeControl: tenMinutes, queuedAtMs: 1000 },
      second: { socketId: "two", userId: "user-two", rating: 1200, timeControl: tenMinutes, queuedAtMs: 2000 }
    });
    expect(queue.list()).toHaveLength(0);
  });

  it("does not pair different time controls", () => {
    const queue = new MatchmakingQueue();
    queue.join({ socketId: "one", userId: "user-one", rating: 1200, timeControl: tenMinutes, queuedAtMs: 1000 });
    expect(queue.join({
      socketId: "two",
      userId: "user-two",
      rating: 1200,
      timeControl: { initialSeconds: 180, incrementSeconds: 0 },
      queuedAtMs: 2000
    })).toBeUndefined();
    expect(queue.list()).toHaveLength(2);
  });

  it("widens the acceptable rating range while a player waits", () => {
    const queue = new MatchmakingQueue();
    queue.join({ socketId: "one", userId: "user-one", rating: 1400, timeControl: tenMinutes, queuedAtMs: 0 });
    expect(queue.join({ socketId: "two", userId: "user-two", rating: 1200, timeControl: tenMinutes, queuedAtMs: 60_000 })).toBeUndefined();
    queue.cancelByUser("user-two");
    expect(queue.join({ socketId: "three", userId: "user-three", rating: 1200, timeControl: tenMinutes, queuedAtMs: 120_000 })).toBeDefined();
  });

  it("replaces an existing ticket for the same user", () => {
    const queue = new MatchmakingQueue();
    queue.join({ socketId: "old", userId: "user-one", rating: 1200, timeControl: tenMinutes, queuedAtMs: 1000 });
    queue.join({ socketId: "new", userId: "user-one", rating: 1200, timeControl: tenMinutes, queuedAtMs: 2000 });
    expect(queue.list()).toEqual([{ socketId: "new", userId: "user-one", rating: 1200, timeControl: tenMinutes, queuedAtMs: 2000 }]);
  });

  it("marks long waits as delayed and expires them at ten minutes", () => {
    const queue = new MatchmakingQueue(600_000, 120_000);
    const ticket = { socketId: "one", userId: "user-one", rating: 1200, timeControl: tenMinutes, queuedAtMs: 0 };
    queue.join(ticket);
    expect(queue.getStatus(ticket, 120_000).status).toBe("delayed");
    expect(queue.getExpired(599_999)).toHaveLength(0);
    expect(queue.getExpired(600_000)).toEqual([ticket]);
  });

  it("allows cancellation by user or disconnected socket", () => {
    const queue = new MatchmakingQueue();
    queue.join({ socketId: "one", userId: "user-one", rating: 1200, timeControl: tenMinutes, queuedAtMs: 1000 });
    expect(queue.cancelByUser("user-one")?.socketId).toBe("one");
    queue.join({ socketId: "two", userId: "user-two", rating: 1200, timeControl: tenMinutes, queuedAtMs: 2000 });
    expect(queue.cancelBySocket("two")?.userId).toBe("user-two");
  });
});
