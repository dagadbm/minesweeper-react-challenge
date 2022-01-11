import { useCallback, useEffect, useReducer, useState } from 'react';
import produce from 'immer';

const NEIGHBOURS = [
  [-1, -1],
  [-1, 0],
  [-1, 1],
  [0, -1],
  [0, 1],
  [1, -1],
  [1, 0],
  [1, 1],
];

const SQUARE = () => ({
  hasMine: false,
  hasFlag: false,
  hasVisited: false,
  value: '',
});

const generateBoard = ({ size, mines }) => {
  const board = Array(size).fill()
    .map(() =>
      Array(size).fill().map(SQUARE)
    );

  setMinesOnBoard(mines, board);
  return board;
};

const setMinesOnBoard =  (mines, board) => {
  let remainingMines = mines;
  while (remainingMines > 0) {
    const [x, y] = getRandomMinePosition(board.length);
    if(!board[x][y].hasMine) {
      board[x][y].hasMine = true;
      remainingMines--;
    }
  }
};

const getRandomMinePosition = (size) => [
  Math.floor(Math.random() * size),
  Math.floor(Math.random() * size),
];

const calculateMines = (x, y, board) =>
  NEIGHBOURS.reduce((acc, [row, col]) => {
    try {
      if (board[x + row][y + col].hasMine) {
        acc++;
      }
    } catch (e) {
      // went outside of board
    }
    return acc;
  }, 0);

const clickBoard = (x, y, board) => {
  if (board[x][y].hasMine) {
    board[x][y].hasVisited = true;
    return;
  }

  if (board[x][y].hasVisited) {
    return;
  }

  // if we click "on a number" we dont expand the board
  const mines = calculateMines(x, y, board);
  if (mines) {
    board[x][y].hasVisited = true;
    board[x][y].value = `${mines}`;
    return;
  }

  // else we traverse the board until we cant
  const visit = [[x, y]];
  while (visit.length) {
    const [tx, ty] = visit.pop(); // traverse x/y
    for (const neighbour of NEIGHBOURS) {
      const [ni, nj] = [tx + neighbour[0], ty + neighbour[1]]; //neighbour x/y

      let square;
      try {
        square = board[ni][nj];
        if (square.hasVisited) {
          continue;
        }
      } catch(e) {
        // went outside of board
        continue;
      }


      const mines = calculateMines(ni, nj, board);
      square.hasVisited = true;
      square.value = mines === 0 ? '' : `${mines}`;

      if (mines === 0) {
        visit.push([ni,nj]);
      }
    }
  }

  return true;
}

const initialState = {
  board: [[SQUARE()]],
}

const reducer = (state, action) => {
  switch (action.type) {
    case 'SETUP':
      return produce(state, draft => {
        draft.board = generateBoard(action.payload);
      });
    case 'CLICK':
      return produce(state, draft => {
        clickBoard(action.payload.x, action.payload.y, draft.board);
      });
    case 'FLAG':
      return produce(state, draft => {
        const { x, y } = action.payload;
        draft.board[x][y].hasFlag = true;
      });
    default:
      return state;
  }
};


export const GAME_STATUS = {
  IN_PROGRESS: 'in_progress',
  VICTORY: 'victory',
  DEFEAT: 'defeat',
};

const useMinesweeper = ({
  size,
  mines,
}) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [gameStatus, setGameStatus] = useState(GAME_STATUS.IN_PROGRESS);

  useEffect(() => dispatch({
    type: 'SETUP',
    payload: {
      size,
      mines,
    },
  }), [mines, size, dispatch]);

  const clickSquare = useCallback((x, y) => {
    dispatch({
      type: 'CLICK',
      payload: { x, y },
    });
  }, [dispatch]);

  const setFlag = useCallback((x, y) => {
    dispatch({
      type: 'FLAG',
      payload: { x, y },
    });
  }, [dispatch]);

  return {
    board: state.board,
    gameStatus,
    clickSquare,
    setFlag,
  }
};

export default useMinesweeper;
