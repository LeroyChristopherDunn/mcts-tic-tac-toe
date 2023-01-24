import {TicTacToeModel, TicTacToeState} from "../../src/tic-tac-toe/tic-tac-toe";

const X = 'X';
const O = 'O';
const E = undefined;

describe('Tic Tac Toe', () => {

    it('given won game then game should be game over', async () => {

        const state: TicTacToeState = {
            squares: [
                E, O, E,
                X, O, E,
                X, O, E,
            ],
            currPlayer: O,
        };

        const isGameOver = TicTacToeModel.gameIsOver(state);

        expect(isGameOver).toBe(true);
    });

    it('given won game then no actions should available', async () => {

        const state: TicTacToeState = {
            squares: [
                E, O, E,
                X, O, E,
                X, O, E,
            ],
            currPlayer: O,
        };

        const actions = TicTacToeModel.actions(state);

        expect(actions).toEqual([]);
    });

});
