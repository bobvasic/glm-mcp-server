# GLM-4.6 Consultation Workflow for Claude 4.5 Sonnet

## Overview

This document defines the enhanced workflow logic for when Claude 4.5 Sonnet should consult GLM-4.6 for premium-quality, innovative solutions.

---

## Automatic Consultation Triggers

GLM-4.6 will **always** be consulted for:

### 1. **Advanced Mathematical Analysis**
- Complex mathematical proofs
- Abstract mathematical research
- Computational mathematics
- Optimization problems
- Statistical modeling
- Numerical analysis
- Mathematical algorithm design

### 2. **Algorithm Development**
- Custom tailored innovative algorithms
- Performance-critical algorithm design
- Advanced data structures
- Computational complexity analysis
- Algorithm optimization
- Novel algorithmic approaches
- Distributed algorithm design

### 3. **Scientific Computing**
- Scientific research methodologies
- Data-driven analysis
- Computational simulations
- Research-grade solutions
- Quantitative reasoning
- Scientific problem-solving

### 4. **Enterprise-Grade Code Optimization**
- Maximum performance code
- Industry-grade optimization
- Scalability engineering
- High-performance computing
- Production-grade refactoring
- Performance bottleneck resolution

### 5. **Innovative Solution Design**
- Breakthrough technical approaches
- Novel problem-solving strategies
- Groundbreaking system architectures
- Cutting-edge implementations
- Research-to-production transitions

---

## Consultation Protocol

### Phase 1: Problem Analysis (Claude)
Claude receives the user's request and:
1. Identifies if task requires GLM-4.6 consultation
2. Extracts key requirements and constraints
3. Prepares comprehensive context package

### Phase 2: GLM Consultation (via MCP)
Claude invokes `advanced_reasoning` MCP tool with:

```typescript
{
  task: "Specific technical challenge requiring world-class solution",
  context: `
    <problem_domain>Domain and technical context</problem_domain>
    <constraints>Technical and business constraints</constraints>
    <requirements>Functional and non-functional requirements</requirements>
    <current_approach>Existing approach if any</current_approach>
    <performance_requirements>Performance targets and metrics</performance_requirements>
    <business_logic>Business objectives and expected value</business_logic>
  `,
  expected_outcome: `
    <solution_characteristics>What makes an ideal solution</solution_characteristics>
    <performance_targets>Quantitative performance goals</performance_targets>
    <quality_metrics>Success criteria and benchmarks</quality_metrics>
    <innovation_requirements>Level of innovation expected</innovation_requirements>
  `
}
```

### Phase 3: GLM Processing
GLM-4.6 receives enhanced prompt with:
- **Task Specification**: Clear mission statement
- **Problem Context**: Comprehensive problem background
- **Execution Requirements**: Mathematical rigor, algorithmic excellence, innovation, quality
- **Response Structure**: XML-tagged sections optimized for Claude
- **Quality Standards**: Top 1% industry solutions, research-grade rigor

### Phase 4: Response Formatting
GLM-4.6 returns structured XML response:

```xml
<glm_response type="advanced_reasoning">
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
</glm_response>
```

### Phase 5: Implementation (Claude)
Claude receives GLM's structured response and:
1. Parses XML-structured guidance
2. Implements the solution with enterprise standards
3. Applies additional optimizations
4. Ensures code quality and documentation
5. Validates against requirements

---

## Response Optimization for Claude

All GLM-4.6 responses follow **Anthropic Claude 4 Best Practices**:

### XML Structure Usage
- Clear tag hierarchy for parsing
- Semantic tag names
- Nested structure for complex content
- Consistent formatting

### Clarity & Precision
- Direct, actionable guidance
- No ambiguous language
- Specific implementation steps
- Quantitative metrics where possible

### Example-Driven
- Concrete pseudocode
- Implementation patterns
- Edge case demonstrations
- Performance benchmarks

### Production-Ready
- Enterprise-grade quality
- Security considerations
- Scalability built-in
- Maintenance guidance

---

## Quality Standards

Every GLM-4.6 consultation delivers:

✅ **Mathematical Rigor**: Formal proofs and complexity analysis  
✅ **Algorithmic Excellence**: Optimal time/space complexity  
✅ **Innovation**: Breakthrough approaches beyond conventional  
✅ **Enterprise Quality**: Production-ready implementations  
✅ **Performance**: Maximum efficiency and scalability  
✅ **Scientific Method**: Data-driven, research-backed solutions  

---

## Example Use Cases

