import styled from 'styled-components';
import { BoardGenerator } from './components/BoardGenerator';

const Title = styled.h1`
  font-size: 1.5em;
  text-align: center;
`;

function App() {
  return (
    <div>
      <Title>Minesweeper!</Title>
      <BoardGenerator mines={10} size={10} />
    </div>
  );
}

export default App;
