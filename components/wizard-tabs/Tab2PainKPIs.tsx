import { IntakePayload } from '@/lib/types/intake';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';

interface TabProps {
  payload: IntakePayload;
  updatePayload: (updates: Partial<IntakePayload>) => void;
  canEdit: boolean;
}

const commonKPIs = [
  'Reducción de tiempo de ciclo',
  'Reducción de errores',
  'Mejora en precisión de datos',
  'Aumento en productividad',
  'Reducción de costos operativos',
  'Mejora en satisfacción del cliente',
  'Reducción de reprocesos',
  'Mejora en compliance',
];

const commonProcesses = [
  'Procesamiento de pedidos',
  'Gestión de inventario',
  'Facturación y cobranza',
  'Atención al cliente',
  'Procesamiento de reclamos',
  'Aprobaciones y workflows',
  'Reportería y análisis',
  'Onboarding de clientes',
];

export function Tab2PainKPIs({ payload, updatePayload, canEdit }: TabProps) {
  const toggleArrayItem = (field: keyof IntakePayload, item: string) => {
    const arr = payload[field] as string[];
    if (arr.includes(item)) {
      updatePayload({ [field]: arr.filter((i: string) => i !== item) });
    } else {
      updatePayload({ [field]: [...arr, item] });
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <Label className="text-base font-semibold mb-3 block">
          Procesos en Scope *
        </Label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {commonProcesses.map(process => (
            <div key={process} className="flex items-center space-x-2">
              <Checkbox
                id={`process-${process}`}
                checked={payload.processes_in_scope.includes(process)}
                onCheckedChange={() =>
                  toggleArrayItem('processes_in_scope', process)
                }
                disabled={!canEdit}
              />
              <label
                htmlFor={`process-${process}`}
                className="text-sm cursor-pointer"
              >
                {process}
              </label>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="pain_bottlenecks">Cuellos de Botella</Label>
          <Textarea
            id="pain_bottlenecks"
            value={payload.pain_bottlenecks}
            onChange={e =>
              updatePayload({ pain_bottlenecks: e.target.value })
            }
            disabled={!canEdit}
            placeholder="Describa los principales cuellos de botella operativos..."
            rows={3}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="pain_rework">Reprocesos</Label>
          <Textarea
            id="pain_rework"
            value={payload.pain_rework}
            onChange={e => updatePayload({ pain_rework: e.target.value })}
            disabled={!canEdit}
            placeholder="Describa los reprocesos recurrentes..."
            rows={3}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="pain_info_gaps">Gaps de Información</Label>
          <Textarea
            id="pain_info_gaps"
            value={payload.pain_info_gaps}
            onChange={e => updatePayload({ pain_info_gaps: e.target.value })}
            disabled={!canEdit}
            placeholder="Describa las brechas de información..."
            rows={3}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="pain_errors">Errores Frecuentes</Label>
          <Textarea
            id="pain_errors"
            value={payload.pain_errors}
            onChange={e => updatePayload({ pain_errors: e.target.value })}
            disabled={!canEdit}
            placeholder="Describa los errores más comunes..."
            rows={3}
          />
        </div>
      </div>

      <div>
        <Label className="text-base font-semibold mb-3 block">
          KPIs Impactados *
        </Label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {commonKPIs.map(kpi => (
            <div key={kpi} className="flex items-center space-x-2">
              <Checkbox
                id={`kpi-${kpi}`}
                checked={payload.kpis_impacted.includes(kpi)}
                onCheckedChange={() => toggleArrayItem('kpis_impacted', kpi)}
                disabled={!canEdit}
              />
              <label htmlFor={`kpi-${kpi}`} className="text-sm cursor-pointer">
                {kpi}
              </label>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
