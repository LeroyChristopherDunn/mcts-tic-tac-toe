import {TicTacToe, TicTacToeState} from "./tic-tac-toe";

const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
});

export class TicTacToeConsolePlayer{
    async run() {

        console.log("Tic Tac Toe Console Player")
        console.log("--------------------------")

        const game = new TicTacToe();

        while (!game.isGameOver()) {
            const nextPlayer = game.getCurrPlayer();
            const currState = game.getCurrState();

            console.log("\n\n")
            console.log("Next player:", nextPlayer);
            this.writeState(currState);

            const position = await this.readPosition(game);
            game.makeNextMove(position);
        }

        console.log("\n\n")
        console.log("Game result: ", game.getGameProgress());
        this.writeState(game.getCurrState());
        readline.close();
    }

    private async readPosition(game: TicTacToe) {
        while (true) {
            const position = parseInt(await this.readline("Enter position: "));
            const validPositions = game.getAvailableActions().map(action => action.index);
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



