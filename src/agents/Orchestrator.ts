import { PandalCuratorAgent } from './PandalCuratorAgent';
import { CrowdTrafficAgent } from './CrowdTrafficAgent';
import { TransitRouterAgent } from './TransitRouterAgent';
import { DynamicReplannerAgent } from './DynamicReplannerAgent';
import { UserPreferences, RoutePlan, AgentLog, SimulationEvent } from './types';

export class MasterOrchestrator {
  private curatorAgent: PandalCuratorAgent;
  private crowdAgent: CrowdTrafficAgent;
  private routerAgent: TransitRouterAgent;
  private replannerAgent: DynamicReplannerAgent;

  constructor() {
    this.curatorAgent = new PandalCuratorAgent();
    this.crowdAgent = new CrowdTrafficAgent();
    this.routerAgent = new TransitRouterAgent();
    this.replannerAgent = new DynamicReplannerAgent();
  }

  async runOrchestrationPipeline(
    prefs: UserPreferences,
    onLog: (log: AgentLog) => void
  ): Promise<RoutePlan> {
    const dispatchLog = (partialLog: Omit<AgentLog, 'id' | 'timestamp'>) => {
      const fullLog: AgentLog = {
        ...partialLog,
        id: `log-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        timestamp: new Date().toLocaleTimeString()
      };
      onLog(fullLog);
    };

    dispatchLog({
      agent: 'MASTER_ORCHESTRATOR',
      agentName: 'Master Orchestrator (Antigravity Agent)',
      type: 'thought',
      content: `Initializing Durga Puja Autonomous Multi-Agent Loop for route from "${prefs.origin}" to "${prefs.destination}" on ${prefs.pujaDay}. Dispatching task delegation across sub-agents.`
    });

    // Step 1: Pandal Curator Agent
    dispatchLog({
      agent: 'MASTER_ORCHESTRATOR',
      agentName: 'Master Orchestrator',
      type: 'delegation',
      content: 'Delegating to Pandal Curator Agent: Filter geographical corridor & match pandal themes.'
    });
    const candidatePandals = await this.curatorAgent.curate(prefs, dispatchLog);

    // Step 2: Crowd & Traffic Analyst Agent
    dispatchLog({
      agent: 'MASTER_ORCHESTRATOR',
      agentName: 'Master Orchestrator',
      type: 'delegation',
      content: `Delegating to Crowd & Traffic Analyst Agent: Compute temporal congestion matrix for ${prefs.pujaDay} starting at ${prefs.startTime}.`
    });
    const { evaluated, advisories } = await this.crowdAgent.analyze(
      candidatePandals,
      prefs.pujaDay,
      prefs.startTime,
      prefs.hasVipPass,
      dispatchLog
    );

    // Step 3: Multi-Modal Transit Router Agent
    dispatchLog({
      agent: 'MASTER_ORCHESTRATOR',
      agentName: 'Master Orchestrator',
      type: 'delegation',
      content: 'Delegating to Multi-Modal Transit Router Agent: Solve graph optimization (Metro + Shared Auto + Walk) with 0 backtracking.'
    });
    const finalPlan = await this.routerAgent.buildRoute(
      prefs,
      evaluated,
      advisories,
      dispatchLog
    );

    dispatchLog({
      agent: 'MASTER_ORCHESTRATOR',
      agentName: 'Master Orchestrator',
      type: 'success',
      content: `Autonomous Orchestration successfully completed. Generated optimal ${finalPlan.stops.length}-stop itinerary (${finalPlan.totalDurationMinutes} min, ₹${finalPlan.totalCostInr}). Ready for navigation.`
    });

    return finalPlan;
  }

  async handleReplanningEvent(
    currentPlan: RoutePlan,
    event: SimulationEvent,
    onLog: (log: AgentLog) => void
  ): Promise<RoutePlan> {
    const dispatchLog = (partialLog: Omit<AgentLog, 'id' | 'timestamp'>) => {
      const fullLog: AgentLog = {
        ...partialLog,
        id: `log-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        timestamp: new Date().toLocaleTimeString()
      };
      onLog(fullLog);
    };

    return await this.replannerAgent.replan(currentPlan, event, dispatchLog);
  }
}
