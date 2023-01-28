
export type State = any;
export type Action = any;

export interface TerminalCondition {
    reset: VoidFunction,
    isTerminal: (numIterations: number) => boolean,
}

export interface SelectionScorer {
    score: (node: Node) => number;
}

export type GetActions = (initialState: State, actions: Action[]) => Action[];

export interface ExpansionPolicy {
    getAction: (initialState: State, actions: Action[], unexploredActions: Action[]) => Action,
}

export interface Simulator {
    simulate: (initialState: State, actions: Action[]) => number, // -1 <= score <= 1
}

export type Model = {
    initialState: State,
    getActions: GetActions,
}

export class Node {

    private children: Node[] = [];
    private totalScore = 0;
    private numSimulations = 0;
    private avgScore = 0; // for debugging

    constructor(
        public readonly prevAction: any | null,
        public readonly parent: Node | null,
    ) {}

    addChild(child: Node) {
        this.children.push(child);
    }

    getChildren() {
        return this.children;
    }

    addSimulationScore(score: number){
        this.totalScore += score;
        this.numSimulations += 1;
        this.avgScore = this.totalScore / (this.numSimulations + 0.01);
    }

    getTotalScore() {
        return this.totalScore;
    }

    getNumSimulations() {
        return this.numSimulations;
    }
}
