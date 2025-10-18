#!/usr/bin/env node

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  Tool,
} from '@modelcontextprotocol/sdk/types.js';
import { GLMClient } from './glm-client.js';
import dotenv from 'dotenv';

dotenv.config();

const GLM_API_KEY = process.env.GLM_API_KEY;

if (!GLM_API_KEY) {
  console.error('ERROR: GLM_API_KEY environment variable is required');
  process.exit(1);
}

const glmClient = new GLMClient(GLM_API_KEY);

const tools: Tool[] = [
  {
    name: 'consult_architecture',
    description: 'Consult GLM-4.6 for expert software architecture guidance, system design patterns, scalability strategies, and technical decision-making. Use this for high-level architectural questions requiring deep technical expertise.',
    inputSchema: {
      type: 'object',
      properties: {
        query: {
          type: 'string',
          description: 'The architectural question or problem requiring expert consultation',
        },
        context: {
          type: 'string',
          description: 'Optional additional context about the system, requirements, or constraints',
        },
      },
      required: ['query'],
    },
  },
  {
    name: 'analyze_code_architecture',
    description: 'Analyze code from an architectural perspective using GLM-4.6. Evaluates design patterns, SOLID principles, scalability, security implications, and provides improvement recommendations.',
    inputSchema: {
      type: 'object',
      properties: {
        code: {
          type: 'string',
          description: 'The source code to analyze',
        },
        language: {
          type: 'string',
          description: 'Programming language of the code (e.g., typescript, python, go, java)',
        },
        question: {
          type: 'string',
          description: 'Specific architectural question about the code',
        },
      },
      required: ['code', 'language', 'question'],
    },
  },
  {
    name: 'design_system_architecture',
    description: 'Design a complete system architecture based on requirements using GLM-4.6. Provides component breakdown, data flow patterns, technology recommendations, and deployment strategies.',
    inputSchema: {
      type: 'object',
      properties: {
        requirements: {
          type: 'string',
          description: 'Detailed system requirements, constraints, and objectives',
        },
      },
      required: ['requirements'],
    },
  },
  {
    name: 'review_technical_decision',
    description: 'Review and evaluate a technical decision using GLM-4.6 architectural expertise. Assesses impact, trade-offs, alternatives, risks, and provides recommendations.',
    inputSchema: {
      type: 'object',
      properties: {
        decision: {
          type: 'string',
          description: 'The technical decision to review',
        },
        context: {
          type: 'string',
          description: 'Context including current architecture, constraints, and objectives',
        },
      },
      required: ['decision', 'context'],
    },
  },
];

const server = new Server(
  {
    name: '@cyberlinksec/glm-mcp-server',
    version: '1.0.0',
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

server.setRequestHandler(ListToolsRequestSchema, async () => {
  return { tools };
});

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    switch (name) {
      case 'consult_architecture': {
        const { query, context } = args as { query: string; context?: string };
        const response = await glmClient.consultArchitecture(query, context);
        return {
          content: [
            {
              type: 'text',
              text: response,
            },
          ],
        };
      }

      case 'analyze_code_architecture': {
        const { code, language, question } = args as {
          code: string;
          language: string;
          question: string;
        };
        const response = await glmClient.analyzeCodeArchitecture(code, language, question);
        return {
          content: [
            {
              type: 'text',
              text: response,
            },
          ],
        };
      }

      case 'design_system_architecture': {
        const { requirements } = args as { requirements: string };
        const response = await glmClient.designSystemArchitecture(requirements);
        return {
          content: [
            {
              type: 'text',
              text: response,
            },
          ],
        };
      }

      case 'review_technical_decision': {
        const { decision, context } = args as { decision: string; context: string };
        const response = await glmClient.reviewTechnicalDecision(decision, context);
        return {
          content: [
            {
              type: 'text',
              text: response,
            },
          ],
        };
      }

      default:
        throw new Error(`Unknown tool: ${name}`);
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return {
      content: [
        {
          type: 'text',
          text: `Error: ${errorMessage}`,
        },
      ],
      isError: true,
    };
  }
});

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error('GLM-4.6 MCP Server running on stdio');
}

main().catch((error) => {
  console.error('Fatal error in main():', error);
  process.exit(1);
});
