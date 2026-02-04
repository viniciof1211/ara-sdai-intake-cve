import { IntakePayload } from '@/lib/types/intake';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertCircle } from 'lucide-react';

interface TabProps {
  payload: IntakePayload;
  updatePayload: (updates: Partial<IntakePayload>) => void;
  canEdit: boolean;
}

export function Tab7Summary({ payload }: TabProps) {
  const validationIssues: string[] = [];

  if (!payload.client_project) {
    validationIssues.push('Falta especificar Proyecto/Cliente');
  }
  if (!payload.processes_in_scope || payload.processes_in_scope.length === 0) {
    validationIssues.push('Falta especificar al menos un proceso en scope');
  }
  if (!payload.kpis_impacted || payload.kpis_impacted.length === 0) {
    validationIssues.push('Falta especificar al menos un KPI impactado');
  }

  return (
    <div className="space-y-6">
      {validationIssues.length > 0 && (
        <Card className="border-yellow-200 bg-yellow-50">
          <CardHeader>
            <CardTitle className="text-yellow-800 flex items-center gap-2">
              <AlertCircle className="h-5 w-5" />
              REQUIERE VALIDACIÓN
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc list-inside space-y-1 text-sm text-yellow-800">
              {validationIssues.map((issue, idx) => (
                <li key={idx}>{issue}</li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Información General</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium text-gray-600">Proyecto:</span>
              <p className="mt-1">{payload.client_project || '-'}</p>
            </div>
            <div>
              <span className="font-medium text-gray-600">Industria:</span>
              <p className="mt-1">{payload.industry || '-'}</p>
            </div>
            <div>
              <span className="font-medium text-gray-600">Business Unit:</span>
              <p className="mt-1">{payload.business_unit || '-'}</p>
            </div>
            <div>
              <span className="font-medium text-gray-600">Sponsor:</span>
              <p className="mt-1">{payload.sponsor_exec || '-'}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Procesos & KPIs</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div>
            <span className="font-medium text-gray-600 block mb-2">
              Procesos en Scope:
            </span>
            <div className="flex flex-wrap gap-2">
              {payload.processes_in_scope.length > 0 ? (
                payload.processes_in_scope.map((proc, idx) => (
                  <Badge key={idx} variant="outline">
                    {proc}
                  </Badge>
                ))
              ) : (
                <span className="text-sm text-gray-400">Ninguno</span>
              )}
            </div>
          </div>
          <div>
            <span className="font-medium text-gray-600 block mb-2">
              KPIs Impactados:
            </span>
            <div className="flex flex-wrap gap-2">
              {payload.kpis_impacted.length > 0 ? (
                payload.kpis_impacted.map((kpi, idx) => (
                  <Badge key={idx} variant="outline">
                    {kpi}
                  </Badge>
                ))
              ) : (
                <span className="text-sm text-gray-400">Ninguno</span>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Sistemas & Datos</CardTitle>
        </CardHeader>
        <CardContent>
          <div>
            <span className="font-medium text-gray-600 block mb-2">
              Sistemas:
            </span>
            <div className="flex flex-wrap gap-2">
              {payload.systems.length > 0 ? (
                payload.systems.map((sys, idx) => (
                  <Badge key={idx} variant="outline">
                    {sys}
                  </Badge>
                ))
              ) : (
                <span className="text-sm text-gray-400">Ninguno</span>
              )}
            </div>
          </div>
          <div className="mt-3">
            <span className="font-medium text-gray-600 block mb-1">
              Fuentes de datos: {payload.data_sources.length}
            </span>
            <span className="font-medium text-gray-600 block mb-1">
              Objetos ontológicos: {payload.ontology_objects.length}
            </span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Agentes & MVP</CardTitle>
        </CardHeader>
        <CardContent>
          <div>
            <span className="font-medium text-gray-600 block mb-2">
              Agentes Solicitados:
            </span>
            <div className="flex flex-wrap gap-2">
              {payload.agents_requested.length > 0 ? (
                payload.agents_requested.map((agent, idx) => (
                  <Badge key={idx} variant="outline" className="text-xs">
                    {agent}
                  </Badge>
                ))
              ) : (
                <span className="text-sm text-gray-400">Ninguno</span>
              )}
            </div>
          </div>
          <div className="mt-3">
            <span className="font-medium text-gray-600 block mb-1">
              Fases MVP: {payload.mvp_scope.length}
            </span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Infraestructura</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium text-gray-600">Cloud:</span>
              <p className="mt-1">{payload.cloud_strategy}</p>
            </div>
            <div>
              <span className="font-medium text-gray-600">Tier:</span>
              <p className="mt-1">{payload.compute_tier}</p>
            </div>
            <div>
              <span className="font-medium text-gray-600">Región:</span>
              <p className="mt-1">{payload.region}</p>
            </div>
            <div>
              <span className="font-medium text-gray-600">Go-Live:</span>
              <p className="mt-1">{payload.go_live_date || '-'}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
