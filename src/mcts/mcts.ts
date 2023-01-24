import {Action, ExpansionPolicy, Model, Node, SelectionScorer, Simulator, TerminalCondition} from "./types";
import {FixedIterations, RandomExpansionPolicy, UCB} from "./utils";
import * as deepEqual from "deep-equal";

// https://towardsdatascience.com/monte-carlo-tree-search-an-introduction-503d8c04e168

export class MonteCarloTreeSearch {

    private readonly root: Node;
    private isComplete = false;

    constructor(
        private readonly model: Model,
        private readonly simulator: Simulator,
        private readonly terminalCondition: TerminalCondition = FixedIterations(1000),
        private readonly selectionScorer: SelectionScorer = UCB(),
        private readonly actionPolicy: ExpansionPolicy = RandomExpansionPolicy(0),
    ) {
        this.root = new Node(model.initialState, null, null);
    }

    run() {
        if (this.isComplete) return this.root;
        let numIterations = 0;
        this.terminalCondition.reset();
        while (!this.terminalCondition.isTerminal(numIterations)){
            const selectedNode = this.selection(this.root);
            const expandedNode = this.expansion(selectedNode);
            const score = this.simulator.simulate(expandedNode.state);
            this.backtrack(expandedNode, score);
            numIterations++;
        }
        this.isComplete = true;
        return this.root;
    }

    getBestAction(node: Node){
        // best action is one which minimizes opponent score
        const score = (node: Node) => -1 * node.getTotalScore() / (node.getNumSimulations() + 0.01);
        const bestNode = this.getHighestScoringNode(node.getChildren(), score);
        return bestNode?.prevAction;
    }

    private getHighestScoringNode(
        nodes: Node[],
        score: (node: Node) => number,
    ): Node | undefined{
        return nodes
            .sort((a, b) => -1 * (score(a) - score(b)))
            [0];
    }

    private selection(node: Node) {
        if (this.isNotFullyExpanded(node)) return node;
        if (node.getChildren().length === 0) return node; //terminal state
        const nextNode = this.getHighestScoringNode(node.getChildren(), this.selectionScorer.score);
        return this.selection(nextNode);
    }

    private isNotFullyExpanded(node: Node) {
        const availableActions = this.model.getActions(node.state);
        return availableActions.length !== node.getChildren().length;
    }

    private expansion(node: Node): Node {
        const action = this.getUnexploredAction(node);
        if (!action) return node;
        const newState = this.model.transition(node.state, action);
        const newNode = new Node(newState, action, node);
        node.addChild(newNode);
        return newNode;
    }

    private getUnexploredAction(node: Node): Action | null{
        const availableActions = this.model.getActions(node.state);
        if (availableActions.length === 0) return null;
        const exploredActions = node.getChildren().map(node => node.prevAction);
        const unexploredActions = availableActions
            .filter(action => !exploredActions.some(exploredAction => deepEqual(exploredAction, action)))
        if (unexploredActions.length === 0) return null;
        return this.actionPolicy.getAction(node.state, unexploredActions);
    }

    private backtrack(node: Node | null, score: number){
        if (!node) return;
        node.addSimulationScore(score);
        this.backtrack(node.parent, -1 * score); // min max formulation
    }
}
