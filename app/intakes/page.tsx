'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Navbar } from '@/components/Navbar';
import { Plus, Search } from 'lucide-react';

export default function IntakesListPage() {
  const [intakes, setIntakes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadIntakes();
  }, [statusFilter, searchQuery]);

  const loadIntakes = async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (statusFilter !== 'all') params.set('status', statusFilter);
    if (searchQuery) params.set('search', searchQuery);

    const res = await fetch(`/api/intakes?${params.toString()}`);
    const data = await res.json();
    setIntakes(data);
    setLoading(false);
  };

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

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="mx-auto max-w-7xl px-6 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-[#1A1A1A]">Intakes</h1>
            <p className="text-gray-600 mt-1">
              Gestión de intakes y proyectos CVE
            </p>
          </div>
          <Link href="/intakes/new">
            <Button className="bg-[#1A4A28] hover:bg-[#1A4A28]/90">
              <Plus className="h-4 w-4 mr-2" />
              Nuevo Intake
            </Button>
          </Link>
        </div>

        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Buscar por proyecto, industria o BU..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full md:w-[200px]">
                  <SelectValue placeholder="Filtrar por estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los estados</SelectItem>
                  <SelectItem value="draft">Borrador</SelectItem>
                  <SelectItem value="submitted">Enviado</SelectItem>
                  <SelectItem value="provisioning">Aprovisionando</SelectItem>
                  <SelectItem value="active">Activo</SelectItem>
                  <SelectItem value="archived">Archivado</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {loading ? (
          <div className="text-center py-12">
            <div className="text-gray-500">Cargando...</div>
          </div>
        ) : intakes.length === 0 ? (
          <Card>
            <CardContent className="py-12">
              <div className="text-center text-gray-500">
                <p className="mb-4">No se encontraron intakes</p>
                <Link href="/intakes/new">
                  <Button className="bg-[#1A4A28] hover:bg-[#1A4A28]/90">
                    <Plus className="h-4 w-4 mr-2" />
                    Crear Primer Intake
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {intakes.map((intake: any) => (
              <Link key={intake.id} href={`/intakes/${intake.id}`}>
                <Card className="hover:shadow-md transition-shadow cursor-pointer">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold text-[#1A1A1A] truncate">
                            {intake.clientProject}
                          </h3>
                          <Badge className={getStatusBadge(intake.status)}>
                            {getStatusLabel(intake.status)}
                          </Badge>
                        </div>
                        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                          <span>
                            <span className="font-medium">BU:</span>{' '}
                            {intake.businessUnit || 'Sin especificar'}
                          </span>
                          <span>
                            <span className="font-medium">Industria:</span>{' '}
                            {intake.industry || 'Sin especificar'}
                          </span>
                          <span>
                            <span className="font-medium">Actualizado:</span>{' '}
                            {new Date(intake.updatedAt).toLocaleDateString(
                              'es-ES'
                            )}
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
