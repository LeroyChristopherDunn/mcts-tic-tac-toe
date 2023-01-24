import {TicTacToe, TicTacToeAction, TicTacToeModel, TicTacToeState} from "./tic-tac-toe/tic-tac-toe";
import * as Random from "random-seed";
import {MonteCarloTreeSearch} from "./mcts/mcts";
import {TicTacToeRandomSimulator} from "./tic-tac-toe-random-simulator";
import {FixedIterations, RandomExpansionPolicy, UCB} from "./mcts/utils";

const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
});

export class TicTacToeMctsConsolePlayer{
    constructor(private readonly seed = Math.round(Math.random())) {}

    async run() {

        console.log("Tic Tac Toe MCTS Console Player")
        console.log("--------------------------")

        const game = new TicTacToe();

        const random = Random.create(this.seed.toString());
        let mctsIsPlaying = !!random.intBetween(0, 1);

        while (!game.isGameOver()) {
            const currState = game.getCurrState();

            console.log("\n\n")
            this.writeState(currState);

            let position;
            if (mctsIsPlaying){
                position = this.getMctsPosition(currState);
            } else {
                position = await this.readPosition(game);
            }

            game.makeNextMove({squareIndex: position});
            mctsIsPlaying = !mctsIsPlaying;
        }

        console.log("\n\n")
        console.log("Game result:", game.getGameResult());
        this.writeState(game.getCurrState());
        readline.close();
    }

    private getMctsPosition(state: TicTacToeState){
        const mcts = new MonteCarloTreeSearch(
            {
                initialState: state,
                getActions: TicTacToeModel.actions,
                transition: TicTacToeModel.transition
            },
            TicTacToeRandomSimulator(this.seed),
            FixedIterations(100),
            UCB(),
            RandomExpansionPolicy(this.seed),
        );
        const node = mcts.run();
        const action: TicTacToeAction = mcts.getBestAction(node);
        return action.squareIndex;
    }

    private async readPosition(game: TicTacToe) {
        while (true) {
            const position = parseInt(await this.readline("Enter position: "));
            const validPositions = game.getAvailableActions().map(action => action.squareIndex);
            if (validPositions.includes(position)) return position;
            console.log("Invalid position");
        }
    }

    private readline(query: string): Promise<string>{
        return new Promise(resolve => {
            readline.question(query, line => {
                resolve(line);
            })
        })
    }

    private writeState(state: TicTacToeState){
        console.log("Current player:", state.currPlayer);
        const s = (index: number) => state.squares[index] || " ";
        console.log('-------------')
        console.log(`| ${s(0)} | ${s(1)} | ${s(2)} |`)
        console.log('-------------')
        console.log(`| ${s(3)} | ${s(4)} | ${s(5)} |`)
        console.log('-------------')
        console.log(`| ${s(6)} | ${s(7)} | ${s(8)} |`)
        console.log('-------------')
    }
}
