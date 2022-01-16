import useMinesweeper, { GAME_STATUS } from '../hooks/useMinesweeper';
import styled from 'styled-components';
import { Square } from './Square';
import { useEffect } from 'react';

const StyledBoard = styled.div`
  display: grid;
  grid-template-columns: repeat(${({ width }) => width}, 40px);
  grid-template-rows: repeat(${({ height }) => height}, 40px);
  border: 1px solid black;
  margin: 0 auto;
  justify-content: center;
`;

const StyledGameStatus = styled.h2`
  display: flex;
  justify-content: center;
  margin: 16px 0;
  font-size: 1.25em;
`;


export const Board = ({
  width,
  mines,
  height,
  flagMode
}) => {
  const { board, startGame, clickSquare, setFlag, gameStatus } = useMinesweeper();

  useEffect(() => {
    startGame({
      width,
      height,
      mines,
    });
  }, [startGame, width, height, mines]);

  const onClickSquare = (x,y) => (event) => {
    event.preventDefault();
    if (gameStatus !== GAME_STATUS.IN_PROGRESS) {
      return;
    }

    if (flagMode) {
      setFlag(x, y);
    } else {
      clickSquare(x, y);
    }
  };

  const onRightClickSquare = (x,y) => (event) => {
    event.preventDefault();
    if (gameStatus !== GAME_STATUS.IN_PROGRESS) {
      return;
    }

    if (flagMode) {
      clickSquare(x, y);
    } else {
      setFlag(x, y);
    }
  };

  return (
    <>
      <StyledBoard width={width} height={height} data-testid="board">
      {board.map((_, x) => (
        board[x].map((_, y) => (
          <Square key={`${x},${y}`} square={board[x][y]} gameStatus={gameStatus} onClick={onClickSquare(x,y)} onRightClick={onRightClickSquare(x,y)} />
        ))
      ))}
      </StyledBoard>
      <StyledGameStatus>
        {gameStatus === GAME_STATUS.VICTORY && 'You Won!'}
        {gameStatus === GAME_STATUS.DEFEAT && 'You Lost!'}
      </StyledGameStatus>
    </>
  );
};
