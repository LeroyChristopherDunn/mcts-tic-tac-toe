import * as Random from "random-seed";
import {Action, ExpansionPolicy, SelectionScorer, State, TerminalCondition} from "./types";

export function FixedIterations(maxIterations = 10000): TerminalCondition{
    return {
        reset: () => {},
        isTerminal: numIterations => numIterations >= maxIterations,
    }
}
export function FixedTime(timeoutMs = 500): TerminalCondition{
    let start
    return {
        reset: () => {
            start = Date.now();
        },
        isTerminal: () => {
            const now = Date.now();
            return now - start > timeoutMs;
        },
    }
}

export function UCB(c = Math.sqrt(2)): SelectionScorer {
    return {
        score: node => {
            const delta = 0.01;
            const exploitation = node.getTotalScore() / (node.getNumSimulations() + delta);
            const exploration = Math.sqrt(Math.log(node.parent.getNumSimulations()) / (node.getNumSimulations() + delta))
            return exploitation + c * exploration;
        }
    }
}

export function RandomExpansionPolicy(seed = 0): ExpansionPolicy {
    const random = Random.create(seed.toString());
    return {
        getAction: (state: State, unexploredActions: Action[]): Action => {
            const randomActionIndex = random.intBetween(0, unexploredActions.length - 1);
            return unexploredActions[randomActionIndex];
        }
    }
}