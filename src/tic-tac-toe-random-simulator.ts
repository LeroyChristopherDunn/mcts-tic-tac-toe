import {TicTacToe, TicTacToeState} from "./tic-tac-toe/tic-tac-toe";
import {Simulator} from "./mcts/types";
import * as Random from "random-seed";

export function TicTacToeRandomSimulator(seed = 0): Simulator {
    const random = Random.create(seed.toString());
    return {
        simulate: (state: TicTacToeState): number => {
            const game = new TicTacToe(state);
            while (!game.isGameOver()) {
                const availableActions = game.getAvailableActions();
                const randomActionIndex = random.intBetween(0, availableActions.length - 1);
                const action = availableActions[randomActionIndex];
                game.makeNextMove(action);
            }

            const gameResult = game.getGameResult();

            switch (gameResult) {
                case "Draw": return 0;
                case "X": case "O": return state.currPlayer === gameResult ? 1 : -1;
                default: throw new Error(`Unhandled case: ${gameResult}`);
            }
        }
    }
}