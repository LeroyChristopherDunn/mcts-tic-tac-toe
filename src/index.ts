import {MonteCarloTreeSearch} from "./mcts/mcts";
import {TicTacToeModel,} from "./tic-tac-toe/tic-tac-toe";
import {TicTacToeRandomSimulator} from "./tic-tac-toe-random-simulator";
import {FixedTime, RandomExpansionPolicy, UCB} from "./mcts/utils";
import {TicTacToeMctsConsolePlayer} from "./tic-tac-toe-mcts-console-player";

// noinspection JSUnusedLocalSymbols
function runMcts() {
    const seed = 0;
    const start = Date.now()
    const node = new MonteCarloTreeSearch(
        {
            initialState: TicTacToeModel.initialState,
            getActions: TicTacToeModel.actions,
            transition: TicTacToeModel.transition
        },
        TicTacToeRandomSimulator(seed),
        FixedTime(200),
        UCB(),
        RandomExpansionPolicy(seed),
    ).run();
    const end = Date.now()

    console.log("node", node)
    console.log("time elapsed ms:", end - start)
}

// new TicTacToeConsolePlayer().run()
new TicTacToeMctsConsolePlayer().run()
