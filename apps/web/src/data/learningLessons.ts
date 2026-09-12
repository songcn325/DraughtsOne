import lesson01Icon from "../assets/learn/lesson-icons/lesson-01-board.svg";
import lesson02Icon from "../assets/learn/lesson-icons/lesson-02-pieces.svg";
import lesson03Icon from "../assets/learn/lesson-icons/lesson-03-man-move.svg";
import lesson04Icon from "../assets/learn/lesson-icons/lesson-04-man-capture.svg";
import lesson05Icon from "../assets/learn/lesson-icons/lesson-05-blocked-capture.svg";
import lesson06Icon from "../assets/learn/lesson-icons/lesson-06-backward-capture.svg";
import lesson07Icon from "../assets/learn/lesson-icons/lesson-07-multiple-capture.svg";
import lesson08Icon from "../assets/learn/lesson-icons/lesson-08-promotion.svg";
import lesson09Icon from "../assets/learn/lesson-icons/lesson-09-king-move.svg";
import lesson10Icon from "../assets/learn/lesson-icons/lesson-10-king-capture.svg";
import lesson11Icon from "../assets/learn/lesson-icons/lesson-11-compulsory.svg";
import lesson12Icon from "../assets/learn/lesson-icons/lesson-12-maximum.svg";
import lesson13Icon from "../assets/learn/lesson-icons/lesson-13-turkish-rule.svg";
import lesson14Icon from "../assets/learn/lesson-icons/lesson-14-victory.svg";
import lesson15Icon from "../assets/learn/lesson-icons/lesson-15-draw.svg";

export type Copy = { zh: string; en: string };
export type LearningPage = { copy: Copy };
export type LearningLesson = { id: number; title: Copy; icon: string; pages: LearningPage[] };

const c = (zh: string, en: string): Copy => ({ zh, en });
const p = (...items: Array<[string, string]>): LearningPage[] => items.map(([zh, en]) => ({ copy: c(zh, en) }));

