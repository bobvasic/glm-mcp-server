import axios, { AxiosInstance } from 'axios';

interface GLMMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

interface GLMRequest {
  model: string;
  messages: GLMMessage[];
  temperature?: number;
  top_p?: number;
  max_tokens?: number;
  stream?: boolean;
}

interface GLMResponse {
  id: string;
  created: number;
  model: string;
  choices: Array<{
    index: number;
    message: GLMMessage;
    finish_reason: string;
  }>;
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

export class GLMClient {
  private client: AxiosInstance;
  private readonly model: string = 'glm-4-6';

  constructor(apiKey: string, baseURL: string = 'https://open.bigmodel.cn/api/paas/v4') {
    this.client = axios.create({
      baseURL,
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      timeout: 60000,
    });
  }

  async consultArchitecture(query: string, context?: string): Promise<string> {
    const systemPrompt = `You are an elite software architecture consultant specializing in enterprise-grade system design, scalability patterns, security architecture, and technical decision-making. 

Your expertise includes:
- Distributed systems architecture and microservices design
- Cloud-native patterns and containerization strategies
- Database architecture and data modeling
- API design (REST, GraphQL, gRPC)
- Security architecture and threat modeling
- Performance optimization and scalability
- DevOps and CI/CD pipeline architecture
- Modern frontend and backend frameworks
- System integration patterns

Provide concise, actionable architectural guidance with enterprise-grade best practices. Focus on technical accuracy, scalability, maintainability, and security.`;

    const messages: GLMMessage[] = [
      { role: 'system', content: systemPrompt },
    ];

    if (context) {
      messages.push({
        role: 'user',
        content: `Context:\n${context}\n\nArchitectural Query:\n${query}`,
      });
    } else {
      messages.push({ role: 'user', content: query });
    }

    const request: GLMRequest = {
      model: this.model,
      messages,
      temperature: 0.7,
      top_p: 0.9,
      max_tokens: 4096,
      stream: false,
    };

    try {
      const response = await this.client.post<GLMResponse>('/chat/completions', request);
      
      if (!response.data.choices || response.data.choices.length === 0) {
        throw new Error('GLM-4.6 returned empty response');
      }

      return response.data.choices[0].message.content;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const status = error.response?.status;
        const message = error.response?.data?.error?.message || error.message;
        throw new Error(`GLM-4.6 API Error (${status}): ${message}`);
      }
      throw error;
    }
  }

  async analyzeCodeArchitecture(code: string, language: string, question: string): Promise<string> {
    const query = `Analyze the following ${language} code from an architectural perspective:

\`\`\`${language}
${code}
\`\`\`

Architectural Question: ${question}

Provide analysis covering:
1. Architectural patterns used
2. Design principles adherence (SOLID, DRY, KISS)
3. Scalability considerations
4. Security implications
5. Recommended improvements`;

    return this.consultArchitecture(query);
  }

  async designSystemArchitecture(requirements: string): Promise<string> {
    const query = `Design a system architecture based on the following requirements:

${requirements}

Provide:
1. High-level architecture diagram description
2. Component breakdown and responsibilities
3. Data flow and communication patterns
4. Technology stack recommendations
5. Scalability and deployment strategy
6. Security architecture considerations`;

    return this.consultArchitecture(query);
  }

  async reviewTechnicalDecision(decision: string, context: string): Promise<string> {
    const query = `Review the following technical decision:

Decision: ${decision}

Context: ${context}

Provide:
1. Architectural impact assessment
2. Trade-offs analysis
3. Alternative approaches
4. Risk evaluation
5. Recommendation with justification`;

    return this.consultArchitecture(query);
  }
}
