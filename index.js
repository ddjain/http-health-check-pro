const core = require('@actions/core');
const axios = require('axios');

async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function sendWebhookNotification(webhookUrl, payload) {
  try {
    await axios.post(webhookUrl, payload);
    core.info('Webhook notification sent successfully');
  } catch (error) {
    core.warning(`Failed to send webhook notification: ${error.message}`);
  }
}

async function healthCheck() {
  try {
    // Get inputs
    const url = core.getInput('url');
    const expectedStatus = parseInt(core.getInput('expected_status'));
    const retryCount = parseInt(core.getInput('retry_count'));
    const retryDelay = parseInt(core.getInput('retry_delay'));
    const timeout = parseInt(core.getInput('timeout'));
    const responseTimeThreshold = parseInt(core.getInput('response_time_threshold'));
    const webhookUrl = core.getInput('webhook_url');
    const webhookPayload = core.getInput('webhook_payload');

    let lastError = null;
    let attempts = 0;

    while (attempts <= retryCount) {
      try {
        const startTime = Date.now();
        const response = await axios.get(url, {
          timeout: timeout,
          validateStatus: () => true // Accept any status code
        });
        const responseTime = Date.now() - startTime;

        // Set outputs
        core.setOutput('actual_status', response.status);
        core.setOutput('response_time', responseTime);

        // Check response time
        if (responseTime > responseTimeThreshold) {
          throw new Error(`Response time ${responseTime}ms exceeded threshold of ${responseTimeThreshold}ms`);
        }

        // Check status code
        if (response.status === expectedStatus) {
          core.info(`✅ Health check passed! Status: ${response.status}, Response time: ${responseTime}ms`);
          return;
        } else {
          throw new Error(`Expected status ${expectedStatus} but got ${response.status}`);
        }
      } catch (error) {
        lastError = error;
        attempts++;
        
        if (attempts <= retryCount) {
          core.info(`Attempt ${attempts}/${retryCount} failed: ${error.message}`);
          core.info(`Retrying in ${retryDelay}ms...`);
          await sleep(retryDelay);
        }
      }
    }

    // If we get here, all retries failed
    const errorMessage = `Health check failed after ${retryCount} retries. Last error: ${lastError.message}`;
    core.setFailed(errorMessage);

    // Send webhook notification if configured
    if (webhookUrl) {
      const payload = JSON.parse(webhookPayload.replace(/\${{.*?}}/g, (match) => {
        const key = match.match(/\${{.*?\.(.*?)}}/)[1];
        return core.getInput(key);
      }));
      await sendWebhookNotification(webhookUrl, payload);
    }

  } catch (error) {
    core.setFailed(`Action failed: ${error.message}`);
  }
}

healthCheck(); 