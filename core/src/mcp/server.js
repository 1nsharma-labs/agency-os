/**
 * Agency-OS Model Context Protocol (MCP) Server
 */

import readline from 'readline';
import { ProposalManager } from '../proposals.js';
import { MilestoneManager } from '../milestones.js';
import { InvoiceEngine } from '../invoices.js';

export class AgencyMcpServer {
  constructor() {
    this.proposals = new ProposalManager();
    this.milestones = new MilestoneManager(this.proposals);
    this.invoices = new InvoiceEngine();
  }

  getTools() {
    return [
      {
        name: 'agency_create_proposal',
        description: 'Generate an agency or freelance client proposal with scope and milestones.',
        inputSchema: {
          type: 'object',
          properties: {
            clientName: { type: 'string' },
            projectTitle: { type: 'string' },
            budget: { type: 'number' },
            timelineWeeks: { type: 'number' },
            scopeItems: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  title: { type: 'string' },
                  price: { type: 'number' },
                  days: { type: 'number' }
                },
                required: ['title', 'price']
              }
            }
          },
          required: ['clientName', 'projectTitle']
        }
      },
      {
        name: 'agency_get_milestones',
        description: 'Retrieve milestone progress and Kanban status for a project proposal.',
        inputSchema: {
          type: 'object',
          properties: {
            proposalId: { type: 'string' }
          },
          required: ['proposalId']
        }
      },
      {
        name: 'agency_generate_invoice',
        description: 'Generate 18% GST tax invoice and direct UPI settlement payload for milestone.',
        inputSchema: {
          type: 'object',
          properties: {
            proposalId: { type: 'string' },
            milestoneTitle: { type: 'string' },
            amount: { type: 'number' }
          },
          required: ['proposalId', 'milestoneTitle', 'amount']
        }
      },
      {
        name: 'agency_status',
        description: 'Inspect Agency-OS version, capabilities, and founder contact.',
        inputSchema: { type: 'object', properties: {} }
      }
    ];
  }

  async handleCallTool(name, args) {
    switch (name) {
      case 'agency_create_proposal': {
        const p = this.proposals.createProposal(args.clientName, args.projectTitle, args.scopeItems || [], {
          budget: args.budget,
          timelineWeeks: args.timelineWeeks
        });
        return { content: [{ type: 'text', text: JSON.stringify(p, null, 2) }] };
      }
      case 'agency_get_milestones': {
        const list = this.milestones.getMilestonesForProposal(args.proposalId);
        const progress = this.milestones.getProgress(args.proposalId);
        return { content: [{ type: 'text', text: JSON.stringify({ proposalId: args.proposalId, progress, milestones: list }, null, 2) }] };
      }
      case 'agency_generate_invoice': {
        const p = this.proposals.getProposal(args.proposalId) || {
          proposalId: args.proposalId,
          clientName: 'Client',
          projectTitle: 'Consulting Project'
        };
        const ms = { milestoneId: 'MS-LIVE', title: args.milestoneTitle, amount: args.amount };
        const inv = this.invoices.generateInvoice(p, ms);
        return { content: [{ type: 'text', text: JSON.stringify(inv, null, 2) }] };
      }
      case 'agency_status': {
        return {
          content: [{
            type: 'text',
            text: JSON.stringify({
              product: 'Agency-OS',
              version: '1.0.0',
              architecture: 'The Open-Source Agency & Freelance Business Engine',
              founder: 'Amit Sharma (@1nsharma) — Kanpur, India',
              contact: 'amitsharma9976@gmail.com',
              upi: '6393741171@upi'
            }, null, 2)
          }]
        };
      }
      default:
        throw new Error(`Unknown tool: ${name}`);
    }
  }

  startStdio() {
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout, terminal: false });
    rl.on('line', async (line) => {
      if (!line.trim()) return;
      try {
        const req = JSON.parse(line);
        const res = await this.handleRpc(req);
        if (res) process.stdout.write(JSON.stringify(res) + '\n');
      } catch (err) {
        process.stdout.write(JSON.stringify({ jsonrpc: '2.0', id: null, error: { code: -32603, message: err.message } }) + '\n');
      }
    });
  }

  async handleRpc(req) {
    const { id, method, params } = req;
    if (method === 'initialize') {
      return {
        jsonrpc: '2.0',
        id,
        result: {
          protocolVersion: '2024-11-05',
          serverInfo: { name: 'agency-os-mcp', version: '1.0.0' },
          capabilities: { tools: {} }
        }
      };
    }
    if (method === 'tools/list') {
      return { jsonrpc: '2.0', id, result: { tools: this.getTools() } };
    }
    if (method === 'tools/call') {
      try {
        const res = await this.handleCallTool(params.name, params.arguments || {});
        return { jsonrpc: '2.0', id, result: res };
      } catch (err) {
        return { jsonrpc: '2.0', id, error: { code: -32000, message: err.message } };
      }
    }
    return null;
  }
}

export function startMcpServer() {
  const server = new AgencyMcpServer();
  server.startStdio();
}

if (process.argv[1] && process.argv[1].endsWith('server.js')) {
  startMcpServer();
}
