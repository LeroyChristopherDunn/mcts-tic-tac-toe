
export type State = any;
export type Action = any;

export interface TerminalCondition {
    reset: VoidFunction,
    isTerminal: (numIterations: number) => boolean,
}

export interface SelectionScorer {
    score: (node: Node) => number;
}

export type GetActions = (state: State) => Action[];

export interface ExpansionPolicy {
    getAction: (state: State, unexploredActions: Action[]) => Action,
}

export type Transition = (state: State, action: Action) => State;

export interface Simulator {
    simulate: (state: State) => -1 | 0 | 1,
}

export type Model = {
    initialState: State,
    getActions: GetActions,
    transition: Transition,
}

export class Node {

    private children: Node[] = [];
    private totalScore = 0;
    private numSimulations = 0;

    constructor(
        public readonly state: any,
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
    }

    getTotalScore() {
        return this.totalScore;
    }

    getNumSimulations() {
        return this.numSimulations;
    }
}

