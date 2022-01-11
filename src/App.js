import styled from 'styled-components';
import { Board } from './components/Board';

const Title = styled.h1`
  font-size: 1.5em;
  text-align: center;
`;

function App() {
  return (
    <div>
      <Title>Minesweeper!</Title>
      <Board mines={10} size={10} />
    </div>
  );
}

export default App;
