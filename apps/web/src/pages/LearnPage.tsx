import { useEffect, useState } from "react";
import { LearningBoard } from "../components/learning/LearningBoard";
import { LessonFrame } from "../components/learning/LessonFrame";
import { learningLessons, type Copy, type LearningLesson } from "../data/learningLessons";
import { useLanguage } from "../i18n";
import chapterBook from "../assets/learn/learn-chapter-book.png";
import chapterStar from "../assets/learn/learn-chapter-star.png";
import lockIcon from "../assets/learn/learn-lock-icon.png";

type Square = [number, number];
type BoardMove = { from: Square; to: Square };
type Lesson7Move = { to: Square; capture: Square };
type Lesson8White = { at: Square; king?: boolean; id: string };
type Lesson10Move = { to: Square; capture: Square };
type Lesson11Piece = { at: Square; id: string };
type Lesson12Piece = { at: Square; id: string };
type Lesson13Piece = { at: Square; id: string; king?: boolean };
type Lesson13Move = { to: Square; capture: Square };

type Lesson13Exercise = {
  whites: Lesson13Piece[];
  blacks: Lesson13Piece[];
  systemMove: { color: "white" | "black"; id: string; from: Square; to: Square };
  activeColor: "white" | "black";
  activeId: string;
  route: Lesson13Move[];
};

type Lesson10Exercise = {
  start: Square;
  blacks: Square[];
  routes: Lesson10Move[][];
};

const lesson10Exercises: Lesson10Exercise[] = [
  {
    start: [4, 5],
    blacks: [[6, 3]],
    routes: [[7, 2], [8, 1], [9, 0]].map((to) => [
      { to: to as Square, capture: [6, 3] },
    ]),
  },
  {
    start: [8, 1],
    blacks: [[6, 3], [7, 8]],
    routes: [[
      { to: [4, 5], capture: [6, 3] },
      { to: [8, 9], capture: [7, 8] },
    ]],
  },
  {
    start: [5, 0],
    blacks: [[3, 2], [3, 4], [3, 6], [3, 8]],
    routes: [[
      { to: [2, 3], capture: [3, 2] },
      { to: [4, 5], capture: [3, 4] },
      { to: [2, 7], capture: [3, 6] },
      { to: [4, 9], capture: [3, 8] },
    ]],
  },
  {
    start: [5, 0],
    blacks: [[3, 2], [3, 4], [3, 6], [3, 8], [6, 3], [8, 3], [8, 5]],
    routes: [
      [
        { to: [2, 3], capture: [3, 2] },
        { to: [4, 5], capture: [3, 4] },
        { to: [7, 2], capture: [6, 3] },
        { to: [9, 4], capture: [8, 3] },
        { to: [4, 9], capture: [8, 5] },
        { to: [2, 7], capture: [3, 8] },
        { to: [4, 5], capture: [3, 6] },
      ],
      [
        { to: [9, 4], capture: [8, 3] },
        { to: [4, 9], capture: [8, 5] },
        { to: [2, 7], capture: [3, 8] },
        { to: [4, 5], capture: [3, 6] },
        { to: [2, 3], capture: [3, 4] },
        { to: [4, 1], capture: [3, 2] },
        { to: [7, 4], capture: [6, 3] },
      ],
    ],
  },
];

const lesson11Setups: Array<{
  whites: Lesson11Piece[];
  blacks: Lesson11Piece[];
}> = [
  {
    whites: [
      { id: "w0", at: [5, 2] },
      { id: "w1", at: [6, 3] },
      { id: "w2", at: [7, 6] },
      { id: "w3", at: [7, 8] },
    ],
    blacks: [
      { id: "b0", at: [4, 1] },
      { id: "b1", at: [3, 2] },
      { id: "b2", at: [3, 6] },
      { id: "b3", at: [6, 9] },
    ],
  },
  {
    whites: [
      { id: "w0", at: [5, 0] },
      { id: "w1", at: [7, 2] },
      { id: "w2", at: [6, 3] },
      { id: "w3", at: [6, 5] },
      { id: "w4", at: [7, 6] },
      { id: "w5", at: [5, 8] },
    ],
    blacks: [
      { id: "b0", at: [1, 0] },
      { id: "b1", at: [2, 1] },
      { id: "b2", at: [1, 2] },
      { id: "b3", at: [4, 1] },
      { id: "b4", at: [1, 6] },
      { id: "b5", at: [4, 9] },
    ],
  },
  {
    whites: [
      { id: "w0", at: [7, 0] },
      { id: "w1", at: [6, 1] },
      { id: "w2", at: [7, 6] },
      { id: "w3", at: [5, 8] },
    ],
    blacks: [
      { id: "b0", at: [4, 1] },
      { id: "b1", at: [5, 2] },
      { id: "b2", at: [3, 8] },
    ],
  },
];

const lesson12Setups: Array<{
  whites: Lesson12Piece[];
  blacks: Lesson12Piece[];
  initialTrail?: Square[];
}> = [
  {
    whites: [
      { id: "w0", at: [4, 5] }, { id: "w1", at: [9, 0] },
      { id: "w2", at: [5, 6] }, { id: "w3", at: [9, 6] },
      { id: "w4", at: [6, 9] },
    ],
    blacks: [
      { id: "b0", at: [5, 8] }, { id: "b1", at: [8, 5] },
      { id: "b2", at: [2, 5] }, { id: "b3", at: [0, 9] },
      { id: "b4", at: [3, 8] },
    ],
  },
  {
    whites: [
      { id: "w0", at: [4, 5] }, { id: "w1", at: [9, 0] },
      { id: "w2", at: [5, 6] }, { id: "w3", at: [9, 6] },
      { id: "w4", at: [2, 9] },
    ],
    blacks: [
      { id: "b1", at: [8, 5] }, { id: "b2", at: [2, 5] },
      { id: "b3", at: [0, 9] },
    ],
    initialTrail: [[6, 9], [4, 7], [2, 9]],
  },
  {
    whites: [
      { id: "w0", at: [7, 2] }, { id: "w1", at: [6, 3] },
      { id: "w2", at: [6, 7] }, { id: "w3", at: [7, 8] },
    ],
    blacks: [
      { id: "b0", at: [5, 6] }, { id: "b1", at: [6, 1] },
      { id: "b2", at: [0, 7] }, { id: "b3", at: [3, 6] },
    ],
  },
  {
    whites: [
      { id: "w0", at: [7, 2] }, { id: "w1", at: [5, 2] },
      { id: "w2", at: [3, 2] }, { id: "w3", at: [7, 6] },
      { id: "w4", at: [8, 3] }, { id: "w5", at: [9, 4] },
      { id: "w6", at: [9, 6] },
    ],
    blacks: [
      { id: "b0", at: [2, 1] }, { id: "b1", at: [0, 5] },
      { id: "b2", at: [1, 0] }, { id: "b3", at: [5, 6] },
      { id: "b4", at: [4, 7] }, { id: "b5", at: [3, 8] },
      { id: "b6", at: [3, 6] },
    ],
    initialTrail: [[1, 2], [2, 1]],
  },
];

const lesson13Exercises: Lesson13Exercise[] = [
  {
    whites: [
      { id: "wk", at: [2, 9], king: true },
      { id: "w0", at: [6, 1] },
    ],
    blacks: [
      { id: "b0", at: [4, 5] }, { id: "b1", at: [5, 4] },
      { id: "b2", at: [3, 2] }, { id: "b3", at: [6, 3] },
      { id: "b4", at: [3, 4] },
    ],
    systemMove: { color: "black", id: "b0", from: [4, 5], to: [5, 6] },
    activeColor: "white",
    activeId: "wk",
    route: [
      { to: [7, 4], capture: [5, 6] },
      { to: [4, 1], capture: [6, 3] },
      { to: [2, 3], capture: [3, 2] },
      { to: [4, 5], capture: [3, 4] },
    ],
  },
  {
    whites: [
      { id: "w0", at: [5, 4] }, { id: "w1", at: [7, 2] },
      { id: "w2", at: [3, 0] }, { id: "w3", at: [6, 3] },
      { id: "w4", at: [6, 5] }, { id: "w5", at: [8, 5] },
      { id: "w6", at: [9, 8] },
    ],
    blacks: [
      { id: "bk", at: [0, 7], king: true },
      { id: "b0", at: [1, 8] }, { id: "b1", at: [1, 0] },
      { id: "b2", at: [3, 6] }, { id: "b3", at: [4, 7] },
      { id: "b4", at: [5, 8] },
    ],
    systemMove: { color: "white", id: "w0", from: [5, 4], to: [4, 3] },
    activeColor: "black",
    activeId: "bk",
    route: [
      { to: [6, 1], capture: [4, 3] },
      { to: [9, 4], capture: [7, 2] },
      { to: [7, 6], capture: [8, 5] },
      { to: [5, 4], capture: [6, 5] },
    ],
  },
];

const lesson8PageOneWhites: Lesson8White[] = [
  { at: [1, 2], id: "lesson8-promotion-white" },
];
const lesson8PageTwoWhites: Lesson8White[] = [
  { at: [2, 9], id: "lesson8-route-right" },
  { at: [4, 1], id: "lesson8-route-left" },
  { at: [5, 0], id: "lesson8-blocker" },
];
const lesson8PageTwoBlacks: Square[] = [[1, 8], [1, 6], [1, 2], [3, 2]];

const lesson7Exercises: Array<{
  start: Square;
  blockers: Square[];
  blacks: Square[];
  moves: Lesson7Move[];
}> = [
  {
    start: [7, 2],
    blockers: [[8, 1]],
    blacks: [[6, 3], [4, 5]],
    moves: [
      { to: [5, 4], capture: [6, 3] },
      { to: [3, 6], capture: [4, 5] },
    ],
  },
  {
    start: [7, 0],
    blockers: [],
    blacks: [[6, 1], [6, 3], [6, 5], [4, 7]],
    moves: [
      { to: [5, 2], capture: [6, 1] },
      { to: [7, 4], capture: [6, 3] },
      { to: [5, 6], capture: [6, 5] },
      { to: [3, 8], capture: [4, 7] },
    ],
  },
  {
    start: [7, 8],
    blockers: [[8, 9]],
    blacks: [
      [2, 3], [2, 5], [2, 7],
      [4, 3], [4, 5], [4, 7],
      [6, 3], [6, 5], [6, 7],
    ],
    moves: [
      { to: [5, 6], capture: [6, 7] },
      { to: [7, 4], capture: [6, 5] },
      { to: [5, 2], capture: [6, 3] },
      { to: [3, 4], capture: [4, 3] },
      { to: [5, 6], capture: [4, 5] },
      { to: [3, 8], capture: [4, 7] },
      { to: [1, 6], capture: [2, 7] },
      { to: [3, 4], capture: [2, 5] },
      { to: [1, 2], capture: [2, 3] },
    ],
  },
];

function sameSquare([rowA, colA]: Square, [rowB, colB]: Square) {
  return rowA === rowB && colA === colB;
}

function legalLesson7Captures(from: Square, blacks: Square[], blockers: Square[]) {
  const directions: Square[] = [[-2, -2], [-2, 2], [2, -2], [2, 2]];

  return directions.flatMap(([rowDelta, colDelta]) => {
    const to: Square = [from[0] + rowDelta, from[1] + colDelta];
    const capture: Square = [from[0] + rowDelta / 2, from[1] + colDelta / 2];
    const insideBoard = to[0] >= 0 && to[0] < 10 && to[1] >= 0 && to[1] < 10;
    const hasCapturedPiece = blacks.some((piece) => sameSquare(piece, capture));
    const landingOccupied = blacks.some((piece) => sameSquare(piece, to)) ||
      blockers.some((piece) => sameSquare(piece, to));

    return insideBoard && hasCapturedPiece && !landingOccupied ? [{ to, capture }] : [];
  });
}

const lesson7SuccessMessages: Copy[] = [
  {
    zh: "非常棒！你成功帮助小万完成了一次连吃！在国际跳棋中，连吃视为一步棋。",
    en: "Excellent! You helped White complete a multiple capture. In international draughts, the entire chain counts as one move.",
  },
  {
    zh: "这也难不倒你，小德拉夫和小万为你感到惊叹！要上难度了，试试看！",
    en: "That was no challenge for you! Draff and White are impressed. Now try this harder one!",
  },
  {
    zh: "非常棒！你已经掌握了连吃的规则，继续学习，不久你将成为小高手！",
    en: "Excellent! You have mastered multiple captures. Keep learning and you will soon become a draughts expert!",
  },
];

