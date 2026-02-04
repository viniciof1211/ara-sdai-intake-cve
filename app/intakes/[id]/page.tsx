'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Navbar } from '@/components/Navbar';
import { IntakeWizard } from '@/components/IntakeWizard';
import { CopilotPanel } from '@/components/CopilotPanel';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Download, Printer, ArrowLeft, Trash2 } from 'lucide-react';

export default function IntakeDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const [intake, setIntake] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadIntake();
  }, [params.id]);

  const loadIntake = async () => {
    try {
      const res = await fetch(`/api/intakes/${params.id}`);
      if (!res.ok) throw new Error('Error cargando intake');
      const data = await res.json();
      setIntake(data);
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (payload: any) => {
    setSaving(true);
    try {
      const res = await fetch(`/api/intakes/${params.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ payload }),
      });

      if (!res.ok) throw new Error('Error guardando intake');

      toast({
        title: 'Guardado',
        description: 'El intake se ha actualizado correctamente',
      });
      await loadIntake();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  const handleSubmit = async () => {
    setSaving(true);
    try {
      const res = await fetch('/api/provision', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ intakeId: params.id }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Error en provisioning');
      }

      toast({
        title: 'Enviado',
        description: 'Intake enviado. Provisioning iniciado.',
      });
      await loadIntake();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('¿Está seguro de eliminar este intake?')) return;

    try {
      const res = await fetch(`/api/intakes/${params.id}`, {
        method: 'DELETE',
      });

      if (!res.ok) throw new Error('Error eliminando intake');

      toast({
        title: 'Eliminado',
        description: 'El intake ha sido eliminado',
      });
      router.push('/intakes');
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const handleDownloadJSON = () => {
    const json = JSON.stringify(intake.payload, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `intake-${intake.clientProject}-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <main className="mx-auto max-w-7xl px-6 py-8">
          <div className="text-center text-gray-500">Cargando...</div>
        </main>
      </div>
    );
  }

  if (!intake) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <main className="mx-auto max-w-7xl px-6 py-8">
          <div className="text-center text-gray-500">Intake no encontrado</div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="mx-auto max-w-7xl px-6 py-8">
        <div className="flex items-center gap-4 mb-6">
          <Link href="/intakes">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver
            </Button>
          </Link>
          <div className="flex-1" />
          <Button
            variant="outline"
            size="sm"
            onClick={handleDownloadJSON}
          >
            <Download className="h-4 w-4 mr-2" />
            Descargar JSON
          </Button>
          <Link href={`/intakes/${params.id}/print`} target="_blank">
            <Button variant="outline" size="sm">
              <Printer className="h-4 w-4 mr-2" />
              One-Pager
            </Button>
          </Link>
          <Button
            variant="destructive"
            size="sm"
            onClick={handleDelete}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Eliminar
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <IntakeWizard
              initialPayload={intake.payload}
              status={intake.status}
              onSave={handleSave}
              onSubmit={handleSubmit}
              saving={saving}
              canEdit={true}
            />
          </div>
          <div>
            <CopilotPanel
              intakeId={params.id as string}
              payload={intake.payload}
              onPayloadUpdate={handleSave}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
