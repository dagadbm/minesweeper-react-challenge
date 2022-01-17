import styled from 'styled-components';
import { Board } from './components/Board';
import { Flag } from './components/Flag';
import { Mine } from './components/Mine';
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
  justify-content: center;
  align-items: center;
  margin: 16px 0;
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

const Form = styled.form`

  display: flex;
  justify-content: center;
`;

const Input = styled.input`
  width: fit-content;
  margin-right: 8px;
  width: 64px;
  height: 40px;
`;

const Button = styled.button`
  width: fit-content;
  padding: 4px 8px;
`;

const FlagModeButton = styled(Button)`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 40px;
  height: 40px;
`;

function App() {
  const width = useInput();
  const height = useInput();
  const mines = useInput();
  const [hasFlagMode, setFlagMode] = useState(false);
  const [board, setBoard] = useState({
    width: Number(9),
    height: Number(9),
    mines: Number(10),
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
      setBoard({
        ...gameSettings(gameDifficulty),
        key: Date.now(), // force re-render
      });
    }
  };

  const toggleFlagMode = (event) => {
    event.preventDefault();
    setFlagMode(!hasFlagMode);
  };

  return (
    <>
      <Minesweeper>
      <Difficulty>
        <Button type="button" onClick={startGame(GAME_DIFFICULTY.BEGINNER)}>Beginner</Button>
        <Button type="button" onClick={startGame(GAME_DIFFICULTY.INTERMEDIATE)}>Intermediate</Button>
        <Button type="button" onClick={startGame(GAME_DIFFICULTY.EXPERT)}>Expert</Button>
        <FlagModeButton type="button" onClick={toggleFlagMode}>
          {hasFlagMode ? <Flag /> : <Mine />}
        </FlagModeButton>
      </Difficulty>
        <Form onSubmit={startGame(GAME_DIFFICULTY.CUSTOM)}>
          <Input type="number" min="1" max="50" placeholder="width" {...width }/>
          <Input type="number" min="1" max="50" placeholder="height" {...height }/>
          <Input type="number" min="0" max="500" placeholder="mines" {...mines }/>
          <Button type="submit">Custom</Button>
        </Form>
        {board && <Board {...board} flagMode={hasFlagMode} />}
      </Minesweeper>
    </>
  );
}

export default App;
