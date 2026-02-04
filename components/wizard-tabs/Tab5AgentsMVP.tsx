import { IntakePayload } from '@/lib/types/intake';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';

interface TabProps {
  payload: IntakePayload;
  updatePayload: (updates: Partial<IntakePayload>) => void;
  canEdit: boolean;
}

const commonAgents = [
  'Agente de Clasificación de Documentos',
  'Agente de Extracción de Datos',
  'Agente de Validación',
  'Agente de Enrutamiento Inteligente',
  'Agente Conversacional (Chatbot)',
  'Agente de Análisis Predictivo',
  'Agente de Recomendaciones',
  'Agente de Monitoreo y Alertas',
];

export function Tab5AgentsMVP({ payload, updatePayload, canEdit }: TabProps) {
  const toggleArrayItem = (field: keyof IntakePayload, item: string) => {
    const arr = payload[field] as string[];
    if (arr.includes(item)) {
      updatePayload({ [field]: arr.filter((i: string) => i !== item) });
    } else {
      updatePayload({ [field]: [...arr, item] });
    }
  };

  const handleArrayChange = (field: keyof IntakePayload, value: string) => {
    const arr = value.split('\n').map(s => s.trim()).filter(Boolean);
    updatePayload({ [field]: arr });
  };

  return (
    <div className="space-y-6">
      <div>
        <Label className="text-base font-semibold mb-3 block">
          Agentes IA Solicitados
        </Label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {commonAgents.map(agent => (
            <div key={agent} className="flex items-center space-x-2">
              <Checkbox
                id={`agent-${agent}`}
                checked={payload.agents_requested.includes(agent)}
                onCheckedChange={() =>
                  toggleArrayItem('agents_requested', agent)
                }
                disabled={!canEdit}
              />
              <label
                htmlFor={`agent-${agent}`}
                className="text-sm cursor-pointer"
              >
                {agent}
              </label>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="mvp_scope">Alcance MVP (uno por línea)</Label>
        <Textarea
          id="mvp_scope"
          value={payload.mvp_scope.join('\n')}
          onChange={e => handleArrayChange('mvp_scope', e.target.value)}
          disabled={!canEdit}
          placeholder="Ej:&#10;MVP 30d: Clasificación automática de facturas&#10;MVP 60d: Extracción de campos clave&#10;MVP 90d: Validación contra sistemas ERP"
          rows={8}
        />
        <p className="text-xs text-gray-500">
          Especifique el alcance del MVP en fases 30/60/90 días con priorización MUST/SHOULD/COULD
        </p>
      </div>
    </div>
  );
}
