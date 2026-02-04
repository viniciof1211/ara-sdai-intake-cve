import { NextRequest, NextResponse } from 'next/server';
import { callGemini, hashRequest } from '@/lib/vertex-ai';
import { executiveSummaryPrompt_es } from '@/lib/prompts';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const requestSchema = z.object({
  intakeId: z.string(),
  payload: z.any(),
});

export async function POST(req: NextRequest) {
  const startTime = Date.now();

  try {
    const body = await req.json();
    const { intakeId, payload } = requestSchema.parse(body);

    const requestHash = hashRequest(payload);

    const existingLog = await prisma.actionLog.findFirst({
      where: {
        intakeId,
        actionName: 'generateExecutiveSummary',
        requestHash,
        status: 'ok',
      },
      orderBy: { createdAt: 'desc' },
    });

    if (existingLog && existingLog.responsePreview) {
      const latency = Date.now() - startTime;
      return NextResponse.json({
        result: JSON.parse(existingLog.responsePreview),
        cached: true,
        latency,
      });
    }

    const prompt = executiveSummaryPrompt_es(payload);
    const response = await callGemini(prompt, 'quality');

    const jsonMatch = response.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('Invalid JSON response from Gemini');
    }

    const result = JSON.parse(jsonMatch[0]);
    const latency = Date.now() - startTime;

    await prisma.actionLog.create({
      data: {
        intakeId,
        userEmail: 'internal@ara-group.com',
        actionName: 'generateExecutiveSummary',
        latencyMs: latency,
        status: 'ok',
        requestHash,
        responsePreview: JSON.stringify(result),
      },
    });

    return NextResponse.json({ result, cached: false, latency });
  } catch (error: any) {
    const latency = Date.now() - startTime;

    console.error('generateExecutiveSummary error:', error);

    if (error.message === 'Rate limit. Intente de nuevo.') {
      return NextResponse.json({ error: error.message }, { status: 429 });
    }

    return NextResponse.json(
      { error: 'Error procesando solicitud', details: error.message },
      { status: 500 }
    );
  }
}
