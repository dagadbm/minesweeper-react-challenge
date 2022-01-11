import styled, { css } from 'styled-components'
import React from 'react';
import { Mine } from './Mine';
import { Flag } from './Flag';
import { GAME_STATUS } from '../hooks/useMinesweeper';

const StyledSquare = styled.div`
  cursor: pointer;
  width: 40px;
  height: 40px;
  border: 1px solid black;
  font-size: 25px;
  text-align: center;
  line-height: 1.5;
  ${
    ({ square, gameStatus }) => {
      if (gameStatus !== GAME_STATUS.IN_PROGRESS) {
        if (
          (square.hasMine && square.hasVisited)
          || (square.hasFlag && !square.hasMine)
        ) {
          return css`
            background: red;
          `;
        }
      }

      if (square.hasVisited) {
        return css`
        background: white;
        `;
      } else {
        return css`
            background: darkgrey;
          &:hover {
            background: grey;
          }
        `;
      }
    }
  }
`;

const VisitedSquare = styled(StyledSquare)`
  background: white;
  &:hover {
    background: white;
  }
`;

const renderSquareContent = (square, gameStatus) => {
  if (square.hasFlag) {
    return <Flag />;
  }

  if (square.hasMine) {
    // if we won the game we only show flags
    if (gameStatus === GAME_STATUS.VICTORY) {
      return <Flag />;
    } else if (gameStatus === GAME_STATUS.DEFEAT) {
      return <Mine />;
    }
  }

  return square.value;
};

export const Square = ({
  square,
  gameStatus,
  onClick,
  onRightClick,
}) => {
  return <StyledSquare onClick={onClick} onContextMenu={onRightClick} square={square} gameStatus={gameStatus}>{renderSquareContent(square, gameStatus)}</StyledSquare>
};
