export class TicTacToe {

    private currState: TicTacToeState;
    private currPlayer: "X" | "O";

    constructor(
        initialState: TicTacToeState = INITIAL_STATE,
        initialPlayer: "X" | "O" = "X",
    ) {
        this.currState = initialState;
        this.currPlayer = initialPlayer;
    }

    getCurrState(): TicTacToeState {
        return {squares: [...this.currState.squares]};
    }

    getCurrPlayer() {
        return this.currPlayer;
    }

    getAvailableActions() {
        return availableActions(this.currState, this.currPlayer);
    }

    makeNextMove(square: number) {
        if (this.isGameOver()) throw new Error("Game already over");
        const action = {index: square, value: this.currPlayer};
        this.currState = transition(this.currState, action);
        this.currPlayer = this.currPlayer === "X" ? "O" : "X";
    }

    getGameProgress() {
        return gameProgress(this.currState, this.currPlayer);
    }

    isGameOver() {
        return this.getGameProgress() !== "Ongoing";
    }
}

const transition = (state: TicTacToeState, action: TicTacToeAction): TicTacToeState => {
    const newState = {squares: [...state.squares]};
    if (!!newState.squares[action.index]) throw new Error(`Square at index {${action.index}} already filled`);
    if (action.index < 0 || action.index > 8) throw new Error(`Invalid action index {${action.index}}`);
    newState.squares[action.index] = action.value;
    return newState;
}

export type TicTacToeState = {
    squares: TicTacToeSquare[];
}

type TicTacToeSquare = "X" | "O" | undefined;

type TicTacToeAction = {
    index: number;
    value: "X" | "O";
}

const INITIAL_STATE: TicTacToeState = {
    squares: Array(9).fill(undefined)
}

function availableActions(state: TicTacToeState, currPlayer: "X" | "O"): TicTacToeAction[] {
    let emptyIndexes = [];
    for (let index = 0; index < state.squares.length; index++) {
        if (!state.squares[index]) emptyIndexes.push(index);
    }
    return emptyIndexes.map(index => ({
        index: index,
        value: currPlayer,
    }))
}

function getWinner(state: TicTacToeState): "X" | "O" | undefined {
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

function gameProgress(state: TicTacToeState, player: "X" | "O"): "Ongoing" | "Draw" | "X" | "O" {
    if (!getWinner(state)) return "Ongoing";
    if (availableActions(state, player).length === 0) return "Draw";
    return getWinner(state);
}
