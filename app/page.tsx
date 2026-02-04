'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Navbar } from '@/components/Navbar';
import {
  FileText,
  TrendingUp,
  Clock,
  CheckCircle2,
  AlertCircle,
  Plus,
} from 'lucide-react';

interface Stats {
  total: number;
  byStatus: { status: string; count: number }[];
  byBusinessUnit: { businessUnit: string; count: number }[];
  recent: any[];
}

export default function Dashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/stats')
      .then(res => res.json())
      .then(data => {
        setStats(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error loading stats:', err);
        setLoading(false);
      });
  }, []);

  const getStatusBadge = (status: string) => {
    const variants: Record<string, string> = {
      draft: 'bg-gray-100 text-gray-800',
      submitted: 'bg-blue-100 text-blue-800',
      provisioning: 'bg-yellow-100 text-yellow-800',
      active: 'bg-green-100 text-green-800',
      archived: 'bg-gray-200 text-gray-600',
    };
    return variants[status] || 'bg-gray-100 text-gray-800';
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      draft: 'Borrador',
      submitted: 'Enviado',
      provisioning: 'Aprovisionando',
      active: 'Activo',
      archived: 'Archivado',
    };
    return labels[status] || status;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <main className="mx-auto max-w-7xl px-6 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-gray-500">Cargando...</div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="mx-auto max-w-7xl px-6 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-[#1A1A1A]">Dashboard</h1>
            <p className="text-gray-600 mt-1">
              Vista general de intakes y actividad reciente
            </p>
          </div>
          <Link href="/intakes/new">
            <Button className="bg-[#1A4A28] hover:bg-[#1A4A28]/90">
              <Plus className="h-4 w-4 mr-2" />
              Nuevo Intake
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Total Intakes
              </CardTitle>
              <FileText className="h-4 w-4 text-[#1A4A28]" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-[#1A1A1A]">
                {stats?.total || 0}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Borradores
              </CardTitle>
              <Clock className="h-4 w-4 text-gray-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-[#1A1A1A]">
                {stats?.byStatus.find(s => s.status === 'draft')?.count || 0}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Activos
              </CardTitle>
              <CheckCircle2 className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-[#1A1A1A]">
                {stats?.byStatus.find(s => s.status === 'active')?.count || 0}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                En Provisioning
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-[#1A1A1A]">
                {stats?.byStatus.find(s => s.status === 'provisioning')?.count ||
                  0}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-[#1A1A1A]">
                Intakes Recientes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {stats?.recent && stats.recent.length > 0 ? (
                  stats.recent.map((intake: any) => (
                    <Link
                      key={intake.id}
                      href={`/intakes/${intake.id}`}
                      className="block"
                    >
                      <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-[#1A1A1A] truncate">
                            {intake.clientProject}
                          </p>
                          <div className="flex items-center gap-3 mt-1">
                            <p className="text-xs text-gray-500">
                              {intake.businessUnit || 'Sin BU'}
                            </p>
                            <span className="text-xs text-gray-400">•</span>
                            <p className="text-xs text-gray-500">
                              {intake.industry || 'Sin industria'}
                            </p>
                          </div>
                        </div>
                        <Badge
                          className={`ml-4 ${getStatusBadge(intake.status)}`}
                        >
                          {getStatusLabel(intake.status)}
                        </Badge>
                      </div>
                    </Link>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <FileText className="h-12 w-12 mx-auto mb-3 opacity-30" />
                    <p>No hay intakes todavía</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-[#1A1A1A]">
                Por Business Unit
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {stats?.byBusinessUnit && stats.byBusinessUnit.length > 0 ? (
                  stats.byBusinessUnit.slice(0, 8).map((bu: any) => (
                    <div
                      key={bu.businessUnit}
                      className="flex items-center justify-between"
                    >
                      <span className="text-sm text-gray-700 truncate">
                        {bu.businessUnit}
                      </span>
                      <Badge variant="outline" className="ml-2">
                        {bu.count}
                      </Badge>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-500 text-sm">
                    Sin datos
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