function localize(copy: Copy, language: "zh" | "en") { return copy[language]; }

function LessonTile({ lesson, completed, onClick }: { lesson: LearningLesson; completed: boolean; onClick: () => void }) {
  const { language } = useLanguage();
  return (
    <button type="button" onClick={onClick} className="relative min-h-[126px] rounded-[28px] border-2 border-[#e2e2e2] bg-white p-4 text-center shadow-[0_5px_0_rgba(0,0,0,.1)] transition hover:-translate-y-1 active:translate-y-1 active:shadow-none">
      <span className="absolute left-4 top-3 text-xs font-black text-[#8c9893]">{String(lesson.id).padStart(2, "0")}</span>
      {completed && <span className="absolute right-4 top-3 font-black text-[#4fbd8d]">✓</span>}
      <img src={lesson.icon} alt="" className="mx-auto h-16 w-16" />
      <p className="mt-3 text-base font-black text-[#202124]">{localize(lesson.title, language)}</p>
    </button>
  );
}

function LessonViewer({ lesson, onClose, onComplete }: { lesson: LearningLesson; onClose: () => void; onComplete: () => void }) {
  const { language, setLanguage } = useLanguage();
  const [pageIndex, setPageIndex] = useState(0);
  const [selected, setSelected] = useState<Square>();
  const [sequencePlaying, setSequencePlaying] = useState(false);
  const [lesson3White, setLesson3White] = useState<Square>([7, 4]);
  const [lesson3Black, setLesson3Black] = useState<Square>([3, 6]);
  const [lesson4White, setLesson4White] = useState<Square>([7, 2]);
  const [lesson4Black, setLesson4Black] = useState<Square | null>([5, 4]);
  const [lesson4Result, setLesson4Result] = useState<"demo" | "ready" | "correct" | "wrong" | "hint">("demo");
  const [lesson4Animating, setLesson4Animating] = useState(false);
  const [lesson4LatestMove, setLesson4LatestMove] = useState<BoardMove>();
  const [lesson6White, setLesson6White] = useState<Square>([5, 4]);
  const [lesson6Black, setLesson6Black] = useState<Square | null>([5, 6]);
  const [lesson6Result, setLesson6Result] = useState<"demo" | "ready" | "correct" | "wrong" | "hint">("demo");
  const [lesson6Animating, setLesson6Animating] = useState(false);
  const [lesson6LatestMove, setLesson6LatestMove] = useState<BoardMove>();
  const [lesson7White, setLesson7White] = useState<Square>(lesson7Exercises[0].start);
  const [lesson7Blacks, setLesson7Blacks] = useState<Square[]>(lesson7Exercises[0].blacks);
  const [lesson7Step, setLesson7Step] = useState(0);
  const [lesson7Result, setLesson7Result] = useState<"demo" | "ready" | "correct" | "wrong" | "hint">("demo");
  const [lesson7Animating, setLesson7Animating] = useState(false);
  const [lesson7Trail, setLesson7Trail] = useState<Square[]>();
  const [lesson8Whites, setLesson8Whites] = useState<Lesson8White[]>(lesson8PageOneWhites);
  const [lesson8Blacks, setLesson8Blacks] = useState<Square[]>([[0, 9]]);
  const [lesson8Route, setLesson8Route] = useState<"correct" | "wrong">();
  const [lesson8Step, setLesson8Step] = useState(0);
  const [lesson8Result, setLesson8Result] = useState<"ready" | "correct" | "wrong" | "hint">("ready");
  const [lesson8Animating, setLesson8Animating] = useState(false);
  const [lesson8Trail, setLesson8Trail] = useState<Square[]>();
  const [lesson10White, setLesson10White] = useState<Square>(lesson10Exercises[0].start);
  const [lesson10Blacks, setLesson10Blacks] = useState<Square[]>(lesson10Exercises[0].blacks);
  const [lesson10Step, setLesson10Step] = useState(0);
  const [lesson10RouteCandidates, setLesson10RouteCandidates] = useState<number[]>([0, 1, 2]);
  const [lesson10FoundRoutes, setLesson10FoundRoutes] = useState<number[]>([]);
  const [lesson10Result, setLesson10Result] = useState<"ready" | "one-route" | "correct" | "wrong" | "hint">("ready");
  const [lesson10Animating, setLesson10Animating] = useState(false);
  const [lesson10Trail, setLesson10Trail] = useState<Square[]>();
  const [lesson11Whites, setLesson11Whites] = useState<Lesson11Piece[]>(lesson11Setups[0].whites);
  const [lesson11Blacks, setLesson11Blacks] = useState<Lesson11Piece[]>(lesson11Setups[0].blacks);
  const [lesson11Result, setLesson11Result] = useState<"ready" | "sequence" | "correct" | "wrong-legal" | "wrong-illegal" | "hint">("ready");
  const [lesson11Animating, setLesson11Animating] = useState(false);
  const [lesson11Trail, setLesson11Trail] = useState<Square[]>();
  const [lesson12Whites, setLesson12Whites] = useState<Lesson12Piece[]>(lesson12Setups[0].whites);
  const [lesson12Blacks, setLesson12Blacks] = useState<Lesson12Piece[]>(lesson12Setups[0].blacks);
  const [lesson12Step, setLesson12Step] = useState(0);
  const [lesson12Result, setLesson12Result] = useState<"ready" | "sequence" | "correct" | "wrong-legal" | "wrong-illegal" | "hint">("ready");
  const [lesson12Animating, setLesson12Animating] = useState(false);
  const [lesson12Trail, setLesson12Trail] = useState<Square[]>();
  const [lesson13Whites, setLesson13Whites] = useState<Lesson13Piece[]>(lesson13Exercises[0].whites);
  const [lesson13Blacks, setLesson13Blacks] = useState<Lesson13Piece[]>(lesson13Exercises[0].blacks);
  const [lesson13Step, setLesson13Step] = useState(0);
  const [lesson13Result, setLesson13Result] = useState<"intro" | "demo" | "ready" | "sequence" | "correct" | "wrong" | "crossed" | "hint">("intro");
  const [lesson13Animating, setLesson13Animating] = useState(false);
  const [lesson13Trail, setLesson13Trail] = useState<Square[]>();
  const [lesson14White, setLesson14White] = useState<Square>([6, 5]);
  const [lesson14Black, setLesson14Black] = useState<Square | null>([4, 5]);
  const [lesson14Result, setLesson14Result] = useState<"demo" | "ready" | "correct" | "wrong" | "hint">("demo");
  const [lesson14Animating, setLesson14Animating] = useState(false);
  const [lesson14LatestMove, setLesson14LatestMove] = useState<BoardMove>();

  const [lesson3Animating, setLesson3Animating] = useState(false);
  const [lesson3Result, setLesson3Result] = useState<
    "idle" | "correct" | "wrong" | "hint"
  >("idle");
  const lesson3Interactive =
    lesson.id === 3 && (pageIndex === 0 || pageIndex === 1);

  const lesson3IsWhite = lesson.id === 3 && pageIndex === 0;

  const lesson3ActivePiece = lesson3IsWhite
    ? lesson3White
    : lesson3Black;

  const lesson3LegalMoves: Square[] = lesson3IsWhite
    ? [
        [6, 3],
        [6, 5],
      ]
    : [
        [4, 5],
        [4, 7],
      ];
  const completionIndex = lesson.pages.length - 1;
  const isLast = pageIndex === completionIndex;
  const requiredMove = false;
  const errorPage = false;
  const lesson3DemoPage = lesson.id === 3 && pageIndex === 2;
  const lesson4Interactive = lesson.id === 4;
  const lesson6Interactive = lesson.id === 6;
  const lesson7Interactive = lesson.id === 7;
  const lesson8Interactive = lesson.id === 8;
  const lesson10Interactive = lesson.id === 10;
  const lesson11Interactive = lesson.id === 11;
  const lesson12Interactive = lesson.id === 12 && pageIndex >= 2;
  const lesson13Interactive = lesson.id === 13;
  const lesson14Interactive = lesson.id === 14;
  const lesson7Exercise = lesson7Exercises[Math.min(pageIndex, lesson7Exercises.length - 1)];
  const lesson10Exercise = lesson10Exercises[Math.min(pageIndex, lesson10Exercises.length - 1)];
  const lesson11Setup = lesson11Setups[Math.min(pageIndex, lesson11Setups.length - 1)];
  const lesson12Setup = lesson12Setups[Math.min(pageIndex, lesson12Setups.length - 1)];
  const lesson13Exercise = lesson13Exercises[Math.min(pageIndex, lesson13Exercises.length - 1)];

  useEffect(() => {
    if (!lesson8Interactive) return;

    setSelected(undefined);
    setLesson8Whites(pageIndex === 0 ? lesson8PageOneWhites : lesson8PageTwoWhites);
    setLesson8Blacks(pageIndex === 0 ? [[0, 9]] : lesson8PageTwoBlacks);
    setLesson8Route(undefined);
    setLesson8Step(0);
    setLesson8Result("ready");
    setLesson8Animating(false);
    setLesson8Trail(undefined);
  }, [lesson8Interactive, pageIndex]);

  useEffect(() => {
    if (!lesson10Interactive) return;

    setSelected(undefined);
    setLesson10White(lesson10Exercise.start);
    setLesson10Blacks(lesson10Exercise.blacks);
    setLesson10Step(0);
    setLesson10RouteCandidates(lesson10Exercise.routes.map((_, index) => index));
    setLesson10FoundRoutes([]);
    setLesson10Result("ready");
    setLesson10Animating(false);
    setLesson10Trail(undefined);
  }, [lesson10Interactive, lesson10Exercise, pageIndex]);

  useEffect(() => {
    if (!lesson11Interactive) return;

    setSelected(undefined);
    setLesson11Whites(lesson11Setup.whites);
    setLesson11Blacks(lesson11Setup.blacks);
    setLesson11Result("ready");
    setLesson11Animating(false);
    setLesson11Trail(undefined);
  }, [lesson11Interactive, lesson11Setup, pageIndex]);

  useEffect(() => {
    if (lesson.id !== 12) return;

    setSelected(undefined);

    if (pageIndex === 1) {
      // Lesson 12 page two is the animated continuation of page one: keep the
      // exact two-jump route from the design instead of loading its final board.
      setLesson12Whites(lesson12Setups[0].whites);
      setLesson12Blacks(lesson12Setups[0].blacks);
      setLesson12Step(0);
      setLesson12Result("sequence");
      setLesson12Animating(true);
      setLesson12Trail(undefined);

      const timers = [
        window.setTimeout(() => {
          setLesson12Whites((pieces) => pieces.map((piece) => piece.id === "w4" ? { ...piece, at: [4, 7] as Square } : piece));
          setLesson12Trail([[6, 9], [4, 7]]);
        }, 180),
        window.setTimeout(() => {
          setLesson12Blacks((pieces) => pieces.filter((piece) => piece.id !== "b0"));
        }, 680),
        window.setTimeout(() => {
          setLesson12Whites((pieces) => pieces.map((piece) => piece.id === "w4" ? { ...piece, at: [2, 9] as Square } : piece));
          setLesson12Trail([[6, 9], [4, 7], [2, 9]]);
        }, 1250),
        window.setTimeout(() => {
          setLesson12Blacks((pieces) => pieces.filter((piece) => piece.id !== "b4"));
        }, 1750),
        window.setTimeout(() => {
          setLesson12Result("ready");
          setLesson12Animating(false);
        }, 2300),
      ];

      return () => timers.forEach((timer) => window.clearTimeout(timer));
    }

    setLesson12Whites(lesson12Setup.whites);
    setLesson12Blacks(lesson12Setup.blacks);
    setLesson12Step(0);
    setLesson12Result("ready");
    setLesson12Animating(false);
    setLesson12Trail(lesson12Setup.initialTrail);
  }, [lesson.id, lesson12Setup, pageIndex]);

  useEffect(() => {
    if (!lesson13Interactive) return;

    setSelected(undefined);
    setLesson13Whites(lesson13Exercise.whites);
    setLesson13Blacks(lesson13Exercise.blacks);
    setLesson13Step(0);
    setLesson13Trail(undefined);

    if (pageIndex === 0) {
      setLesson13Result("intro");
      setLesson13Animating(false);
      return;
    }

    setLesson13Result("demo");
    setLesson13Animating(true);

    const moveTimer = window.setTimeout(() => {
      const { color, id, from, to } = lesson13Exercise.systemMove;
      const update = (pieces: Lesson13Piece[]) => pieces.map((piece) => piece.id === id ? { ...piece, at: to } : piece);
      if (color === "white") setLesson13Whites(update);
      else setLesson13Blacks(update);
      setLesson13Trail([from, to]);
    }, 180);
    const readyTimer = window.setTimeout(() => {
      setLesson13Result("ready");
      setLesson13Animating(false);
    }, 1250);

    return () => {
      window.clearTimeout(moveTimer);
      window.clearTimeout(readyTimer);
    };
  }, [lesson13Interactive, lesson13Exercise, pageIndex]);

  useEffect(() => {
    if (!lesson14Interactive) return;

    setSelected(undefined);
    setLesson14LatestMove(undefined);

    if (pageIndex === 0) {
      setLesson14White([6, 5]);
      setLesson14Black([4, 5]);
      setLesson14Result("demo");
      setLesson14Animating(true);

      const moveTimer = window.setTimeout(() => {
        setLesson14LatestMove({ from: [4, 5], to: [5, 4] });
        setLesson14Black([5, 4]);
      }, 180);
      const readyTimer = window.setTimeout(() => {
        setLesson14Result("ready");
        setLesson14Animating(false);
      }, 1250);

      return () => {
        window.clearTimeout(moveTimer);
        window.clearTimeout(readyTimer);
      };
    }

    setLesson14White([8, 5]);
    setLesson14Black([8, 9]);
    setLesson14Result("ready");
    setLesson14Animating(false);
  }, [lesson14Interactive, pageIndex]);

  useEffect(() => {
    if (!lesson4Interactive) return;

    setLesson4White([7, 2]);
    setLesson4Black([5, 4]);
    setLesson4Result("demo");
    setLesson4Animating(true);
    setLesson4LatestMove(undefined);

    const moveTimer = window.setTimeout(() => {
      setLesson4LatestMove({ from: [5, 4], to: [6, 3] });
      setLesson4Black([6, 3]);
    }, 180);
    const readyTimer = window.setTimeout(() => {
      setLesson4Result("ready");
      setLesson4Animating(false);
    }, 1250);

    return () => {
      window.clearTimeout(moveTimer);
      window.clearTimeout(readyTimer);
    };
  }, [lesson4Interactive]);

  useEffect(() => {
    if (!lesson6Interactive) return;

    setLesson6White([5, 4]);
    setLesson6Black([5, 6]);
    setLesson6Result("demo");
    setLesson6Animating(true);
    setLesson6LatestMove(undefined);

    const moveTimer = window.setTimeout(() => {
      setLesson6LatestMove({ from: [5, 6], to: [6, 5] });
      setLesson6Black([6, 5]);
    }, 180);
    const readyTimer = window.setTimeout(() => {
      setLesson6Result("ready");
      setLesson6Animating(false);
    }, 1250);

    return () => {
      window.clearTimeout(moveTimer);
      window.clearTimeout(readyTimer);
    };
  }, [lesson6Interactive]);

  useEffect(() => {
    if (!lesson7Interactive) return;

    setSelected(undefined);
    setLesson7White(lesson7Exercise.start);
    setLesson7Blacks(lesson7Exercise.blacks);
    setLesson7Step(0);
    setLesson7Trail(undefined);
    setLesson7Result("ready");
    setLesson7Animating(false);
  }, [lesson7Exercise, lesson7Interactive]);

  useEffect(() => {
    if (!lesson3DemoPage) return;

    let cancelled = false;
    const timers: number[] = [];

    const schedule = (callback: () => void, delay: number) => {
      const timer = window.setTimeout(() => {
        if (!cancelled) callback();
      }, delay);

      timers.push(timer);
    };

    function playCycle() {
      if (cancelled) return;

      // Reset both pieces to their starting positions.
      setLesson3White([7, 4]);
      setLesson3Black([3, 6]);

      // WHITE: forward-left
      schedule(() => {
        setLesson3White([6, 3]);
      }, 100);

      // White back to start
      schedule(() => {
        setLesson3White([7, 4]);
      }, 850);

      // WHITE: forward-right
      schedule(() => {
        setLesson3White([6, 5]);
      }, 1600);

      // White back to start
      schedule(() => {
        setLesson3White([7, 4]);
      }, 2350);

      // BLACK: forward-left
      schedule(() => {
        setLesson3Black([4, 5]);
      }, 3100);

      // Black back to start
      schedule(() => {
        setLesson3Black([3, 6]);
      }, 3850);

      // BLACK: forward-right
      schedule(() => {
        setLesson3Black([4, 7]);
      }, 4600);

      // Black back to start
      schedule(() => {
        setLesson3Black([3, 6]);
      }, 5350);

      // Start again with white
      schedule(() => {
        playCycle();
      }, 6200);
    }

    playCycle();

    return () => {
      cancelled = true;
      timers.forEach((timer) => window.clearTimeout(timer));
    };
  }, [lesson3DemoPage]);

  function goTo(next: number) {
    setSelected(undefined);

    if (lesson.id === 3) {
      setLesson3Result("idle");
      setLesson3Animating(false);
    }

    setPageIndex(next);
  }

  function advance() {
    if (isLast) onComplete();
    else goTo(pageIndex + 1);
  }

  function playAutomaticContinuation() {
    if (!requiredMove || sequencePlaying) return;
    setSequencePlaying(true);
    window.setTimeout(() => goTo(pageIndex + 1), 480);
    window.setTimeout(() => {
      goTo(Math.min(completionIndex, pageIndex + 2));
      setSequencePlaying(false);
    }, 1060);
  }

  function chooseSquare(square: Square) {
    if (!requiredMove || sequencePlaying) return;
    if (!selected) {
      setSelected(square);
      return;
    }
    if (selected[0] === square[0] && selected[1] === square[1]) {
      goTo(7);
      return;
    }
    playAutomaticContinuation();
  }

  function chooseLesson3Square(square: Square) {
    if (
      !lesson3Interactive ||
      lesson3Animating ||
      lesson3Result === "correct"
    ) {
      return;
    }

    // First click: user must select the active piece.
    if (!selected) {
      if (
        square[0] === lesson3ActivePiece[0] &&
        square[1] === lesson3ActivePiece[1]
      ) {
        setSelected(square);
      }

      return;
    }

    const correctMove = lesson3LegalMoves.some(
      ([row, col]) => row === square[0] && col === square[1]
    );

    setSelected(undefined);

    if (!correctMove) {
      setLesson3Result("wrong");
      return;
    }

    setLesson3Animating(true);

    if (lesson3IsWhite) {
      setLesson3White(square);
    } else {
      setLesson3Black(square);
    }

    window.setTimeout(() => {
      setLesson3Result("correct");
      setLesson3Animating(false);
    }, 650);
  }

  function chooseLesson4Square(square: Square) {
    if (!lesson4Interactive || lesson4Animating || lesson4Result === "correct") return;

    if (!selected) {
      if (square[0] === lesson4White[0] && square[1] === lesson4White[1]) setSelected(square);
      return;
    }

    setSelected(undefined);
    if (square[0] !== 5 || square[1] !== 4) {
      setLesson4Result("wrong");
      return;
    }

    setLesson4Animating(true);
    setLesson4LatestMove({ from: lesson4White, to: [5, 4] });
    setLesson4White([5, 4]);
    window.setTimeout(() => setLesson4Black(null), 500);
    window.setTimeout(() => {
      setLesson4Result("correct");
      setLesson4Animating(false);
    }, 1050);
  }

  function resetLesson4() {
    setSelected(undefined);
    setLesson4White([7, 2]);
    setLesson4Black([5, 4]);
    setLesson4Result("demo");
    setLesson4Animating(true);
    setLesson4LatestMove(undefined);
    window.setTimeout(() => {
      setLesson4LatestMove({ from: [5, 4], to: [6, 3] });
      setLesson4Black([6, 3]);
    }, 180);
    window.setTimeout(() => {
      setLesson4Result("ready");
      setLesson4Animating(false);
    }, 1250);
  }

  function showLesson4Hint() {
    if (lesson4Animating || lesson4Result === "correct") return;
    setSelected(undefined);
    setLesson4Result("hint");
    setLesson4Animating(true);
    setLesson4White([7, 2]);
    setLesson4Black([6, 3]);
    window.setTimeout(() => {
      setLesson4LatestMove({ from: [7, 2], to: [5, 4] });
      setLesson4White([5, 4]);
    }, 180);
    window.setTimeout(() => setLesson4Black(null), 680);
    window.setTimeout(() => {
      setLesson4White([7, 2]);
      setLesson4Black([6, 3]);
    }, 1450);
    window.setTimeout(() => setLesson4Animating(false), 2200);
  }

  function chooseLesson6Square(square: Square) {
    if (!lesson6Interactive || lesson6Animating || lesson6Result === "correct") return;

    if (!selected) {
      if (square[0] === lesson6White[0] && square[1] === lesson6White[1]) setSelected(square);
      return;
    }

    setSelected(undefined);
    if (square[0] !== 7 || square[1] !== 6) {
      setLesson6Result("wrong");
      return;
    }

    setLesson6Animating(true);
    setLesson6LatestMove({ from: lesson6White, to: [7, 6] });
    setLesson6White([7, 6]);
    window.setTimeout(() => setLesson6Black(null), 500);
    window.setTimeout(() => {
      setLesson6Result("correct");
      setLesson6Animating(false);
    }, 1050);
  }

  function resetLesson6() {
    setSelected(undefined);
    setLesson6White([5, 4]);
    setLesson6Black([5, 6]);
    setLesson6Result("demo");
    setLesson6Animating(true);
    setLesson6LatestMove(undefined);
    window.setTimeout(() => {
      setLesson6LatestMove({ from: [5, 6], to: [6, 5] });
      setLesson6Black([6, 5]);
    }, 180);
    window.setTimeout(() => {
      setLesson6Result("ready");
      setLesson6Animating(false);
    }, 1250);
  }

  function showLesson6Hint() {
    if (lesson6Animating || lesson6Result === "correct") return;
    setSelected(undefined);
    setLesson6Result("hint");
    setLesson6Animating(true);
    setLesson6White([5, 4]);
    setLesson6Black([6, 5]);
    window.setTimeout(() => {
      setLesson6LatestMove({ from: [5, 4], to: [7, 6] });
      setLesson6White([7, 6]);
    }, 180);
    window.setTimeout(() => setLesson6Black(null), 680);
    window.setTimeout(() => {
      setLesson6White([5, 4]);
      setLesson6Black([6, 5]);
    }, 1450);
    window.setTimeout(() => setLesson6Animating(false), 2200);
  }

  function chooseLesson7Square(square: Square) {
    if (!lesson7Interactive || lesson7Animating || lesson7Result === "correct") return;

    if (!selected) {
      if (square[0] === lesson7White[0] && square[1] === lesson7White[1]) setSelected(square);
      return;
    }

    if (square[0] === lesson7White[0] && square[1] === lesson7White[1]) return;

    const move = legalLesson7Captures(
      lesson7White,
      lesson7Blacks,
      lesson7Exercise.blockers
    ).find(({ to }) => sameSquare(to, square));

    if (!move) {
      setSelected(undefined);
      setLesson7Result("wrong");
      return;
    }

    const from = lesson7White;
    const firstCapture = lesson7Step === 0;
    setLesson7Result("ready");
    setLesson7Animating(true);
    setLesson7White(move.to);
    setLesson7Trail((trail) => firstCapture ? [from, move.to] : [...(trail ?? [from]), move.to]);

    window.setTimeout(() => {
      setLesson7Blacks((pieces) => pieces.filter(
        ([row, col]) => row !== move.capture[0] || col !== move.capture[1]
      ));
    }, 500);

    window.setTimeout(() => {
      const nextStep = lesson7Step + 1;
      const remainingBlacks = lesson7Blacks.filter(
        (piece) => !sameSquare(piece, move.capture)
      );
      const canContinue = legalLesson7Captures(
        move.to,
        remainingBlacks,
        lesson7Exercise.blockers
      ).length > 0;

      setLesson7Step(nextStep);
      setLesson7Animating(false);

      if (remainingBlacks.length === 0) {
        setSelected(undefined);
        setLesson7Result("correct");
      } else if (canContinue) {
        setSelected(move.to);
      } else {
        setSelected(undefined);
        setLesson7Result("wrong");
      }
    }, 1050);
  }

  function resetLesson7() {
    setSelected(undefined);
    setLesson7White(lesson7Exercise.start);
    setLesson7Blacks(lesson7Exercise.blacks);
    setLesson7Step(0);
    setLesson7Trail(undefined);
    setLesson7Result("ready");
    setLesson7Animating(false);
  }

  function showLesson7Hint() {
    if (lesson7Animating || lesson7Result === "correct") return;

    const captureStart = lesson7Exercise.start;
    setSelected(undefined);
    setLesson7Result("hint");
    setLesson7Animating(true);
    setLesson7White(captureStart);
    setLesson7Blacks(lesson7Exercise.blacks);
    setLesson7Step(0);
    setLesson7Trail([captureStart]);

    lesson7Exercise.moves.forEach((move, index) => {
      const moveAt = 180 + index * 1150;
      window.setTimeout(() => {
        setLesson7White(move.to);
        setLesson7Trail((trail) => [...(trail ?? [captureStart]), move.to]);
      }, moveAt);
      window.setTimeout(() => {
        setLesson7Blacks((pieces) => pieces.filter(
          ([row, col]) => row !== move.capture[0] || col !== move.capture[1]
        ));
      }, moveAt + 500);
    });

    window.setTimeout(() => {
      setLesson7White(captureStart);
      setLesson7Blacks(lesson7Exercise.blacks);
      setLesson7Step(0);
      setLesson7Trail(undefined);
      setLesson7Animating(false);
    }, 180 + lesson7Exercise.moves.length * 1150);
  }

  function moveLesson8White(pieceId: string, to: Square, king = false) {
    setLesson8Whites((pieces) => pieces.map((piece) =>
      piece.id === pieceId ? { ...piece, at: to, king } : piece
    ));
  }

  function removeLesson8Black(capture: Square) {
    setLesson8Blacks((pieces) => pieces.filter((piece) => !sameSquare(piece, capture)));
  }

  function chooseLesson8Square(square: Square) {
    if (
      !lesson8Interactive ||
      lesson8Animating ||
      lesson8Result === "correct" ||
      lesson8Result === "wrong"
    ) return;

    if (!selected) {
      const selectable = pageIndex === 0
        ? lesson8Whites.find((piece) => piece.id === "lesson8-promotion-white" && sameSquare(piece.at, square))
        : lesson8Whites.find((piece) =>
            (piece.id === "lesson8-route-right" || piece.id === "lesson8-route-left") &&
            sameSquare(piece.at, square)
          );

      if (selectable) {
        setSelected(square);
        if (pageIndex === 1) {
          setLesson8Route(selectable.id === "lesson8-route-left" ? "correct" : "wrong");
        }
      }
      return;
    }

    if (pageIndex === 0) {
      const isPromotionSquare = sameSquare(square, [0, 1]) || sameSquare(square, [0, 3]);
      setSelected(undefined);

      if (!isPromotionSquare) {
        setLesson8Result("wrong");
        return;
      }

      setLesson8Animating(true);
      setLesson8Result("ready");
      moveLesson8White("lesson8-promotion-white", square, true);
      setLesson8Trail([square]);
      window.setTimeout(() => {
        setLesson8Animating(false);
        setLesson8Result("correct");
      }, 1050);
      return;
    }

    const route = lesson8Route;
    const routeMoves = route === "correct"
      ? [
          { to: [2, 3] as Square, capture: [3, 2] as Square },
          { to: [0, 1] as Square, capture: [1, 2] as Square },
        ]
      : [
          { to: [0, 7] as Square, capture: [1, 8] as Square },
          { to: [2, 5] as Square, capture: [1, 6] as Square },
        ];
    const move = routeMoves[lesson8Step];

    if (!route || !move || !sameSquare(square, move.to)) {
      setSelected(undefined);
      setLesson8Route(undefined);
      setLesson8Result("wrong");
      return;
    }

    const pieceId = route === "correct" ? "lesson8-route-left" : "lesson8-route-right";
    setLesson8Animating(true);
    setLesson8Result("ready");
    moveLesson8White(pieceId, move.to, route === "correct" && lesson8Step === 1);
    setLesson8Trail((trail) => [...(trail ?? []), move.to]);
    window.setTimeout(() => removeLesson8Black(move.capture), 500);
    window.setTimeout(() => {
      const nextStep = lesson8Step + 1;
      setLesson8Step(nextStep);
      setLesson8Animating(false);

      if (nextStep === routeMoves.length) {
        setSelected(undefined);
        setLesson8Route(undefined);
        setLesson8Result(route);
      } else if (route === "wrong") {
        // The capture must continue, so the back rank is not a legal stopping point yet.
        setSelected(undefined);
        setLesson8Route(undefined);
        setLesson8Result("wrong");
      } else {
        setSelected(move.to);
      }
    }, 1050);
  }

  function resetLesson8() {
    setSelected(undefined);
    setLesson8Whites(pageIndex === 0 ? lesson8PageOneWhites : lesson8PageTwoWhites);
    setLesson8Blacks(pageIndex === 0 ? [[0, 9]] : lesson8PageTwoBlacks);
    setLesson8Route(undefined);
    setLesson8Step(0);
    setLesson8Result("ready");
    setLesson8Animating(false);
    setLesson8Trail(undefined);
  }

  function showLesson8Hint() {
    if (lesson8Animating || lesson8Result === "correct") return;

    resetLesson8();
    setLesson8Result("hint");
    setLesson8Animating(true);

    if (pageIndex === 0) {
      window.setTimeout(() => {
        moveLesson8White("lesson8-promotion-white", [0, 3], true);
        setLesson8Trail([[0, 3]]);
      }, 180);
      window.setTimeout(resetLesson8, 1450);
      return;
    }

    window.setTimeout(() => {
      moveLesson8White("lesson8-route-left", [2, 3]);
      setLesson8Trail([[2, 3]]);
    }, 180);
    window.setTimeout(() => removeLesson8Black([3, 2]), 680);
    window.setTimeout(() => {
      moveLesson8White("lesson8-route-left", [0, 1], true);
      setLesson8Trail([[2, 3], [0, 1]]);
    }, 1330);
    window.setTimeout(() => removeLesson8Black([1, 2]), 1830);
    window.setTimeout(resetLesson8, 2780);
  }

  function chooseLesson10Square(square: Square) {
    if (
      !lesson10Interactive ||
      lesson10Animating ||
      lesson10Result === "correct" ||
      lesson10Result === "wrong"
    ) return;

    if (!selected) {
      if (sameSquare(square, lesson10White)) setSelected(square);
      return;
    }

    if (sameSquare(square, lesson10White)) return;

    const matchingRoutes = lesson10RouteCandidates.filter((routeIndex) => {
      const move = lesson10Exercise.routes[routeIndex][lesson10Step];
      return move && sameSquare(move.to, square);
    });

    if (matchingRoutes.length === 0) {
      setSelected(undefined);
      setLesson10Result("wrong");
      return;
    }

    const move = lesson10Exercise.routes[matchingRoutes[0]][lesson10Step];
    const from = lesson10White;
    setLesson10Result("ready");
    setLesson10Animating(true);
    setLesson10RouteCandidates(matchingRoutes);
    setLesson10White(move.to);
    setLesson10Trail((trail) => [...(trail ?? [from]), move.to]);

    window.setTimeout(() => {
      setLesson10Blacks((pieces) => pieces.filter((piece) => !sameSquare(piece, move.capture)));
    }, 500);

    window.setTimeout(() => {
      const nextStep = lesson10Step + 1;
      const completedRoute = matchingRoutes.find(
        (routeIndex) => lesson10Exercise.routes[routeIndex].length === nextStep
      );

      if (completedRoute !== undefined) {
        setSelected(undefined);
        setLesson10Animating(false);

        if (pageIndex === 3) {
          const foundRoutes = Array.from(new Set([...lesson10FoundRoutes, completedRoute]));
          setLesson10FoundRoutes(foundRoutes);

          if (foundRoutes.length < lesson10Exercise.routes.length) {
            setLesson10White(lesson10Exercise.start);
            setLesson10Blacks(lesson10Exercise.blacks);
            setLesson10Step(0);
            setLesson10Trail(undefined);
            setLesson10RouteCandidates(
              lesson10Exercise.routes
                .map((_, index) => index)
                .filter((index) => !foundRoutes.includes(index))
            );
            setLesson10Result("one-route");
          } else {
            setLesson10Result("correct");
          }
        } else {
          setLesson10Result("correct");
        }
        return;
      }

      setLesson10Step(nextStep);
      setSelected(move.to);
      setLesson10Animating(false);
    }, 1050);
  }

  function resetLesson10() {
    const availableRoutes = lesson10Exercise.routes
      .map((_, index) => index)
      .filter((index) => pageIndex !== 3 || !lesson10FoundRoutes.includes(index));

    setSelected(undefined);
    setLesson10White(lesson10Exercise.start);
    setLesson10Blacks(lesson10Exercise.blacks);
    setLesson10Step(0);
    setLesson10RouteCandidates(availableRoutes);
    setLesson10Result(lesson10FoundRoutes.length > 0 ? "one-route" : "ready");
    setLesson10Animating(false);
    setLesson10Trail(undefined);
  }

  function showLesson10Hint() {
    if (lesson10Animating || lesson10Result === "correct") return;

    const availableRoute = lesson10Exercise.routes.findIndex(
      (_, index) => pageIndex !== 3 || !lesson10FoundRoutes.includes(index)
    );
    const routeIndex = availableRoute < 0 ? 0 : availableRoute;
    const route = lesson10Exercise.routes[routeIndex];
    const hintDuration = 180 + route.length * 1150;

    setSelected(undefined);
    setLesson10White(lesson10Exercise.start);
    setLesson10Blacks(lesson10Exercise.blacks);
    setLesson10Step(0);
    setLesson10RouteCandidates([routeIndex]);
    setLesson10Result("hint");
    setLesson10Animating(true);
    setLesson10Trail([lesson10Exercise.start]);

    route.forEach((move, index) => {
      const moveAt = 180 + index * 1150;
      window.setTimeout(() => {
        setLesson10White(move.to);
        setLesson10Trail((trail) => [...(trail ?? [lesson10Exercise.start]), move.to]);
      }, moveAt);
      window.setTimeout(() => {
        setLesson10Blacks((pieces) => pieces.filter((piece) => !sameSquare(piece, move.capture)));
      }, moveAt + 500);
    });

    window.setTimeout(() => {
      setLesson10White(lesson10Exercise.start);
      setLesson10Blacks(lesson10Exercise.blacks);
      setLesson10Step(0);
      setLesson10RouteCandidates(
        lesson10Exercise.routes
          .map((_, index) => index)
          .filter((index) => pageIndex !== 3 || !lesson10FoundRoutes.includes(index))
      );
      setLesson10Result(lesson10FoundRoutes.length > 0 ? "one-route" : "ready");
      setLesson10Animating(false);
      setLesson10Trail(undefined);
    }, hintDuration);
  }

  function moveLesson11Piece(
    color: "white" | "black",
    pieceId: string,
    to: Square
  ) {
    const update = (pieces: Lesson11Piece[]) =>
      pieces.map((piece) => piece.id === pieceId ? { ...piece, at: to } : piece);

    if (color === "white") setLesson11Whites(update);
    else setLesson11Blacks(update);
  }

  function chooseLesson11Square(square: Square) {
    if (
      !lesson11Interactive ||
      lesson11Animating ||
      lesson11Result === "correct" ||
      lesson11Result === "wrong-legal" ||
      lesson11Result === "wrong-illegal"
    ) return;

    const activePieces = pageIndex === 2 ? lesson11Blacks : lesson11Whites;
    const clickedActivePiece = activePieces.find((piece) => sameSquare(piece.at, square));

    if (!selected) {
      if (clickedActivePiece) setSelected(square);
      return;
    }

    if (clickedActivePiece) {
      setSelected(square);
      return;
    }

    const movingPiece = activePieces.find((piece) => sameSquare(piece.at, selected));
    if (!movingPiece) {
      setSelected(undefined);
      return;
    }

    const correctPieceId = pageIndex === 0 ? "w0" : pageIndex === 1 ? "w0" : "b2";
    const correctTarget: Square = pageIndex === 0 ? [3, 0] : pageIndex === 1 ? [3, 2] : [4, 9];
    const isCorrect = movingPiece.id === correctPieceId && sameSquare(square, correctTarget);

    if (!isCorrect && pageIndex === 2) {
      const legalMoves: Record<string, Square[]> = {
        b0: [[5, 0]],
        b1: [[6, 3]],
        b2: [[4, 7], [4, 9]],
      };
      const isLegal = (legalMoves[movingPiece.id] ?? []).some((to) => sameSquare(to, square));
      setSelected(undefined);

      if (isLegal) {
        moveLesson11Piece("black", movingPiece.id, square);
        setLesson11Trail([movingPiece.at, square]);
        setLesson11Result("wrong-legal");
      } else {
        setLesson11Result("wrong-illegal");
      }
      return;
    }

    setSelected(undefined);

    if (!isCorrect) {
      setLesson11Result("wrong-illegal");
      return;
    }

    setLesson11Animating(true);
    setLesson11Trail([movingPiece.at, square]);
    moveLesson11Piece(pageIndex === 2 ? "black" : "white", movingPiece.id, square);

    if (pageIndex < 2) {
      const capturedId = pageIndex === 0 ? "b0" : "b3";
      window.setTimeout(() => {
        setLesson11Blacks((pieces) => pieces.filter((piece) => piece.id !== capturedId));
      }, 500);
      window.setTimeout(() => {
        setLesson11Result("correct");
        setLesson11Animating(false);
      }, 1050);
      return;
    }

    setLesson11Result("sequence");
    window.setTimeout(() => {
      moveLesson11Piece("white", "w1", [4, 3]);
      setLesson11Trail([[6, 1], [4, 3]]);
    }, 1200);
    window.setTimeout(() => {
      setLesson11Blacks((pieces) => pieces.filter((piece) => piece.id !== "b1"));
    }, 1700);
    window.setTimeout(() => {
      moveLesson11Piece("black", "b2", [6, 7]);
      setLesson11Trail([[4, 9], [6, 7]]);
    }, 2400);
    window.setTimeout(() => {
      setLesson11Whites((pieces) => pieces.filter((piece) => piece.id !== "w3"));
    }, 2900);
    window.setTimeout(() => {
      moveLesson11Piece("black", "b2", [8, 5]);
      setLesson11Trail([[6, 7], [8, 5]]);
    }, 3600);
    window.setTimeout(() => {
      setLesson11Whites((pieces) => pieces.filter((piece) => piece.id !== "w2"));
    }, 4100);
    window.setTimeout(() => {
      setLesson11Result("correct");
      setLesson11Animating(false);
    }, 4700);
  }

  function resetLesson11() {
    setSelected(undefined);
    setLesson11Whites(lesson11Setup.whites);
    setLesson11Blacks(lesson11Setup.blacks);
    setLesson11Result("ready");
    setLesson11Animating(false);
    setLesson11Trail(undefined);
  }

  function showLesson11Hint() {
    if (lesson11Animating || lesson11Result === "correct") return;

    const pieceId = pageIndex < 2 ? "w0" : "b2";
    const from: Square = pageIndex === 0 ? [5, 2] : pageIndex === 1 ? [5, 0] : [3, 8];
    const to: Square = pageIndex === 0 ? [3, 0] : pageIndex === 1 ? [3, 2] : [4, 9];
    const color = pageIndex < 2 ? "white" : "black";

    resetLesson11();
    setLesson11Result("hint");
    setLesson11Animating(true);
    window.setTimeout(() => {
      moveLesson11Piece(color, pieceId, to);
      setLesson11Trail([from, to]);
    }, 180);
    window.setTimeout(resetLesson11, 1500);
  }

  function moveLesson12Piece(
    color: "white" | "black",
    pieceId: string,
    to: Square
  ) {
    const update = (pieces: Lesson12Piece[]) =>
      pieces.map((piece) => piece.id === pieceId ? { ...piece, at: to } : piece);

    if (color === "white") setLesson12Whites(update);
    else setLesson12Blacks(update);
  }

  function chooseLesson12Square(square: Square) {
    if (
      !lesson12Interactive ||
      lesson12Animating ||
      lesson12Result === "correct" ||
      lesson12Result === "wrong-legal" ||
      lesson12Result === "wrong-illegal"
    ) return;

    const clickedWhite = lesson12Whites.find((piece) => sameSquare(piece.at, square));

    if (!selected) {
      if (clickedWhite) setSelected(square);
      return;
    }

    if (clickedWhite && lesson12Step === 0) {
      setSelected(square);
      return;
    }

    const movingPiece = lesson12Whites.find((piece) => sameSquare(piece.at, selected));
    if (!movingPiece) {
      setSelected(undefined);
      return;
    }

    if (pageIndex === 2) {
      const expectedTarget: Square = lesson12Step === 0 ? [4, 5] : [2, 7];
      const isCorrect = movingPiece.id === "w2" && sameSquare(square, expectedTarget);

      if (!isCorrect) {
        setSelected(undefined);
        const isShorterCapture = lesson12Step === 0 && movingPiece.id === "w0" && sameSquare(square, [5, 0]);
        setLesson12Result(isShorterCapture ? "wrong-legal" : "wrong-illegal");
        return;
      }

      const from = movingPiece.at;
      setLesson12Animating(true);
      setLesson12Trail([from, square]);
      moveLesson12Piece("white", "w2", square);
      const capturedId = lesson12Step === 0 ? "b0" : "b3";

      window.setTimeout(() => {
        setLesson12Blacks((pieces) => pieces.filter((piece) => piece.id !== capturedId));
      }, 500);
      window.setTimeout(() => {
        if (lesson12Step === 0) {
          setLesson12Step(1);
          setSelected(square);
          setLesson12Animating(false);
        } else {
          setSelected(undefined);
          setLesson12Result("correct");
          setLesson12Animating(false);
        }
      }, 1050);
      return;
    }

    const correctMove = movingPiece.id === "w3" && sameSquare(square, [6, 7]);
    if (!correctMove) {
      const occupied = [...lesson12Whites, ...lesson12Blacks].some((piece) => sameSquare(piece.at, square));
      const isLegal = !occupied && square[0] === movingPiece.at[0] - 1 && Math.abs(square[1] - movingPiece.at[1]) === 1;
      setSelected(undefined);

      if (isLegal) {
        moveLesson12Piece("white", movingPiece.id, square);
        setLesson12Trail([movingPiece.at, square]);
        setLesson12Result("wrong-legal");
      } else {
        setLesson12Result("wrong-illegal");
      }
      return;
    }

    setSelected(undefined);
    setLesson12Animating(true);
    setLesson12Result("sequence");
    moveLesson12Piece("white", "w3", [6, 7]);
    setLesson12Trail([[7, 6], [6, 7]]);

    window.setTimeout(() => {
      moveLesson12Piece("black", "b0", [4, 3]);
      setLesson12Trail([[2, 1], [4, 3]]);
    }, 1200);
    window.setTimeout(() => {
      setLesson12Whites((pieces) => pieces.filter((piece) => piece.id !== "w2"));
    }, 1700);
    window.setTimeout(() => {
      moveLesson12Piece("black", "b0", [6, 1]);
      setLesson12Trail([[4, 3], [6, 1]]);
    }, 2400);
    window.setTimeout(() => {
      setLesson12Whites((pieces) => pieces.filter((piece) => piece.id !== "w1"));
    }, 2900);
    window.setTimeout(() => {
      moveLesson12Piece("white", "w3", [4, 5]);
      setLesson12Trail([[6, 7], [4, 5]]);
    }, 3600);
    window.setTimeout(() => {
      setLesson12Blacks((pieces) => pieces.filter((piece) => piece.id !== "b3"));
    }, 4100);
    window.setTimeout(() => {
      moveLesson12Piece("white", "w3", [2, 7]);
      setLesson12Trail([[4, 5], [2, 7]]);
    }, 4800);
    window.setTimeout(() => {
      setLesson12Blacks((pieces) => pieces.filter((piece) => piece.id !== "b6"));
    }, 5300);
    window.setTimeout(() => {
      moveLesson12Piece("white", "w3", [4, 9]);
      setLesson12Trail([[2, 7], [4, 9]]);
    }, 6000);
    window.setTimeout(() => {
      setLesson12Blacks((pieces) => pieces.filter((piece) => piece.id !== "b5"));
    }, 6500);
    window.setTimeout(() => {
      setLesson12Result("correct");
      setLesson12Animating(false);
    }, 7200);
  }

  function resetLesson12() {
    setSelected(undefined);
    setLesson12Whites(lesson12Setup.whites);
    setLesson12Blacks(lesson12Setup.blacks);
    setLesson12Step(0);
    setLesson12Result("ready");
    setLesson12Animating(false);
    setLesson12Trail(lesson12Setup.initialTrail);
  }

  function showLesson12Hint() {
    if (!lesson12Interactive || lesson12Animating || lesson12Result === "correct") return;

    resetLesson12();
    setLesson12Result("hint");
    setLesson12Animating(true);

    if (pageIndex === 2) {
      window.setTimeout(() => {
        moveLesson12Piece("white", "w2", [4, 5]);
        setLesson12Trail([[6, 7], [4, 5]]);
      }, 180);
      window.setTimeout(() => {
        setLesson12Blacks((pieces) => pieces.filter((piece) => piece.id !== "b0"));
      }, 680);
      window.setTimeout(() => {
        moveLesson12Piece("white", "w2", [2, 7]);
        setLesson12Trail([[4, 5], [2, 7]]);
      }, 1250);
      window.setTimeout(() => {
        setLesson12Blacks((pieces) => pieces.filter((piece) => piece.id !== "b3"));
      }, 1750);
      window.setTimeout(resetLesson12, 2500);
      return;
    }

    window.setTimeout(() => {
      moveLesson12Piece("white", "w3", [6, 7]);
      setLesson12Trail([[7, 6], [6, 7]]);
    }, 180);
    window.setTimeout(resetLesson12, 1500);
  }

  function moveLesson13Piece(color: "white" | "black", pieceId: string, to: Square) {
    const update = (pieces: Lesson13Piece[]) =>
      pieces.map((piece) => piece.id === pieceId ? { ...piece, at: to } : piece);
    if (color === "white") setLesson13Whites(update);
    else setLesson13Blacks(update);
  }

  function removeLesson13Piece(color: "white" | "black", at: Square) {
    const keep = (piece: Lesson13Piece) => !sameSquare(piece.at, at);
    if (color === "white") setLesson13Whites((pieces) => pieces.filter(keep));
    else setLesson13Blacks((pieces) => pieces.filter(keep));
  }

  function chooseLesson13Square(square: Square) {
    if (!lesson13Interactive || lesson13Animating || lesson13Result === "correct") return;

    const activePieces = lesson13Exercise.activeColor === "white" ? lesson13Whites : lesson13Blacks;
    const activePiece = activePieces.find((piece) => piece.id === lesson13Exercise.activeId);
    if (!activePiece) return;

    if (!selected) {
      if (sameSquare(square, activePiece.at)) setSelected(square);
      return;
    }

    if (sameSquare(square, activePiece.at)) return;

    const expected = lesson13Exercise.route[lesson13Step];
    const crossesPreviouslyCapturedPiece = pageIndex === 0 && lesson13Step === 3 && [
      [5, 6], [6, 7], [7, 8], [8, 9],
    ].some((to) => sameSquare(to as Square, square));

    if (crossesPreviouslyCapturedPiece) {
      setLesson13Result("crossed");
      return;
    }

    if (!expected || !sameSquare(square, expected.to)) {
      setLesson13Result("wrong");
      return;
    }

    const from = activePiece.at;
    const capturedColor = lesson13Exercise.activeColor === "white" ? "black" : "white";
    setLesson13Result("ready");
    setLesson13Animating(true);
    setLesson13Trail([from, square]);
    moveLesson13Piece(lesson13Exercise.activeColor, lesson13Exercise.activeId, square);
    window.setTimeout(() => removeLesson13Piece(capturedColor, expected.capture), 500);

    window.setTimeout(() => {
      const nextStep = lesson13Step + 1;
      if (nextStep < lesson13Exercise.route.length) {
        setLesson13Step(nextStep);
        setSelected(square);
        setLesson13Animating(false);
        return;
      }

      setSelected(undefined);
      if (pageIndex === 0) {
        setLesson13Trail([[2, 9], [7, 4], [4, 1], [2, 3], [4, 5]]);
        setLesson13Result("correct");
        setLesson13Animating(false);
        return;
      }

      setLesson13Result("sequence");
      const continuation: Array<{ to: Square; capture: Square; captureId?: string }> = [
        { to: [4, 5], capture: [5, 4], captureId: "bk" },
        { to: [2, 7], capture: [3, 6], captureId: "b2" },
        { to: [0, 9], capture: [1, 8], captureId: "b0" },
      ];
      continuation.forEach((move, index) => {
        const moveAt = 250 + index * 1150;
        window.setTimeout(() => {
          moveLesson13Piece("white", "w3", move.to);
          setLesson13Trail(index === 0 ? [[6, 3], move.to] : [continuation[index - 1].to, move.to]);
        }, moveAt);
        window.setTimeout(() => {
          setLesson13Blacks((pieces) => pieces.filter((piece) => piece.id !== move.captureId));
        }, moveAt + 500);
      });
      window.setTimeout(() => {
        setLesson13Whites((pieces) => pieces.map((piece) => piece.id === "w3" ? { ...piece, king: true } : piece));
        setLesson13Result("correct");
        setLesson13Animating(false);
      }, 3900);
    }, 1050);
  }

  function startLesson13Demo() {
    if (!lesson13Interactive || pageIndex !== 0 || lesson13Result !== "intro") return;

    setLesson13Result("demo");
    setLesson13Animating(true);
    window.setTimeout(() => {
      moveLesson13Piece(
        lesson13Exercise.systemMove.color,
        lesson13Exercise.systemMove.id,
        lesson13Exercise.systemMove.to
      );
      setLesson13Trail([lesson13Exercise.systemMove.from, lesson13Exercise.systemMove.to]);
    }, 180);
    window.setTimeout(() => {
      setLesson13Result("ready");
      setLesson13Animating(false);
    }, 1250);
  }

  function resetLesson13() {
    setSelected(undefined);
    setLesson13Whites(lesson13Exercise.whites);
    setLesson13Blacks(lesson13Exercise.blacks);
    setLesson13Step(0);
    setLesson13Trail(undefined);

    if (pageIndex === 0) {
      setLesson13Result("intro");
      setLesson13Animating(false);
      return;
    }

    setLesson13Result("demo");
    setLesson13Animating(true);
    window.setTimeout(() => {
      moveLesson13Piece(
        lesson13Exercise.systemMove.color,
        lesson13Exercise.systemMove.id,
        lesson13Exercise.systemMove.to
      );
      setLesson13Trail([lesson13Exercise.systemMove.from, lesson13Exercise.systemMove.to]);
    }, 180);
    window.setTimeout(() => {
      setLesson13Result("ready");
      setLesson13Animating(false);
    }, 1250);
  }

  function showLesson13Hint() {
    if (!lesson13Interactive || lesson13Animating || lesson13Result === "correct") return;

    const { systemMove, route, activeColor, activeId } = lesson13Exercise;
    const afterSystem = (pieces: Lesson13Piece[]) =>
      pieces.map((piece) => piece.id === systemMove.id ? { ...piece, at: systemMove.to } : piece);
    setSelected(undefined);
    setLesson13Whites(systemMove.color === "white" ? afterSystem(lesson13Exercise.whites) : lesson13Exercise.whites);
    setLesson13Blacks(systemMove.color === "black" ? afterSystem(lesson13Exercise.blacks) : lesson13Exercise.blacks);
    setLesson13Step(0);
    setLesson13Result("hint");
    setLesson13Animating(true);
    setLesson13Trail(undefined);

    route.forEach((move, index) => {
      const moveAt = 180 + index * 1050;
      window.setTimeout(() => {
        moveLesson13Piece(activeColor, activeId, move.to);
        setLesson13Trail(index === 0 ? [activeColor === "white" ? [2, 9] : [0, 7], move.to] : [route[index - 1].to, move.to]);
      }, moveAt);
      window.setTimeout(() => removeLesson13Piece(activeColor === "white" ? "black" : "white", move.capture), moveAt + 450);
    });
    window.setTimeout(resetLesson13, 650 + route.length * 1050);
  }

  function chooseLesson14Square(square: Square) {
    if (!lesson14Interactive || lesson14Animating || lesson14Result === "correct") return;

    if (!selected) {
      if (sameSquare(square, lesson14White)) setSelected(square);
      return;
    }

    const correctTarget: Square = pageIndex === 0 ? [4, 3] : [7, 4];
    const otherForwardTarget: Square = [7, 6];
    const isCorrectTarget = sameSquare(square, correctTarget);
    const isLegalPageTwoMove = pageIndex === 1 && sameSquare(square, otherForwardTarget);
    setSelected(undefined);

    if (!isCorrectTarget && !isLegalPageTwoMove) {
      setLesson14Result("wrong");
      return;
    }

    const from = lesson14White;
    setLesson14Result("ready");
    setLesson14Animating(true);
    setLesson14LatestMove({ from, to: square });
    setLesson14White(square);

    if (pageIndex === 0) {
      window.setTimeout(() => setLesson14Black(null), 500);
    }

    window.setTimeout(() => {
      setLesson14Result(isCorrectTarget ? "correct" : "wrong");
      setLesson14Animating(false);
    }, 1050);
  }

  function resetLesson14() {
    setSelected(undefined);
    setLesson14LatestMove(undefined);

    if (pageIndex === 0) {
      setLesson14White([6, 5]);
      setLesson14Black([4, 5]);
      setLesson14Result("demo");
      setLesson14Animating(true);
      window.setTimeout(() => {
        setLesson14LatestMove({ from: [4, 5], to: [5, 4] });
        setLesson14Black([5, 4]);
      }, 180);
      window.setTimeout(() => {
        setLesson14Result("ready");
        setLesson14Animating(false);
      }, 1250);
      return;
    }

    setLesson14White([8, 5]);
    setLesson14Black([8, 9]);
    setLesson14Result("ready");
    setLesson14Animating(false);
  }

  function showLesson14Hint() {
    if (lesson14Animating || lesson14Result === "correct") return;

    setSelected(undefined);
    setLesson14Result("hint");
    setLesson14Animating(true);

    if (pageIndex === 0) {
      setLesson14White([6, 5]);
      setLesson14Black([5, 4]);
      setLesson14LatestMove(undefined);
      window.setTimeout(() => {
        setLesson14LatestMove({ from: [6, 5], to: [4, 3] });
        setLesson14White([4, 3]);
      }, 180);
      window.setTimeout(() => setLesson14Black(null), 680);
      window.setTimeout(resetLesson14, 1600);
      return;
    }

    setLesson14White([8, 5]);
    setLesson14Black([8, 9]);
    setLesson14LatestMove(undefined);
    window.setTimeout(() => {
      setLesson14LatestMove({ from: [8, 5], to: [7, 4] });
      setLesson14White([7, 4]);
    }, 180);
    window.setTimeout(resetLesson14, 1450);
  }

  const primaryLabel = errorPage
    ? language === "zh"
      ? "重做一次"
      : "Try again"
    : requiredMove
    ? language === "zh"
      ? "请在棋盘上走第一步"
      : "Make the first move on the board"
    : (lesson.id === 1 || lesson.id === 2 || lesson.id === 3 || lesson.id === 4 || lesson.id === 5 || lesson.id === 6 || lesson.id === 7 || lesson.id === 8 || lesson.id === 9 || lesson.id === 10 || lesson.id === 11 || lesson.id === 12 || lesson.id === 13 || lesson.id === 14) && isLast
    ? language === "zh"
      ? "我学会了，下一节内容"
      : "I learned it—next lesson"
    : isLast
    ? language === "zh"
      ? "我学会了"
      : "I learned it"
    : language === "zh"
    ? "继续"
    : "Continue";

  const lesson3Message: Copy =
    lesson3Result === "correct"
      ? {
          zh: "你做对了，真棒！",
          en: "Great job! That's the correct move.",
        }
      : lesson3Result === "wrong"
      ? {
          zh: "这一步不对，再试一次吧。你可以点击“获得提示”查看棋子的正确走法。",
          en: "That's not the correct move. Try again, or click “Get hint” to review how the piece moves.",
        }
      : lesson3Result === "hint"
      ? {
          zh: "提示：普通棋子只能向前斜走到下一行的空格。试着将棋子向左前方或右前方移动一格。",
          en: "Hint: A man moves diagonally forward to an empty square on the next row. Try moving the piece one square forward-left or forward-right.",
        }
      : lesson.pages[pageIndex].copy;

  const lesson4Message: Copy = lesson4Result === "correct"
    ? { zh: "你成功完成了一次兵的跳吃！", en: "You successfully completed a capture with a man!" }
    : lesson4Result === "wrong"
    ? { zh: "这一步不能吃掉黑棋，再试一次吧。", en: "That move does not capture the black piece. Try again." }
    : lesson4Result === "hint"
    ? { zh: "提示：选择白棋，再点击黑棋后方的空格。", en: "Hint: select the white piece, then click the empty square behind Black." }
    : lesson.pages[pageIndex].copy;

  const lesson6Message: Copy = lesson6Result === "correct"
    ? { zh: "你帮小万吃掉了黑棋！注意！在吃子时，可以向后回吃！", en: "You helped White capture the black piece! Remember: a man may capture backward." }
    : lesson6Result === "wrong"
    ? { zh: "这一步不能吃掉黑棋，再试一次吧。你可以点击“获得提示”查看正确走法。", en: "That move does not capture the black piece. Try again, or click “Get hint” to see the correct move." }
    : lesson6Result === "hint"
    ? { zh: "提示：选择白棋，再点击黑棋后方的空格。兵在吃子时可以向后跳。", en: "Hint: select the white piece, then click the empty square behind Black. A man may jump backward when capturing." }
    : lesson.pages[pageIndex].copy;

  const lesson7Message: Copy = lesson7Result === "correct"
    ? lesson7SuccessMessages[pageIndex]
    : lesson7Result === "wrong"
    ? {
        zh: "这一步不能继续完成连吃，再试一次吧。你可以点击“获得提示”查看正确路线。",
        en: "That move cannot continue the multiple capture. Try again, or click “Get hint” to see the correct route.",
      }
    : lesson7Result === "hint"
    ? {
        zh: "提示：一次吃子后，如果同一枚棋子还能继续吃，就要沿着路线继续跳吃。",
        en: "Hint: after a capture, if the same piece can capture again, continue jumping along the route.",
      }
    : lesson.pages[pageIndex].copy;

  const lesson8Message: Copy = lesson8Result === "correct"
    ? pageIndex === 0
      ? { zh: "白兵到达底线，成功升变为王棋！", en: "The white man reached the back rank and was crowned as a king!" }
      : { zh: "非常棒！你成功帮助小万的兵升变为王！接下来学习一下王棋的走法吧！", en: "Excellent! You helped White's man become a king. Next, learn how kings move!" }
    : lesson8Result === "wrong"
    ? pageIndex === 0
      ? { zh: "这一步没有停留在对方底线，再试一次吧。", en: "That move did not finish on the opposite back rank. Try again." }
      : {
          zh: "你必须吃掉所有能吃的棋子，所以这里还不是终点。仅仅经过对方底线但没有停留的不能成为王棋！再来试试！",
          en: "You must capture every available piece, so this is not the finishing position. A man that only passes over the opposite back rank without stopping there cannot become a king. Try again!",
        }
    : lesson8Result === "hint"
    ? pageIndex === 0
      ? { zh: "提示：白兵可以向左上方或右上方走到底线。", en: "Hint: the white man may move upward-left or upward-right onto the back rank." }
      : { zh: "提示：选择左侧白兵，连续吃掉两枚黑棋并停在底线。", en: "Hint: choose the white man on the left, capture twice, and finish on the back rank." }
    : lesson.pages[pageIndex].copy;

  const lesson10Message: Copy = lesson10Result === "correct"
    ? pageIndex === 0
      ? {
          zh: "非常棒！只要路线没有阻挡，王棋跳过对方棋子后，可以停在同一条斜线上、被吃棋子后方的任意空格。本题共有三个合法落点。",
          en: "Excellent! When the route is clear, after jumping over the opposing piece, a king may land on any empty square beyond it along the same diagonal. This exercise has three valid landing squares.",
        }
      : pageIndex === 1
      ? {
          zh: "干净果断的连吃！非常精彩！小德拉夫和小万又给你出了一道练习，试试吧！",
          en: "A clean, decisive multiple capture! Draff and Wan have another exercise for you—give it a try!",
        }
      : pageIndex === 2
      ? {
          zh: "好久没有见过这么聪明的棋手了，再来一道思考题！",
          en: "What a clever player! Try one more challenge.",
        }
      : {
          zh: "真厉害！你找出了两条不同的完整路线。小万和小德拉夫好崇拜你！继续学习成为国际跳棋高手吧！",
          en: "Amazing! You found both complete routes. Wan and Draff are impressed—keep learning to become a draughts master!",
        }
    : lesson10Result === "one-route"
    ? {
        zh: "非常棒！你成功找出了一条路线。棋盘已复原，请再找出另一条不同的完整路线！",
        en: "Excellent! You found one route. The board has reset—now find the other complete route!",
      }
    : lesson10Result === "wrong"
    ? {
        zh: "这一步不能完成本题要求的连续吃子。请重做一次，或点击“获得提示”查看正确路线。",
        en: "That move cannot complete the required capture sequence. Reset and try again, or use the hint to see a valid route.",
      }
    : lesson10Result === "hint"
    ? pageIndex === 0
      ? {
          zh: "提示：王棋跳过黑棋后，可以停在它后方三个没有阻挡的空格中的任意一个。",
          en: "Hint: after jumping over Black, the king may stop on any of the three clear squares beyond it.",
        }
      : pageIndex === 3
      ? {
          zh: "提示：跟随演示完成一条路线；本题还需要你找出另一条不同的完整连吃路线。",
          en: "Hint: follow the demonstration for one route; this exercise also asks you to find the other complete capture route.",
        }
      : {
          zh: "提示：每次落下后，继续观察同一枚王棋能够跳过哪一枚黑棋，并选择其后方的空格。",
          en: "Hint: after every landing, look for the next black piece the same king can jump, then choose an empty square beyond it.",
        }
    : lesson.pages[pageIndex].copy;

  const lesson11Message: Copy = lesson11Result === "correct"
    ? pageIndex === 0
      ? {
          zh: "注意！在国际跳棋中，有吃必吃的规则具有强制性。",
          en: "Remember: in international draughts, the compulsory-capture rule must always be followed.",
        }
      : pageIndex === 1
      ? {
          zh: "非常棒！你已经掌握了有吃必吃的规则，接下来尝试应用一下吧！",
          en: "Excellent! You understand compulsory capture. Now try applying it tactically!",
        }
      : {
          zh: "嘻嘻！小万吃掉了一个黑子，而小德拉夫吃掉了他两个白子！这就是利用有吃必吃规则抢速度。",
          en: "Draff wins the exchange: Wan captured one black piece, but Draff captured two white pieces. This is gaining a tempo with compulsory capture.",
        }
    : lesson11Result === "sequence"
    ? {
        zh: "正确！在国际跳棋中，利用对方的“有吃必吃”获得优势，叫作“抢速度”。看看接下来的强制走法吧！",
        en: "Correct! Using the opponent's compulsory capture to gain an advantage is called gaining a tempo. Watch the forced continuation.",
      }
    : lesson11Result === "wrong-legal"
    ? {
        zh: "这步棋符合走子规则，但不是能够利用“有吃必吃”获得优势的理想选择。请重做一次，或点击“获得提示”查看最佳走法。",
        en: "This is a legal move, but it is not the best move for using compulsory capture to gain an advantage. Reset and try again, or use the hint.",
      }
    : lesson11Result === "wrong-illegal"
    ? pageIndex === 2
      ? {
          zh: "这步棋不符合当前局面的走子规则。黑兵只能向前斜走到相邻空格，也不能落在已有棋子的格子上。请再试一次。",
          en: "That move is not legal in this position. A black man moves one square diagonally forward and cannot land on an occupied square. Try again.",
        }
      : {
          zh: "这一步不符合“有吃必吃”规则。当前白棋有子可吃，必须完成吃子，不能移动其他棋子。",
          en: "That move breaks the compulsory-capture rule. White has an available capture and must take it instead of moving another piece.",
        }
    : lesson11Result === "hint"
    ? pageIndex === 0
      ? {
          zh: "提示：选择左侧能够吃子的白棋，跳过相邻黑棋并落在它后面的空格。",
          en: "Hint: select the white piece on the left, jump over the adjacent black piece, and land on the empty square beyond it.",
        }
      : pageIndex === 1
      ? {
          zh: "提示：选择最左侧的白棋，向右前方跳过黑棋完成吃子。",
          en: "Hint: select the leftmost white piece and jump forward-right over Black to capture it.",
        }
      : {
          zh: "提示：移动右上方的黑棋到右下方相邻空格，这一步会迫使白方按照有吃必吃规则行动。",
          en: "Hint: move the upper-right black piece one square down-right. This forces White to act under the compulsory-capture rule.",
        }
    : lesson.pages[pageIndex].copy;

  const lesson12Message: Copy = lesson12Result === "correct"
    ? pageIndex === 2
      ? {
          zh: "非常棒！你选择了能够吃掉两枚黑棋的路线，正确遵守了“有多吃多”规则。",
          en: "Excellent! You chose the route that captures two black pieces and correctly followed the maximum-capture rule.",
        }
      : {
          zh: "太棒了！小德拉夫被迫吃掉两枚白棋后，小万抓住机会连续吃掉了三枚黑棋，成功利用“有多吃多”获得优势！",
          en: "Excellent! After Draff was forced to capture two white pieces, Wan seized the chance to capture three black pieces and gained an advantage through maximum capture.",
        }
    : lesson12Result === "sequence"
    ? {
        zh: "正确！这一步迫使小德拉夫按照“有多吃多”连续吃掉两枚白棋。继续观察小万接下来的反击！",
        en: "Correct! This move forces Draff to capture two white pieces under the maximum-capture rule. Watch Wan's counterattack.",
      }
    : lesson12Result === "wrong-legal"
    ? pageIndex === 2
      ? {
          zh: "这条路线可以吃子，但只能吃掉一枚黑棋。根据“有多吃多”规则，你必须选择能够吃掉两枚棋子的路线。请重做一次，或查看提示。",
          en: "This route can capture, but it takes only one black piece. Under maximum capture, you must choose the route that captures two. Reset and try again, or view the hint.",
        }
      : {
          zh: "这步棋符合走子规则，但不是能够利用“有多吃多”获得优势的理想选择。请重做一次，或点击“获得提示”查看最佳走法。",
          en: "This is a legal move, but it is not the best move for using maximum capture to gain an advantage. Reset and try again, or use the hint.",
        }
    : lesson12Result === "wrong-illegal"
    ? pageIndex === 2
      ? {
          zh: "这一步不符合“有多吃多”规则。当前必须使用同一枚白棋沿着能够吃子最多的路线连续吃子。",
          en: "That move breaks the maximum-capture rule. The same white piece must continue along the route that captures the most pieces.",
        }
      : {
          zh: "这步棋不符合当前局面的走子规则。白兵只能向前斜走到相邻的空格，也不能落在已有棋子的格子上。请再试一次。",
          en: "That move is not legal in this position. A white man moves one square diagonally forward and cannot land on an occupied square. Try again.",
        }
    : lesson12Result === "hint"
    ? pageIndex === 2
      ? {
          zh: "提示：选择右侧的白棋，沿斜线连续跳吃两枚黑棋。",
          en: "Hint: select the white piece on the right and make two consecutive diagonal captures.",
        }
      : {
          zh: "提示：将右下方的白棋向右前方移动一格，这会迫使黑方选择吃子数量最多的路线。",
          en: "Hint: move the lower-right white piece one square forward-right. This forces Black to choose the route with the most captures.",
        }
    : lesson.pages[pageIndex].copy;

  const lesson13Message: Copy = lesson13Result === "ready"
    ? pageIndex === 0
      ? {
          zh: "来举个例子，此时小德拉夫走出这一步棋，小万的王棋依据吃子规则吃子。请移动白王，逐步完成连吃。",
          en: "For example, Draff has made this move. Move Wan's white king step by step to complete the capture sequence.",
        }
      : {
          zh: "小万现在走出了这步棋，你来帮小德拉夫挪动黑王完成吃子吧！",
          en: "Wan has made this move. Help Draff move the black king and complete the capture sequence!",
        }
    : lesson13Result === "wrong"
    ? {
        zh: "这一步不符合当前连吃路线。王棋必须沿斜线越过一枚对方棋子，并落在其后的空格；连吃尚未结束时还必须继续使用同一枚王棋。请再试一次。",
        en: "That move is not legal in this capture sequence. The king must cross one opposing piece diagonally and land beyond it, and the same king must continue while another capture remains. Try again.",
      }
    : lesson13Result === "crossed"
    ? {
        zh: "这个落点会再次越过本回合已经吃过的黑棋。根据“土耳其规则”，已经跳过的棋子不能再次跳过。请落在前面的唯一合法格子。",
        en: "That landing would cross a black piece already jumped during this turn. Under the Turkish rule, it cannot be crossed again. Choose the only legal landing square before it.",
      }
    : lesson13Result === "hint"
    ? {
        zh: "提示正在演示正确的连续吃子路线，请留意每次越过的棋子和王棋的落点。",
        en: "The hint is demonstrating the correct capture route. Watch each crossed piece and the king's landing squares.",
      }
    : lesson13Result === "sequence"
    ? {
        zh: "正确！你已经掌握了“土耳其规则”，学习能力真强！现在看看小万如何利用这个局面完成反击。",
        en: "Correct—you have mastered the Turkish rule! Now watch how Wan uses the resulting position to counterattack.",
      }
    : lesson13Result === "correct"
    ? pageIndex === 0
      ? {
          zh: "只能停留在唯一的格子，不能停留到更远的格子，因为那样会再次越过已经跳过的棋子！",
          en: "The king can stop only on the unique legal square. It cannot land farther away because that would cross a piece already jumped.",
        }
      : {
          zh: "刚刚是小万利用土耳其规则发起的战术，使得白棋成功升变！",
          en: "Wan used the Turkish rule tactically, allowing the white man to capture and promote successfully!",
        }
    : lesson.pages[pageIndex].copy;

  const lesson14Message: Copy = lesson14Result === "correct"
    ? pageIndex === 0
      ? {
          zh: "此时小万将小德拉夫的棋子全部吃光了，小万便取得了胜利。",
          en: "White has captured all of Draff's pieces and wins the game.",
        }
      : {
          zh: "小万走出这步棋后，小德拉夫的兵前面由于被堵住无法前进，此时白方获胜。",
          en: "After White makes this move, Draff's man is blocked and cannot advance, so White wins.",
        }
    : lesson14Result === "wrong"
    ? pageIndex === 0
      ? {
          zh: "这一步不能吃掉黑棋。再试一次，或点击“获得提示”查看正确走法。",
          en: "That move does not capture the black piece. Try again, or use the hint to see the correct move.",
        }
      : {
          zh: "白棋可以向这个方向前进，但这一步之后黑棋仍然有路可走。请重做一次，再试试另一个前进方向。",
          en: "White can move in that direction, but Black still has a legal move afterward. Reset the exercise and try the other forward direction.",
        }
    : lesson14Result === "hint"
    ? pageIndex === 0
      ? {
          zh: "提示：选择白棋，跳过黑棋并落在它后面的空格。",
          en: "Hint: select the white piece, jump over Black, and land on the empty square behind it.",
        }
      : {
          zh: "提示：你执位于棋盘下方的白棋，前进方向是向上。将中间的白棋向左前方移动一格，使黑棋无路可走。",
          en: "Hint: you play White from the lower side, so forward is upward. Move the central white piece one square forward-left to leave Black with no legal move.",
        }
    : lesson.pages[pageIndex].copy;

    return <LessonFrame
    language={language}
    lessonNumber={lesson.id}
    title={lesson.title}
    page={pageIndex}
    pageCount={lesson.pages.length}
    message={lesson3Interactive ? lesson3Message : lesson4Interactive ? lesson4Message : lesson6Interactive ? lesson6Message : lesson7Interactive ? lesson7Message : lesson8Interactive ? lesson8Message : lesson10Interactive ? lesson10Message : lesson11Interactive ? lesson11Message : lesson12Interactive ? lesson12Message : lesson13Interactive ? lesson13Message : lesson14Interactive ? lesson14Message : lesson.pages[pageIndex].copy}
    board={
      <LearningBoard
        lesson={lesson.id}
        page={pageIndex}
        selected={selected}
        lesson3White={lesson.id === 3 ? lesson3White : undefined}
        lesson3Black={lesson.id === 3 ? lesson3Black : undefined}
        lesson4White={lesson.id === 4 ? lesson4White : undefined}
        lesson4Black={lesson.id === 4 ? lesson4Black : undefined}
        lesson6White={lesson.id === 6 ? lesson6White : undefined}
        lesson6Black={lesson.id === 6 ? lesson6Black : undefined}
        lesson7White={lesson.id === 7 ? lesson7White : undefined}
        lesson7Blacks={lesson.id === 7 ? lesson7Blacks : undefined}
        lesson7Blockers={lesson.id === 7 ? lesson7Exercise.blockers : undefined}
        lesson8Whites={lesson.id === 8 ? lesson8Whites : undefined}
        lesson8Blacks={lesson.id === 8 ? lesson8Blacks : undefined}
        lesson10White={lesson.id === 10 ? lesson10White : undefined}
        lesson10Blacks={lesson.id === 10 ? lesson10Blacks : undefined}
        lesson11Whites={lesson.id === 11 ? lesson11Whites : undefined}
        lesson11Blacks={lesson.id === 11 ? lesson11Blacks : undefined}
        lesson12Whites={lesson.id === 12 ? lesson12Whites : undefined}
        lesson12Blacks={lesson.id === 12 ? lesson12Blacks : undefined}
        lesson13Whites={lesson.id === 13 ? lesson13Whites : undefined}
        lesson13Blacks={lesson.id === 13 ? lesson13Blacks : undefined}
        lesson13Ghosts={lesson.id === 13 && pageIndex === 0 && lesson13Result === "correct" ? [[5, 6], [6, 3]] : undefined}
        forbiddenSquares={lesson.id === 13 && pageIndex === 0 && lesson13Result === "correct" ? [[6, 7], [7, 2], [7, 8], [8, 1], [8, 9], [9, 0]] : undefined}
        lesson14White={lesson.id === 14 ? lesson14White : undefined}
        lesson14Black={lesson.id === 14 ? lesson14Black : undefined}
        lesson14WhiteBlockers={lesson.id === 14 && pageIndex === 1 ? [[9, 8]] : undefined}
        latestMove={lesson.id === 4 ? lesson4LatestMove : lesson.id === 6 ? lesson6LatestMove : lesson.id === 14 ? lesson14LatestMove : undefined}
        moveTrail={lesson.id === 7 ? lesson7Trail : lesson.id === 8 ? lesson8Trail : lesson.id === 10 ? lesson10Trail : lesson.id === 11 ? lesson11Trail : lesson.id === 12 ? lesson12Trail : lesson.id === 13 ? lesson13Trail : undefined}
        onSquareClick={
          lesson3Interactive
            ? chooseLesson3Square
            : lesson4Interactive
            ? chooseLesson4Square
            : lesson6Interactive
            ? chooseLesson6Square
            : lesson7Interactive
            ? chooseLesson7Square
            : lesson8Interactive
            ? chooseLesson8Square
            : lesson10Interactive
            ? chooseLesson10Square
            : lesson11Interactive
            ? chooseLesson11Square
            : lesson12Interactive
            ? chooseLesson12Square
            : lesson13Interactive && lesson13Result !== "intro"
            ? chooseLesson13Square
            : lesson14Interactive
            ? chooseLesson14Square
            : requiredMove
            ? chooseSquare
            : undefined
        }
      />
    }
    primaryLabel={primaryLabel}
    primaryDisabled={
      requiredMove ||
      sequencePlaying ||
      lesson3Animating ||
      lesson4Animating ||
      lesson6Animating ||
      lesson7Animating ||
      lesson8Animating ||
      lesson10Animating ||
      lesson11Animating ||
      lesson12Animating ||
      lesson13Animating ||
      lesson14Animating ||
      (lesson4Interactive && lesson4Result !== "correct") ||
      (lesson6Interactive && lesson6Result !== "correct") ||
      (lesson7Interactive && lesson7Result !== "correct") ||
      (lesson8Interactive && lesson8Result !== "correct") ||
      (lesson10Interactive && lesson10Result !== "correct") ||
      (lesson11Interactive && lesson11Result !== "correct") ||
      (lesson12Interactive && lesson12Result !== "correct") ||
      (lesson13Interactive && lesson13Result !== "correct" && lesson13Result !== "intro") ||
      (lesson14Interactive && lesson14Result !== "correct") ||
      (lesson3Interactive && lesson3Result !== "correct")
    }
    showSecondary={
      lesson3Interactive ||
      lesson4Interactive ||
      lesson6Interactive ||
      lesson7Interactive ||
      lesson8Interactive ||
      lesson10Interactive ||
      lesson11Interactive ||
      lesson12Interactive ||
      (lesson13Interactive && lesson13Result !== "intro") ||
      lesson14Interactive ||
      requiredMove
    }
    onBack={onClose}
    onPrimary={() => {
      if (lesson13Interactive && pageIndex === 0 && lesson13Result === "intro") {
        startLesson13Demo();
        return;
      }
      if (errorPage) goTo(4);
      else advance();
    }}
    onHint={() => {
      if (lesson4Interactive) {
        showLesson4Hint();
        return;
      }

      if (lesson6Interactive) {
        showLesson6Hint();
        return;
      }

      if (lesson7Interactive) {
        showLesson7Hint();
        return;
      }

      if (lesson8Interactive) {
        showLesson8Hint();
        return;
      }

      if (lesson10Interactive) {
        showLesson10Hint();
        return;
      }

      if (lesson11Interactive) {
        showLesson11Hint();
        return;
      }

      if (lesson12Interactive) {
        showLesson12Hint();
        return;
      }

      if (lesson13Interactive) {
        showLesson13Hint();
        return;
      }

      if (lesson14Interactive) {
        showLesson14Hint();
        return;
      }

      if (lesson3Interactive) {
        if (lesson3Animating || lesson3Result === "correct") return;

        setLesson3Result("hint");
        setLesson3Animating(true);
        setSelected(undefined);

        const start = lesson3ActivePiece;
        const firstMove = lesson3LegalMoves[0];
        const secondMove = lesson3LegalMoves[1];

        const setActivePiece = lesson3IsWhite
          ? setLesson3White
          : setLesson3Black;

        setActivePiece(start);

        window.setTimeout(() => {
          setActivePiece(firstMove);
        }, 100);

        window.setTimeout(() => {
          setActivePiece(start);
        }, 850);

        window.setTimeout(() => {
          setActivePiece(secondMove);
        }, 1600);

        window.setTimeout(() => {
          setActivePiece(start);
        }, 2350);

        window.setTimeout(() => {
          setLesson3Animating(false);
        }, 3100);

        return;
      }

      if (requiredMove) {
        playAutomaticContinuation();
        return;
      }

      if (!isLast) {
        goTo(pageIndex + 1);
      }
    }}
    onRetry={() => {
      if (lesson4Interactive) {
        resetLesson4();
        return;
      }

      if (lesson6Interactive) {
        resetLesson6();
        return;
      }

      if (lesson7Interactive) {
        resetLesson7();
        return;
      }

      if (lesson8Interactive) {
        resetLesson8();
        return;
      }

      if (lesson10Interactive) {
        resetLesson10();
        return;
      }

      if (lesson11Interactive) {
        resetLesson11();
        return;
      }

      if (lesson12Interactive) {
        resetLesson12();
        return;
      }

      if (lesson13Interactive) {
        resetLesson13();
        return;
      }

      if (lesson14Interactive) {
        resetLesson14();
        return;
      }

      if (lesson3Interactive) {
        if (pageIndex === 0) {
          setLesson3White([7, 4]);
        } else {
          setLesson3Black([3, 6]);
        }

        setSelected(undefined);
        setLesson3Result("idle");
        setLesson3Animating(false);
        return;
      }

      goTo(
        (lesson.id === 11 || lesson.id === 12) && pageIndex === 7
          ? 4
          : 0
      );
    }}
    onToggleLanguage={() => setLanguage(language === "zh" ? "en" : "zh")}
  />;
}

