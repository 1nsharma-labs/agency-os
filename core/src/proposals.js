/**
 * Agency-OS Client Proposal & Scope Builder
 */

export class ProposalManager {
  constructor() {
    this.proposals = new Map();
    this.seq = 100;
  }

  createProposal(clientName, projectTitle, scopeItems = [], options = {}) {
    if (!clientName || !projectTitle) {
      throw new Error('Client name and project title are required');
    }

    this.seq++;
    const proposalId = `PROP-${this.seq}`;
    const budget = options.budget || scopeItems.reduce((acc, s) => acc + (s.price || 0), 0);

    const proposal = {
      proposalId,
      clientName,
      clientEmail: options.clientEmail || '',
      projectTitle,
      deliverables: scopeItems.map((item, idx) => ({
        id: `DELIV-${idx + 1}`,
        title: item.title,
        estimatedDays: item.days || 3,
        price: item.price || 0,
        status: 'pending' // pending -> in_progress -> completed
      })),
      totalBudget: budget,
      currency: options.currency || 'INR',
      timelineWeeks: options.timelineWeeks || 4,
      status: 'draft', // draft -> sent -> accepted -> active -> completed
      createdAt: new Date().toISOString()
    };

    this.proposals.set(proposalId, proposal);
    return proposal;
  }

  getProposal(proposalId) {
    return this.proposals.get(proposalId) || null;
  }

  acceptProposal(proposalId) {
    const p = this.proposals.get(proposalId);
    if (!p) throw new Error(`Proposal ${proposalId} not found`);
    p.status = 'active';
    p.acceptedAt = new Date().toISOString();
    return p;
  }
}

export const defaultProposals = new ProposalManager();
