'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Badge } from '@/components/ui/badge';

export default function IntakePrintPage() {
  const params = useParams();
  const [intake, setIntake] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadIntake();
  }, [params.id]);

  const loadIntake = async () => {
    try {
      const res = await fetch(`/api/intakes/${params.id}`);
      if (!res.ok) throw new Error('Error cargando intake');
      const data = await res.json();
      setIntake(data);
    } catch (error: any) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !intake) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-500">Cargando...</div>
      </div>
    );
  }

  const payload = intake.payload;

  return (
    <div className="min-h-screen bg-white p-8 print:p-0">
      <div className="max-w-4xl mx-auto">
        <div className="border-b-4 border-[#1A4A28] pb-4 mb-6">
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-3xl font-bold text-[#1A4A28]">ARA Group</h1>
            <Badge className="bg-[#1A4A28]">SDAI Intake - CVE</Badge>
          </div>
          <h2 className="text-2xl font-semibold text-[#1A1A1A]">
            {payload.client_project}
          </h2>
        </div>

        <div className="grid grid-cols-2 gap-6 mb-6">
          <div>
            <h3 className="text-sm font-semibold text-gray-500 uppercase mb-1">
              Industria
            </h3>
            <p className="text-base">{payload.industry || '-'}</p>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-500 uppercase mb-1">
              Business Unit
            </h3>
            <p className="text-base">{payload.business_unit || '-'}</p>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-500 uppercase mb-1">
              Sponsor Ejecutivo
            </h3>
            <p className="text-base">{payload.sponsor_exec || '-'}</p>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-500 uppercase mb-1">
              Contacto Técnico
            </h3>
            <p className="text-base">{payload.tech_contact || '-'}</p>
          </div>
        </div>

        <div className="mb-6">
          <h3 className="text-lg font-semibold text-[#1A4A28] mb-3">
            Dolor Operativo
          </h3>
          <div className="space-y-2 text-sm">
            {payload.pain_bottlenecks && (
              <div>
                <strong>Cuellos de botella:</strong> {payload.pain_bottlenecks}
              </div>
            )}
            {payload.pain_rework && (
              <div>
                <strong>Reprocesos:</strong> {payload.pain_rework}
              </div>
            )}
            {payload.pain_info_gaps && (
              <div>
                <strong>Gaps de información:</strong> {payload.pain_info_gaps}
              </div>
            )}
            {payload.pain_errors && (
              <div>
                <strong>Errores:</strong> {payload.pain_errors}
              </div>
            )}
          </div>
        </div>

        <div className="mb-6">
          <h3 className="text-lg font-semibold text-[#1A4A28] mb-3">
            KPIs Impactados
          </h3>
          <ul className="list-disc list-inside text-sm space-y-1">
            {payload.kpis_impacted.length > 0 ? (
              payload.kpis_impacted.map((kpi: string, idx: number) => (
                <li key={idx}>{kpi}</li>
              ))
            ) : (
              <li className="text-gray-400">Sin KPIs especificados</li>
            )}
          </ul>
        </div>

        <div className="mb-6">
          <h3 className="text-lg font-semibold text-[#1A4A28] mb-3">
            Sistemas Involucrados
          </h3>
          <div className="flex flex-wrap gap-2">
            {payload.systems.length > 0 ? (
              payload.systems.map((sys: string, idx: number) => (
                <Badge key={idx} variant="outline">
                  {sys}
                </Badge>
              ))
            ) : (
              <span className="text-sm text-gray-400">
                Sin sistemas especificados
              </span>
            )}
          </div>
        </div>

        <div className="mb-6">
          <h3 className="text-lg font-semibold text-[#1A4A28] mb-3">
            Alcance MVP Propuesto
          </h3>
          <ul className="list-disc list-inside text-sm space-y-1">
            {payload.mvp_scope.length > 0 ? (
              payload.mvp_scope.slice(0, 10).map((item: string, idx: number) => (
                <li key={idx}>{item}</li>
              ))
            ) : (
              <li className="text-gray-400">Sin MVP especificado</li>
            )}
          </ul>
        </div>

        <div className="mb-6">
          <h3 className="text-lg font-semibold text-[#1A4A28] mb-3">
            Agentes Solicitados
          </h3>
          <ul className="list-disc list-inside text-sm space-y-1">
            {payload.agents_requested.length > 0 ? (
              payload.agents_requested.map((agent: string, idx: number) => (
                <li key={idx}>{agent}</li>
              ))
            ) : (
              <li className="text-gray-400">Sin agentes especificados</li>
            )}
          </ul>
        </div>

        {payload.risks && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-red-600 mb-3">
              Riesgos Identificados
            </h3>
            <p className="text-sm bg-red-50 p-3 rounded">{payload.risks}</p>
          </div>
        )}

        {(!payload.processes_in_scope ||
          payload.processes_in_scope.length === 0 ||
          !payload.kpis_impacted ||
          payload.kpis_impacted.length === 0) && (
          <div className="border-2 border-yellow-400 bg-yellow-50 p-4 rounded">
            <h3 className="text-lg font-semibold text-yellow-800 mb-2">
              REQUIERE VALIDACIÓN
            </h3>
            <ul className="list-disc list-inside text-sm text-yellow-800">
              {(!payload.processes_in_scope ||
                payload.processes_in_scope.length === 0) && (
                <li>Falta especificar procesos en scope</li>
              )}
              {(!payload.kpis_impacted ||
                payload.kpis_impacted.length === 0) && (
                <li>Falta especificar KPIs impactados</li>
              )}
            </ul>
          </div>
        )}

        <div className="mt-8 pt-4 border-t text-xs text-gray-500 flex justify-between">
          <span>© {new Date().getFullYear()} ARA Group - SDAI Intake</span>
          <span>
            Generado: {new Date().toLocaleDateString('es-ES')}
          </span>
        </div>
      </div>

      <style jsx global>{`
        @media print {
          @page {
            margin: 1cm;
          }
          body {
            print-color-adjust: exact;
            -webkit-print-color-adjust: exact;
          }
        }
      `}</style>
    </div>
  );
}
