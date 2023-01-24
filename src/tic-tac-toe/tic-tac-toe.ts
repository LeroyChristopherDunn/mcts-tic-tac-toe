export class TicTacToe {

    private currState: TicTacToeState;

    constructor(
        initialState: TicTacToeState = INITIAL_STATE,
    ) {
        this.currState = initialState;
    }

    getCurrState(): TicTacToeState {
        return {
            squares: [...this.currState.squares],
            currPlayer: this.currState.currPlayer,
        };
    }

    getAvailableActions() {
        return actions(this.currState);
    }

    makeNextMove(action: TicTacToeAction) {
        if (this.isGameOver()) throw new Error("Game already over");
        this.currState = transition(this.currState, action);
    }

    isGameOver() {
        return gameIsOver(this.currState);
    }

    getGameResult() {
        return gameResult(this.currState);
    }
}

type TicTacToePlayer = "X" | "O";

export type TicTacToeState = {
    squares: TicTacToeSquare[];
    currPlayer: TicTacToePlayer;
}

type TicTacToeSquare = TicTacToePlayer | undefined;

export type TicTacToeAction = {
    squareIndex: number;
}

const INITIAL_STATE: TicTacToeState = {
    squares: Array(9).fill(undefined),
    currPlayer: "X",
}

const actions = (state: TicTacToeState): TicTacToeAction[] => {
    if (getWinner(state)) return [];
    let emptyIndexes = [];
    for (let index = 0; index < state.squares.length; index++) {
        if (!state.squares[index]) emptyIndexes.push(index);
    }
    return emptyIndexes.map(index => ({
        squareIndex: index,
    }))
}

const transition = (state: TicTacToeState, action: TicTacToeAction): TicTacToeState => {
    if (getWinner(state)) throw new Error(`Game already won`);
    const newState: TicTacToeState = {squares: [...state.squares], currPlayer: state.currPlayer};
    if (!!newState.squares[action.squareIndex]) throw new Error(`Square at index {${action.squareIndex}} already filled`);
    if (action.squareIndex < 0 || action.squareIndex > 8) throw new Error(`Invalid action index {${action.squareIndex}}`);
    newState.squares[action.squareIndex] = state.currPlayer;
    // noinspection UnnecessaryLocalVariableJS
    const nextPlayer = state.currPlayer === "X" ? "O" : "X";
    newState.currPlayer = nextPlayer;
    return newState;
}

const gameIsOver = (state: TicTacToeState) => gameResult(state) !== "Ongoing";

export type TicTacToeResult = "Ongoing" | "Draw" | TicTacToePlayer;

const gameResult = (state: TicTacToeState): TicTacToeResult => {
    const winner = getWinner(state);
    const numAvailableActions = actions(state).length;
    if (winner) return winner;
    if (!winner && numAvailableActions > 0) return "Ongoing";
    if (!winner && numAvailableActions === 0) return "Draw";
    throw new Error(`Unexpected case for state ${state}`);
}

const getWinner = (state: TicTacToeState): TicTacToePlayer | undefined => {
    const squares = state.squares;
    const winningSequences = [
        // 3 in a row
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        // 3 in a column
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        // 3 in a diagonal
        [0, 4, 8],
        [2, 4, 6],
    ]
    for (let winningSequence of winningSequences) {
        const index1 = winningSequence[0];
        const index2 = winningSequence[1];
        const index3 = winningSequence[2];
        if (
            squares[index1] !== undefined &&
            squares[index1] === squares[index2] &&
            squares[index2] === squares[index3]
        ) return squares[index1];
    }
    return undefined;
}

export const TicTacToeModel = {
    initialState: INITIAL_STATE,
    actions: actions,
    transition: transition,
    gameIsOver: gameIsOver,
    gameResult: gameResult,
}
