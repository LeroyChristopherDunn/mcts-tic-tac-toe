import {
    Action,
    ExpansionPolicy,
    Model,
    Node,
    SelectionScorer,
    Simulator,
    TerminalCondition,
} from "./types";
import {FixedIterations, RandomExpansionPolicy} from "../mcts/utils";
import * as deepEqual from "deep-equal";
import {UCB} from "./utils";

export class OpenLoopMonteCarloTreeSearch {

    private readonly root = new Node(null, null);
    private isComplete = false;

    constructor(
        private readonly model: Model,
        private readonly simulator: Simulator,
        private readonly terminalCondition: TerminalCondition = FixedIterations(1000),
        private readonly selectionScorer: SelectionScorer = UCB(),
        private readonly actionPolicy: ExpansionPolicy = RandomExpansionPolicy(0),
    ) { }

    run() {
        if (this.isComplete) return this.root;
        let numIterations = 0;
        this.terminalCondition.reset();
        while (!this.terminalCondition.isTerminal(numIterations)){
            const selection = this.selection(this.root);
            const expandedNode = this.expansion(selection.node, selection.availableActions);
            const score = this.simulator.simulate(this.model.initialState, this.getPriorActions(expandedNode));
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

    private selection(node: Node): { node: Node, availableActions: Action[] } {
        const priorActions = this.getPriorActions(node);
        const availableActions = this.model.getActions(this.model.initialState, priorActions);

        if (this.isNotFullyExpanded(node, availableActions)) return { node, availableActions };
        if (node.getChildren().length === 0) return { node, availableActions }; //terminal state

        const nextNode = this.getHighestScoringNode(node.getChildren(), this.selectionScorer.score);
        return this.selection(nextNode);
    }

    private isNotFullyExpanded(node: Node, availableActions: Action[]) {
        return availableActions.length !== node.getChildren().length;
    }

    private getPriorActions(node: Node, result = []){
        if (!node.prevAction) return result;
        return this.getPriorActions(node.parent, [node.prevAction, ...result])
    }

    private expansion(node: Node, availableActions: Action[]): Node {
        const action = this.getUnexploredAction(node, availableActions);
        if (!action) return node;
        const newNode = new Node(action, node);
        node.addChild(newNode);
        return newNode;
    }

    private getUnexploredAction(node: Node, availableActions: Action[]): Action | null {
        if (availableActions.length === 0) return null;
        const exploredActions = node.getChildren().map(node => node.prevAction);
        const unexploredActions = availableActions
            .filter(action => !exploredActions.some(exploredAction => deepEqual(exploredAction, action)))
        if (unexploredActions.length === 0) return null;
        const priorActions = this.getPriorActions(node);
        return this.actionPolicy.getAction(this.model.initialState, priorActions, unexploredActions);
    }

    private backtrack(node: Node | null, score: number){
        if (!node) return;
        node.addSimulationScore(score);
        this.backtrack(node.parent, -1 * score); // min max formulation
    }
}
