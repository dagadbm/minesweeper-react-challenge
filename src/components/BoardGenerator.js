import styled from 'styled-components';
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

export const BoardGenerator = ({
}) => {
  return (
    <Board>
    {[...Array(100).keys()].map((i) => (
      <Square key={i}>
        {i === 10 && <Mine />}
        {i === 25 && <Flag />}
        {i === 77 ? '4' : ''}
      </Square>
    ))}
    </Board>
  );
};
