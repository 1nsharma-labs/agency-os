/**
 * Automated Test Suite for Agency-OS
 */

import assert from 'node:assert';
import { describe, it } from 'node:test';
import { ProposalManager } from '../core/src/proposals.js';
import { MilestoneManager } from '../core/src/milestones.js';
import { InvoiceEngine } from '../core/src/invoices.js';
import { AgencyMcpServer } from '../core/src/mcp/server.js';

describe('Agency-OS Proposal Manager', () => {
  const proposals = new ProposalManager();

  it('should create proposal with calculated deliverables', () => {
    const p = proposals.createProposal('TechCorp', 'Mobile AI App', [
      { title: 'UX Design', price: 30000, days: 4 },
      { title: 'Core Dev', price: 70000, days: 10 }
    ]);

    assert.ok(p.proposalId.startsWith('PROP-'));
    assert.strictEqual(p.totalBudget, 100000);
    assert.strictEqual(p.deliverables.length, 2);
    assert.strictEqual(p.status, 'draft');
  });

  it('should accept proposal and update status', () => {
    const p = proposals.createProposal('ClientB', 'API Gateway');
    const accepted = proposals.acceptProposal(p.proposalId);
    assert.strictEqual(accepted.status, 'active');
  });
});

describe('Agency-OS Milestone & Invoicing', () => {
  const proposals = new ProposalManager();
  const milestones = new MilestoneManager(proposals);
  const invoices = new InvoiceEngine();

  it('should create milestone and calculate progress', () => {
    const p = proposals.createProposal('ClientC', 'Security Audit');
    const m1 = milestones.createMilestone(p.proposalId, 'Phase 1 Audit', 50000);
    milestones.createMilestone(p.proposalId, 'Phase 2 Fixes', 50000);

    assert.strictEqual(milestones.getProgress(p.proposalId), 0);
    milestones.updateMilestoneStatus(p.proposalId, m1.milestoneId, 'paid');
    assert.strictEqual(milestones.getProgress(p.proposalId), 50);
  });

  it('should generate 18% GST tax invoice and UPI link', () => {
    const p = proposals.createProposal('FinTech Client', 'Payment Engine');
    const ms = { milestoneId: 'MS-TEST', title: 'Milestone 1', amount: 100000 };
    const inv = invoices.generateInvoice(p, ms);

    assert.strictEqual(inv.baseAmount, 100000);
    assert.strictEqual(inv.gstAmount, 18000); // 18% of 100k
    assert.strictEqual(inv.grandTotal, 118000);
    assert.strictEqual(inv.payeeUpi, '6393741171@upi');
    assert.ok(inv.upiDeepLink.includes('6393741171%40upi'));
    assert.ok(inv.upiDeepLink.includes('am=118000'));
  });
});

describe('Agency-OS MCP Server', () => {
  const server = new AgencyMcpServer();

  it('should register all 4 tools', () => {
    assert.strictEqual(server.getTools().length, 4);
  });

  it('should call agency_status tool', async () => {
    const res = await server.handleCallTool('agency_status', {});
    const parsed = JSON.parse(res.content[0].text);
    assert.strictEqual(parsed.product, 'Agency-OS');
    assert.strictEqual(parsed.upi, '6393741171@upi');
  });
});
