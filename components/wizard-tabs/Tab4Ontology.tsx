import { IntakePayload } from '@/lib/types/intake';
import { Label } from '@/components/ui/label';
import { EditableTable } from '@/components/EditableTable';

interface TabProps {
  payload: IntakePayload;
  updatePayload: (updates: Partial<IntakePayload>) => void;
  canEdit: boolean;
}

export function Tab4Ontology({ payload, updatePayload, canEdit }: TabProps) {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label>Objetos de Negocio</Label>
        <p className="text-sm text-gray-600">
          Define las entidades principales (ej: Cliente, Pedido, Factura)
        </p>
        <EditableTable
          columns={[
            { key: 'object', label: 'Objeto', placeholder: 'Ej: Cliente' },
            {
              key: 'source_system',
              label: 'Sistema Fuente',
              placeholder: 'Ej: SAP',
            },
            {
              key: 'volume',
              label: 'Volumen',
              placeholder: 'Ej: 100K registros',
            },
            {
              key: 'frequency',
              label: 'Frecuencia',
              placeholder: 'Diaria/Semanal',
            },
            { key: 'notes', label: 'Notas', placeholder: 'Observaciones' },
          ]}
          data={payload.ontology_objects}
          onChange={data => updatePayload({ ontology_objects: data })}
          addButtonLabel="Agregar Objeto"
        />
      </div>

      <div className="space-y-2">
        <Label>Relaciones entre Objetos</Label>
        <p className="text-sm text-gray-600">
          Define cómo se relacionan los objetos (ej: Cliente -[realiza]→ Pedido)
        </p>
        <EditableTable
          columns={[
            {
              key: 'from_object',
              label: 'Objeto Origen',
              placeholder: 'Ej: Cliente',
            },
            {
              key: 'relationship',
              label: 'Relación',
              placeholder: 'Ej: realiza',
            },
            {
              key: 'to_object',
              label: 'Objeto Destino',
              placeholder: 'Ej: Pedido',
            },
          ]}
          data={payload.ontology_links}
          onChange={data => updatePayload({ ontology_links: data })}
          addButtonLabel="Agregar Relación"
        />
      </div>

      <div className="space-y-2">
        <Label>Acciones de Negocio</Label>
        <p className="text-sm text-gray-600">
          Define las acciones que se ejecutan sobre objetos
        </p>
        <EditableTable
          columns={[
            {
              key: 'action_name',
              label: 'Acción',
              placeholder: 'Ej: Aprobar Pedido',
            },
            {
              key: 'object',
              label: 'Objeto',
              placeholder: 'Ej: Pedido',
            },
            {
              key: 'trigger',
              label: 'Trigger',
              placeholder: 'Qué dispara la acción',
            },
            {
              key: 'output',
              label: 'Output',
              placeholder: 'Resultado esperado',
            },
          ]}
          data={payload.ontology_actions}
          onChange={data => updatePayload({ ontology_actions: data })}
          addButtonLabel="Agregar Acción"
        />
      </div>

      <div className="space-y-2">
        <Label>Matriz de Permisos</Label>
        <p className="text-sm text-gray-600">
          Define qué roles pueden acceder a cada objeto
        </p>
        <EditableTable
          columns={[
            { key: 'role', label: 'Rol', placeholder: 'Ej: Analista' },
            { key: 'object', label: 'Objeto', placeholder: 'Ej: Pedido' },
            { key: 'read', label: 'Lectura', type: 'checkbox' },
            { key: 'write', label: 'Escritura', type: 'checkbox' },
            { key: 'approve', label: 'Aprobar', type: 'checkbox' },
          ]}
          data={payload.permissions_matrix}
          onChange={data => updatePayload({ permissions_matrix: data })}
          addButtonLabel="Agregar Permiso"
        />
      </div>
    </div>
  );
}
