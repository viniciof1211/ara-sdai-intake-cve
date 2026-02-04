import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const updateIntakeSchema = z.object({
  payload: z.any().optional(),
  status: z.string().optional(),
});

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {

    const intake = await prisma.intake.findUnique({
      where: { id: params.id },
      include: {
        actionLogs: {
          orderBy: { createdAt: 'desc' },
          take: 20,
        },
      },
    });

    if (!intake) {
      return NextResponse.json({ error: 'Intake no encontrado' }, { status: 404 });
    }

    return NextResponse.json(intake);
  } catch (error: any) {
    console.error('GET /api/intakes/[id] error:', error);
    return NextResponse.json(
      { error: 'Error obteniendo intake', details: error.message },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await req.json();
    const { payload, status } = updateIntakeSchema.parse(body);

    const updateData: any = {};
    if (payload) {
      updateData.payload = payload;
      updateData.clientProject = payload.client_project || '';
      updateData.industry = payload.industry || '';
      updateData.businessUnit = payload.business_unit || '';
      updateData.sponsorExec = payload.sponsor_exec || '';
      updateData.techContact = payload.tech_contact || '';
    }
    if (status) {
      updateData.status = status;
    }

    const intake = await prisma.intake.update({
      where: { id: params.id },
      data: updateData,
    });

    return NextResponse.json(intake);
  } catch (error: any) {
    console.error('PUT /api/intakes/[id] error:', error);
    return NextResponse.json(
      { error: 'Error actualizando intake', details: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.intake.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('DELETE /api/intakes/[id] error:', error);
    return NextResponse.json(
      { error: 'Error eliminando intake', details: error.message },
      { status: 500 }
    );
  }
}
