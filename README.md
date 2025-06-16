# HTTP Health Check Pro

A professional GitHub Action that performs HTTP health checks on specified URLs with advanced features like retry logic, response time monitoring, and webhook notifications. Perfect for ensuring your services are up and running before or after deployment.

## 🚀 Features

- ✅ **URL Health Checking**: Validate HTTP endpoints with status code verification
- 🔄 **Smart Retry Logic**: Configurable retry attempts with delay
- ⏱️ **Response Time Monitoring**: Fail if response time exceeds threshold
- 🔔 **Webhook Notifications**: Get notified on failures with customizable payload
- 📊 **Detailed Logging**: Comprehensive output for debugging
- 🛡️ **Timeout Control**: Prevent hanging requests
- 🔍 **Flexible Configuration**: Customize all aspects of the health check

## 📋 Usage

```yaml
name: Health Check

on:
  push:
    branches: [ main ]
  workflow_dispatch:

jobs:
  health-check:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Check API Health
        uses: ddjain/http-health-check-pro@v1
        with:
          url: 'https://api.example.com/health'
          expected_status: '200'
          retry_count: '3'
          retry_delay: '1000'
          timeout: '5000'
          response_time_threshold: '3000'
          webhook_url: 'https://hooks.slack.com/services/xxx/yyy/zzz'
          webhook_payload: '{"text": "Health check failed for ${{ inputs.url }}"}'
```

## ⚙️ Inputs

| Input | Required | Default | Description |
|-------|----------|---------|-------------|
| `url` | Yes | - | The URL to check |
| `expected_status` | Yes | - | Expected HTTP response status (e.g., 200) |
| `retry_count` | No | 3 | Number of retries before failing |
| `retry_delay` | No | 1000 | Delay between retries in milliseconds |
| `timeout` | No | 5000 | Request timeout in milliseconds |
| `response_time_threshold` | No | 3000 | Maximum acceptable response time in milliseconds |
| `webhook_url` | No | - | Webhook URL to notify on failure |
| `webhook_payload` | No | - | JSON payload for webhook notification |

## 📤 Outputs

| Output | Description |
|--------|-------------|
| `actual_status` | Actual HTTP status code returned by the server |
| `response_time` | Time in milliseconds taken to get the response |

## 🎯 Use Cases

1. **Deployment Validation**
   - Ensure your service is up and running after deployment
   - Fail the deployment if health check fails
   - Validate all required endpoints before completing deployment

2. **API Monitoring**
   - Check if public APIs are live before triggering downstream workflows
   - Monitor API response times
   - Ensure API endpoints meet performance requirements

3. **Periodic Health Checks**
   - Set up cron-based uptime monitoring
   - Get notified when services are down
   - Track service availability over time

4. **Multi-service Systems**
   - Health-check internal services
   - Ensure all components are functioning correctly
   - Validate service dependencies

## 🔧 Advanced Configuration

### Retry Logic
```yaml
with:
  retry_count: '5'  # Try 5 times before failing
  retry_delay: '2000'  # Wait 2 seconds between retries
```

### Response Time Monitoring
```yaml
with:
  response_time_threshold: '5000'  # Fail if response takes more than 5 seconds
```

### Webhook Notifications
```yaml
with:
  webhook_url: 'https://hooks.slack.com/services/xxx/yyy/zzz'
  webhook_payload: |
    {
      "text": "Health check failed!",
      "url": "${{ inputs.url }}",
      "expected_status": "${{ inputs.expected_status }}",
      "actual_status": "${{ steps.healthcheck.outputs.actual_status }}",
      "response_time": "${{ steps.healthcheck.outputs.response_time }}"
    }
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request. For major changes, please open an issue first to discuss what you would like to change.

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## ⭐ Support

If you find this action helpful, please give it a star! For issues and feature requests, please use the [GitHub Issues](https://github.com/ddjain/http-health-check-pro/issues) page.
