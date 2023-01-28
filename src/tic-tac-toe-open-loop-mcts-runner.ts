import {OpenLoopMonteCarloTreeSearch} from "./open-loop-mcts/open-loop-mcts";
import {TicTacToe, TicTacToeAction, TicTacToeModel, TicTacToeState} from "./tic-tac-toe/tic-tac-toe";
import * as Random from "random-seed";
import {RandomSeed} from "random-seed";
import {Action, GetActions, Simulator, State} from "./open-loop-mcts/types";
import {FixedTime} from "./mcts/utils";
import {RandomExpansionPolicy, UCB} from "./open-loop-mcts/utils";

export class TicTacToeOpenLoopMctsRunner{
    run(){
        const seed = 0;
        const start = Date.now()
        const node = new OpenLoopMonteCarloTreeSearch(
            {
                initialState: TicTacToeModel.initialState,
                getActions: getActions(seed),
            },
            TicTacToeRandomOpenLoopSimulator(seed),
            FixedTime(200),
            UCB(),
            RandomExpansionPolicy(seed),
        ).run();
        const end = Date.now()

        console.log("node", node)
        console.log("time elapsed ms:", end - start)
    }
}

export const playoutActions = (random: RandomSeed, game: TicTacToe, actions: TicTacToeAction[]) => {
    for (let action of actions) {
        if (game.isGameOver()) break;
        game.makeNextMove(action);
    }
}

export const getActions = (seed = 0): GetActions => {
    const random = Random.create(seed.toString());
    return (initialState: State, actions: Action[]) => {
        const game = new TicTacToe(initialState);
        playoutActions(random, game, actions);
        return game.getAvailableActions();
    };
}

export function TicTacToeRandomOpenLoopSimulator(seed = 0): Simulator {
    const random = Random.create(seed.toString());
    return {
        simulate: (initialState: TicTacToeState, actions: TicTacToeAction[]): number => {

            const game = new TicTacToe(initialState);
            playoutActions(random, game, actions);
            const simulationStartState = game.getCurrState();

            let numIterations = 0;
            while (!game.isGameOver()) {
                const availableActions = game.getAvailableActions();
                const randomActionIndex = random.intBetween(0, availableActions.length - 1);
                const action = availableActions[randomActionIndex];
                game.makeNextMove(action);
                numIterations++;
            }

            const discount = Math.pow(0.99, numIterations);
            const gameResult = game.getGameResult();

            switch (gameResult) {
                case "Draw": return 0;
                case "X": case "O": return discount * (simulationStartState.currPlayer === gameResult ? 1 : -1);
                default: throw new Error(`Unhandled case: ${gameResult}`);
            }
        }
    }
}