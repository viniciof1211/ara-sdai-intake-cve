import { IntakePayload } from '@/lib/types/intake';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { EditableTable } from '@/components/EditableTable';

interface TabProps {
  payload: IntakePayload;
  updatePayload: (updates: Partial<IntakePayload>) => void;
  canEdit: boolean;
}

export function Tab3SystemsData({ payload, updatePayload, canEdit }: TabProps) {
  const handleArrayChange = (field: keyof IntakePayload, value: string) => {
    const arr = value.split(',').map(s => s.trim()).filter(Boolean);
    updatePayload({ [field]: arr });
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="systems">Sistemas Involucrados (separados por coma)</Label>
        <Textarea
          id="systems"
          value={payload.systems.join(', ')}
          onChange={e => handleArrayChange('systems', e.target.value)}
          disabled={!canEdit}
          placeholder="Ej: SAP, Salesforce, Oracle EBS, SharePoint"
          rows={3}
        />
        <p className="text-xs text-gray-500">
          Liste todos los sistemas que serán integrados o consultados
        </p>
      </div>

      <div className="space-y-2">
        <Label>Fuentes de Datos</Label>
        <EditableTable
          columns={[
            { key: 'source', label: 'Fuente', placeholder: 'Ej: SAP' },
            { key: 'type', label: 'Tipo', placeholder: 'DB/API/Archivo' },
            {
              key: 'frequency',
              label: 'Frecuencia',
              placeholder: 'Diaria/Semanal',
            },
            { key: 'owner', label: 'Owner', placeholder: 'Responsable' },
            {
              key: 'quality',
              label: 'Calidad',
              placeholder: 'Alta/Media/Baja',
            },
          ]}
          data={payload.data_sources}
          onChange={data =>
            updatePayload({ data_sources: data })
          }
          addButtonLabel="Agregar Fuente de Datos"
        />
      </div>
    </div>
  );
}
