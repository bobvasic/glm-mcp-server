# Deployment Guide

## Prerequisites Validation

### System Requirements

```bash
# Verify Node.js version
node --version  # Must output v18.0.0 or higher

# Verify npm
npm --version   # Must output 9.0.0 or higher

# Verify build tools
which git       # Required for cloning
which curl      # Required for API testing
```

---

## Installation Steps

### 1. Project Setup

```bash
# Clone or navigate to project directory
cd glm-mcp-server

# Install dependencies
npm install

# Build TypeScript to JavaScript
npm run build

# Verify build output
ls -la build/
# Should contain: index.js, index.d.ts, glm-client.js, glm-client.d.ts
```

### 2. Environment Configuration

```bash
# Create environment file from template
cp .env.example .env

# Edit with your API key
nano .env
# or
vi .env
```

**Contents of `.env`**:
```
GLM_API_KEY=your_actual_api_key_here
```

**Obtain API Key**: https://open.bigmodel.cn

### 3. Validation

```bash
# Test server initialization
node build/index.js

# Expected output (to stderr):
# GLM-4.6 MCP Server running on stdio

# Press Ctrl+C to exit
```

---

## Warp Terminal Configuration

### Method 1: Manual Configuration

1. Open Warp Terminal
2. Navigate to: **Settings → Features → Agent Mode → MCP Servers**
3. Click **"Add Server"** or **"Edit Configuration"**
4. Paste the following JSON:

```json
{
  "mcpServers": {
    "glm-architecture": {
      "command": "node",
      "args": ["/absolute/path/to/glm-mcp-server/build/index.js"],
      "env": {
        "GLM_API_KEY": "your_glm_api_key_here"
      }
    }
  }
}
```

5. **Replace**:
   - `/absolute/path/to/glm-mcp-server` with your actual installation path
   - `your_glm_api_key_here` with your GLM API key

6. Save configuration
7. Restart Warp Terminal

### Method 2: Configuration File

**Linux/macOS**: `~/.config/warp-terminal/mcp_servers.json`

```bash
# Create configuration directory if it doesn't exist
mkdir -p ~/.config/warp-terminal

# Edit or create MCP servers configuration
nano ~/.config/warp-terminal/mcp_servers.json
```

Paste configuration from Method 1, then restart Warp.

---

## Verification

### Test MCP Server Connectivity

Open Warp Terminal and start a new Agent Mode session:

```
Ask Claude: "List available MCP tools"
```

**Expected Response**: Should include tools like `consult_architecture`, `analyze_code_architecture`, etc.

### Test GLM-4.6 Integration

```
Ask Claude: "Use the consult_architecture tool to ask: What are the trade-offs between REST and GraphQL APIs?"
```

**Expected Response**: Detailed architectural analysis from GLM-4.6

---

## Troubleshooting

### Issue: Server Not Listed in MCP Servers

