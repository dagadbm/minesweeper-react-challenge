import styled from 'styled-components';
import React, { useState, useEffect } from 'react';
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

const BOARD = {
  EMPTY: '',
  MINE: <Mine />,
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

function getRandomMinePosition(size) {
  return [
    Math.floor(Math.random() * size),
    Math.floor(Math.random() * size),
  ];
}


export const BoardGenerator = ({
  mines,
  size,
}) => {
  const board = generateBoard(mines, size);

  return (
    <Board data-testid="board">
    {board.map((_, row) => (
      board[row].map((_, col) => (
        <Square key={`${row},${col}`} data-testid={`square-${row},${col}`}>
        {board[row][col]}
        </Square>
      ))
    ))}
    </Board>
  );
};
