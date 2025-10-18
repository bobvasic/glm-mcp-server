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
      timeout: 120000, // Extended for complex reasoning
    });
  }

  /**
   * Format response for Claude 4.5 Sonnet using Anthropic best practices
   * Uses XML tags for structure, clear sections, and actionable guidance
   */
  private formatForClaude(content: string, taskType: string): string {
    return `<glm_response type="${taskType}">
<analysis>
${content}
</analysis>

<implementation_guidance>
This response has been optimized for Claude 4.5 Sonnet with:
- Structured XML format for easy parsing
- Clear separation of concepts
- Actionable implementation steps
- Enterprise-grade quality standards
</implementation_guidance>
</glm_response>`;
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

  /**
   * Advanced reasoning consultation for mathematical, algorithmic, and scientific tasks
   * Uses enhanced prompting optimized for Claude 4.5 Sonnet consumption
   */
  async advancedReasoning(task: string, context: string, expectedOutcome: string): Promise<string> {
    const enhancedPrompt = `<task_specification>
You are an elite computational mathematician and algorithm architect. Your mission is to deliver world-class innovative solutions using rigorous scientific methodology.
</task_specification>

<problem_context>
${context}
</problem_context>

<primary_task>
${task}
</primary_task>

<expected_outcome>
${expectedOutcome}
</expected_outcome>

<execution_requirements>
1. MATHEMATICAL RIGOR: Apply formal mathematical proofs, complexity analysis, and theoretical foundations
2. ALGORITHMIC EXCELLENCE: Design optimal algorithms with detailed time/space complexity analysis
3. INNOVATION: Present breakthrough approaches beyond conventional solutions
4. ENTERPRISE QUALITY: Ensure production-grade implementation readiness
5. PERFORMANCE OPTIMIZATION: Focus on maximum efficiency and scalability
6. SCIENTIFIC METHOD: Use data-driven analysis with quantitative reasoning
</execution_requirements>

<response_structure>
Structure your response using XML tags for Claude 4.5 Sonnet:

<analysis>
- Problem decomposition
- Mathematical formulation
- Complexity analysis
- Constraint identification
</analysis>

<solution_design>
- Core algorithm/approach
- Innovation highlights
- Optimization strategies
- Scalability considerations
</solution_design>

<implementation_blueprint>
- Pseudocode with annotations
- Key implementation patterns
- Performance characteristics
- Edge case handling
</implementation_blueprint>

<validation_strategy>
- Correctness proofs
- Test scenarios
- Benchmark expectations
- Quality metrics
</validation_strategy>

<production_guidance>
- Integration recommendations
- Monitoring strategies
- Maintenance considerations
- Documentation requirements
</production_guidance>
</response_structure>

<quality_standards>
- Target: Top 1% industry solutions
- Approach: Research-grade rigor
- Output: Enterprise production-ready
- Innovation: Breakthrough-level thinking
</quality_standards>

Deliver a comprehensive, scientifically rigorous solution that represents the pinnacle of computational thinking and software engineering excellence.`;

    const messages: GLMMessage[] = [
      { role: 'user', content: enhancedPrompt },
    ];

    const request: GLMRequest = {
      model: this.model,
      messages,
      temperature: 0.8, // Higher for innovation
      top_p: 0.95,
      max_tokens: 8192, // Extended for comprehensive analysis
      stream: false,
    };

    try {
      const response = await this.client.post<GLMResponse>('/chat/completions', request);
      
      if (!response.data.choices || response.data.choices.length === 0) {
        throw new Error('GLM-4.6 returned empty response');
      }

      const rawContent = response.data.choices[0].message.content;
      return this.formatForClaude(rawContent, 'advanced_reasoning');
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const status = error.response?.status;
        const message = error.response?.data?.error?.message || error.message;
        throw new Error(`GLM-4.6 API Error (${status}): ${message}`);
      }
      throw error;
    }
  }
}