**Solutions**:
1. Verify configuration file path is correct
2. Check JSON syntax (use https://jsonlint.com)
3. Restart Warp Terminal completely
4. Check Warp logs: **Settings → Advanced → View Logs**

### Issue: Authentication Error

**Error Message**: `GLM-4.6 API Error (401): Unauthorized`

**Solutions**:
1. Verify API key is correct and active
2. Check for whitespace in `.env` file
3. Ensure API key has sufficient quota at https://open.bigmodel.cn
4. Test API key directly:

```bash
curl -X POST https://open.bigmodel.cn/api/paas/v4/chat/completions \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "glm-4-6",
    "messages": [{"role": "user", "content": "test"}]
  }'
```

### Issue: Server Starts But Tools Don't Work

**Solutions**:
1. Check Node.js version: `node --version`
2. Rebuild project: `npm run build`
3. Verify environment variable is set:
   ```bash
   node -e "require('dotenv').config(); console.log(process.env.GLM_API_KEY)"
   ```
4. Check network connectivity to https://open.bigmodel.cn

### Issue: Command Not Found Error

**Error**: `sh: node: command not found`

**Solutions**:
1. Use absolute path to Node.js:
   ```bash
   which node  # Get full path, e.g., /usr/bin/node
   ```
2. Update Warp configuration with absolute path:
   ```json
   {
     "command": "/usr/bin/node",
     "args": ["/absolute/path/to/glm-mcp-server/build/index.js"]
   }
   ```

---

## Production Deployment

### Using Docker

**Dockerfile**:
```dockerfile
FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install production dependencies
RUN npm ci --production

# Copy built application
COPY build/ ./build/

# Run as non-root user
USER node

# Start server
CMD ["node", "build/index.js"]
```

**Build and Run**:
```bash
docker build -t glm-mcp-server .
docker run -e GLM_API_KEY=$GLM_API_KEY glm-mcp-server
```

### Using PM2 (Process Manager)

```bash
# Install PM2 globally
npm install -g pm2

# Create PM2 ecosystem file
cat > ecosystem.config.js << 'EOF'
module.exports = {
  apps: [{
    name: 'glm-mcp-server',
    script: 'build/index.js',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '500M',
    env: {
      NODE_ENV: 'production',
      GLM_API_KEY: process.env.GLM_API_KEY
    }
  }]
};
EOF

# Start with PM2
pm2 start ecosystem.config.js

# Configure autostart on boot
pm2 startup
pm2 save
```

### System Service (systemd)

**Create service file**: `/etc/systemd/system/glm-mcp-server.service`

```ini
[Unit]
Description=GLM-4.6 MCP Server
After=network.target

[Service]
Type=simple
User=youruser
WorkingDirectory=/absolute/path/to/glm-mcp-server
Environment="GLM_API_KEY=your_api_key_here"
ExecStart=/usr/bin/node /absolute/path/to/glm-mcp-server/build/index.js
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
```

**Enable and start**:
```bash
sudo systemctl daemon-reload
sudo systemctl enable glm-mcp-server
sudo systemctl start glm-mcp-server
sudo systemctl status glm-mcp-server
```

---

## Security Best Practices

### 1. API Key Protection

```bash
# Set restrictive permissions on .env
chmod 600 .env

# Verify
ls -la .env
# Should show: -rw------- (owner read/write only)
```

### 2. Network Security

- Use firewall rules to restrict API access
- Consider using a VPN for API communication
- Monitor API usage at https://open.bigmodel.cn

### 3. Secrets Management

**For Production**:
- Use environment variables via orchestration platform (Kubernetes Secrets, Docker Secrets)
- Consider secrets management systems (HashiCorp Vault, AWS Secrets Manager)
- Never commit `.env` to version control

---

## Monitoring

### Log Files

```bash
# Watch server logs (if using PM2)
pm2 logs glm-mcp-server

# View systemd logs
sudo journalctl -u glm-mcp-server -f

# Docker logs
docker logs -f glm-mcp-server
```

### Health Monitoring

```bash
# Create health check script
cat > health_check.sh << 'EOF'
#!/bin/bash
response=$(curl -s -w "%{http_code}" \
  -H "Authorization: Bearer $GLM_API_KEY" \
  https://open.bigmodel.cn/api/paas/v4/models \
  -o /dev/null)

if [ "$response" = "200" ]; then
  echo "✓ GLM API: Healthy"
  exit 0
else
  echo "✗ GLM API: Unhealthy (HTTP $response)"
  exit 1
fi
EOF

chmod +x health_check.sh
./health_check.sh
```

---

## Updates and Maintenance

### Updating the Server

```bash
cd /path/to/glm-mcp-server

# Pull latest changes (if using git)
git pull

# Install updated dependencies
npm install

# Rebuild
npm run build

# Restart service
# For PM2:
pm2 restart glm-mcp-server

# For systemd:
sudo systemctl restart glm-mcp-server

# For Warp (manual restart):
# Just restart Warp Terminal
```

### Backup Configuration

```bash
# Backup current configuration
mkdir -p ~/backups
cp .env ~/backups/.env.$(date +%Y%m%d)
cp ~/.config/warp-terminal/mcp_servers.json ~/backups/mcp_servers.json.$(date +%Y%m%d)
```

---

## Performance Tuning

### Node.js Optimization

```bash
# Increase memory limit if needed
node --max-old-space-size=1024 build/index.js
```

### Concurrent Instances

For high-load scenarios, run multiple instances:

```json
{
  "mcpServers": {
    "glm-architecture-1": {
      "command": "node",
      "args": ["/path/to/glm-mcp-server/build/index.js"],
      "env": { "GLM_API_KEY": "your_api_key_here" }
    },
    "glm-architecture-2": {
      "command": "node",
      "args": ["/path/to/glm-mcp-server/build/index.js"],
      "env": { "GLM_API_KEY": "your_api_key_here" }
    }
  }
}
```

---

**Deployment Guide Version**: 1.0.0  
**Maintained by**: CyberLink Security <info@cyberlinksec.com>
