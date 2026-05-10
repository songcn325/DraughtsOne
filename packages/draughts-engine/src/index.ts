import type { BoardPoint, BoardSquare, GameState, MovePayload, PlayerColor } from "@draughtsone/shared";

export type LegalMove = MovePayload & {
  captures: BoardPoint[];
  promotes: boolean;
};

export type MoveValidation =
  | { ok: true; move: LegalMove }
  | { ok: false; code: "NO_PIECE" | "WRONG_TURN" | "ILLEGAL_MOVE" | "MANDATORY_CAPTURE"; message: string };

const BOARD_SIZE = 10;

export function createInitialGameState(): GameState {
  const board: BoardSquare[][] = Array.from({ length: BOARD_SIZE }, () => Array.from({ length: BOARD_SIZE }, () => null));

  for (let row = 0; row < BOARD_SIZE; row += 1) {
    for (let col = 0; col < BOARD_SIZE; col += 1) {
      if (!isDarkSquare({ row, col })) continue;
      if (row < 4) board[row][col] = { id: `b-${row}-${col}`, color: "black", kind: "man" };
      if (row > 5) board[row][col] = { id: `w-${row}-${col}`, color: "white", kind: "man" };
    }
  }

  return {
    board,
    turn: "white",
    ply: 0,
    mandatoryCapture: false
  };
}

export function generateLegalMoves(state: GameState): LegalMove[] {
  const moves: LegalMove[] = [];
  const captures: LegalMove[] = [];

  forEachSquare(state.board, (piece, from) => {
    if (!piece || piece.color !== state.turn) return;
    const pieceMoves = piece.kind === "king" ? generateKingMoves(state, from) : generateManMoves(state, from);
    for (const move of pieceMoves) {
      if (move.captures.length > 0) captures.push(move);
      else moves.push(move);
    }
  });

  return captures.length > 0 ? captures : moves;
}

export function validateMove(state: GameState, payload: MovePayload): MoveValidation {
  const piece = getSquare(state.board, payload.from);
  if (!piece) return { ok: false, code: "NO_PIECE", message: "No piece exists on the source square." };
  if (piece.color !== state.turn) return { ok: false, code: "WRONG_TURN", message: "It is not this player's turn." };

  const legalMoves = generateLegalMoves(state);
  const legalMove = legalMoves.find((move) => samePoint(move.from, payload.from) && samePoint(move.to, payload.to));
  if (!legalMove) {
    const hasCapture = legalMoves.some((move) => move.captures.length > 0);
    return {
      ok: false,
      code: hasCapture ? "MANDATORY_CAPTURE" : "ILLEGAL_MOVE",
      message: hasCapture ? "A capture is available and must be played." : "The submitted move is not legal."
    };
  }

  return { ok: true, move: legalMove };
}

export function applyMove(state: GameState, payload: MovePayload): GameState {
  const validation = validateMove(state, payload);
  if (!validation.ok) throw new Error(validation.message);

  const nextBoard = cloneBoard(state.board);
  const movingPiece = nextBoard[payload.from.row][payload.from.col];
  if (!movingPiece) throw new Error("No piece exists on the source square.");

  nextBoard[payload.from.row][payload.from.col] = null;
  for (const capture of validation.move.captures) nextBoard[capture.row][capture.col] = null;

  const promoted =
    movingPiece.kind === "man" &&
    ((movingPiece.color === "white" && payload.to.row === 0) || (movingPiece.color === "black" && payload.to.row === BOARD_SIZE - 1));

  nextBoard[payload.to.row][payload.to.col] = promoted ? { ...movingPiece, kind: "king" } : movingPiece;

  const nextTurn = opposite(state.turn);
  const nextState: GameState = {
    ...state,
    board: nextBoard,
    turn: nextTurn,
    ply: state.ply + 1,
    mandatoryCapture: false,
    pendingMultiCaptureFrom: undefined
  };

  const opponentHasPieces = countPieces(nextBoard, nextTurn) > 0;
  const opponentHasMoves = generateLegalMoves(nextState).length > 0;
  if (!opponentHasPieces || !opponentHasMoves) {
    return { ...nextState, winner: state.turn, resultReason: "win" };
  }

  return nextState;
}

