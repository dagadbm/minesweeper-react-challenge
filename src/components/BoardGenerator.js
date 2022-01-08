import styled from 'styled-components';
import produce from 'immer';
import React, { useState, useRef } from 'react';
import { Mine } from './Mine';
import { Flag } from './Flag';

const Board = styled.div`
  width: 420px;
  border: 1px solid black;
  display: flex;
  flex-wrap: wrap;
  margin: 0px auto;
`;

const Square = styled.div`
  width: 40px;
  height: 40px;
  border: 1px solid black;
  font-size: 25px;
  text-align: center;
  line-height: 1.5;
`;

const OpenedSquare = styled.div`
  width: 100%;
  height: 100%;
  background: white;
`;

const ClosedSquare = styled.div`
  width: 100%;
  height: 100%;
  background: grey;
  &:hover {
    background: darkgrey;
  }
`;

const BOARD = {
  EMPTY: 0,
  MINE: 1,
};
const BOARD_COMPONENTS = {
  MINE: <Mine />,
  FLAG: <Flag />,
  CLOSED: <ClosedSquare />,
  OPENED: <OpenedSquare />
};

const generateBoard = (mines, size) => {
  const board = Array(size).fill(BOARD.EMPTY)
    .map(() => Array(size).fill(BOARD.EMPTY));

  setMinesOnBoard(mines, board);
  return board;
};

const setMinesOnBoard =  (mines, board) => {
  let remainingMines = mines;
  while (remainingMines > 0) {
    const [x, y] = getRandomMinePosition(board.length);
    if(board[x][y] === BOARD.EMPTY) {
      board[x][y] = BOARD.MINE;
      remainingMines--;
    }
  }
};

const getRandomMinePosition = (size) => [
  Math.floor(Math.random() * size),
  Math.floor(Math.random() * size),
];


export const BoardGenerator = ({
  mines,
  size,
}) => {
  const board = useRef(generateBoard(mines, size));
  const [gameBoard, setGameBoard] = useState(
    board.current.map((_, row) =>
      board.current[row].map(() => BOARD_COMPONENTS.CLOSED
    ))
  );

  const clickedBoard = (event) => {
    // get the data-cord property from <Square /> parent
    const coordinates = event.target.parentNode.dataset?.cord?.split(',');

    if (coordinates === undefined) {
      return;
    }

    const [x, y] = coordinates;

    setGameBoard(produce((draft) => {
      draft[x][y] = BOARD_COMPONENTS.OPENED
    })
    );
  };

  return (
    <Board data-testid="board" onClick={clickedBoard}>
    {gameBoard.map((_, row) => (
      gameBoard[row].map((_, col) => (
        <Square key={`${row},${col}`}
        data-testid={`square-${board.current[row][col]}-${row},${col}`}
        data-cord={`${row},${col}`}>
        {gameBoard[row][col]}
        </Square>
      ))
    ))}
    </Board>
  );
};
