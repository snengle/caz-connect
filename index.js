// index.tsx
import React9 from "react";
import ReactDOM from "react-dom/client";

// App.tsx
import { useEffect as useEffect5, useState as useState9, useRef as useRef5 } from "react";

// hooks/useGameLogic.ts
import { useState, useEffect, useCallback, useMemo, useRef } from "react";

// constants.ts
var BOARD_SIZE = 8;
var PLAYER_X = "X" /* X */;
var PLAYER_O = "O" /* O */;
var AI_PLAYER = "O" /* O */;
var HUMAN_PLAYER = "X" /* X */;
var LEVEL_NAMES = ["Beginner", "Novice", "Intermediate", "Expert", "Master", "Grand Master"];
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
    description: "Achieve a 5-game win streak against the AI on Intermediate or higher.",
    lockedDescription: "??????????",
    icon: "\u{1F525}"
  },
  BEAT_GRAND_MASTER: {
    name: "Master Mind",
    description: "Defeat the 'Grand Master' level AI.",
    lockedDescription: "??????????",
    icon: "\u{1F9E0}"
  },
  GRAVITY_MASTER: {
    name: "Gravity Master",
    description: "Win a game with a connection of 6 or more pieces on Intermediate or higher.",
    lockedDescription: "??????????",
    icon: "\u269B\uFE0F"
  },
  LAB_UNLOCKED: {
    name: "Lab Access",
    description: "Unlock the secrets of the Professor's Lab.",
    lockedDescription: "??????????",
    icon: "\u{1F52C}"
  },
  GRAND_TOUR: {
    name: "Grand Tour",
    description: "Win against every AI level from Beginner to Grand Master.",
    icon: "\u{1F5FA}\uFE0F",
    lockedDescription: "??????????"
  },
  LONG_GAME: {
    name: "The Long Game",
    description: "Win a match that lasts 40 or more moves.",
    icon: "\u23F3",
    lockedDescription: "??????????"
  },
  CUSTOMIZED_PROFILE: {
    name: "Tinkerer",
    description: "Personalize your profile by changing both your name and piece.",
    icon: "\u{1F3A8}",
    lockedDescription: "??????????"
  }
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
  const directions = [
    { r: 0, c: 1 },
    { r: 1, c: 0 },
    { r: 1, c: 1 },
    { r: 1, c: -1 }
  ];
  for (let r = 0; r < BOARD_SIZE; r++) {
    for (let c = 0; c < BOARD_SIZE; c++) {
      if (board[r][c] !== player) {
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
        if (line.length === 4) {
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
          return line;
        }
      }
    }
  }
  return null;
};
var rotateMove = (move) => ({ r: move.c, c: BOARD_SIZE - 1 - move.r });
var flipMove = (move) => ({ r: move.r, c: BOARD_SIZE - 1 - move.c });
var transformHistory = (history, transformations) => {
  return history.map((item) => {
    let transformedMove = { r: item.r, c: item.c };
    for (const transform of transformations) {
      transformedMove = transform(transformedMove);
    }
    return { ...item, r: transformedMove.r, c: transformedMove.c };
  });
};
var historyToString = (history) => history.map((m) => `${m.player}:${m.r},${m.c}`).join(";");
var getCanonicalMoveHistoryString = (history) => {
  if (history.length === 0) return "";
  const symmetries = [];
  let currentHistory = [...history];
  for (let i = 0; i < 4; i++) {
    symmetries.push(historyToString(currentHistory));
    symmetries.push(historyToString(transformHistory(currentHistory, [flipMove])));
    currentHistory = transformHistory(currentHistory, [rotateMove]);
  }
  return symmetries.sort()[0];
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
  const [gameMemory, setGameMemory] = useState({ wins: [], losses: [] });
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
  const [confirmAction, setConfirmAction] = useState(null);
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
  const [adaptiveWinStreak, setAdaptiveWinStreak] = useState(() => {
    try {
      const saved = localStorage.getItem("cazConnectAdaptiveWinStreak");
      return saved ? parseInt(saved, 10) : 0;
    } catch {
      return 0;
    }
  });
  const [adaptiveLossStreak, setAdaptiveLossStreak] = useState(() => {
    try {
      const saved = localStorage.getItem("cazConnectAdaptiveLossStreak");
      return saved ? parseInt(saved, 10) : 0;
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
        totalMoves: 0,
        totalGamesVsAi: 0,
        openingMoves: {},
        levelsBeaten: [],
        ...parsed
      };
    } catch {
      return { maxWinStreak: 0, totalMoves: 0, totalGamesVsAi: 0, openingMoves: {}, levelsBeaten: [] };
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
      localStorage.setItem("cazConnectAdaptiveWinStreak", String(adaptiveWinStreak));
    } catch (e) {
      console.error("Failed to save adaptive win streak", e);
    }
  }, [adaptiveWinStreak]);
  useEffect(() => {
    try {
      localStorage.setItem("cazConnectAdaptiveLossStreak", String(adaptiveLossStreak));
    } catch (e) {
      console.error("Failed to save adaptive loss streak", e);
    }
  }, [adaptiveLossStreak]);
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
  const placeSound = useRef(null);
  const winSound = useRef(null);
  const badMoveSound = useRef(null);
  useEffect(() => {
    placeSound.current = new Audio("./place.mp3");
    winSound.current = new Audio("./win.mp3");
    badMoveSound.current = new Audio("./badmove.mp3");
  }, []);
  const playSound = useCallback((soundType) => {
    if (isHapticEnabled && "vibrate" in navigator) {
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
  }, [isMuted, isHapticEnabled]);
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
  useEffect(() => {
    const loadMemory = async () => {
      try {
        const savedMemory = localStorage.getItem("cazConnectMemory");
        if (savedMemory) {
          const parsedMemory = JSON.parse(savedMemory);
          if (parsedMemory && Array.isArray(parsedMemory.wins) && Array.isArray(parsedMemory.losses)) {
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
        if (defaultBrain && Array.isArray(defaultBrain.wins) && Array.isArray(defaultBrain.losses)) {
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
  }, []);
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
        const newStats = { ...prev };
        if (!newStats.levelsBeaten) newStats.levelsBeaten = [];
        newStats.totalGamesVsAi += 1;
        newStats.totalMoves += history.length;
        if (winner === HUMAN_PLAYER) {
          newStats.maxWinStreak = Math.max(prev.maxWinStreak, adaptiveWinStreak + 1);
          if (!newStats.levelsBeaten.includes(adaptiveLevel)) {
            newStats.levelsBeaten.push(adaptiveLevel);
          }
        }
        return newStats;
      });
      if (winner === HUMAN_PLAYER) {
        grantAchievement("FIRST_WIN");
        if (winInfo && winInfo.length >= 6 && adaptiveLevel >= 2) {
          grantAchievement("GRAVITY_MASTER");
        }
        if (adaptiveLevel === 5) {
          grantAchievement("BEAT_GRAND_MASTER");
        }
        if (history.length >= 40) {
          grantAchievement("LONG_GAME");
        }
        const requiredLevels = [0, 1, 2, 3, 4, 5];
        const hasAllLevels = requiredLevels.every((level) => detailedStats.levelsBeaten.includes(level));
        if (hasAllLevels) {
          grantAchievement("GRAND_TOUR");
        }
      }
    }
    const canonicalMoveString = getCanonicalMoveHistoryString(history);
    if (adaptiveLevel === 5 && isAiLearningEnabled) {
      setGameMemory((prevMemory) => {
        const newMemory = { ...prevMemory };
        if (winner === AI_PLAYER) {
          if (canonicalMoveString && !newMemory.wins.some((w) => w.moves === canonicalMoveString)) {
            newMemory.wins = [...newMemory.wins, { moves: canonicalMoveString }];
          }
        } else if (winner === HUMAN_PLAYER) {
          if (canonicalMoveString && !newMemory.losses.some((l) => l.moves === canonicalMoveString)) {
            newMemory.losses = [...newMemory.losses, { moves: canonicalMoveString }];
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
    if (gameMode === "pvc" /* PvC */) {
      let newWinStreak = adaptiveWinStreak;
      let newLossStreak = adaptiveLossStreak;
      if (winner === HUMAN_PLAYER) {
        newWinStreak += 1;
        newLossStreak = 0;
        if (newWinStreak >= 5 && adaptiveLevel >= 2) grantAchievement("WIN_STREAK_5");
      } else {
        newWinStreak = 0;
        if (winner === AI_PLAYER) {
          newLossStreak += 1;
        }
      }
      setAdaptiveWinStreak(newWinStreak);
      setAdaptiveLossStreak(newLossStreak);
      if (autoAdjustLevel) {
        if (newWinStreak >= 3) {
          setAdaptiveLevel((l) => {
            const newLevel = Math.min(l + 1, 5);
            if (newLevel > l) setLevelChange("promoted");
            return newLevel;
          });
          setAdaptiveWinStreak(0);
        }
        if (newLossStreak >= 3) {
          setAdaptiveLevel((l) => {
            const newLevel = Math.max(l - 1, 0);
            if (newLevel < l) setLevelChange("demoted");
            return newLevel;
          });
          setAdaptiveLossStreak(0);
        }
      }
    }
  }, [gameMode, adaptiveLevel, autoAdjustLevel, isAiLearningEnabled, adaptiveWinStreak, adaptiveLossStreak, grantAchievement, winInfo, detailedStats.levelsBeaten]);
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
      if (winnerInfo) {
        setWinInfo(winnerInfo);
        setGameOver(true);
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
        if (!tutorialState.active) {
          setTimeout(() => setShowGameOverModal(true), 1500);
        }
        recordGameResult(newMoveHistory, null);
        setTimeout(showInstallPrompt, 1500);
      } else {
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
  }, [board, currentPlayer, gameOver, movesMade, gameMode, moveHistory, playSound, getAnimationSource, isAnimationEnabled, tutorialState.active, recordGameResult, advanceTutorial]);
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
        setWinInfo([{ r: 0, c: 3 }, { r: 1, c: 3 }, { r: 2, c: 3 }, { r: 3, c: 3 }]);
        setGameOver(true);
      }
    },
    // Step 2
    {
      text: "Now for the most important rule: the 'Gravity Connection'. Your first move must be on an outer wall, like the highlighted squares.",
      highlight: { type: "border" },
      isInteractive: false,
      action: () => {
        masterReset(PLAYER_X);
      }
    },
    // Step 3
    {
      text: "Now it's your turn! Try placing your 'X' piece on any of the highlighted wall squares.",
      highlight: { type: "border" },
      isInteractive: true,
      advancesOnClick: true
    },
    // Step 4
    {
      text: () => `Excellent! Now watch my move.`,
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
    // Step 5: Gameplay step
    {
      text: "Now, the real game begins! Your goal is to get four of your pieces in a row to win. I'll go easy on you.",
      highlight: { type: "cells", cells: getValidMoves(board, movesMade) },
      isInteractive: true
      // advancesOnClick is false by default
    },
    // Step 6: Final step
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
      makeMove(r, c);
    } else {
      playSound("badmove");
      setInvalidMove({ r, c });
      setTimeout(() => setInvalidMove(null), 300);
    }
  };
  const setOnlineRole = useCallback((role) => {
    playSound("uiclick");
    setOnlineRoleInternal(role);
    masterReset(PLAYER_X);
    setNextStarter(PLAYER_O);
  }, [masterReset, playSound]);
  const gameStateString = useMemo(() => {
    if (gameMode !== "online" /* Online */) return "";
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
  }, [moveHistory, gameMode, playerName, playerPiece, playerOName, playerOPiece]);
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
        const winLine = checkWin(winningPlayer, simBoard);
        if (winLine) {
          setWinInfo(winLine);
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
            if (playerCount === 4) score += 1e5;
            else if (playerCount === 3 && emptyCount === 1) score += 100;
            else if (playerCount === 2 && emptyCount === 2) score += 10;
            if (opponentCount === 3 && emptyCount === 1) score -= 5e3;
            else if (opponentCount === 2 && emptyCount === 2) score -= 50;
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
  const minimax = (currentBoard, currentMovesMade, depth, alpha, beta, maximizingPlayer, scoringFunction, moveHistory2, memory, transpositionTable, moveList = null) => {
    const originalAlpha = alpha;
    const boardKey = getCanonicalBoardKey(currentBoard);
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
    if (moveHistory2.length > 0 && memory.wins.length + memory.losses.length > 0) {
      const canonicalHistory = getCanonicalMoveHistoryString(moveHistory2);
      if (memory.wins.some((w) => w.moves === canonicalHistory)) return { score: 2e5 + depth * 100 };
      if (memory.losses.some((l) => l.moves === canonicalHistory)) return { score: -2e5 - depth * 100 };
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
        const newHistory = [...moveHistory2, { player: AI_PLAYER, r: move.r, c: move.c }];
        const { score } = minimax(newBoard, currentMovesMade + 1, depth - 1, alpha, beta, false, scoringFunction, newHistory, memory, transpositionTable);
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
        const newHistory = [...moveHistory2, { player: HUMAN_PLAYER, r: move.r, c: move.c }];
        const { score } = minimax(newBoard, currentMovesMade + 1, depth - 1, alpha, beta, true, scoringFunction, newHistory, memory, transpositionTable);
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
  const getBestMove = (player, moves, currentBoard, gameHistory, currentMovesMade, memory, depth, scoringFunction) => {
    moves.sort((a, b) => POSITIONAL_VALUE_MAP[b.r][b.c] - POSITIONAL_VALUE_MAP[a.r][a.c]);
    const immediateWinMove = moves.find((move) => {
      const tempBoard = currentBoard.map((r) => [...r]);
      tempBoard[move.r][move.c] = player;
      return checkWin(player, tempBoard);
    });
    if (immediateWinMove) return immediateWinMove;
    const opponent = player === PLAYER_X ? PLAYER_O : PLAYER_X;
    const immediateBlockMove = moves.find((move) => {
      const tempBoard = currentBoard.map((r) => [...r]);
      tempBoard[move.r][move.c] = opponent;
      return checkWin(opponent, tempBoard);
    });
    if (immediateBlockMove) return immediateBlockMove;
    const transpositionTable = /* @__PURE__ */ new Map();
    const isMaximizing = player === AI_PLAYER;
    let bestMove;
    for (let d = 1; d <= depth; d++) {
      const result = minimax(currentBoard, currentMovesMade, d, -Infinity, Infinity, isMaximizing, scoringFunction, gameHistory, memory, transpositionTable, moves);
      if (result.move) {
        bestMove = result.move;
      }
    }
    return bestMove || moves[Math.floor(Math.random() * moves.length)];
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
      if (adaptiveLevel === 0) {
        const immediateWinMove = potentialMoves.find((move) => {
          const tempBoard = board.map((r) => [...r]);
          tempBoard[move.r][move.c] = AI_PLAYER;
          return checkWin(AI_PLAYER, tempBoard);
        });
        if (immediateWinMove) {
          bestMove = immediateWinMove;
        } else {
          const immediateBlockMove = potentialMoves.find((move) => {
            const tempBoard = board.map((r) => [...r]);
            tempBoard[move.r][move.c] = HUMAN_PLAYER;
            return checkWin(HUMAN_PLAYER, tempBoard);
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
      } else if (adaptiveLevel === 1 || adaptiveLevel === 2) {
        const settings = [
          null,
          { depth: 1, strategic: false, threshold: 80 },
          // 1: Novice
          { depth: 2, strategic: false, threshold: 40 }
          // 2: Intermediate
        ];
        const currentSetting = settings[adaptiveLevel];
        const scoringFunction = currentSetting.strategic ? scorePositionStrategic : scorePositionTactical;
        const transpositionTable = /* @__PURE__ */ new Map();
        const moveScores = [];
        for (const move of potentialMoves) {
          const newBoard = board.map((r) => [...r]);
          newBoard[move.r][move.c] = AI_PLAYER;
          if (checkWin(AI_PLAYER, newBoard)) {
            moveScores.push({ move, score: Infinity });
            break;
          }
          const newHistory = [...moveHistory, { player: AI_PLAYER, r: move.r, c: move.c }];
          const { score } = minimax(newBoard, movesMade + 1, currentSetting.depth, -Infinity, Infinity, false, scoringFunction, newHistory, { wins: [], losses: [] }, transpositionTable);
          moveScores.push({ move, score });
        }
        if (moveScores.length > 0) {
          const bestScore = Math.max(...moveScores.map((ms) => ms.score));
          if (bestScore === Infinity) {
            bestMove = moveScores.find((ms) => ms.score === Infinity).move;
          } else {
            const goodMoves = moveScores.filter((ms) => ms.score >= bestScore - currentSetting.threshold).map((ms) => ms.move);
            if (goodMoves.length > 0) {
              bestMove = goodMoves[Math.floor(Math.random() * goodMoves.length)];
            } else {
              bestMove = moveScores.sort((a, b) => b.score - a.score)[0].move;
            }
          }
        }
      } else {
        const settings = [
          null,
          null,
          null,
          { depth: 3, strategic: true, useMemory: false },
          // 3: Expert
          { depth: 3, strategic: true, useMemory: true },
          // 4: Master
          { depth: 4, strategic: true, useMemory: true }
          // 5: Grand Master
        ];
        const currentSetting = settings[adaptiveLevel];
        if (currentSetting) {
          const scoringFunction = currentSetting.strategic ? scorePositionStrategic : scorePositionTactical;
          const memoryToUse = currentSetting.useMemory && isAiLearningEnabled ? gameMemory : { wins: [], losses: [] };
          bestMove = getBestMove(
            AI_PLAYER,
            potentialMoves,
            board,
            moveHistory,
            movesMade,
            memoryToUse,
            currentSetting.depth,
            scoringFunction
          );
        }
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
  }, [validMoves, board, movesMade, makeMove, moveHistory, gameMemory, adaptiveLevel, tutorialState.active, isAiLearningEnabled]);
  useEffect(() => {
    if (!gameOver && gameMode === "pvc" /* PvC */ && currentPlayer === AI_PLAYER && !animationInfo) {
      if (tutorialState.active) {
        if (tutorialState.step !== 5) {
          return;
        }
      }
      setIsThinking(true);
      const timer = setTimeout(computerMove, 500);
      return () => clearTimeout(timer);
    }
  }, [currentPlayer, gameOver, gameMode, computerMove, tutorialState.active, tutorialState.step, animationInfo]);
  const gameStatus = useMemo(() => {
    const currentStepConfig = tutorialState.active && tutorialState.step >= 0 ? TUTORIAL_CONFIG[tutorialState.step] : null;
    if (currentStepConfig && !currentStepConfig.isInteractive) return "Professor Caz's Lesson";
    if (isSimulatingRef.current) return simulationStatus;
    if (gameOver) {
      if (winInfo) {
        const winner = board[winInfo[0].r][winInfo[0].c];
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
    while (isSimulatingRef.current) {
      const validSimMoves = getValidMoves(simBoard, simMovesMade);
      if (validSimMoves.length === 0) return { history: simHistory, winner: null };
      let move;
      const EXPLORATION_RATE = 0.1;
      if (Math.random() < EXPLORATION_RATE) {
        move = validSimMoves[Math.floor(Math.random() * validSimMoves.length)];
      } else {
        move = getBestMove(simCurrentPlayer, validSimMoves, simBoard, simHistory, simMovesMade, memory, 4, scorePositionStrategic);
      }
      if (!move) move = validSimMoves[Math.floor(Math.random() * validSimMoves.length)];
      simBoard[move.r][move.c] = simCurrentPlayer;
      simMovesMade++;
      simHistory.push({ player: simCurrentPlayer, r: move.r, c: move.c });
      const winner = checkWin(simCurrentPlayer, simBoard);
      if (winner) return { history: simHistory, winner: simCurrentPlayer };
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
      if (gameResult) {
        const { history, winner } = gameResult;
        const moveString = getCanonicalMoveHistoryString(history);
        if (winner === AI_PLAYER) {
          if (moveString && !currentMemory.wins.some((w) => w.moves === moveString)) currentMemory.wins.push({ moves: moveString });
        } else if (winner === HUMAN_PLAYER) {
          if (moveString && !currentMemory.losses.some((l) => l.moves === moveString)) currentMemory.losses.push({ moves: moveString });
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
    alert(`AI training complete! Memory now has ${currentMemory.wins.length} winning paths and ${currentMemory.losses.length} losing paths.`);
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
    a.download = "caz-connect-ai-memory.json";
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
        if (importedMemory && Array.isArray(importedMemory.wins) && Array.isArray(importedMemory.losses)) {
          setGameMemory(importedMemory);
          localStorage.setItem("cazConnectMemory", JSON.stringify(importedMemory));
          alert(`AI Memory imported successfully!
Wins: ${importedMemory.wins.length}
Losses: ${importedMemory.losses.length}`);
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
  const setGameModeAction = useCallback((mode) => {
    if (isSimulatingRef.current || tutorialState.active || gameMode === mode) return;
    playSound("uiclick");
    isSwitchingMode.current = true;
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
    } catch (error) {
      console.error("Failed to save game state to localStorage", error);
    }
    masterReset(PLAYER_X);
    setNextStarter(PLAYER_O);
    if (mode !== "online" /* Online */) {
      setOnlineRoleInternal(null);
    }
    setGameMode(mode);
  }, [
    tutorialState.active,
    gameMode,
    board,
    currentPlayer,
    nextStarter,
    movesMade,
    gameOver,
    winInfo,
    lastMove,
    moveHistory,
    masterReset,
    playSound
  ]);
  const handleUIClick = useCallback(() => {
    playSound("uiclick");
  }, [playSound]);
  const toggleAutoAdjustLevel = useCallback(() => {
    playSound("uiclick");
    setAutoAdjustLevel((prev) => !prev);
  }, [playSound]);
  const setAdaptiveLevelManual = useCallback((level) => {
    playSound("uiclick");
    if (adaptiveLevel === level) return;
    if (movesMade > 0 && !gameOver && gameMode === "pvc" /* PvC */) {
      setConfirmAction({
        isOpen: true,
        title: "Change Difficulty?",
        message: "This will forfeit the current game and count as a loss. Are you sure?",
        confirmText: "Forfeit & Change",
        onConfirm: () => {
          playSound("uiclick");
          recordGameResult(moveHistory, AI_PLAYER);
          setAdaptiveLevel(level);
          _startNewGame();
          setConfirmAction(null);
        }
      });
    } else {
      setAdaptiveLevel(level);
      if (gameOver) {
        _startNewGame();
      }
    }
  }, [playSound, adaptiveLevel, movesMade, gameOver, gameMode, recordGameResult, _startNewGame, moveHistory]);
  const resetGame = useCallback(() => {
    if (movesMade > 0 && !gameOver) {
      setConfirmAction({
        isOpen: true,
        title: "Forfeit Game?",
        message: "Starting a new game will count the current one as a loss. Are you sure?",
        confirmText: "Forfeit & Restart",
        onConfirm: () => {
          playSound("uiclick");
          if (gameMode === "pvc" /* PvC */) {
            recordGameResult(moveHistory, AI_PLAYER);
          } else if (gameMode === "pvp" /* PvP */) {
            const winner = currentPlayer === PLAYER_X ? PLAYER_O : PLAYER_X;
            setScores((prev) => {
              const newScores = JSON.parse(JSON.stringify(prev));
              newScores[gameMode][winner]++;
              return newScores;
            });
          }
          _startNewGame();
          setConfirmAction(null);
        }
      });
    } else {
      _startNewGame();
    }
  }, [movesMade, gameOver, gameMode, currentPlayer, moveHistory, recordGameResult, _startNewGame, playSound]);
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
    levelChange,
    showRulesModal,
    confirmAction,
    playerName,
    playerPiece,
    playerOName,
    playerOPiece,
    detailedStats,
    unlockedAchievements,
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
      setOnlineRole,
      loadOnlineGame,
      dismissUnlockModal,
      dismissGameOverModal,
      openRulesModal,
      closeRulesModal,
      cancelConfirmAction,
      toggleAutoAdjustLevel,
      setAdaptiveLevelManual,
      toggleIsAiLearningEnabled,
      setPlayerName,
      setPlayerPiece,
      setPlayerOName,
      setPlayerOPiece,
      handleUIClick
    }
  };
};

// components/Header.tsx
import { jsx, jsxs } from "react/jsx-runtime";
var Mascot = ({ isThinking }) => /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsx(
  "img",
  {
    src: "./professor-caz.png",
    alt: "Professor Caz Mascot",
    className: `h-[90px] w-[90px] lg:h-[110px] lg:w-[110px] rounded-2xl shadow-lg flex-shrink-0 transition-opacity duration-500 mascot-image ${isThinking ? "animate-pulse" : ""}`
  }
) });
var Header = ({ isThinking }) => {
  return /* @__PURE__ */ jsx("header", { className: "title-container flex flex-row items-center justify-center gap-4 w-full mt-2.5", children: /* @__PURE__ */ jsxs("div", { className: "title-left flex items-center gap-2 sm:gap-4 min-w-0", children: [
    /* @__PURE__ */ jsx(Mascot, { isThinking }),
    /* @__PURE__ */ jsxs("div", { className: "title-text-group text-left min-w-0", children: [
      /* @__PURE__ */ jsx("h1", { className: "title-font header-title font-bold text-2xl sm:text-3xl md:text-4xl lg:text-5xl m-0 tracking-wide", children: "Caz Connect" }),
      /* @__PURE__ */ jsx("h2", { className: "font-normal text-xs sm:text-sm md:text-lg lg:text-xl m-0 -mt-1 header-subtitle hidden sm:block", children: "A Game of Gravity & Connection" })
    ] })
  ] }) });
};
var Header_default = Header;

// components/Status.tsx
import { jsx as jsx2, jsxs as jsxs2 } from "react/jsx-runtime";
var Status = ({ statusText, scores, gameMode, adaptiveLevel, playerName, playerPiece, playerOName, playerOPiece, currentPlayer, gameOver }) => {
  const playerXLabel = `${playerName} (${playerPiece})`;
  const playerOLabel = gameMode === "pvc" /* PvC */ ? `Professor Caz (${LEVEL_NAMES[adaptiveLevel]})` : `${playerOName} (${playerOPiece})`;
  return /* @__PURE__ */ jsxs2("div", { className: "order-2 w-full text-center my-4 lg:my-5", children: [
    /* @__PURE__ */ jsx2("p", { className: "piece-font text-2xl font-semibold m-0 mb-3 min-h-[36px] status-text", children: statusText }),
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
import { jsx as jsx3, jsxs as jsxs3 } from "react/jsx-runtime";
var Cell = ({ value, playerPiece, playerOPiece, isLastMove, isValid, highlightValid, isWinningPiece, isTutorialHighlighted, isInvalidMoveAttempt, onClick, "data-row": dataRow, "data-col": dataCol }) => {
  const playerClasses = value === "X" ? "player-x-piece" : "player-o-piece";
  const baseClasses = "relative aspect-square text-[5.5vmin] lg:text-[42px] flex items-center justify-center font-bold transition-all duration-200 piece-font leading-none text-center select-none";
  const stateClasses = `
        ${value ? playerClasses : ""}
        ${isLastMove && !isWinningPiece ? "bg-slate-400/30 rounded-lg" : ""}
        ${isValid ? "cursor-pointer rounded-lg hover:bg-slate-500/20" : "cursor-not-allowed"}
        ${highlightValid ? "bg-slate-400/20 rounded-lg" : ""}
    `;
  const animationClasses = [
    isLastMove ? "animate-pop-in" : "",
    isWinningPiece ? "animate-win-pulse" : "",
    isTutorialHighlighted ? "animate-tutorial-pulse" : "",
    isInvalidMoveAttempt ? "animate-invalid-move" : ""
  ].filter(Boolean).join(" ");
  const displayValue = value === "X" /* X */ ? playerPiece : value === "O" /* O */ ? playerOPiece : value;
  return /* @__PURE__ */ jsxs3(
    "div",
    {
      className: `${baseClasses} ${stateClasses} ${animationClasses} board-cell ${isValid ? "valid-move" : ""}`,
      onClick,
      "data-row": dataRow,
      "data-col": dataCol,
      children: [
        displayValue,
        /* @__PURE__ */ jsx3("style", { children: `
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
            ` })
      ]
    }
  );
};
var Cell_default = Cell;

// components/AnimatedPiece.tsx
import { useState as useState2, useLayoutEffect } from "react";
import { jsx as jsx4 } from "react/jsx-runtime";
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
  return /* @__PURE__ */ jsx4("div", { style, className: "text-[5.5vmin] lg:text-[42px] flex items-center justify-center font-bold piece-font leading-none text-center", children: /* @__PURE__ */ jsx4("span", { className: playerClass, children: displayPiece }) });
};
var AnimatedPiece_default = AnimatedPiece;

// components/Board.tsx
import { jsx as jsx5, jsxs as jsxs4 } from "react/jsx-runtime";
var Board = ({ board, onCellClick, validMoves, lastMove, winInfo, invalidMove, isThinking, tutorialHighlight, animationInfo, adaptiveLevel, gameMode, playerPiece, playerOPiece }) => {
  const boardRef = useRef2(null);
  const [lineData, setLineData] = useState3(null);
  const [isLineVisible, setIsLineVisible] = useState3(false);
  const calculateAndSetLine = useCallback2(() => {
    const boardEl = boardRef.current;
    if (!winInfo || !boardEl) {
      setLineData(null);
      return false;
    }
    const boardRect = boardEl.getBoundingClientRect();
    const startCell = boardEl.querySelector(`[data-row='${winInfo[0].r}'][data-col='${winInfo[0].c}']`);
    const endCell = boardEl.querySelector(`[data-row='${winInfo[winInfo.length - 1].r}'][data-col='${winInfo[winInfo.length - 1].c}']`);
    if (!startCell || !endCell || startCell.offsetWidth === 0) {
      return false;
    }
    const startRect = startCell.getBoundingClientRect();
    const endRect = endCell.getBoundingClientRect();
    const x1 = startRect.left + startRect.width / 2 - boardRect.left;
    const y1 = startRect.top + startRect.height / 2 - boardRect.top;
    const x2 = endRect.left + endRect.width / 2 - boardRect.left;
    const y2 = endRect.top + endRect.height / 2 - boardRect.top;
    const width = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
    const rotation = Math.atan2(y2 - y1, x2 - x1) * (180 / Math.PI);
    setLineData({
      x: x1,
      y: y1,
      width,
      rotation
    });
    return true;
  }, [winInfo]);
  useEffect2(() => {
    if (winInfo) {
      let animationFrameId;
      const attemptToDraw = () => {
        if (!calculateAndSetLine()) {
          animationFrameId = requestAnimationFrame(attemptToDraw);
        }
      };
      const timerId = setTimeout(attemptToDraw, 50);
      window.addEventListener("resize", calculateAndSetLine);
      return () => {
        clearTimeout(timerId);
        cancelAnimationFrame(animationFrameId);
        window.removeEventListener("resize", calculateAndSetLine);
      };
    } else {
      setLineData(null);
      setIsLineVisible(false);
    }
  }, [winInfo, calculateAndSetLine]);
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
    return new Set(winInfo.map((m) => `${m.r}-${m.c}`));
  }, [winInfo]);
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
  return /* @__PURE__ */ jsxs4("div", { className: "relative w-[90vmin] max-w-[525px] lg:w-[525px] p-2 board-frame rounded-lg shadow-2xl", ref: boardRef, children: [
    /* @__PURE__ */ jsx5(
      "div",
      {
        className: `aspect-square grid grid-cols-8 grid-rows-8 gap-0 transition-opacity duration-300 board-grid ${isThinking ? "cursor-wait opacity-60" : ""}`,
        children: board.map(
          (row, r) => row.map((cell, c) => {
            const isCellValid = !winInfo && validMovesSet.has(`${r}-${c}`);
            const isWinningPiece = winPiecesSet.has(`${r}-${c}`);
            const isTutorialHighlighted = tutorialHighlightedCells.has(`${r}-${c}`);
            const isInvalidMoveAttempt = invalidMove?.r === r && invalidMove?.c === c;
            return /* @__PURE__ */ jsx5(
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
    /* @__PURE__ */ jsx5(AnimatedPiece_default, { animationInfo, boardRef, playerPiece, playerOPiece }),
    lineData && /* @__PURE__ */ jsxs4("svg", { className: "absolute top-0 left-0 w-full h-full pointer-events-none overflow-visible", children: [
      /* @__PURE__ */ jsx5("defs", { children: /* @__PURE__ */ jsxs4("filter", { id: "glow", x: "-50%", y: "-50%", width: "200%", height: "200%", children: [
        /* @__PURE__ */ jsx5("feGaussianBlur", { stdDeviation: "3.5", result: "coloredBlur" }),
        /* @__PURE__ */ jsxs4("feMerge", { children: [
          /* @__PURE__ */ jsx5("feMergeNode", { in: "coloredBlur" }),
          /* @__PURE__ */ jsx5("feMergeNode", { in: "SourceGraphic" })
        ] })
      ] }) }),
      /* @__PURE__ */ jsx5("g", { transform: `translate(${lineData.x}, ${lineData.y}) rotate(${lineData.rotation})`, children: /* @__PURE__ */ jsx5(
        "rect",
        {
          x: "0",
          y: "-2.5",
          width: isLineVisible ? lineData.width : 0,
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
      ) })
    ] })
  ] });
};
var Board_default = Board;

// components/Controls.tsx
import { useState as useState5, useRef as useRef4, useEffect as useEffect3 } from "react";

// components/OnlineControls.tsx
import { useState as useState4, useRef as useRef3 } from "react";
import { jsx as jsx6, jsxs as jsxs5 } from "react/jsx-runtime";
var OnlineControls = ({ onlineRole, setOnlineRole, gameStateString, loadOnlineGame, currentPlayer, isGameOver, allDisabled, onUIClick }) => {
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
      /* @__PURE__ */ jsx6("p", { className: "text-center font-bold", children: "New Online Game" }),
      /* @__PURE__ */ jsxs5("div", { className: "grid grid-cols-2 gap-2.5", children: [
        /* @__PURE__ */ jsx6("button", { onClick: () => setOnlineRole("X" /* X */), disabled: allDisabled, className: "control-button secondary-button", children: "Start as X" }),
        /* @__PURE__ */ jsx6("button", { onClick: () => setOnlineRole("O" /* O */), disabled: allDisabled, className: "control-button secondary-button", children: "Join as O" })
      ] }),
      /* @__PURE__ */ jsxs5("div", { className: "flex items-center my-2", children: [
        /* @__PURE__ */ jsx6("hr", { className: "flex-grow border-[var(--panel-border)] opacity-50" }),
        /* @__PURE__ */ jsx6("span", { className: "px-2 text-xs uppercase", style: { color: "var(--text-panel)" }, children: "Or" }),
        /* @__PURE__ */ jsx6("hr", { className: "flex-grow border-[var(--panel-border)] opacity-50" })
      ] }),
      /* @__PURE__ */ jsx6("p", { className: "text-center font-bold", children: "Rejoin Game" }),
      /* @__PURE__ */ jsxs5("div", { className: "flex flex-col gap-2", children: [
        /* @__PURE__ */ jsx6("label", { htmlFor: "rejoin-code-input", className: "control-label", children: "Paste a game code to load it:" }),
        /* @__PURE__ */ jsx6(
          "textarea",
          {
            id: "rejoin-code-input",
            value: pastedCode,
            onChange: (e) => setPastedCode(e.target.value),
            className: "control-input w-full h-20 resize-none",
            placeholder: "Paste code here...",
            disabled: allDisabled
          }
        ),
        /* @__PURE__ */ jsx6("button", { onClick: () => {
          loadOnlineGame(pastedCode);
          setPastedCode("");
        }, disabled: allDisabled || !pastedCode, className: "control-button primary-button", children: "Load Game" })
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
      /* @__PURE__ */ jsx6("p", { className: "font-semibold control-label min-h-[20px]", children: isGameOver ? "Game Over!" : isMyTurn ? "It's your turn!" : `Waiting for Player ${currentPlayer}...` })
    ] }),
    !isMyTurn && !isGameOver && /* @__PURE__ */ jsxs5("div", { className: "flex flex-col gap-2", children: [
      /* @__PURE__ */ jsx6("label", { htmlFor: "game-code-input", className: "control-label", children: "Paste opponent's game code:" }),
      /* @__PURE__ */ jsx6(
        "textarea",
        {
          id: "game-code-input",
          value: pastedCode,
          onChange: (e) => setPastedCode(e.target.value),
          className: "control-input w-full h-24 resize-none",
          placeholder: "Paste code here...",
          disabled: allDisabled
        }
      ),
      /* @__PURE__ */ jsx6("button", { onClick: () => {
        loadOnlineGame(pastedCode);
        setPastedCode("");
      }, disabled: allDisabled || !pastedCode, className: "control-button primary-button", children: "Load Move" })
    ] }),
    gameStateString && /* @__PURE__ */ jsxs5("div", { className: "flex flex-col gap-2 mt-2", children: [
      /* @__PURE__ */ jsx6("label", { htmlFor: "game-code-output", className: "control-label", children: "Share this code with your opponent:" }),
      /* @__PURE__ */ jsx6(
        "textarea",
        {
          id: "game-code-output",
          ref: codeTextRef,
          value: gameStateString,
          readOnly: true,
          className: "control-input w-full h-24 resize-none cursor-copy",
          onFocus: (e) => e.target.select()
        }
      ),
      /* @__PURE__ */ jsx6("button", { onClick: handleCopyCode, disabled: allDisabled, className: "control-button secondary-button", children: copySuccess ? "Copied!" : "Copy Code" })
    ] })
  ] });
};
var OnlineControls_default = OnlineControls;

// components/ReleaseNotesModal.tsx
import { jsx as jsx7, jsxs as jsxs6 } from "react/jsx-runtime";
var ReleaseNotesModal = ({ onClose }) => {
  return /* @__PURE__ */ jsx7(
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
            /* @__PURE__ */ jsx7("h2", { className: "text-3xl font-bold title-font mb-4", style: { color: "var(--text-header)" }, children: "Version 1.1.1 Patch Notes" }),
            /* @__PURE__ */ jsxs6("div", { className: "overflow-y-auto text-left space-y-4 text-base pr-2 -mr-2", children: [
              /* @__PURE__ */ jsx7("p", { children: "This is a major update focused on significantly upgrading Professor Caz's AI and improving the overall quality of life for all players." }),
              /* @__PURE__ */ jsxs6("div", { children: [
                /* @__PURE__ */ jsx7("h3", { className: "font-bold text-lg", style: { color: "var(--text-panel)" }, children: "Major AI Overhaul: The Professor's Brain Upgrade" }),
                /* @__PURE__ */ jsxs6("ul", { className: "list-disc list-inside space-y-2 mt-2 text-sm", children: [
                  /* @__PURE__ */ jsxs6("li", { children: [
                    /* @__PURE__ */ jsx7("strong", { children: "Blazing Fast Performance:" }),
                    " The AI's core logic has been rewritten to use an advanced technique called ",
                    /* @__PURE__ */ jsx7("strong", { children: "Bitboards" }),
                    ". This makes his move calculations, board evaluations, and win-checking hundreds of times faster. You'll notice near-instantaneous moves, even on the highest difficulty levels."
                  ] }),
                  /* @__PURE__ */ jsxs6("li", { children: [
                    /* @__PURE__ */ jsx7("strong", { children: "Enhanced Tactical Strength:" }),
                    " We've implemented ",
                    /* @__PURE__ */ jsx7("strong", { children: "Quiescence Search" }),
                    ', a powerful optimization that helps the AI avoid the "horizon effect." Professor Caz is now much better at spotting and defending against multi-move threats.'
                  ] }),
                  /* @__PURE__ */ jsxs6("li", { children: [
                    /* @__PURE__ */ jsx7("strong", { children: "Smarter Search:" }),
                    " The AI now recognizes ",
                    /* @__PURE__ */ jsx7("strong", { children: "Board Symmetries" }),
                    ". He understands that a rotated or reflected board is strategically the same, preventing him from wasting time recalculating identical positions. This, combined with improved ",
                    /* @__PURE__ */ jsx7("strong", { children: "Move Ordering" }),
                    " and ",
                    /* @__PURE__ */ jsx7("strong", { children: "Iterative Deepening" }),
                    ", allows him to think deeper and more efficiently."
                  ] }),
                  /* @__PURE__ */ jsxs6("li", { children: [
                    /* @__PURE__ */ jsx7("strong", { children: "Less Predictable, More Human (Lower Levels):" }),
                    ' The AI is now much less predictable on easier difficulties, providing a more engaging experience. "Beginner" makes more purposeful, weighted-random moves, while "Novice" and "Intermediate" will now choose from a pool of "good" moves rather than the single "perfect" move every time.'
                  ] })
                ] })
              ] }),
              /* @__PURE__ */ jsxs6("div", { children: [
                /* @__PURE__ */ jsx7("h3", { className: "font-bold text-lg", style: { color: "var(--text-panel)" }, children: "Quality of Life & UI/UX Improvements" }),
                /* @__PURE__ */ jsxs6("ul", { className: "list-disc list-inside space-y-2 mt-2 text-sm", children: [
                  /* @__PURE__ */ jsxs6("li", { children: [
                    /* @__PURE__ */ jsx7("strong", { children: "Forfeit Confirmation:" }),
                    " Starting a new game or changing the difficulty mid-match now brings up a confirmation pop-up, asking if you want to forfeit the current game (which will count as a loss). No more accidental resets!"
                  ] }),
                  /* @__PURE__ */ jsxs6("li", { children: [
                    /* @__PURE__ */ jsx7("strong", { children: "Screen Wake Lock:" }),
                    " For our mobile players, the screen will no longer automatically lock or turn off while you're in the middle of a game."
                  ] }),
                  /* @__PURE__ */ jsxs6("li", { children: [
                    /* @__PURE__ */ jsx7("strong", { children: "Interactive Trophies:" }),
                    " In the Player Stats modal, you can now click on any *unlocked* achievement to see its full name and description."
                  ] }),
                  /* @__PURE__ */ jsxs6("li", { children: [
                    /* @__PURE__ */ jsx7("strong", { children: "No More Interruptions:" }),
                    " The right-click context menu has been disabled to prevent it from accidentally pausing the AI's turn."
                  ] })
                ] })
              ] }),
              /* @__PURE__ */ jsxs6("div", { children: [
                /* @__PURE__ */ jsx7("h3", { className: "font-bold text-lg", style: { color: "var(--text-panel)" }, children: "Bug Fixes" }),
                /* @__PURE__ */ jsxs6("ul", { className: "list-disc list-inside space-y-2 mt-2 text-sm", children: [
                  /* @__PURE__ */ jsx7("li", { children: "Addressed several critical bugs related to the new bitboard engine to ensure all win conditions are detected correctly and fairly." }),
                  /* @__PURE__ */ jsx7("li", { children: "Numerous minor stability and performance improvements." })
                ] })
              ] }),
              /* @__PURE__ */ jsx7("p", { className: "pt-2", children: "Thank you for playing and for all your valuable feedback! We hope you enjoy the new and improved challenge." })
            ] }),
            /* @__PURE__ */ jsx7("div", { className: "mt-6", children: /* @__PURE__ */ jsx7(
              "button",
              {
                onClick: onClose,
                className: "control-button primary-button w-full",
                children: "Close"
              }
            ) }),
            /* @__PURE__ */ jsx7("style", { children: `
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

// components/Controls.tsx
import { jsx as jsx8, jsxs as jsxs7 } from "react/jsx-runtime";
var SectionHeader = ({ children }) => /* @__PURE__ */ jsx8("h3", { className: "text-sm font-bold uppercase tracking-wider mb-2 mt-4 first:mt-0 section-header", children });
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
  onUIClick
}) => {
  const [simGames, setSimGames] = useState5(100);
  const [isLabOpen, setIsLabOpen] = useState5(false);
  const fileInputRef = useRef4(null);
  const [activeTab, setActiveTab] = useState5("setup");
  const [showReleaseNotesModal, setShowReleaseNotesModal] = useState5(false);
  const appVersion = "1.1.1";
  const [tempPlayerName, setTempPlayerName] = useState5(playerName);
  const [tempPlayerPiece, setTempPlayerPiece] = useState5(playerPiece);
  const [tempPlayerOName, setTempPlayerOName] = useState5(playerOName);
  const [tempPlayerOPiece, setTempPlayerOPiece] = useState5(playerOPiece);
  const [isSaved, setIsSaved] = useState5(false);
  useEffect3(() => {
    setTempPlayerName(playerName);
  }, [playerName]);
  useEffect3(() => {
    setTempPlayerPiece(playerPiece);
  }, [playerPiece]);
  useEffect3(() => {
    setTempPlayerOName(playerOName);
  }, [playerOName]);
  useEffect3(() => {
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
  return /* @__PURE__ */ jsxs7("div", { className: "flex flex-col items-stretch w-11/12 lg:w-full gap-2.5 p-4 rounded-lg component-panel", children: [
    /* @__PURE__ */ jsx8(SectionHeader, { children: "Actions" }),
    /* @__PURE__ */ jsx8("button", { onClick: onReset, disabled: allDisabled, className: "control-button primary-button w-full", children: "New Game" }),
    /* @__PURE__ */ jsxs7("div", { className: "tab-nav mt-4", children: [
      /* @__PURE__ */ jsx8("button", { className: `tab-button ${activeTab === "setup" ? "active" : ""}`, onClick: () => {
        onUIClick();
        setActiveTab("setup");
      }, disabled: allDisabled, children: "Setup" }),
      /* @__PURE__ */ jsx8("button", { className: `tab-button ${activeTab === "profile" ? "active" : ""}`, onClick: () => {
        onUIClick();
        setActiveTab("profile");
      }, disabled: allDisabled, children: "Profile" }),
      /* @__PURE__ */ jsx8("button", { className: `tab-button ${activeTab === "options" ? "active" : ""}`, onClick: () => {
        onUIClick();
        setActiveTab("options");
      }, disabled: allDisabled, children: "Options" }),
      /* @__PURE__ */ jsx8("button", { className: `tab-button ${activeTab === "about" ? "active" : ""}`, onClick: () => {
        onUIClick();
        setActiveTab("about");
      }, disabled: allDisabled, children: "About" })
    ] }),
    /* @__PURE__ */ jsxs7("div", { className: "tab-content", children: [
      activeTab === "setup" && /* @__PURE__ */ jsxs7("div", { className: "animate-fade-in-fast", children: [
        /* @__PURE__ */ jsx8(SectionHeader, { children: "Game Setup" }),
        /* @__PURE__ */ jsxs7("div", { className: "game-mode-toggle", children: [
          /* @__PURE__ */ jsx8(
            "button",
            {
              onClick: () => setGameMode("pvc" /* PvC */),
              disabled: allDisabled,
              className: `toggle-option ${gameMode === "pvc" /* PvC */ ? "active" : ""}`,
              children: "vs. AI"
            }
          ),
          /* @__PURE__ */ jsx8(
            "button",
            {
              onClick: () => setGameMode("pvp" /* PvP */),
              disabled: allDisabled,
              className: `toggle-option ${gameMode === "pvp" /* PvP */ ? "active" : ""}`,
              children: "vs. Player"
            }
          ),
          /* @__PURE__ */ jsx8(
            "button",
            {
              onClick: () => setGameMode("online" /* Online */),
              disabled: allDisabled,
              className: `toggle-option ${gameMode === "online" /* Online */ ? "active" : ""}`,
              children: "Online"
            }
          )
        ] }),
        gameMode === "pvc" /* PvC */ && /* @__PURE__ */ jsxs7("div", { className: "flex flex-col gap-2 mt-2 pt-2", children: [
          /* @__PURE__ */ jsxs7("div", { className: "control-row", children: [
            /* @__PURE__ */ jsx8("label", { htmlFor: "auto-adjust-check", className: "control-label", children: "Auto-Adjust Level:" }),
            /* @__PURE__ */ jsx8(
              "button",
              {
                id: "auto-adjust-check",
                role: "switch",
                "aria-checked": autoAdjustLevel,
                onClick: onToggleAutoAdjustLevel,
                disabled: allDisabled,
                className: `toggle-switch ${autoAdjustLevel ? "active" : ""}`,
                children: /* @__PURE__ */ jsx8("span", { className: "toggle-switch-handle" })
              }
            )
          ] }),
          /* @__PURE__ */ jsxs7("div", { className: "control-row", children: [
            /* @__PURE__ */ jsx8("label", { htmlFor: "difficulty-level", className: "control-label", children: "Level:" }),
            /* @__PURE__ */ jsxs7("select", { id: "difficulty-level", value: adaptiveLevel, onChange: (e) => onSetAdaptiveLevel(parseInt(e.target.value, 10)), disabled: allDisabled || autoAdjustLevel, className: "control-select", children: [
              /* @__PURE__ */ jsx8("option", { value: 0, children: "Beginner" }),
              /* @__PURE__ */ jsx8("option", { value: 1, children: "Novice" }),
              /* @__PURE__ */ jsx8("option", { value: 2, children: "Intermediate" }),
              /* @__PURE__ */ jsx8("option", { value: 3, children: "Expert" }),
              /* @__PURE__ */ jsx8("option", { value: 4, children: "Master" }),
              /* @__PURE__ */ jsx8("option", { value: 5, children: "Grand Master" })
            ] })
          ] })
        ] }),
        gameMode === "online" /* Online */ && /* @__PURE__ */ jsx8(
          OnlineControls_default,
          {
            onlineRole,
            setOnlineRole,
            gameStateString,
            loadOnlineGame,
            currentPlayer,
            isGameOver: gameOver,
            allDisabled,
            onUIClick
          }
        )
      ] }),
      activeTab === "profile" && /* @__PURE__ */ jsxs7("div", { className: "animate-fade-in-fast", children: [
        /* @__PURE__ */ jsx8(SectionHeader, { children: "Personalization" }),
        /* @__PURE__ */ jsxs7("div", { className: "flex flex-col gap-2", children: [
          /* @__PURE__ */ jsx8("h4", { className: "font-semibold text-center -mb-1", style: { color: "var(--text-panel)" }, children: gameMode === "pvp" /* PvP */ ? "Player 1 (X)" : "Your Profile" }),
          /* @__PURE__ */ jsxs7("div", { className: "control-row", children: [
            /* @__PURE__ */ jsx8("label", { htmlFor: "player-name-input", className: "control-label flex-shrink-0", children: "Name:" }),
            /* @__PURE__ */ jsx8(
              "input",
              {
                id: "player-name-input",
                type: "text",
                value: tempPlayerName,
                onChange: (e) => setTempPlayerName(e.target.value),
                disabled: allDisabled,
                className: "control-input flex-grow min-w-0",
                placeholder: "Enter name..."
              }
            )
          ] }),
          /* @__PURE__ */ jsxs7("div", { className: "control-row", children: [
            /* @__PURE__ */ jsx8("label", { htmlFor: "player-piece-input", className: "control-label", children: "Piece:" }),
            /* @__PURE__ */ jsx8(
              "input",
              {
                id: "player-piece-input",
                type: "text",
                value: tempPlayerPiece,
                onChange: (e) => setTempPlayerPiece(e.target.value),
                disabled: allDisabled,
                className: "control-input w-20 text-center",
                placeholder: "X",
                maxLength: 2
              }
            )
          ] })
        ] }),
        gameMode === "pvp" /* PvP */ && /* @__PURE__ */ jsxs7("div", { className: "flex flex-col gap-2 mt-4 pt-4 border-t lab-section", children: [
          /* @__PURE__ */ jsx8("h4", { className: "font-semibold text-center -mb-1", style: { color: "var(--text-panel)" }, children: "Player 2 (O)" }),
          /* @__PURE__ */ jsxs7("div", { className: "control-row", children: [
            /* @__PURE__ */ jsx8("label", { htmlFor: "player-o-name-input", className: "control-label flex-shrink-0", children: "Name:" }),
            /* @__PURE__ */ jsx8(
              "input",
              {
                id: "player-o-name-input",
                type: "text",
                value: tempPlayerOName,
                onChange: (e) => setTempPlayerOName(e.target.value),
                disabled: allDisabled,
                className: "control-input flex-grow min-w-0",
                placeholder: "Player O..."
              }
            )
          ] }),
          /* @__PURE__ */ jsxs7("div", { className: "control-row", children: [
            /* @__PURE__ */ jsx8("label", { htmlFor: "player-o-piece-input", className: "control-label", children: "Piece:" }),
            /* @__PURE__ */ jsx8(
              "input",
              {
                id: "player-o-piece-input",
                type: "text",
                value: tempPlayerOPiece,
                onChange: (e) => setTempPlayerOPiece(e.target.value),
                disabled: allDisabled,
                className: "control-input w-20 text-center",
                placeholder: "O",
                maxLength: 2
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxs7("div", { className: "mt-4 flex items-center justify-end gap-2", children: [
          isSaved && /* @__PURE__ */ jsx8("span", { className: "text-sm animate-fade-in-fast", style: { color: "var(--toggle-active-bg)" }, children: "Saved!" }),
          /* @__PURE__ */ jsx8("button", { onClick: handleApplyChanges, disabled: allDisabled || !hasChanges, className: "control-button primary-button", children: "Apply" })
        ] })
      ] }),
      activeTab === "options" && /* @__PURE__ */ jsxs7("div", { className: "animate-fade-in-fast", children: [
        /* @__PURE__ */ jsx8(SectionHeader, { children: "Preferences" }),
        /* @__PURE__ */ jsxs7("div", { className: "control-row", children: [
          /* @__PURE__ */ jsx8("label", { htmlFor: "enable-animations-check", className: "control-label", children: "Animations:" }),
          /* @__PURE__ */ jsx8(
            "button",
            {
              id: "enable-animations-check",
              role: "switch",
              "aria-checked": isAnimationEnabled,
              onClick: onToggleAnimation,
              disabled: allDisabled,
              className: `toggle-switch ${isAnimationEnabled ? "active" : ""}`,
              children: /* @__PURE__ */ jsx8("span", { className: "toggle-switch-handle" })
            }
          )
        ] }),
        "vibrate" in navigator && /* @__PURE__ */ jsxs7("div", { className: "control-row", children: [
          /* @__PURE__ */ jsx8("label", { htmlFor: "enable-haptics-check", className: "control-label", children: "Vibrations:" }),
          /* @__PURE__ */ jsx8(
            "button",
            {
              id: "enable-haptics-check",
              role: "switch",
              "aria-checked": isHapticEnabled,
              onClick: onToggleHapticEnabled,
              disabled: allDisabled,
              className: `toggle-switch ${isHapticEnabled ? "active" : ""}`,
              children: /* @__PURE__ */ jsx8("span", { className: "toggle-switch-handle" })
            }
          )
        ] }),
        /* @__PURE__ */ jsxs7("div", { className: "control-row", children: [
          /* @__PURE__ */ jsx8("label", { htmlFor: "theme-switcher", className: "control-label", children: "Theme:" }),
          /* @__PURE__ */ jsx8(
            "button",
            {
              id: "theme-switcher",
              onClick: onToggleTheme,
              disabled: allDisabled,
              className: "control-button secondary-button w-1/2",
              children: theme === "science" ? "Cosmic" : "Science"
            }
          )
        ] })
      ] }),
      activeTab === "about" && /* @__PURE__ */ jsxs7("div", { className: "animate-fade-in-fast text-sm", children: [
        /* @__PURE__ */ jsx8(SectionHeader, { children: "Join the Community" }),
        /* @__PURE__ */ jsxs7("div", { className: "flex flex-col gap-2.5", children: [
          /* @__PURE__ */ jsx8("a", { href: "https://sengle.itch.io/caz-connect", target: "_blank", rel: "noopener noreferrer", className: "control-button secondary-button text-center", children: "Support on Itch.io" }),
          /* @__PURE__ */ jsx8("a", { href: "https://discord.gg/uAm43yApGY", target: "_blank", rel: "noopener noreferrer", className: "control-button secondary-button text-center", children: "Join our Discord" })
        ] }),
        /* @__PURE__ */ jsx8(SectionHeader, { children: "Think You Know Connect-Four? Think Again." }),
        /* @__PURE__ */ jsxs7("p", { className: "mb-2", children: [
          'Deep in the halls of Cazenovia High, during an ordinary AP Science class, a new game was born. A few bored geeks took a classic concept and asked a simple question: what if you could only play on the edges? The result was "8 by 8", a strategic challenge that will change the way you think about connecting four. Years later, former student ',
          /* @__PURE__ */ jsx8("strong", { children: "IJuan" }),
          " rediscovered the rules and brought the game to the digital world for all to enjoy as ",
          /* @__PURE__ */ jsx8("strong", { children: "Caz Connect" }),
          "."
        ] }),
        /* @__PURE__ */ jsxs7("p", { className: "mb-4", children: [
          "Meet your host, ",
          /* @__PURE__ */ jsx8("strong", { children: "Professor Caz" }),
          ', the wise owl who has perfected this unique game of "four-way gravity." In his world, every piece must be supported. Your journey begins on the outer walls of the 8x8 grid. From there, you must build solid, unbroken lines of your pieces\u2014we call them "gravity bridges"\u2014to venture into the center of the board.'
        ] }),
        /* @__PURE__ */ jsx8("p", { className: "mb-4", children: "Block your opponent, plan your bridges, and use the walls to your advantage to connect four of your pieces in any direction. With a highly intelligent AI featuring adjustable difficulty levels (from a friendly newcomer to a strategic expert) and a polished local multiplayer mode (and a beta online multiplayer mode), there's always a new challenge waiting." }),
        /* @__PURE__ */ jsx8("p", { className: "mb-4", children: "Developed from a simple idea into a full-featured game, Caz Connect includes:" }),
        /* @__PURE__ */ jsxs7("ul", { className: "list-disc list-inside space-y-2 mb-4", children: [
          /* @__PURE__ */ jsxs7("li", { children: [
            /* @__PURE__ */ jsx8("strong", { children: "A Whole New Spin on a Classic:" }),
            ` The "Gravity Connection" rule changes everything! You can only place a piece if it has an unbroken line of other pieces connecting it to an outer wall. It's a simple concept with deep strategic complexity that will challenge you on every move.`
          ] }),
          /* @__PURE__ */ jsxs7("li", { children: [
            /* @__PURE__ */ jsx8("strong", { children: "Challenge the Eccentric Professor Caz:" }),
            ' Face off against the legendary professor! Our advanced AI features multiple difficulty levels, from "Beginner" to the truly formidable "Grand Master." But be warned\u2014he learns.'
          ] }),
          /* @__PURE__ */ jsxs7("li", { children: [
            /* @__PURE__ */ jsx8("strong", { children: "Unlock the Professor's Secret Lab:" }),
            ` Prove your genius to gain access to the professor's inner sanctum. Here, you can train the AI through game simulations, import and export its "brain," and enable its advanced learning mode to create the ultimate opponent.`
          ] }),
          /* @__PURE__ */ jsxs7("li", { children: [
            /* @__PURE__ */ jsx8("strong", { children: "Multiple Ways to Play:" }),
            " Go head-to-head with friends in local Player-vs-Player mode, take on the ever-improving AI, or share simple game codes for turn-based asynchronous online matches."
          ] }),
          /* @__PURE__ */ jsxs7("li", { children: [
            /* @__PURE__ */ jsx8("strong", { children: "Personalize Your Game:" }),
            ' Choose your aesthetic\u2014the quirky chalk-and-notebook "Science" theme or the sleek, futuristic "Cosmic" theme. Customize your player name and piece to make your mark!'
          ] }),
          /* @__PURE__ */ jsxs7("li", { children: [
            /* @__PURE__ */ jsx8("strong", { children: "Unlock Achievements & Track Your Stats:" }),
            " From your very first victory to the monumental feat of defeating the Grand Master, earn dozens of achievements and track your career stats to prove your intellectual dominance."
          ] }),
          /* @__PURE__ */ jsxs7("li", { children: [
            /* @__PURE__ */ jsx8("strong", { children: "Installable & Offline-Ready:" }),
            " As a Progressive Web App (PWA), you can install Caz Connect directly to your home screen for a full-screen, offline-ready experience anytime, anywhere."
          ] })
        ] }),
        /* @__PURE__ */ jsxs7("button", { onClick: () => setShowReleaseNotesModal(true), className: "text-center text-xs opacity-60 mt-6 hover:opacity-100 transition-opacity", children: [
          "Version: ",
          appVersion
        ] })
      ] })
    ] }),
    showLabControls && /* @__PURE__ */ jsxs7("div", { className: "flex flex-col gap-2.5 w-full mt-4 pt-4 border-t lab-section", children: [
      /* @__PURE__ */ jsxs7(
        "button",
        {
          onClick: () => {
            onUIClick();
            setIsLabOpen(!isLabOpen);
          },
          disabled: allDisabled,
          className: "flex items-center justify-between w-full text-left disabled:opacity-50",
          children: [
            /* @__PURE__ */ jsx8("span", { className: "text-sm font-bold uppercase tracking-wider section-header", children: "Professor's Lab" }),
            /* @__PURE__ */ jsx8("svg", { className: `w-5 h-5 transition-transform duration-200 lab-arrow ${isLabOpen ? "transform rotate-180" : ""}`, fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", xmlns: "http://www.w3.org/2000/svg", children: /* @__PURE__ */ jsx8("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: "2", d: "M19 9l-7 7-7-7" }) })
          ]
        }
      ),
      isLabOpen && /* @__PURE__ */ jsxs7("div", { className: "flex flex-col gap-2.5 w-full mt-2 animate-fade-in", children: [
        /* @__PURE__ */ jsxs7("div", { className: "control-row", children: [
          /* @__PURE__ */ jsx8("label", { htmlFor: "ai-learning-check", className: "control-label", title: "Allow AI to save game results to its memory on higher difficulties.", children: "Allow AI to Learn:" }),
          /* @__PURE__ */ jsx8(
            "button",
            {
              id: "ai-learning-check",
              role: "switch",
              "aria-checked": isAiLearningEnabled,
              onClick: onToggleAiLearning,
              disabled: allDisabled,
              className: `toggle-switch ${isAiLearningEnabled ? "active" : ""}`,
              children: /* @__PURE__ */ jsx8("span", { className: "toggle-switch-handle" })
            }
          )
        ] }),
        /* @__PURE__ */ jsxs7("div", { className: "control-row", children: [
          /* @__PURE__ */ jsx8("label", { htmlFor: "sim-games-input", className: "control-label", children: "Simulate Games:" }),
          /* @__PURE__ */ jsx8(
            "input",
            {
              type: "number",
              id: "sim-games-input",
              value: simGames,
              onChange: (e) => setSimGames(parseInt(e.target.value, 10)),
              min: "1",
              max: "10000",
              disabled: allDisabled,
              className: "control-input w-24 text-center"
            }
          )
        ] }),
        !isSimulating ? /* @__PURE__ */ jsx8("button", { onClick: () => onStartSimulation(simGames), disabled: isTutorialActive, className: "control-button secondary-button bg-green-500 text-white", children: "Start AI Training" }) : /* @__PURE__ */ jsx8("button", { onClick: onStopSimulation, className: "control-button primary-button", children: "Stop Training" }),
        /* @__PURE__ */ jsxs7("div", { className: "flex gap-2.5", children: [
          /* @__PURE__ */ jsx8("button", { onClick: handleImportClick, disabled: allDisabled, className: "control-button secondary-button flex-grow", children: "Import AI" }),
          /* @__PURE__ */ jsx8("button", { onClick: onExportMemory, disabled: allDisabled, className: "control-button secondary-button flex-grow", children: "Export AI" })
        ] }),
        /* @__PURE__ */ jsx8("input", { type: "file", ref: fileInputRef, onChange: handleFileChange, accept: ".json", className: "hidden" })
      ] })
    ] }),
    showReleaseNotesModal && /* @__PURE__ */ jsx8(ReleaseNotesModal_default, { onClose: () => setShowReleaseNotesModal(false) }),
    /* @__PURE__ */ jsx8("style", { children: `
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
import { jsx as jsx9, jsxs as jsxs8 } from "react/jsx-runtime";
var InstallPrompt = ({ onInstall, onDismiss }) => {
  return /* @__PURE__ */ jsx9("div", { className: "fixed bottom-0 left-0 right-0 p-4 z-50 transform translate-y-0 transition-transform duration-300 ease-in-out prompt-panel", children: /* @__PURE__ */ jsxs8("div", { className: "max-w-xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left", children: [
    /* @__PURE__ */ jsxs8("div", { className: "flex-grow", children: [
      /* @__PURE__ */ jsx9("h3", { className: "m-0 mb-1 text-lg font-semibold", children: "Install Caz Connect" }),
      /* @__PURE__ */ jsx9("p", { className: "m-0 text-sm leading-snug", children: "Add to your Home Screen for a full-screen, offline experience!" })
    ] }),
    /* @__PURE__ */ jsxs8("div", { className: "flex gap-2.5 flex-shrink-0", children: [
      /* @__PURE__ */ jsx9("button", { onClick: onInstall, className: "py-2 px-4 font-semibold rounded-lg bg-green-500 text-white", children: "Install" }),
      /* @__PURE__ */ jsx9("button", { onClick: onDismiss, className: "py-2 px-4 font-semibold rounded-lg bg-slate-400/50 text-slate-800", children: "Later" })
    ] })
  ] }) });
};
var InstallPrompt_default = InstallPrompt;

// components/TutorialMessage.tsx
import { jsx as jsx10, jsxs as jsxs9 } from "react/jsx-runtime";
var TutorialMessage = ({ text, showNext, onNext, onSkip }) => {
  return /* @__PURE__ */ jsxs9("div", { className: "fixed bottom-0 left-0 right-0 p-4 z-50 transform translate-y-0 transition-transform duration-300 ease-in-out animate-slide-up prompt-panel", children: [
    /* @__PURE__ */ jsxs9("div", { className: "max-w-xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left", children: [
      /* @__PURE__ */ jsxs9("div", { className: "flex-grow", children: [
        /* @__PURE__ */ jsx10("h3", { className: "m-0 mb-1 text-lg font-semibold", children: "Professor Caz's Lesson" }),
        /* @__PURE__ */ jsx10("p", { className: "m-0 text-sm leading-snug", children: text })
      ] }),
      /* @__PURE__ */ jsxs9("div", { className: "flex gap-2.5 flex-shrink-0", children: [
        showNext && /* @__PURE__ */ jsx10("button", { onClick: onNext, className: "py-2 px-4 font-semibold rounded-lg bg-green-500 text-white", children: "Next" }),
        /* @__PURE__ */ jsx10("button", { onClick: onSkip, className: "py-2 px-4 font-semibold rounded-lg bg-slate-400/50 text-slate-800", children: "Skip Tutorial" })
      ] })
    ] }),
    /* @__PURE__ */ jsx10("style", { children: `
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
import { useState as useState6, useEffect as useEffect4 } from "react";
import { jsx as jsx11, jsxs as jsxs10 } from "react/jsx-runtime";
var UnlockModal = ({ onDismiss }) => {
  const [isDismissible, setIsDismissible] = useState6(false);
  useEffect4(() => {
    const timer = setTimeout(() => {
      setIsDismissible(true);
    }, 5e3);
    return () => clearTimeout(timer);
  }, []);
  const handleOverlayClick = () => {
    if (isDismissible) {
      onDismiss();
    }
  };
  return /* @__PURE__ */ jsxs10(
    "div",
    {
      className: "fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4 animate-fade-in-fast",
      onClick: handleOverlayClick,
      children: [
        /* @__PURE__ */ jsxs10(
          "div",
          {
            className: "component-panel rounded-lg p-8 max-w-sm w-full text-center relative transform animate-pop-in-modal",
            onClick: (e) => e.stopPropagation(),
            children: [
              /* @__PURE__ */ jsx11(
                "img",
                {
                  src: "./professor-caz.png",
                  alt: "Professor Caz",
                  className: "w-24 h-24 rounded-full mx-auto mb-4 border-4 mascot-image",
                  style: { borderColor: "var(--panel-border)" }
                }
              ),
              /* @__PURE__ */ jsx11("h2", { className: "text-2xl font-bold title-font", style: { color: "var(--text-header)" }, children: "Professor's Lab Unlocked!" }),
              /* @__PURE__ */ jsx11("p", { className: "my-4 text-base", children: `"You've gained access to my secret lab! Here you can challenge the ultimate 'Learning' AI and utilize advanced training options. Experiment wisely."` }),
              /* @__PURE__ */ jsx11(
                "button",
                {
                  onClick: onDismiss,
                  className: "control-button primary-button w-full",
                  children: "I Understand"
                }
              )
            ]
          }
        ),
        /* @__PURE__ */ jsx11("style", { children: `
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
import { jsx as jsx12, jsxs as jsxs11 } from "react/jsx-runtime";
var ShareIcon = ({ className }) => /* @__PURE__ */ jsx12("svg", { xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 24 24", fill: "currentColor", className, children: /* @__PURE__ */ jsx12("path", { d: "M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92 1.61 0 2.92-1.31 2.92-2.92s-1.31-2.92-2.92-2.92z" }) });
var GameOverModal = ({ board, winInfo, gameMode, onNewGame, onClose, stats, adaptiveLevel, isLabUnlocked, playerName, playerOName, levelChange }) => {
  const winner = winInfo ? board[winInfo[0].r][winInfo[0].c] : null;
  const [copySuccess, setCopySuccess] = useState7(false);
  const winPiecesSet = useMemo3(() => {
    if (!winInfo) return /* @__PURE__ */ new Set();
    return new Set(winInfo.map((m) => `${m.r}-${m.c}`));
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
    const statsLines = LEVEL_NAMES.map((levelName, i) => {
      const levelStats = stats[i] || { wins: 0, losses: 0 };
      const totalGames = levelStats.wins + levelStats.losses;
      if (totalGames === 0) return null;
      const winPercentage = Math.round(levelStats.wins / totalGames * 100);
      const filledBlocks = Math.round(winPercentage / 100 * BAR_LENGTH);
      const emptyBlocks = BAR_LENGTH - filledBlocks;
      const bar = "\u{1F7E9}".repeat(filledBlocks) + "\u2B1C\uFE0F".repeat(emptyBlocks);
      return `${levelName.padEnd(12)}: ${bar} ${levelStats.wins}W / ${levelStats.losses}L`;
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
      gameMode === "pvc" /* PvC */ ? `Difficulty: ${LEVEL_NAMES[adaptiveLevel]}` : null
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
      text: `Promoted to ${LEVEL_NAMES[adaptiveLevel]}!`,
      icon: "\u{1F389}",
      className: "bg-green-100 text-green-800 border-green-300"
    },
    demoted: {
      text: `Demoted to ${LEVEL_NAMES[adaptiveLevel]}.`,
      icon: "\u{1F4C9}",
      className: "bg-yellow-100 text-yellow-800 border-yellow-300"
    }
  }[levelChange];
  return /* @__PURE__ */ jsxs11(
    "div",
    {
      className: "fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4 animate-fade-in-fast",
      onClick: onClose,
      children: [
        /* @__PURE__ */ jsxs11(
          "div",
          {
            className: "component-panel rounded-lg p-6 max-w-md w-full text-center relative transform animate-pop-in-modal max-h-[90vh] overflow-y-auto",
            onClick: (e) => e.stopPropagation(),
            children: [
              /* @__PURE__ */ jsx12("h2", { className: "text-4xl font-bold title-font mb-2", style: { color: "var(--text-header)" }, children: title }),
              /* @__PURE__ */ jsx12("div", { className: "mini-board", children: board.map(
                (row, r) => row.map((cell, c) => {
                  const isWinning = winPiecesSet.has(`${r}-${c}`);
                  return /* @__PURE__ */ jsx12("div", { className: `mini-cell ${cell ? `player-${cell.toLowerCase()}` : ""} ${isWinning ? "winning" : ""}` }, `${r}-${c}`);
                })
              ) }),
              notification && /* @__PURE__ */ jsxs11("div", { className: `p-3 rounded-lg border text-center font-semibold mb-4 text-base animate-fade-in ${notification.className}`, children: [
                /* @__PURE__ */ jsx12("span", { className: "mr-2", children: notification.icon }),
                notification.text
              ] }),
              gameMode === "pvc" /* PvC */ && /* @__PURE__ */ jsxs11("div", { className: "my-6 text-left", children: [
                /* @__PURE__ */ jsx12("h3", { className: "text-lg font-bold mb-3 text-center section-header", children: "Player Records vs. AI" }),
                /* @__PURE__ */ jsx12("div", { className: "space-y-3", children: LEVEL_NAMES.map((levelName, i) => {
                  const levelStats = stats[i] || { wins: 0, losses: 0 };
                  const totalGames = levelStats.wins + levelStats.losses;
                  const winPercentage = totalGames > 0 ? Math.round(levelStats.wins / totalGames * 100) : 0;
                  return /* @__PURE__ */ jsxs11("div", { className: "grid grid-cols-[100px_1fr_80px] items-center gap-2 text-sm", children: [
                    /* @__PURE__ */ jsx12("span", { className: "font-semibold truncate", children: levelName }),
                    /* @__PURE__ */ jsxs11("div", { className: "w-full stats-bar-container", children: [
                      /* @__PURE__ */ jsx12("div", { className: "stats-bar-fill", style: { width: `${winPercentage}%` } }),
                      totalGames > 0 && /* @__PURE__ */ jsxs11("span", { className: "stats-bar-text", children: [
                        winPercentage,
                        "%"
                      ] })
                    ] }),
                    /* @__PURE__ */ jsxs11("span", { className: "text-right tabular-nums", children: [
                      "W:",
                      levelStats.wins,
                      " L:",
                      levelStats.losses
                    ] })
                  ] }, levelName);
                }) })
              ] }),
              /* @__PURE__ */ jsxs11("div", { className: "flex flex-col gap-2.5 mt-4", children: [
                /* @__PURE__ */ jsxs11(
                  "button",
                  {
                    onClick: handleShareGame,
                    className: "control-button secondary-button w-full flex items-center justify-center gap-2",
                    children: [
                      /* @__PURE__ */ jsx12(ShareIcon, { className: "w-5 h-5" }),
                      /* @__PURE__ */ jsx12("span", { children: copySuccess ? "Copied!" : "Share Game" })
                    ]
                  }
                ),
                /* @__PURE__ */ jsxs11("div", { className: "grid grid-cols-2 gap-2.5", children: [
                  /* @__PURE__ */ jsx12(
                    "button",
                    {
                      onClick: onClose,
                      className: "control-button secondary-button",
                      children: "View Board"
                    }
                  ),
                  /* @__PURE__ */ jsx12(
                    "button",
                    {
                      onClick: onNewGame,
                      className: "control-button primary-button",
                      children: "New Game"
                    }
                  )
                ] })
              ] })
            ]
          }
        ),
        /* @__PURE__ */ jsx12("style", { children: `
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
import { jsx as jsx13, jsxs as jsxs12 } from "react/jsx-runtime";
var RulesModal = ({ onClose, onStartTutorial }) => {
  return /* @__PURE__ */ jsx13(
    "div",
    {
      className: "fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4 animate-fade-in-fast",
      onClick: onClose,
      children: /* @__PURE__ */ jsxs12(
        "div",
        {
          className: "component-panel rounded-lg p-6 max-w-md w-full text-center relative transform animate-pop-in-modal max-h-[90vh] overflow-y-auto",
          onClick: (e) => e.stopPropagation(),
          children: [
            /* @__PURE__ */ jsx13("h2", { className: "text-3xl font-bold title-font mb-4", style: { color: "var(--text-header)" }, children: "How to Play" }),
            /* @__PURE__ */ jsxs12("div", { className: "my-6 text-left space-y-4 text-base", children: [
              /* @__PURE__ */ jsxs12("div", { children: [
                /* @__PURE__ */ jsx13("h3", { className: "font-bold text-lg", style: { color: "var(--text-panel)" }, children: /* @__PURE__ */ jsx13("strong", { children: "Objective" }) }),
                /* @__PURE__ */ jsxs12("p", { children: [
                  "Be the first player to connect ",
                  /* @__PURE__ */ jsx13("strong", { children: "four or more" }),
                  " of your pieces in a continuous line\u2014horizontally, vertically, or diagonally!"
                ] })
              ] }),
              /* @__PURE__ */ jsxs12("div", { children: [
                /* @__PURE__ */ jsx13("h3", { className: "font-bold text-lg", style: { color: "var(--text-panel)" }, children: /* @__PURE__ */ jsx13("strong", { children: 'The "Gravity Connection" Rule' }) }),
                /* @__PURE__ */ jsx13("p", { children: "This is the core rule! You can only place a piece in a square that has a straight, unbroken line of pieces connecting it to one of the outer walls." })
              ] }),
              /* @__PURE__ */ jsx13("div", { children: /* @__PURE__ */ jsx13("p", { className: "text-sm opacity-80 text-center mt-6", children: "Valid moves are highlighted on the board for the first two AI levels to help you learn." }) })
            ] }),
            /* @__PURE__ */ jsxs12("div", { className: "grid grid-cols-2 gap-2.5 mt-4", children: [
              /* @__PURE__ */ jsx13(
                "button",
                {
                  onClick: onStartTutorial,
                  className: "control-button secondary-button",
                  children: "Start Tutorial"
                }
              ),
              /* @__PURE__ */ jsx13(
                "button",
                {
                  onClick: onClose,
                  className: "control-button primary-button",
                  children: "Got It!"
                }
              )
            ] }),
            /* @__PURE__ */ jsx13("style", { children: `
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
import { useState as useState8, useMemo as useMemo4 } from "react";
import { Fragment, jsx as jsx14, jsxs as jsxs13 } from "react/jsx-runtime";
var CloseIcon = (props) => /* @__PURE__ */ jsx14("svg", { xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 24 24", fill: "currentColor", ...props, children: /* @__PURE__ */ jsx14("path", { d: "M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" }) });
var BackIcon = (props) => /* @__PURE__ */ jsx14("svg", { xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 24 24", fill: "currentColor", ...props, children: /* @__PURE__ */ jsx14("path", { d: "M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" }) });
var PlayerStatsModal = ({ onClose, detailedStats, unlockedAchievements, aiStats, isLabUnlocked }) => {
  const [activeTab, setActiveTab] = useState8("achievements");
  const [selectedAchievement, setSelectedAchievement] = useState8(null);
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
  return /* @__PURE__ */ jsx14(
    "div",
    {
      className: "fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4 animate-fade-in-fast",
      onClick: onClose,
      children: /* @__PURE__ */ jsxs13(
        "div",
        {
          className: "component-panel rounded-lg p-6 max-w-lg w-full text-center relative transform animate-pop-in-modal max-h-[90vh] flex flex-col",
          onClick: (e) => e.stopPropagation(),
          children: [
            /* @__PURE__ */ jsx14("button", { onClick: onClose, className: "absolute top-3 right-3 p-1 rounded-full hover:bg-[var(--button-secondary-hover-bg)] transition-colors", "aria-label": "Close", children: /* @__PURE__ */ jsx14(CloseIcon, { className: "w-6 h-6", style: { color: "var(--button-secondary-text)" } }) }),
            !selectedAchievement ? /* @__PURE__ */ jsx14("h2", { className: "text-3xl font-bold title-font mb-4", style: { color: "var(--text-header)" }, children: "Player Stats" }) : /* @__PURE__ */ jsx14("div", { className: "flex items-center justify-start relative mb-4 h-[44px]", children: /* @__PURE__ */ jsxs13("button", { onClick: () => setSelectedAchievement(null), className: "absolute left-0 top-1/2 -translate-y-1/2 flex items-center gap-1 control-button secondary-button !border-none !px-2 !py-1", "aria-label": "Back to achievements", children: [
              /* @__PURE__ */ jsx14(BackIcon, { className: "w-6 h-6" }),
              " Back"
            ] }) }),
            !selectedAchievement ? /* @__PURE__ */ jsxs13("div", { className: "tab-nav -mx-6 px-4", children: [
              /* @__PURE__ */ jsx14("button", { className: `tab-button ${activeTab === "achievements" ? "active" : ""}`, onClick: () => setActiveTab("achievements"), children: "Achievements" }),
              /* @__PURE__ */ jsx14("button", { className: `tab-button ${activeTab === "stats" ? "active" : ""}`, onClick: () => setActiveTab("stats"), children: "Statistics" })
            ] }) : /* @__PURE__ */ jsx14("div", { className: "border-b-2", style: { borderColor: "var(--panel-border)" } }),
            /* @__PURE__ */ jsx14("div", { className: "overflow-y-auto mt-4 pr-2 -mr-2", children: selectedAchievement && achievementToShow ? /* @__PURE__ */ jsxs13("div", { className: "text-center p-4 animate-fade-in-fast flex flex-col items-center gap-4", children: [
              /* @__PURE__ */ jsx14("span", { className: "text-7xl", children: achievementToShow.icon }),
              /* @__PURE__ */ jsx14("h3", { className: "text-2xl font-bold title-font", style: { color: "var(--text-header)" }, children: achievementToShow.name }),
              /* @__PURE__ */ jsx14("p", { className: "text-base", children: achievementToShow.description })
            ] }) : /* @__PURE__ */ jsxs13(Fragment, { children: [
              activeTab === "achievements" && /* @__PURE__ */ jsx14("div", { className: "grid grid-cols-2 sm:grid-cols-3 gap-4 text-center animate-fade-in-fast", children: Object.keys(ACHIEVEMENTS).map((id) => {
                const achievement = ACHIEVEMENTS[id];
                const isUnlocked = unlockedAchievements.includes(id);
                const descriptionToShow = isUnlocked ? achievement.description : achievement.lockedDescription || achievement.description;
                return /* @__PURE__ */ jsxs13(
                  "button",
                  {
                    onClick: () => {
                      if (isUnlocked) {
                        setSelectedAchievement(id);
                      }
                    },
                    className: `p-4 rounded-lg flex flex-col items-center justify-start gap-2 transition-all duration-300 text-left ${isUnlocked ? "opacity-100 cursor-pointer" : "opacity-40 filter grayscale cursor-default"}`,
                    style: { backgroundColor: "rgba(0,0,0,0.05)" },
                    "aria-label": `View details for ${achievement.name}`,
                    children: [
                      /* @__PURE__ */ jsx14("span", { className: "text-5xl", children: achievement.icon }),
                      /* @__PURE__ */ jsx14("h4", { className: "font-bold text-sm m-0 leading-tight text-center w-full", children: achievement.name }),
                      /* @__PURE__ */ jsx14("p", { className: "text-xs m-0 leading-snug hidden sm:block text-center w-full", children: descriptionToShow })
                    ]
                  },
                  id
                );
              }) }),
              activeTab === "stats" && /* @__PURE__ */ jsxs13("div", { className: "text-left animate-fade-in-fast", children: [
                /* @__PURE__ */ jsx14("h3", { className: "text-lg font-bold mb-3 text-center section-header", children: "Career Stats" }),
                /* @__PURE__ */ jsxs13("div", { className: "grid grid-cols-3 gap-2 text-center component-panel bg-opacity-10 p-3 rounded-lg border-none shadow-inner", children: [
                  /* @__PURE__ */ jsxs13("div", { className: "flex flex-col", children: [
                    /* @__PURE__ */ jsx14("span", { className: "font-bold text-2xl", style: { color: "var(--text-header)" }, children: detailedStats.maxWinStreak }),
                    /* @__PURE__ */ jsx14("span", { className: "text-xs opacity-80", children: "Max Streak" })
                  ] }),
                  /* @__PURE__ */ jsxs13("div", { className: "flex flex-col", children: [
                    /* @__PURE__ */ jsx14("span", { className: "font-bold text-2xl", style: { color: "var(--text-header)" }, children: avgGameLength }),
                    /* @__PURE__ */ jsx14("span", { className: "text-xs opacity-80", children: "Avg. Moves" })
                  ] }),
                  /* @__PURE__ */ jsxs13("div", { className: "flex flex-col", children: [
                    /* @__PURE__ */ jsx14("span", { className: "font-bold text-2xl", style: { color: "var(--text-header)" }, children: mostCommonOpening }),
                    /* @__PURE__ */ jsx14("span", { className: "text-xs opacity-80", children: "Favorite Start" })
                  ] })
                ] }),
                /* @__PURE__ */ jsx14("h3", { className: "text-lg font-bold my-3 text-center section-header", children: "vs. Professor Caz" }),
                /* @__PURE__ */ jsx14("div", { className: "space-y-3", children: LEVEL_NAMES.map((levelName, i) => {
                  const levelStats = aiStats[i] || { wins: 0, losses: 0 };
                  const totalGames = levelStats.wins + levelStats.losses;
                  const winPercentage = totalGames > 0 ? Math.round(levelStats.wins / totalGames * 100) : 0;
                  return /* @__PURE__ */ jsxs13("div", { className: "grid grid-cols-[100px_1fr_80px] items-center gap-2 text-sm", children: [
                    /* @__PURE__ */ jsx14("span", { className: "font-semibold truncate", children: levelName }),
                    /* @__PURE__ */ jsxs13("div", { className: "w-full stats-bar-container", children: [
                      /* @__PURE__ */ jsx14("div", { className: "stats-bar-fill", style: { width: `${winPercentage}%` } }),
                      totalGames > 0 && /* @__PURE__ */ jsxs13("span", { className: "stats-bar-text", children: [
                        winPercentage,
                        "%"
                      ] })
                    ] }),
                    /* @__PURE__ */ jsxs13("span", { className: "text-right tabular-nums", children: [
                      "W:",
                      levelStats.wins,
                      " L:",
                      levelStats.losses
                    ] })
                  ] }, levelName);
                }) })
              ] })
            ] }) }),
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
      )
    }
  );
};
var PlayerStatsModal_default = PlayerStatsModal;

// components/ConfirmModal.tsx
import { jsx as jsx15, jsxs as jsxs14 } from "react/jsx-runtime";
var ConfirmModal = ({ title, message, confirmText = "Confirm", onConfirm, onCancel }) => {
  return /* @__PURE__ */ jsx15(
    "div",
    {
      className: "fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4 animate-fade-in-fast",
      onClick: onCancel,
      children: /* @__PURE__ */ jsxs14(
        "div",
        {
          className: "component-panel rounded-lg p-6 max-w-sm w-full text-center relative transform animate-pop-in-modal",
          onClick: (e) => e.stopPropagation(),
          children: [
            /* @__PURE__ */ jsx15("h2", { className: "text-2xl font-bold title-font mb-4", style: { color: "var(--text-header)" }, children: title }),
            /* @__PURE__ */ jsx15("p", { className: "my-6 text-base", children: message }),
            /* @__PURE__ */ jsxs14("div", { className: "grid grid-cols-2 gap-2.5 mt-4", children: [
              /* @__PURE__ */ jsx15(
                "button",
                {
                  onClick: onCancel,
                  className: "control-button secondary-button",
                  children: "Cancel"
                }
              ),
              /* @__PURE__ */ jsx15(
                "button",
                {
                  onClick: onConfirm,
                  className: "control-button primary-button",
                  children: confirmText
                }
              )
            ] }),
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
                ` })
          ]
        }
      )
    }
  );
};
var ConfirmModal_default = ConfirmModal;

// components/UpdatePrompt.tsx
import { jsx as jsx16, jsxs as jsxs15 } from "react/jsx-runtime";
var UpdatePrompt = ({ onUpdate }) => {
  return /* @__PURE__ */ jsx16("div", { className: "fixed bottom-0 left-0 right-0 p-4 z-50 transform translate-y-0 transition-transform duration-300 ease-in-out prompt-panel", children: /* @__PURE__ */ jsxs15("div", { className: "max-w-xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left", children: [
    /* @__PURE__ */ jsxs15("div", { className: "flex-grow", children: [
      /* @__PURE__ */ jsx16("h3", { className: "m-0 mb-1 text-lg font-semibold", children: "Update Available" }),
      /* @__PURE__ */ jsx16("p", { className: "m-0 text-sm leading-snug", children: "A new version of Caz Connect is ready. Reload to get the latest features!" })
    ] }),
    /* @__PURE__ */ jsx16("div", { className: "flex gap-2.5 flex-shrink-0", children: /* @__PURE__ */ jsx16("button", { onClick: onUpdate, className: "py-2 px-4 font-semibold rounded-lg bg-green-500 text-white", children: "Reload" }) })
  ] }) });
};
var UpdatePrompt_default = UpdatePrompt;

// App.tsx
import { jsx as jsx17, jsxs as jsxs16 } from "react/jsx-runtime";
var VolumeOnIcon = () => /* @__PURE__ */ jsx17("svg", { xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 24 24", fill: "currentColor", children: /* @__PURE__ */ jsx17("path", { d: "M13.5 4.06c0-1.34-1.61-2.25-2.83-1.46L5.43 6H3a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h2.43l5.24 3.4c1.22.79 2.83-.12 2.83-1.46V4.06zM18.5 12c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM20 12c0 2.76-1.74 5.09-4.01 6.04v-12c2.27.95 4.01 3.27 4.01 5.96z" }) });
var VolumeOffIcon = () => /* @__PURE__ */ jsx17("svg", { xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 24 24", fill: "currentColor", children: /* @__PURE__ */ jsx17("path", { d: "M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3a1 1 0 0 0-1 1v4a1 1 0 0 0 1 1h3.73L12 18.27v-5.52l4.51 4.51c-.67.43-1.4.76-2.18.98v2.06a8.99 8.99 0 0 0 3.65-1.49L19.73 21 21 19.73l-9-9L4.27 3zM12 4.06L7.22 7.54 12 12.31V4.06z" }) });
var QuestionMarkIcon = () => /* @__PURE__ */ jsx17("svg", { xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 24 24", fill: "currentColor", children: /* @__PURE__ */ jsx17("path", { d: "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17h-2v-2h2v2zm2.07-7.75l-.9.92C13.45 12.9 13 13.5 13 15h-2v-.5c0-1.1.45-2.1 1.17-2.83l1.24-1.26c.37-.36.59-.86.59-1.41 0-1.1-.9-2-2-2s-2 .9-2 2H8c0-2.21 1.79-4 4-4s4 1.79 4 4c0 .88-.36 1.68-.93 2.25z" }) });
var TrophyIcon = () => /* @__PURE__ */ jsx17("svg", { xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 24 24", fill: "currentColor", children: /* @__PURE__ */ jsx17("path", { d: "M19 5h-2V3H7v2H5c-1.1 0-2 .9-2 2v1c0 2.55 1.92 4.63 4.39 4.94.63 1.5 1.98 2.63 3.61 2.96V19H7v2h10v-2h-4v-3.1c1.63-.33 2.98-1.46 3.61-2.96C19.08 12.63 21 10.55 21 8V7c0-1.1-.9-2-2-2zM5 8V7h2v3.82C5.84 10.4 5 9.3 5 8zm7 6c-1.65 0-3-1.35-3-3V3h6v10c0 1.65-1.35 3-3 3zm7-6c0 1.3-.84 2.4-2 2.82V7h2v1z" }) });
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
  const [showPlayerStatsModal, setShowPlayerStatsModal] = useState9(false);
  const [waitingWorker, setWaitingWorker] = useState9(null);
  const [showUpdatePrompt, setShowUpdatePrompt] = useState9(false);
  const wakeLock = useRef5(null);
  useEffect5(() => {
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
  useEffect5(() => {
    document.body.className = `theme-${theme}`;
  }, [theme]);
  useEffect5(() => {
    const handleContextMenu = (e) => {
      e.preventDefault();
    };
    document.addEventListener("contextmenu", handleContextMenu);
    return () => {
      document.removeEventListener("contextmenu", handleContextMenu);
    };
  }, []);
  useEffect5(() => {
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
  return /* @__PURE__ */ jsxs16("div", { className: "main-container mx-auto p-2.5 flex flex-col items-center gap-5 max-w-lg lg:max-w-6xl lg:grid lg:grid-cols-[minmax(350px,_1fr)_1.5fr] lg:grid-rows-[auto_1fr] lg:[grid-template-areas:'title_game'_'info_game'] lg:items-start lg:gap-10", children: [
    /* @__PURE__ */ jsxs16("div", { className: "order-1 w-full lg:[grid-area:title]", children: [
      /* @__PURE__ */ jsx17(
        Header_default,
        {
          isThinking: isThinking || isSimulating
        }
      ),
      /* @__PURE__ */ jsxs16("div", { className: "flex flex-row items-center justify-center gap-4 w-full mt-2", children: [
        /* @__PURE__ */ jsx17(
          "button",
          {
            onClick: actions.toggleMute,
            "aria-label": "Mute sound",
            title: isMuted ? "Unmute" : "Mute",
            className: "w-11 h-11 p-2 rounded-full cursor-pointer flex-shrink-0 header-button",
            children: isMuted ? /* @__PURE__ */ jsx17(VolumeOffIcon, {}) : /* @__PURE__ */ jsx17(VolumeOnIcon, {})
          }
        ),
        /* @__PURE__ */ jsx17(
          "button",
          {
            onClick: actions.openRulesModal,
            "aria-label": "How to Play",
            title: "How to Play",
            className: "w-11 h-11 p-2 rounded-full cursor-pointer flex-shrink-0 header-button",
            children: /* @__PURE__ */ jsx17(QuestionMarkIcon, {})
          }
        ),
        /* @__PURE__ */ jsx17(
          "button",
          {
            onClick: () => {
              actions.handleUIClick();
              setShowPlayerStatsModal(true);
            },
            "aria-label": "Player Stats",
            title: "Player Stats",
            className: "w-11 h-11 p-2 rounded-full cursor-pointer flex-shrink-0 header-button",
            children: /* @__PURE__ */ jsx17(TrophyIcon, {})
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsxs16("main", { className: "game-area order-2 flex flex-col items-center w-full lg:min-w-[525px] lg:justify-center lg:[grid-area:game]", children: [
      /* @__PURE__ */ jsx17(
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
      /* @__PURE__ */ jsx17(
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
          playerOPiece
        }
      )
    ] }),
    /* @__PURE__ */ jsx17("aside", { className: "info-area order-3 flex flex-col gap-5 w-full items-center lg:justify-start lg:[grid-area:info]", children: /* @__PURE__ */ jsx17(
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
        onlineRole,
        setOnlineRole: actions.setOnlineRole,
        gameStateString,
        loadOnlineGame: actions.loadOnlineGame,
        currentPlayer,
        gameOver,
        isTutorialActive
      }
    ) }),
    isTutorialActive && /* @__PURE__ */ jsx17(
      TutorialMessage_default,
      {
        text: tutorialText,
        showNext: !isTutorialInteractive,
        onNext: actions.advanceTutorial,
        onSkip: actions.endTutorial
      }
    ),
    installPrompt.visible && !isTutorialActive && /* @__PURE__ */ jsx17(
      InstallPrompt_default,
      {
        onInstall: installPrompt.trigger,
        onDismiss: installPrompt.dismiss
      }
    ),
    showUpdatePrompt && /* @__PURE__ */ jsx17(UpdatePrompt_default, { onUpdate: handleUpdate }),
    confirmAction && confirmAction.isOpen && /* @__PURE__ */ jsx17(
      ConfirmModal_default,
      {
        title: confirmAction.title,
        message: confirmAction.message,
        confirmText: confirmAction.confirmText,
        onConfirm: confirmAction.onConfirm,
        onCancel: actions.cancelConfirmAction
      }
    ),
    showPlayerStatsModal && /* @__PURE__ */ jsx17(
      PlayerStatsModal_default,
      {
        onClose: () => {
          actions.handleUIClick();
          setShowPlayerStatsModal(false);
        },
        detailedStats,
        unlockedAchievements,
        aiStats,
        isLabUnlocked
      }
    ),
    showRulesModal && /* @__PURE__ */ jsx17(
      RulesModal_default,
      {
        onClose: actions.closeRulesModal,
        onStartTutorial: () => {
          actions.closeRulesModal();
          actions.startTutorial();
        }
      }
    ),
    showUnlockModal && /* @__PURE__ */ jsx17(UnlockModal_default, { onDismiss: actions.dismissUnlockModal }),
    showGameOverModal && /* @__PURE__ */ jsx17(
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
        levelChange
      }
    )
  ] });
};
var App_default = App;

// index.tsx
import { jsx as jsx18 } from "react/jsx-runtime";
var rootElement = document.getElementById("root");
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}
var root = ReactDOM.createRoot(rootElement);
root.render(
  /* @__PURE__ */ jsx18(React9.StrictMode, { children: /* @__PURE__ */ jsx18(App_default, {}) })
);
