import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';
import { emptyIntakePayload } from '@/lib/types/intake';

const createIntakeSchema = z.object({
  clientProject: z.string().min(1),
  payload: z.any().optional(),
});

export async function GET(req: NextRequest) {
  try {

    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');
    const search = searchParams.get('search');

    const where: any = {};
    if (status && status !== 'all') {
      where.status = status;
    }
    if (search) {
      where.OR = [
        { clientProject: { contains: search, mode: 'insensitive' } },
        { industry: { contains: search, mode: 'insensitive' } },
        { businessUnit: { contains: search, mode: 'insensitive' } },
      ];
    }

    const intakes = await prisma.intake.findMany({
      where,
      orderBy: { updatedAt: 'desc' },
      select: {
        id: true,
        clientProject: true,
        industry: true,
        businessUnit: true,
        status: true,
        createdAt: true,
        updatedAt: true,
        createdByEmail: true,
        lastSubmittedAt: true,
      },
    });

    return NextResponse.json(intakes);
  } catch (error: any) {
    console.error('GET /api/intakes error:', error);
    return NextResponse.json(
      { error: 'Error obteniendo intakes', details: error.message },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { clientProject, payload } = createIntakeSchema.parse(body);

    const intakePayload = payload || {
      ...emptyIntakePayload,
      client_project: clientProject,
    };

    const intake = await prisma.intake.create({
      data: {
        clientProject,
        industry: intakePayload.industry || '',
        businessUnit: intakePayload.business_unit || '',
        sponsorExec: intakePayload.sponsor_exec || '',
        techContact: intakePayload.tech_contact || '',
        status: 'draft',
        tags: [],
        payload: intakePayload,
        createdByEmail: 'internal@ara-group.com',
      },
    });

    return NextResponse.json(intake, { status: 201 });
  } catch (error: any) {
    console.error('POST /api/intakes error:', error);
    return NextResponse.json(
      { error: 'Error creando intake', details: error.message },
      { status: 500 }
    );
  }
}
