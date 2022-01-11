import useMinesweeper from '../hooks/useMinesweeper';
import styled from 'styled-components';
import React from 'react';
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

const renderSquare = (square) => {
  if (square.hasFlag) {
    return <Flag />;
  }

  if (!square.hasVisited) {
    return <ClosedSquare />
  }

  if (square.hasMine) {
    return <Mine />;
  }

  return <OpenedSquare>{square.value}</OpenedSquare>;
};



export const BoardGenerator = ({
  mines,
  size,
}) => {
  const { board, clickSquare, setFlag } = useMinesweeper({ mines, size });

  const clickedBoard = (event) => {
    event.preventDefault();
    // get the data-cord property from <Square /> parent
    const coordinates = event.target.parentNode.dataset?.cord?.split(',');

    if (coordinates === undefined) {
      return;
    }

    const [x, y] = [Number(coordinates[0]), Number(coordinates[1])];

    if (event.type === 'contextmenu') {
      setFlag(x, y);
    } else {
      clickSquare(x, y);
    }
  };

  return (
    <Board data-testid="board" onClick={clickedBoard} onContextMenu={clickedBoard}>
    {board.map((_, row) => (
      board[row].map((_, col) => (
        <Square key={`${row},${col}`}
        data-cord={`${row},${col}`}>
        {renderSquare(board[row][col])}
        </Square>
      ))
    ))}
    </Board>
  );
};
