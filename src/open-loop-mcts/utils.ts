import {Action, ExpansionPolicy, SelectionScorer, State} from "./types";
import * as Random from "random-seed";

export function UCB(c = Math.sqrt(2)): SelectionScorer {
    return {
        score: node => {
            const delta = 0.01;
            // multiplied by -1 because of minimax tree formulation - best action is one which minimizes opponent score
            const exploitation = -1 * node.getTotalScore() / (node.getNumSimulations() + delta);
            const exploration = Math.sqrt(Math.log(node.parent.getNumSimulations()) / (node.getNumSimulations() + delta))
            return exploitation + c * exploration;
        }
    }
}

export function RandomExpansionPolicy(seed = 0): ExpansionPolicy {
    const random = Random.create(seed.toString());
    return {
        getAction: (state: State, actions: Action[], unexploredActions: Action[]): Action => {
            const randomActionIndex = random.intBetween(0, unexploredActions.length - 1);
            return unexploredActions[randomActionIndex];
        }
    }
}