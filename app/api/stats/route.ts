import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
  try {

    const countByStatus = await prisma.intake.groupBy({
      by: ['status'],
      _count: true,
    });

    const countByBU = await prisma.intake.groupBy({
      by: ['businessUnit'],
      _count: true,
      where: {
        businessUnit: {
          not: '',
        },
      },
    });

    const recentIntakes = await prisma.intake.findMany({
      orderBy: { updatedAt: 'desc' },
      take: 10,
      select: {
        id: true,
        clientProject: true,
        businessUnit: true,
        industry: true,
        status: true,
        updatedAt: true,
      },
    });

    const total = await prisma.intake.count();

    return NextResponse.json({
      total,
      byStatus: countByStatus.map(item => ({
        status: item.status,
        count: item._count,
      })),
      byBusinessUnit: countByBU.map(item => ({
        businessUnit: item.businessUnit,
        count: item._count,
      })),
      recent: recentIntakes,
    });
  } catch (error: any) {
    console.error('GET /api/stats error:', error);
    return NextResponse.json(
      { error: 'Error obteniendo estadísticas', details: error.message },
      { status: 500 }
    );
  }
}
