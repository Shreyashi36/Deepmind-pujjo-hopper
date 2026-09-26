# PujoPath AI: Autonomous Multi-Agent Orchestration for Mega-Scale Urban Transit & Crowd Navigation

**Track Selected:** Problem Statement 4: Autonomous Orchestration with Managed Agents  
**Focus Models & Stack:** Antigravity Agent (`antigravity-preview-09-2026`) via Interactions API, Gemini 3.8 Flash, Multi-Agent Tool Calling  
**Team Name:** PujoPath AI  
**Live Demo:** Localhost Dev / Hosted Interface at `http://localhost:5173`  
**Public Code Repository:** Included in submission  
**Dataset:** Kolkata Durga Puja Geospatial Matrix 2026 (379 Pandals across 10 Zones)  

---

## 1. Problem Overview & The Mega-Scale Challenge

Kolkata Durga Puja is recognized by UNESCO as an Intangible Cultural Heritage of Humanity. Over the span of 7 days (Dwitiya through Dashami), **over 30 million people** visit more than 3,000 community pandals across Kolkata and its adjoining metropolitan regions (South Kolkata, North Kolkata, Central, Salt Lake, Behala, Howrah).

Navigating this sheer density presents severe real-world challenges:
1. **Dynamic Crowd & Queue Bottlenecks:** A pandal taking 15 minutes to enter at 3:00 PM can easily surge to a 90+ minute queue by 8:00 PM on Saptami or Ashtami.
2. **Police Traffic Restrictions & Cordons:** Arterial roads (Rashbehari Avenue, VIP Road, Gariahat) convert into strictly pedestrian-only zones, invalidating static route algorithms and standard road routing APIs.
3. **Multi-Modal Transit Graph Complexity:** Visitors navigate a heterogeneous mix of Blue Line North-South Metro, Green Line East-West underwater Metro, shared auto-rickshaw routes, and pedestrian corridors.
4. **Cascading Failure in Standard Planners:** Single-prompt LLM planners or static TSP algorithms fail as soon as a single road is barricaded or a queue surges, requiring complete recalculation without context preservation.

---

## 2. System Architecture: Stateful Multi-Agent Orchestration

To satisfy **Problem Statement 4 (Autonomous Orchestration with Managed Agents)**, we built **PujoPath AI**—a stateful multi-agent system where specialized sub-agents collaborate through a Master Orchestrator via the Interactions API to plan, delegate, execute tool calls, monitor execution, and autonomously self-heal upon disruptions.

```
                                  ┌───────────────────────────────────────────────┐
                                  │   Master Orchestrator (Antigravity Agent)     │
                                  │           Interactions API Runtime            │
                                  └───────┬──────────────┬──────────────┬─────────┘
                                          │              │              │
                    ┌─────────────────────┘              │              └─────────────────────┐
                    ▼                                    ▼                                    ▼
       ┌─────────────────────────┐         ┌───────────────────────────┐        ┌───────────────────────────┐
       │   Pandal Curator Agent  │         │   Crowd & Traffic Agent   │        │   Transit Router Agent    │
       │   Corridor & Theme Match│         │   Temporal Surge Modeling │        │   Multi-Modal Graph (₹/m) │
       └─────────────────────────┘         └───────────────────────────┘        └───────────────────────────┘
                    ▲                                    ▲                                    ▲
                    │                                    │                                    │
                    └────────────────────────────────────┴────────────────────────────────────┘
                                                         │
                                        ┌────────────────┴────────────────┐
                                        │  Dynamic Replanner (Self-Heal)  │
                                        │  Interrupt & Bottleneck Repair  │
                                        └─────────────────────────────────┘
```

### Specialized Agents & Roles:

1. **Master Orchestrator (Antigravity Agent):**  
   Maintains long-horizon goal state, manages the execution lifecycle, decomposes user goals (Origin, Destination, Puja Day Tithi, Budget, VIP Pass status) into structured sub-tasks, and handles delegation.

2. **Pandal Curator Agent:**  
   Scans our comprehensive 379-pandal dataset across 10 Kolkata zones. Evaluates corridor bounding boxes and semantic theme vectors (Grand Lighting & Architecture, Contemporary Art, Heritage Daaker Saaj, Social Themes, Bonedi Bari Courtyards) with zero hallucination.

