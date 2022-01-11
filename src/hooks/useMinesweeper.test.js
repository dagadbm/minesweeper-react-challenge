import { renderHook, act } from '@testing-library/react-hooks'
import useMinesweeper, { GAME_STATUS } from './useMinesweeper';


const renderMinesweeper = (startGame) => {
  const render = renderHook(() => useMinesweeper());

  if (startGame) {
    act(() => render.result.current.startGame(startGame));
  }

  return render;
};

const getSquarePositionBy = (filter, board) => {
  return board.reduce((acc, _, x) => {
    board[x].forEach((_, y)  => {
      if (filter(board[x][y])) {
        acc.push({ x, y });
      }
    },[]);
    return acc;
  }, []);
}

test('should return empty board', () => {
  const { result } = renderMinesweeper();

  expect(result.current.board).toEqual([[]]);
  expect(result.current.gameStatus).toEqual(GAME_STATUS.IN_PROGRESS);
})

test('should start game', () => {
  const { result } = renderMinesweeper({
    width: 13,
    height: 12,
    mines: 10,
  });
  expect(result.current.board).toHaveLength(12);
  expect(result.current.board[0]).toHaveLength(13);
})

test('should lose if clicking on a bomb', () => {
  const { result } = renderMinesweeper({
    width: 10,
    height: 10,
    mines: 10,
  });

  const positions = getSquarePositionBy(square => square.hasMine, result.current.board);

  act(() => {
    positions.forEach(position => {
      result.current.clickSquare(position.x, position.y);
    });
  });

  expect(result.current.gameStatus).toEqual(GAME_STATUS.DEFEAT);
})

test('should visit if clicking not on a bomb', () => {
  const { result } = renderMinesweeper({
    width: 10,
    height: 10,
    mines: 10,
  });

  const positions = getSquarePositionBy(square => !square.hasMine, result.current.board);

  act(() => {
    result.current.clickSquare(positions[0].x, positions[1].y);
  });

  expect(result.current.gameStatus).toEqual(GAME_STATUS.IN_PROGRESS);
});

test('should win by putting flags on all mines', async () => {
  const { result, waitForNextUpdate } = renderMinesweeper({
    width: 10,
    height: 10,
    mines: 10,
  });


  await act(async () => {
    const positions = getSquarePositionBy(square => square.hasMine, result.current.board);
    positions.forEach(position => {
      result.current.setFlag(position.x, position.y);
    });
    await waitForNextUpdate();
  });

  expect(result.current.gameStatus).toEqual(GAME_STATUS.VICTORY);
});
