import { useCallback, useEffect, useReducer } from 'react';
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

const generateBoard = (size, mines) => {
  const board = Array(size).fill()
    .map(() =>
      Array(size).fill().map(SQUARE)
    );

  return {
    board,
    placedMines: setMinesOnBoard(mines, board),
  };
};

const setMinesOnBoard =  (mines, board) => {
  const placedMines = [];
  let remainingMines = mines;
  while (remainingMines > 0) {
    const [x, y] = getRandomMinePosition(board.length);
    if(!board[x][y].hasMine) {
      board[x][y].hasMine = true;
      remainingMines--;
      placedMines.push(board[x][y]);
    }
  }
  return placedMines;
};

const getRandomMinePosition = (size) => [
  Math.floor(Math.random() * size),
  Math.floor(Math.random() * size),
];

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
  board[x][y].hasVisited = true;
  board[x][y].value = mines === 0 ? '' : `${mines}`;

  if (board[x][y].hasMine) {
    return 1;
  }

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
  START: 'start',
  IN_PROGRESS: 'in_progress',
  VICTORY: 'victory',
  DEFEAT: 'defeat',
};

const initialState = {
  board: [[]],
  mines: [], // reference to created mines for optimized access
  squares: 0, // total number of squares
  visited: 0, // total number of visited squares
  flags: {
    correct: 0, // total number of correct flag guesses
    incorrect: 0, // total number of incorrect flag guesses
  },
  gameStatus: GAME_STATUS.START,
};

const reducer = (state, action) => {
  switch (action.type) {
    case 'SETUP':
      return produce(state, draft => {
        const { size, mines } = action.payload;
        const { board, placedMines } = generateBoard(size, mines);
        draft.board = board;
        draft.mines = placedMines;
        draft.squares = size * size;
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

        draft.visited += visitSquare(action.payload.x, action.payload.y, draft.board, true);
      });
    case 'FLAG':
      return produce(state, draft => {
        const { board, flags } = draft;
        const { x, y } = action.payload;
        const square = board[x][y];

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
          visited,
          squares,
          mines,
          flags,
          gameStatus
        } = draft;
        switch (gameStatus) {
          case GAME_STATUS.IN_PROGRESS: {
            if (
              (flags.correct === mines.length && flags.incorrect === 0)
              || (visited === squares - mines.length && flags.incorrect === 0)
            ) {
              draft.gameStatus = GAME_STATUS.VICTORY;
              // at the end of the game we show all mines with flags
              mines.forEach((square) => {
                square.hasFlag = true;
              });
            }
            break;
          }
          case GAME_STATUS.DEFEAT: {
            // if defeat, at the end of the game we show all mines
            mines.forEach((square) => {
              square.visited = true;
            });
            break;
          }
          case GAME_STATUS.START:
          case GAME_STATUS.VICTORY:
          default:
            break;
        }
      });
    default:
      return state;
  }
};


const useMinesweeper = ({
  size,
  mines,
}) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { board, gameStatus } = state;
  console.log(gameStatus);

  useEffect(() => dispatch({
    type: 'SETUP',
    payload: {
      size,
      mines,
    },
  }), [mines, size, dispatch]);

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
    board,
    gameStatus,
    clickSquare,
    setFlag,
  }
};

export default useMinesweeper;
