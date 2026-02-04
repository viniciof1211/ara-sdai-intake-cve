import { IntakePayload, CloudStrategy, ComputeTier } from '@/lib/types/intake';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface TabProps {
  payload: IntakePayload;
  updatePayload: (updates: Partial<IntakePayload>) => void;
  canEdit: boolean;
}

export function Tab6InfraSecurity({ payload, updatePayload, canEdit }: TabProps) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="cloud_strategy">Estrategia de Cloud</Label>
          <Select
            value={payload.cloud_strategy}
            onValueChange={value =>
              updatePayload({ cloud_strategy: value as CloudStrategy })
            }
            disabled={!canEdit}
          >
            <SelectTrigger>
              <SelectValue placeholder="Seleccione estrategia" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Azure">Azure</SelectItem>
              <SelectItem value="GCP">GCP</SelectItem>
              <SelectItem value="Multicloud">Multicloud</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="compute_tier">Tier de Cómputo</Label>
          <Select
            value={payload.compute_tier}
            onValueChange={value =>
              updatePayload({ compute_tier: value as ComputeTier })
            }
            disabled={!canEdit}
          >
            <SelectTrigger>
              <SelectValue placeholder="Seleccione tier" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Small">Small (Dev/Test)</SelectItem>
              <SelectItem value="Standard">Standard (Producción)</SelectItem>
              <SelectItem value="Large">Large (Alta Demanda)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="region">Región</Label>
          <Input
            id="region"
            value={payload.region}
            onChange={e => updatePayload({ region: e.target.value })}
            disabled={!canEdit}
            placeholder="Ej: us-central1, eastus2"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="go_live_date">Fecha Go-Live Objetivo</Label>
          <Input
            id="go_live_date"
            type="date"
            value={payload.go_live_date}
            onChange={e => updatePayload({ go_live_date: e.target.value })}
            disabled={!canEdit}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="notes">Notas Adicionales</Label>
        <Textarea
          id="notes"
          value={payload.notes}
          onChange={e => updatePayload({ notes: e.target.value })}
          disabled={!canEdit}
          placeholder="Cualquier información adicional relevante..."
          rows={4}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="risks">Riesgos Identificados</Label>
        <Textarea
          id="risks"
          value={payload.risks}
          onChange={e => updatePayload({ risks: e.target.value })}
          disabled={!canEdit}
          placeholder="Liste los principales riesgos técnicos, organizacionales o de negocio..."
          rows={4}
        />
      </div>
    </div>
  );
}
