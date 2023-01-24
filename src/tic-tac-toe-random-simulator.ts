import {TicTacToe, TicTacToeState} from "./tic-tac-toe/tic-tac-toe";
import {Simulator} from "./mcts/types";
import * as Random from "random-seed";

export function TicTacToeRandomSimulator(seed = 0): Simulator {
    const random = Random.create(seed.toString());
    return {
        simulate: (state: TicTacToeState): 0 | 1 | -1 => {
            const game = new TicTacToe(state);
            while (!game.isGameOver()) {
                const availableActions = game.getAvailableActions();
                const randomActionIndex = random.intBetween(0, availableActions.length - 1);
                const action = availableActions[randomActionIndex];
                game.makeNextMove(action);
            }

            const gameResult = game.getGameResult();
            if (gameResult === "Draw") return 0;
            if (gameResult === "X" || gameResult === "O"){
                return state.currPlayer === gameResult ? 1 : -1;
            }
            throw new Error(`Unhandled case: ${gameResult}`);
        }
    }
}