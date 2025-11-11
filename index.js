// index.tsx
import React10 from "react";
import ReactDOM from "react-dom/client";

// App.tsx
import { useEffect as useEffect7, useState as useState10, useRef as useRef7 } from "react";

// hooks/useGameLogic.ts
import { useState, useEffect, useCallback, useMemo, useRef } from "react";

// constants.ts
var BOARD_SIZE = 8;
var PLAYER_X = "X" /* X */;
var PLAYER_O = "O" /* O */;
var AI_PLAYER = "O" /* O */;
var HUMAN_PLAYER = "X" /* X */;
var POSITIONAL_VALUE_MAP = [
  [3, 4, 5, 7, 7, 5, 4, 3],
  [4, 6, 8, 10, 10, 8, 6, 4],
  [5, 8, 11, 13, 13, 11, 8, 5],
  [7, 10, 13, 16, 16, 13, 10, 7],
  [7, 10, 13, 16, 16, 13, 10, 7],
  [5, 8, 11, 13, 13, 11, 8, 5],
  [4, 6, 8, 10, 10, 8, 6, 4],
  [3, 4, 5, 7, 7, 5, 4, 3]
];
var ACHIEVEMENTS = {
  TUTORIAL_COMPLETE: {
    name: "Graduate",
    description: "Complete Professor Caz's tutorial.",
    icon: "\u{1F393}"
  },
  FIRST_WIN: {
    name: "First Victory",
    description: "Win your first game against Professor Caz.",
    icon: "\u{1F3C6}"
  },
  WIN_STREAK_5: {
    name: "On Fire!",
    description: "Achieve a 5-game win streak against Professor Caz on Intermediate or higher.",
    lockedDescription: "??????????",
    lockedHint: "Consistency is the hallmark of a true master. Can you prove your skill time and time again?",
    icon: "\u{1F525}"
  },
  BEAT_GRAND_MASTER: {
    name: "Master Mind",
    description: "Defeat the 'Grand Master' level Professor Caz.",
    lockedDescription: "??????????",
    lockedHint: "Only by defeating the ultimate challenge can you prove your own mastery.",
    icon: "\u{1F9E0}"
  },
  GRAVITY_MASTER: {
    name: "Gravity Master",
    description: "Win a game with a connection of 6 or more pieces on Intermediate or higher.",
    lockedDescription: "??????????",
    lockedHint: "Victory is one thing, but victory with style and a grand design? That is true genius.",
    icon: "\u269B\uFE0F"
  },
  LAB_UNLOCKED: {
    name: "Lab Access",
    description: "Unlock the secrets of the Professor's Lab.",
    lockedDescription: "??????????",
    lockedHint: "Some secrets are hidden in plain sight, waiting for the curious mind to play with the world around them.",
    icon: "\u{1F52C}"
  },
  GRAND_TOUR: {
    name: "Grand Tour",
    description: "Win against every Professor Caz level from Beginner to Grand Master.",
    icon: "\u{1F5FA}\uFE0F",
    lockedDescription: "??????????",
    lockedHint: "To be the best, you must defeat the best... all of them."
  },
  LONG_GAME: {
    name: "The Long Game",
    description: "Win a match that lasts 40 or more moves.",
    icon: "\u23F3",
    lockedDescription: "??????????",
    lockedHint: "Patience and endurance can often outmaneuver a swift and reckless attack."
  },
  CUSTOMIZED_PROFILE: {
    name: "Tinkerer",
    description: "Personalize your profile by changing both your name and piece.",
    icon: "\u{1F3A8}",
    lockedDescription: "??????????",
    lockedHint: "An artist's first work is a self-portrait. Make this game your own."
  }
};

// ai-settings.ts
var AI_LEVELS = [
  // Level 0
  { name: "Beginner", depth: 0, strategic: false, description: "Makes weighted random moves, but will block/take immediate wins." },
  // Level 1
  { name: "Novice", depth: 1, strategic: false, probabilities: [0.6, 0.3, 0.1], description: "Starts to recognize simple threats, but is still quite predictable." },
  // Level 2
  { name: "Intermediate", depth: 2, strategic: false, probabilities: [0.85, 0.1, 0.05], description: "Looks two moves ahead. A solid opponent for casual players." },
  // Level 3
  { name: "Expert", depth: 3, strategic: true, description: "Uses positional strategy and looks three moves ahead. Very challenging." },
  // Level 4
  { name: "Master", depth: 4, strategic: true, description: "A refined version of Expert with deeper tactical awareness." },
  // Level 5
  { name: "Grand Master", depth: 5, strategic: true, description: "A formidable opponent that sees deep into the game and learns from its mistakes." }
];

// ai-messages.ts
var THEME_AWARE_MASCOT_MESSAGES = {
  shared: {
    gameStart: [
      "A new challenge begins!",
      "Let's have a grand game!",
      "Ready your wits!",
      "May the best mind win."
    ],
    playerCreatesThreat: [
      "Ooh, a clever setup!",
      "Aha, I see what you're planning.",
      "A palpable threat...",
      "Professor Caz is evaluating your threat...",
      "A bold move! Let's see if it pays off."
    ],
    playerBlocksThreat: [
      "Hmph, a shrewd block!",
      "My brilliant plan, foiled!",
      "Well played. That was a critical spot.",
      "You've anticipated my strategy!"
    ],
    aiCreatesThreat: [
      "Behold my masterful strategy!",
      "Your move, I believe.",
      "Let's see you get out of this one.",
      "The board is my canvas."
    ],
    aiBlocksThreat: [
      "Not so fast!",
      "I'm afraid I can't let you do that.",
      "A necessary precaution.",
      "You'll have to be cleverer than that!"
    ],
    playerWins: [
      "Astounding! You've bested me!",
      "A well-deserved victory!",
      "You are a true master of the craft!",
      "My calculations were... flawed. Congratulations!"
    ],
    aiWins: [
      "Checkmate... or rather, Connect-Four-mate!",
      "A logical conclusion.",
      "Better luck next time, my friend.",
      "A victory for science! And for me.",
      "I won!"
    ],
    draw: [
      "A stalemate! A battle of equals.",
      "It seems we are perfectly matched.",
      "An impenetrable defense on both sides!"
    ]
  },
  space: {
    gameStart: [
      "Engage!",
      "Let the Wookiee win.",
      "The board is set. The pieces are moving.",
      "Time is a companion that goes with us on a journey."
    ],
    playerCreatesThreat: [
      "It's a trap!",
      "I've got a bad feeling about this.",
      "Fascinating.",
      "The odds of that move succeeding are approximately 3,720 to 1.",
      "I sense a disturbance in the Force."
    ],
    playerBlocksThreat: [
      "The Force is strong with this one.",
      "Clever girl.",
      "I find your lack of faith disturbing.",
      "That is... not logical."
    ],
    aiCreatesThreat: [
      "I have you now!",
      "Resistance is futile.",
      "All your base are belong to us.",
      "There is no escape."
    ],
    aiBlocksThreat: [
      "I'm afraid I can't let you do that, Dave.",
      "Never tell me the odds!",
      "This is the way.",
      "By my calculations, your path is blocked."
    ],
    playerWins: [
      "The student has become the master.",
      "Live long and prosper.",
      "So long, and thanks for all the fish.",
      "I have been, and always shall be, your friend."
    ],
    aiWins: [
      "I am inevitable.",
      "The needs of the many outweigh the needs of the few.",
      "Don't Panic.",
      "I've seen things you people wouldn't believe..."
    ],
    draw: [
      "A paradox. We must not disrupt the timeline.",
      "The universe is in balance.",
      "The board is in a state of quantum superposition."
    ]
  }
};

// gamepad-navigation.ts
var getNavigationMap = (config) => {
  if (config.isVirtualKeyboardOpen) {
    return { "vk-focused": {} };
  }
  if (config.isGameOver) {
    return {
      "share-button": { up: "board", down: "gameover-close-button", left: "board", right: "board" },
      "gameover-close-button": { up: "share-button", down: "board", left: "share-button", right: "gameover-newgame-button" },
      "gameover-newgame-button": { up: "share-button", down: "board", left: "gameover-close-button", right: "share-button" }
    };
  }
  if (config.isRulesOpen) {
    return {
      "rules-modal-tutorial": { right: "rules-modal-close", down: "rules-modal-close" },
      "rules-modal-close": { left: "rules-modal-tutorial", up: "rules-modal-tutorial" }
    };
  }
  if (config.isStatsOpen) {
    return {
      "stats-modal-close": { down: "stats-tab-achievements" },
      "stats-tab-achievements": { up: "stats-modal-close", right: "stats-tab-stats" },
      "stats-tab-stats": { up: "stats-modal-close", left: "stats-tab-achievements" }
    };
  }
  if (config.isConfirmOpen) {
    return {
      "confirm-modal-cancel": { right: "confirm-modal-confirm" },
      "confirm-modal-confirm": { left: "confirm-modal-cancel" }
    };
  }
  if (config.isUnlockOpen) {
    return {
      "unlock-modal-close": {}
    };
  }
  if (config.isDifficultySelectOpen) {
    const optionNav = {};
    const numOptions = AI_LEVELS.length;
    for (let i = 0; i < numOptions; i++) {
      optionNav[`difficulty-select-option-${i}`] = {
        up: `difficulty-select-option-${(i - 1 + numOptions) % numOptions}`,
        down: `difficulty-select-option-${(i + 1) % numOptions}`
      };
    }
    return optionNav;
  }
  const mainNav = {
    "mute-button": { up: "board", down: "board", left: "stats-button", right: "rules-button" },
    "rules-button": { up: "board", down: "board", left: "mute-button", right: "stats-button" },
    "stats-button": { up: "board", down: "board", left: "rules-button", right: "mute-button" },
    "board": {
      up: "rules-button",
      down: "new-game-button",
      left: "new-game-button",
      right: "new-game-button"
    },
    "new-game-button": { up: "board", down: "tab-setup" },
    // Tabs
    "tab-setup": { up: "new-game-button", down: "gamemode-pvc", right: "tab-profile" },
    "tab-profile": { up: "new-game-button", down: "player-name-input", left: "tab-setup", right: "tab-options" },
    "tab-options": { up: "new-game-button", down: "animations-toggle", left: "tab-profile", right: "tab-about" },
    "tab-about": { up: "new-game-button", down: "itch-link", left: "tab-options" },
    // Setup Tab Content
    "gamemode-pvc": { up: "tab-setup", down: "auto-adjust-toggle", right: "gamemode-pvp" },
    "gamemode-pvp": { up: "tab-setup", down: config.gameMode === "pvc" /* PvC */ ? "auto-adjust-toggle" : "tab-setup", left: "gamemode-pvc", right: "gamemode-online" },
    "gamemode-online": { up: "tab-setup", down: config.gameMode === "pvc" /* PvC */ ? "auto-adjust-toggle" : "tab-setup", left: "gamemode-pvp" },
    "auto-adjust-toggle": { up: "gamemode-pvc", down: "difficulty-select" },
    "difficulty-select": { up: "auto-adjust-toggle", down: "new-game-button" },
    // Profile Tab Content
    "player-name-input": { up: "tab-profile", down: "player-piece-input" },
    "player-piece-input": { up: "player-name-input", down: config.gameMode === "pvp" /* PvP */ ? "player-o-name-input" : "profile-apply-button" },
    "player-o-name-input": { up: "player-piece-input", down: "player-o-piece-input" },
    "player-o-piece-input": { up: "player-o-name-input", down: "profile-apply-button" },
    "profile-apply-button": { up: config.gameMode === "pvp" /* PvP */ ? "player-o-piece-input" : "player-piece-input", down: "tab-profile" },
    // Options Tab Content
    "animations-toggle": { up: "tab-options", down: "shake-toggle" },
    "shake-toggle": { up: "animations-toggle", down: "haptics-toggle" },
    "haptics-toggle": { up: "shake-toggle", down: "theme-toggle" },
    "theme-toggle": { up: "haptics-toggle", down: "tab-options" },
    // About Tab Content
    "itch-link": { up: "tab-about", down: "discord-link" },
    "discord-link": { up: "itch-link", down: "release-notes-button" },
    "release-notes-button": { up: "discord-link", down: "tab-about" }
  };
  return mainNav;
};

