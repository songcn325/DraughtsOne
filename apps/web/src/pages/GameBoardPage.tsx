import { createInitialGameState } from "@draughtsone/draughts-engine";
import { DraughtsBoard } from "../components/DraughtsBoard";
import { PlayerCard } from "../components/PlayerCard";
import { TactileButton } from "../components/TactileButton";

const state = createInitialGameState();

export function GameBoardPage() {
  return (
    <div className="mx-auto max-w-md space-y-5">
      <PlayerCard name="Sarah D." rating={1240} clock="08:45" />
      <DraughtsBoard state={state} />
      <PlayerCard name="You" rating={1188} clock="09:12" active />
      <div className="grid grid-cols-3 gap-3">
        <TactileButton tone="surface">Offer draw</TactileButton>
        <TactileButton tone="danger">Resign</TactileButton>
        <TactileButton tone="secondary">Chat</TactileButton>
      </div>
    </div>
  );
}

