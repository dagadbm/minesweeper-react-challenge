
## How the game works
* The player can left click a square to reveal it. If the revealed square is a
  mine, the player loses the game.
* The player can right click a square to mark it with a flag to help keep track
  of what squares they think (or know) are mines.
* Revealed squares show a number that indicates how many mines are located in
  adjacent squares.
* The goal is to reveal or flag all squares without revealing a mine.


Here's an example of how a fully revealed cluster might look. Here, 'M'
indicates a mine:
 ```
-----------------
| 1 | 1 |   |   |
| M | 1 | 1 | 1 |
| 2 | 3 | M | 1 |
| 1 | M | 2 | 1 |
| 1 | 1 | 1 |   |
|   |   |   |   |
-----------------
```

[State of the repo before my changes](https://github.com/dagadbm/minesweeper-react-challenge/commit/b3368ca9a4a11abfdb84db013187187b3def18d6)

For a deployed version checkout https://dagadbm-minesweeper.netlify.app/

## Available Scripts

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

For context, leaving the relevant documentation from Create React App below:

In the project directory, you can run:

### `yarn start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `yarn test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `yarn build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.
