/**
 * Agency-OS Milestone Invoicing & Payment Engine
 */

export class InvoiceEngine {
  constructor(options = {}) {
    this.gstRate = options.gstRate || 0.18; // 18% IT/Consulting Services GST in India
    this.payeeUpi = options.payeeUpi || '6393741171@upi';
    this.payeeName = options.payeeName || 'Amit Sharma';
  }

  generateInvoice(proposal, milestone, options = {}) {
    if (!proposal || !milestone) throw new Error('Proposal and milestone are required');

    const baseAmount = milestone.amount || 0;
    const isGstApplicable = options.includeGst !== false;
    const gstAmount = isGstApplicable ? Math.round(baseAmount * this.gstRate) : 0;
    const grandTotal = baseAmount + gstAmount;

    const upiString = `upi://pay?pa=${encodeURIComponent(this.payeeUpi)}&pn=${encodeURIComponent(this.payeeName)}&am=${grandTotal}&tn=${encodeURIComponent('Invoice for ' + milestone.title)}&cu=INR`;

    return {
      invoiceId: `AGY-INV-${Date.now().toString().slice(-6)}`,
      proposalId: proposal.proposalId,
      milestoneId: milestone.milestoneId,
      clientName: proposal.clientName,
      projectTitle: proposal.projectTitle,
      milestoneTitle: milestone.title,
      baseAmount,
      gstRate: isGstApplicable ? 0.18 : 0,
      gstAmount,
      grandTotal,
      currency: proposal.currency || 'INR',
      payeeUpi: this.payeeUpi,
      upiDeepLink: upiString,
      status: 'unpaid',
      issuedAt: new Date().toISOString()
    };
  }
}

export const defaultInvoices = new InvoiceEngine();
