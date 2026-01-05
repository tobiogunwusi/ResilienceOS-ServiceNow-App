# ResilienceOS: Automated Infrastructure Governance App

**Role:** ServiceNow Developer / Architect
**Scope:** Custom Scoped Application (`x_1183354_resili`)
**Type:** Governance, Risk, and Compliance (GRC) / SecOps

---

## 🚀 Project Overview
**ResilienceOS** is a custom ServiceNow application designed to solve "Alert Fatigue" and "Governance Drift" in enterprise infrastructure. 

Unlike standard ticketing tools that simply log errors, ResilienceOS uses an **"Ingest -> Intelligence -> Governance -> Action"** architecture. It automatically ingests raw server alerts, calculates a confidence score to determine if an issue is real, enforces strict process governance, and triggers self-healing remediation—all in milliseconds.

## 🏗️ Architecture

The application follows a strict data pipeline:

1.  **Ingestion (REST API):** Decouples monitoring tools from the ServiceNow instance.
2.  **Intelligence (Logic Engine):** Parses unstructured data to assign risk.
3.  **Governance (Validation):** Prevents human error and SLA manipulation.
4.  **Remediation (Flow Designer):** Orchestrates the fix.

---

## 🧠 Key Features & Technical Logic

### 1. Ingestion Layer (Scripted REST API)
* **Endpoint:** `/api/x_1183354/ingest`
* **Function:** Accepts raw JSON payloads from external monitoring tools (e.g., SolarWinds, Datadog).
* **Defensive Coding:** Includes `try/catch` blocks and input validation to ensure bad data does not corrupt the database.

### 2. Intelligence Engine (Simulated GenAI)
* **The Constraint:** As this is built on a Personal Developer Instance (PDI), **Now Assist (GenAI)** licenses were unavailable.
* **The Solution:** I architected a **Deterministic Logic Engine** using advanced Business Rules to simulate the decision-making of an AI.
* **Mechanism:** The system parses error patterns (e.g., `OutOfMemoryError` vs. `DiskLatency`), calculates a **Confidence Score (0-100)**, and assigns a remediation path. This mocks the classification result of an LLM to drive downstream automation.

### 3. Governance & Compliance Layer (The "Safety Switch")
* **Problem:** In many organizations, analysts manually downgrade "High Risk" items to "Triage" to pause SLA clocks.
* **Solution:** A Validation Business Rule acts as a guardrail.
    * *Scenario:* If a user attempts to change the status of a **High Confidence (>90)** item back to **"Analyzing"**, the system rejects the update with a governance violation error.
    * *Scenario:* If a user attempts to force **"Auto-Fixing"** on a **Low Confidence (<50)** item, the system blocks the action to prevent dangerous automated changes on uncertain data.

### 4. Automated Remediation (Flow Designer)
* **Trigger:** Records entering the `Auto-Fixing` state.
* **Action:** A Flow Designer workflow executes immediately (38ms execution time).
* **MVP Implementation:** Simulates an API call to an orchestration tool (like Ansible or SCCM) to patch the server, then automatically closes the ticket with a timestamped audit trail.

---

## 🛠️ Technical Stack

| Component | Technology Used |
| :--- | :--- |
| **Application Scope** | Custom Scoped App (`x_1183354_resili`) |
| **Database** | Custom Table (`x_1183354_resili_0_resilience_alert`) |
| **Server-Side Logic** | Scripted REST APIs, Advanced Business Rules |
| **Automation** | Flow Designer |
| **Data Integrity** | `parseInt()` sanitization, Enforced State Flows |

---
## 📸 Usage Example

**1. Input (JSON sent via Postman):**
```json
{
  "server": "DE-BER-01",
  "error": "Java Heap Space OutOfMemoryError",
  "source": "SolarWinds"
}


2. System Processing:
Intelligence: Detects "Heap Space" -> Assigns Score: 98 -> Sets Status: Auto-Fixing.
Governance: Validates Score > 90. Allows automation.
Action: Triggers Flow.

3. Output (Audit Log):
"2026-01-05 15:27:29 - System Administrator: Auto-Fix executed successfully. Server rebooted. Closing ticket."
