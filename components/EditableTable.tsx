'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Plus, Trash2 } from 'lucide-react';

interface Column {
  key: string;
  label: string;
  type?: 'text' | 'checkbox';
  placeholder?: string;
}

interface EditableTableProps {
  columns: Column[];
  data: any[];
  onChange: (newData: any[]) => void;
  addButtonLabel?: string;
}

export function EditableTable({
  columns,
  data,
  onChange,
  addButtonLabel = 'Agregar Fila',
}: EditableTableProps) {
  const addRow = () => {
    const newRow: any = {};
    columns.forEach(col => {
      newRow[col.key] = col.type === 'checkbox' ? false : '';
    });
    onChange([...data, newRow]);
  };

  const updateRow = (index: number, key: string, value: any) => {
    const newData = [...data];
    newData[index] = { ...newData[index], [key]: value };
    onChange(newData);
  };

  const deleteRow = (index: number) => {
    onChange(data.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-2">
      <div className="border rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                {columns.map(col => (
                  <th
                    key={col.key}
                    className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider"
                  >
                    {col.label}
                  </th>
                ))}
                <th className="px-4 py-3 w-16"></th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {data.length === 0 ? (
                <tr>
                  <td
                    colSpan={columns.length + 1}
                    className="px-4 py-8 text-center text-gray-500 text-sm"
                  >
                    No hay datos. Haga clic en &quot;{addButtonLabel}&quot; para agregar.
                  </td>
                </tr>
              ) : (
                data.map((row, rowIndex) => (
                  <tr key={rowIndex} className="hover:bg-gray-50">
                    {columns.map(col => (
                      <td key={col.key} className="px-4 py-3">
                        {col.type === 'checkbox' ? (
                          <Checkbox
                            checked={row[col.key] || false}
                            onCheckedChange={checked =>
                              updateRow(rowIndex, col.key, checked)
                            }
                          />
                        ) : (
                          <Input
                            value={row[col.key] || ''}
                            onChange={e =>
                              updateRow(rowIndex, col.key, e.target.value)
                            }
                            placeholder={col.placeholder}
                            className="h-8"
                          />
                        )}
                      </td>
                    ))}
                    <td className="px-4 py-3">
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteRow(rowIndex)}
                        className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
      <Button
        type="button"
        onClick={addRow}
        variant="outline"
        size="sm"
        className="w-full"
      >
        <Plus className="h-4 w-4 mr-2" />
        {addButtonLabel}
      </Button>
    </div>
  );
}
