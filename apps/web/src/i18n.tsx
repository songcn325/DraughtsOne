import { createContext, useContext, useEffect, useMemo, useState, type PropsWithChildren } from "react";

export type Language = "en" | "zh";

const translations = {
  en: {
    me: "Me", language: "Language", english: "English", chinese: "中文",
    navLearn: "Learn", navTrain: "Train", navPlay: "Play", navAi: "AI",
    rating: "{value} rating",
    learnTitle: "Learning Path", learnSubtitle: "Short lessons, daily drills, then a real board.",
    unitBasics: "Unit 1: The Basics", unitBasicsSubtitle: "Master movement and captures", unitTactics: "Unit 2: Tactical Play", unitTacticsSubtitle: "Combinations and sacrifices",
    lessonRules: "Rules", lessonOpenings: "Openings", lessonPositions: "Positions", lessonTempo: "Tempo", lessonEndgames: "Endgames",
    currentLesson: "Current Lesson", openingBasics: "Opening basics",
    lessonDescription: "Learn the idea, solve one position, then play it on the board. This keeps the MVP focused on repeatable progress.",
    startLesson: "Start lesson", today: "Today", streakGems: "{days} day streak · {gems} gems",
    login: "Log in", username: "Username", password: "Password", continue: "Continue",
    matchHistory: "Match History", winResignation: "Win by resignation", lossTimeout: "Loss by timeout", draw: "Draw",
    replayAvailable: "Room MVP-{value} · replay data available",
    gameHall: "Game Hall", playNow: "Play 10x10 draughts now",
    hallDescription: "Create a private room, start a quick local match, or share a room code while the online backend is being hardened.",
    createRoom: "Create room", quickMatch: "Quick match", mvpRoom: "MVP Room", roomCode: "Room code",
    onlineMatch: "Online match", onlineMatchDescription: "Play a live game against another person.",
    findOpponent: "Find opponent", searchingOpponent: "Searching for an opponent…",
    searchingElapsed: "Searching for {time}", cancelSearch: "Cancel search",
    delayedSearch: "This is taking longer than usual. Few players may be searching right now.",
    noOpponent: "No opponent is currently available. Online matchmaking may have too few players right now.",
    tryAgain: "Try again", waitingRoom: "Waiting room", matchFound: "Opponent found",
    connectingGame: "Connecting to the game…", onlineGame: "Online game",
    yourTurn: "Your turn", opponentTurn: "Waiting for your opponent", youAre: "You are {side}",
    moveRejected: "The server rejected that move.", connectionLost: "Connection lost. Reconnecting…",
    guestIdentityNote: "A guest identity preserves your games on this browser. Registration can be added later.",
    exitGame: "Exit", activeGameExitTitle: "Finish the game before exiting",
    activeGameExitBody: "Resign first or complete the game before returning to Play.",
    continuePlaying: "Continue playing", confirmResignOnline: "Do you really want to resign?",
    confirmResignOnlineBody: "Resigning ends this online game immediately and awards the win to your opponent.",
    exportMoves: "Export PDN", captureRequiredOnline: "Capture is mandatory. Choose a piece that can capture.",
    openDemo: "Open demo board", warmUp: "Warm up with training",
    createRoomTitle: "Create Room", privateRoom: "{control} · private room", createLocalRoom: "Create local MVP room",
    tenMinutes: "10 minutes", fiveBlitz: "5 + 3 blitz", threeMinutes: "3 minutes",
    demoPlayer: "Demo Player", profileStats: "1188 rating · 5 day streak", viewHistory: "View match history",
    aiProfile: "AI Profile Analytics", aiPlaceholder: "Visual placeholder kept from the prototype. AI opponent is outside the first MVP scope.",
    tactics: "Tactics", openings: "Openings", endgames: "Endgames",
    dailyTraining: "Daily Training", nowTraining: "Now training: {title}", tasks: "{value} tasks",
    task: "Task: {title}", chooseDestination: "Choose a highlighted destination.", tryAnother: "Try another square.",
    goodCapture: "Good capture. That is the tactical habit we want.", legalMove: "Legal move played. Look for forcing captures when available.",
    puzzle: "Puzzle", drill: "Drill", endgame: "Endgame", beginner: "Beginner", intermediate: "Intermediate", advanced: "Advanced",
    gems: "{value} gems", startTask: "Start task", forcedCapture: "Find the forced capture", kingLaneControl: "King lane control",
    whiteSide: "White side", blackSide: "Black side", white: "White", black: "Black",
    room: "Room", newGame: "New game", resign: "Resign",
    learnerMode: "Learner mode", learnerOn: "Legal destinations and rule tips are on.", learnerOff: "Hints and rule tips are off.",
    explainLearner: "Explain learner mode", toggleLearner: "Toggle learner mode",
    scanEngine: "Scan engine", positionAnalysis: "Position analysis",
    analysisDescription: "Evaluate the current board and calculate the best continuation.",
    analyze: "Analyze", analyzing: "Analyzing…", analyzeAgain: "Analyze again", stopAnalysis: "Stop",
    continuousAnalysisOn: "Continuous analysis is on. Scan refreshes after every move.",
    evaluation: "Evaluation", depth: "Depth", nodes: "Nodes", bestMove: "Best move",
    noAnalysis: "Run an analysis to see the evaluation, best move, and principal variation.",
    bestMoveArrow: "Best-move arrow", showRecommendation: "Show Scan’s recommendation on the board.",
    analyzeFirst: "Start Analyze first to calculate and continuously update recommendations.", toggleBestMove: "Toggle best-move arrow",
    analysisUnavailable: "Position analysis is temporarily unavailable.", notAvailable: "Not available", equal: "Equal",
    moveList: "Move list", exportPdn: "Export PDN", noMoves: "Moves appear here as soon as the first piece moves.",
    moveLine: "{number}. {fromRow},{fromCol} to {toRow},{toCol}",
    resignTitle: "Resign this game?", resignDescription: "This means {side} surrenders and the other side wins.",
    cancel: "Cancel", confirm: "Confirm", gameOver: "Game over", sideWins: "{side} side wins!",
    finalBoard: "The final board is still visible behind this window.", close: "Close",
    pdnExport: "PDN export", pdnDescription: "Copy this move list for sharing, replay, or later analysis.", copy: "Copy",
    whiteMovesFirstTitle: "White moves first", whiteMovesFirstBody: "In draughts, the white side starts the game. Select a white piece to make the first move.",
    gotIt: "Got it", captureMandatoryTitle: "Capture is mandatory",
    captureMandatoryBody: "When one of your pieces can capture an opponent piece, you must make a capture move. Choose a piece with a highlighted capture destination.",
    learnerBody: "When enabled, DraughtsOne shows legal destinations and explains rules when a move is not allowed. Turn it off when you want to play without hints.",
    initialMessage: "White to move. Select a piece.", timeoutMessage: "{side} ran out of time. {winner} wins.",
    whiteFirstMessage: "White moves first in draughts. Select a white piece to begin.",
    turnSelectMessage: "It is {side}'s turn. Select a {color} piece.", legalOptions: "{side} has {count} legal move(s).",
    mustCapturePiece: "A capture is mandatory. Choose a piece that can capture.", noPieceMove: "That piece has no legal move. Choose another piece.",
    selectPieceFirst: "Select a {color} piece first.", illegalCapture: "That square is not legal. A capture is available and must be played.",
    illegalDestination: "That square is not a legal destination.", turnMessage: "{side} to move.",
    winMessage: "{side} wins by {reason}.", resignedMessage: "{side} resigned. {winner} wins.",
    reasonWin: "win", reasonDraw: "draw", reasonResignation: "resignation", reasonTimeout: "timeout",
    reasonDisconnect: "disconnect", reasonForfeit: "forfeit", square: "Square {row}, {col}"
  },
  zh: {
    me: "我的", language: "语言", english: "English", chinese: "中文",
    navLearn: "学习", navTrain: "训练", navPlay: "对弈", navAi: "AI",
    rating: "等级分 {value}",
    learnTitle: "学习路径", learnSubtitle: "短课、每日训练，然后上棋盘实战。",
    unitBasics: "第一单元：基础", unitBasicsSubtitle: "掌握走子与吃子", unitTactics: "第二单元：战术对弈", unitTacticsSubtitle: "组合与弃子",
    lessonRules: "规则", lessonOpenings: "开局", lessonPositions: "局面", lessonTempo: "节奏", lessonEndgames: "残局",
    currentLesson: "当前课程", openingBasics: "开局基础",
    lessonDescription: "学习一个概念，解决一个局面，再到棋盘上实践，逐步形成可重复的进步。",
    startLesson: "开始课程", today: "今日", streakGems: "连续 {days} 天 · {gems} 宝石",
    login: "登录", username: "用户名", password: "密码", continue: "继续",
    matchHistory: "对局历史", winResignation: "对手认输获胜", lossTimeout: "超时告负", draw: "和棋",
    replayAvailable: "房间 MVP-{value} · 可查看复盘数据",
    gameHall: "对局大厅", playNow: "立即开始 10×10 国际跳棋",
    hallDescription: "创建私人房间、开始快速本地对局，或分享房间码。",
    createRoom: "创建房间", quickMatch: "快速对局", mvpRoom: "MVP 房间", roomCode: "房间码",
    onlineMatch: "在线匹配", onlineMatchDescription: "与另一位真人玩家进行实时对局。",
    findOpponent: "寻找对手", searchingOpponent: "正在寻找对手…",
    searchingElapsed: "已搜索 {time}", cancelSearch: "取消匹配",
    delayedSearch: "匹配时间比平时更长，当前可能只有少量玩家正在寻找对局。",
    noOpponent: "当前没有可匹配的对手，在线玩家数量可能暂时不足。",
    tryAgain: "重新尝试", waitingRoom: "等候室", matchFound: "已找到对手",
    connectingGame: "正在连接对局…", onlineGame: "在线对局",
    yourTurn: "轮到你行棋", opponentTurn: "等待对手行棋", youAre: "你执{side}",
    moveRejected: "服务器拒绝了该走法。", connectionLost: "连接已中断，正在重新连接…",
    guestIdentityNote: "访客身份会在此浏览器保存你的对局，今后可升级为注册账号。",
    exitGame: "退出", activeGameExitTitle: "请先结束对局",
    activeGameExitBody: "请先认输或完成本局，再返回“对弈”页面。",
    continuePlaying: "继续对局", confirmResignOnline: "确认认输吗？",
    confirmResignOnlineBody: "认输将立即结束在线对局，并判定对手获胜。",
    exportMoves: "导出 PDN", captureRequiredOnline: "当前必须吃子，请选择能够吃子的棋子。",
    openDemo: "打开演示棋盘", warmUp: "先进行训练",
    createRoomTitle: "创建房间", privateRoom: "{control} · 私人房间", createLocalRoom: "创建本地 MVP 房间",
    tenMinutes: "10 分钟", fiveBlitz: "5+3 快棋", threeMinutes: "3 分钟",
    demoPlayer: "演示棋手", profileStats: "等级分 1188 · 连续 5 天", viewHistory: "查看对局历史",
    aiProfile: "AI 棋风分析", aiPlaceholder: "此页面目前为原型展示，AI 对手尚未纳入第一版 MVP。",
    tactics: "战术", openings: "开局", endgames: "残局",
    dailyTraining: "每日训练", nowTraining: "正在训练：{title}", tasks: "{value} 个任务",
    task: "任务：{title}", chooseDestination: "请选择高亮的目标格。", tryAnother: "请尝试其他格子。",
    goodCapture: "吃得好，这正是需要培养的战术习惯。", legalMove: "走法合法。若有机会，请优先寻找强制吃子。",
    puzzle: "谜题", drill: "练习", endgame: "残局", beginner: "初级", intermediate: "中级", advanced: "高级",
    gems: "{value} 宝石", startTask: "开始任务", forcedCapture: "找出强制吃子", kingLaneControl: "王棋线路控制",
    whiteSide: "白方", blackSide: "黑方", white: "白方", black: "黑方",
    room: "房间", newGame: "新对局", resign: "认输",
    learnerMode: "学习模式", learnerOn: "已显示合法落点与规则提示。", learnerOff: "已关闭提示与规则说明。",
    explainLearner: "了解学习模式", toggleLearner: "切换学习模式",
    scanEngine: "Scan 引擎", positionAnalysis: "局面分析",
    analysisDescription: "评估当前局面并计算最佳后续变化。",
    analyze: "分析", analyzing: "分析中…", analyzeAgain: "重新分析", stopAnalysis: "停止",
    continuousAnalysisOn: "持续分析已开启，Scan 会在每步棋后自动更新。",
    evaluation: "评估", depth: "深度", nodes: "节点", bestMove: "最佳着法",
    noAnalysis: "点击分析以查看局面评估、最佳着法和主要变化。",
    bestMoveArrow: "最佳着法箭头", showRecommendation: "在棋盘上显示 Scan 的推荐着法。",
    analyzeFirst: "请先开启“分析”，系统会持续计算并自动更新推荐着法。", toggleBestMove: "切换最佳着法箭头",
    analysisUnavailable: "局面分析暂时不可用。", notAvailable: "暂无", equal: "均势",
    moveList: "着法列表", exportPdn: "导出 PDN", noMoves: "第一步棋走出后，着法会显示在这里。",
    moveLine: "{number}. {fromRow},{fromCol} 到 {toRow},{toCol}",
    resignTitle: "确认认输？", resignDescription: "{side}将认输，对方获胜。",
    cancel: "取消", confirm: "确认", gameOver: "对局结束", sideWins: "{side}获胜！",
    finalBoard: "最终局面仍显示在此窗口后方。", close: "关闭",
    pdnExport: "导出 PDN", pdnDescription: "复制着法列表，用于分享、复盘或后续分析。", copy: "复制",
    whiteMovesFirstTitle: "白方先行", whiteMovesFirstBody: "国际跳棋由白方先行，请选择一枚白棋开始。",
    gotIt: "知道了", captureMandatoryTitle: "必须吃子",
    captureMandatoryBody: "当棋子可以吃掉对方棋子时，必须执行吃子。请选择有高亮落点的棋子。",
    learnerBody: "开启后，DraughtsOne 会显示合法落点并解释非法走法。想在无提示状态下对弈时可将其关闭。",
    initialMessage: "白方行棋，请选择棋子。", timeoutMessage: "{side}超时，{winner}获胜。",
    whiteFirstMessage: "国际跳棋由白方先行，请选择一枚白棋开始。",
    turnSelectMessage: "现在轮到{side}，请选择{color}棋子。", legalOptions: "{side}有 {count} 个合法着法。",
    mustCapturePiece: "当前必须吃子，请选择能够吃子的棋子。", noPieceMove: "该棋子没有合法着法，请选择其他棋子。",
    selectPieceFirst: "请先选择{color}棋子。", illegalCapture: "该格不合法，当前有可吃棋，必须执行吃子。",
    illegalDestination: "该格不是合法落点。", turnMessage: "轮到{side}行棋。",
    winMessage: "{side}因{reason}获胜。", resignedMessage: "{side}认输，{winner}获胜。",
    reasonWin: "胜利", reasonDraw: "和棋", reasonResignation: "认输", reasonTimeout: "超时",
    reasonDisconnect: "断线", reasonForfeit: "弃权", square: "第 {row} 行，第 {col} 列"
  }
} as const;

export type TranslationKey = keyof typeof translations.en;
type Values = Record<string, string | number>;

const LanguageContext = createContext<{ language: Language; setLanguage: (language: Language) => void; t: (key: TranslationKey, values?: Values) => string } | null>(null);

export function LanguageProvider({ children }: PropsWithChildren) {
  const [language, setLanguage] = useState<Language>(() => (localStorage.getItem("draughtsone-language") === "zh" ? "zh" : "en"));
  useEffect(() => {
    localStorage.setItem("draughtsone-language", language);
    document.documentElement.lang = language === "zh" ? "zh-CN" : "en";
  }, [language]);

  const value = useMemo(() => ({
    language,
    setLanguage,
    t: (key: TranslationKey, values: Values = {}) =>
      Object.entries(values).reduce((text, [name, replacement]) => text.replaceAll(`{${name}}`, String(replacement)), translations[language][key] as string)
  }), [language]);

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) throw new Error("useLanguage must be used inside LanguageProvider");
  return context;
}
