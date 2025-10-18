# System Architecture Documentation

## Overview

The GLM-4.6 MCP Server implements a three-tier architecture enabling seamless integration between Claude 4.5 Sonnet (via Warp Terminal) and the GLM-4.6 language model through the Model Context Protocol.

---

## Architecture Layers

### 1. Protocol Layer (MCP Interface)

**Responsibility**: Handles MCP protocol communication via stdio transport

**Components**:
- `Server`: MCP SDK server instance managing protocol handshake and message routing
- `StdioServerTransport`: Bidirectional stdio communication channel
- Request Handlers: Schema-validated request processors for `ListTools` and `CallTool`

**Data Flow**:
```
Warp Terminal (Claude) → stdin → MCP Server → Request Router → Tool Handler
                         stdout ← Response ← Tool Handler ←
```

### 2. Application Layer (Business Logic)

**Responsibility**: Tool orchestration, input validation, and response formatting

**Components**:
- **Tool Registry**: Declarative tool definitions with JSON schemas
- **Tool Router**: Dispatches requests to appropriate handlers
- **Error Handler**: Centralized exception handling with sanitized error messages

**Tools Implemented**:
1. `consult_architecture`: General architectural consultation
2. `analyze_code_architecture`: Code analysis with architectural focus
3. `design_system_architecture`: Complete system design from requirements
4. `review_technical_decision`: Technical decision evaluation

### 3. Integration Layer (GLM-4.6 Client)

**Responsibility**: API communication, authentication, error handling, retry logic

**Components**:
- `GLMClient`: Axios-based HTTP client with authentication middleware
- Request Builder: Constructs API-compliant request payloads
- Response Parser: Extracts relevant data from GLM API responses
- Error Handler: Maps API errors to user-friendly messages

**API Specifications**:
- **Endpoint**: `https://open.bigmodel.cn/api/paas/v4/chat/completions`
- **Authentication**: Bearer token (API key)
- **Model**: `glm-4-6`
- **Parameters**: temperature (0.7), top_p (0.9), max_tokens (4096)

---

## Communication Patterns

### Request Flow

```
┌──────────────┐
│ Claude Agent │
└──────┬───────┘
       │ MCP Request (JSON-RPC)
       ▼
┌─────────────────────┐
│  MCP Server         │
│  ┌───────────────┐  │
│  │ Request       │  │
│  │ Validator     │  │
│  └───────┬───────┘  │
│          ▼          │
│  ┌───────────────┐  │
│  │ Tool Router   │  │
│  └───────┬───────┘  │
│          ▼          │
│  ┌───────────────┐  │
│  │ GLM Client    │  │
│  └───────┬───────┘  │
└──────────┼──────────┘
           │ HTTPS POST
           ▼
    ┌──────────────┐
    │ GLM-4.6 API  │
    └──────┬───────┘
           │ JSON Response
           ▼
    [Response Path Reverses]
```

### Error Handling Strategy

**Layered Error Handling**:
1. **Network Errors**: Axios interceptors catch connection failures
2. **API Errors**: HTTP status codes mapped to descriptive messages
3. **Validation Errors**: JSON schema validation failures
4. **Business Logic Errors**: Application-level exception handling

**Error Response Format**:
```typescript
{
  content: [{ type: 'text', text: 'Error: <sanitized_message>' }],
  isError: true
}
```

---

## Security Architecture

### API Key Management

- **Storage**: Environment variable (`GLM_API_KEY`)
- **Access**: Loaded once at server initialization
- **Transport**: HTTPS with Bearer token authentication
- **Never Logged**: API keys excluded from all logging output

### Input Validation

- **Schema Validation**: All tool inputs validated against JSON schemas
- **Sanitization**: User input sanitized before API transmission
- **Length Limits**: Enforced to prevent DoS via oversized requests

### Transport Security

- **Protocol**: TLS 1.2+ for all API communications
- **Headers**: Content-Type, Authorization headers properly set
- **Timeout**: 60s timeout prevents hanging connections

---

## Scalability Considerations

### Current Architecture

- **Concurrency**: Single-threaded, sequential request processing
- **State**: Stateless design enables horizontal scaling
- **Resource Usage**: Memory footprint ~50MB per instance

### Scaling Strategies

**Horizontal Scaling**:
- Deploy multiple server instances behind load balancer
- Each Warp Terminal instance connects to dedicated server
- No shared state requirements

**Performance Optimization**:
- Implement request caching for repeated queries
- Connection pooling for API client
- Batch processing for multiple tool calls

---

## Deployment Architecture

### Development Environment

```
Developer Machine
├── Warp Terminal (MCP Client)
├── GLM MCP Server (Node.js process)
└── .env (API credentials)
```

### Production Considerations

**Containerization**:
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --production
COPY build/ ./build/
CMD ["node", "build/index.js"]
```

**Orchestration**:
- Kubernetes: StatefulSet for persistent connections
- Docker Compose: Multi-instance deployment
- Process Managers: PM2 for auto-restart and monitoring

---

## Technology Stack

| Component | Technology | Version | Purpose |
|-----------|-----------|---------|---------|
| Runtime | Node.js | ≥18.0.0 | JavaScript execution |
| Language | TypeScript | 5.7 | Type-safe development |
| Protocol | MCP SDK | 1.0.4 | Model Context Protocol |
| HTTP Client | Axios | 1.7.9 | API communication |
| Config | dotenv | 16.4.7 | Environment management |

---

## Monitoring & Observability

### Logging Strategy

- **stderr**: Operational logs (server start, errors)
- **Application Logs**: Tool invocations, API calls
- **Error Logs**: Full stack traces with sanitized data

### Metrics to Monitor

- Request latency (p50, p95, p99)
- API error rates
- Token usage
- Concurrent connections
- Memory/CPU utilization

### Health Checks

```bash
# Server responsiveness
echo '{"jsonrpc":"2.0","method":"tools/list","id":1}' | node build/index.js

# API connectivity
curl -H "Authorization: Bearer $GLM_API_KEY" \
  https://open.bigmodel.cn/api/paas/v4/models
```

---

## Future Architecture Enhancements

1. **Caching Layer**: Redis-based response caching for repeated queries
2. **Rate Limiting**: Token bucket algorithm for API quota management
3. **Circuit Breaker**: Prevent cascade failures during API outages
4. **Streaming Support**: Real-time response streaming for long outputs
5. **Multi-Model Support**: Extend to GLM-4-Plus, GLM-4-Air variants

---

**Architecture Version**: 1.0.0  
**Last Updated**: 2025-01-18  
**Maintained by**: CyberLink Security <info@cyberlinksec.com>
