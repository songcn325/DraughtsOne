import boardIcon from "../assets/learn/learn-grid-icon.png";
import pieceIcon from "../assets/learn/learn-piece-icon.png";
import moveIcon from "../assets/learn/learn-growth-icon.png";
import captureIcon from "../assets/learn/learn-capture-icon.png";
import promotionIcon from "../assets/learn/learn-promotion-icon.png";
import kingMoveIcon from "../assets/learn/learn-king-move-icon.png";
import kingCaptureIcon from "../assets/learn/learn-king-capture-icon.png";
import victoryIcon from "../assets/learn/learn-duel-icon.png";
import chapterStar from "../assets/learn/learn-chapter-star.png";

export type Copy = { zh: string; en: string };
export type LearningPage = { copy: Copy; title?: Copy };
export type LearningLesson = { id: number; title: Copy; icon: string; pages: LearningPage[] };

const c = (zh: string, en: string): Copy => ({ zh, en });
const p = (...items: Array<[string, string]>): LearningPage[] => items.map(([zh, en]) => ({ copy: c(zh, en) }));

export const learningLessons: LearningLesson[] = [
  { id: 1, title: c("认识棋盘", "Know the board"), icon: boardIcon, pages: p(
    ["国际跳棋使用 10×10 棋盘，深色格子从左下角到右上角。棋盘标有数字 1 到 50。", "International draughts uses a 10×10 board. The dark squares run from lower left to upper right and are numbered 1 to 50."]
  ) },
  { id: 2, title: c("认识棋子", "Know the pieces"), icon: pieceIcon, pages: [
    { title: c("如何摆放棋子", "How to place the pieces"), copy: c("所有棋子都摆放在深色格子上。白棋位于 31 至 50 格，黑棋位于 1 至 20 格。", "All pieces are placed on dark squares. White starts on squares 31–50 and Black starts on squares 1–20.") },
    { copy: c("普通棋子称为兵。兵抵达对方底线后会升变为王棋，获得更强的移动能力。", "Ordinary pieces are called men. A man that reaches the opponent's back rank becomes a king with greater movement.") }
  ] },
  { id: 3, title: c("兵的走法", "Man movement"), icon: moveIcon, pages: p(
    ["轮到白方。兵应该向哪个方向移动？", "It is White's turn. Which direction should the man move?"],
    ["很好，你已经知道兵怎样移动了。现在帮助黑方走一步。", "Great—you know how a man moves. Now help Black make one move."],
    ["太棒了！请记住：兵只能向前走，不能向后走。", "Excellent. Remember: a man moves forward and cannot move backward."]
  ) },
  { id: 4, title: c("兵的吃子", "Man capture"), icon: captureIcon, pages: p(
    ["黑棋走到白棋前方，后面留有空格。跳过黑棋把它吃掉吧。", "Black moved in front of White and left an empty square behind it. Jump over Black to capture it."],
    ["越过对方棋子，并落在它后面的空格上。", "Jump over the opposing piece and land on the empty square behind it."],
    ["你成功完成了一次兵的吃子。", "You successfully completed a capture with a man."]
  ) },
  { id: 5, title: c("吃子的常见错误", "Common capture mistakes"), icon: captureIcon, pages: p(
    ["当两枚对方棋子相连，后方没有空的落点时，就不能完成吃子。", "If opposing pieces are touching and there is no empty landing square behind them, a capture cannot be made."]
  ) },
  { id: 6, title: c("兵的回吃", "Backward capture"), icon: captureIcon, pages: p(
    ["黑棋走到白兵后方，并留出了可以落下的空格。", "Black has moved behind the white man, with an empty landing square available."],
    ["兵在吃子时可以向后跳。", "A man may jump backward when making a capture."],
    ["你吃掉了黑棋。请记住：兵虽然向前走，但可以向后吃。", "You captured Black. Remember: although a man moves forward, it may capture backward."]
  ) },
  { id: 7, title: c("兵的连吃", "Man multiple capture"), icon: captureIcon, pages: p(
    ["两枚黑棋之间有空格。帮助白棋完成连吃。", "There is an empty square between two black pieces. Help White make a multiple capture."],
    ["非常好！国际跳棋中，一次连吃只计算为一步棋。", "Excellent! A multiple capture counts as one move in international draughts."],
    ["这里还有几个连吃练习，来试试吧。", "Here are a few more multiple-capture exercises. Give them a try."],
    ["这对你毫无难度。现在尝试一条更难的路线。", "That was no problem for you. Now try a harder route."],
    ["选择能够吃掉所有可吃棋子的后续路线。", "Choose the continuation that captures every available piece."],
    ["太棒了！你已经理解连吃，继续学习就会成为高手。", "Excellent—you now understand multiple captures. Keep learning and you will soon be an expert."]
  ) },
  { id: 8, title: c("兵的升变", "Man promotion"), icon: promotionIcon, pages: p(
    ["兵停在对方底线时会升变为王。把白兵移动到底线吧。", "A man that stops on the opponent's back rank is crowned as a king. Move White to the back rank."],
    ["白兵到达底线，成功升变为王。", "The man has reached the back rank and is promoted."],
    ["选择能让白兵升变为王的路线。", "Choose the route that lets White's man become a king."],
    ["兵如果只是经过底线而没有停下，就不会升变。再试一次。", "A man that only passes across the back rank without stopping there is not promoted. Try again."],
    ["选择一条最终停在底线的路线。", "Choose a route that finishes on the back rank."],
    ["太棒了！白兵成功升变。接下来学习王的走法。", "Excellent! You promoted White's man. Next, learn how kings move."]
  ) },
  { id: 9, title: c("王的走法", "King movement"), icon: kingMoveIcon, pages: p(
    ["王棋非常强大。斜线畅通时，它一步可以沿斜线移动任意距离。", "A king is powerful. When a diagonal is clear, it can move any distance along it in one move."],
    ["当棋子挡住斜线时，王棋的移动范围会受到限制。", "When a piece blocks the diagonal, the king's movement is limited."]
  ) },
  { id: 10, title: c("王的连吃", "King capture"), icon: kingCaptureIcon, pages: p(
    ["王棋的斜线上有一枚对方棋子，后面有空格。帮助白王完成吃子。", "An opposing piece is on the king's diagonal. With an empty square behind it, help White capture it."],
    ["只要路线没有阻挡，王棋可以落在被吃棋子后面的任意空格。", "A king may land on any empty square beyond the captured piece, provided nothing blocks the path."],
    ["王棋也可以连吃。帮助白王吃掉两枚黑棋。", "Kings also make multiple captures. Help White's king capture both black pieces."],
    ["漂亮的连吃！现在试试下面的练习。", "A clean multiple capture! Now try the following exercises."],
    ["找出王棋完整的吃子路线。", "Find the king's complete capture route."],
    ["你已经像高手一样思考了。再试一个局面。", "You are thinking like a strong player. Try one more position."],
    ["这个挑战有多条可行路线，请找出其中一条。", "This challenge has several possible routes. Find one."],
    ["很好，你找到了一条路线。回到局面再找另一条。", "Excellent—you found one route. Return to the position and look for another."],
    ["这是另一条正确路线。", "That is another correct route."],
    ["太棒了！继续学习，成为国际跳棋高手吧。", "Brilliant! Keep learning and become an international draughts expert."]
  ) },
  { id: 11, title: c("有吃必吃", "Capture is compulsory"), icon: captureIcon, pages: p(
    ["轮到白方。白棋必须吃子，不能移动其他棋子。", "It is White's turn. White must capture and may not move another piece."],
    ["有吃必吃是国际跳棋必须遵守的规则。", "The compulsory-capture rule is mandatory in international draughts."],
    ["帮助白棋按照有吃必吃规则走出正确的一步。", "Help White play the move required by the compulsory-capture rule."],
    ["很好！现在把有吃必吃运用到真实局面中。", "Excellent—you understand compulsory capture. Now apply it in a position."],
    ["小万走出这步棋，下一步对方必须吃掉黑子。利用规则获取优势吧！", "After this move, the next player must capture. Use that forced move to gain an advantage."],
    ["正确！利用有吃必吃争取先手，叫作赢得一步。", "Correct. Using compulsory capture to gain time is called winning a tempo."],
    ["白方吃掉一枚黑棋，黑方随后吃掉两枚白棋。", "White captured one black piece, but Black replied by capturing two white pieces."],
    ["再试一次，你很快就能找到正确答案。", "Try again. You will find the correct solution soon."]
  ) },
  { id: 12, title: c("有多吃多", "Maximum capture"), icon: kingCaptureIcon, pages: p(
    ["白方两侧都能吃子，必须遵守有多吃多规则。", "White can capture on either side and must follow the maximum-capture rule."],
    ["白方必须选择吃子数量最多的路线，这是强制规则。", "White must choose the route that captures the most pieces. This rule is compulsory."],
    ["来做练习：帮助白方走出正确的第一步。", "Try an exercise: help White make the correct first move."],
    ["正确！现在看看怎样利用有多吃多进行战术。", "Correct. Now see how maximum capture can be used tactically."],
    ["此时小德拉夫正吃着你两个棋子，来试试利用有多吃多获取优势吧。", "Black is attacking two of your pieces. Use maximum capture to gain an advantage."],
    ["正确！利用对方有多吃多的义务形成这种手段，叫作引入。", "Correct. Using the opponent's maximum-capture obligation this way is called a forcing attachment."],
    ["强制的后续走法完成了这一战术。", "The forced continuation completes the tactic."],
    ["再试一次，你很快就能找到正确答案。", "Try again. You will find the correct solution soon."]
  ) },
  { id: 13, title: c("土耳其规则", "Turkish capture rule"), icon: chapterStar, pages: p(
    ["连吃过程中，已经越过的棋子不能再次越过，这就是土耳其规则。", "During a capture sequence, a piece already crossed may not be crossed again. This is the Turkish rule."],
    ["例如黑方走出这一步，白王开始连吃。", "For example, Black makes this move and White's king begins a capture sequence."],
    ["王棋只有一个合法落点，不能再次越过已经吃过的棋子。", "The king has only one legal landing. It cannot cross a piece that was already captured."],
    ["现在看看怎样在真实局面中运用土耳其规则。", "Now see how the Turkish rule can be used in a real position."],
    ["白方已经走出这一步，帮助黑王完成吃子。", "White has made this move. Help Black's king complete its capture."],
    ["正确！你已经掌握土耳其规则。", "Correct—you have mastered the Turkish rule."],
    ["白方巧妙运用土耳其规则，并成功完成升变。", "White used the Turkish rule tactically and successfully promoted a man."]
  ) },
  { id: 14, title: c("胜负判断", "Victory conditions"), icon: victoryIcon, pages: p(
    ["获胜条件一：吃掉对方所有棋子。", "Winning condition one: capture all of the opponent's pieces."],
    ["白方吃掉了黑方全部棋子，所以白方获胜。", "White captured all of Black's pieces, so White wins."],
    ["获胜条件二：让对方没有任何合法走法。", "Winning condition two: leave the opponent with no legal move."],
    ["白方走棋后，黑兵全部被封锁，无法前进，因此白方获胜。", "After White's move, Black's men are blocked and cannot advance, so White wins."]
  ) },
  { id: 15, title: c("和棋判断", "Draw conditions"), icon: victoryIcon, pages: p(
    ["当双方都无法战胜对方时，这个局面就是和棋。", "When neither player can defeat the other, the position is a draw."],
    ["后续课程会介绍常见和棋局面，以及双方同意和棋的情况。", "Later lessons will introduce standard drawn positions and draws agreed by both players."]
  ) }
];
