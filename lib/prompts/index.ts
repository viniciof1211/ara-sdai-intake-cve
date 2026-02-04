export const extractOntologyPrompt_es = (freeNotes: string, existingSystems: string[]) => `
Eres un arquitecto de soluciones enterprise especializado en modelado ontológico para aplicaciones de IA.

CONTEXTO:
El usuario ha proporcionado las siguientes notas sobre procesos de negocio:
---
${freeNotes}
---

Sistemas existentes mencionados: ${existingSystems.join(', ') || 'Ninguno'}

TAREA:
Extrae y estructura la ontología en formato JSON con estas secciones:

1. **objects**: Lista de objetos/entidades de negocio (ej: Cliente, Pedido, Factura)
2. **links**: Relaciones entre objetos (ej: Cliente -[realiza]-> Pedido)
3. **actions**: Acciones que se ejecutan sobre objetos (ej: "Aprobar Factura")

REGLAS ESTRICTAS:
- NO inventes sistemas que no estén explícitamente mencionados
- Si falta información crítica, marca el campo como "REQUIERE VALIDACIÓN"
- Usa los sistemas existentes para relacionar objetos con sus fuentes
- Sé conservador: mejor omitir que inventar

OUTPUT:
Devuelve SOLO un JSON válido con esta estructura:

{
  "objects": [
    {
      "object": "Nombre del objeto",
      "source_system": "Sistema fuente o REQUIERE VALIDACIÓN",
      "volume": "Estimado (ej: 10K registros) o REQUIERE VALIDACIÓN",
      "frequency": "daily|weekly|monthly o REQUIERE VALIDACIÓN",
      "notes": "Contexto adicional"
    }
  ],
  "links": [
    {
      "from_object": "Objeto origen",
      "relationship": "Tipo de relación",
      "to_object": "Objeto destino"
    }
  ],
  "actions": [
    {
      "action_name": "Nombre de la acción",
      "object": "Objeto sobre el que actúa",
      "trigger": "Qué dispara la acción",
      "output": "Resultado de la acción"
    }
  ],
  "explanation": "Breve explicación de las decisiones tomadas"
}
`;

export const suggestKPIsPrompt_es = (payload: any) => `
Eres un consultor estratégico especializado en KPIs operativos para transformación digital.

CONTEXTO DEL PROYECTO:
- Cliente/Proyecto: ${payload.client_project || 'No especificado'}
- Industria: ${payload.industry || 'No especificado'}
- Business Unit: ${payload.business_unit || 'No especificado'}
- Procesos en scope: ${payload.processes_in_scope?.join(', ') || 'Ninguno'}
- Dolores de negocio:
  * Cuellos de botella: ${payload.pain_bottlenecks || 'N/A'}
  * Reprocesos: ${payload.pain_rework || 'N/A'}
  * Gaps de información: ${payload.pain_info_gaps || 'N/A'}
  * Errores: ${payload.pain_errors || 'N/A'}

TAREA:
Sugiere los 5-8 KPIs más relevantes que este proyecto debería impactar.

REGLAS:
- Enfócate en KPIs medibles y accionables
- Prioriza eficiencia operativa, reducción de errores, y tiempo de ciclo
- Si hay dolores específicos, alinea KPIs a esos dolores
- Cada KPI debe tener: nombre, métrica, baseline estimado, target aspiracional

OUTPUT:
Devuelve SOLO un JSON válido:

{
  "kpis": [
    {
      "name": "Nombre del KPI",
      "metric": "Cómo se mide (ej: % reducción, horas ahorradas)",
      "baseline": "Estado actual estimado",
      "target": "Meta a 6 meses",
      "rationale": "Por qué es relevante para este proyecto"
    }
  ],
  "explanation": "Resumen de la estrategia de KPIs propuesta"
}
`;

export const suggestMVPPlanPrompt_es = (payload: any) => `
Eres un Product Manager especializado en MVPs ágiles para plataformas de IA enterprise.

CONTEXTO DEL PROYECTO:
- Cliente/Proyecto: ${payload.client_project || 'No especificado'}
- Procesos en scope: ${payload.processes_in_scope?.join(', ') || 'Ninguno'}
- Agentes solicitados: ${payload.agents_requested?.join(', ') || 'Ninguno'}
- Sistemas involucrados: ${payload.systems?.join(', ') || 'Ninguno'}
- Ontología existente: ${payload.ontology_objects?.length || 0} objetos definidos

TAREA:
Propón un plan MVP de 30/60/90 días con priorización MUST/SHOULD/COULD (modelo MoSCoW).

REGLAS:
- MVP 30 días (MUST): Funcionalidad mínima viable que demuestra valor inmediato
- MVP 60 días (SHOULD): Extensiones que aumentan adopción
- MVP 90 días (COULD): Capacidades avanzadas o integraciones adicionales
- Sé realista con complejidad técnica y dependencias

OUTPUT:
Devuelve SOLO un JSON válido:

{
  "mvp_30": {
    "features": ["Feature 1 MUST", "Feature 2 MUST"],
    "rationale": "Por qué este es el núcleo"
  },
  "mvp_60": {
    "features": ["Feature 1 SHOULD", "Feature 2 SHOULD"],
    "rationale": "Cómo expande capacidades"
  },
  "mvp_90": {
    "features": ["Feature 1 COULD", "Feature 2 COULD"],
    "rationale": "Valor adicional y escalamiento"
  },
  "dependencies": ["Dependencia técnica 1", "Dependencia organizacional 2"],
  "risks": ["Riesgo 1", "Riesgo 2"],
  "explanation": "Resumen de la estrategia de roadmap"
}
`;

export const executiveSummaryPrompt_es = (payload: any) => `
Eres un consultor senior redactando un Executive Summary para un comité directivo.

CONTEXTO COMPLETO DEL INTAKE:
${JSON.stringify(payload, null, 2)}

TAREA:
Genera un resumen ejecutivo de 1 página (one-pager) en español formal, estilo consultora tier-1 (McKinsey/BCG/Accenture).

ESTRUCTURA REQUERIDA:
1. **Situación Actual**: 2-3 oraciones sobre el dolor de negocio
2. **Solución Propuesta**: Qué se va a construir y por qué
3. **Impacto Esperado**: KPIs clave y mejoras cuantificadas
4. **Alcance MVP**: Fases 30/60/90 en bullet points
5. **Riesgos y Validaciones**: Elementos marcados como "REQUIERE VALIDACIÓN"
6. **Próximos Pasos**: 3-4 acciones concretas

ESTILO:
- Tono: Formal, ejecutivo, orientado a acción
- Longitud: 300-400 palabras
- Sin tecnicismos innecesarios
- Énfasis en ROI y value proposition

OUTPUT:
Devuelve SOLO un JSON válido:

{
  "executive_summary": "Texto completo del resumen en markdown",
  "key_takeaways": ["Takeaway 1", "Takeaway 2", "Takeaway 3"],
  "approval_readiness": "READY|PENDING_VALIDATION",
  "explanation": "Notas del consultor sobre el estado del intake"
}
`;