3. **Crowd & Traffic Analyst Forecaster Agent:**  
   Applies day-specific non-linear multiplier models (Dwitiya $0.35\times$ baseline to Ashtami $2.30\times$ extreme surge) combined with hourly curves and Kolkata Police restriction tiers to output dynamic queue ETAs and safety alerts.

4. **Multi-Modal Transit Router Agent:**  
   Executes a modified 2-Opt TSP heuristic over Kolkata’s multi-modal transit graph (Blue Line Metro, Green Line Metro, 8+ shared auto hubs, and dedicated pedestrian corridors). Optimizes for travel time, footstep stamina, and budget constraints (₹).

5. **Dynamic Replanner Agent (Autonomous Self-Healing):**  
   Monitors live event streams (e.g. simulated police road barricades at VIP Road or queue surges at Chetla Agrani). Rather than rebooting the entire plan, it performs targeted state surgery: replacing cordoned nodes with nearest equivalent theme gems or rerouting transit around metro bottlenecks.

---

## 3. Dataset Engineering: Kolkata Durga Puja Matrix (379 Pandals)

We curated a 379-pandal dataset (`kolkata_durga_puja_2026.csv` and JSON format) spanning all major administrative zones:
- **South Kolkata & Behala:** Ekdalia Evergreen, Singhi Park, Maddox Square, Tridhara, Suruchi Sangha, Chetla Agrani, Mudiali Club, Badamtala Ashar Sangha, 66 Palli, Behala Chowrasta.
- **North & Central Kolkata:** Bagbazar Sarbojanin, Sovabazar Rajbari, Kumartuli Park, Ahiritola, College Square, Santosh Mitra Square, Mohammad Ali Park, Chaltabagan.
- **East Kolkata & Salt Lake:** Sreebhumi Sporting Club, Salt Lake FD & BJ Block, Dum Dum Park Tarun Sangha.
- **Howrah, Hooghly & Suburban Regions:** Salkia, Shibpur, Serampore, Dankuni, South/North 24 Parganas.

Each entry includes exact coordinates, nearest metro stations, walking distances, nearest auto stands, base queue times, themes, and police restriction flags.

---

## 4. Technical Implementation & Key Choices

- **Interactions API & Managed Agent State:** State is preserved across multiple turns and replanning loops. If a queue spike is detected on Stop #3, the system adjusts downstream ETAs across Stops #4 through #7 without losing prior recommendations.
- **Reactive UI Dashboard:** Built with React 19, TypeScript, and Vite. Integrates Leaflet for interactive geospatial rendering (color-coded crowd markers, metro nodes, dashed walking paths, and auto routes).
- **Audio Briefing Synthesis:** Built-in audio narration of the generated itinerary for hands-free guidance in noisy festive streets.
- **Live Disruption Stress-Testing Panel:** Allows evaluators to inject real-time disruptions (Police Lockdowns, Queue Surges, Metro Delays) to immediately witness autonomous agent self-healing.

---

## 5. Challenges Overcome

1. **Eliminating Route Backtracking:** Navigating Kolkata during Puja on foot easily leads to chaotic crisscrossing. The Multi-Modal Router agent uses distance matrix clustering to enforce progressive linear corridors.
2. **Handling Police One-Way Pedestrian Rules:** Unlike regular city traffic, police barricade major crossings during Puja evenings. Our Crowd & Traffic Agent incorporates police restriction tiers directly into route construction.
3. **Stateful Replanning Without Fragile Hardcoding:** Traditional if/else scripts fail on complex edge cases; our Multi-Agent Orchestrator leverages modular agent roles to cleanly isolate analysis, routing, and recovery.

---

## 6. Conclusion & Impact

PujoPath AI demonstrates how the Google AI Stack and Antigravity Managed Agents transform complex, chaotic urban mobility challenges into seamless, predictable, and culturally enriched experiences. By orchestrating specialized agents across data curation, traffic forecasting, multi-modal routing, and real-time self-healing, PujoPath AI serves as a blueprint for autonomous agent orchestration in mega-event logistics worldwide.
