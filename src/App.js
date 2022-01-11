import styled from 'styled-components';
import { Board } from './components/Board';
import useInput from './hooks/useInput';
import { useState } from 'react';

const Minesweeper = styled.div`
  display: flex;
  flex-flow: column;
`;
const Title = styled.h1`
  display: flex;
  justify-content: center;
  font-size: 1.5em;
  margin-bottom: 16px;
`;

const Form = styled.form`
  display: flex;
  justify-content: center;
  margin-bottom: 8px;
`;

const Label = styled.label`
  display: flex;
  align-items: center;
  margin-right: 8px;
`;

const Input = styled.input`
  font-size: 1.2em;
  width: fit-content;
  margin-right: 16px;
`;

const Button = styled.button`
  font-size: 1.2em;
  width: 64px;
  width: fit-content;
  padding: 4px 8px;
`;

function App() {
  const width = useInput(10);
  const height = useInput(10);
  const mines = useInput(10);
  const [board, setBoard] = useState({
    width: Number(width.value),
    height: Number(height.value),
    mines: Number(mines.value),
  });

  const startGame = (event) => {
    event.preventDefault();
    setBoard({
      width: Number(width.value),
      height: Number(height.value),
      mines: Number(mines.value),
      // to force re-render even if values dont change
      key: Date.now(),
    });
  };

  return (
    <>
      <Title>Minesweeper!</Title>
      <Minesweeper>
        <Form onSubmit={startGame}>
          <Label htmlFor="width">Width</Label>
          <Input type="number" min="1" max="30" id="width" {...width }/>
          <Label htmlFor="height">Height</Label>
          <Input type="number" min="1" max="30" id="height" {...height }/>
          <Label htmlFor="mines">Mines</Label>
          <Input type="number" min="0" max="200" id="mines" {...mines }/>
          <Button type="submit">Start</Button>
        </Form>
        <Board {...board} />
      </Minesweeper>
    </>
  );
}

export default App;
