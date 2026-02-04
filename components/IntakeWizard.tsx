'use client';

import { useState } from 'react';
import { IntakePayload } from '@/lib/types/intake';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Save, Send } from 'lucide-react';
import { Tab1General } from './wizard-tabs/Tab1General';
import { Tab2PainKPIs } from './wizard-tabs/Tab2PainKPIs';
import { Tab3SystemsData } from './wizard-tabs/Tab3SystemsData';
import { Tab4Ontology } from './wizard-tabs/Tab4Ontology';
import { Tab5AgentsMVP } from './wizard-tabs/Tab5AgentsMVP';
import { Tab6InfraSecurity } from './wizard-tabs/Tab6InfraSecurity';
import { Tab7Summary } from './wizard-tabs/Tab7Summary';

interface IntakeWizardProps {
  initialPayload: IntakePayload;
  status: string;
  onSave: (payload: IntakePayload) => Promise<void>;
  onSubmit: () => Promise<void>;
  saving: boolean;
  canEdit: boolean;
}

export function IntakeWizard({
  initialPayload,
  status,
  onSave,
  onSubmit,
  saving,
  canEdit,
}: IntakeWizardProps) {
  const [payload, setPayload] = useState<IntakePayload>(initialPayload);
  const [activeTab, setActiveTab] = useState('1');

  const updatePayload = (updates: Partial<IntakePayload>) => {
    setPayload(prev => ({ ...prev, ...updates }));
  };

  const handleSave = async () => {
    await onSave(payload);
  };

  const handleSubmit = async () => {
    await handleSave();
    await onSubmit();
  };

  const getStatusBadge = () => {
    const variants: Record<string, string> = {
      draft: 'bg-gray-100 text-gray-800',
      submitted: 'bg-blue-100 text-blue-800',
      provisioning: 'bg-yellow-100 text-yellow-800',
      active: 'bg-green-100 text-green-800',
      archived: 'bg-gray-200 text-gray-600',
    };
    const labels: Record<string, string> = {
      draft: 'Borrador',
      submitted: 'Enviado',
      provisioning: 'Aprovisionando',
      active: 'Activo',
      archived: 'Archivado',
    };
    return (
      <Badge className={variants[status] || 'bg-gray-100 text-gray-800'}>
        {labels[status] || status}
      </Badge>
    );
  };

  const tabs = [
    { id: '1', label: 'General', component: Tab1General },
    { id: '2', label: 'Dolor & KPIs', component: Tab2PainKPIs },
    { id: '3', label: 'Sistemas & Datos', component: Tab3SystemsData },
    { id: '4', label: 'Ontología', component: Tab4Ontology },
    { id: '5', label: 'Agentes & MVP', component: Tab5AgentsMVP },
    { id: '6', label: 'Infra & Seguridad', component: Tab6InfraSecurity },
    { id: '7', label: 'Resumen', component: Tab7Summary },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h2 className="text-2xl font-bold text-[#1A1A1A]">
            {payload.client_project || 'Nuevo Intake'}
          </h2>
          {getStatusBadge()}
        </div>
        <div className="flex gap-3">
          {canEdit && (
            <>
              <Button
                variant="outline"
                onClick={handleSave}
                disabled={saving}
              >
                <Save className="h-4 w-4 mr-2" />
                Guardar Borrador
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={saving || status !== 'draft'}
                className="bg-[#1A4A28] hover:bg-[#1A4A28]/90"
              >
                <Send className="h-4 w-4 mr-2" />
                Submit & Provision
              </Button>
            </>
          )}
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="w-full justify-start overflow-x-auto">
          {tabs.map(tab => (
            <TabsTrigger key={tab.id} value={tab.id}>
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>

        {tabs.map(tab => {
          const TabComponent = tab.component;
          return (
            <TabsContent key={tab.id} value={tab.id}>
              <Card>
                <CardContent className="pt-6">
                  <TabComponent
                    payload={payload}
                    updatePayload={updatePayload}
                    canEdit={canEdit}
                  />
                </CardContent>
              </Card>
            </TabsContent>
          );
        })}
      </Tabs>
    </div>
  );
}
