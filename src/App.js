import styled from 'styled-components';
import { Mine } from './components/Mine';
import { Flag } from './components/Flag';

const Title = styled.h1`
  font-size: 1.5em;
  text-align: center;
`;

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

function App() {
  return (
    <div>
      <Title>Minesweeper!</Title>
      <Board>
        {[...Array(100).keys()].map((i) => (
          <Square key={i} disabled={i === 55 || i === 10}>
            {i === 10 && <Mine />}
            {i === 25 && <Flag />}
            {i === 77 ? '4' : ''}
          </Square>
        ))}
      </Board>
    </div>
  );
}

export default App;
