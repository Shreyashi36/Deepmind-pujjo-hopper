# PujoPath AI: Multi-Agent Autonomous Orchestration for Mega-Scale Urban Transit & Crowd Navigation

**Track Selected:** Problem Statement 4: Autonomous Orchestration with Managed Agents  
**Focus Models & Stack:** Antigravity Agent (`antigravity-preview-09-2026`) via Interactions API, Gemini 3.8 Flash, Multi-Agent Tool Calling  
**Public Code Repository:** https://github.com/Shreyashi36/Deepmind-pujjo-hopper  
**Live Demo:** Localhost Dev / Hosted Interface at `http://localhost:5173`  
**Dataset:** Kolkata Durga Puja Geospatial Matrix 2026 (379 Pandals across 10 Urban Zones)

---

## 1. Problem Overview & The Mega-Scale Challenge

Kolkata Durga Puja (recognized by UNESCO as an Intangible Cultural Heritage of Humanity) witnesses over **30 million visitors** navigating 3,000+ community pandals across a 7-day festive window. 

This presents extreme real-world urban mobility challenges:
1. **Dynamic Crowd & Queue Surges:** Pandal entry queues fluctuate from 15 minutes in the afternoon to over 90+ minutes during peak evenings on Saptami, Ashtami, and Nabami.
2. **Police Traffic Restrictions & Cordons:** Arterial corridors (Rashbehari Avenue, VIP Road, Gariahat) are cordoned off as pedestrian-only zones, invalidating static mapping APIs.
3. **Complex Multi-Modal Transit Networks:** Hoppers must coordinate between Kolkata Metro (Blue & Green lines), shared auto-rickshaw stands, and pedestrian corridors without backtracking.
4. **Cascading Failure of Standard Single-Prompt Planners:** A single unexpected queue surge or police barricade breaks a static itinerary, causing severe delays unless dynamic stateful replanning is applied.

---

## 2. System Architecture: Stateful Multi-Agent Orchestration

To satisfy **Problem Statement 4 (Autonomous Orchestration with Managed Agents)**, we built **PujoPath AI**—a stateful multi-agent system where specialized sub-agents collaborate through a Master Orchestrator via the Interactions API to plan, delegate, execute tool calls, monitor execution, and autonomously self-heal upon disruptions.

### Multi-Agent Delegation Pipeline

| Agent Name | Role & Responsibility | Core Input & Tooling | Output Artifact |
| :--- | :--- | :--- | :--- |
| **1. Master Orchestrator** *(Antigravity Agent)* | Long-horizon state management, task decomposition, inter-agent delegation | User Constraints (Origin, Destination, Day, Themes, VIP Pass) | Execution state vector & final synthesized plan |
| **2. Pandal Curator Agent** | Spatial corridor clustering & theme semantic matching across 379 pandals | Geo-coordinates bounding box, theme taxonomy, ratings | High-affinity candidate pandals (zero backtrack) |
| **3. Crowd & Traffic Forecaster** | Temporal crowd surge modeling, police restriction tiering & wait time prediction | Puja Day Tithi multipliers (0.35x - 2.30x), hourly surge curves | Dynamic queue ETAs (mins) & police vehicular advisories |
| **4. Multi-Modal Transit Router** | Multi-objective graph optimization across Metro, shared auto & walking paths | Metro Blue/Green network matrix, auto routes, pedestrian corridors | Timed step-by-step itinerary, budget (₹), walk stamina (km) |
| **5. Dynamic Replanner (Self-Healing)** | Real-time interrupt interception & surgical state recovery | Live incident feeds (Police cordons, queue spikes, transit delays) | Rebalanced itinerary with node substitution |

---

### Step-by-Step Multi-Agent Execution Flow

1. **User Goal Ingestion ➔ Master Orchestrator:**  
   The user specifies their starting point, ending point, target Puja Day (Dwitiya through Dashami), and transit preference. The Master Orchestrator creates a stateful session.

2. **Corridor & Theme Filtering ➔ Pandal Curator Agent:**  
   Evaluates the 379-pandal dataset and selects the optimal subset aligned with user interests (e.g. Grand Lighting, Contemporary Art, Bonedi Bari) along a progressive forward corridor.

3. **Temporal Surge & Police Cordon Analysis ➔ Crowd & Traffic Agent:**  
   Calculates non-linear crowd multipliers for the specific date/time and applies Kolkata Police traffic cordons (pedestrian-only zone conversions).

4. **Multi-Modal Graph Synthesis ➔ Transit Router Agent:**  
   Computes the optimal transit sequence connecting Metro lines, shared auto stands, and walking routes to minimize total time and expense (₹).

5. **Live Interruption & Autonomous Recovery ➔ Dynamic Replanner:**  
   When real-time bottlenecks occur (e.g. VIP Road vehicular lockdown or queue surge +50m), the agent intercepts the event, isolates the affected stop, and autonomously heals the route without restarting the session.

---

## 3. Dataset Engineering: Kolkata Durga Puja Matrix (379 Pandals)

We curated a 379-pandal dataset (`kolkata_durga_puja_2026.csv`) containing:
- **South Kolkata & Behala:** Ekdalia Evergreen, Singhi Park, Maddox Square, Tridhara, Suruchi Sangha, Chetla Agrani, Mudiali Club, Badamtala Ashar Sangha, 66 Palli, Behala Chowrasta.
- **North & Central Kolkata:** Bagbazar Sarbojanin, Sovabazar Rajbari, Kumartuli Park, Ahiritola, College Square, Santosh Mitra Square, Mohammad Ali Park, Chaltabagan.
- **East Kolkata & Salt Lake:** Sreebhumi Sporting Club, Salt Lake FD & BJ Block, Dum Dum Park Tarun Sangha.
- **Howrah, Hooghly & Suburban Regions:** Salkia, Shibpur, Serampore, Dankuni, South/North 24 Parganas.

Each record includes exact coordinates, nearest metro station, walk duration, auto stands, base wait times, themes, and police cordon flags.

---

## 4. Technical Choices & Verification

- **Interactions API & Managed Agent State:** State is preserved across multiple turns and replanning loops. If a queue spike is detected on Stop #3, the system adjusts downstream ETAs across Stops #4 through #7 without losing prior recommendations.
- **Interactive Geospatial Visualizer:** Built with React 19, TypeScript, and Leaflet. Renders crowd-heat color-coded markers, metro station nodes, shared auto corridors, and walking paths.
- **Live Disruption Stress-Testing Panel:** Allows evaluators to inject real-time disruptions (Police Lockdowns, Queue Surges, Metro Delays) to immediately witness autonomous agent self-healing.
- **Audio Briefing Synthesis:** Built-in audio narration of the generated itinerary for hands-free guidance in dense, noisy crowds.

---

## 5. Conclusion & Impact

PujoPath AI demonstrates how the Google AI Stack and Antigravity Managed Agents transform complex, chaotic urban mobility challenges into seamless, predictable, and culturally enriched experiences. By orchestrating specialized agents across data curation, traffic forecasting, multi-modal routing, and real-time self-healing, PujoPath AI serves as a blueprint for autonomous agent orchestration in mega-event logistics worldwide.
