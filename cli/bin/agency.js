#!/usr/bin/env node

/**
 * Agency-OS CLI
 * 
 * Usage:
 *   npx agency-os status
 *   npx agency-os proposal "Acme Corp" "Fullstack AI Platform" 150000
 *   npx agency-os milestone PROP-101 "Backend API & Database" 75000
 *   npx agency-os invoice PROP-101 "Milestone 1" 75000
 *   npx agency-os mcp
 */

import { ProposalManager } from '../../core/src/proposals.js';
import { MilestoneManager } from '../../core/src/milestones.js';
import { InvoiceEngine } from '../../core/src/invoices.js';
import { startMcpServer } from '../../core/src/mcp/server.js';

const args = process.argv.slice(2);
const command = args[0] || 'help';

async function main() {
  const proposals = new ProposalManager();
  const milestones = new MilestoneManager(proposals);
  const invoices = new InvoiceEngine();

  switch (command) {
    case 'status': {
      printBanner();
      console.log('🏢 Agency-OS Architecture:');
      console.log('   ├── Client Onboarding & Proposal Engine');
      console.log('   ├── Milestone Kanban Deliverable Tracking');
      console.log('   ├── 18% Consulting GST Invoicing');
      console.log('   └── Direct UPI Instant Settlement (6393741171@upi)\n');
      console.log('💼 Founder: Amit Sharma (@1nsharma) — Kanpur, India');
      console.log('📧 Contact: amitsharma9976@gmail.com');
      console.log('💳 Direct UPI / Bank: 6393741171@upi (6393741171)\n');
      break;
    }

    case 'proposal': {
      const client = args[1] || 'Nexus AI Corp';
      const title = args[2] || 'Enterprise AI Agent Architecture';
      const budget = Number(args[3]) || 200000;

      const p = proposals.createProposal(client, title, [
        { title: 'Architecture Blueprint & Tech Stack Selection', price: 50000, days: 5 },
        { title: 'Core Node & Python Multi-Agent Engine', price: 100000, days: 14 },
        { title: 'Production Security Hardening & CI/CD', price: 50000, days: 7 }
      ], { budget });

      console.log('\n📄 New Client Proposal Created:');
      console.log(`   Proposal ID  : \x1b[32m${p.proposalId}\x1b[0m`);
      console.log(`   Client       : ${p.clientName}`);
      console.log(`   Project      : ${p.projectTitle}`);
      console.log(`   Total Budget : \x1b[33m₹${p.totalBudget.toLocaleString()} INR\x1b[0m`);
      console.log(`   Timeline     : ${p.timelineWeeks} Weeks`);
      console.log('   Deliverables :');
      for (const d of p.deliverables) {
        console.log(`     • [${d.id}] ${d.title} (~${d.estimatedDays} days) - ₹${d.price.toLocaleString()}`);
      }
      console.log('\nShareable Client Portal Link: https://1nsharma-labs.github.io/agency-os/\n');
      break;
    }

    case 'invoice': {
      const p = proposals.createProposal('FinTech Corp', 'UPI Settlement Gateway', [], { budget: 100000 });
      const ms = { milestoneId: 'MS-101', title: args[2] || 'Phase 1 - Production Gateway Deployment', amount: Number(args[3]) || 50000 };
      const inv = invoices.generateInvoice(p, ms);

      console.log('\n🧾 Agency Tax Invoice & UPI Payment Link:');
      console.log('----------------------------------------------------------------------');
      console.log(`Invoice ID   : ${inv.invoiceId}`);
      console.log(`Client       : ${inv.clientName} (${inv.projectTitle})`);
      console.log(`Milestone    : ${inv.milestoneTitle}`);
      console.log(`Base Fee     : ₹${inv.baseAmount.toLocaleString()}`);
      console.log(`GST (18%)    : ₹${inv.gstAmount.toLocaleString()}`);
      console.log(`Grand Total  : \x1b[32m₹${inv.grandTotal.toLocaleString()} INR\x1b[0m`);
      console.log(`Payee UPI    : \x1b[36m${inv.payeeUpi}\x1b[0m`);
      console.log(`UPI Deep Link: ${inv.upiDeepLink}`);
      console.log('----------------------------------------------------------------------\n');
      break;
    }

    case 'mcp': {
      startMcpServer();
      break;
    }

    case 'help':
    default: {
      printBanner();
      console.log('Usage:');
      console.log('  agency-os status                                Inspect system');
      console.log('  agency-os proposal <client> <title> [budget]     Create client proposal');
      console.log('  agency-os invoice <propId> <milestone> <amount> Generate tax invoice & UPI payload');
      console.log('  agency-os mcp                                   Start MCP stdio server');
      console.log('\nLive Web App:');
      console.log('  https://1nsharma-labs.github.io/agency-os/\n');
      break;
    }
  }
}

function printBanner() {
  console.log(`
\x1b[36m   █████╗  ██████╗ ███████╗███╗   ██╗ ██████╗██╗   ██╗       ██████╗ ███████╗
  ██╔══██╗██╔════╝ ██╔════╝████╗  ██║██╔════╝╚██╗ ██╔╝      ██╔═══██╗██╔════╝
  ███████║██║  ███╗█████╗  ██╔██╗ ██║██║      ╚████╔╝       ██║   ██║███████╗
  ██╔══██║██║   ██║██╔══╝  ██║╚██╗██║██║       ╚██╔╝        ██║   ██║╚════██║
  ██║  ██║╚██████╔╝███████╗██║ ╚████║╚██████╗   ██║         ╚██████╔╝███████║
  ╚═╝  ╚═╝ ╚═════╝ ╚══════╝╚═╝  ╚═══╝ ╚═════╝   ╚═╝          ╚═════╝ ╚══════╝\x1b[0m
  The Open-Source Agency, Dev Shop & Freelancer Operating System
  by 1nsharma-labs | Amit Sharma (Kanpur, India)
  `);
}

main().catch(err => {
  console.error('\nFatal Error:', err);
  process.exit(1);
});