export function LearnPage() {
  const { t } = useLanguage();
  const [activeLesson, setActiveLesson] = useState<LearningLesson>();
  const [completed, setCompleted] = useState<number[]>([]);
  const chapterOne = learningLessons.slice(0, 2);
  const chapterTwo = learningLessons.slice(2);

  return (
    <>
      <div className="rounded-[2rem] bg-white p-5 shadow-[0_8px_24px_rgba(45,47,47,.04)] sm:p-7">
        <section className="space-y-5"><div className="flex items-center gap-2"><img src={chapterBook} alt="" className="h-8 w-8" /><h2 className="text-[25px] font-black">{t("chapterOneTitle")}</h2></div><div className="grid grid-cols-2 gap-5 lg:max-w-2xl">{chapterOne.map((lesson) => <LessonTile key={lesson.id} lesson={lesson} completed={completed.includes(lesson.id)} onClick={() => setActiveLesson(lesson)} />)}</div></section>
        <section className="mt-9 space-y-5"><div className="flex items-center gap-2"><img src={chapterStar} alt="" className="h-8 w-8" /><h2 className="text-[25px] font-black">{t("chapterTwoTitle")}</h2></div><div className="grid grid-cols-2 gap-5 lg:grid-cols-3">{chapterTwo.map((lesson) => <LessonTile key={lesson.id} lesson={lesson} completed={completed.includes(lesson.id)} onClick={() => setActiveLesson(lesson)} />)}</div></section>
        <section className="mt-9 space-y-5"><div className="flex items-center gap-2"><img src={lockIcon} alt="" className="h-8 w-8" /><h2 className="text-[25px] font-black">{t("chapterThreeTitle")}</h2></div><div className="flex min-h-[82px] items-center gap-4 rounded-[28px] border-2 border-[#e2e2e2] bg-white px-5 text-[#777]"><span className="grid h-12 w-12 place-items-center rounded-full bg-[#e5e5e5] font-black">…</span><div><p className="font-black">{t("advancedTactics")}</p><p className="text-sm font-bold">{t("advancedTacticsBody")}</p></div></div></section>
      </div>
      {activeLesson && (
        <LessonViewer
          key={activeLesson.id}
          lesson={activeLesson}
          onClose={() => setActiveLesson(undefined)}
          onComplete={() => {
            setCompleted((current) =>
              current.includes(activeLesson.id)
                ? current
                : [...current, activeLesson.id]
            );

            const currentIndex = learningLessons.findIndex(
              (lesson) => lesson.id === activeLesson.id
            );

            const nextLesson = learningLessons[currentIndex + 1];

            setActiveLesson(nextLesson);
          }}
        />
      )}
    </>
  );
}
