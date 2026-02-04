import * as aiplatform from '@google-cloud/aiplatform';
import * as crypto from 'crypto';

const { PredictionServiceClient } = aiplatform.v1;
const { helpers } = aiplatform;

let clientInstance: any = null;

function getVertexClient() {
  if (clientInstance) return clientInstance;

  const gcpKeyJson = process.env.GCP_SA_KEY_JSON;

  if (!gcpKeyJson) {
    throw new Error('GCP_SA_KEY_JSON not configured');
  }

  let credentials;
  try {
    credentials = JSON.parse(gcpKeyJson);
  } catch (e) {
    throw new Error('Invalid GCP_SA_KEY_JSON format');
  }

  clientInstance = new PredictionServiceClient({
    apiEndpoint: `${process.env.GOOGLE_CLOUD_REGION}-aiplatform.googleapis.com`,
    credentials,
  });

  return clientInstance;
}

export async function callGemini(
  prompt: string,
  model: 'fast' | 'quality' = 'fast',
  maxRetries = 3
): Promise<string> {
  const client = getVertexClient();
  const project = process.env.GOOGLE_CLOUD_PROJECT;
  const location = process.env.GOOGLE_CLOUD_REGION;
  const modelName =
    model === 'fast'
      ? process.env.VERTEX_MODEL_FAST
      : process.env.VERTEX_MODEL_QUALITY;

  const endpoint = `projects/${project}/locations/${location}/publishers/google/models/${modelName}`;

  const instanceValue = helpers.toValue({
    contents: {
      role: 'user',
      parts: {
        text: prompt,
      },
    },
  });

  const instances = [instanceValue];
  const parameter = helpers.toValue({
    temperature: 0.2,
    maxOutputTokens: 8192,
    topP: 0.95,
  });

  const request = {
    endpoint,
    instances,
    parameters: parameter,
  };

  let lastError: any;

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      const [response] = await client.predict(request);
      const predictions = response.predictions;

      if (predictions && predictions.length > 0) {
        const prediction = predictions[0];
        const content = (prediction as any).structValue?.fields?.candidates?.listValue?.values?.[0]?.structValue?.fields?.content?.structValue?.fields?.parts?.listValue?.values?.[0]?.structValue?.fields?.text?.stringValue;

        if (content) {
          return content;
        }
      }

      throw new Error('No valid response from Gemini');
    } catch (error: any) {
      lastError = error;

      if (error.code === 8 || error.message?.includes('429') || error.message?.includes('quota')) {
        if (attempt < maxRetries - 1) {
          await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 1000));
          continue;
        }
        throw new Error('Rate limit. Intente de nuevo.');
      }

      throw error;
    }
  }

  throw lastError;
}

export function hashRequest(data: any): string {
  return crypto.createHash('sha256').update(JSON.stringify(data)).digest('hex');
}
