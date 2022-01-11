import useMinesweeper from '../hooks/useMinesweeper';
import styled from 'styled-components';
import { Square } from './Square';

const StyledBoard = styled.div`
  width: 420px;
  border: 1px solid black;
  display: flex;
  flex-wrap: wrap;
  margin: 0px auto;
`;

export const Board = ({
  mines,
  size,
}) => {
  const { board, clickSquare, setFlag, gameStatus } = useMinesweeper({ mines, size });

  const onClickSquare = (x,y) => (event) => {
    event.preventDefault();
    clickSquare(x, y);
  };
  const onRightClickSquare = (x,y) => (event) => {
    event.preventDefault();
    setFlag(x, y);
  };

  return (
    <StyledBoard data-testid="board">
    {board.map((_, x) => (
      board[x].map((_, y) => (
        <Square key={`${x},${y}`} square={board[x][y]} onClick={onClickSquare(x,y)} onRightClick={onRightClickSquare(x,y)}/>
      ))
    ))}
    {gameStatus}
    </StyledBoard>
  );
};
