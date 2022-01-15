import styled from 'styled-components';
import { Board } from './components/Board';
import useInput from './hooks/useInput';
import { useState } from 'react';

const GAME_DIFFICULTY = {
  BEGINNER: 'beginner',
  INTERMEDIATE: 'intermediate',
  EXPERT: 'expert',
  CUSTOM: 'custom',
};

const gameSettings = (gameDifficulty) => {
  switch (gameDifficulty) {
    case GAME_DIFFICULTY.BEGINNER:
      return {
        width: 9,
        height: 9,
        mines: 10,
      };
    case GAME_DIFFICULTY.INTERMEDIATE:
      return {
        width: 16,
        height: 16,
        mines: 40,
      };
    case GAME_DIFFICULTY.EXPERT:
      return {
        width: 30,
        height: 16,
        mines: 99,
      };
    default:
      return {};
  }
};

const Minesweeper = styled.div`
  display: flex;
  flex-flow: column;
  & > * {
    margin-bottom: 16px;
  }
`;

const Difficulty = styled.div`
  display: flex;
  justify-content: center;
  button {
    margin-right 8px;
  }
`;


const Title = styled.h1`
  display: flex;
  justify-content: center;
  font-size: 1.5em;
`;

const Form = styled.form`
  display: flex;
  justify-content: center;
`;

const Label = styled.label`
  display: flex;
  align-items: center;
  margin-right: 8px;
`;

const Input = styled.input`
  font-size: 1.2em;
  width: fit-content;
  margin-right: 8px;
`;

const Button = styled.button`
  font-size: 1.2em;
  width: 64px;
  width: fit-content;
  padding: 4px 8px;
`;

function App() {
  const width = useInput(9);
  const height = useInput(9);
  const mines = useInput(10);
  const [board, setBoard] = useState({
    width: Number(width.value),
    height: Number(height.value),
    mines: Number(mines.value),
  });

  const startGame = (gameDifficulty) => (event) => {
    event.preventDefault();
    if (gameDifficulty === GAME_DIFFICULTY.CUSTOM) {
      setBoard({
        width: Number(width.value),
        height: Number(height.value),
        mines: Number(mines.value),
        key: Date.now(), // force re-render
      });
    } else {
      const settings = gameSettings(gameDifficulty);
      width.setValue(settings.width);
      height.setValue(settings.height);
      mines.setValue(settings.mines);
      setBoard({
        ...settings,
        key: Date.now(), // force re-render
      });
    }
  };

  return (
    <>
      <Title>Minesweeper!</Title>
      <Minesweeper>
      <Difficulty>
        <Button type="button" onClick={startGame(GAME_DIFFICULTY.BEGINNER)}>Beginner</Button>
        <Button type="button" onClick={startGame(GAME_DIFFICULTY.INTERMEDIATE)}>Intermediate</Button>
        <Button type="button" onClick={startGame(GAME_DIFFICULTY.EXPERT)}>Expert</Button>
      </Difficulty>
        <Form onSubmit={startGame(GAME_DIFFICULTY.CUSTOM)}>
          <Label htmlFor="width">Width</Label>
          <Input type="number" min="1" max="50" id="width" {...width }/>
          <Label htmlFor="height">Height</Label>
          <Input type="number" min="1" max="50" id="height" {...height }/>
          <Label htmlFor="mines">Mines</Label>
          <Input type="number" min="0" max="500" id="mines" {...mines }/>
          <Button type="submit">Custom</Button>
        </Form>
        {board && <Board {...board} />}
      </Minesweeper>
    </>
  );
}

export default App;