export const learningLessons: LearningLesson[] = [
  { id: 1, title: c("认识棋盘", "Know the board"), icon: lesson01Icon, pages: p(
    ["国际跳棋使用 10×10 棋盘，深色格子从左下角到右上角。棋盘标有数字 1 到 50。", "International draughts uses a 10×10 board. The dark squares run from lower left to upper right and are numbered 1 to 50."]
  ) },
  { id: 2, title: c("认识棋子", "Know the pieces"), icon: lesson02Icon, pages: p(
    ["所有棋子都摆放在深色格子上。白棋位于 31 至 50 格，黑棋位于 1 至 20 格。", "All pieces are placed on dark squares. White starts on squares 31–50 and Black starts on squares 1–20."],
    ["普通棋子称为兵。兵抵达对方底线后会升变为王棋，获得更强的移动能力。", "Ordinary pieces are called men. A man that reaches the opponent's back rank becomes a king with greater movement."]
  ) },
  { id: 3, title: c("兵的走法", "Man movement"), icon: lesson03Icon, pages: p(
    ["轮到白方行棋。兵应该如何移动？请你试着移动这颗白棋。", "White to move. In which direction should a man move? Move the white piece."],
    ["很好，你已经知道兵怎样移动了。现在帮助黑方走一步。", "Great—you know how a man moves. Now help Black make one move."],
    ["太棒了！请记住：兵只能向前走，不能向后走。", "Excellent. Remember: a man moves forward and cannot move backward."]
  ) },
  { id: 4, title: c("兵的吃子", "Man capture"), icon: lesson04Icon, pages: p(
    ["小德拉夫将棋子走到了小万的面前，它的身后有一个空格，跳过去吃掉它！", "Draff moved a black piece in front of White, leaving an empty square behind it. Jump over the black piece to capture it!"]
  ) },
  { id: 5, title: c("吃子的常见错误", "Common capture mistakes"), icon: lesson05Icon, pages: p(
    ["当两枚对方棋子相连，后方没有空的落点时，就不能完成吃子。", "If opposing pieces are touching and there is no empty landing square behind them, a capture cannot be made."]
  ) },
  { id: 6, title: c("兵的回吃", "Backward capture"), icon: lesson06Icon, pages: p(
    ["小德拉夫把黑棋走到了白棋身后！并且存在可以跳跃的空格！", "Draff moved the black piece behind White, leaving an empty landing square for a jump!"]
  ) },
  { id: 7, title: c("兵的连吃", "Man multiple capture"), icon: lesson07Icon, pages: p(
    ["两个黑棋中间存在空格！你来帮助小万实现一次连吃！", "There is an empty square between the two black pieces. Help White complete a multiple capture!"],
    ["小德拉夫拉着小万又给你出了几道练习题，快来试试！", "Draff and White have prepared another exercise for you. Give it a try!"],
    ["这也难不倒你，小德拉夫和小万为你感到惊叹！要上难度了，试试看！", "That was no challenge for you! Draff and White are impressed. Now try this harder one!"]
  ) },
  { id: 8, title: c("兵的升变", "Man promotion"), icon: lesson08Icon, pages: p(
    ["停留在对方底线的棋子将加冕成为王棋！你来帮小万把白棋走到对面底线。", "A man that stops on the opponent's back rank is crowned as a king. Help White reach the opposite back rank."],
    ["你来帮小万做出选择，让小万的兵能够加冕为王棋！", "Help White choose the capture route that allows the man to be crowned as a king!"]
  ) },
  { id: 9, title: c("王的走法", "King movement"), icon: lesson09Icon, pages: p(
    ["王棋具有非常突出的战斗力，只要斜线上没有阻碍便可以一步到达！", "A king is extremely powerful: when its diagonal is clear, it can reach any open square along it in one move!"],
    ["此时路线上出现了阻碍，王棋行动的空间就被限制了！", "When pieces obstruct its routes, the king's available movement is restricted!"]
  ) },
  { id: 10, title: c("王的连吃", "King capture"), icon: lesson10Icon, pages: p(
    ["对方棋子出现在王棋的路线上！它身后有三个可落子的空格，帮助小万用白王吃掉它！", "An opposing piece is on the king's diagonal, with three empty landing squares behind it. Help White's king capture it!"],
    ["王棋同样可以连吃。帮助小万用白王连续吃掉这两个黑棋！", "Kings can also make multiple captures. Help White's king capture both black pieces in one sequence!"],
    ["现在来做一道练习：帮助小万用白王连续吃掉四个黑棋！", "Now try an exercise: help White's king capture all four black pieces in one sequence!"],
    ["小万和小德拉夫给你出了一道难题。这道题有两条不同的完整路线，请把它们都找出来！", "White and Draff have prepared a challenge. It has two different complete routes—find them both!"]
  ) },
  { id: 11, title: c("有吃必吃", "Capture is compulsory"), icon: lesson11Icon, pages: p(
    ["现在轮到小万执白棋走棋，小德拉夫执黑棋。白棋有子可吃，所以小万必须吃掉黑棋，不能移动其他棋子。请你帮助小万找到这颗白旗并执行吃子", "Wan is playing White and Draff is playing Black. White has a capture, so Wan must capture instead of moving another piece. Help Wan find the correct white piece and make the capture."],
    ["小万执白棋。请你帮小万走出白棋必须走的一步，注意遵守有吃必吃规则！", "Wan is playing White. Help Wan make the required move while following the compulsory-capture rule!"],
    ["小德拉夫执黑棋。请你移动一颗黑棋，利用有吃必吃规则获得优势吧！", "Draff is playing Black. Move one black piece to use the compulsory-capture rule to gain an advantage!"]
  ) },
  { id: 12, title: c("有多吃多", "Maximum capture"), icon: lesson12Icon, pages: p(
    ["小万执白棋。此时轮到小万走棋，白方两侧都有棋子可以吃子。", "Wan is playing White. It is Wan's turn, and White has captures available on both sides of the board."],
    ["在国际跳棋中，有多吃多规则具有强制性：当有多条吃子路线时，必须选择吃子数量最多的路线。", "In international draughts, maximum capture is compulsory: when several capture routes are available, the route that captures the most pieces must be chosen."],
    ["来进行一次练习吧！请你移动白棋，帮助小万走出正确的一步。", "Let's practise! Move a white piece and help Wan make the correct move."],
    ["此时小德拉夫正吃着你两个棋子，来试试移动一颗白棋，从而利用有吃多吃来获取优势吧。", "Draff is threatening two of your pieces. Move one white piece to use the maximum-capture rule to gain an advantage."]
  ) },
  { id: 13, title: c("土耳其规则", "Turkish capture rule"), icon: lesson13Icon, pages: p(
    ["在国际跳棋中，已经跳过的棋子不能再次跳过，这个是“土耳其规则”，下面请点击“继续”通过实际操作学习土耳其规则。", "In international draughts, a piece that has already been jumped cannot be jumped again. This is the Turkish rule. Click Continue to learn the rule through practice."],
    ["下面我们来看看如何在实战中利用“土耳其规则”吧！", "Now let's see how the Turkish rule can be used in a real position!"]
  ) },
  { id: 14, title: c("胜负判断", "Victory conditions"), icon: lesson14Icon, pages: p(
    ["取胜条件一：将对方的所有棋子吃光。请移动白棋，跳过并吃掉棋盘上的最后一枚黑棋。", "Winning condition one: capture all of your opponent's pieces. Move the white piece, jump over Black, and capture the final black piece on the board."],
    ["取胜条件二：让对方陷入无棋可走的境地。你执白棋，白方位于棋盘下方，向棋盘上方斜走就是白棋的前进方向。请将中间的白棋向左前方或右前方移动一格，找出能让黑棋无路可走的一步。", "Winning condition two: leave your opponent with no legal move. You play White from the lower side of the board, so White moves diagonally upward. Move the central white piece one square forward-left or forward-right and find the move that leaves Black with no legal move."]
  ) },
  { id: 15, title: c("和棋判断", "Draw conditions"), icon: lesson15Icon, pages: p(
    ["你赢不了我，我也赢不了你的情况下，则判定局面为和棋。", "When neither of us can defeat the other, the position is declared a draw."],
    ["在今后的学习中，你还会接触到正式和棋以及双方约定和棋。", "In later lessons, you will also learn about formal draw rules and draws agreed by both players."]
  ) }
];
