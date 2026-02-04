'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Sparkles, Loader2 } from 'lucide-react';
import { IntakePayload } from '@/lib/types/intake';

interface CopilotPanelProps {
  intakeId: string;
  payload: IntakePayload;
  onPayloadUpdate: (payload: IntakePayload) => Promise<void>;
}

export function CopilotPanel({
  intakeId,
  payload,
  onPayloadUpdate,
}: CopilotPanelProps) {
  const { toast } = useToast();
  const [freeNotes, setFreeNotes] = useState('');
  const [loading, setLoading] = useState<string | null>(null);
  const [result, setResult] = useState<any>(null);

  const callCopilot = async (
    endpoint: string,
    body: any,
    actionName: string
  ) => {
    setLoading(actionName);
    setResult(null);

    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Error en Copiloto');
      }

      setResult(data.result);
      toast({
        title: 'Completado',
        description: data.cached
          ? `Resultado obtenido de caché (${data.latency}ms)`
          : `Generado en ${data.latency}ms`,
      });

      return data.result;
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
      return null;
    } finally {
      setLoading(null);
    }
  };

  const handleExtractOntology = async () => {
    const result = await callCopilot(
      '/api/copilot/extractOntology',
      {
        intakeId,
        freeNotes,
        existingSystems: payload.systems,
      },
      'extractOntology'
    );

    if (result && result.objects) {
      const updatedPayload = {
        ...payload,
        ontology_objects: [
          ...payload.ontology_objects,
          ...result.objects,
        ],
        ontology_links: [
          ...payload.ontology_links,
          ...(result.links || []),
        ],
        ontology_actions: [
          ...payload.ontology_actions,
          ...(result.actions || []),
        ],
      };
      await onPayloadUpdate(updatedPayload);
      toast({
        title: 'Aplicado',
        description: 'Ontología actualizada en las tablas',
      });
    }
  };

  const handleSuggestKPIs = async () => {
    const result = await callCopilot(
      '/api/copilot/suggestKPIs',
      { intakeId, payload },
      'suggestKPIs'
    );

    if (result && result.kpis) {
      const kpiNames = result.kpis.map((k: any) => k.name);
      const combined = [...payload.kpis_impacted, ...kpiNames];
      const unique = Array.from(new Set(combined));
      const updatedPayload = {
        ...payload,
        kpis_impacted: unique,
      };
      await onPayloadUpdate(updatedPayload);
      toast({
        title: 'Aplicado',
        description: 'KPIs agregados a la lista',
      });
    }
  };

  const handleSuggestMVPPlan = async () => {
    const result = await callCopilot(
      '/api/copilot/suggestMVPPlan',
      { intakeId, payload },
      'suggestMVPPlan'
    );

    if (result && result.mvp_30) {
      const mvpLines = [
        ...result.mvp_30.features.map((f: string) => `[30d MUST] ${f}`),
        ...result.mvp_60.features.map((f: string) => `[60d SHOULD] ${f}`),
        ...result.mvp_90.features.map((f: string) => `[90d COULD] ${f}`),
      ];
      const updatedPayload = {
        ...payload,
        mvp_scope: [...payload.mvp_scope, ...mvpLines],
      };
      await onPayloadUpdate(updatedPayload);
      toast({
        title: 'Aplicado',
        description: 'Plan MVP agregado',
      });
    }
  };

  const handleGenerateExecutiveSummary = async () => {
    await callCopilot(
      '/api/copilot/generateExecutiveSummary',
      { intakeId, payload },
      'generateExecutiveSummary'
    );
  };

  return (
    <Card className="sticky top-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Sparkles className="h-5 w-5 text-[#1A4A28]" />
          Copiloto CVE
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Notas Libres</label>
          <Textarea
            value={freeNotes}
            onChange={e => setFreeNotes(e.target.value)}
            placeholder="Pegue notas de procesos, dolores de negocio, o cualquier información desestructurada..."
            rows={6}
            className="text-sm"
          />
        </div>

        <div className="space-y-2">
          <Button
            onClick={handleExtractOntology}
            disabled={loading !== null || !freeNotes}
            className="w-full bg-[#1A4A28] hover:bg-[#1A4A28]/90"
            size="sm"
          >
            {loading === 'extractOntology' ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Sparkles className="h-4 w-4 mr-2" />
            )}
            Auto-Completar Ontología
          </Button>

          <Button
            onClick={handleSuggestKPIs}
            disabled={loading !== null}
            className="w-full bg-[#1A4A28] hover:bg-[#1A4A28]/90"
            size="sm"
          >
            {loading === 'suggestKPIs' ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Sparkles className="h-4 w-4 mr-2" />
            )}
            Sugerir KPIs
          </Button>

          <Button
            onClick={handleSuggestMVPPlan}
            disabled={loading !== null}
            className="w-full bg-[#1A4A28] hover:bg-[#1A4A28]/90"
            size="sm"
          >
            {loading === 'suggestMVPPlan' ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Sparkles className="h-4 w-4 mr-2" />
            )}
            Proponer MVP 30/60/90
          </Button>

          <Button
            onClick={handleGenerateExecutiveSummary}
            disabled={loading !== null}
            className="w-full bg-[#1A4A28] hover:bg-[#1A4A28]/90"
            size="sm"
          >
            {loading === 'generateExecutiveSummary' ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Sparkles className="h-4 w-4 mr-2" />
            )}
            Generar One-Pager
          </Button>
        </div>

        {result && (
          <div className="mt-4 p-4 bg-gray-50 rounded-lg">
            <p className="text-sm font-medium mb-2">Resultado:</p>
            <div className="text-xs text-gray-700 whitespace-pre-wrap max-h-64 overflow-y-auto">
              {JSON.stringify(result, null, 2)}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