// hooks/useGameLogic.ts
var createInitialBoard = () => Array(BOARD_SIZE).fill(null).map(() => Array(BOARD_SIZE).fill(null));
var isOnWall = (r, c) => r === 0 || r === BOARD_SIZE - 1 || c === 0 || c === BOARD_SIZE - 1;
var isValidMove = (r, c, board, movesMade) => {
  if (r < 0 || r >= BOARD_SIZE || c < 0 || c >= BOARD_SIZE || board[r][c]) {
    return false;
  }
  if (movesMade === 0) return isOnWall(r, c);
  if (isOnWall(r, c)) return true;
  const directions = [[-1, 0], [1, 0], [0, -1], [0, 1]];
  for (const [dr, dc] of directions) {
    let pathIsGood = true;
    let hasPiece = false;
    let cr = r + dr;
    let cc = c + dc;
    while (cr >= 0 && cr < BOARD_SIZE && cc >= 0 && cc < BOARD_SIZE) {
      if (board[cr][cc]) {
        hasPiece = true;
      } else {
        pathIsGood = false;
        break;
      }
      cr += dr;
      cc += dc;
    }
    if (hasPiece && pathIsGood) return true;
  }
  return false;
};
var getValidMoves = (board, movesMade) => {
  const moves = [];
  for (let r = 0; r < BOARD_SIZE; r++) {
    for (let c = 0; c < BOARD_SIZE; c++) {
      if (isValidMove(r, c, board, movesMade)) {
        moves.push({ r, c });
      }
    }
  }
  return moves;
};
var checkWin = (player, board) => {
  const allWins = [];
  const processedCells = /* @__PURE__ */ new Set();
  const directions = [
    { r: 0, c: 1 },
    { r: 1, c: 0 },
    { r: 1, c: 1 },
    { r: 1, c: -1 }
  ];
  for (let r = 0; r < BOARD_SIZE; r++) {
    for (let c = 0; c < BOARD_SIZE; c++) {
      if (board[r][c] !== player || processedCells.has(`${r},${c}`)) {
        continue;
      }
      for (const dir of directions) {
        const line = [{ r, c }];
        for (let i = 1; i < 4; i++) {
          const nextR = r + i * dir.r;
          const nextC = c + i * dir.c;
          if (nextR >= 0 && nextR < BOARD_SIZE && nextC >= 0 && nextC < BOARD_SIZE && board[nextR][nextC] === player) {
            line.push({ r: nextR, c: nextC });
          } else {
            break;
          }
        }
        if (line.length >= 4) {
          let prevR = r - dir.r;
          let prevC = c - dir.c;
          while (prevR >= 0 && prevR < BOARD_SIZE && prevC >= 0 && prevC < BOARD_SIZE && board[prevR][prevC] === player) {
            line.unshift({ r: prevR, c: prevC });
            prevR -= dir.r;
            prevC -= dir.c;
          }
          const lastPiece = line[line.length - 1];
          let nextR = lastPiece.r + dir.r;
          let nextC = lastPiece.c + dir.c;
          while (nextR >= 0 && nextR < BOARD_SIZE && nextC >= 0 && nextC < BOARD_SIZE && board[nextR][nextC] === player) {
            line.push({ r: nextR, c: nextC });
            nextR += dir.r;
            nextC += dir.c;
          }
          allWins.push(line);
          line.forEach((cell) => processedCells.add(`${cell.r},${cell.c}`));
        }
      }
    }
  }
  return allWins.length > 0 ? allWins : null;
};
var getCanonicalPatternKey = (pieces) => {
  const s1 = pieces.map((p) => p || "-").join("");
  const s2 = [...pieces].reverse().map((p) => p || "-").join("");
  return s1 < s2 ? s1 : s2;
};
var extractPatternsFromBoard = (board) => {
  const patterns = /* @__PURE__ */ new Map();
  const directions = [[0, 1], [1, 0], [1, 1], [1, -1]];
  for (let r = 0; r < BOARD_SIZE; r++) {
    for (let c = 0; c < BOARD_SIZE; c++) {
      for (const [dr, dc] of directions) {
        if (r + 4 * dr < 0 || r + 4 * dr >= BOARD_SIZE || c + 4 * dc < 0 || c + 4 * dc >= BOARD_SIZE) {
          continue;
        }
        const window2 = [];
        for (let i = 0; i < 5; i++) {
          window2.push(board[r + i * dr][c + i * dc]);
        }
        const xCount = window2.filter((p) => p === PLAYER_X).length;
        const oCount = window2.filter((p) => p === PLAYER_O).length;
        if (xCount > 0 && oCount > 0) {
          continue;
        }
        if (xCount >= 2) {
          const key = getCanonicalPatternKey(window2);
          patterns.set(key, PLAYER_X);
        } else if (oCount >= 2) {
          const key = getCanonicalPatternKey(window2);
          patterns.set(key, PLAYER_O);
        }
      }
    }
  }
  return patterns;
};
var boardToKey = (board) => {
  return board.map((row) => row.map((cell) => cell || "-").join("")).join("|");
};
var flipBoard = (board) => {
  return board.map((row) => [...row].reverse());
};
var rotateBoard = (board) => {
  const newBoard = createInitialBoard();
  for (let r = 0; r < BOARD_SIZE; r++) {
    for (let c = 0; c < BOARD_SIZE; c++) {
      newBoard[c][BOARD_SIZE - 1 - r] = board[r][c];
    }
  }
  return newBoard;
};
var getCanonicalBoardKey = (board) => {
  const symmetries = [];
  let currentBoard = board;
  for (let i = 0; i < 4; i++) {
    symmetries.push(boardToKey(currentBoard));
    symmetries.push(boardToKey(flipBoard(currentBoard)));
    currentBoard = rotateBoard(currentBoard);
  }
  return symmetries.sort()[0];
};
var INITIAL_SCORES = {
  ["pvc" /* PvC */]: { [PLAYER_X]: 0, [PLAYER_O]: 0 },
  ["pvp" /* PvP */]: { [PLAYER_X]: 0, [PLAYER_O]: 0 },
  ["online" /* Online */]: { [PLAYER_X]: 0, [PLAYER_O]: 0 }
};
var CAZ_CONNECT_GAME_SLOTS_KEY = "cazConnectGameSlots";
var CAZ_CONNECT_LAST_ACTIVE_MODE_KEY = "cazConnectLastActiveMode";
var CAZ_CONNECT_LEGACY_GAME_STATE_KEY = "cazConnectGameState";
var GAMEPAD_AXIS_THRESHOLD = 0.5;
var GAMEPAD_INPUT_DELAY = 150;
var useGameLogic = () => {
  const isInitialMount = useRef(true);
  const isSwitchingMode = useRef(false);
  const [initialConfig] = useState(() => {
    try {
      const legacyStateJSON = localStorage.getItem(CAZ_CONNECT_LEGACY_GAME_STATE_KEY);
      if (legacyStateJSON) {
        const legacyState = JSON.parse(legacyStateJSON);
        if (legacyState && legacyState.board && legacyState.gameMode) {
          const { gameMode: gameMode2, ...gameState } = legacyState;
          const newSlots = { [gameMode2]: gameState };
          localStorage.setItem(CAZ_CONNECT_GAME_SLOTS_KEY, JSON.stringify(newSlots));
          localStorage.setItem(CAZ_CONNECT_LAST_ACTIVE_MODE_KEY, gameMode2);
          localStorage.removeItem(CAZ_CONNECT_LEGACY_GAME_STATE_KEY);
        }
      }
    } catch (e) {
      console.error("Legacy game state migration failed", e);
      localStorage.removeItem(CAZ_CONNECT_LEGACY_GAME_STATE_KEY);
    }
    const lastMode = localStorage.getItem(CAZ_CONNECT_LAST_ACTIVE_MODE_KEY) || "pvc" /* PvC */;
    const allSlotsJSON = localStorage.getItem(CAZ_CONNECT_GAME_SLOTS_KEY);
    const allSlots = allSlotsJSON ? JSON.parse(allSlotsJSON) : {};
    const stateForLastMode = allSlots[lastMode];
    return { initialMode: lastMode, initialGameState: stateForLastMode };
  });
  const [gameMode, setGameMode] = useState(initialConfig.initialMode);
  const [board, setBoard] = useState(initialConfig.initialGameState?.board || createInitialBoard());
  const [currentPlayer, setCurrentPlayer] = useState(initialConfig.initialGameState?.currentPlayer || PLAYER_X);
  const [nextStarter, setNextStarter] = useState(initialConfig.initialGameState?.nextStarter || PLAYER_O);
  const [movesMade, setMovesMade] = useState(initialConfig.initialGameState?.movesMade || 0);
  const [gameOver, setGameOver] = useState(initialConfig.initialGameState?.gameOver || false);
  const [winInfo, setWinInfo] = useState(initialConfig.initialGameState?.winInfo || null);
  const [lastMove, setLastMove] = useState(initialConfig.initialGameState?.lastMove || null);
  const [scores, setScores] = useState(() => {
    try {
      const savedScores = localStorage.getItem("cazConnectScores");
      return savedScores ? JSON.parse(savedScores) : INITIAL_SCORES;
    } catch {
      return INITIAL_SCORES;
    }
  });
  const [isThinking, setIsThinking] = useState(false);
  const [moveHistory, setMoveHistory] = useState(initialConfig.initialGameState?.moveHistory || []);
  const [gameMemory, setGameMemory] = useState({ patterns: {}, losingMoves: {} });
  const gameLongAiCacheRef = useRef(/* @__PURE__ */ new Map());
  const [invalidMove, setInvalidMove] = useState(null);
  const [animationInfo, setAnimationInfo] = useState(null);
  const isSimulatingRef = useRef(false);
  const [simulationStatus, setSimulationStatus] = useState("");
  const [deferredInstallPrompt, setDeferredInstallPrompt] = useState(null);
  const [isInstallPromptVisible, setIsInstallPromptVisible] = useState(false);
  const [isHapticEnabled, setIsHapticEnabled] = useState(() => {
    try {
      return localStorage.getItem("cazConnectHapticEnabled") !== "false";
    } catch {
      return true;
    }
  });
  const [isScreenShakeEnabled, setIsScreenShakeEnabled] = useState(() => {
    try {
      return localStorage.getItem("cazConnectScreenShakeEnabled") === "true";
    } catch {
      return false;
    }
  });
  const [isMuted, setIsMuted] = useState(() => {
    try {
      return localStorage.getItem("cazConnectMuted") === "true";
    } catch {
      return false;
    }
  });
  const [isAnimationEnabled, setIsAnimationEnabled] = useState(() => {
    try {
      return localStorage.getItem("cazConnectAnimationEnabled") !== "false";
    } catch {
      return true;
    }
  });
  const [theme, setTheme] = useState(() => {
    try {
      const savedTheme = localStorage.getItem("cazConnectTheme");
      return savedTheme === "science" || savedTheme === "space" ? savedTheme : "space";
    } catch {
      return "space";
    }
  });
  const [showRulesModal, setShowRulesModal] = useState(false);
  const [showUnlockModal, setShowUnlockModal] = useState(false);
  const [showGameOverModal, setShowGameOverModal] = useState(false);
  const [showPlayerStatsModal, setShowPlayerStatsModal] = useState(false);
  const [highlightedPath, setHighlightedPath] = useState([]);
  const [isShaking, setIsShaking] = useState(false);
  const [confirmAction, setConfirmAction] = useState(null);
  const [mascotMessage, setMascotMessage] = useState("");
  const mascotMessageTimer = useRef(null);
  const [isGamepadConnected, setIsGamepadConnected] = useState(false);
  const [gamepadCursor, setGamepadCursor] = useState({ r: 3, c: 3 });
  const [gamepadFocus, setGamepadFocus] = useState("board");
  const [isDifficultySelectOpen, setIsDifficultySelectOpen] = useState(false);
  const gameLoopRef = useRef();
  const buttonPressStateRef = useRef({});
  const lastGamepadInputTimeRef = useRef(0);
  const [virtualKeyboardState, setVirtualKeyboardState] = useState({
    isOpen: false,
    targetId: null,
    initialValue: "",
    onConfirm: (value) => {
    }
  });
  const [adaptiveLevel, setAdaptiveLevel] = useState(() => {
    try {
      const saved = localStorage.getItem("cazConnectAdaptiveLevel");
      return saved ? parseInt(saved, 10) : 0;
    } catch {
      return 0;
    }
  });
  const [autoAdjustLevel, setAutoAdjustLevel] = useState(() => {
    try {
      return localStorage.getItem("cazConnectAutoAdjust") !== "false";
    } catch {
      return true;
    }
  });
  const [isLabUnlocked, setIsLabUnlocked] = useState(false);
  const [isAiLearningEnabled, setIsAiLearningEnabled] = useState(() => {
    try {
      return localStorage.getItem("cazConnectAiLearningEnabled") !== "false";
    } catch {
      return true;
    }
  });
  const [levelChange, setLevelChange] = useState(null);
  const muteToggleTimestamps = useRef([]);
  const [performancePoints, setPerformancePoints] = useState(() => {
    try {
      const saved = localStorage.getItem("cazConnectPerformancePoints");
      return saved ? parseFloat(saved) : 0;
    } catch {
      return 0;
    }
  });
  const [aiStats, setAiStats] = useState(() => {
    try {
      const saved = localStorage.getItem("cazConnectAiStats");
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });
  const [detailedStats, setDetailedStats] = useState(() => {
    try {
      const saved = localStorage.getItem("cazConnectDetailedStats");
      const parsed = saved ? JSON.parse(saved) : {};
      return {
        maxWinStreak: 0,
        currentWinStreak: 0,
        totalMoves: 0,
        totalGamesVsAi: 0,
        openingMoves: {},
        levelsBeaten: [],
        ...parsed
      };
    } catch {
      return { maxWinStreak: 0, currentWinStreak: 0, totalMoves: 0, totalGamesVsAi: 0, openingMoves: {}, levelsBeaten: [] };
    }
  });
  const [unlockedAchievements, setUnlockedAchievements] = useState(() => {
    try {
      const saved = localStorage.getItem("cazConnectAchievements");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [playerName, setPlayerNameInternal] = useState(() => {
    try {
      return localStorage.getItem("cazConnectPlayerName") || "Player";
    } catch {
      return "Player";
    }
  });
  const [playerPiece, setPlayerPieceInternal] = useState(() => {
    try {
      const savedPiece = localStorage.getItem("cazConnectPlayerPiece");
      return savedPiece !== null ? savedPiece : "X";
    } catch {
      return "X";
    }
  });
  const [playerOName, setPlayerONameInternal] = useState(() => {
    try {
      return localStorage.getItem("cazConnectPlayerOName") || "Player O";
    } catch {
      return "Player O";
    }
  });
  const [playerOPiece, setPlayerOPieceInternal] = useState(() => {
    try {
      const savedPiece = localStorage.getItem("cazConnectPlayerOPiece");
      return savedPiece !== null ? savedPiece : "O";
    } catch {
      return "O";
    }
  });
  const [onlineRole, setOnlineRoleInternal] = useState(null);
  const [tutorialState, setTutorialState] = useState({ active: false, step: -1 });
  const isForfeitable = useMemo(() => {
    if (gameOver) return false;
    if (gameMode === "pvc" /* PvC */) {
      return moveHistory.some((move) => move.player === HUMAN_PLAYER);
    }
    return movesMade > 0;
  }, [gameOver, gameMode, moveHistory, movesMade]);
  const grantAchievement = useCallback((id) => {
    setUnlockedAchievements((prev) => {
      if (prev.includes(id)) {
        return prev;
      }
      console.log(`Achievement Unlocked: ${id}`);
      return [...prev, id];
    });
  }, []);
  useEffect(() => {
    try {
      const rulesViewed = localStorage.getItem("cazConnectRulesViewed");
      if (!rulesViewed) {
        setShowRulesModal(true);
      }
    } catch (e) {
      console.error("Could not access localStorage", e);
      setShowRulesModal(true);
    }
  }, []);
  useEffect(() => {
    if (isInitialMount.current || tutorialState.active || isSwitchingMode.current) {
      return;
    }
    const gameStateToSave = {
      board,
      currentPlayer,
      nextStarter,
      movesMade,
      gameOver,
      winInfo,
      lastMove,
      moveHistory
    };
    try {
      const allSlotsJSON = localStorage.getItem(CAZ_CONNECT_GAME_SLOTS_KEY);
      const allSlots = allSlotsJSON ? JSON.parse(allSlotsJSON) : {};
      allSlots[gameMode] = gameStateToSave;
      localStorage.setItem(CAZ_CONNECT_GAME_SLOTS_KEY, JSON.stringify(allSlots));
      localStorage.setItem(CAZ_CONNECT_LAST_ACTIVE_MODE_KEY, gameMode);
    } catch (error) {
      console.error("Failed to save game state to localStorage", error);
    }
  }, [board, currentPlayer, nextStarter, movesMade, gameOver, winInfo, lastMove, moveHistory, tutorialState.active, gameMode]);
  useEffect(() => {
    try {
      localStorage.setItem("cazConnectScores", JSON.stringify(scores));
    } catch (error) {
      console.error("Failed to save scores to localStorage", error);
    }
  }, [scores]);
  useEffect(() => {
    try {
      localStorage.setItem("cazConnectTheme", theme);
    } catch (error) {
      console.error("Failed to save theme to localStorage", error);
    }
  }, [theme]);
  useEffect(() => {
    try {
      localStorage.setItem("cazConnectHapticEnabled", String(isHapticEnabled));
    } catch (e) {
      console.error("Failed to save haptic preference", e);
    }
  }, [isHapticEnabled]);
  useEffect(() => {
    try {
      localStorage.setItem("cazConnectScreenShakeEnabled", String(isScreenShakeEnabled));
    } catch (e) {
      console.error("Failed to save screen shake preference", e);
    }
  }, [isScreenShakeEnabled]);
  useEffect(() => {
    try {
      localStorage.setItem("cazConnectAdaptiveLevel", String(adaptiveLevel));
    } catch (e) {
      console.error("Failed to save adaptive level", e);
    }
  }, [adaptiveLevel]);
  useEffect(() => {
    try {
      localStorage.setItem("cazConnectAutoAdjust", String(autoAdjustLevel));
    } catch (e) {
      console.error("Failed to save auto-adjust preference", e);
    }
  }, [autoAdjustLevel]);
  useEffect(() => {
    try {
      localStorage.setItem("cazConnectAiLearningEnabled", String(isAiLearningEnabled));
    } catch (e) {
      console.error("Failed to save AI learning preference", e);
    }
  }, [isAiLearningEnabled]);
  useEffect(() => {
    try {
      localStorage.setItem("cazConnectPerformancePoints", String(performancePoints));
    } catch (e) {
      console.error("Failed to save performance points", e);
    }
  }, [performancePoints]);
  useEffect(() => {
    try {
      localStorage.setItem("cazConnectAiStats", JSON.stringify(aiStats));
    } catch (e) {
      console.error("Failed to save AI stats", e);
    }
  }, [aiStats]);
  useEffect(() => {
    try {
      localStorage.setItem("cazConnectDetailedStats", JSON.stringify(detailedStats));
    } catch (e) {
      console.error("Failed to save detailed stats", e);
    }
  }, [detailedStats]);
  useEffect(() => {
    try {
      localStorage.setItem("cazConnectAchievements", JSON.stringify(unlockedAchievements));
    } catch (e) {
      console.error("Failed to save achievements", e);
    }
  }, [unlockedAchievements]);
  useEffect(() => {
    try {
      localStorage.setItem("cazConnectPlayerName", playerName);
    } catch (error) {
      console.error("Failed to save player name to localStorage", error);
    }
  }, [playerName]);
  useEffect(() => {
    try {
      localStorage.setItem("cazConnectPlayerPiece", playerPiece);
    } catch (error) {
      console.error("Failed to save player piece to localStorage", error);
    }
  }, [playerPiece]);
  useEffect(() => {
    try {
      localStorage.setItem("cazConnectPlayerOName", playerOName);
    } catch (e) {
      console.error("Failed to save player O name to localStorage", e);
    }
  }, [playerOName]);
  useEffect(() => {
    try {
      localStorage.setItem("cazConnectPlayerOPiece", playerOPiece);
    } catch (e) {
      console.error("Failed to save player O piece to localStorage", e);
    }
  }, [playerOPiece]);
  useEffect(() => {
    if (!unlockedAchievements.includes("CUSTOMIZED_PROFILE")) {
      if (playerName !== "Player" && playerPiece !== "X") {
        grantAchievement("CUSTOMIZED_PROFILE");
      }
    }
  }, [playerName, playerPiece, unlockedAchievements, grantAchievement]);
  useEffect(() => {
    if (!unlockedAchievements.includes("GRAND_TOUR")) {
      const requiredLevels = [0, 1, 2, 3, 4, 5];
      if (requiredLevels.every((level) => detailedStats.levelsBeaten.includes(level))) {
        grantAchievement("GRAND_TOUR");
      }
    }
  }, [detailedStats.levelsBeaten, unlockedAchievements, grantAchievement]);
  const placeSound = useRef(null);
  const winSound = useRef(null);
  const badMoveSound = useRef(null);
  useEffect(() => {
    placeSound.current = new Audio("./place.mp3");
    winSound.current = new Audio("./win.mp3");
    badMoveSound.current = new Audio("./badmove.mp3");
  }, []);
  const playSound = useCallback((soundType) => {
    const gamepad = isGamepadConnected ? navigator.getGamepads()[0] : null;
    if (gamepad?.vibrationActuator && isHapticEnabled) {
      let duration = 50, weak = 0.2, strong = 0.2;
      switch (soundType) {
        case "place":
          duration = 50;
          weak = 0.8;
          strong = 0;
          break;
        case "win":
          duration = 300;
          weak = 0.5;
          strong = 1;
          break;
        case "badmove":
          duration = 150;
          weak = 0;
          strong = 0.8;
          break;
        case "uiclick":
          duration = 20;
          weak = 0.5;
          strong = 0;
          break;
      }
      gamepad.vibrationActuator.playEffect("dual-rumble", {
        startDelay: 0,
        duration,
        weakMagnitude: weak,
        strongMagnitude: strong
      }).catch((e) => console.error("Vibration failed", e));
    } else if (isHapticEnabled && "vibrate" in navigator) {
      switch (soundType) {
        case "place":
          navigator.vibrate(20);
          break;
        case "win":
          navigator.vibrate([100, 50, 100]);
          break;
        case "badmove":
          navigator.vibrate([75, 75]);
          break;
        case "uiclick":
          navigator.vibrate(5);
          break;
      }
    }
    if (isMuted) return;
    let sound = null;
    let volume = 1;
    switch (soundType) {
      case "place":
        sound = placeSound.current;
        break;
      case "win":
        sound = winSound.current;
        break;
      case "badmove":
        sound = badMoveSound.current;
        break;
      case "uiclick":
        sound = placeSound.current;
        volume = 0.5;
        break;
    }
    if (sound) {
      sound.currentTime = 0;
      sound.volume = volume;
      sound.play().catch((e) => console.error(`Error playing ${soundType}-sound:`, e));
    }
  }, [isMuted, isHapticEnabled, isGamepadConnected]);
  const toggleMute = useCallback(() => {
    playSound("uiclick");
    if (!isLabUnlocked) {
      const now = Date.now();
      muteToggleTimestamps.current.push(now);
      muteToggleTimestamps.current = muteToggleTimestamps.current.filter(
        (timestamp) => now - timestamp < 5e3
      );
      if (muteToggleTimestamps.current.length >= 8) {
        setIsLabUnlocked(true);
        setShowUnlockModal(true);
        muteToggleTimestamps.current = [];
        grantAchievement("LAB_UNLOCKED");
      }
    }
    setIsMuted((prevMuted) => {
      const newMuted = !prevMuted;
      try {
        localStorage.setItem("cazConnectMuted", String(newMuted));
      } catch (error) {
        console.error("Failed to save mute state to localStorage", error);
      }
      return newMuted;
    });
  }, [isLabUnlocked, grantAchievement, playSound]);
  const toggleAnimationEnabled = useCallback(() => {
    playSound("uiclick");
    setIsAnimationEnabled((prev) => {
      const newValue = !prev;
      try {
        localStorage.setItem("cazConnectAnimationEnabled", String(newValue));
      } catch (error) {
        console.error("Failed to save animation preference to localStorage", error);
      }
      return newValue;
    });
  }, [playSound]);
  const toggleScreenShakeEnabled = useCallback(() => {
    playSound("uiclick");
    setIsScreenShakeEnabled((prev) => {
      const newValue = !prev;
      try {
        localStorage.setItem("cazConnectScreenShakeEnabled", String(newValue));
      } catch (error) {
        console.error("Failed to save screen shake preference to localStorage", error);
      }
      return newValue;
    });
  }, [playSound]);
  const toggleTheme = useCallback(() => {
    playSound("uiclick");
    setTheme((prevTheme) => prevTheme === "science" ? "space" : "science");
  }, [playSound]);
  const toggleHapticEnabled = useCallback(() => {
    playSound("uiclick");
    setIsHapticEnabled((prev) => {
      const newValue = !prev;
      try {
        localStorage.setItem("cazConnectHapticEnabled", String(newValue));
      } catch (error) {
        console.error("Failed to save haptic preference to localStorage", error);
      }
      return newValue;
    });
  }, [playSound]);
  const toggleIsAiLearningEnabled = useCallback(() => {
    playSound("uiclick");
    setIsAiLearningEnabled((prev) => !prev);
  }, [playSound]);
  const openRulesModal = useCallback(() => {
    playSound("uiclick");
    setShowRulesModal(true);
  }, [playSound]);
  const closeRulesModal = useCallback(() => {
    playSound("uiclick");
    setShowRulesModal(false);
    try {
      localStorage.setItem("cazConnectRulesViewed", "true");
    } catch (e) {
      console.error("Could not save to localStorage", e);
    }
  }, [playSound]);
  const dismissUnlockModal = useCallback(() => {
    playSound("uiclick");
    setShowUnlockModal(false);
  }, [playSound]);
  const dismissGameOverModal = useCallback(() => {
    playSound("uiclick");
    setShowGameOverModal(false);
    setLevelChange(null);
  }, [playSound]);
  const cancelConfirmAction = useCallback(() => {
    playSound("uiclick");
    setConfirmAction(null);
  }, [playSound]);
  const openVirtualKeyboard = useCallback((targetId, initialValue, onConfirm) => {
    setGamepadFocus("vk-focused");
    setVirtualKeyboardState({ isOpen: true, targetId, initialValue, onConfirm });
  }, []);
  const closeVirtualKeyboard = useCallback(() => {
    setGamepadFocus(virtualKeyboardState.targetId);
    setVirtualKeyboardState((prevState) => ({ ...prevState, isOpen: false, targetId: null, initialValue: "", onConfirm: () => {
    } }));
  }, [virtualKeyboardState.targetId]);
  const setPlayerName = useCallback((name) => {
    const trimmedName = name.trim();
    setPlayerNameInternal(trimmedName ? trimmedName.slice(0, 15) : "Player");
  }, []);
  const setPlayerPiece = useCallback((piece) => {
    const trimmedPiece = piece.trim();
    setPlayerPieceInternal(trimmedPiece ? trimmedPiece.slice(0, 2) : "X");
  }, []);
  const setPlayerOName = useCallback((name) => {
    const trimmedName = name.trim();
    setPlayerONameInternal(trimmedName ? trimmedName.slice(0, 15) : "Player O");
  }, []);
  const setPlayerOPiece = useCallback((piece) => {
    const trimmedPiece = piece.trim();
    setPlayerOPieceInternal(trimmedPiece ? trimmedPiece.slice(0, 2) : "O");
  }, []);
  useEffect(() => {
    const handler = (e) => {
      e.preventDefault();
      setDeferredInstallPrompt(e);
    };
    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);
  const showInstallPrompt = () => {
    if (deferredInstallPrompt && !window.matchMedia("(display-mode: standalone)").matches) {
      setIsInstallPromptVisible(true);
    }
  };
  const dismissInstallPrompt = useCallback(() => {
    playSound("uiclick");
    setIsInstallPromptVisible(false);
  }, [playSound]);
  const triggerInstallPrompt = useCallback(() => {
    if (deferredInstallPrompt) {
      playSound("uiclick");
      deferredInstallPrompt.prompt();
      deferredInstallPrompt.userChoice.then(() => {
        setDeferredInstallPrompt(null);
        setIsInstallPromptVisible(false);
      });
    }
  }, [deferredInstallPrompt, playSound]);
  const getRandomMascotMessage = useCallback((category) => {
    const sharedMessages = THEME_AWARE_MASCOT_MESSAGES.shared[category] || [];
    const themeMessages = theme === "space" ? THEME_AWARE_MASCOT_MESSAGES.space[category] || [] : [];
    const allMessages = [...sharedMessages, ...themeMessages];
    if (allMessages.length === 0) return "";
    return allMessages[Math.floor(Math.random() * allMessages.length)];
  }, [theme]);
  const setMascotMessageWithTimeout = useCallback((message, duration = 4e3) => {
    if (mascotMessageTimer.current) {
      clearTimeout(mascotMessageTimer.current);
    }
    setMascotMessage(message);
    mascotMessageTimer.current = window.setTimeout(() => {
      setMascotMessage("");
    }, duration);
  }, []);
  const analyzeMoveForMascot = useCallback((move, boardAfterMove, playerWhoMoved) => {
    const opponent = playerWhoMoved === PLAYER_X ? PLAYER_O : PLAYER_X;
    const boardBeforeMove = boardAfterMove.map((row) => [...row]);
    boardBeforeMove[move.r][move.c] = null;
    const directions = [[0, 1], [1, 0], [1, 1], [1, -1]];
    for (const [dr, dc] of directions) {
      for (let i = -3; i <= 0; i++) {
        const window2 = [];
        const rStart = move.r + i * dr;
        const cStart = move.c + i * dc;
        let isValidWindow = true;
        for (let j = 0; j < 4; j++) {
          const r = rStart + j * dr;
          const c = cStart + j * dc;
          if (r < 0 || r >= BOARD_SIZE || c < 0 || c >= BOARD_SIZE) {
            isValidWindow = false;
            break;
          }
          if (r === move.r && c === move.c) {
            window2.push(null);
          } else {
            window2.push(boardBeforeMove[r][c]);
          }
        }
        if (!isValidWindow) continue;
        const opponentCount = window2.filter((p) => p === opponent).length;
        const emptyCount = window2.filter((p) => p === null).length;
        if (opponentCount === 3 && emptyCount === 1) {
          return getRandomMascotMessage(playerWhoMoved === HUMAN_PLAYER ? "playerBlocksThreat" : "aiBlocksThreat");
        }
      }
    }
    for (const [dr, dc] of directions) {
      for (let i = -3; i <= 0; i++) {
        const window2 = [];
        const rStart = move.r + i * dr;
        const cStart = move.c + i * dc;
        let isValidWindow = true;
        for (let j = 0; j < 4; j++) {
          const r = rStart + j * dr;
          const c = cStart + j * dc;
          if (r < 0 || r >= BOARD_SIZE || c < 0 || c >= BOARD_SIZE) {
            isValidWindow = false;
            break;
          }
          window2.push(boardAfterMove[r][c]);
        }
        if (!isValidWindow) continue;
        const playerCount = window2.filter((p) => p === playerWhoMoved).length;
        const emptyCount = window2.filter((p) => p === null).length;
        if (playerCount === 3 && emptyCount === 1) {
          return getRandomMascotMessage(playerWhoMoved === HUMAN_PLAYER ? "playerCreatesThreat" : "aiCreatesThreat");
        }
      }
    }
    return null;
  }, [getRandomMascotMessage]);
  useEffect(() => {
    const loadMemory = async () => {
      try {
        const savedMemory = localStorage.getItem("cazConnectMemory");
        if (savedMemory) {
          const parsedMemory = JSON.parse(savedMemory);
          if (parsedMemory && parsedMemory.patterns) {
            setGameMemory(parsedMemory);
            return;
          }
        }
      } catch (error) {
        console.error("Failed to load memory from localStorage, loading default.", error);
      }
      try {
        const response = await fetch("./default-brain.json");
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const defaultBrain = await response.json();
        if (defaultBrain && defaultBrain.patterns) {
          setGameMemory(defaultBrain);
          localStorage.setItem("cazConnectMemory", JSON.stringify(defaultBrain));
        } else {
          console.error("Default brain file has invalid format.");
        }
      } catch (error) {
        console.error("Failed to fetch or parse default AI brain:", error);
      }
    };
    loadMemory();
  }, []);
  const masterReset = useCallback((startPlayer) => {
    setBoard(createInitialBoard());
    setCurrentPlayer(startPlayer);
    setMovesMade(0);
    setGameOver(false);
    setWinInfo(null);
    setLastMove(null);
    setMoveHistory([]);
    setIsInstallPromptVisible(false);
    setIsThinking(false);
    setAnimationInfo(null);
    setShowGameOverModal(false);
    setLevelChange(null);
    gameLongAiCacheRef.current.clear();
    if (gameMode === "pvc" /* PvC */) {
      setMascotMessageWithTimeout(getRandomMascotMessage("gameStart"));
    }
  }, [gameMode, setMascotMessageWithTimeout, getRandomMascotMessage]);
  const _startNewGame = useCallback(() => {
    playSound("uiclick");
    masterReset(nextStarter);
    setNextStarter((s) => s === PLAYER_X ? PLAYER_O : PLAYER_X);
  }, [nextStarter, masterReset, playSound]);
  const validMoves = useMemo(() => getValidMoves(board, movesMade), [board, movesMade]);
  const recordGameResult = useCallback((history, winner) => {
    if (gameMode === "pvc" /* PvC */) {
      setAiStats((prevStats) => {
        const newStats = JSON.parse(JSON.stringify(prevStats));
        const levelStat = newStats[adaptiveLevel] || { wins: 0, losses: 0 };
        if (winner === HUMAN_PLAYER) {
          levelStat.wins += 1;
        } else if (winner === AI_PLAYER) {
          levelStat.losses += 1;
        }
        newStats[adaptiveLevel] = levelStat;
        return newStats;
      });
      setDetailedStats((prev) => {
        let newCurrentWinStreak = prev.currentWinStreak || 0;
        if (winner === HUMAN_PLAYER) {
          newCurrentWinStreak++;
        } else {
          newCurrentWinStreak = 0;
        }
        if (newCurrentWinStreak >= 5 && adaptiveLevel >= 2) {
          grantAchievement("WIN_STREAK_5");
        }
        const newStats = { ...prev };
        if (!newStats.levelsBeaten) newStats.levelsBeaten = [];
        newStats.totalGamesVsAi += 1;
        newStats.totalMoves += history.length;
        newStats.currentWinStreak = newCurrentWinStreak;
        newStats.maxWinStreak = Math.max(prev.maxWinStreak, newCurrentWinStreak);
        if (winner === HUMAN_PLAYER) {
          if (!newStats.levelsBeaten.includes(adaptiveLevel)) {
            newStats.levelsBeaten.push(adaptiveLevel);
          }
        }
        return newStats;
      });
      if (winner === HUMAN_PLAYER) {
        grantAchievement("FIRST_WIN");
        if (winInfo && winInfo.some((line) => line.length >= 6) && adaptiveLevel >= 2) {
          grantAchievement("GRAVITY_MASTER");
        }
        if (adaptiveLevel === 5) {
          grantAchievement("BEAT_GRAND_MASTER");
        }
        if (history.length >= 40) {
          grantAchievement("LONG_GAME");
        }
      }
      if (autoAdjustLevel) {
        setPerformancePoints((prevPoints) => {
          const PROMOTION_THRESHOLD = 2.5;
          const DEMOTION_THRESHOLD = -2.5;
          const QUICK_GAME_MOVES = 20;
          const LONG_GAME_MOVES = 35;
          let score = 0;
          if (winner === HUMAN_PLAYER) {
            score = 1;
          } else if (winner === AI_PLAYER) {
            score = -1;
          }
          if (score !== 0) {
            const gameLength = history.length;
            if (gameLength < QUICK_GAME_MOVES) {
              score *= 1.5;
            } else if (gameLength > LONG_GAME_MOVES) {
              score *= 0.75;
            }
          }
          const newPoints = prevPoints + score;
          if (newPoints >= PROMOTION_THRESHOLD) {
            setAdaptiveLevel((l) => {
              const newLevel = Math.min(l + 1, AI_LEVELS.length - 1);
              if (newLevel > l) setLevelChange("promoted");
              return newLevel;
            });
            return 0;
          } else if (newPoints <= DEMOTION_THRESHOLD) {
            setAdaptiveLevel((l) => {
              const newLevel = Math.max(l - 1, 0);
              if (newLevel < l) setLevelChange("demoted");
              return newLevel;
            });
            return 0;
          } else {
            return newPoints;
          }
        });
      }
    }
    if (adaptiveLevel >= 4 && isAiLearningEnabled) {
      if (winner !== null) {
        setGameMemory((prevMemory) => {
          const newMemory = {
            patterns: { ...prevMemory.patterns },
            losingMoves: prevMemory.losingMoves ? { ...prevMemory.losingMoves } : {}
          };
          const LOOKBACK_STEPS = 3;
          const BASE_LEARNING_RATE = 1;
          const LEARNING_RATE_DECAY = 0.5;
          let tempHistory = [...history];
          for (let i = 0; i < LOOKBACK_STEPS; i++) {
            if (tempHistory.length === 0) break;
            const tempBoard = createInitialBoard();
            tempHistory.forEach((move) => {
              tempBoard[move.r][move.c] = move.player;
            });
            const learningRate = BASE_LEARNING_RATE * Math.pow(LEARNING_RATE_DECAY, i);
            const patternsOnBoard = extractPatternsFromBoard(tempBoard);
            patternsOnBoard.forEach((p, key) => {
              if (p === winner) {
                newMemory.patterns[key] = (newMemory.patterns[key] || 0) + learningRate;
              } else {
                newMemory.patterns[key] = (newMemory.patterns[key] || 0) - learningRate;
              }
            });
            if (tempHistory.length > 0) tempHistory.pop();
            if (tempHistory.length > 0) tempHistory.pop();
          }
          if (winner === HUMAN_PLAYER) {
            const LOOKBACK_MOVES = 4;
            let aiMovesFound = 0;
            const gameHistory = [...history];
            for (let i = gameHistory.length - 1; i >= 0 && aiMovesFound < LOOKBACK_MOVES; i--) {
              const move = gameHistory[i];
              if (move.player === AI_PLAYER) {
                const boardStateBeforeMove = createInitialBoard();
                for (let j = 0; j < i; j++) {
                  const pastMove = gameHistory[j];
                  boardStateBeforeMove[pastMove.r][pastMove.c] = pastMove.player;
                }
                const boardKey = getCanonicalBoardKey(boardStateBeforeMove);
                newMemory.losingMoves[boardKey] = { r: move.r, c: move.c };
                aiMovesFound++;
              }
            }
          }
          try {
            localStorage.setItem("cazConnectMemory", JSON.stringify(newMemory));
          } catch (error) {
            console.error("Failed to save AI memory to localStorage", error);
          }
          return newMemory;
        });
      }
    }
  }, [gameMode, adaptiveLevel, autoAdjustLevel, isAiLearningEnabled, grantAchievement, winInfo]);
  const getAnimationSource = useCallback((r, c, currentBoard, currentMovesMade) => {
    if (currentMovesMade === 0 || isOnWall(r, c)) {
      return { r, c };
    }
    const directions = [[-1, 0], [1, 0], [0, -1], [0, 1]];
    for (const [dr, dc] of directions) {
      let pathIsGood = true;
      let hasPiece = false;
      let cr = r + dr;
      let cc = c + dc;
      while (cr >= 0 && cr < BOARD_SIZE && cc >= 0 && cc < BOARD_SIZE) {
        if (currentBoard[cr][cc]) {
          hasPiece = true;
        } else {
          pathIsGood = false;
          break;
        }
        cr += dr;
        cc += dc;
      }
      if (hasPiece && pathIsGood) {
        return { r: cr - dr, c: cc - dc };
      }
    }
    return { r, c };
  }, []);
  const [savedGameState, setSavedGameState] = useState(null);
  const executedTutorialStep = useRef(-1);
  const advanceTutorial = useCallback(() => {
    playSound("uiclick");
    setTutorialState((prevState) => ({ ...prevState, step: prevState.step + 1 }));
  }, [playSound]);
  const makeMove = useCallback((r, c) => {
    if (gameOver || board[r][c]) return;
    if (movesMade === 0 && gameMode === "pvc" /* PvC */) {
      setDetailedStats((prev) => {
        const moveKey = `R${r}, C${c}`;
        const newOpeningMoves = { ...prev.openingMoves };
        newOpeningMoves[moveKey] = (newOpeningMoves[moveKey] || 0) + 1;
        return { ...prev, openingMoves: newOpeningMoves };
      });
    }
    const commitMove = () => {
      playSound("place");
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 200);
      const newBoard = board.map((row) => [...row]);
      newBoard[r][c] = currentPlayer;
      setBoard(newBoard);
      const newMoveHistory = [...moveHistory, { player: currentPlayer, r, c }];
      setMoveHistory(newMoveHistory);
      setLastMove({ r, c });
      const newMovesMade = movesMade + 1;
      setMovesMade(newMovesMade);
      setAnimationInfo(null);
      const winnerInfo = checkWin(currentPlayer, newBoard);
      const mascotContextMessage = gameMode === "pvc" /* PvC */ && !winnerInfo ? analyzeMoveForMascot({ r, c }, newBoard, currentPlayer) : null;
      if (winnerInfo) {
        setWinInfo(winnerInfo);
        setGameOver(true);
        if (gameMode === "pvc" /* PvC */) {
          const winner = newBoard[winnerInfo[0][0].r][winnerInfo[0][0].c];
          const message = winner === HUMAN_PLAYER ? getRandomMascotMessage("playerWins") : getRandomMascotMessage("aiWins");
          setMascotMessageWithTimeout(message, 6e3);
        }
        if (!tutorialState.active) {
          setTimeout(() => setShowGameOverModal(true), 1500);
        }
        if (tutorialState.active && currentPlayer === HUMAN_PLAYER) {
          setTimeout(() => advanceTutorial(), 1e3);
        }
        setScores((prevScores) => {
          const newScores = { ...prevScores };
          newScores[gameMode][currentPlayer]++;
          return newScores;
        });
        playSound("win");
        recordGameResult(newMoveHistory, currentPlayer);
        setTimeout(showInstallPrompt, 1500);
      } else if (getValidMoves(newBoard, newMovesMade).length === 0) {
        setGameOver(true);
        if (gameMode === "pvc" /* PvC */) {
          setMascotMessageWithTimeout(getRandomMascotMessage("draw"), 6e3);
        }
        if (!tutorialState.active) {
          setTimeout(() => setShowGameOverModal(true), 1500);
        }
        recordGameResult(newMoveHistory, null);
        setTimeout(showInstallPrompt, 1500);
      } else {
        if (mascotContextMessage) {
          setMascotMessageWithTimeout(mascotContextMessage);
        }
        setCurrentPlayer((p) => p === PLAYER_X ? PLAYER_O : PLAYER_X);
      }
    };
    if (isAnimationEnabled) {
      const source = getAnimationSource(r, c, board, movesMade);
      setAnimationInfo({ start: source, end: { r, c }, player: currentPlayer });
      const distance = Math.max(Math.abs(source.r - r), Math.abs(source.c - c));
      const animationDuration = 200 + distance * 50;
      setTimeout(commitMove, animationDuration);
    } else {
      commitMove();
    }
  }, [board, currentPlayer, gameOver, movesMade, gameMode, moveHistory, playSound, getAnimationSource, isAnimationEnabled, tutorialState.active, recordGameResult, advanceTutorial, analyzeMoveForMascot, setMascotMessageWithTimeout, getRandomMascotMessage]);
  const justEndedTutorial = useRef(false);
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    if (tutorialState.active) return;
    if (justEndedTutorial.current) {
      justEndedTutorial.current = false;
      return;
    }
    const allSlotsJSON = localStorage.getItem(CAZ_CONNECT_GAME_SLOTS_KEY);
    const allSlots = allSlotsJSON ? JSON.parse(allSlotsJSON) : {};
    const stateForNewMode = allSlots[gameMode];
    if (stateForNewMode) {
      setBoard(stateForNewMode.board);
      setCurrentPlayer(stateForNewMode.currentPlayer);
      setNextStarter(stateForNewMode.nextStarter);
      setMovesMade(stateForNewMode.movesMade);
      setGameOver(stateForNewMode.gameOver);
      setWinInfo(stateForNewMode.winInfo);
      setLastMove(stateForNewMode.lastMove);
      setMoveHistory(stateForNewMode.moveHistory);
    }
    setTimeout(() => {
      isSwitchingMode.current = false;
    }, 0);
  }, [gameMode]);
  const TUTORIAL_CONFIG = useMemo(() => [
    // Step 0
    {
      text: "Welcome to Caz Connect! I'm Professor Caz, and I'll teach you how to play.",
      highlight: null,
      isInteractive: false
    },
    // Step 1
    {
      text: "The goal is simple: connect four of your pieces in a row, just like this.",
      highlight: null,
      isInteractive: false,
      action: () => {
        masterReset(PLAYER_X);
        const winBoard = createInitialBoard();
        winBoard[0][3] = PLAYER_X;
        winBoard[1][3] = PLAYER_X;
        winBoard[2][3] = PLAYER_X;
        winBoard[3][3] = PLAYER_X;
        winBoard[7][4] = PLAYER_O;
        winBoard[6][4] = PLAYER_O;
        winBoard[5][4] = PLAYER_O;
        winBoard[0][1] = PLAYER_X;
        winBoard[7][1] = PLAYER_O;
        setBoard(winBoard);
        setMovesMade(8);
        setWinInfo([[{ r: 0, c: 3 }, { r: 1, c: 3 }, { r: 2, c: 3 }, { r: 3, c: 3 }]]);
        setGameOver(true);
      }
    },
    // Step 2
    {
      text: "Now for the most important rule. Your first move must be on an outer wall, like the highlighted squares.",
      highlight: { type: "border" },
      isInteractive: false,
      action: () => {
        masterReset(PLAYER_X);
      }
    },
    // Step 3
    {
      text: "Your turn! Try placing your 'X' piece on any of the highlighted wall squares.",
      highlight: { type: "border" },
      isInteractive: true,
      advancesOnClick: true
    },
    // Step 4
    {
      text: () => `Excellent! Now watch my move. I'll play somewhere else on the wall.`,
      highlight: null,
      isInteractive: false,
      action: () => {
        setTimeout(() => {
          if (!lastMove) return;
          let aiR = lastMove.r, aiC = lastMove.c;
          if (lastMove.r === 0 || lastMove.r === BOARD_SIZE - 1) {
            aiC = 0;
            aiR = Math.floor(BOARD_SIZE / 2);
          } else {
            aiR = 0;
            aiC = Math.floor(BOARD_SIZE / 2);
          }
          if (isValidMove(aiR, aiC, board, movesMade)) {
            makeMove(aiR, aiC);
          } else {
            const moves = getValidMoves(board, movesMade).filter((m) => m.r !== lastMove.r || m.c !== lastMove.c);
            if (moves.length > 0) makeMove(moves[0].r, moves[0].c);
          }
          setTimeout(() => advanceTutorial(), 1e3);
        }, 500);
      }
    },
    // Step 5 (Enhanced)
    {
      text: "Perfect. Now, the most important rule: 'Gravity Connection'. You can only play on a square if it's connected back to a wall by an unbroken line of pieces. Hover over the board to see these 'Gravity Bridges' in action. Now, make a valid move.",
      highlight: { type: "cells", cells: getValidMoves(board, movesMade) },
      isInteractive: true,
      advancesOnClick: true
    },
    // Step 6
    {
      text: "Aha, a clever move! I see you're trying to build a bridge. I'll have to play nearby to counter.",
      highlight: null,
      isInteractive: false,
      action: () => {
        setTimeout(() => {
          if (!lastMove) return;
          const directions = [[-1, 0], [1, 0], [0, -1], [0, 1], [-1, -1], [-1, 1], [1, -1], [1, 1]];
          let blockMove;
          const adjacentMoves = [];
          for (const [dr, dc] of directions) {
            const r = lastMove.r + dr;
            const c = lastMove.c + dc;
            if (isValidMove(r, c, board, movesMade)) {
              adjacentMoves.push({ r, c });
            }
          }
          if (adjacentMoves.length > 0) {
            blockMove = adjacentMoves[Math.floor(Math.random() * adjacentMoves.length)];
          }
          if (blockMove) {
            makeMove(blockMove.r, blockMove.c);
          } else {
            const moves = getValidMoves(board, movesMade).filter((m) => m.r !== lastMove.r || m.c !== lastMove.c);
            if (moves.length > 0) makeMove(moves[Math.floor(Math.random() * moves.length)].r, moves[Math.floor(Math.random() * moves.length)].c);
          }
          setTimeout(() => advanceTutorial(), 1e3);
        }, 500);
      }
    },
    // Step 7
    {
      text: "Notice the 'Auto-Adjust Level' toggle in the setup panel? If you keep winning, I'll get tougher. If you struggle, I'll ease up. This keeps things fair!",
      highlight: null,
      isInteractive: false
    },
    // Step 8
    {
      text: "Should you prove to be a true master, you might unlock my secret lab... There, you can enable my 'Learning Mode,' where I remember every game we play!",
      highlight: null,
      isInteractive: false
    },
    // Step 9
    {
      text: "Enough talk! Let's finish this game. Your goal is to get four in a row. I'll go easy on you... for now. Your turn!",
      highlight: { type: "cells", cells: getValidMoves(board, movesMade) },
      isInteractive: true
    },
    // Step 10
    {
      text: "Congratulations, you did it! You've won your first game. You're ready to challenge me for real now.",
      highlight: null,
      isInteractive: false
    }
  ], [board, movesMade, lastMove, masterReset, makeMove, advanceTutorial]);
  const startTutorial = () => {
    playSound("uiclick");
    setSavedGameState({
      board,
      currentPlayer,
      nextStarter,
      movesMade,
      gameOver,
      winInfo,
      lastMove,
      moveHistory,
      gameMode
    });
    setGameMode("pvc" /* PvC */);
    masterReset(PLAYER_X);
    setTutorialState({ active: true, step: 0 });
  };
  const endTutorial = useCallback(() => {
    playSound("uiclick");
    grantAchievement("TUTORIAL_COMPLETE");
    setTutorialState({ active: false, step: -1 });
    if (savedGameState) {
      justEndedTutorial.current = true;
      setBoard(savedGameState.board);
      setCurrentPlayer(savedGameState.currentPlayer);
      setNextStarter(savedGameState.nextStarter);
      setMovesMade(savedGameState.movesMade);
      setGameOver(savedGameState.gameOver);
      setWinInfo(savedGameState.winInfo);
      setLastMove(savedGameState.lastMove);
      setMoveHistory(savedGameState.moveHistory);
      setGameMode(savedGameState.gameMode);
      setSavedGameState(null);
    } else {
      _startNewGame();
    }
  }, [savedGameState, _startNewGame, grantAchievement, playSound]);
  useEffect(() => {
    if (!tutorialState.active) {
      executedTutorialStep.current = -1;
      return;
    }
    if (tutorialState.step >= TUTORIAL_CONFIG.length) {
      endTutorial();
      return;
    }
    if (tutorialState.step > executedTutorialStep.current) {
      const currentStepConfig = TUTORIAL_CONFIG[tutorialState.step];
      currentStepConfig.action?.();
      executedTutorialStep.current = tutorialState.step;
    }
  }, [tutorialState.step, tutorialState.active, TUTORIAL_CONFIG, endTutorial]);
  const handleCellClick = (r, c) => {
    if (gameOver && !tutorialState.active) {
      setShowGameOverModal(true);
      return;
    }
    if (isThinking || isSimulatingRef.current || !!animationInfo) return;
    if (gameMode === "online" /* Online */) {
      if (!onlineRole || currentPlayer !== onlineRole) {
        if (isValidMove(r, c, board, movesMade)) {
          playSound("badmove");
          setInvalidMove({ r, c });
          setTimeout(() => setInvalidMove(null), 300);
        }
        return;
      }
    } else if (gameMode === "pvc" /* PvC */ && currentPlayer === AI_PLAYER && !tutorialState.active) {
      return;
    }
    if (tutorialState.active) {
      const currentStepConfig = TUTORIAL_CONFIG[tutorialState.step];
      if (currentStepConfig?.isInteractive) {
        if (isValidMove(r, c, board, movesMade)) {
          if (currentStepConfig.advancesOnClick) {
            const newBoard = board.map((row) => [...row]);
            newBoard[r][c] = currentPlayer;
            setBoard(newBoard);
            setLastMove({ r, c });
            setMovesMade((m) => m + 1);
            setCurrentPlayer((p) => p === PLAYER_X ? PLAYER_O : PLAYER_X);
            setTimeout(() => advanceTutorial(), 250);
          } else {
            makeMove(r, c);
          }
        } else {
          playSound("badmove");
          setInvalidMove({ r, c });
          setTimeout(() => setInvalidMove(null), 300);
        }
      }
      return;
    }
    if (isValidMove(r, c, board, movesMade)) {
      const isLearningMode = gameMode === "pvc" /* PvC */ && adaptiveLevel <= 1;
      if (isLearningMode && !gameOver && currentPlayer === HUMAN_PLAYER) {
        const tempBoard = board.map((row) => [...row]);
        tempBoard[r][c] = HUMAN_PLAYER;
        const aiNextMoves = getValidMoves(tempBoard, movesMade + 1);
        let isBlunder = false;
        for (const aiMove of aiNextMoves) {
          const futureBoard = tempBoard.map((row) => [...row]);
          futureBoard[aiMove.r][aiMove.c] = AI_PLAYER;
          if (checkWin(AI_PLAYER, futureBoard)) {
            isBlunder = true;
            break;
          }
        }
        if (isBlunder) {
          setConfirmAction({
            isOpen: true,
            title: "Professor's Hint",
            message: "Are you certain about that move? I see a potential danger there. Proceed anyway?",
            confirmText: "Yes, Make Move",
            actionType: "confirm_blunder",
            payload: { r, c }
          });
          return;
        }
      }
      makeMove(r, c);
    } else {
      playSound("badmove");
      setInvalidMove({ r, c });
      setTimeout(() => setInvalidMove(null), 300);
    }
  };
  const handleCellHover = useCallback((r, c) => {
    if (r === null || c === null || gameOver || isThinking || isSimulatingRef.current || !!animationInfo) {
      setHighlightedPath([]);
      return;
    }
    if (isOnWall(r, c)) {
      setHighlightedPath([]);
      return;
    }
    const findConnectionPath = (row, col, currentBoard) => {
      const directions = [[-1, 0], [1, 0], [0, -1], [0, 1]];
      for (const [dr, dc] of directions) {
        const path2 = [];
        let pathIsGood = true;
        let cr = row + dr;
        let cc = col + dc;
        while (cr >= 0 && cr < BOARD_SIZE && cc >= 0 && cc < BOARD_SIZE) {
          if (currentBoard[cr][cc]) {
            path2.push({ r: cr, c: cc });
          } else {
            pathIsGood = false;
            break;
          }
          cr += dr;
          cc += dc;
        }
        if (path2.length > 0 && pathIsGood) {
          return path2;
        }
      }
      return null;
    };
    const path = findConnectionPath(r, c, board);
    setHighlightedPath(path || []);
  }, [board, gameOver, isThinking, animationInfo]);
  const setOnlineRole = useCallback((role) => {
    playSound("uiclick");
    setOnlineRoleInternal(role);
    masterReset(PLAYER_X);
    setNextStarter(PLAYER_O);
  }, [masterReset, playSound]);
  const gameStateString = useMemo(() => {
    if (gameMode !== "online" /* Online */ || movesMade === 0) return "";
    try {
      const state = {
        moveHistory,
        playerX: { name: playerName, piece: playerPiece },
        playerO: { name: playerOName, piece: playerOPiece }
      };
      const stateJson = JSON.stringify(state);
      return btoa(stateJson);
    } catch (e) {
      console.error("Failed to serialize game state:", e);
      return "";
    }
  }, [moveHistory, gameMode, playerName, playerPiece, playerOName, playerOPiece, movesMade]);
  const loadOnlineGame = useCallback((stateStr) => {
    if (!stateStr) return false;
    playSound("uiclick");
    try {
      const stateJson = atob(stateStr);
      const loadedState = JSON.parse(stateJson);
      if (!loadedState || !Array.isArray(loadedState.moveHistory) || !loadedState.playerX || !loadedState.playerO) {
        throw new Error("Invalid game state format.");
      }
      const loadedMoveHistory = loadedState.moveHistory;
      let simBoard = createInitialBoard();
      let simMovesMade = 0;
      let lastValidMove = null;
      for (const move of loadedMoveHistory) {
        if (typeof move.r !== "number" || typeof move.c !== "number" || move.player !== "X" && move.player !== "O") {
          throw new Error(`Invalid move object in history: ${JSON.stringify(move)}`);
        }
        if (!isValidMove(move.r, move.c, simBoard, simMovesMade)) {
          throw new Error(`Invalid move sequence in history: ${JSON.stringify(move)}`);
        }
        simBoard[move.r][move.c] = move.player;
        simMovesMade++;
        lastValidMove = { r: move.r, c: move.c };
      }
      const lastPlayer = loadedMoveHistory.length > 0 ? loadedMoveHistory[loadedMoveHistory.length - 1].player : PLAYER_O;
      const newCurrentPlayer = lastPlayer === PLAYER_X ? PLAYER_O : PLAYER_X;
      masterReset(PLAYER_X);
      setBoard(simBoard);
      setMoveHistory(loadedMoveHistory);
      setMovesMade(simMovesMade);
      setCurrentPlayer(newCurrentPlayer);
      setLastMove(lastValidMove);
      setPlayerNameInternal(loadedState.playerX.name);
      setPlayerPieceInternal(loadedState.playerX.piece);
      setPlayerONameInternal(loadedState.playerO.name);
      setPlayerOPieceInternal(loadedState.playerO.piece);
      setOnlineRoleInternal(newCurrentPlayer);
      const winningPlayer = lastValidMove ? simBoard[lastValidMove.r][lastValidMove.c] : null;
      if (winningPlayer) {
        const winLines = checkWin(winningPlayer, simBoard);
        if (winLines) {
          setWinInfo(winLines);
          setGameOver(true);
          playSound("win");
        }
      }
      if (!winInfo && getValidMoves(simBoard, simMovesMade).length === 0) {
        setGameOver(true);
      }
      playSound("place");
      return true;
    } catch (e) {
      console.error("Failed to load game state:", e);
      alert(`Invalid game code provided. Error: ${e instanceof Error ? e.message : "Unknown error"}`);
      return false;
    }
  }, [masterReset, playSound, winInfo]);
  const scorePositionTactical = (currentBoard, player) => {
    let score = 0;
    const opponent = player === AI_PLAYER ? HUMAN_PLAYER : AI_PLAYER;
    for (let r = 0; r < BOARD_SIZE; r++) {
      for (let c = 0; c < BOARD_SIZE; c++) {
        [[0, 1], [1, 0], [1, 1], [1, -1]].forEach(([dr, dc]) => {
          if (r + 3 * dr < BOARD_SIZE && r + 3 * dr >= 0 && c + 3 * dc < BOARD_SIZE && c + 3 * dc >= 0) {
            const window2 = [
              currentBoard[r][c],
              currentBoard[r + dr][c + dc],
              currentBoard[r + 2 * dr][c + 2 * dc],
              currentBoard[r + 3 * dr][c + 3 * dc]
            ];
            const playerCount = window2.filter((p) => p === player).length;
            const opponentCount = window2.filter((p) => p === opponent).length;
            const emptyCount = window2.filter((p) => p === null).length;
            if (playerCount === 3 && emptyCount === 1) score += 500;
            else if (playerCount === 2 && emptyCount === 2) score += 50;
            if (opponentCount === 3 && emptyCount === 1) score -= 1e4;
            else if (opponentCount === 2 && emptyCount === 2) score -= 250;
          }
        });
      }
    }
    return score;
  };
  const scorePositionStrategic = (currentBoard, player) => {
    let score = scorePositionTactical(currentBoard, player);
    for (let r = 0; r < 8; r++) {
      for (let c = 0; c < 8; c++) {
        if (currentBoard[r][c] === player) score += POSITIONAL_VALUE_MAP[r][c];
        else if (currentBoard[r][c] !== null) score -= POSITIONAL_VALUE_MAP[r][c];
      }
    }
    return score;
  };
  const minimax = (currentBoard, currentMovesMade, depth, alpha, beta, maximizingPlayer, scoringFunction, transpositionTable, canonicalKey, moveList = null) => {
    const originalAlpha = alpha;
    const turnKey = maximizingPlayer ? "max" : "min";
    const boardKey = `${canonicalKey}:${turnKey}`;
    const storedEntry = transpositionTable.get(boardKey);
    if (storedEntry && storedEntry.depth >= depth) {
      if (storedEntry.flag === "EXACT") {
        return { score: storedEntry.score, move: storedEntry.move };
      }
      if (storedEntry.flag === "LOWERBOUND") {
        alpha = Math.max(alpha, storedEntry.score);
      } else if (storedEntry.flag === "UPPERBOUND") {
        beta = Math.min(beta, storedEntry.score);
      }
      if (alpha >= beta) {
        return { score: storedEntry.score, move: storedEntry.move };
      }
    }
    const moves = moveList || getValidMoves(currentBoard, currentMovesMade);
    const winForAI = checkWin(AI_PLAYER, currentBoard);
    const winForHuman = checkWin(HUMAN_PLAYER, currentBoard);
    const isTerminal = winForAI || winForHuman || depth === 0 || moves.length === 0;
    if (isTerminal) {
      if (winForAI) return { score: 1e5 + depth * 100 };
      if (winForHuman) return { score: -1e5 - depth * 100 };
      return { score: scoringFunction(currentBoard, AI_PLAYER) };
    }
    if (storedEntry?.move) {
      const moveIndex = moves.findIndex((m) => m.r === storedEntry.move.r && m.c === storedEntry.move.c);
      if (moveIndex > 0) {
        const [best] = moves.splice(moveIndex, 1);
        moves.unshift(best);
      }
    }
    let bestMove = moves[0];
    if (maximizingPlayer) {
      let maxEval = -Infinity;
      for (const move of moves) {
        const newBoard = currentBoard.map((r) => [...r]);
        newBoard[move.r][move.c] = AI_PLAYER;
        const newBoardKey = getCanonicalBoardKey(newBoard);
        const { score } = minimax(newBoard, currentMovesMade + 1, depth - 1, alpha, beta, false, scoringFunction, transpositionTable, newBoardKey);
        if (score > maxEval) {
          maxEval = score;
          bestMove = move;
        }
        alpha = Math.max(alpha, score);
        if (beta <= alpha) break;
      }
      let flag;
      if (maxEval <= originalAlpha) {
        flag = "UPPERBOUND";
      } else if (maxEval >= beta) {
        flag = "LOWERBOUND";
      } else {
        flag = "EXACT";
      }
      if (!storedEntry || depth >= storedEntry.depth) {
        transpositionTable.set(boardKey, { depth, score: maxEval, flag, move: bestMove });
      }
      return { score: maxEval, move: bestMove };
    } else {
      let minEval = Infinity;
      for (const move of moves) {
        const newBoard = currentBoard.map((r) => [...r]);
        newBoard[move.r][move.c] = HUMAN_PLAYER;
        const newBoardKey = getCanonicalBoardKey(newBoard);
        const { score } = minimax(newBoard, currentMovesMade + 1, depth - 1, alpha, beta, true, scoringFunction, transpositionTable, newBoardKey);
        if (score < minEval) {
          minEval = score;
          bestMove = move;
        }
        beta = Math.min(beta, score);
        if (beta <= alpha) break;
      }
      let flag;
      if (minEval <= originalAlpha) {
        flag = "UPPERBOUND";
      } else if (minEval >= beta) {
        flag = "LOWERBOUND";
      } else {
        flag = "EXACT";
      }
      if (!storedEntry || depth >= storedEntry.depth) {
        transpositionTable.set(boardKey, { depth, score: minEval, flag, move: bestMove });
      }
      return { score: minEval, move: bestMove };
    }
  };
  const getBestMove = (player, moves, currentBoard, currentMovesMade, memory, depth, scoringFunction, transpositionTable) => {
    const canonicalKey = getCanonicalBoardKey(currentBoard);
    const turnKey = player === AI_PLAYER ? "max" : "min";
    const boardKey = `${canonicalKey}:${turnKey}`;
    const cachedEntry = transpositionTable.get(boardKey);
    if (cachedEntry && cachedEntry.depth >= depth && cachedEntry.flag === "EXACT" && cachedEntry.move) {
      if (moves.some((m) => m.r === cachedEntry.move.r && m.c === cachedEntry.move.c)) {
        return cachedEntry.move;
      }
    }
    const PATTERN_WEIGHT = 15;
    const patternScoreCache = /* @__PURE__ */ new Map();
    const learningScoringFunction = (b, p) => {
      let score = scoringFunction(b, p);
      if (isAiLearningEnabled && Object.keys(memory.patterns).length > 0) {
        const boardKey2 = getCanonicalBoardKey(b);
        let patternScore = patternScoreCache.get(boardKey2);
        if (patternScore === void 0) {
          patternScore = 0;
          const patterns = extractPatternsFromBoard(b);
          patterns.forEach((patternPlayer, key) => {
            const patternValue = memory.patterns[key];
            if (patternValue) {
              if (patternPlayer === AI_PLAYER) {
                patternScore += patternValue * PATTERN_WEIGHT;
              } else {
                patternScore -= patternValue * PATTERN_WEIGHT;
              }
            }
          });
          patternScoreCache.set(boardKey2, patternScore);
        }
        score += patternScore;
      }
      return score;
    };
    let potentialMoves = [...moves];
    const immediateWinMove = potentialMoves.find((move) => {
      const tempBoard = currentBoard.map((r) => [...r]);
      tempBoard[move.r][move.c] = player;
      return !!checkWin(player, tempBoard);
    });
    if (immediateWinMove) return immediateWinMove;
    const opponent = player === PLAYER_X ? PLAYER_O : PLAYER_X;
    const immediateBlockMove = potentialMoves.find((move) => {
      const tempBoard = currentBoard.map((r) => [...r]);
      tempBoard[move.r][move.c] = opponent;
      return !!checkWin(opponent, tempBoard);
    });
    if (immediateBlockMove) return immediateBlockMove;
    potentialMoves.sort((a, b) => POSITIONAL_VALUE_MAP[b.r][b.c] - POSITIONAL_VALUE_MAP[a.r][a.c]);
    if (isAiLearningEnabled && memory.losingMoves) {
      const boardKey2 = getCanonicalBoardKey(currentBoard);
      const losingMove = memory.losingMoves[boardKey2];
      if (losingMove) {
        const filteredMoves = potentialMoves.filter((move) => move.r !== losingMove.r || move.c !== losingMove.c);
        if (filteredMoves.length > 0) {
          potentialMoves = filteredMoves;
        }
      }
    }
    const isMaximizing = player === AI_PLAYER;
    let bestMove;
    const initialKey = getCanonicalBoardKey(currentBoard);
    for (let d = 1; d <= depth; d++) {
      const result = minimax(currentBoard, currentMovesMade, d, -Infinity, Infinity, isMaximizing, learningScoringFunction, transpositionTable, initialKey, potentialMoves);
      if (result.move) {
        bestMove = result.move;
      }
    }
    return bestMove || potentialMoves[Math.floor(Math.random() * potentialMoves.length)];
  };
  const computerMove = useCallback(() => {
    const movePromise = (async () => {
      if (validMoves.length === 0) return null;
      if (tutorialState.active) {
        const blockingMoves = /* @__PURE__ */ new Set();
        for (const move of validMoves) {
          const tempBoard = board.map((r) => [...r]);
          tempBoard[move.r][move.c] = HUMAN_PLAYER;
          if (checkWin(HUMAN_PLAYER, tempBoard)) {
            blockingMoves.add(`${move.r}-${move.c}`);
          }
        }
        let passiveMoves = validMoves.filter((move) => !blockingMoves.has(`${move.r}-${move.c}`));
        if (passiveMoves.length === 0) passiveMoves = validMoves;
        const bestMove2 = passiveMoves[Math.floor(Math.random() * passiveMoves.length)];
        await new Promise((resolve) => setTimeout(resolve, 100));
        return bestMove2;
      }
      let potentialMoves = validMoves;
      if (movesMade <= 1) {
        const filtered = validMoves.filter((move) => {
          const { r, c } = move;
          const isForbiddenCoord = (coord) => coord <= 1 || coord >= BOARD_SIZE - 2;
          if (r === 0 || r === BOARD_SIZE - 1) return !isForbiddenCoord(c);
          if (c === 0 || c === BOARD_SIZE - 1) return !isForbiddenCoord(r);
          return true;
        });
        if (filtered.length > 0) potentialMoves = filtered;
      }
      await new Promise((resolve) => setTimeout(resolve, 100));
      let bestMove;
      const currentLevelSetting = AI_LEVELS[adaptiveLevel];
      if (!currentLevelSetting) {
        console.error(`Invalid adaptiveLevel: ${adaptiveLevel}. Falling back to random move.`);
        return potentialMoves[Math.floor(Math.random() * potentialMoves.length)] || null;
      }
      if (currentLevelSetting.depth === 0) {
        const immediateWinMove = potentialMoves.find((move) => {
          const tempBoard = board.map((r) => [...r]);
          tempBoard[move.r][move.c] = AI_PLAYER;
          return !!checkWin(AI_PLAYER, tempBoard);
        });
        if (immediateWinMove) {
          bestMove = immediateWinMove;
        } else {
          const immediateBlockMove = potentialMoves.find((move) => {
            const tempBoard = board.map((r) => [...r]);
            tempBoard[move.r][move.c] = HUMAN_PLAYER;
            return !!checkWin(HUMAN_PLAYER, tempBoard);
          });
          if (immediateBlockMove) {
            bestMove = immediateBlockMove;
          } else {
            const weightedList = [];
            potentialMoves.forEach((move) => {
              const weight = 1 + POSITIONAL_VALUE_MAP[move.r][move.c];
              for (let i = 0; i < weight; i++) {
                weightedList.push(move);
              }
            });
            if (weightedList.length > 0) {
              bestMove = weightedList[Math.floor(Math.random() * weightedList.length)];
            }
          }
        }
      } else if (currentLevelSetting.probabilities) {
        const scoringFunction = currentLevelSetting.strategic ? scorePositionStrategic : scorePositionTactical;
        const transpositionTable = /* @__PURE__ */ new Map();
        const moveScores = [];
        for (const move of potentialMoves) {
          const newBoard = board.map((r) => [...r]);
          newBoard[move.r][move.c] = AI_PLAYER;
          if (checkWin(AI_PLAYER, newBoard)) {
            moveScores.push({ move, score: Infinity });
            break;
          }
          const initialKey = getCanonicalBoardKey(newBoard);
          const { score } = minimax(newBoard, movesMade + 1, currentLevelSetting.depth, -Infinity, Infinity, false, scoringFunction, transpositionTable, initialKey);
          moveScores.push({ move, score });
        }
        if (moveScores.length > 0) {
          moveScores.sort((a, b) => b.score - a.score);
          if (moveScores[0].score === Infinity) {
            bestMove = moveScores[0].move;
          } else {
            const rand = Math.random();
            let cumulativeProb = 0;
            const topMoves = moveScores.slice(0, currentLevelSetting.probabilities.length);
            for (let i = 0; i < topMoves.length; i++) {
              cumulativeProb += currentLevelSetting.probabilities[i];
              if (rand < cumulativeProb) {
                bestMove = topMoves[i].move;
                break;
              }
            }
            if (!bestMove) {
              bestMove = topMoves[0].move;
            }
          }
        }
      } else {
        const scoringFunction = currentLevelSetting.strategic ? scorePositionStrategic : scorePositionTactical;
        bestMove = getBestMove(
          AI_PLAYER,
          potentialMoves,
          board,
          movesMade,
          gameMemory,
          currentLevelSetting.depth,
          scoringFunction,
          gameLongAiCacheRef.current
        );
      }
      if (!bestMove && potentialMoves.length > 0) {
        bestMove = potentialMoves[Math.floor(Math.random() * potentialMoves.length)];
      }
      return bestMove || null;
    })();
    movePromise.then((bestMove) => {
      if (bestMove) {
        makeMove(bestMove.r, bestMove.c);
      } else if (validMoves.length > 0) {
        const randomMove = validMoves[Math.floor(Math.random() * validMoves.length)];
        makeMove(randomMove.r, randomMove.c);
      }
    }).catch((error) => {
      console.error("Error getting AI move:", error);
      if (validMoves.length > 0) {
        const randomMove = validMoves[Math.floor(Math.random() * validMoves.length)];
        makeMove(randomMove.r, randomMove.c);
      }
    }).finally(() => setIsThinking(false));
  }, [validMoves, board, movesMade, makeMove, gameMemory, adaptiveLevel, tutorialState.active, isAiLearningEnabled]);
  useEffect(() => {
    if (!gameOver && gameMode === "pvc" /* PvC */ && currentPlayer === AI_PLAYER && !animationInfo) {
      if (tutorialState.active) {
        const currentStepConfig = TUTORIAL_CONFIG[tutorialState.step];
        if (!currentStepConfig || currentStepConfig.advancesOnClick || currentStepConfig.action) {
          return;
        }
      }
      setIsThinking(true);
      const timer = setTimeout(computerMove, 500);
      return () => clearTimeout(timer);
    }
  }, [currentPlayer, gameOver, gameMode, computerMove, tutorialState.active, tutorialState.step, animationInfo, TUTORIAL_CONFIG]);
  const gameStatus = useMemo(() => {
    const currentStepConfig = tutorialState.active && tutorialState.step >= 0 ? TUTORIAL_CONFIG[tutorialState.step] : null;
    if (currentStepConfig && !currentStepConfig.isInteractive) return "Professor Caz's Lesson";
    if (isSimulatingRef.current) return simulationStatus;
    if (gameOver) {
      if (winInfo) {
        const winner = board[winInfo[0][0].r][winInfo[0][0].c];
        if (tutorialState.active) {
          return winner === HUMAN_PLAYER ? "You did it! Tutorial Complete." : "Keep trying!";
        }
        if (gameMode === "pvc" /* PvC */) {
          const winnerName2 = winner === HUMAN_PLAYER ? playerName : "Professor Caz";
          return `${winnerName2} Wins!`;
        }
        const winnerName = winner === "X" /* X */ ? playerName : playerOName;
        return `${winnerName} Wins!`;
      }
      return "It's a Draw!";
    }
    if (isThinking) return "Professor Caz is thinking...";
    if (animationInfo) return `Player ${animationInfo.player} is making a move...`;
    if (gameMode === "online" /* Online */) {
      if (!onlineRole) return "Choose to start or join a game";
      return onlineRole === currentPlayer ? "Your Turn" : `Waiting for Player ${currentPlayer}...`;
    }
    if (gameMode === "pvc" /* PvC */) {
      return currentPlayer === HUMAN_PLAYER ? "Your Turn" : "Professor Caz's Turn";
    }
    return `Player ${currentPlayer}'s Turn`;
  }, [gameOver, winInfo, board, currentPlayer, isThinking, simulationStatus, tutorialState.active, tutorialState.step, TUTORIAL_CONFIG, animationInfo, gameMode, onlineRole, playerName, playerOName]);
  const playSimulationGame = async (memory) => {
    let simBoard = createInitialBoard();
    let simCurrentPlayer = Math.random() < 0.5 ? PLAYER_X : PLAYER_O;
    let simMovesMade = 0;
    let simHistory = [];
    const simTranspositionTable = /* @__PURE__ */ new Map();
    while (isSimulatingRef.current) {
      const validSimMoves = getValidMoves(simBoard, simMovesMade);
      if (validSimMoves.length === 0) return { history: simHistory, winner: null, finalBoard: simBoard };
      let move;
      const EXPLORATION_RATE = 0.1;
      if (Math.random() < EXPLORATION_RATE) {
        move = validSimMoves[Math.floor(Math.random() * validSimMoves.length)];
      } else {
        move = getBestMove(simCurrentPlayer, validSimMoves, simBoard, simMovesMade, memory, 4, scorePositionStrategic, simTranspositionTable);
      }
      if (!move) move = validSimMoves[Math.floor(Math.random() * validSimMoves.length)];
      simBoard[move.r][move.c] = simCurrentPlayer;
      simMovesMade++;
      simHistory.push({ player: simCurrentPlayer, r: move.r, c: move.c });
      const winner = checkWin(simCurrentPlayer, simBoard);
      if (winner) return { history: simHistory, winner: simCurrentPlayer, finalBoard: simBoard };
      simCurrentPlayer = simCurrentPlayer === PLAYER_X ? PLAYER_O : PLAYER_X;
      await new Promise((resolve) => setTimeout(() => resolve(), 0));
    }
    return null;
  };
  const startSimulation = async (gamesToPlay) => {
    playSound("uiclick");
    isSimulatingRef.current = true;
    setSimulationStatus("Starting simulation...");
    let currentMemory = JSON.parse(JSON.stringify(gameMemory));
    for (let i = 1; i <= gamesToPlay; i++) {
      if (!isSimulatingRef.current) break;
      setSimulationStatus(`Simulating Game ${i} of ${gamesToPlay}...`);
      const gameResult = await playSimulationGame(currentMemory);
      if (gameResult && gameResult.winner) {
        const { winner, history } = gameResult;
        const LOOKBACK_STEPS = 3;
        const BASE_LEARNING_RATE = 1;
        const LEARNING_RATE_DECAY = 0.5;
        let tempHistory = [...history];
        for (let j = 0; j < LOOKBACK_STEPS; j++) {
          if (tempHistory.length === 0) break;
          const tempBoard = createInitialBoard();
          tempHistory.forEach((move) => {
            tempBoard[move.r][move.c] = move.player;
          });
          const learningRate = BASE_LEARNING_RATE * Math.pow(LEARNING_RATE_DECAY, j);
          const patternsOnBoard = extractPatternsFromBoard(tempBoard);
          patternsOnBoard.forEach((p, key) => {
            if (p === winner) {
              currentMemory.patterns[key] = (currentMemory.patterns[key] || 0) + learningRate;
            } else {
              currentMemory.patterns[key] = (currentMemory.patterns[key] || 0) - learningRate;
            }
          });
          if (tempHistory.length > 0) tempHistory.pop();
          if (tempHistory.length > 0) tempHistory.pop();
        }
      }
    }
    setGameMemory(currentMemory);
    try {
      localStorage.setItem("cazConnectMemory", JSON.stringify(currentMemory));
    } catch (error) {
      console.error("Failed to save AI memory to localStorage", error);
    }
    isSimulatingRef.current = false;
    setSimulationStatus("");
    alert(`Professor Caz training complete! His brain now contains ${Object.keys(currentMemory.patterns).length} recognized patterns.`);
    _startNewGame();
  };
  const stopSimulation = () => {
    playSound("uiclick");
    isSimulatingRef.current = false;
  };
  const exportMemory = () => {
    playSound("uiclick");
    const memoryString = JSON.stringify(gameMemory, null, 2);
    const blob = new Blob([memoryString], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "caz-connect-caz-brain.json";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };
  const importMemory = (file) => {
    playSound("uiclick");
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const importedMemory = JSON.parse(e.target?.result);
        if (importedMemory && importedMemory.patterns) {
          setGameMemory(importedMemory);
          localStorage.setItem("cazConnectMemory", JSON.stringify(importedMemory));
          alert(`Professor Caz's Brain imported successfully!
Recognized Patterns: ${Object.keys(importedMemory.patterns).length}`);
        } else {
          alert("Invalid memory file format.");
        }
      } catch (error) {
        alert("Error reading or parsing the memory file.");
      }
    };
    reader.readAsText(file);
  };
  const currentTutorialStep = tutorialState.active && tutorialState.step >= 0 ? TUTORIAL_CONFIG[tutorialState.step] : null;
  const tutorialHighlight = currentTutorialStep ? currentTutorialStep.highlight : null;
  const tutorialText = currentTutorialStep ? typeof currentTutorialStep.text === "function" ? currentTutorialStep.text() : currentTutorialStep.text : "";
  const isTutorialInteractive = currentTutorialStep ? currentTutorialStep.isInteractive : false;
  const handleUIClick = useCallback(() => {
    playSound("uiclick");
  }, [playSound]);
  const toggleAutoAdjustLevel = useCallback(() => {
    playSound("uiclick");
    setAutoAdjustLevel((prev) => !prev);
  }, [playSound]);
  const handleConfirmAction = useCallback(() => {
    if (!confirmAction) return;
    playSound("uiclick");
    const isGameInProgress = isForfeitable;
    const { actionType, payload } = confirmAction;
    switch (actionType) {
      case "reset":
        if (isGameInProgress) {
          if (gameMode === "pvc" /* PvC */) {
            recordGameResult(moveHistory, AI_PLAYER);
            setScores((prev) => {
              const newScores = JSON.parse(JSON.stringify(prev));
              newScores[gameMode][AI_PLAYER]++;
              return newScores;
            });
          } else if (gameMode === "pvp" /* PvP */) {
            const winner = currentPlayer === PLAYER_X ? PLAYER_O : PLAYER_X;
            setScores((prev) => {
              const newScores = JSON.parse(JSON.stringify(prev));
              newScores[gameMode][winner]++;
              return newScores;
            });
          }
        }
        _startNewGame();
        break;
      case "change_level":
        if (isGameInProgress) {
          recordGameResult(moveHistory, AI_PLAYER);
          setScores((prev) => {
            const newScores = JSON.parse(JSON.stringify(prev));
            newScores[gameMode][AI_PLAYER]++;
            return newScores;
          });
        }
        setAdaptiveLevel(payload);
        _startNewGame();
        break;
      case "confirm_blunder":
        if (payload && typeof payload.r === "number" && typeof payload.c === "number") {
          makeMove(payload.r, payload.c);
        }
        break;
    }
    setConfirmAction(null);
  }, [confirmAction, playSound, gameMode, recordGameResult, moveHistory, _startNewGame, currentPlayer, isForfeitable, makeMove]);
  const setGameModeAction = useCallback((mode) => {
    if (isSimulatingRef.current || tutorialState.active || gameMode === mode) return;
    playSound("uiclick");
    isSwitchingMode.current = true;
    const gameStateToSave = { board, currentPlayer, nextStarter, movesMade, gameOver, winInfo, lastMove, moveHistory };
    try {
      const allSlotsJSON = localStorage.getItem(CAZ_CONNECT_GAME_SLOTS_KEY);
      const allSlots = allSlotsJSON ? JSON.parse(allSlotsJSON) : {};
      allSlots[gameMode] = gameStateToSave;
      localStorage.setItem(CAZ_CONNECT_GAME_SLOTS_KEY, JSON.stringify(allSlots));
    } catch (error) {
      console.error("Failed to save current game state before switching mode", error);
    }
    masterReset(PLAYER_X);
    setNextStarter(PLAYER_O);
    if (mode !== "online" /* Online */) {
      setOnlineRoleInternal(null);
    }
    setGameMode(mode);
  }, [
    gameMode,
    tutorialState.active,
    playSound,
    board,
    currentPlayer,
    nextStarter,
    movesMade,
    gameOver,
    winInfo,
    lastMove,
    moveHistory,
    masterReset
  ]);
  const setAdaptiveLevelManual = useCallback((level) => {
    playSound("uiclick");
    if (adaptiveLevel === level) return;
    if (isForfeitable && gameMode === "pvc" /* PvC */) {
      setConfirmAction({
        isOpen: true,
        title: "Change Difficulty?",
        message: "This will forfeit the current game and count as a loss. Are you sure?",
        confirmText: "Forfeit & Change",
        actionType: "change_level",
        payload: level
      });
    } else {
      setAdaptiveLevel(level);
      if (gameOver) {
        _startNewGame();
      }
    }
  }, [playSound, adaptiveLevel, gameMode, _startNewGame, isForfeitable, gameOver]);
  const resetGame = useCallback(() => {
    if (isForfeitable) {
      setConfirmAction({
        isOpen: true,
        title: "Forfeit Game?",
        message: "Starting a new game will count the current one as a loss. Are you sure?",
        confirmText: "Forfeit & Restart",
        actionType: "reset"
      });
    } else {
      _startNewGame();
    }
  }, [_startNewGame, isForfeitable]);
  const openPlayerStatsModal = useCallback(() => {
    playSound("uiclick");
    setShowPlayerStatsModal(true);
  }, [playSound]);
  const gameLoopDependenciesRef = useRef({
    handleCellClick,
    resetGame,
    _startNewGame,
    showGameOverModal,
    showRulesModal,
    showUnlockModal,
    confirmAction,
    handleConfirmAction,
    cancelConfirmAction,
    closeRulesModal,
    dismissGameOverModal,
    dismissUnlockModal,
    openRulesModal,
    openPlayerStatsModal,
    toggleMute,
    gamepadCursor,
    gamepadFocus,
    setGameMode
  });
  useEffect(() => {
    gameLoopDependenciesRef.current = {
      handleCellClick,
      resetGame,
      _startNewGame,
      showGameOverModal,
      showRulesModal,
      showUnlockModal,
      confirmAction,
      handleConfirmAction,
      cancelConfirmAction,
      closeRulesModal,
      dismissGameOverModal,
      dismissUnlockModal,
      openRulesModal,
      openPlayerStatsModal,
      toggleMute,
      gamepadCursor,
      gamepadFocus,
      setGameMode
    };
  });
  useEffect(() => {
    const gamepadLoop = () => {
      if (!gameLoopRef.current) return;
      if (virtualKeyboardState.isOpen) {
        gameLoopRef.current = requestAnimationFrame(gamepadLoop);
        return;
      }
      const gamepads2 = navigator.getGamepads();
      if (!gamepads2[0]) {
        gameLoopRef.current = requestAnimationFrame(gamepadLoop);
        return;
      }
      const gamepad = gamepads2[0];
      const now = performance.now();
      const deps = gameLoopDependenciesRef.current;
      const navMap = getNavigationMap({
        isGameOver: deps.showGameOverModal,
        isRulesOpen: deps.showRulesModal,
        isStatsOpen: showPlayerStatsModal,
        isConfirmOpen: !!deps.confirmAction?.isOpen,
        isUnlockOpen: deps.showUnlockModal,
        gameMode,
        isVirtualKeyboardOpen: virtualKeyboardState.isOpen,
        isDifficultySelectOpen
      });
      if (now - lastGamepadInputTimeRef.current > GAMEPAD_INPUT_DELAY) {
        let dx = 0;
        let dy = 0;
        const axisX = gamepad.axes[0];
        const axisY = gamepad.axes[1];
        if (Math.abs(axisX) > GAMEPAD_AXIS_THRESHOLD) dx = Math.sign(axisX);
        else if (gamepad.buttons[14].pressed) dx = -1;
        else if (gamepad.buttons[15].pressed) dx = 1;
        if (Math.abs(axisY) > GAMEPAD_AXIS_THRESHOLD) dy = Math.sign(axisY);
        else if (gamepad.buttons[12].pressed) dy = -1;
        else if (gamepad.buttons[13].pressed) dy = 1;
        if (dx !== 0 || dy !== 0) {
          if (deps.gamepadFocus === "board") {
            const { r: curR, c: curC } = deps.gamepadCursor;
            const newR = curR + dy;
            const newC = curC + dx;
            if (newR >= 0 && newR < BOARD_SIZE && newC >= 0 && newC < BOARD_SIZE) {
              setGamepadCursor({ r: newR, c: newC });
            } else {
              const direction = dy > 0 ? "down" : dy < 0 ? "up" : dx > 0 ? "right" : "left";
              const nextFocus = navMap[deps.gamepadFocus]?.[direction];
              if (nextFocus) setGamepadFocus(nextFocus);
            }
          } else {
            const direction = dy > 0 ? "down" : dy < 0 ? "up" : dx > 0 ? "right" : "left";
            const nextFocus = navMap[deps.gamepadFocus]?.[direction];
            if (nextFocus) setGamepadFocus(nextFocus);
          }
          lastGamepadInputTimeRef.current = now;
        }
      }
      gamepad.buttons.forEach((button, index) => {
        if (button.pressed && !buttonPressStateRef.current[index]) {
          buttonPressStateRef.current[index] = true;
          switch (index) {
            case 0:
              if (deps.gamepadFocus === "board" && deps.gamepadCursor) {
                deps.handleCellClick(deps.gamepadCursor.r, deps.gamepadCursor.c);
              } else {
                const focusedElement = document.getElementById(deps.gamepadFocus);
                focusedElement?.click();
              }
              break;
            case 1:
              if (isDifficultySelectOpen) {
                const mainSelect = document.getElementById("difficulty-select");
                mainSelect?.click();
              } else if (deps.showRulesModal) deps.closeRulesModal();
              else if (deps.showUnlockModal) deps.dismissUnlockModal();
              else if (deps.showGameOverModal) deps.dismissGameOverModal();
              else if (deps.confirmAction?.isOpen) deps.cancelConfirmAction();
              else if (showPlayerStatsModal) setShowPlayerStatsModal(false);
              break;
            case 9:
              deps.resetGame();
              break;
          }
        } else if (!button.pressed) {
          buttonPressStateRef.current[index] = false;
        }
      });
      gameLoopRef.current = requestAnimationFrame(gamepadLoop);
    };
    const handleGamepadConnected = (e) => {
      setIsGamepadConnected(true);
      setMascotMessageWithTimeout("A controller! Let's see your moves.");
      if (!gameLoopRef.current) {
        gameLoopRef.current = requestAnimationFrame(gamepadLoop);
      }
    };
    const handleGamepadDisconnected = (e) => {
      setIsGamepadConnected(false);
      if (gameLoopRef.current) {
        cancelAnimationFrame(gameLoopRef.current);
        gameLoopRef.current = void 0;
      }
    };
    window.addEventListener("gamepadconnected", handleGamepadConnected);
    window.addEventListener("gamepaddisconnected", handleGamepadDisconnected);
    const gamepads = navigator.getGamepads();
    if (gamepads[0]) {
      handleGamepadConnected(new GamepadEvent("gamepadconnected", { gamepad: gamepads[0] }));
    }
    return () => {
      window.removeEventListener("gamepadconnected", handleGamepadConnected);
      window.removeEventListener("gamepaddisconnected", handleGamepadDisconnected);
      if (gameLoopRef.current) {
        cancelAnimationFrame(gameLoopRef.current);
      }
    };
  }, [gameMode, showPlayerStatsModal, virtualKeyboardState.isOpen, isDifficultySelectOpen]);
  useEffect(() => {
    if (isDifficultySelectOpen) {
      setGamepadFocus("difficulty-select-option-0");
    }
  }, [isDifficultySelectOpen]);
  useEffect(() => {
    if (virtualKeyboardState.isOpen) {
      setGamepadFocus("vk-focused");
      return;
    }
    const navMap = getNavigationMap({
      isGameOver: showGameOverModal,
      isRulesOpen: showRulesModal,
      isStatsOpen: showPlayerStatsModal,
      isConfirmOpen: !!confirmAction?.isOpen,
      isUnlockOpen: showUnlockModal,
      gameMode,
      isVirtualKeyboardOpen: virtualKeyboardState.isOpen,
      isDifficultySelectOpen
    });
    const currentFocusIsValid = Object.keys(navMap).includes(gamepadFocus);
    if (!currentFocusIsValid) {
      if (showGameOverModal) setGamepadFocus("gameover-newgame-button");
      else if (showRulesModal) setGamepadFocus("rules-modal-close");
      else if (showPlayerStatsModal) setGamepadFocus("stats-modal-close");
      else if (confirmAction?.isOpen) setGamepadFocus("confirm-modal-confirm");
      else if (showUnlockModal) setGamepadFocus("unlock-modal-close");
      else if (isDifficultySelectOpen) setGamepadFocus("difficulty-select-option-0");
      else setGamepadFocus("board");
    }
  }, [showGameOverModal, showRulesModal, showPlayerStatsModal, confirmAction, showUnlockModal, gamepadFocus, gameMode, virtualKeyboardState.isOpen, isDifficultySelectOpen]);
  return {
    board,
    gameStatus,
    scores,
    validMoves,
    lastMove,
    winInfo,
    invalidMove,
    isThinking,
    isSimulating: isSimulatingRef.current,
    animationInfo,
    isAnimationEnabled,
    gameMode,
    adaptiveLevel,
    autoAdjustLevel,
    isLabUnlocked,
    showUnlockModal,
    showGameOverModal,
    aiStats,
    theme,
    isMuted,
    isHapticEnabled,
    isAiLearningEnabled,
    isScreenShakeEnabled,
    mascotMessage,
    levelChange,
    showRulesModal,
    confirmAction,
    isShaking,
    playerName,
    playerPiece,
    playerOName,
    playerOPiece,
    detailedStats,
    unlockedAchievements,
    highlightedPath,
    gamepadCursor,
    gamepadFocus,
    isGamepadConnected,
    virtualKeyboardState,
    installPrompt: {
      visible: isInstallPromptVisible,
      trigger: triggerInstallPrompt,
      dismiss: dismissInstallPrompt
    },
    isTutorialActive: tutorialState.active,
    tutorialText,
    tutorialHighlight,
    isTutorialInteractive,
    // Online-specific state
    currentPlayer,
    gameOver,
    onlineRole,
    gameStateString,
    movesMade,
    actions: {
      handleCellClick,
      resetGame,
      setGameMode: setGameModeAction,
      startSimulation,
      stopSimulation,
      importMemory,
      exportMemory,
      toggleMute,
      toggleAnimationEnabled,
      toggleTheme,
      toggleHapticEnabled,
      startTutorial,
      endTutorial,
      advanceTutorial,
      toggleScreenShakeEnabled,
      setOnlineRole,
      loadOnlineGame,
      dismissUnlockModal,
      dismissGameOverModal,
      openRulesModal,
      closeRulesModal,
      cancelConfirmAction,
      handleConfirmAction,
      toggleAutoAdjustLevel,
      setAdaptiveLevelManual,
      toggleIsAiLearningEnabled,
      setPlayerName,
      setPlayerPiece,
      setPlayerOName,
      setPlayerOPiece,
      handleUIClick,
      handleCellHover,
      openVirtualKeyboard,
      closeVirtualKeyboard,
      setIsDifficultySelectOpen
    }
  };
};

// components/MascotSpeechBubble.tsx
import { jsx } from "react/jsx-runtime";
var MascotSpeechBubble = ({ message }) => {
  const isVisible = !!message;
  return /* @__PURE__ */ jsx("div", { className: `mascot-speech-bubble ${isVisible ? "visible" : ""}`, children: message });
};
var MascotSpeechBubble_default = MascotSpeechBubble;

// components/Header.tsx
import { jsx as jsx2, jsxs } from "react/jsx-runtime";
var Mascot = ({ isThinking }) => /* @__PURE__ */ jsx2("div", { children: /* @__PURE__ */ jsx2(
  "img",
  {
    src: "./professor-caz.png",
    alt: "Professor Caz Mascot",
    className: `h-[90px] w-[90px] lg:h-[110px] lg:w-[110px] rounded-2xl shadow-lg flex-shrink-0 transition-opacity duration-500 mascot-image ${isThinking ? "animate-pulse" : ""}`
  }
) });
var Header = ({ isThinking, mascotMessage, gamepadFocus, onMuteClick, onRulesClick, onStatsClick }) => {
  return /* @__PURE__ */ jsxs("header", { className: "title-container flex flex-col items-center justify-center gap-2 w-full mt-2.5", children: [
    /* @__PURE__ */ jsx2("div", { className: "flex flex-row items-center justify-center gap-4 w-full", children: /* @__PURE__ */ jsxs("div", { className: "title-left flex items-center gap-2 sm:gap-4 min-w-0", children: [
      /* @__PURE__ */ jsxs("div", { className: "relative flex-shrink-0", children: [
        /* @__PURE__ */ jsx2(Mascot, { isThinking }),
        /* @__PURE__ */ jsx2(MascotSpeechBubble_default, { message: mascotMessage })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "title-text-group text-left min-w-0", children: [
        /* @__PURE__ */ jsx2("h1", { className: "title-font header-title font-bold text-2xl sm:text-3xl md:text-4xl lg:text-5xl m-0 tracking-wide", children: "Caz Connect" }),
        /* @__PURE__ */ jsx2("h2", { className: "font-normal text-xs sm:text-sm md:text-lg lg:text-xl m-0 -mt-1 header-subtitle hidden sm:block", children: "A Game of Gravity & Connection" })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxs("div", { className: "flex flex-row items-center justify-center gap-4 w-full mt-2", children: [
      /* @__PURE__ */ jsx2(
        "button",
        {
          id: "mute-button",
          onClick: onMuteClick,
          "aria-label": "Mute sound",
          title: "Mute/Unmute",
          className: `w-11 h-11 p-2 rounded-full cursor-pointer flex-shrink-0 header-button transition-shadow ${gamepadFocus === "mute-button" ? "gamepad-focus" : ""}`,
          children: /* @__PURE__ */ jsx2("svg", { xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 24 24", fill: "currentColor", children: /* @__PURE__ */ jsx2("path", { d: "M13.5 4.06c0-1.34-1.61-2.25-2.83-1.46L5.43 6H3a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h2.43l5.24 3.4c1.22.79 2.83-.12 2.83-1.46V4.06zM18.5 12c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM20 12c0 2.76-1.74 5.09-4.01 6.04v-12c2.27.95 4.01 3.27 4.01 5.96z" }) })
        }
      ),
      /* @__PURE__ */ jsx2(
        "button",
        {
          id: "rules-button",
          onClick: onRulesClick,
          "aria-label": "How to Play",
          title: "How to Play",
          className: `w-11 h-11 p-2 rounded-full cursor-pointer flex-shrink-0 header-button transition-shadow ${gamepadFocus === "rules-button" ? "gamepad-focus" : ""}`,
          children: /* @__PURE__ */ jsx2("svg", { xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 24 24", fill: "currentColor", children: /* @__PURE__ */ jsx2("path", { d: "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17h-2v-2h2v2zm2.07-7.75l-.9.92C13.45 12.9 13 13.5 13 15h-2v-.5c0-1.1.45-2.1 1.17-2.83l1.24-1.26c.37-.36.59-.86.59-1.41 0-1.1-.9-2-2-2s-2 .9-2 2H8c0-2.21 1.79-4 4-4s4 1.79 4 4c0 .88-.36 1.68-.93 2.25z" }) })
        }
      ),
      /* @__PURE__ */ jsx2(
        "button",
        {
          id: "stats-button",
          onClick: onStatsClick,
          "aria-label": "Player Stats",
          title: "Player Stats",
          className: `w-11 h-11 p-2 rounded-full cursor-pointer flex-shrink-0 header-button transition-shadow ${gamepadFocus === "stats-button" ? "gamepad-focus" : ""}`,
          children: /* @__PURE__ */ jsx2("svg", { xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 24 24", fill: "currentColor", children: /* @__PURE__ */ jsx2("path", { d: "M19 5h-2V3H7v2H5c-1.1 0-2 .9-2 2v1c0 2.55 1.92 4.63 4.39 4.94.63 1.5 1.98 2.63 3.61 2.96V19H7v2h10v-2h-4v-3.1c1.63-.33 2.98-1.46 3.61-2.96C19.08 12.63 21 10.55 21 8V7c0-1.1-.9-2-2-2zM5 8V7h2v3.82C5.84 10.4 5 9.3 5 8zm7 6c-1.65 0-3-1.35-3-3V3h6v10c0 1.65-1.35 3-3 3zm7-6c0 1.3-.84 2.4-2 2.82V7h2v1z" }) })
        }
      )
    ] })
  ] });
};
var Header_default = Header;

// components/Status.tsx
import { jsx as jsx3, jsxs as jsxs2 } from "react/jsx-runtime";
var Status = ({ statusText, scores, gameMode, adaptiveLevel, playerName, playerPiece, playerOName, playerOPiece, currentPlayer, gameOver }) => {
  const playerXLabel = `${playerName} (${playerPiece})`;
  const playerOLabel = gameMode === "pvc" /* PvC */ ? `Professor Caz (${AI_LEVELS[adaptiveLevel]?.name || "Unknown"})` : `${playerOName} (${playerOPiece})`;
  return /* @__PURE__ */ jsxs2("div", { className: "order-2 w-full text-center my-4 lg:my-5", children: [
    /* @__PURE__ */ jsx3("p", { className: "piece-font text-2xl font-semibold m-0 mb-3 min-h-[36px] status-text", children: statusText }),
    /* @__PURE__ */ jsxs2("div", { className: "flex justify-center gap-5 text-base", children: [
      /* @__PURE__ */ jsxs2("span", { className: `py-1 px-4 rounded font-bold score-display score-display-x ${!gameOver && currentPlayer === "X" /* X */ ? "active-player" : ""}`, children: [
        playerXLabel,
        ": ",
        scores["X" /* X */]
      ] }),
      /* @__PURE__ */ jsxs2("span", { className: `py-1 px-4 rounded font-bold score-display score-display-o ${!gameOver && currentPlayer === "O" /* O */ ? "active-player" : ""}`, children: [
        playerOLabel,
        ": ",
        scores["O" /* O */]
      ] })
    ] })
  ] });
};
var Status_default = Status;

// components/Board.tsx
import { useRef as useRef2, useState as useState3, useEffect as useEffect2, useCallback as useCallback2, useMemo as useMemo2 } from "react";

// components/Cell.tsx
import { jsx as jsx4, jsxs as jsxs3 } from "react/jsx-runtime";
var Cell = ({ value, playerPiece, playerOPiece, isLastMove, isValid, highlightValid, isWinningPiece, isTutorialHighlighted, isInvalidMoveAttempt, isHighlightedPath, isGamepadCursor, onHover, onClick, "data-row": dataRow, "data-col": dataCol }) => {
  const playerClasses = value === "X" ? "player-x-piece" : "player-o-piece";
  const baseClasses = "relative aspect-square text-[5.5vmin] lg:text-[42px] flex items-center justify-center font-bold transition-all duration-200 piece-font leading-none text-center select-none";
  const stateClasses = `
        ${value ? playerClasses : ""}
        ${isLastMove && !isWinningPiece ? "last-move-indicator" : ""}
        ${isValid ? "cursor-pointer rounded-lg" : "cursor-not-allowed"}
        ${highlightValid ? "bg-slate-400/20 rounded-lg" : ""}
    `;
  const animationClasses = [
    value && isLastMove ? "animate-pop-in" : "",
    isWinningPiece ? "animate-win-pulse" : "",
    isTutorialHighlighted ? "animate-tutorial-pulse" : "",
    isInvalidMoveAttempt ? "animate-invalid-move" : "",
    isHighlightedPath ? "animate-path-highlight" : "",
    isGamepadCursor ? "gamepad-cursor" : ""
  ].filter(Boolean).join(" ");
  const displayValue = value === "X" /* X */ ? playerPiece : value === "O" /* O */ ? playerOPiece : value;
  return /* @__PURE__ */ jsxs3(
    "div",
    {
      className: `${baseClasses} ${stateClasses} ${animationClasses} board-cell ${isValid ? "valid-move" : ""}`,
      onClick,
      onMouseEnter: () => {
        if (isValid) onHover(dataRow, dataCol);
      },
      "data-row": dataRow,
      "data-col": dataCol,
      children: [
        displayValue,
        /* @__PURE__ */ jsx4("style", { children: `
                .valid-move:hover {
                    background-color: rgba(255, 255, 255, 0.1);
                    border-radius: 0.5rem;
                }
                .theme-science .valid-move:hover {
                    background-color: rgba(0, 0, 0, 0.05);
                }

                .last-move-indicator {
                    background-color: var(--button-secondary-hover-bg);
                    border-radius: 0.5rem;
                }

                @keyframes pop-in { 
                    0% { transform: scale(0.5); opacity: 0; } 
                    100% { transform: scale(1); opacity: 1; } 
                }
                .animate-pop-in { animation: pop-in 0.3s ease-out; }

                @keyframes win-pulse {
                    0%, 100% {
                        background-color: rgba(239, 68, 68, 0.3);
                        border-radius: 0.5rem;
                    }
                    50% {
                        background-color: rgba(239, 68, 68, 0.6);
                        border-radius: 0.5rem;
                    }
                }
                .animate-win-pulse {
                    animation: win-pulse 1.2s ease-in-out infinite;
                    animation-delay: 0.25s; /* Start after line draws */
                }
                @keyframes tutorial-pulse {
                    0%, 100% {
                        box-shadow: 0 0 0 0 rgba(74, 222, 128, 0.7);
                    }
                    50% {
                        box-shadow: 0 0 10px 4px rgba(74, 222, 128, 0.1);
                    }
                }
                .animate-tutorial-pulse {
                    animation: tutorial-pulse 2s infinite;
                    background-color: rgba(74, 222, 128, 0.2) !important;
                    border-radius: 0.5rem;
                }
                 @keyframes invalid-move-flash {
                    50% {
                        background-color: rgba(239, 68, 68, 0.5); /* red-500 with 50% opacity */
                    }
                }
                .animate-invalid-move {
                    animation: invalid-move-flash 0.3s ease-in-out;
                    border-radius: 0.5rem;
                }
                @keyframes path-highlight-glow {
                    from { background-color: rgba(255, 255, 255, 0.08); }
                    to { background-color: rgba(255, 255, 255, 0.2); }
                }
                .theme-science .animate-path-highlight {
                  animation-name: path-highlight-glow-science;
                }
                @keyframes path-highlight-glow-science {
                    from { background-color: rgba(0, 0, 0, 0.04); }
                    to { background-color: rgba(0, 0, 0, 0.12); }
                }
                .animate-path-highlight {
                    animation: path-highlight-glow 0.8s alternate infinite ease-in-out;
                    border-radius: 0.5rem;
                }
                .gamepad-cursor {
                    box-shadow: 0 0 0 3px var(--button-primary-bg);
                    border-radius: 0.5rem;
                    animation: gamepad-pulse 1.5s infinite;
                }
                .theme-space .gamepad-cursor {
                    box-shadow: 0 0 0 3px var(--button-primary-bg), 0 0 8px var(--button-primary-bg);
                }
                @keyframes gamepad-pulse {
                    0%, 100% { transform: scale(1); }
                    50% { transform: scale(1.02); }
                }
            ` })
      ]
    }
  );
};
var Cell_default = Cell;

// components/AnimatedPiece.tsx
import { useState as useState2, useLayoutEffect } from "react";
import { jsx as jsx5 } from "react/jsx-runtime";
var AnimatedPiece = ({ animationInfo, boardRef, playerPiece, playerOPiece }) => {
  const [style, setStyle] = useState2({
    opacity: 0,
    position: "absolute",
    pointerEvents: "none",
    zIndex: 10,
    transition: "none"
    // Start with no transition
  });
  useLayoutEffect(() => {
    if (!animationInfo) {
      setStyle((prev) => ({ ...prev, opacity: 0, transition: "none" }));
      return;
    }
    let frameId;
    frameId = requestAnimationFrame(() => {
      const boardEl = boardRef.current;
      if (!boardEl) return;
      const { start, end } = animationInfo;
      const startCell = boardEl.querySelector(`[data-row='${start.r}'][data-col='${start.c}']`);
      const endCell = boardEl.querySelector(`[data-row='${end.r}'][data-col='${end.c}']`);
      if (!startCell || !endCell) {
        console.error("Animation failed: could not find start or end cell in the DOM.");
        return;
      }
      const boardRect = boardEl.getBoundingClientRect();
      const startRect = startCell.getBoundingClientRect();
      const endRect = endCell.getBoundingClientRect();
      const startX = startRect.left - boardRect.left;
      const startY = startRect.top - boardRect.top;
      const endX = endRect.left - boardRect.left;
      const endY = endRect.top - boardRect.top;
      const distance = Math.max(Math.abs(start.r - end.r), Math.abs(start.c - end.c));
      const duration = 200 + distance * 50;
      setStyle({
        position: "absolute",
        pointerEvents: "none",
        zIndex: 10,
        width: startRect.width,
        height: startRect.height,
        top: `${startY}px`,
        left: `${startX}px`,
        transform: "scale(1.1)",
        // Make it pop a little
        opacity: 1,
        transition: "none"
        // CRITICAL: No transition yet
      });
      const timeoutId = setTimeout(() => {
        setStyle((prev) => ({
          ...prev,
          // CRITICAL: Now we add the transition property
          transition: `top ${duration}ms cubic-bezier(0.4, 0, 0.6, 1), left ${duration}ms cubic-bezier(0.4, 0, 0.6, 1), transform ${duration}ms ease-out`,
          top: `${endY}px`,
          left: `${endX}px`,
          transform: "scale(1)"
          // Shrink back to normal size
        }));
      }, 20);
      return () => clearTimeout(timeoutId);
    });
    return () => cancelAnimationFrame(frameId);
  }, [animationInfo, boardRef]);
  if (!animationInfo) {
    return null;
  }
  const playerClass = animationInfo.player === "X" /* X */ ? "player-x-piece" : "player-o-piece";
  const displayPiece = animationInfo.player === "X" /* X */ ? playerPiece : playerOPiece;
  return /* @__PURE__ */ jsx5("div", { style, className: "text-[5.5vmin] lg:text-[42px] flex items-center justify-center font-bold piece-font leading-none text-center", children: /* @__PURE__ */ jsx5("span", { className: playerClass, children: displayPiece }) });
};
var AnimatedPiece_default = AnimatedPiece;

// components/Board.tsx
import { jsx as jsx6, jsxs as jsxs4 } from "react/jsx-runtime";
var Board = ({ board, onCellClick, validMoves, lastMove, winInfo, invalidMove, isThinking, tutorialHighlight, animationInfo, adaptiveLevel, gameMode, playerPiece, playerOPiece, highlightedPath, onCellHover, gamepadCursor, gamepadFocus, isGamepadConnected }) => {
  const boardRef = useRef2(null);
  const [lineData, setLineData] = useState3(null);
  const [isLineVisible, setIsLineVisible] = useState3(false);
  const isTouchDevice = useMemo2(() => {
    if (typeof window === "undefined") return false;
    return "ontouchstart" in window || navigator.maxTouchPoints > 0;
  }, []);
  const calculateAndSetLines = useCallback2(() => {
    const boardEl = boardRef.current;
    if (!winInfo || !boardEl) {
      setLineData(null);
      return false;
    }
    const lines = [];
    const boardRect = boardEl.getBoundingClientRect();
    if (boardRect.width === 0) return false;
    for (const line of winInfo) {
      const startCell = boardEl.querySelector(`[data-row='${line[0].r}'][data-col='${line[0].c}']`);
      const endCell = boardEl.querySelector(`[data-row='${line[line.length - 1].r}'][data-col='${line[line.length - 1].c}']`);
      if (!startCell || !endCell) {
        console.warn("Could not find cells for win line", line);
        continue;
      }
      const startRect = startCell.getBoundingClientRect();
      const endRect = endCell.getBoundingClientRect();
      const x1 = startRect.left + startRect.width / 2 - boardRect.left;
      const y1 = startRect.top + startRect.height / 2 - boardRect.top;
      const x2 = endRect.left + endRect.width / 2 - boardRect.left;
      const y2 = endRect.top + endRect.height / 2 - boardRect.top;
      const width = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
      const rotation = Math.atan2(y2 - y1, x2 - x1) * (180 / Math.PI);
      lines.push({
        x: x1,
        y: y1,
        width,
        rotation
      });
    }
    if (lines.length > 0) {
      setLineData(lines);
      return true;
    }
    return false;
  }, [winInfo]);
  useEffect2(() => {
    if (winInfo) {
      let animationFrameId;
      const attemptToDraw = () => {
        if (!calculateAndSetLines()) {
          animationFrameId = requestAnimationFrame(attemptToDraw);
        }
      };
      const timerId = setTimeout(attemptToDraw, 50);
      window.addEventListener("resize", calculateAndSetLines);
      return () => {
        clearTimeout(timerId);
        cancelAnimationFrame(animationFrameId);
        window.removeEventListener("resize", calculateAndSetLines);
      };
    } else {
      setLineData(null);
      setIsLineVisible(false);
    }
  }, [winInfo, calculateAndSetLines]);
  useEffect2(() => {
    if (lineData) {
      const animationTimer = setTimeout(() => {
        setIsLineVisible(true);
      }, 50);
      return () => clearTimeout(animationTimer);
    }
  }, [lineData]);
  const validMovesSet = new Set(validMoves.map((m) => `${m.r}-${m.c}`));
  const showValidMovesHighlight = gameMode === "pvc" /* PvC */ && adaptiveLevel < 2;
  const winPiecesSet = useMemo2(() => {
    if (!winInfo) return /* @__PURE__ */ new Set();
    return new Set(winInfo.flat().map((m) => `${m.r}-${m.c}`));
  }, [winInfo]);
  const highlightedPathSet = useMemo2(() => {
    return new Set(highlightedPath.map((m) => `${m.r}-${m.c}`));
  }, [highlightedPath]);
  const tutorialHighlightedCells = useMemo2(() => {
    if (!tutorialHighlight) return /* @__PURE__ */ new Set();
    if (tutorialHighlight.type === "border") {
      const cells = /* @__PURE__ */ new Set();
      for (let i = 0; i < BOARD_SIZE; i++) {
        cells.add(`${0}-${i}`);
        cells.add(`${BOARD_SIZE - 1}-${i}`);
        cells.add(`${i}-0`);
        cells.add(`${i}-${BOARD_SIZE - 1}`);
      }
      return cells;
    }
    if (tutorialHighlight.type === "cells" && tutorialHighlight.cells) {
      return new Set(tutorialHighlight.cells.map((m) => `${m.r}-${m.c}`));
    }
    return /* @__PURE__ */ new Set();
  }, [tutorialHighlight]);
  const isBoardFocused = gamepadFocus === "board";
  return /* @__PURE__ */ jsxs4(
    "div",
    {
      className: `relative w-[90vmin] max-w-[525px] lg:w-[525px] p-2 board-frame rounded-lg shadow-2xl transition-all duration-200 ${isBoardFocused && isGamepadConnected ? "gamepad-focus" : ""}`,
      ref: boardRef,
      children: [
        /* @__PURE__ */ jsx6(
          "div",
          {
            className: `aspect-square grid grid-cols-8 grid-rows-8 gap-0 transition-opacity duration-300 board-grid ${isThinking ? "cursor-wait opacity-60" : ""}`,
            onMouseLeave: () => {
              if (!isTouchDevice) onCellHover(null, null);
            },
            children: board.map(
              (row, r) => row.map((cell, c) => {
                const isCellValid = !winInfo && validMovesSet.has(`${r}-${c}`);
                const isWinningPiece = winPiecesSet.has(`${r}-${c}`);
                const isTutorialHighlighted = tutorialHighlightedCells.has(`${r}-${c}`);
                const isInvalidMoveAttempt = invalidMove?.r === r && invalidMove?.c === c;
                const isHighlightedPath = !isTouchDevice && highlightedPathSet.has(`${r}-${c}`);
                const isGamepadCursor = isGamepadConnected && isBoardFocused && gamepadCursor?.r === r && gamepadCursor?.c === c;
                return /* @__PURE__ */ jsx6(
                  Cell_default,
                  {
                    value: cell,
                    playerPiece,
                    playerOPiece,
                    isLastMove: lastMove?.r === r && lastMove?.c === c,
                    isValid: isCellValid && !cell,
                    highlightValid: showValidMovesHighlight && isCellValid,
                    isWinningPiece,
                    isTutorialHighlighted,
                    isInvalidMoveAttempt,
                    isHighlightedPath,
                    isGamepadCursor,
                    onHover: isTouchDevice ? () => {
                    } : onCellHover,
                    onClick: () => onCellClick(r, c),
                    "data-row": r,
                    "data-col": c
                  },
                  `${r}-${c}`
                );
              })
            )
          }
        ),
        /* @__PURE__ */ jsx6(AnimatedPiece_default, { animationInfo, boardRef, playerPiece, playerOPiece }),
        lineData && /* @__PURE__ */ jsxs4("svg", { className: "absolute top-0 left-0 w-full h-full pointer-events-none overflow-visible", children: [
          /* @__PURE__ */ jsx6("defs", { children: /* @__PURE__ */ jsxs4("filter", { id: "glow", x: "-50%", y: "-50%", width: "200%", height: "200%", children: [
            /* @__PURE__ */ jsx6("feGaussianBlur", { stdDeviation: "3.5", result: "coloredBlur" }),
            /* @__PURE__ */ jsxs4("feMerge", { children: [
              /* @__PURE__ */ jsx6("feMergeNode", { in: "coloredBlur" }),
              /* @__PURE__ */ jsx6("feMergeNode", { in: "SourceGraphic" })
            ] })
          ] }) }),
          lineData.map((line, index) => /* @__PURE__ */ jsx6("g", { transform: `translate(${line.x}, ${line.y}) rotate(${line.rotation})`, children: /* @__PURE__ */ jsx6(
            "rect",
            {
              x: "0",
              y: "-2.5",
              width: isLineVisible ? line.width : 0,
              height: "5",
              rx: "2.5",
              ry: "2.5",
              fill: "#ef4444",
              filter: "url(#glow)",
              style: {
                transition: "width 0.25s ease-out",
                transformOrigin: "center"
              }
            }
          ) }, index))
        ] })
      ]
    }
  );
};
var Board_default = Board;

// components/Controls.tsx
import { useState as useState6, useRef as useRef5, useEffect as useEffect4 } from "react";

// components/OnlineControls.tsx
import { useState as useState4, useRef as useRef3 } from "react";
import { jsx as jsx7, jsxs as jsxs5 } from "react/jsx-runtime";
var OnlineControls = ({ onlineRole, setOnlineRole, gameStateString, loadOnlineGame, currentPlayer, isGameOver, allDisabled, onUIClick, movesMade, gamepadFocus }) => {
  const [pastedCode, setPastedCode] = useState4("");
  const codeTextRef = useRef3(null);
  const [copySuccess, setCopySuccess] = useState4(false);
  const handleCopyCode = () => {
    onUIClick();
    if (codeTextRef.current) {
      navigator.clipboard.writeText(codeTextRef.current.value).then(() => {
        setCopySuccess(true);
        setTimeout(() => setCopySuccess(false), 2e3);
      }, (err) => {
        console.error("Could not copy text: ", err);
      });
    }
  };
  if (!onlineRole) {
    return /* @__PURE__ */ jsxs5("div", { className: "flex flex-col gap-2.5 w-full mt-4 pt-4 border-t lab-section", children: [
      /* @__PURE__ */ jsx7("p", { className: "text-center font-bold", children: "New Online Game" }),
      /* @__PURE__ */ jsxs5("div", { className: "grid grid-cols-2 gap-2.5", children: [
        /* @__PURE__ */ jsx7("button", { id: "online-start-x", onClick: () => setOnlineRole("X" /* X */), disabled: allDisabled, className: `control-button secondary-button transition-shadow ${gamepadFocus === "online-start-x" ? "gamepad-focus" : ""}`, children: "Start as X" }),
        /* @__PURE__ */ jsx7("button", { id: "online-join-o", onClick: () => setOnlineRole("O" /* O */), disabled: allDisabled, className: `control-button secondary-button transition-shadow ${gamepadFocus === "online-join-o" ? "gamepad-focus" : ""}`, children: "Join as O" })
      ] }),
      /* @__PURE__ */ jsxs5("div", { className: "flex items-center my-2", children: [
        /* @__PURE__ */ jsx7("hr", { className: "flex-grow border-[var(--panel-border)] opacity-50" }),
        /* @__PURE__ */ jsx7("span", { className: "px-2 text-xs uppercase", style: { color: "var(--text-panel)" }, children: "Or" }),
        /* @__PURE__ */ jsx7("hr", { className: "flex-grow border-[var(--panel-border)] opacity-50" })
      ] }),
      /* @__PURE__ */ jsx7("p", { className: "text-center font-bold", children: "Rejoin Game" }),
      /* @__PURE__ */ jsxs5("div", { className: "flex flex-col gap-2", children: [
        /* @__PURE__ */ jsx7("label", { htmlFor: "rejoin-code-input", className: "control-label", children: "Paste a game code to load it:" }),
        /* @__PURE__ */ jsx7(
          "textarea",
          {
            id: "rejoin-code-input",
            value: pastedCode,
            onChange: (e) => setPastedCode(e.target.value),
            className: `control-input w-full h-20 resize-none transition-shadow ${gamepadFocus === "rejoin-code-input" ? "gamepad-focus" : ""}`,
            placeholder: "Paste code here...",
            disabled: allDisabled
          }
        ),
        /* @__PURE__ */ jsx7("button", { id: "rejoin-load-button", onClick: () => {
          loadOnlineGame(pastedCode);
          setPastedCode("");
        }, disabled: allDisabled || !pastedCode, className: `control-button primary-button transition-shadow ${gamepadFocus === "rejoin-load-button" ? "gamepad-focus" : ""}`, children: "Load Game" })
      ] })
    ] });
  }
  const isMyTurn = onlineRole === currentPlayer && !isGameOver;
  return /* @__PURE__ */ jsxs5("div", { className: "flex flex-col gap-3 w-full mt-4 pt-4 border-t lab-section", children: [
    /* @__PURE__ */ jsxs5("div", { className: "text-center", children: [
      /* @__PURE__ */ jsxs5("p", { className: "font-bold text-lg m-0", children: [
        "You are Player ",
        onlineRole
      ] }),
      /* @__PURE__ */ jsx7("p", { className: "font-semibold control-label min-h-[20px]", children: isGameOver ? "Game Over!" : isMyTurn ? "It's your turn!" : `Waiting for Player ${currentPlayer}...` })
    ] }),
    isMyTurn && movesMade === 0 && /* @__PURE__ */ jsx7("p", { className: "text-center control-label mt-2 p-2 rounded", style: { backgroundColor: "rgba(0,0,0,0.05)" }, children: "Make your first move to generate a game code to share." }),
    !isMyTurn && !isGameOver && /* @__PURE__ */ jsxs5("div", { className: "flex flex-col gap-2", children: [
      /* @__PURE__ */ jsx7("label", { htmlFor: "game-code-input", className: "control-label", children: "Paste opponent's game code:" }),
      /* @__PURE__ */ jsx7(
        "textarea",
        {
          id: "game-code-input",
          value: pastedCode,
          onChange: (e) => setPastedCode(e.target.value),
          className: `control-input w-full h-24 resize-none transition-shadow ${gamepadFocus === "game-code-input" ? "gamepad-focus" : ""}`,
          placeholder: "Paste code here...",
          disabled: allDisabled
        }
      ),
      /* @__PURE__ */ jsx7("button", { id: "load-move-button", onClick: () => {
        loadOnlineGame(pastedCode);
        setPastedCode("");
      }, disabled: allDisabled || !pastedCode, className: `control-button primary-button transition-shadow ${gamepadFocus === "load-move-button" ? "gamepad-focus" : ""}`, children: "Load Move" })
    ] }),
    gameStateString && /* @__PURE__ */ jsxs5("div", { className: "flex flex-col gap-2 mt-2", children: [
      /* @__PURE__ */ jsx7("label", { htmlFor: "game-code-output", className: "control-label", children: "Share this code with your opponent:" }),
      /* @__PURE__ */ jsx7(
        "textarea",
        {
          id: "game-code-output",
          ref: codeTextRef,
          value: gameStateString,
          readOnly: true,
          className: `control-input w-full h-24 resize-none cursor-copy transition-shadow ${gamepadFocus === "game-code-output" ? "gamepad-focus" : ""}`,
          onFocus: (e) => e.target.select()
        }
      ),
      /* @__PURE__ */ jsx7("button", { id: "copy-code-button", onClick: handleCopyCode, disabled: allDisabled, className: `control-button secondary-button transition-shadow ${gamepadFocus === "copy-code-button" ? "gamepad-focus" : ""}`, children: copySuccess ? "Copied!" : "Copy Code" })
    ] })
  ] });
};
var OnlineControls_default = OnlineControls;

// components/ReleaseNotesModal.tsx
import { jsx as jsx8, jsxs as jsxs6 } from "react/jsx-runtime";
var ReleaseNotesModal = ({ onClose }) => {
  return /* @__PURE__ */ jsx8(
    "div",
    {
      className: "fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4 animate-fade-in-fast",
      onClick: onClose,
      children: /* @__PURE__ */ jsxs6(
        "div",
        {
          className: "component-panel rounded-lg p-6 max-w-lg w-full text-center relative transform animate-pop-in-modal max-h-[90vh] flex flex-col",
          onClick: (e) => e.stopPropagation(),
          children: [
            /* @__PURE__ */ jsx8("h2", { className: "text-3xl font-bold title-font mb-4", style: { color: "var(--text-header)" }, children: "Version 1.1.5 Patch Notes" }),
            /* @__PURE__ */ jsxs6("div", { className: "overflow-y-auto text-left space-y-4 text-base pr-2 -mr-2", children: [
              /* @__PURE__ */ jsx8("p", { children: "This is a small but important patch focused on polishing the user experience for both mouse and gamepad players based on user feedback." }),
              /* @__PURE__ */ jsxs6("div", { children: [
                /* @__PURE__ */ jsx8("h3", { className: "font-bold text-lg", style: { color: "var(--text-panel)" }, children: "Bug Fixes & Input Refinements" }),
                /* @__PURE__ */ jsxs6("ul", { className: "list-disc list-inside space-y-2 mt-2 text-sm", children: [
                  /* @__PURE__ */ jsxs6("li", { children: [
                    /* @__PURE__ */ jsx8("strong", { children: "Gamepad Cursor Visibility:" }),
                    " The square outline for the gamepad cursor is now correctly shown ",
                    /* @__PURE__ */ jsx8("em", { children: "only" }),
                    " when a controller is active and the board is focused. This declutters the view for mouse and touch users."
                  ] }),
                  /* @__PURE__ */ jsxs6("li", { children: [
                    /* @__PURE__ */ jsx8("strong", { children: "Mouse Hover Restored:" }),
                    " The subtle highlight that appears when hovering the mouse over a valid, empty cell has been restored, providing clear visual feedback for mouse users."
                  ] }),
                  /* @__PURE__ */ jsxs6("li", { children: [
                    /* @__PURE__ */ jsx8("strong", { children: "Valid Move Hints:" }),
                    " The visual aid that highlights all valid moves on Beginner and Novice difficulties now works correctly, regardless of whether a mouse or gamepad is being used."
                  ] })
                ] })
              ] })
            ] }),
            /* @__PURE__ */ jsx8("div", { className: "mt-6", children: /* @__PURE__ */ jsx8(
              "button",
              {
                onClick: onClose,
                className: "control-button primary-button w-full",
                children: "Close"
              }
            ) }),
            /* @__PURE__ */ jsx8("style", { children: `
                    @keyframes fade-in-fast { 
                        0% { opacity: 0; } 
                        100% { opacity: 1; } 
                    }
                    .animate-fade-in-fast { animation: fade-in-fast 0.2s ease-out; }

                    @keyframes pop-in-modal { 
                        0% { transform: scale(0.8) translateY(20px); opacity: 0; } 
                        100% { transform: scale(1) translateY(0); opacity: 1; } 
                    }
                    .animate-pop-in-modal { animation: pop-in-modal 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94); }
                ` })
          ]
        }
      )
    }
  );
};
var ReleaseNotesModal_default = ReleaseNotesModal;

// components/Tooltip.tsx
import { jsx as jsx9 } from "react/jsx-runtime";
var Tooltip = ({ text }) => {
  return /* @__PURE__ */ jsx9("div", { className: "tooltip", children: text });
};
var Tooltip_default = Tooltip;

// components/CustomSelect.tsx
import { useState as useState5, useRef as useRef4, useEffect as useEffect3 } from "react";
import { jsx as jsx10, jsxs as jsxs7 } from "react/jsx-runtime";
var CustomSelect = ({ id, options, value, onChange, disabled, gamepadFocus, onVisibilityChange }) => {
  const [isOpen, setIsOpen] = useState5(false);
  const wrapperRef = useRef4(null);
  const selectedLabel = options.find((opt) => opt.value === value)?.label || "";
  useEffect3(() => {
    const handleClickOutside = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        if (isOpen) {
          setIsOpen(false);
          onVisibilityChange(false);
        }
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, onVisibilityChange]);
  const handleToggle = () => {
    const newIsOpen = !isOpen;
    setIsOpen(newIsOpen);
    onVisibilityChange(newIsOpen);
  };
  const handleOptionClick = (newValue) => {
    onChange(newValue);
    setIsOpen(false);
    onVisibilityChange(false);
  };
  const isFocused = gamepadFocus === id;
  const isAnOptionFocused = gamepadFocus?.startsWith(`${id}-option-`);
  return /* @__PURE__ */ jsxs7("div", { className: "relative w-1/2", ref: wrapperRef, children: [
    /* @__PURE__ */ jsxs7(
      "button",
      {
        id,
        onClick: handleToggle,
        disabled,
        className: `control-select !w-full text-left flex justify-between items-center transition-shadow ${isFocused ? "gamepad-focus" : ""}`,
        "aria-haspopup": "listbox",
        "aria-expanded": isOpen,
        children: [
          /* @__PURE__ */ jsx10("span", { children: selectedLabel }),
          /* @__PURE__ */ jsx10("svg", { className: `w-4 h-4 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`, fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsx10("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: "2", d: "M19 9l-7 7-7-7" }) })
        ]
      }
    ),
    isOpen && /* @__PURE__ */ jsx10(
      "ul",
      {
        className: "absolute z-10 w-full mt-1 rounded-md shadow-lg component-panel border-2",
        style: { borderColor: "var(--panel-border)" },
        role: "listbox",
        children: options.map((option, index) => {
          const optionId = `${id}-option-${index}`;
          const isOptionFocused = gamepadFocus === optionId;
          return /* @__PURE__ */ jsx10("li", { children: /* @__PURE__ */ jsx10(
            "button",
            {
              id: optionId,
              onClick: () => handleOptionClick(option.value),
              className: `w-full text-left px-3 py-2 text-sm hover:bg-[var(--button-secondary-hover-bg)] ${option.value === value ? "font-bold" : ""} ${index === 0 ? "rounded-t" : ""} ${index === options.length - 1 ? "rounded-b" : ""} ${isOptionFocused ? "gamepad-focus !rounded" : ""}`,
              role: "option",
              "aria-selected": option.value === value,
              children: option.label
            }
          ) }, option.value);
        })
      }
    )
  ] });
};
var CustomSelect_default = CustomSelect;

// components/Controls.tsx
import { jsx as jsx11, jsxs as jsxs8 } from "react/jsx-runtime";
var SectionHeader = ({ children }) => /* @__PURE__ */ jsx11("h3", { className: "text-sm font-bold uppercase tracking-wider mb-2 mt-4 first:mt-0 section-header", children });
var Controls = ({
  gameMode,
  setGameMode,
  onReset,
  isSimulating,
  onStartSimulation,
  onStopSimulation,
  onImportMemory,
  onExportMemory,
  isTutorialActive,
  isAnimationEnabled,
  onToggleAnimation,
  isScreenShakeEnabled,
  onToggleScreenShakeEnabled,
  theme,
  onToggleTheme,
  isHapticEnabled,
  onToggleHapticEnabled,
  onlineRole,
  setOnlineRole,
  gameStateString,
  loadOnlineGame,
  currentPlayer,
  gameOver,
  movesMade,
  adaptiveLevel,
  autoAdjustLevel,
  isLabUnlocked,
  isAiLearningEnabled,
  onToggleAutoAdjustLevel,
  onSetAdaptiveLevel,
  onToggleAiLearning,
  playerName,
  playerPiece,
  onSetPlayerName,
  onSetPlayerPiece,
  playerOName,
  playerOPiece,
  onSetPlayerOName,
  onSetPlayerOPiece,
  onUIClick,
  gamepadFocus,
  onOpenVirtualKeyboard,
  onSelectVisibilityChange
}) => {
  const [simGames, setSimGames] = useState6(100);
  const [isLabOpen, setIsLabOpen] = useState6(false);
  const fileInputRef = useRef5(null);
  const [activeTab, setActiveTab] = useState6("setup");
  const [showReleaseNotesModal, setShowReleaseNotesModal] = useState6(false);
  const [activeTooltip, setActiveTooltip] = useState6(null);
  const appVersion = "1.1.5";
  const [tempPlayerName, setTempPlayerName] = useState6(playerName);
  const [tempPlayerPiece, setTempPlayerPiece] = useState6(playerPiece);
  const [tempPlayerOName, setTempPlayerOName] = useState6(playerOName);
  const [tempPlayerOPiece, setTempPlayerOPiece] = useState6(playerOPiece);
  const [isSaved, setIsSaved] = useState6(false);
  useEffect4(() => {
    if (gamepadFocus?.startsWith("tab-")) {
      const tabName = gamepadFocus.split("-")[1];
      if (tabName !== activeTab) {
        setActiveTab(tabName);
      }
    }
  }, [gamepadFocus, activeTab]);
  useEffect4(() => {
    setTempPlayerName(playerName);
  }, [playerName]);
  useEffect4(() => {
    setTempPlayerPiece(playerPiece);
  }, [playerPiece]);
  useEffect4(() => {
    setTempPlayerOName(playerOName);
  }, [playerOName]);
  useEffect4(() => {
    setTempPlayerOPiece(playerOPiece);
  }, [playerOPiece]);
  const hasP1Changes = tempPlayerName !== playerName || tempPlayerPiece !== playerPiece;
  const hasP2Changes = tempPlayerOName !== playerOName || tempPlayerOPiece !== playerOPiece;
  const hasChanges = hasP1Changes || gameMode === "pvp" /* PvP */ && hasP2Changes;
  const handleApplyChanges = () => {
    onUIClick();
    if (hasP1Changes) {
      onSetPlayerName(tempPlayerName);
      onSetPlayerPiece(tempPlayerPiece);
    }
    if (gameMode === "pvp" /* PvP */ && hasP2Changes) {
      onSetPlayerOName(tempPlayerOName);
      onSetPlayerOPiece(tempPlayerOPiece);
    }
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2e3);
  };
  const handleImportClick = () => {
    onUIClick();
    fileInputRef.current?.click();
  };
  const handleFileChange = (event) => {
    const file = event.target.files?.[0];
    if (file) {
      onImportMemory(file);
    }
    event.target.value = "";
  };
  const showLabControls = gameMode === "pvc" /* PvC */ && isLabUnlocked;
  const allDisabled = isSimulating || isTutorialActive;
  return /* @__PURE__ */ jsxs8("div", { className: "flex flex-col items-stretch w-11/12 lg:w-full gap-2.5 p-4 rounded-lg component-panel", children: [
    /* @__PURE__ */ jsx11(SectionHeader, { children: "Actions" }),
    /* @__PURE__ */ jsx11(
      "button",
      {
        id: "new-game-button",
        onClick: onReset,
        disabled: allDisabled,
        className: `control-button primary-button w-full transition-shadow ${gamepadFocus === "new-game-button" ? "gamepad-focus" : ""}`,
        children: "New Game"
      }
    ),
    /* @__PURE__ */ jsxs8("div", { className: "tab-nav mt-4", children: [
      /* @__PURE__ */ jsx11("button", { id: "tab-setup", className: `tab-button ${activeTab === "setup" ? "active" : ""} ${gamepadFocus === "tab-setup" ? "gamepad-focus" : ""}`, onClick: () => {
        onUIClick();
        setActiveTab("setup");
      }, disabled: allDisabled, children: "Setup" }),
      /* @__PURE__ */ jsx11("button", { id: "tab-profile", className: `tab-button ${activeTab === "profile" ? "active" : ""} ${gamepadFocus === "tab-profile" ? "gamepad-focus" : ""}`, onClick: () => {
        onUIClick();
        setActiveTab("profile");
      }, disabled: allDisabled, children: "Profile" }),
      /* @__PURE__ */ jsx11("button", { id: "tab-options", className: `tab-button ${activeTab === "options" ? "active" : ""} ${gamepadFocus === "tab-options" ? "gamepad-focus" : ""}`, onClick: () => {
        onUIClick();
        setActiveTab("options");
      }, disabled: allDisabled, children: "Options" }),
      /* @__PURE__ */ jsx11("button", { id: "tab-about", className: `tab-button ${activeTab === "about" ? "active" : ""} ${gamepadFocus === "tab-about" ? "gamepad-focus" : ""}`, onClick: () => {
        onUIClick();
        setActiveTab("about");
      }, disabled: allDisabled, children: "About" })
    ] }),
    /* @__PURE__ */ jsxs8("div", { className: "tab-content", children: [
      activeTab === "setup" && /* @__PURE__ */ jsxs8("div", { className: "animate-fade-in-fast", children: [
        /* @__PURE__ */ jsx11(SectionHeader, { children: "Game Setup" }),
        /* @__PURE__ */ jsxs8("div", { className: `game-mode-toggle ${gamepadFocus?.startsWith("gamemode-") ? "gamepad-focus" : ""}`, children: [
          /* @__PURE__ */ jsx11(
            "button",
            {
              id: "gamemode-pvc",
              onClick: () => setGameMode("pvc" /* PvC */),
              disabled: allDisabled,
              className: `toggle-option ${gameMode === "pvc" /* PvC */ ? "active" : ""} ${gamepadFocus === "gamemode-pvc" ? "!bg-opacity-75" : ""}`,
              children: "vs. Professor Caz"
            }
          ),
          /* @__PURE__ */ jsx11(
            "button",
            {
              id: "gamemode-pvp",
              onClick: () => setGameMode("pvp" /* PvP */),
              disabled: allDisabled,
              className: `toggle-option ${gameMode === "pvp" /* PvP */ ? "active" : ""} ${gamepadFocus === "gamemode-pvp" ? "!bg-opacity-75" : ""}`,
              children: "vs. Player"
            }
          ),
          /* @__PURE__ */ jsx11(
            "button",
            {
              id: "gamemode-online",
              onClick: () => setGameMode("online" /* Online */),
              disabled: allDisabled,
              className: `toggle-option ${gameMode === "online" /* Online */ ? "active" : ""} ${gamepadFocus === "gamemode-online" ? "!bg-opacity-75" : ""}`,
              children: "Online"
            }
          )
        ] }),
        gameMode === "pvc" /* PvC */ && /* @__PURE__ */ jsxs8("div", { className: "flex flex-col gap-2 mt-2 pt-2", children: [
          /* @__PURE__ */ jsxs8("div", { className: "control-row", children: [
            /* @__PURE__ */ jsx11("label", { htmlFor: "auto-adjust-check", className: "control-label", children: "Auto-Adjust Level:" }),
            /* @__PURE__ */ jsxs8("div", { className: "tooltip-container", onMouseEnter: () => setActiveTooltip("auto-adjust"), onMouseLeave: () => setActiveTooltip(null), children: [
              /* @__PURE__ */ jsx11(
                "button",
                {
                  id: "auto-adjust-toggle",
                  role: "switch",
                  "aria-checked": autoAdjustLevel,
                  onClick: onToggleAutoAdjustLevel,
                  disabled: allDisabled,
                  className: `toggle-switch ${autoAdjustLevel ? "active" : ""} ${gamepadFocus === "auto-adjust-toggle" ? "gamepad-focus" : ""}`,
                  children: /* @__PURE__ */ jsx11("span", { className: "toggle-switch-handle" })
                }
              ),
              activeTooltip === "auto-adjust" && /* @__PURE__ */ jsx11(Tooltip_default, { text: "Automatically adjusts difficulty based on your performance." })
            ] })
          ] }),
          /* @__PURE__ */ jsxs8("div", { className: "control-row", children: [
            /* @__PURE__ */ jsx11("label", { htmlFor: "difficulty-level", className: "control-label", children: "Level:" }),
            /* @__PURE__ */ jsx11(
              CustomSelect_default,
              {
                id: "difficulty-select",
                value: adaptiveLevel,
                options: AI_LEVELS.map((level, index) => ({ value: index, label: level.name })),
                onChange: (value) => onSetAdaptiveLevel(value),
                disabled: allDisabled || autoAdjustLevel,
                gamepadFocus,
                onVisibilityChange: onSelectVisibilityChange
              }
            )
          ] })
        ] }),
        gameMode === "online" /* Online */ && /* @__PURE__ */ jsx11(
          OnlineControls_default,
          {
            onlineRole,
            setOnlineRole,
            gameStateString,
            loadOnlineGame,
            currentPlayer,
            isGameOver: gameOver,
            movesMade,
            allDisabled,
            onUIClick,
            gamepadFocus
          }
        )
      ] }),
      activeTab === "profile" && /* @__PURE__ */ jsxs8("div", { className: "animate-fade-in-fast", children: [
        /* @__PURE__ */ jsx11(SectionHeader, { children: "Personalization" }),
        /* @__PURE__ */ jsxs8("div", { className: "flex flex-col gap-2", children: [
          /* @__PURE__ */ jsx11("h4", { className: "font-semibold text-center -mb-1", style: { color: "var(--text-panel)" }, children: gameMode === "pvp" /* PvP */ ? "Player 1 (X)" : "Your Profile" }),
          /* @__PURE__ */ jsxs8("div", { className: "control-row", children: [
            /* @__PURE__ */ jsx11("label", { htmlFor: "player-name-input", className: "control-label flex-shrink-0", children: "Name:" }),
            /* @__PURE__ */ jsx11("div", { className: "flex-grow min-w-0", children: /* @__PURE__ */ jsx11(
              "button",
              {
                id: "player-name-input",
                onClick: () => onOpenVirtualKeyboard("player-name-input", tempPlayerName, setTempPlayerName),
                disabled: allDisabled,
                className: `input-as-button w-full transition-shadow ${gamepadFocus === "player-name-input" ? "gamepad-focus" : ""}`,
                children: tempPlayerName || /* @__PURE__ */ jsx11("span", { className: "opacity-50", children: "Enter name..." })
              }
            ) })
          ] }),
          /* @__PURE__ */ jsxs8("div", { className: "control-row", children: [
            /* @__PURE__ */ jsx11("label", { htmlFor: "player-piece-input", className: "control-label", children: "Piece:" }),
            /* @__PURE__ */ jsx11("div", { className: "w-20", children: /* @__PURE__ */ jsx11(
              "button",
              {
                id: "player-piece-input",
                onClick: () => onOpenVirtualKeyboard("player-piece-input", tempPlayerPiece, setTempPlayerPiece),
                disabled: allDisabled,
                className: `input-as-button w-full text-center transition-shadow ${gamepadFocus === "player-piece-input" ? "gamepad-focus" : ""}`,
                children: tempPlayerPiece || /* @__PURE__ */ jsx11("span", { className: "opacity-50", children: "X" })
              }
            ) })
          ] })
        ] }),
        gameMode === "pvp" /* PvP */ && /* @__PURE__ */ jsxs8("div", { className: "flex flex-col gap-2 mt-4 pt-4 border-t lab-section", children: [
          /* @__PURE__ */ jsx11("h4", { className: "font-semibold text-center -mb-1", style: { color: "var(--text-panel)" }, children: "Player 2 (O)" }),
          /* @__PURE__ */ jsxs8("div", { className: "control-row", children: [
            /* @__PURE__ */ jsx11("label", { htmlFor: "player-o-name-input", className: "control-label flex-shrink-0", children: "Name:" }),
            /* @__PURE__ */ jsx11("div", { className: "flex-grow min-w-0", children: /* @__PURE__ */ jsx11(
              "button",
              {
                id: "player-o-name-input",
                onClick: () => onOpenVirtualKeyboard("player-o-name-input", tempPlayerOName, setTempPlayerOName),
                disabled: allDisabled,
                className: `input-as-button w-full transition-shadow ${gamepadFocus === "player-o-name-input" ? "gamepad-focus" : ""}`,
                children: tempPlayerOName || /* @__PURE__ */ jsx11("span", { className: "opacity-50", children: "Player O..." })
              }
            ) })
          ] }),
          /* @__PURE__ */ jsxs8("div", { className: "control-row", children: [
            /* @__PURE__ */ jsx11("label", { htmlFor: "player-o-piece-input", className: "control-label", children: "Piece:" }),
            /* @__PURE__ */ jsx11("div", { className: "w-20", children: /* @__PURE__ */ jsx11(
              "button",
              {
                id: "player-o-piece-input",
                onClick: () => onOpenVirtualKeyboard("player-o-piece-input", tempPlayerOPiece, setTempPlayerOPiece),
                disabled: allDisabled,
                className: `input-as-button w-full text-center transition-shadow ${gamepadFocus === "player-o-piece-input" ? "gamepad-focus" : ""}`,
                children: tempPlayerOPiece || /* @__PURE__ */ jsx11("span", { className: "opacity-50", children: "O" })
              }
            ) })
          ] })
        ] }),
        /* @__PURE__ */ jsxs8("div", { className: "mt-4 flex items-center justify-end gap-2", children: [
          isSaved && /* @__PURE__ */ jsx11("span", { className: "text-sm animate-fade-in-fast", style: { color: "var(--toggle-active-bg)" }, children: "Saved!" }),
          /* @__PURE__ */ jsx11("button", { id: "profile-apply-button", onClick: handleApplyChanges, disabled: allDisabled || !hasChanges, className: `control-button primary-button transition-shadow ${gamepadFocus === "profile-apply-button" ? "gamepad-focus" : ""}`, children: "Apply" })
        ] })
      ] }),
      activeTab === "options" && /* @__PURE__ */ jsxs8("div", { className: "animate-fade-in-fast", children: [
        /* @__PURE__ */ jsx11(SectionHeader, { children: "Preferences" }),
        /* @__PURE__ */ jsxs8("div", { className: "control-row", children: [
          /* @__PURE__ */ jsx11("label", { htmlFor: "enable-animations-check", className: "control-label", children: "Animations:" }),
          /* @__PURE__ */ jsxs8("div", { className: "tooltip-container", onMouseEnter: () => setActiveTooltip("animations"), onMouseLeave: () => setActiveTooltip(null), children: [
            /* @__PURE__ */ jsx11(
              "button",
              {
                id: "animations-toggle",
                role: "switch",
                "aria-checked": isAnimationEnabled,
                onClick: onToggleAnimation,
                disabled: allDisabled,
                className: `toggle-switch ${isAnimationEnabled ? "active" : ""} ${gamepadFocus === "animations-toggle" ? "gamepad-focus" : ""}`,
                children: /* @__PURE__ */ jsx11("span", { className: "toggle-switch-handle" })
              }
            ),
            activeTooltip === "animations" && /* @__PURE__ */ jsx11(Tooltip_default, { text: "Enables the piece sliding animation." })
          ] })
        ] }),
        /* @__PURE__ */ jsxs8("div", { className: "control-row", children: [
          /* @__PURE__ */ jsx11("label", { htmlFor: "enable-shake-check", className: "control-label", children: "Screen Shake:" }),
          /* @__PURE__ */ jsxs8("div", { className: "tooltip-container", onMouseEnter: () => setActiveTooltip("shake"), onMouseLeave: () => setActiveTooltip(null), children: [
            /* @__PURE__ */ jsx11(
              "button",
              {
                id: "shake-toggle",
                role: "switch",
                "aria-checked": isScreenShakeEnabled,
                onClick: onToggleScreenShakeEnabled,
                disabled: allDisabled,
                className: `toggle-switch ${isScreenShakeEnabled ? "active" : ""} ${gamepadFocus === "shake-toggle" ? "gamepad-focus" : ""}`,
                children: /* @__PURE__ */ jsx11("span", { className: "toggle-switch-handle" })
              }
            ),
            activeTooltip === "shake" && /* @__PURE__ */ jsx11(Tooltip_default, { text: "Adds a subtle shake effect when a piece lands." })
          ] })
        ] }),
        "vibrate" in navigator && /* @__PURE__ */ jsxs8("div", { className: "control-row", children: [
          /* @__PURE__ */ jsx11("label", { htmlFor: "enable-haptics-check", className: "control-label", children: "Vibrations:" }),
          /* @__PURE__ */ jsxs8("div", { className: "tooltip-container", onMouseEnter: () => setActiveTooltip("haptics"), onMouseLeave: () => setActiveTooltip(null), children: [
            /* @__PURE__ */ jsx11(
              "button",
              {
                id: "haptics-toggle",
                role: "switch",
                "aria-checked": isHapticEnabled,
                onClick: onToggleHapticEnabled,
                disabled: allDisabled,
                className: `toggle-switch ${isHapticEnabled ? "active" : ""} ${gamepadFocus === "haptics-toggle" ? "gamepad-focus" : ""}`,
                children: /* @__PURE__ */ jsx11("span", { className: "toggle-switch-handle" })
              }
            ),
            activeTooltip === "haptics" && /* @__PURE__ */ jsx11(Tooltip_default, { text: "Enables vibration feedback on supported devices." })
          ] })
        ] }),
        /* @__PURE__ */ jsxs8("div", { className: "control-row", children: [
          /* @__PURE__ */ jsx11("label", { htmlFor: "theme-switcher", className: "control-label", children: "Theme:" }),
          /* @__PURE__ */ jsxs8("div", { className: "tooltip-container w-1/2", onMouseEnter: () => setActiveTooltip("theme"), onMouseLeave: () => setActiveTooltip(null), children: [
            /* @__PURE__ */ jsx11(
              "button",
              {
                id: "theme-toggle",
                onClick: onToggleTheme,
                disabled: allDisabled,
                className: `control-button secondary-button w-full transition-shadow ${gamepadFocus === "theme-toggle" ? "gamepad-focus" : ""}`,
                children: theme === "science" ? "Cosmic" : "Science"
              }
            ),
            activeTooltip === "theme" && /* @__PURE__ */ jsx11(Tooltip_default, { text: "Switch between the 'Science' and 'Cosmic' visual themes." })
          ] })
        ] })
      ] }),
      activeTab === "about" && /* @__PURE__ */ jsxs8("div", { className: "animate-fade-in-fast text-sm", children: [
        /* @__PURE__ */ jsx11(SectionHeader, { children: "Join the Community" }),
        /* @__PURE__ */ jsxs8("div", { className: "flex flex-col gap-2.5", children: [
          /* @__PURE__ */ jsx11("a", { href: "https://sengle.itch.io/caz-connect", target: "_blank", rel: "noopener noreferrer", className: "control-button secondary-button text-center", children: "Support on Itch.io" }),
          /* @__PURE__ */ jsx11("a", { href: "https://discord.gg/uAm43yApGY", target: "_blank", rel: "noopener noreferrer", className: "control-button secondary-button text-center", children: "Join our Discord" })
        ] }),
        /* @__PURE__ */ jsx11(SectionHeader, { children: "Think You Know Connect-Four? Think Again." }),
        /* @__PURE__ */ jsxs8("p", { className: "mb-2", children: [
          'Deep in the halls of Cazenovia High, during an ordinary AP Science class, a new game was born. A few bored geeks took a classic concept and asked a simple question: what if you could only play on the edges? The result was "8 by 8", a strategic challenge that will change the way you think about connecting four. Years later, former student ',
          /* @__PURE__ */ jsx11("strong", { children: "IJuan" }),
          " rediscovered the rules and brought the game to the digital world for all to enjoy as ",
          /* @__PURE__ */ jsx11("strong", { children: "Caz Connect" }),
          "."
        ] }),
        /* @__PURE__ */ jsxs8("p", { className: "mb-4", children: [
          "Meet your host, ",
          /* @__PURE__ */ jsx11("strong", { children: "Professor Caz" }),
          ', the wise owl who has perfected this unique game of "four-way gravity." In his world, every piece must be supported. Your journey begins on the outer walls of the 8x8 grid. From there, you must build solid, unbroken lines of your pieces\u2014we call them "gravity bridges"\u2014to venture into the center of the board.'
        ] }),
        /* @__PURE__ */ jsx11("p", { className: "mb-4", children: "Block your opponent, plan your bridges, and use the walls to your advantage to connect four of your pieces in any direction. With a highly intelligent AI featuring adjustable difficulty levels (from a friendly newcomer to a strategic expert) and a polished local multiplayer mode (and a beta online multiplayer mode), there's always a new challenge waiting." }),
        /* @__PURE__ */ jsx11("p", { className: "mb-4", children: "Developed from a simple idea into a full-featured game, Caz Connect includes:" }),
        /* @__PURE__ */ jsxs8("ul", { className: "list-disc list-inside space-y-2 mb-4", children: [
          /* @__PURE__ */ jsxs8("li", { children: [
            /* @__PURE__ */ jsx11("strong", { children: "A Whole New Spin on a Classic:" }),
            ` The "Gravity Connection" rule changes everything! You can only place a piece if it has an unbroken line of other pieces connecting it to an outer wall. It's a simple concept with deep strategic complexity that will challenge you on every move.`
          ] }),
          /* @__PURE__ */ jsxs8("li", { children: [
            /* @__PURE__ */ jsx11("strong", { children: "Challenge the Eccentric Professor Caz:" }),
            ' Face off against the legendary professor! Our advanced AI features multiple difficulty levels, from "Beginner" to the truly formidable "Grand Master." But be warned\u2014he learns.'
          ] }),
          /* @__PURE__ */ jsxs8("li", { children: [
            /* @__PURE__ */ jsx11("strong", { children: "Unlock the Professor's Secret Lab:" }),
            ` Prove your genius to gain access to the professor's inner sanctum. Here, you can train the AI through game simulations, import and export its "brain," and enable its advanced learning mode to create the ultimate opponent.`
          ] }),
          /* @__PURE__ */ jsxs8("li", { children: [
            /* @__PURE__ */ jsx11("strong", { children: "Multiple Ways to Play:" }),
            " Go head-to-head with friends in local Player-vs-Player mode, take on the ever-improving AI, or share simple game codes for turn-based asynchronous online matches."
          ] }),
          /* @__PURE__ */ jsxs8("li", { children: [
            /* @__PURE__ */ jsx11("strong", { children: "Personalize Your Game:" }),
            ' Choose your aesthetic\u2014the quirky chalk-and-notebook "Science" theme or the sleek, futuristic "Cosmic" theme. Customize your player name and piece to make your mark!'
          ] }),
          /* @__PURE__ */ jsxs8("li", { children: [
            /* @__PURE__ */ jsx11("strong", { children: "Unlock Achievements & Track Your Stats:" }),
            " From your very first victory to the monumental feat of defeating the Grand Master, earn dozens of achievements and track your career stats to prove your intellectual dominance."
          ] }),
          /* @__PURE__ */ jsxs8("li", { children: [
            /* @__PURE__ */ jsx11("strong", { children: "Installable & Offline-Ready:" }),
            " As a Progressive Web App (PWA), you can install Caz Connect directly to your home screen for a full-screen, offline-ready experience anytime, anywhere."
          ] })
        ] }),
        /* @__PURE__ */ jsxs8("button", { onClick: () => setShowReleaseNotesModal(true), className: "text-center text-xs opacity-60 mt-6 hover:opacity-100 transition-opacity", children: [
          "Version: ",
          appVersion
        ] })
      ] })
    ] }),
    showLabControls && /* @__PURE__ */ jsxs8("div", { className: "flex flex-col gap-2.5 w-full mt-4 pt-4 border-t lab-section", children: [
      /* @__PURE__ */ jsxs8(
        "button",
        {
          id: "lab-toggle",
          onClick: () => {
            onUIClick();
            setIsLabOpen(!isLabOpen);
          },
          disabled: allDisabled,
          className: `flex items-center justify-between w-full text-left disabled:opacity-50 p-1 ${gamepadFocus === "lab-toggle" ? "gamepad-focus" : ""}`,
          children: [
            /* @__PURE__ */ jsx11("span", { className: "text-sm font-bold uppercase tracking-wider section-header", children: "Professor's Lab (Training)" }),
            /* @__PURE__ */ jsx11("svg", { className: `w-5 h-5 transition-transform duration-200 lab-arrow ${isLabOpen ? "transform rotate-180" : ""}`, fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", xmlns: "http://www.w3.org/2000/svg", children: /* @__PURE__ */ jsx11("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: "2", d: "M19 9l-7 7-7-7" }) })
          ]
        }
      ),
      isLabOpen && /* @__PURE__ */ jsxs8("div", { className: "flex flex-col gap-2.5 w-full mt-2 animate-fade-in", children: [
        /* @__PURE__ */ jsxs8("div", { className: "control-row", children: [
          /* @__PURE__ */ jsx11("label", { htmlFor: "ai-learning-check", className: "control-label", children: "Allow Professor Caz to Learn:" }),
          /* @__PURE__ */ jsxs8("div", { className: "tooltip-container", onMouseEnter: () => setActiveTooltip("ai-learn"), onMouseLeave: () => setActiveTooltip(null), children: [
            /* @__PURE__ */ jsx11(
              "button",
              {
                id: "ai-learn-toggle",
                role: "switch",
                "aria-checked": isAiLearningEnabled,
                onClick: onToggleAiLearning,
                disabled: allDisabled,
                className: `toggle-switch ${isAiLearningEnabled ? "active" : ""} ${gamepadFocus === "ai-learn-toggle" ? "gamepad-focus" : ""}`,
                children: /* @__PURE__ */ jsx11("span", { className: "toggle-switch-handle" })
              }
            ),
            activeTooltip === "ai-learn" && /* @__PURE__ */ jsx11(Tooltip_default, { text: "Enables AI to remember past games on higher difficulties." })
          ] })
        ] }),
        /* @__PURE__ */ jsxs8("div", { className: "control-row", children: [
          /* @__PURE__ */ jsx11("label", { htmlFor: "sim-games-input", className: "control-label", children: "Simulate Games:" }),
          /* @__PURE__ */ jsxs8("div", { className: "tooltip-container", onMouseEnter: () => setActiveTooltip("sim-games"), onMouseLeave: () => setActiveTooltip(null), children: [
            /* @__PURE__ */ jsx11(
              "input",
              {
                type: "number",
                id: "sim-games-input",
                value: simGames,
                onChange: (e) => setSimGames(parseInt(e.target.value, 10)),
                min: "1",
                max: "10000",
                disabled: allDisabled,
                className: `control-input w-24 text-center transition-shadow ${gamepadFocus === "sim-games-input" ? "gamepad-focus" : ""}`
              }
            ),
            activeTooltip === "sim-games" && /* @__PURE__ */ jsx11(Tooltip_default, { text: "Set how many games the AI plays against itself to learn." })
          ] })
        ] }),
        !isSimulating ? /* @__PURE__ */ jsx11("button", { id: "start-training-button", onClick: () => onStartSimulation(simGames), disabled: isTutorialActive, className: `control-button secondary-button bg-green-500 text-white transition-shadow ${gamepadFocus === "start-training-button" ? "gamepad-focus" : ""}`, children: "Start Training" }) : /* @__PURE__ */ jsx11("button", { id: "stop-training-button", onClick: onStopSimulation, className: `control-button primary-button transition-shadow ${gamepadFocus === "stop-training-button" ? "gamepad-focus" : ""}`, children: "Stop Training" }),
        /* @__PURE__ */ jsxs8("div", { className: "flex gap-2.5", children: [
          /* @__PURE__ */ jsxs8("div", { className: "tooltip-container flex-grow", onMouseEnter: () => setActiveTooltip("import-brain"), onMouseLeave: () => setActiveTooltip(null), children: [
            /* @__PURE__ */ jsx11("button", { id: "import-brain-button", onClick: handleImportClick, disabled: allDisabled, className: `control-button secondary-button w-full transition-shadow ${gamepadFocus === "import-brain-button" ? "gamepad-focus" : ""}`, children: "Import Brain" }),
            activeTooltip === "import-brain" && /* @__PURE__ */ jsx11(Tooltip_default, { text: "Load a previously exported AI 'brain' file." })
          ] }),
          /* @__PURE__ */ jsxs8("div", { className: "tooltip-container flex-grow", onMouseEnter: () => setActiveTooltip("export-brain"), onMouseLeave: () => setActiveTooltip(null), children: [
            /* @__PURE__ */ jsx11("button", { id: "export-brain-button", onClick: onExportMemory, disabled: allDisabled, className: `control-button secondary-button w-full transition-shadow ${gamepadFocus === "export-brain-button" ? "gamepad-focus" : ""}`, children: "Export Brain" }),
            activeTooltip === "export-brain" && /* @__PURE__ */ jsx11(Tooltip_default, { text: "Save the AI's current learned patterns to a file." })
          ] })
        ] }),
        /* @__PURE__ */ jsx11("input", { type: "file", ref: fileInputRef, onChange: handleFileChange, accept: ".json", className: "hidden" })
      ] })
    ] }),
    showReleaseNotesModal && /* @__PURE__ */ jsx11(ReleaseNotesModal_default, { onClose: () => setShowReleaseNotesModal(false) }),
    /* @__PURE__ */ jsx11("style", { children: `
                @keyframes fade-in { 
                    0% { opacity: 0; transform: translateY(-10px); } 
                    100% { opacity: 1; transform: translateY(0); } 
                }
                .animate-fade-in { animation: fade-in 0.3s ease-out; }

                @keyframes fade-in-fast { 
                    0% { opacity: 0; } 
                    100% { opacity: 1; } 
                }
                .animate-fade-in-fast { animation: fade-in-fast 0.2s ease-out; }
            ` })
  ] });
};
var Controls_default = Controls;

// components/InstallPrompt.tsx
import { jsx as jsx12, jsxs as jsxs9 } from "react/jsx-runtime";
var InstallPrompt = ({ onInstall, onDismiss }) => {
  return /* @__PURE__ */ jsx12("div", { className: "fixed bottom-0 left-0 right-0 p-4 z-50 transform translate-y-0 transition-transform duration-300 ease-in-out prompt-panel", children: /* @__PURE__ */ jsxs9("div", { className: "max-w-xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left", children: [
    /* @__PURE__ */ jsxs9("div", { className: "flex-grow", children: [
      /* @__PURE__ */ jsx12("h3", { className: "m-0 mb-1 text-lg font-semibold", children: "Install Caz Connect" }),
      /* @__PURE__ */ jsx12("p", { className: "m-0 text-sm leading-snug", children: "Add to your Home Screen for a full-screen, offline experience!" })
    ] }),
    /* @__PURE__ */ jsxs9("div", { className: "flex gap-2.5 flex-shrink-0", children: [
      /* @__PURE__ */ jsx12("button", { onClick: onInstall, className: "py-2 px-4 font-semibold rounded-lg bg-green-500 text-white", children: "Install" }),
      /* @__PURE__ */ jsx12("button", { onClick: onDismiss, className: "py-2 px-4 font-semibold rounded-lg bg-slate-400/50 text-slate-800", children: "Later" })
    ] })
  ] }) });
};
var InstallPrompt_default = InstallPrompt;

// components/TutorialMessage.tsx
import { jsx as jsx13, jsxs as jsxs10 } from "react/jsx-runtime";
var TutorialMessage = ({ text, showNext, onNext, onSkip }) => {
  return /* @__PURE__ */ jsxs10("div", { className: "fixed bottom-0 left-0 right-0 p-4 z-50 transform translate-y-0 transition-transform duration-300 ease-in-out animate-slide-up prompt-panel", children: [
    /* @__PURE__ */ jsxs10("div", { className: "max-w-xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left", children: [
      /* @__PURE__ */ jsxs10("div", { className: "flex-grow", children: [
        /* @__PURE__ */ jsx13("h3", { className: "m-0 mb-1 text-lg font-semibold", children: "Professor Caz's Lesson" }),
        /* @__PURE__ */ jsx13("p", { className: "m-0 text-sm leading-snug", children: text })
      ] }),
      /* @__PURE__ */ jsxs10("div", { className: "flex gap-2.5 flex-shrink-0", children: [
        showNext && /* @__PURE__ */ jsx13("button", { onClick: onNext, className: "py-2 px-4 font-semibold rounded-lg bg-green-500 text-white", children: "Next" }),
        /* @__PURE__ */ jsx13("button", { onClick: onSkip, className: "py-2 px-4 font-semibold rounded-lg bg-slate-400/50 text-slate-800", children: "Skip Tutorial" })
      ] })
    ] }),
    /* @__PURE__ */ jsx13("style", { children: `
                @keyframes slide-up { 
                    0% { transform: translateY(100%); } 
                    100% { transform: translateY(0); } 
                }
                .animate-slide-up { animation: slide-up 0.3s ease-out; }
            ` })
  ] });
};
var TutorialMessage_default = TutorialMessage;

// components/UnlockModal.tsx
import { jsx as jsx14, jsxs as jsxs11 } from "react/jsx-runtime";
var UnlockModal = ({ onDismiss, gamepadFocus }) => {
  return /* @__PURE__ */ jsxs11(
    "div",
    {
      className: "fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4 animate-fade-in-fast",
      onClick: onDismiss,
      children: [
        /* @__PURE__ */ jsxs11(
          "div",
          {
            className: "component-panel rounded-lg p-8 max-w-sm w-full text-center relative transform animate-pop-in-modal",
            onClick: (e) => e.stopPropagation(),
            children: [
              /* @__PURE__ */ jsx14(
                "img",
                {
                  src: "./professor-caz.png",
                  alt: "Professor Caz",
                  className: "w-24 h-24 rounded-full mx-auto mb-4 border-4 mascot-image",
                  style: { borderColor: "var(--panel-border)" }
                }
              ),
              /* @__PURE__ */ jsx14("h2", { className: "text-2xl font-bold title-font", style: { color: "var(--text-header)" }, children: "Professor's Lab Unlocked!" }),
              /* @__PURE__ */ jsx14("p", { className: "my-4 text-base", children: `"You've gained access to my secret lab! Here you can challenge the ultimate 'Learning' AI and utilize advanced training options. Experiment wisely."` }),
              /* @__PURE__ */ jsx14(
                "button",
                {
                  id: "unlock-modal-close",
                  onClick: onDismiss,
                  className: `control-button primary-button w-full transition-shadow ${gamepadFocus === "unlock-modal-close" ? "gamepad-focus" : ""}`,
                  children: "I Understand"
                }
              )
            ]
          }
        ),
        /* @__PURE__ */ jsx14("style", { children: `
                @keyframes fade-in-fast { 
                    0% { opacity: 0; } 
                    100% { opacity: 1; } 
                }
                .animate-fade-in-fast { animation: fade-in-fast 0.2s ease-out; }

                @keyframes pop-in-modal { 
                    0% { transform: scale(0.8) translateY(20px); opacity: 0; } 
                    100% { transform: scale(1) translateY(0); opacity: 1; } 
                }
                .animate-pop-in-modal { animation: pop-in-modal 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94); }
            ` })
      ]
    }
  );
};
var UnlockModal_default = UnlockModal;

// components/GameOverModal.tsx
import { useState as useState7, useCallback as useCallback3, useMemo as useMemo3 } from "react";
import { jsx as jsx15, jsxs as jsxs12 } from "react/jsx-runtime";
var ShareIcon = ({ className }) => /* @__PURE__ */ jsx15("svg", { xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 24 24", fill: "currentColor", className, children: /* @__PURE__ */ jsx15("path", { d: "M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92 1.61 0 2.92-1.31 2.92-2.92s-1.31-2.92-2.92-2.92z" }) });
var GameOverModal = ({ board, winInfo, gameMode, onNewGame, onClose, stats, adaptiveLevel, isLabUnlocked, playerName, playerOName, levelChange, gamepadFocus }) => {
  const winner = winInfo ? board[winInfo[0][0].r][winInfo[0][0].c] : null;
  const [copySuccess, setCopySuccess] = useState7(false);
  const winPiecesSet = useMemo3(() => {
    if (!winInfo) return /* @__PURE__ */ new Set();
    return new Set(winInfo.flat().map((m) => `${m.r}-${m.c}`));
  }, [winInfo]);
  let title;
  if (winner) {
    if (gameMode === "pvc" /* PvC */) {
      title = winner === HUMAN_PLAYER ? `${playerName || "You"} Wins!` : "Professor Caz Wins!";
    } else {
      const winnerName = winner === "X" /* X */ ? playerName : playerOName;
      title = `${winnerName || `Player ${winner}`} Wins!`;
    }
  } else {
    title = "It's a Draw!";
  }
  const generateStatsGraph = useCallback3(() => {
    const BAR_LENGTH = 5;
    const statsLines = AI_LEVELS.map((level, i) => {
      const levelStats = stats[i] || { wins: 0, losses: 0 };
      const totalGames = levelStats.wins + levelStats.losses;
      if (totalGames === 0) return null;
      const winPercentage = Math.round(levelStats.wins / totalGames * 100);
      const filledBlocks = Math.round(winPercentage / 100 * BAR_LENGTH);
      const emptyBlocks = BAR_LENGTH - filledBlocks;
      const bar = "\u{1F7E9}".repeat(filledBlocks) + "\u2B1C\uFE0F".repeat(emptyBlocks);
      return `${level.name.padEnd(12)}: ${bar} ${levelStats.wins}W / ${levelStats.losses}L`;
    }).filter(Boolean);
    if (statsLines.length === 0) return "";
    return [
      "",
      "--- My Stats vs Professor Caz ---",
      ...statsLines
    ].join("\n");
  }, [stats]);
  const handleShareGame = useCallback3(async () => {
    setCopySuccess(false);
    const emojiGrid = board.map((row, r) => {
      return row.map((cell, c) => {
        const isWinningPiece = winPiecesSet.has(`${r}-${c}`);
        if (isWinningPiece) {
          return "\u{1F7E2}";
        }
        if (cell === "X" /* X */) {
          return "\u{1F7E1}";
        }
        if (cell === "O" /* O */) {
          return "\u{1F535}";
        }
        return "\u2B1B";
      }).join("");
    }).join("\n");
    const winnerName = winner === "X" /* X */ ? playerName || "Player X" : gameMode === "pvc" /* PvC */ ? "Professor Caz" : playerOName || "Player O";
    const resultText = winner ? `${winnerName} won!` : "It's a Draw!";
    const gameDetailsHeader = [
      `Caz Connect - ${resultText}`,
      gameMode === "pvc" /* PvC */ ? `Difficulty: ${AI_LEVELS[adaptiveLevel]?.name}` : null
    ].filter((line) => line !== null).join("\n");
    const statsGraph = gameMode === "pvc" /* PvC */ ? generateStatsGraph() : "";
    const shareText = [
      gameDetailsHeader,
      "",
      emojiGrid,
      statsGraph,
      "",
      `Come play a game! ${window.location.href}`
    ].join("\n");
    const shareData = {
      title: "Caz Connect Game Result",
      text: shareText
    };
    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(shareData.text);
        setCopySuccess(true);
        setTimeout(() => setCopySuccess(false), 2e3);
      }
    } catch (err) {
      console.error("Error sharing game:", err);
      try {
        await navigator.clipboard.writeText(shareData.text);
        setCopySuccess(true);
        setTimeout(() => setCopySuccess(false), 2e3);
      } catch (copyErr) {
        console.error("Failed to copy game to clipboard:", copyErr);
        alert("Could not share or copy the result.");
      }
    }
  }, [board, winInfo, gameMode, playerName, playerOName, winner, adaptiveLevel, generateStatsGraph, winPiecesSet]);
  const notification = levelChange && {
    promoted: {
      text: `Promoted to ${AI_LEVELS[adaptiveLevel]?.name}!`,
      icon: "\u{1F389}",
      className: "bg-green-100 text-green-800 border-green-300"
    },
    demoted: {
      text: `Demoted to ${AI_LEVELS[adaptiveLevel]?.name}.`,
      icon: "\u{1F4C9}",
      className: "bg-yellow-100 text-yellow-800 border-yellow-300"
    }
  }[levelChange];
  return /* @__PURE__ */ jsxs12(
    "div",
    {
      className: "fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4 animate-fade-in-fast",
      onClick: onClose,
      children: [
        /* @__PURE__ */ jsxs12(
          "div",
          {
            className: "component-panel rounded-lg p-6 max-w-md w-full text-center relative transform animate-pop-in-modal max-h-[90vh] overflow-y-auto",
            onClick: (e) => e.stopPropagation(),
            children: [
              /* @__PURE__ */ jsx15("h2", { className: "text-4xl font-bold title-font mb-2", style: { color: "var(--text-header)" }, children: title }),
              /* @__PURE__ */ jsx15("div", { className: "mini-board", children: board.map(
                (row, r) => row.map((cell, c) => {
                  const isWinning = winPiecesSet.has(`${r}-${c}`);
                  return /* @__PURE__ */ jsx15("div", { className: `mini-cell ${cell ? `player-${cell.toLowerCase()}` : ""} ${isWinning ? "winning" : ""}` }, `${r}-${c}`);
                })
              ) }),
              notification && /* @__PURE__ */ jsxs12("div", { className: `p-3 rounded-lg border text-center font-semibold mb-4 text-base animate-fade-in ${notification.className}`, children: [
                /* @__PURE__ */ jsx15("span", { className: "mr-2", children: notification.icon }),
                notification.text
              ] }),
              gameMode === "pvc" /* PvC */ && /* @__PURE__ */ jsxs12("div", { className: "my-6 text-left", children: [
                /* @__PURE__ */ jsx15("h3", { className: "text-lg font-bold mb-3 text-center section-header", children: "Player Records vs. Professor Caz" }),
                /* @__PURE__ */ jsx15("div", { className: "space-y-3", children: AI_LEVELS.map((level, i) => {
                  const levelStats = stats[i] || { wins: 0, losses: 0 };
                  const totalGames = levelStats.wins + levelStats.losses;
                  const winPercentage = totalGames > 0 ? Math.round(levelStats.wins / totalGames * 100) : 0;
                  return /* @__PURE__ */ jsxs12("div", { className: "grid grid-cols-[100px_1fr_80px] items-center gap-2 text-sm", children: [
                    /* @__PURE__ */ jsx15("span", { className: "font-semibold truncate", children: level.name }),
                    /* @__PURE__ */ jsxs12("div", { className: "w-full stats-bar-container", children: [
                      /* @__PURE__ */ jsx15("div", { className: "stats-bar-fill", style: { width: `${winPercentage}%` } }),
                      totalGames > 0 && /* @__PURE__ */ jsxs12("span", { className: "stats-bar-text", children: [
                        winPercentage,
                        "%"
                      ] })
                    ] }),
                    /* @__PURE__ */ jsxs12("span", { className: "text-right tabular-nums", children: [
                      "W:",
                      levelStats.wins,
                      " L:",
                      levelStats.losses
                    ] })
                  ] }, level.name);
                }) })
              ] }),
              /* @__PURE__ */ jsxs12("div", { className: "flex flex-col gap-2.5 mt-4", children: [
                /* @__PURE__ */ jsxs12(
                  "button",
                  {
                    id: "share-button",
                    onClick: handleShareGame,
                    className: `control-button secondary-button w-full flex items-center justify-center gap-2 transition-shadow ${gamepadFocus === "share-button" ? "gamepad-focus" : ""}`,
                    children: [
                      /* @__PURE__ */ jsx15(ShareIcon, { className: "w-5 h-5" }),
                      /* @__PURE__ */ jsx15("span", { children: copySuccess ? "Copied!" : "Share Game" })
                    ]
                  }
                ),
                /* @__PURE__ */ jsxs12("div", { className: "grid grid-cols-2 gap-2.5", children: [
                  /* @__PURE__ */ jsx15(
                    "button",
                    {
                      id: "gameover-close-button",
                      onClick: onClose,
                      className: `control-button secondary-button transition-shadow ${gamepadFocus === "gameover-close-button" ? "gamepad-focus" : ""}`,
                      children: "View Board"
                    }
                  ),
                  /* @__PURE__ */ jsx15(
                    "button",
                    {
                      id: "gameover-newgame-button",
                      onClick: onNewGame,
                      className: `control-button primary-button transition-shadow ${gamepadFocus === "gameover-newgame-button" ? "gamepad-focus" : ""}`,
                      children: "New Game"
                    }
                  )
                ] })
              ] })
            ]
          }
        ),
        /* @__PURE__ */ jsx15("style", { children: `
                @keyframes fade-in-fast { 
                    0% { opacity: 0; } 
                    100% { opacity: 1; } 
                }
                .animate-fade-in-fast { animation: fade-in-fast 0.2s ease-out; }

                @keyframes pop-in-modal { 
                    0% { transform: scale(0.8) translateY(20px); opacity: 0; } 
                    100% { transform: scale(1) translateY(0); opacity: 1; } 
                }
                .animate-pop-in-modal { animation: pop-in-modal 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94); }
                 @keyframes fade-in { 
                    0% { opacity: 0; transform: translateY(-10px); } 
                    100% { opacity: 1; transform: translateY(0); } 
                }
                .animate-fade-in { 
                    animation: fade-in 0.4s ease-out;
                    animation-delay: 0.2s;
                    animation-fill-mode: backwards;
                }
            ` })
      ]
    }
  );
};
var GameOverModal_default = GameOverModal;

// components/RulesModal.tsx
import { jsx as jsx16, jsxs as jsxs13 } from "react/jsx-runtime";
var RulesModal = ({ onClose, onStartTutorial, gamepadFocus }) => {
  return /* @__PURE__ */ jsx16(
    "div",
    {
      className: "fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4 animate-fade-in-fast",
      onClick: onClose,
      children: /* @__PURE__ */ jsxs13(
        "div",
        {
          className: "component-panel rounded-lg p-6 max-w-md w-full text-center relative transform animate-pop-in-modal max-h-[90vh] overflow-y-auto",
          onClick: (e) => e.stopPropagation(),
          children: [
            /* @__PURE__ */ jsx16("h2", { className: "text-3xl font-bold title-font mb-4", style: { color: "var(--text-header)" }, children: "How to Play" }),
            /* @__PURE__ */ jsxs13("div", { className: "my-6 text-left space-y-4 text-base", children: [
              /* @__PURE__ */ jsxs13("div", { children: [
                /* @__PURE__ */ jsx16("h3", { className: "font-bold text-lg", style: { color: "var(--text-panel)" }, children: /* @__PURE__ */ jsx16("strong", { children: "Objective" }) }),
                /* @__PURE__ */ jsxs13("p", { children: [
                  "Be the first player to connect ",
                  /* @__PURE__ */ jsx16("strong", { children: "four or more" }),
                  " of your pieces in a continuous line\u2014horizontally, vertically, or diagonally!"
                ] })
              ] }),
              /* @__PURE__ */ jsxs13("div", { children: [
                /* @__PURE__ */ jsx16("h3", { className: "font-bold text-lg", style: { color: "var(--text-panel)" }, children: /* @__PURE__ */ jsx16("strong", { children: 'The "Gravity Connection" Rule' }) }),
                /* @__PURE__ */ jsx16("p", { children: "This is the core rule! You can only place a piece in a square that has a straight, unbroken line of pieces connecting it to one of the outer walls." })
              ] }),
              /* @__PURE__ */ jsx16("div", { children: /* @__PURE__ */ jsx16("p", { className: "text-sm opacity-80 text-center mt-6", children: "Valid moves are highlighted on the board for the first two Professor Caz levels to help you learn." }) })
            ] }),
            /* @__PURE__ */ jsxs13("div", { className: "grid grid-cols-2 gap-2.5 mt-4", children: [
              /* @__PURE__ */ jsx16(
                "button",
                {
                  id: "rules-modal-tutorial",
                  onClick: onStartTutorial,
                  className: `control-button secondary-button transition-shadow ${gamepadFocus === "rules-modal-tutorial" ? "gamepad-focus" : ""}`,
                  children: "Start Tutorial"
                }
              ),
              /* @__PURE__ */ jsx16(
                "button",
                {
                  id: "rules-modal-close",
                  onClick: onClose,
                  className: `control-button primary-button transition-shadow ${gamepadFocus === "rules-modal-close" ? "gamepad-focus" : ""}`,
                  children: "Got It!"
                }
              )
            ] }),
            /* @__PURE__ */ jsx16("style", { children: `
                    @keyframes fade-in-fast { 
                        0% { opacity: 0; } 
                        100% { opacity: 1; } 
                    }
                    .animate-fade-in-fast { animation: fade-in-fast 0.2s ease-out; }

                    @keyframes pop-in-modal { 
                        0% { transform: scale(0.8) translateY(20px); opacity: 0; } 
                        100% { transform: scale(1) translateY(0); opacity: 1; } 
                    }
                    .animate-pop-in-modal { animation: pop-in-modal 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94); }
                ` })
          ]
        }
      )
    }
  );
};
var RulesModal_default = RulesModal;

// components/PlayerStatsModal.tsx
import { useState as useState8, useMemo as useMemo4, useEffect as useEffect5 } from "react";
import { Fragment, jsx as jsx17, jsxs as jsxs14 } from "react/jsx-runtime";
var CloseIcon = (props) => /* @__PURE__ */ jsx17("svg", { xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 24 24", fill: "currentColor", ...props, children: /* @__PURE__ */ jsx17("path", { d: "M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" }) });
var BackIcon = (props) => /* @__PURE__ */ jsx17("svg", { xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 24 24", fill: "currentColor", ...props, children: /* @__PURE__ */ jsx17("path", { d: "M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" }) });
var PlayerStatsModal = ({ onClose, detailedStats, unlockedAchievements, aiStats, isLabUnlocked, gamepadFocus }) => {
  const [activeTab, setActiveTab] = useState8("achievements");
  const [selectedAchievement, setSelectedAchievement] = useState8(null);
  const [hintId, setHintId] = useState8(null);
  useEffect5(() => {
    if (hintId) {
      const timer = setTimeout(() => {
        setHintId(null);
      }, 4e3);
      return () => clearTimeout(timer);
    }
  }, [hintId]);
  useEffect5(() => {
    if (gamepadFocus?.startsWith("stats-tab-")) {
      const tabName = gamepadFocus.split("-")[2];
      if (tabName !== activeTab) {
        setActiveTab(tabName);
      }
    }
  }, [gamepadFocus, activeTab]);
  const mostCommonOpening = useMemo4(() => {
    const { openingMoves } = detailedStats;
    if (!openingMoves || Object.keys(openingMoves).length === 0) {
      return "N/A";
    }
    return Object.entries(openingMoves).reduce((a, b) => b[1] > a[1] ? b : a)[0];
  }, [detailedStats.openingMoves]);
  const avgGameLength = useMemo4(() => {
    if (detailedStats.totalGamesVsAi === 0) {
      return 0;
    }
    return Math.round(detailedStats.totalMoves / detailedStats.totalGamesVsAi);
  }, [detailedStats.totalGamesVsAi, detailedStats.totalMoves]);
  const achievementToShow = selectedAchievement ? ACHIEVEMENTS[selectedAchievement] : null;
  return /* @__PURE__ */ jsx17(
    "div",
    {
      className: "fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4 animate-fade-in-fast",
      onClick: onClose,
      children: /* @__PURE__ */ jsxs14(
        "div",
        {
          className: "component-panel rounded-lg p-6 max-w-lg w-full text-center relative transform animate-pop-in-modal max-h-[90vh] flex flex-col",
          onClick: (e) => e.stopPropagation(),
          children: [
            /* @__PURE__ */ jsx17(
              "button",
              {
                id: "stats-modal-close",
                onClick: onClose,
                className: `absolute top-3 right-3 p-1 rounded-full hover:bg-[var(--button-secondary-hover-bg)] transition-colors transition-shadow ${gamepadFocus === "stats-modal-close" ? "gamepad-focus" : ""}`,
                "aria-label": "Close",
                children: /* @__PURE__ */ jsx17(CloseIcon, { className: "w-6 h-6", style: { color: "var(--button-secondary-text)" } })
              }
            ),
            !selectedAchievement ? /* @__PURE__ */ jsx17("h2", { className: "text-3xl font-bold title-font mb-4", style: { color: "var(--text-header)" }, children: "Player Stats" }) : /* @__PURE__ */ jsx17("div", { className: "flex items-center justify-start relative mb-4 h-[44px]", children: /* @__PURE__ */ jsxs14("button", { id: "stats-modal-back", onClick: () => setSelectedAchievement(null), className: `absolute left-0 top-1/2 -translate-y-1/2 flex items-center gap-1 control-button secondary-button !border-none !px-2 !py-1 transition-shadow ${gamepadFocus === "stats-modal-back" ? "gamepad-focus" : ""}`, "aria-label": "Back to achievements", children: [
              /* @__PURE__ */ jsx17(BackIcon, { className: "w-6 h-6" }),
              " Back"
            ] }) }),
            !selectedAchievement ? /* @__PURE__ */ jsxs14("div", { className: "tab-nav -mx-6 px-4", children: [
              /* @__PURE__ */ jsx17("button", { id: "stats-tab-achievements", className: `tab-button ${activeTab === "achievements" ? "active" : ""} ${gamepadFocus === "stats-tab-achievements" ? "gamepad-focus" : ""}`, onClick: () => setActiveTab("achievements"), children: "Achievements" }),
              /* @__PURE__ */ jsx17("button", { id: "stats-tab-stats", className: `tab-button ${activeTab === "stats" ? "active" : ""} ${gamepadFocus === "stats-tab-stats" ? "gamepad-focus" : ""}`, onClick: () => setActiveTab("stats"), children: "Statistics" })
            ] }) : /* @__PURE__ */ jsx17("div", { className: "border-b-2", style: { borderColor: "var(--panel-border)" } }),
            /* @__PURE__ */ jsx17("div", { className: "overflow-y-auto mt-4 pr-2 -mr-2", children: selectedAchievement && achievementToShow ? /* @__PURE__ */ jsxs14("div", { className: "text-center p-4 animate-fade-in-fast flex flex-col items-center gap-4", children: [
              /* @__PURE__ */ jsx17("span", { className: "text-7xl", children: achievementToShow.icon }),
              /* @__PURE__ */ jsx17("h3", { className: "text-2xl font-bold title-font", style: { color: "var(--text-header)" }, children: achievementToShow.name }),
              /* @__PURE__ */ jsx17("p", { className: "text-base", children: achievementToShow.description })
            ] }) : /* @__PURE__ */ jsxs14(Fragment, { children: [
              activeTab === "achievements" && /* @__PURE__ */ jsx17("div", { className: "grid grid-cols-2 sm:grid-cols-3 gap-4 text-center animate-fade-in-fast", children: Object.keys(ACHIEVEMENTS).map((id) => {
                const achievement = ACHIEVEMENTS[id];
                const isUnlocked = unlockedAchievements.includes(id);
                const descriptionToShow = isUnlocked ? achievement.description : hintId === id ? achievement.lockedHint || achievement.lockedDescription : achievement.lockedDescription || achievement.description;
                return /* @__PURE__ */ jsxs14(
                  "button",
                  {
                    onClick: () => {
                      if (isUnlocked) {
                        setSelectedAchievement(id);
                      } else if (achievement.lockedHint) {
                        setHintId(id);
                      }
                    },
                    className: `p-4 rounded-lg flex flex-col items-center justify-start gap-2 transition-all duration-300 text-left cursor-pointer ${isUnlocked ? "opacity-100" : "opacity-40 filter grayscale"}`,
                    style: { backgroundColor: "rgba(0,0,0,0.05)" },
                    "aria-label": `View details for ${achievement.name}`,
                    children: [
                      /* @__PURE__ */ jsx17("span", { className: "text-5xl", children: achievement.icon }),
                      /* @__PURE__ */ jsx17("h4", { className: "font-bold text-sm m-0 leading-tight text-center w-full", children: achievement.name }),
                      /* @__PURE__ */ jsx17("p", { className: "text-xs m-0 leading-snug text-center w-full animate-fade-in-fast", children: descriptionToShow }, descriptionToShow)
                    ]
                  },
                  id
                );
              }) }),
              activeTab === "stats" && /* @__PURE__ */ jsxs14("div", { className: "text-left animate-fade-in-fast", children: [
                detailedStats.currentWinStreak > 0 && /* @__PURE__ */ jsxs14(
                  "div",
                  {
                    className: `text-center p-3 rounded-lg mb-4 border-2 ${detailedStats.currentWinStreak >= 3 ? "animate-streak-glow" : ""}`,
                    style: { borderColor: "var(--panel-border)" },
                    children: [
                      /* @__PURE__ */ jsx17("h4", { className: "text-sm font-bold uppercase tracking-wider section-header mt-0", children: "Current Win Streak" }),
                      /* @__PURE__ */ jsxs14("div", { className: "flex items-center justify-center gap-2", children: [
                        /* @__PURE__ */ jsx17("span", { className: "text-5xl font-bold title-font", style: { color: "var(--player-x-color)", textShadow: "var(--player-x-shadow)" }, children: detailedStats.currentWinStreak }),
                        /* @__PURE__ */ jsx17("span", { className: "text-5xl", children: "\u{1F525}" })
                      ] })
                    ]
                  }
                ),
                /* @__PURE__ */ jsx17("h3", { className: "text-lg font-bold mb-3 text-center section-header", children: "Career Stats" }),
                /* @__PURE__ */ jsxs14("div", { className: "grid grid-cols-3 gap-2 text-center component-panel bg-opacity-10 p-3 rounded-lg border-none shadow-inner", children: [
                  /* @__PURE__ */ jsxs14("div", { className: "flex flex-col", children: [
                    /* @__PURE__ */ jsx17("span", { className: "font-bold text-2xl", style: { color: "var(--text-header)" }, children: detailedStats.maxWinStreak }),
                    /* @__PURE__ */ jsx17("span", { className: "text-xs opacity-80", children: "Max Streak" })
                  ] }),
                  /* @__PURE__ */ jsxs14("div", { className: "flex flex-col", children: [
                    /* @__PURE__ */ jsx17("span", { className: "font-bold text-2xl", style: { color: "var(--text-header)" }, children: avgGameLength }),
                    /* @__PURE__ */ jsx17("span", { className: "text-xs opacity-80", children: "Avg. Moves" })
                  ] }),
                  /* @__PURE__ */ jsxs14("div", { className: "flex flex-col", children: [
                    /* @__PURE__ */ jsx17("span", { className: "font-bold text-2xl", style: { color: "var(--text-header)" }, children: mostCommonOpening }),
                    /* @__PURE__ */ jsx17("span", { className: "text-xs opacity-80", children: "Favorite Start" })
                  ] })
                ] }),
                /* @__PURE__ */ jsx17("h3", { className: "text-lg font-bold my-3 text-center section-header", children: "vs. Professor Caz" }),
                /* @__PURE__ */ jsx17("div", { className: "space-y-3", children: AI_LEVELS.map((level, i) => {
                  const levelStats = aiStats[i] || { wins: 0, losses: 0 };
                  const totalGames = levelStats.wins + levelStats.losses;
                  const winPercentage = totalGames > 0 ? Math.round(levelStats.wins / totalGames * 100) : 0;
                  return /* @__PURE__ */ jsxs14("div", { className: "grid grid-cols-[100px_1fr_80px] items-center gap-2 text-sm", children: [
                    /* @__PURE__ */ jsx17("span", { className: "font-semibold truncate", children: level.name }),
                    /* @__PURE__ */ jsxs14("div", { className: "w-full stats-bar-container", children: [
                      /* @__PURE__ */ jsx17("div", { className: "stats-bar-fill", style: { width: `${winPercentage}%` } }),
                      totalGames > 0 && /* @__PURE__ */ jsxs14("span", { className: "stats-bar-text", children: [
                        winPercentage,
                        "%"
                      ] })
                    ] }),
                    /* @__PURE__ */ jsxs14("span", { className: "text-right tabular-nums", children: [
                      "W:",
                      levelStats.wins,
                      " L:",
                      levelStats.losses
                    ] })
                  ] }, level.name);
                }) })
              ] })
            ] }) }),
            /* @__PURE__ */ jsx17("style", { children: `
                    @keyframes fade-in-fast { 
                        0% { opacity: 0; } 
                        100% { opacity: 1; } 
                    }
                    .animate-fade-in-fast { animation: fade-in-fast 0.2s ease-out; }

                    @keyframes pop-in-modal { 
                        0% { transform: scale(0.8) translateY(20px); opacity: 0; } 
                        100% { transform: scale(1) translateY(0); opacity: 1; } 
                    }
                    .animate-pop-in-modal { animation: pop-in-modal 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94); }
                    
                    @keyframes streak-glow {
                        0%, 100% { 
                            box-shadow: 0 0 10px var(--player-x-color); 
                        }
                        50% { 
                            box-shadow: 0 0 20px var(--player-x-color); 
                        }
                    }
                    .animate-streak-glow {
                        animation: streak-glow 2.5s infinite ease-in-out;
                        border-color: var(--player-x-color) !important;
                    }
                ` })
          ]
        }
      )
    }
  );
};
var PlayerStatsModal_default = PlayerStatsModal;

// components/ConfirmModal.tsx
import { jsx as jsx18, jsxs as jsxs15 } from "react/jsx-runtime";
var ConfirmModal = ({ title, message, confirmText = "Confirm", onConfirm, onCancel, gamepadFocus }) => {
  return /* @__PURE__ */ jsx18(
    "div",
    {
      className: "fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4 animate-fade-in-fast",
      onClick: onCancel,
      children: /* @__PURE__ */ jsxs15(
        "div",
        {
          className: "component-panel rounded-lg p-6 max-w-sm w-full text-center relative transform animate-pop-in-modal",
          onClick: (e) => e.stopPropagation(),
          children: [
            /* @__PURE__ */ jsx18("h2", { className: "text-2xl font-bold title-font mb-4", style: { color: "var(--text-header)" }, children: title }),
            /* @__PURE__ */ jsx18("p", { className: "my-6 text-base", children: message }),
            /* @__PURE__ */ jsxs15("div", { className: "grid grid-cols-2 gap-2.5 mt-4", children: [
              /* @__PURE__ */ jsx18(
                "button",
                {
                  id: "confirm-modal-cancel",
                  onClick: onCancel,
                  className: `control-button secondary-button transition-shadow ${gamepadFocus === "confirm-modal-cancel" ? "gamepad-focus" : ""}`,
                  children: "Cancel"
                }
              ),
              /* @__PURE__ */ jsx18(
                "button",
                {
                  id: "confirm-modal-confirm",
                  onClick: onConfirm,
                  className: `control-button primary-button transition-shadow ${gamepadFocus === "confirm-modal-confirm" ? "gamepad-focus" : ""}`,
                  children: confirmText
                }
              )
            ] }),
            /* @__PURE__ */ jsx18("style", { children: `
                    @keyframes fade-in-fast { 
                        0% { opacity: 0; } 
                        100% { opacity: 1; } 
                    }
                    .animate-fade-in-fast { animation: fade-in-fast 0.2s ease-out; }

                    @keyframes pop-in-modal { 
                        0% { transform: scale(0.8) translateY(20px); opacity: 0; } 
                        100% { transform: scale(1) translateY(0); opacity: 1; } 
                    }
                    .animate-pop-in-modal { animation: pop-in-modal 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94); }
                ` })
          ]
        }
      )
    }
  );
};
var ConfirmModal_default = ConfirmModal;

// components/UpdatePrompt.tsx
import { jsx as jsx19, jsxs as jsxs16 } from "react/jsx-runtime";
var UpdatePrompt = ({ onUpdate }) => {
  return /* @__PURE__ */ jsx19("div", { className: "fixed bottom-0 left-0 right-0 p-4 z-50 transform translate-y-0 transition-transform duration-300 ease-in-out prompt-panel", children: /* @__PURE__ */ jsxs16("div", { className: "max-w-xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left", children: [
    /* @__PURE__ */ jsxs16("div", { className: "flex-grow", children: [
      /* @__PURE__ */ jsx19("h3", { className: "m-0 mb-1 text-lg font-semibold", children: "Update Available" }),
      /* @__PURE__ */ jsx19("p", { className: "m-0 text-sm leading-snug", children: "A new version of Caz Connect is ready. Reload to get the latest features!" })
    ] }),
    /* @__PURE__ */ jsx19("div", { className: "flex gap-2.5 flex-shrink-0", children: /* @__PURE__ */ jsx19("button", { onClick: onUpdate, className: "py-2 px-4 font-semibold rounded-lg bg-green-500 text-white", children: "Reload" }) })
  ] }) });
};
var UpdatePrompt_default = UpdatePrompt;

// components/VirtualKeyboard.tsx
import { useState as useState9, useEffect as useEffect6, useRef as useRef6, useCallback as useCallback4 } from "react";
import { jsx as jsx20, jsxs as jsxs17 } from "react/jsx-runtime";
var KEY_LAYOUT = [
  ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"],
  ["q", "w", "e", "r", "t", "y", "u", "i", "o", "p"],
  ["a", "s", "d", "f", "g", "h", "j", "k", "l"],
  ["Shift", "z", "x", "c", "v", "b", "n", "m", "Backspace"],
  ["Space", "Done"]
];
var SHIFT_MAP = { "1": "!", "2": "@", "3": "#", "4": "$", "5": "%", "6": "^", "7": "&", "8": "*", "9": "(", "0": ")" };
var GAMEPAD_INPUT_DELAY2 = 150;
var GAMEPAD_AXIS_THRESHOLD2 = 0.7;
var VirtualKeyboard = ({ initialValue, onConfirm, onCancel, gamepadActive }) => {
  const [inputValue, setInputValue] = useState9(initialValue);
  const [isShifted, setIsShifted] = useState9(false);
  const [cursorPos, setCursorPos] = useState9({ row: 0, col: 0 });
  const lastInputTimeRef = useRef6(0);
  const gameLoopRef = useRef6();
  const buttonPressStateRef = useRef6({});
  const inputRef = useRef6(null);
  useEffect6(() => {
    inputRef.current?.focus();
    inputRef.current?.setSelectionRange(inputValue.length, inputValue.length);
  }, []);
  const handleKeyPress = useCallback4((key) => {
    if (key === "Backspace") {
      setInputValue((val) => val.slice(0, -1));
    } else if (key === "Shift") {
      setIsShifted((s) => !s);
    } else if (key === "Space") {
      setInputValue((val) => val + " ");
    } else if (key === "Done") {
      onConfirm(inputValue);
    } else {
      const char = isShifted ? SHIFT_MAP[key] || key.toUpperCase() : key;
      setInputValue((val) => val + char);
      if (isShifted) {
        setIsShifted(false);
      }
    }
  }, [inputValue, isShifted, onConfirm]);
  useEffect6(() => {
    if (!gamepadActive) return;
    const gamepadLoop = () => {
      const gamepads = navigator.getGamepads();
      if (!gamepads[0]) {
        gameLoopRef.current = requestAnimationFrame(gamepadLoop);
        return;
      }
      const gamepad = gamepads[0];
      const now = performance.now();
      if (now - lastInputTimeRef.current > GAMEPAD_INPUT_DELAY2) {
        let dx = 0;
        let dy = 0;
        const axisX = gamepad.axes[0];
        const axisY = gamepad.axes[1];
        if (Math.abs(axisX) > GAMEPAD_AXIS_THRESHOLD2) dx = Math.sign(axisX);
        else if (gamepad.buttons[14]?.pressed) dx = -1;
        else if (gamepad.buttons[15]?.pressed) dx = 1;
        if (Math.abs(axisY) > GAMEPAD_AXIS_THRESHOLD2) dy = Math.sign(axisY);
        else if (gamepad.buttons[12]?.pressed) dy = -1;
        else if (gamepad.buttons[13]?.pressed) dy = 1;
        if (dx !== 0 || dy !== 0) {
          setCursorPos((prev) => {
            let newRow = prev.row + dy;
            let newCol = prev.col + dx;
            newRow = Math.max(0, Math.min(KEY_LAYOUT.length - 1, newRow));
            const maxCol = KEY_LAYOUT[newRow].length - 1;
            newCol = Math.max(0, Math.min(maxCol, newCol));
            return { row: newRow, col: newCol };
          });
          lastInputTimeRef.current = now;
        }
      }
      if (gamepad.buttons[0]?.pressed && !buttonPressStateRef.current[0]) {
        const key = KEY_LAYOUT[cursorPos.row][cursorPos.col];
        handleKeyPress(key);
      }
      if (gamepad.buttons[1]?.pressed && !buttonPressStateRef.current[1]) {
        onCancel();
      }
      gamepad.buttons.forEach((button, index) => {
        buttonPressStateRef.current[index] = button.pressed;
      });
      gameLoopRef.current = requestAnimationFrame(gamepadLoop);
    };
    gameLoopRef.current = requestAnimationFrame(gamepadLoop);
    return () => {
      if (gameLoopRef.current) cancelAnimationFrame(gameLoopRef.current);
    };
  }, [gamepadActive, cursorPos, handleKeyPress, onCancel]);
  return /* @__PURE__ */ jsxs17("div", { className: "virtual-keyboard-container", children: [
    /* @__PURE__ */ jsx20(
      "input",
      {
        ref: inputRef,
        type: "text",
        value: inputValue,
        onChange: (e) => setInputValue(e.target.value),
        className: "virtual-keyboard-input"
      }
    ),
    /* @__PURE__ */ jsx20("div", { className: "keyboard-layout", children: KEY_LAYOUT.map((row, rowIndex) => /* @__PURE__ */ jsx20("div", { className: "keyboard-row", children: row.map((key, colIndex) => {
      const isFocused = rowIndex === cursorPos.row && colIndex === cursorPos.col;
      const isShiftKey = key === "Shift";
      const isBackspace = key === "Backspace";
      const isSpace = key === "Space";
      const isDone = key === "Done";
      const isSpecial = isShiftKey || isBackspace || isSpace || isDone;
      return /* @__PURE__ */ jsx20(
        "button",
        {
          onClick: () => handleKeyPress(key),
          className: `keyboard-key ${isSpecial ? "special" : ""} ${isSpace ? "space" : ""} ${isDone ? "done" : ""} ${isShiftKey && isShifted ? "active" : ""} ${gamepadActive && isFocused ? "gamepad-focus" : ""}`,
          children: isShifted ? SHIFT_MAP[key] || key.toUpperCase() : key
        },
        key
      );
    }) }, rowIndex)) })
  ] });
};
var VirtualKeyboard_default = VirtualKeyboard;

// App.tsx
import { jsx as jsx21, jsxs as jsxs18 } from "react/jsx-runtime";
var App = () => {
  const {
    board,
    gameStatus,
    scores,
    validMoves,
    lastMove,
    winInfo,
    invalidMove,
    isThinking,
    isSimulating,
    animationInfo,
    isAnimationEnabled,
    gameMode,
    adaptiveLevel,
    autoAdjustLevel,
    isLabUnlocked,
    isAiLearningEnabled,
    isScreenShakeEnabled,
    showUnlockModal,
    showGameOverModal,
    levelChange,
    aiStats,
    detailedStats,
    unlockedAchievements,
    theme,
    installPrompt,
    isMuted,
    isHapticEnabled,
    isTutorialActive,
    tutorialText,
    tutorialHighlight,
    isTutorialInteractive,
    showRulesModal,
    confirmAction,
    highlightedPath,
    gamepadCursor,
    gamepadFocus,
    isShaking,
    mascotMessage,
    isGamepadConnected,
    virtualKeyboardState,
    // Personalization
    playerName,
    playerPiece,
    playerOName,
    playerOPiece,
    // Online state
    currentPlayer,
    movesMade,
    gameOver,
    onlineRole,
    gameStateString,
    actions
  } = useGameLogic();
  const [showPlayerStatsModal, setShowPlayerStatsModal] = useState10(false);
  const [waitingWorker, setWaitingWorker] = useState10(null);
  const [showUpdatePrompt, setShowUpdatePrompt] = useState10(false);
  const wakeLock = useRef7(null);
  useEffect7(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("./sw.js").then((registration) => {
        registration.addEventListener("updatefound", () => {
          const newWorker = registration.installing;
          if (newWorker) {
            newWorker.addEventListener("statechange", () => {
              if (newWorker.state === "installed" && navigator.serviceWorker.controller) {
                setWaitingWorker(newWorker);
                setShowUpdatePrompt(true);
              }
            });
          }
        });
      });
      let refreshing = false;
      navigator.serviceWorker.addEventListener("controllerchange", () => {
        if (!refreshing) {
          window.location.reload();
          refreshing = true;
        }
      });
    }
  }, []);
  const handleUpdate = () => {
    if (waitingWorker) {
      waitingWorker.postMessage({ type: "SKIP_WAITING" });
      setShowUpdatePrompt(false);
    }
  };
  useEffect7(() => {
    document.body.className = `theme-${theme}`;
  }, [theme]);
  useEffect7(() => {
    const handleContextMenu = (e) => {
      e.preventDefault();
    };
    document.addEventListener("contextmenu", handleContextMenu);
    return () => {
      document.removeEventListener("contextmenu", handleContextMenu);
    };
  }, []);
  useEffect7(() => {
    const requestWakeLock = async () => {
      if ("wakeLock" in navigator) {
        try {
          wakeLock.current = await navigator.wakeLock.request("screen");
          wakeLock.current.addEventListener("release", () => {
            console.log("Wake Lock was released");
          });
          console.log("Wake Lock is active");
        } catch (err) {
          console.error(`${err.name}, ${err.message}`);
        }
      }
    };
    const handleVisibilityChange = () => {
      if (wakeLock.current !== null && document.visibilityState === "visible") {
        requestWakeLock();
      }
    };
    requestWakeLock();
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      if (wakeLock.current !== null) {
        wakeLock.current.release();
        wakeLock.current = null;
      }
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);
  const isBoardDisabled = isThinking || isSimulating || isTutorialActive && !isTutorialInteractive || !!animationInfo;
  return /* @__PURE__ */ jsxs18("div", { className: `main-container mx-auto p-2.5 flex flex-col items-center gap-5 max-w-lg lg:max-w-6xl lg:grid lg:grid-cols-[minmax(350px,_1fr)_1.5fr] lg:grid-rows-[auto_1fr] lg:[grid-template-areas:'title_game'_'info_game'] lg:items-start lg:gap-10 ${isShaking && isScreenShakeEnabled ? "screen-shake" : ""}`, children: [
    /* @__PURE__ */ jsx21("div", { className: "order-1 w-full lg:[grid-area:title]", children: /* @__PURE__ */ jsx21(
      Header_default,
      {
        isThinking: isThinking || isSimulating,
        mascotMessage,
        gamepadFocus,
        onMuteClick: actions.toggleMute,
        onRulesClick: actions.openRulesModal,
        onStatsClick: () => {
          actions.handleUIClick();
          setShowPlayerStatsModal(true);
        }
      }
    ) }),
    /* @__PURE__ */ jsxs18("main", { className: "game-area order-2 flex flex-col items-center w-full lg:min-w-[525px] lg:justify-center lg:[grid-area:game]", children: [
      /* @__PURE__ */ jsx21(
        Status_default,
        {
          statusText: gameStatus,
          scores: scores[gameMode],
          gameMode,
          adaptiveLevel,
          playerName,
          playerPiece,
          playerOName,
          playerOPiece,
          currentPlayer,
          gameOver
        }
      ),
      /* @__PURE__ */ jsx21(
        Board_default,
        {
          board,
          onCellClick: actions.handleCellClick,
          validMoves,
          lastMove,
          winInfo,
          invalidMove,
          isThinking: isBoardDisabled,
          tutorialHighlight,
          animationInfo,
          adaptiveLevel,
          gameMode,
          playerPiece,
          playerOPiece,
          highlightedPath,
          onCellHover: actions.handleCellHover,
          gamepadCursor,
          gamepadFocus,
          isGamepadConnected
        }
      )
    ] }),
    /* @__PURE__ */ jsx21("aside", { className: "info-area order-3 flex flex-col gap-5 w-full items-center lg:justify-start lg:[grid-area:info]", children: /* @__PURE__ */ jsx21(
      Controls_default,
      {
        gameMode,
        setGameMode: actions.setGameMode,
        onReset: actions.resetGame,
        isSimulating,
        onStartSimulation: actions.startSimulation,
        onStopSimulation: actions.stopSimulation,
        onImportMemory: actions.importMemory,
        onExportMemory: actions.exportMemory,
        isAnimationEnabled,
        onToggleAnimation: actions.toggleAnimationEnabled,
        isScreenShakeEnabled,
        onToggleScreenShakeEnabled: actions.toggleScreenShakeEnabled,
        theme,
        onToggleTheme: actions.toggleTheme,
        isHapticEnabled,
        onToggleHapticEnabled: actions.toggleHapticEnabled,
        adaptiveLevel,
        autoAdjustLevel,
        isLabUnlocked,
        isAiLearningEnabled,
        onToggleAutoAdjustLevel: actions.toggleAutoAdjustLevel,
        onSetAdaptiveLevel: actions.setAdaptiveLevelManual,
        onToggleAiLearning: actions.toggleIsAiLearningEnabled,
        playerName,
        playerPiece,
        onSetPlayerName: actions.setPlayerName,
        onSetPlayerPiece: actions.setPlayerPiece,
        playerOName,
        playerOPiece,
        onSetPlayerOName: actions.setPlayerOName,
        onSetPlayerOPiece: actions.setPlayerOPiece,
        onUIClick: actions.handleUIClick,
        gamepadFocus,
        onOpenVirtualKeyboard: actions.openVirtualKeyboard,
        onSelectVisibilityChange: actions.setIsDifficultySelectOpen,
        onlineRole,
        setOnlineRole: actions.setOnlineRole,
        gameStateString,
        loadOnlineGame: actions.loadOnlineGame,
        currentPlayer,
        gameOver,
        movesMade,
        isTutorialActive
      }
    ) }),
    isTutorialActive && /* @__PURE__ */ jsx21(
      TutorialMessage_default,
      {
        text: tutorialText,
        showNext: !isTutorialInteractive,
        onNext: actions.advanceTutorial,
        onSkip: actions.endTutorial
      }
    ),
    installPrompt.visible && !isTutorialActive && /* @__PURE__ */ jsx21(
      InstallPrompt_default,
      {
        onInstall: installPrompt.trigger,
        onDismiss: installPrompt.dismiss
      }
    ),
    showUpdatePrompt && /* @__PURE__ */ jsx21(UpdatePrompt_default, { onUpdate: handleUpdate }),
    confirmAction && confirmAction.isOpen && /* @__PURE__ */ jsx21(
      ConfirmModal_default,
      {
        title: confirmAction.title,
        message: confirmAction.message,
        confirmText: confirmAction.confirmText,
        onConfirm: actions.handleConfirmAction,
        onCancel: actions.cancelConfirmAction,
        gamepadFocus
      }
    ),
    showPlayerStatsModal && /* @__PURE__ */ jsx21(
      PlayerStatsModal_default,
      {
        onClose: () => {
          actions.handleUIClick();
          setShowPlayerStatsModal(false);
        },
        detailedStats,
        unlockedAchievements,
        aiStats,
        isLabUnlocked,
        gamepadFocus
      }
    ),
    showRulesModal && /* @__PURE__ */ jsx21(
      RulesModal_default,
      {
        onClose: actions.closeRulesModal,
        onStartTutorial: () => {
          actions.closeRulesModal();
          actions.startTutorial();
        },
        gamepadFocus
      }
    ),
    showUnlockModal && /* @__PURE__ */ jsx21(
      UnlockModal_default,
      {
        onDismiss: actions.dismissUnlockModal,
        gamepadFocus
      }
    ),
    showGameOverModal && /* @__PURE__ */ jsx21(
      GameOverModal_default,
      {
        board,
        winInfo,
        gameMode,
        onNewGame: actions.resetGame,
        onClose: actions.dismissGameOverModal,
        stats: aiStats,
        adaptiveLevel,
        isLabUnlocked,
        playerName,
        playerOName,
        levelChange,
        gamepadFocus
      }
    ),
    virtualKeyboardState.isOpen && /* @__PURE__ */ jsx21(
      VirtualKeyboard_default,
      {
        initialValue: virtualKeyboardState.initialValue,
        onConfirm: (newValue) => {
          virtualKeyboardState.onConfirm(newValue);
          actions.closeVirtualKeyboard();
        },
        onCancel: actions.closeVirtualKeyboard,
        gamepadActive: isGamepadConnected
      }
    )
  ] });
};
var App_default = App;

// index.tsx
import { jsx as jsx22 } from "react/jsx-runtime";
var rootElement = document.getElementById("root");
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}
var root = ReactDOM.createRoot(rootElement);
root.render(
  /* @__PURE__ */ jsx22(React10.StrictMode, { children: /* @__PURE__ */ jsx22(App_default, {}) })
);
