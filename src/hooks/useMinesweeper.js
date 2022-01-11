import { useCallback, useReducer } from 'react';
import produce from 'immer';

const NEIGHBOURS = [
  { x: -1, y: -1},
  { x: -1, y: 0},
  { x: -1, y: 1},
  { x: 0, y: -1},
  { x: 0, y: 1},
  { x: 1, y: -1},
  { x: 1, y: 0},
  { x: 1, y: 1},
];

const SQUARE = () => ({
  hasMine: false,
  hasFlag: false,
  hasVisited: false,
  value: '',
});

const generateBoard = (width, height, mines) => {
  const board = Array(height).fill()
    .map(() =>
      Array(width).fill().map(SQUARE)
    );

  setMinesOnBoard(Math.min(mines, width * height), width, height, board);

  return board;
};

const setMinesOnBoard =  (mines, width, height, board) => {
  let remainingMines = mines;
  while (remainingMines > 0) {
    const { x, y } = getRandomMinePosition(width, height);
    if(!board[x][y].hasMine) {
      board[x][y].hasMine = true;
      remainingMines--;
    }
  }
};

const getRandomMinePosition = (width, height) => ({
  x: Math.floor(Math.random() * height),
  y: Math.floor(Math.random() * width),
});

const calculateMines = (x, y, board) =>
  NEIGHBOURS.reduce((acc, {x: nx, y: ny}) => {
    try {
      if (board[x + nx][y + ny].hasMine) {
        acc++;
      }
    } catch (e) {
      // went outside of board
    }
    return acc;
  }, 0);

const visitSquare = (x, y, board) => {
  const mines = calculateMines(x, y, board);
  board[x][y].value = mines === 0 ? '' : `${mines}`;

  // we dont expand if there is a mine, a flag, or the user clicked "a number"
  if (board[x][y].hasFlag || board[x][y].hasMine || mines > 0) {
    if (board[x][y].hasVisited) {
      return 0;
    } else {
      // we only visit squares that are not flags
      board[x][y].hasVisited = !board[x][y].hasFlag;
      return 1;
    }
  }

  board[x][y].hasVisited = true;
  // else we traverse the board until we cant
  const sweep = [{x, y}];
  let visited = 1;
  while (sweep.length) {
    const { x: tx, y: ty } = sweep.pop(); // traverse x/y
    visited += NEIGHBOURS.reduce((visit, neighbour) => {
      // neighbour x/y
      const nx = tx + neighbour.x;
      const ny = ty + neighbour.y;

      let square;
      try {
        square = board[nx][ny];
        if (square.hasFlag
          || square.hasMine
          || square.hasVisited) {
          return visit;
        }
      } catch(e) {
        // went outside of board
        return visit;
      }

      const mines = calculateMines(nx, ny, board);
      square.hasVisited = true;
      square.value = mines === 0 ? '' : `${mines}`;
      visit += 1;

      if (mines === 0) {
        sweep.push({ x: nx, y: ny });
      }
      return visit;
    }, 0);
  }

  return visited;
}

export const GAME_STATUS = {
  IN_PROGRESS: 'in_progress',
  VICTORY: 'victory',
  DEFEAT: 'defeat',
};

const initialState = {
  board: [[]],
  mines: 0, // total number of mines
  squares: 0, // total number of squares
  visited: 0, // total number of visited squares
  flags: {
    correct: 0, // total number of correct flag guesses
    incorrect: 0, // total number of incorrect flag guesses
  },
  gameStatus: GAME_STATUS.IN_PROGRESS,
};

const reducer = (state, action) => {
  switch (action.type) {
    case 'START':
      return produce(state, draft => {
        const { width, height, mines } = action.payload;
        const board = generateBoard(width, height, mines);
        draft.board = board;
        draft.mines = mines;
        draft.squares = width * height;
        draft.gameStatus = GAME_STATUS.IN_PROGRESS;
      });
    case 'VISIT':
      return produce(state, draft => {
        const { board } = draft;
        const { x, y} = action.payload;

        if (board[x][y].hasMine) {
          board[x][y].hasVisited = true;
          draft.visited += 1;
          draft.gameStatus = GAME_STATUS.DEFEAT;
          return;
        }

        draft.visited += visitSquare(action.payload.x, action.payload.y, draft.board);
      });
    case 'FLAG':
      return produce(state, draft => {
        const { board, flags } = draft;
        const { x, y } = action.payload;
        const square = board[x][y];

        // we cant set flags on squares already visited
        if (square.hasVisited) {
          return;
        }

        // update flag guess values
        // user is removing an existing flag
        if (square.hasFlag) {
          // if the square had a flag and a mine the user is making a mistake
          if (square.hasMine) {
            flags.correct = Math.max(0, flags.correct - 1);
            flags.incorrect += 1;
          // if the square had a flag but not a mine the user is fixing a mistake
          } else {
            flags.incorrect -= 1;
          }
        // user is adding a flag
        } else {
          // if the square has a mine the user is correct
          if (square.hasMine) {
            flags.correct = Math.max(0, flags.correct + 1);
          // if the square does not have a mine the user is incorrect
          } else {
            flags.incorrect += 1;
          }
        }

        square.hasFlag = !square.hasFlag;
      });
    case 'CHECK_GAME_STATUS':
      return produce(state, draft => {
        const {
          board,
          visited,
          squares,
          mines,
          flags,
          gameStatus
        } = draft;
          if (
            (flags.correct === mines && flags.incorrect === 0)
            || (visited === squares - mines && flags.incorrect === 0)
          ) {
            draft.gameStatus = GAME_STATUS.VICTORY;
          }

          // visit everything else (except mines) if we finished the game
          if (gameStatus !== GAME_STATUS.IN_PROGRESS) {
            const unvisited = board.reduce((acc, _, x) => {
              board[x].forEach((_, y)  => {
                if (!board[x][y].hasVisited && !board[x][y].hasMine) {
                  acc.push({ x, y });
                }
              },[]);
              return acc;
            }, []);

            for (const visit of unvisited) {
              draft.visited += visitSquare(visit.x, visit.y, board);
            }
          }
      });
    default:
      return state;
  }
};


const useMinesweeper = () => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { board, gameStatus } = state;

  const startGame = useCallback(({
    width,
    height,
    mines,
  }) => {
    dispatch({
      type: 'START',
      payload: {
        width,
        height,
        mines,
      },
    });
  }, [dispatch]);

  const clickSquare = useCallback((x, y) => {
    dispatch({
      type: 'VISIT',
      payload: { x, y },
    });
    dispatch({
      type: 'CHECK_GAME_STATUS',
    });
  }, [dispatch]);

  const setFlag = useCallback((x, y) => {
    dispatch({
      type: 'FLAG',
      payload: { x, y },
    });
    dispatch({
      type: 'CHECK_GAME_STATUS',
    });
  }, [dispatch]);

  return {
    startGame,
    board,
    gameStatus,
    clickSquare,
    setFlag,
  }
};

export default useMinesweeper;
