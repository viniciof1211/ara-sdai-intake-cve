import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const provisionSchema = z.object({
  intakeId: z.string(),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { intakeId } = provisionSchema.parse(body);

    const intake = await prisma.intake.findUnique({
      where: { id: intakeId },
    });

    if (!intake) {
      return NextResponse.json({ error: 'Intake no encontrado' }, { status: 404 });
    }

    const payload = intake.payload as any;

    if (!payload.processes_in_scope || payload.processes_in_scope.length === 0) {
      return NextResponse.json(
        { error: 'REQUIERE VALIDACIÓN: Debe especificar al menos un proceso en scope' },
        { status: 400 }
      );
    }

    if (!payload.kpis_impacted || payload.kpis_impacted.length === 0) {
      return NextResponse.json(
        { error: 'REQUIERE VALIDACIÓN: Debe especificar al menos un KPI impactado' },
        { status: 400 }
      );
    }

    await prisma.intake.update({
      where: { id: intakeId },
      data: {
        status: 'provisioning',
        lastSubmittedAt: new Date(),
      },
    });

    console.log(`[PROVISION] Intake ${intakeId} set to provisioning status`);
    console.log(`[PROVISION] TODO: Integrate with Terraform/GitHub/Neo4j`);
    console.log(`[PROVISION] Project: ${payload.client_project}`);
    console.log(`[PROVISION] Cloud: ${payload.cloud_strategy}, Tier: ${payload.compute_tier}`);

    return NextResponse.json({
      success: true,
      message: 'Provisioning stub executed',
      intakeId,
      status: 'provisioning',
    });
  } catch (error: any) {
    console.error('POST /api/provision error:', error);
    return NextResponse.json(
      { error: 'Error aprovisionando', details: error.message },
      { status: 500 }
    );
  }
}
