# CareLoop AI

> **Enterprise Healthcare Closed-Loop Navigation Platform**  
> *Closing the dangerous gap between abnormal screenings and confirmed patient care.*

[![Release](https://img.shields.io/badge/release-v1.2.0-8B5CF6.svg)](https://github.com/srj7042/CareLoop)
[![React](https://img.shields.io/badge/React-19.3-10B981.svg)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3B82F6.svg)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-06B6D4.svg)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/license-MIT-slate.svg)](./LICENSE)

---

## 💡 How CareLoop Works (In 30 Seconds)

When a patient gets an abnormal screening (like a suspicious mammogram or biopsy), **up to 30% get lost in the system** because of confusing letters, missed phone calls, and manual spreadsheet tracking.

**CareLoop AI solves this in 5 simple steps:**

```
1. Ingest Result  ➔  2. AI Risk Score  ➔  3. Plain-Language Text  ➔  4. Doctor Consult  ➔  5. Verified Loop Closed
  (From Hospital)      (Triage & Prioritize)     (1-Tap Patient Ack)       (Schedule Biopsy)        (Doctor Sign-Off)
```

---

## ⚡ Traditional Healthcare vs. CareLoop AI

| Step | ❌ Without CareLoop (Broken System) | ✅ With CareLoop AI (Closed-Loop System) |
| :--- | :--- | :--- |
| **1. Abnormal Lab Arrives** | Sits in doctor's inbox; days before review. | **Instant automated ingestion**; evaluated in seconds. |
| **2. Risk Assessment** | No prioritization; easy cases mixed with critical. | **ML Delay-Risk Score (0–100)** flags urgent patients first. |
| **3. Patient Notification** | Dense, scary medical jargon mailed via post. | **Empathetic 6th-grade summary** sent via SMS / WhatsApp in preferred language. |
| **4. Patient Response** | Patient panics, delays, or fails to respond. | **1-Tap mobile action**: *"I Understand"*, *"I Have Questions"*, or *"Call Me"*. |
| **5. SLA & Timers** | Cases get forgotten when coordinators are busy. | **Strict 72-Hour SLA Timer** triggers alerts before breaches happen. |
| **6. Loop Closure** | Assumed closed if patient doesn't complain. | **Strict Proof Required**: Attended visit + doctor's digital signature. |

---

## 🏛️ Easy-to-Understand Architecture Diagram

Here is how data flows from hospital systems through our AI and care teams all the way to verified loop closure:

```mermaid
flowchart TD
    %% COLOR THEMES
    classDef input fill:#EFF6FF,stroke:#3B82F6,stroke-width:2px,color:#1E3A8A;
    classDef ai fill:#F5F3FF,stroke:#8B5CF6,stroke-width:2px,color:#5B21B6;
    classDef team fill:#ECFDF5,stroke:#10B981,stroke-width:2px,color:#064E3B;
    classDef patient fill:#FFF7ED,stroke:#F59E0B,stroke-width:2px,color:#9A3412;
    classDef closure fill:#FDF2F8,stroke:#EC4899,stroke-width:2px,color:#831843;

    subgraph STEP1["STEP 1: INCOMING HOSPITAL DATA"]
        EHR["🏥 Hospital Systems & Labs<br/>(EHR / HL7 / PACS / Lab Feeds)"]:::input
    end

    subgraph STEP2["STEP 2: CARELOOP AI BRAIN"]
        direction TB
        A1["🧠 Predictive Risk Engine<br/>Calculates 0–100 Delay Risk Score"]:::ai
        A2["💬 Plain-Language Translator<br/>Turns BI-RADS jargon into 6th-grade words"]:::ai
        A3["⏱️ 72-Hour SLA Monitor<br/>Watches every case for stalled progress"]:::ai
    end

    subgraph STEP3["STEP 3: CLINICAL WORKSPACES (Who Acts)"]
        direction TB
        W1["👩‍⚕️ Care Coordinator ➔ Triage list & 1-click patient nudges"]:::team
        W2["🩺 Primary Clinician ➔ Confirmatory orders & specialist consults"]:::team
        W3["🔬 Specialist Doctor ➔ Referral review & biopsy slots"]:::team
        W4["📊 Medical Director ➔ Hospital-wide loop closure analytics"]:::team
    end

    subgraph STEP4["STEP 4: PATIENT EXPERIENCE"]
        P1["📱 Multichannel Outreach (SMS, WhatsApp, Portal)"]:::patient
        P2["👍 1-Tap Confirmation ('Understood' / 'Questions' / 'Call Me')"]:::patient
        P3["🌐 5 Regional Languages (English, Hindi, Telugu, Tamil, Marathi)"]:::patient
    end

    subgraph STEP5["STEP 5: VERIFIED LOOP CLOSURE"]
        C1["🔒 Proof of Closure Required:<br/>• Confirmatory diagnostic visit attended<br/>• Pathology / biopsy report documented<br/>• Mandatory doctor digital sign-off"]:::closure
    end

    EHR -->|"1. Raw Abnormal Result"| STEP2
    STEP2 -->|"2. Prioritized & Translated"| STEP3
    STEP3 -->|"3. Empathetic Message"| STEP4
    STEP4 -->|"4. Patient Confirms & Books"| STEP3
    STEP3 -->|"5. Attended Care & Sign-off"| STEP5
```

---

## 🔄 The 6-Step Clinical Lifecycle (How Every Case Travels)

Every case in CareLoop moves through 6 clear stages with **human clinician oversight at every milestone**:

```mermaid
flowchart LR
    S1["1. Result Ingested<br/>(Risk Scored 0-100)"] --> S2["2. Patient Notified<br/>(SMS/WhatsApp/Portal)"]
    S2 --> S3["3. Patient Acknowledged<br/>(1-Tap Confirmation)"]
    S3 --> S4["4. Diagnostic Ordered<br/>(Biopsy/Ultrasound)"]
    S4 --> S5["5. Specialist Referral<br/>(Pre-filled Packet)"]
    S5 --> S6["6. Loop Closed ✓<br/>(Visit Attended + Doctor Sign-off)"]
```

1. **Result Ingested:** Abnormal report detected. AI assigns a **Delay Risk Score (0–100)** based on severity and social vulnerability.
2. **Patient Notified:** Multichannel message sent within 24 hours in patient's preferred language.
3. **Patient Acknowledged:** Patient confirms understanding or requests a callback with 1 tap.
4. **Diagnostic Ordered:** Clinician orders confirmatory workup (e.g., targeted ultrasound or biopsy).
5. **Specialist Referral:** Automated clinical handoff sent to specialist; specialist accepts or requests more info.
6. **Verified Loop Closed:** **Loops NEVER close automatically.** Case only closes when proof of treatment/visit is logged and signed off by a human doctor.

---

## 👥 Who Uses CareLoop? (Role-Based Workspaces)

CareLoop gives every member of the care team their own customized view:

| Role | What They See & Do | Key Feature |
| :--- | :--- | :--- |
| **👩‍⚕️ Care Coordinator** | Daily worklist of abnormal results needing action; overdue patients flagged. | **1-Click Nudge**: Sends instant patient outreach reminders. |
| **🩺 Primary Clinician** | Orders confirmatory tests, chats with specialists, and signs off on closed loops. | **Rapid Consult**: Direct in-app chat with specialists. |
| **🔬 Specialist Clinician** | Referral inbox for biopsies, oncology consults, and surgical slots. | **1-Click Triage**: Accept, request more info, or re-route. |
| **🏥 Department Head (HOD)** | Balances coordinator workloads so no single nurse has too many high-risk cases. | **Capacity Load Meter**: Live workload balance bars. |
| **📊 Medical Director** | Hospital-wide loop closure rate, department comparisons, and SLA compliance. | **SLA Analytics**: Tracks hospital-wide performance trends. |
| **👤 Patient & Family** | Friendly mobile portal explaining their test, what happens next, and their care team. | **1-Tap Response**: Instant answers in English, Hindi, Tamil, Telugu, Marathi. |

---

## 🎨 Clean Frosted Glassmorphism Design (`v1.2.0`)

CareLoop AI uses a calm, clinical-grade user interface designed to eliminate eye fatigue and stress:
- **Canvas:** Multi-stop soft pastel gradient (`#E8EEF5` &rarr; `#EAE8F2` &rarr; `#F5EAF0`).
- **Surfaces:** Semi-translucent frosted glass cards (`bg-white/80 backdrop-blur-md rounded-[26px]`).
- **Interactive Micro-Interactions:** Subtle hover elevation (`-2.5px`), soft ambient shadow expansion, and border glow whenever mouse pointer targets any card, block, or button.
- **Accessible Palette:** High-contrast text (`#1E2532`), cool slate descriptions (`#798393`), mint green indicators (`#10B981`), and soft lavender badges (`#8B5CF6`).

---

## 🛠️ Technology Stack

- **Frontend:** React 19.3 + TypeScript 5.9
- **Build Tool:** Vite 8.3
- **Styling:** Tailwind CSS v4, PostCSS
- **Animation:** Motion (Framer Motion 14.6)
- **State Management:** Zustand (with local persistence)
- **Icons:** Lucide React
- **Notifications:** Sonner

---

## 🚀 Quick Start Guide

### 1. Clone & Install
```bash
git clone https://github.com/srj7042/CareLoop.git
cd CareLoop
npm install
```

### 2. Run Locally
```bash
npm run dev
```
Open **`http://localhost:5173`** in your browser.

### 3. Build for Production
```bash
npm run build
```
*(Compiles cleanly with 0 TypeScript/Vite errors)*

---

## 🔒 Security & Medical Governance

- **Strict Patient Privacy (HIPAA-Aligned):** Full data isolation between healthcare organizations and user roles.
- **Human-in-the-Loop:** AI assists and drafts—licensed human clinicians always make final medical decisions.
- **Immutable Audit Trail:** Every message, status change, and doctor sign-off is permanently logged with timestamps.

---

## 📄 License

This project is licensed under the [MIT License](./LICENSE).