### Use Case 1: Algorithm Optimization
```
User Request: "Optimize this sorting algorithm for 100M records"

Claude → GLM via advanced_reasoning:
- Task: Design optimal sorting approach for massive dataset
- Context: Current O(n log n) approach, memory constraints, distributed system
- Expected: Sub-linear improvements, parallel processing, production-grade

GLM Response:
- Mathematical analysis of complexity
- Hybrid radix-quicksort algorithm
- Cache-aware optimizations
- Distributed processing strategy
- Benchmark projections

Claude → Implementation:
- Writes optimized code
- Adds monitoring
- Creates comprehensive tests
```

### Use Case 2: Novel Data Structure
```
User Request: "Create a data structure for real-time geospatial queries"

Claude → GLM via advanced_reasoning:
- Task: Design innovative geospatial index
- Context: Billions of points, sub-100ms query latency, write-heavy workload
- Expected: Novel approach, better than R-tree, scalable

GLM Response:
- Hybrid quad-tree + bloom filter design
- Mathematical proof of query bounds
- Memory optimization strategies
- Concurrent access patterns

Claude → Implementation:
- Implements data structure
- Performance tests
- Production integration guide
```

### Use Case 3: Scientific Algorithm
```
User Request: "Implement Monte Carlo simulation for financial modeling"

Claude → GLM via advanced_reasoning:
- Task: High-accuracy Monte Carlo with variance reduction
- Context: Options pricing, millions of paths, accuracy requirements
- Expected: Research-grade quality, GPU-accelerated

GLM Response:
- Advanced variance reduction techniques
- Quasi-random number integration
- GPU parallelization strategy
- Statistical validation methods

Claude → Implementation:
- Production code with CUDA
- Validation suite
- Performance benchmarks
```

---

## Integration with Existing Tools

| Tool | Primary Use | When to Use GLM Instead |
|------|-------------|------------------------|
| `consult_architecture` | General architecture | When mathematical modeling required |
| `analyze_code_architecture` | Code review | When algorithmic optimization needed |
| `design_system_architecture` | System design | When novel algorithms are core |
| `review_technical_decision` | Decision analysis | When computational proof needed |
| **`advanced_reasoning`** | **Math/Algo/Science** | **Always for complex reasoning** |

---

## Prompt Engineering Guidelines

When Claude invokes GLM-4.6, prompts must include:

### Essential Context
- Problem domain and background
- Technical constraints (performance, memory, latency)
- Business requirements and objectives
- Current approach and limitations
- Success criteria and metrics

### Quality Expectations
- Innovation level required (incremental vs breakthrough)
- Performance targets (quantitative)
- Quality standards (research-grade, production-grade, prototype)
- Timeline and resource constraints

### Structured Format
- Use XML tags for clarity
- Separate concerns logically
- Provide examples when applicable
- State assumptions explicitly

---

## Performance Characteristics

| Metric | Standard Consult | Advanced Reasoning |
|--------|------------------|-------------------|
| Timeout | 60s | 120s |
| Max Tokens | 4096 | 8192 |
| Temperature | 0.7 | 0.8 (more innovative) |
| Top P | 0.9 | 0.95 |
| Response Format | Text | XML-structured |

---

## Monitoring & Quality Assurance

Track these metrics:
- GLM consultation frequency
- Response quality (Claude's assessment)
- Implementation success rate
- Performance vs. expectations
- Innovation level achieved

---

## Best Practices

### For Claude (when consulting GLM):
1. ✅ Provide comprehensive context
2. ✅ State explicit expectations
3. ✅ Request structured XML responses
4. ✅ Validate GLM's mathematical reasoning
5. ✅ Enhance with additional context if needed

### For GLM (response requirements):
1. ✅ Use XML tags consistently
2. ✅ Include mathematical proofs
3. ✅ Provide complexity analysis
4. ✅ Suggest implementation patterns
5. ✅ Include validation strategies

---

## Escalation Path

If standard `advanced_reasoning` insufficient:

1. **Refine Context**: Add more domain knowledge
2. **Iterate**: Re-consult with GLM feedback
3. **Multi-Stage**: Break into sub-problems
4. **Hybrid Approach**: Combine GLM math + Claude implementation
5. **External Research**: Recommend academic papers or domain experts

---

## Version History

- **v1.0.0** - Initial workflow with advanced_reasoning tool
- Enhanced prompting with Anthropic best practices
- XML-structured responses for Claude parsing
- Extended token limits for comprehensive analysis

---

**Maintained by**: CyberLink Security  
**Contact**: info@cyberlinksec.com  
**Last Updated**: 2025-01-18