export function replayGame(moves: MovePayload[], initialState = createInitialGameState()): GameState {
  return moves.reduce((state, move) => applyMove(state, move), initialState);
}

function generateManMoves(state: GameState, from: BoardPoint): LegalMove[] {
  const piece = getSquare(state.board, from);
  if (!piece) return [];

  const forward = piece.color === "white" ? -1 : 1;
  const quietDirections = [
    { row: forward, col: -1 },
    { row: forward, col: 1 }
  ];
  const captureDirections = [
    { row: -1, col: -1 },
    { row: -1, col: 1 },
    { row: 1, col: -1 },
    { row: 1, col: 1 }
  ];

  const moves: LegalMove[] = [];

  for (const direction of quietDirections) {
    const to = { row: from.row + direction.row, col: from.col + direction.col };
    if (isPlayableDestination(state.board, to)) moves.push({ from, to, captures: [], promotes: promotes(piece.color, to) });
  }

  for (const direction of captureDirections) {
    const jumped = { row: from.row + direction.row, col: from.col + direction.col };
    const to = { row: from.row + direction.row * 2, col: from.col + direction.col * 2 };
    const jumpedPiece = getSquare(state.board, jumped);
    if (jumpedPiece && jumpedPiece.color !== piece.color && isPlayableDestination(state.board, to)) {
      moves.push({ from, to, captures: [jumped], path: [from, to], promotes: promotes(piece.color, to) });
    }
  }

  return moves;
}

function generateKingMoves(state: GameState, from: BoardPoint): LegalMove[] {
  const piece = getSquare(state.board, from);
  if (!piece) return [];

  const moves: LegalMove[] = [];
  for (const direction of [
    { row: -1, col: -1 },
    { row: -1, col: 1 },
    { row: 1, col: -1 },
    { row: 1, col: 1 }
  ]) {
    let seenOpponent: BoardPoint | undefined;
    for (let step = 1; step < BOARD_SIZE; step += 1) {
      const to = { row: from.row + direction.row * step, col: from.col + direction.col * step };
      if (!isInside(to)) break;
      const occupant = getSquare(state.board, to);
      if (!occupant) {
        moves.push({ from, to, captures: seenOpponent ? [seenOpponent] : [], path: [from, to], promotes: false });
        continue;
      }
      if (occupant.color === piece.color || seenOpponent) break;
      seenOpponent = to;
    }
  }
  return moves;
}

function isPlayableDestination(board: BoardSquare[][], point: BoardPoint): boolean {
  return isInside(point) && isDarkSquare(point) && !getSquare(board, point);
}

function getSquare(board: BoardSquare[][], point: BoardPoint): BoardSquare {
  if (!isInside(point)) return null;
  return board[point.row][point.col];
}

function isInside(point: BoardPoint): boolean {
  return point.row >= 0 && point.row < BOARD_SIZE && point.col >= 0 && point.col < BOARD_SIZE;
}

function isDarkSquare(point: BoardPoint): boolean {
  return (point.row + point.col) % 2 === 1;
}

function samePoint(a: BoardPoint, b: BoardPoint): boolean {
  return a.row === b.row && a.col === b.col;
}

function promotes(color: PlayerColor, to: BoardPoint): boolean {
  return (color === "white" && to.row === 0) || (color === "black" && to.row === BOARD_SIZE - 1);
}

function opposite(color: PlayerColor): PlayerColor {
  return color === "white" ? "black" : "white";
}

function cloneBoard(board: BoardSquare[][]): BoardSquare[][] {
  return board.map((row) => row.map((piece) => (piece ? { ...piece } : null)));
}

function countPieces(board: BoardSquare[][], color: PlayerColor): number {
  let count = 0;
  forEachSquare(board, (piece) => {
    if (piece?.color === color) count += 1;
  });
  return count;
}

function forEachSquare(board: BoardSquare[][], callback: (piece: BoardSquare, point: BoardPoint) => void): void {
  for (let row = 0; row < BOARD_SIZE; row += 1) {
    for (let col = 0; col < BOARD_SIZE; col += 1) callback(board[row][col], { row, col });
  }
}

