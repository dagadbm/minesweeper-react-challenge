import styled, { css } from 'styled-components'
import React from 'react';
import { Mine } from './Mine';
import { Flag } from './Flag';

const StyledSquare = styled.div`
  width: 40px;
  height: 40px;
  border: 1px solid black;
  font-size: 25px;
  text-align: center;
  line-height: 1.5;
  ${({ square }) => square.hasVisited && css`
    background: white;
  `}
  ${({ square }) => !square.hasVisited && css`
    background: grey;
    &:hover {
      background: darkgrey;
    }
  `}
`;

const renderSquareContent = (square) => {
  if (square.hasFlag) {
    return <Flag />;
  }

  if (square.hasVisited && square.hasMine) {
    return <Mine />;
  }

  return square.value;
}

export const Square = ({
  square,
  onClick,
  onRightClick,
}) => {
  return <StyledSquare onClick={onClick} onContextMenu={onRightClick} square={square}>{renderSquareContent(square)}</StyledSquare>
};
