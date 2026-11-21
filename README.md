# 💼 Agency-OS — Open-Source Agency & Freelancer Operating System

<p align="center">
  <img src="https://img.shields.io/badge/System-Agency--OS-00f0ff?style=for-the-badge" alt="Agency OS">
  <img src="https://img.shields.io/badge/Onboarding-Interactive%20Proposals-a855f7?style=for-the-badge" alt="Proposals">
  <img src="https://img.shields.io/badge/Settlement-Direct%20UPI-10b981?style=for-the-badge" alt="Direct UPI">
  <img src="https://img.shields.io/badge/MCP-Native%20Stdio-ff8b3d?style=for-the-badge" alt="MCP Server">
  <img src="https://img.shields.io/badge/License-MIT-blue?style=for-the-badge" alt="MIT License">
  <img src="https://img.shields.io/badge/Origin-Kanpur%2C%20India-ff9933?style=for-the-badge" alt="Made in India">
</p>

<p align="center">
  <strong>The complete open-source business operating system for digital agencies, dev shops, and freelance software engineers. Client onboarding, scope proposals, milestone Kanban, 18% GST tax invoicing, and direct UPI settlement.</strong>
</p>

<p align="center">
  <a href="https://1nsharma-labs.github.io/agency-os/"><strong>🌐 Live Interactive Client Portal Demo (Zero Login)</strong></a> &bull;
  <a href="#quickstart"><strong>Quickstart</strong></a> &bull;
  <a href="#core-capabilities"><strong>Core Capabilities</strong></a> &bull;
  <a href="#sponsorship--monetization"><strong>Sponsorship</strong></a>
</p>

---

> [!NOTE]
> **Live Auto-Sponsorship Slot Available:**
> Reach 30,000+ digital agencies, dev shops, consultants, and freelance engineers worldwide.
> **Book Slot:** Email [tech@mowglai.com](mailto:tech@mowglai.com) | Direct UPI: `6393741171@upi`

---

## 🏛️ Why Agency-OS?

Commercial proprietary platforms charge expensive recurring fees for proposal templates and payment collection, while payment intermediaries shave off margins on every client transaction.

**Agency-OS** gives agency founders and freelancers full ownership:
1. **Interactive Client Proposals:** Generates clear, structured scope items, deliverable timelines, and budget breakdown without PDF back-and-forth.
2. **Zero-Login Client Kanban Portal:** Clients receive a live web link to monitor real-time milestone progress.
3. **18% Consulting GST Invoicing:** Compliant Indian tax invoicing with automated CGST/SGST or IGST calculations.
4. **Direct Bank UPI Settlement:** Instant settlement directly to `6393741171@upi` with zero platform fees.

---

## ⚡ Quickstart

### Instant CLI Execution (`npx`)

```bash
# Check agency system status
npx agency-os status

# Create a client proposal
npx agency-os proposal "Acme Corp" "Fullstack AI Platform" 200000

# Generate milestone invoice & direct UPI payload
npx agency-os invoice PROP-101 "Backend API Architecture" 75000
```

### Local Setup & Testing

```bash
git clone https://github.com/1nsharma-labs/agency-os.git
cd agency-os

# Run automated tests
npm test

# Launch Model Context Protocol (MCP) server
npm run mcp
```

---

## 🔌 Model Context Protocol (MCP) Integration

Connect Agency-OS to Cursor, Claude Desktop, or Antigravity:

```json
{
  "mcpServers": {
    "agency-os": {
      "command": "node",
      "args": ["/path/to/agency-os/core/src/mcp/server.js"]
    }
  }
}
```

Exposed MCP Tools:
- `agency_create_proposal`: Build structured client proposals with scope and budget.
- `agency_get_milestones`: Track milestone deliverable completion.
- `agency_generate_invoice`: Generate compliant 18% GST invoices and UPI payment links.

---

## 💼 Sponsorship, Support & Founder

Built by **Amit Sharma (@1nsharma)** from **Kanpur, India**.

- **Personal Email:** [tech@mowglai.com](mailto:tech@mowglai.com)
- **Direct UPI & Bank Transfer:** `6393741171@upi` &bull; PhonePe / Google Pay / Paytm: `6393741171`
- **Global Sponsorship:** [polar.sh/1nsharma-labs](https://polar.sh/1nsharma-labs) &bull; [GitHub Sponsors](https://github.com/sponsors/1nsharma)
- **Organization:** [github.com/1nsharma-labs](https://github.com/1nsharma-labs)

---

## 📄 License

Open-source under the [MIT License](LICENSE).
