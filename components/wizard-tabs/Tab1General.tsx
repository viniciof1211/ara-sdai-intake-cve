import { IntakePayload } from '@/lib/types/intake';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface TabProps {
  payload: IntakePayload;
  updatePayload: (updates: Partial<IntakePayload>) => void;
  canEdit: boolean;
}

export function Tab1General({ payload, updatePayload, canEdit }: TabProps) {
  const handleArrayChange = (field: keyof IntakePayload, value: string) => {
    const arr = value.split(',').map(s => s.trim()).filter(Boolean);
    updatePayload({ [field]: arr });
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="client_project">Proyecto/Cliente *</Label>
          <Input
            id="client_project"
            value={payload.client_project}
            onChange={e => updatePayload({ client_project: e.target.value })}
            disabled={!canEdit}
            placeholder="Ej: Banco X - Plataforma CVE"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="industry">Industria</Label>
          <Input
            id="industry"
            value={payload.industry}
            onChange={e => updatePayload({ industry: e.target.value })}
            disabled={!canEdit}
            placeholder="Ej: Banca, Retail, Manufactura"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="business_unit">Business Unit</Label>
          <Input
            id="business_unit"
            value={payload.business_unit}
            onChange={e => updatePayload({ business_unit: e.target.value })}
            disabled={!canEdit}
            placeholder="Ej: Operaciones, Ventas, IT"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="sponsor_exec">Sponsor Ejecutivo</Label>
          <Input
            id="sponsor_exec"
            value={payload.sponsor_exec}
            onChange={e => updatePayload({ sponsor_exec: e.target.value })}
            disabled={!canEdit}
            placeholder="Nombre del sponsor"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="tech_contact">Contacto Técnico</Label>
          <Input
            id="tech_contact"
            value={payload.tech_contact}
            onChange={e => updatePayload({ tech_contact: e.target.value })}
            disabled={!canEdit}
            placeholder="Email o nombre"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="stakeholders">Stakeholders (separados por coma)</Label>
        <Textarea
          id="stakeholders"
          value={payload.stakeholders.join(', ')}
          onChange={e => handleArrayChange('stakeholders', e.target.value)}
          disabled={!canEdit}
          placeholder="Ej: Juan Pérez, María García, Pedro López"
          rows={3}
        />
      </div>
    </div>
  );
}
