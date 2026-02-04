'use client';

import { useEffect, useState } from 'react';
import { Navbar } from '@/components/Navbar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Archive, RefreshCw } from 'lucide-react';

export default function AdminPage() {
  const { toast } = useToast();
  const [intakes, setIntakes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadIntakes();
  }, []);

  const loadIntakes = async () => {
    setLoading(true);
    const res = await fetch('/api/intakes');
    const data = await res.json();
    setIntakes(data);
    setLoading(false);
  };

  const updateStatus = async (intakeId: string, newStatus: string) => {
    try {
      const res = await fetch(`/api/intakes/${intakeId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!res.ok) throw new Error('Error actualizando estado');

      toast({
        title: 'Actualizado',
        description: 'El estado del intake ha sido actualizado',
      });
      await loadIntakes();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    }
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
            <h1 className="text-3xl font-bold text-[#1A1A1A]">
              Panel de Administración
            </h1>
            <p className="text-gray-600 mt-1">
              Gestión de estados y configuración del sistema
            </p>
          </div>
          <Button
            onClick={loadIntakes}
            variant="outline"
            size="sm"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Refrescar
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Gestión de Estados de Intakes</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8 text-gray-500">Cargando...</div>
            ) : (
              <div className="space-y-3">
                {intakes.map(intake => (
                  <div
                    key={intake.id}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-[#1A1A1A] truncate">
                        {intake.clientProject}
                      </p>
                      <p className="text-xs text-gray-500">
                        {intake.businessUnit || 'Sin BU'} •{' '}
                        {intake.industry || 'Sin industria'}
                      </p>
                    </div>
                    <div className="flex items-center gap-3 ml-4">
                      <Badge className={getStatusBadge(intake.status)}>
                        {getStatusLabel(intake.status)}
                      </Badge>
                      <Select
                        value={intake.status}
                        onValueChange={newStatus =>
                          updateStatus(intake.id, newStatus)
                        }
                      >
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder="Cambiar estado" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="draft">Borrador</SelectItem>
                          <SelectItem value="submitted">Enviado</SelectItem>
                          <SelectItem value="provisioning">
                            Aprovisionando
                          </SelectItem>
                          <SelectItem value="active">Activo</SelectItem>
                          <SelectItem value="archived">Archivado</SelectItem>
                        </SelectContent>
                      </Select>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => updateStatus(intake.id, 'archived')}
                        disabled={intake.status === 'archived'}
                      >
                        <Archive className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
