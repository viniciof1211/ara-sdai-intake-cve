'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/Navbar';
import { IntakeWizard } from '@/components/IntakeWizard';
import { emptyIntakePayload } from '@/lib/types/intake';
import { useToast } from '@/hooks/use-toast';

export default function NewIntakePage() {
  const router = useRouter();
  const { toast } = useToast();
  const [saving, setSaving] = useState(false);

  const handleSave = async (payload: any) => {
    setSaving(true);
    try {
      const res = await fetch('/api/intakes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clientProject: payload.client_project || 'Nuevo Proyecto',
          payload,
        }),
      });

      if (!res.ok) {
        throw new Error('Error creando intake');
      }

      const data = await res.json();
      toast({
        title: 'Intake creado',
        description: 'El intake se ha guardado correctamente',
      });
      router.push(`/intakes/${data.id}`);
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
    toast({
      title: 'Info',
      description: 'Primero guarde el intake para poder enviarlo',
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="mx-auto max-w-7xl px-6 py-8">
        <IntakeWizard
          initialPayload={emptyIntakePayload}
          status="draft"
          onSave={handleSave}
          onSubmit={handleSubmit}
          saving={saving}
          canEdit={true}
        />
      </main>
    </div>
  );
}
