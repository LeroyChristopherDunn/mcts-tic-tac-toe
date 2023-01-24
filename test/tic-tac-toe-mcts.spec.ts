import {MonteCarloTreeSearch} from "../src/mcts/mcts";
import {TicTacToeModel, TicTacToeState} from "../src/tic-tac-toe/tic-tac-toe";
import {TicTacToeRandomSimulator} from "../src/tic-tac-toe-random-simulator";
import {FixedIterations, RandomExpansionPolicy, UCB} from "../src/mcts/utils";

const X = 'X';
const O = 'O';
const E = undefined;

describe('Tic Tac Toe MCTS', () => {

    it('given X winning position then X should win 1', async () => {

        const initialState: TicTacToeState = {
            squares: [
                X, O, O,
                E, X, E,
                E, E, E,
            ],
            currPlayer: X,
        };

        const action = getAction(initialState);

        expect(action.squareIndex).toBe(8);
    });

    it('given X winning position then X should win 2', async () => {

        const initialState: TicTacToeState = {
            squares: [
                X, O, O,
                E, E, E,
                E, E, X,
            ],
            currPlayer: X,
        };

        const action = getAction(initialState);

        expect(action.squareIndex).toBe(4);
    });

    it('given X winning position then X should win 3', async () => {

        const initialState: TicTacToeState = {
            squares: [
                X, O, O,
                X, E, E,
                E, E, E,
            ],
            currPlayer: X,
        };

        const action = getAction(initialState);

        expect(action.squareIndex).toBe(6);
    });

    it('given O winning position then O should win 1', async () => {

        const initialState: TicTacToeState = {
            squares: [
                E, O, O,
                X, E, E,
                X, E, E,
            ],
            currPlayer: O,
        };

        const action = getAction(initialState);

        expect(action.squareIndex).toBe(0);
    });

    it('given O winning position then O should win 2', async () => {

        const initialState: TicTacToeState = {
            squares: [
                X, O, E,
                E, E, E,
                X, O, E,
            ],
            currPlayer: O,
        };

        const action = getAction(initialState);

        expect(action.squareIndex).toBe(4);
    });

    it('given O winning position then O should win 3', async () => {

        const initialState: TicTacToeState = {
            squares: [
                E, E, X,
                X, E, E,
                O, O, E,
            ],
            currPlayer: O,
        };

        const action = getAction(initialState);

        expect(action.squareIndex).toBe(8);
    });

    it('given X winning position then O should defend 1', async () => {

        const initialState: TicTacToeState = {
            squares: [
                X, O, O,
                E, X, E,
                E, E, E,
            ],
            currPlayer: O,
        };

        const action = getAction(initialState);

        expect(action.squareIndex).toBe(8);
    });

    it('given X winning position then O should defend 2', async () => {

        const initialState: TicTacToeState = {
            squares: [
                X, O, O,
                E, E, E,
                E, E, X,
            ],
            currPlayer: O,
        };

        const action = getAction(initialState);

        expect(action.squareIndex).toBe(4);
    });

    it('given X winning position then O should defend 3', async () => {

        const initialState: TicTacToeState = {
            squares: [
                X, O, O,
                X, E, E,
                E, E, E,
            ],
            currPlayer: O,
        };

        const action = getAction(initialState);

        expect(action.squareIndex).toBe(6);
    });

    it('given O winning position then X should defend 1', async () => {

        const initialState: TicTacToeState = {
            squares: [
                E, O, O,
                X, E, E,
                E, E, X,
            ],
            currPlayer: X,
        };

        const action = getAction(initialState);

        expect(action.squareIndex).toBe(0);
    });

    it('given O winning position then X should defend 2', async () => {

        const initialState: TicTacToeState = {
            squares: [
                E, O, E,
                X, E, E,
                E, O, X,
            ],
            currPlayer: X,
        };

        const action = getAction(initialState);

        expect(action.squareIndex).toBe(4);
    });

    it('given O winning position then X should defend 3', async () => {

        const initialState: TicTacToeState = {
            squares: [
                E, E, X,
                X, E, E,
                O, O, E,
            ],
            currPlayer: X,
        };

        const action = getAction(initialState);

        expect(action.squareIndex).toBe(8);
    });

    it('given O winning position then O should win immediately 1', async () => {

        const initialState: TicTacToeState = {
            squares: [
                E, O, E,
                X, E, E,
                X, O, E,
            ],
            currPlayer: O,
        };

        const action = getAction(initialState);

        expect(action.squareIndex).toBe(4);
    });

});

function getAction(initialState: TicTacToeState) {
    const seed = 0;
    const mcts = new MonteCarloTreeSearch(
        {
            initialState: initialState,
            getActions: TicTacToeModel.actions,
            transition: TicTacToeModel.transition
        },
        TicTacToeRandomSimulator(seed),
        FixedIterations(1000),
        UCB(),
        RandomExpansionPolicy(seed),
    );
    const node = mcts.run();
    return mcts.getBestAction(node);
}