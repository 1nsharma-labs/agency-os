/**
 * Agency-OS Milestone & Kanban Deliverable Engine
 */

export class MilestoneManager {
  constructor(proposalManager) {
    this.proposalManager = proposalManager;
    this.milestones = new Map();
  }

  createMilestone(proposalId, title, amount, dueDate) {
    const proposal = this.proposalManager.getProposal(proposalId);
    if (!proposal) throw new Error(`Proposal ${proposalId} not found`);

    const milestoneId = `MS-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;
    const milestone = {
      milestoneId,
      proposalId,
      title,
      amount,
      dueDate: dueDate || 'Within 14 days',
      status: 'pending', // pending -> in_progress -> review -> paid
      submittedAt: null,
      paidAt: null
    };

    if (!this.milestones.has(proposalId)) {
      this.milestones.set(proposalId, []);
    }
    this.milestones.get(proposalId).push(milestone);
    return milestone;
  }

  getMilestonesForProposal(proposalId) {
    return this.milestones.get(proposalId) || [];
  }

  updateMilestoneStatus(proposalId, milestoneId, status) {
    const list = this.getMilestonesForProposal(proposalId);
    const ms = list.find(m => m.milestoneId === milestoneId);
    if (!ms) throw new Error(`Milestone ${milestoneId} not found`);

    ms.status = status;
    if (status === 'paid') ms.paidAt = new Date().toISOString();
    return ms;
  }

  getProgress(proposalId) {
    const list = this.getMilestonesForProposal(proposalId);
    if (list.length === 0) return 0;
    const completed = list.filter(m => m.status === 'paid' || m.status === 'review').length;
    return Math.round((completed / list.length) * 100);
  }
}
