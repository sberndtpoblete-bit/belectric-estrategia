import { useState, useEffect, useRef, useCallback } from "react";

function hexToRgba(hex, alpha) {
  const r = parseInt(hex.slice(1, 3), 16), g = parseInt(hex.slice(3, 5), 16), b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r},${g},${b},${alpha})`;
}

const BSC_PERSPECTIVES = [
  { key: "financiera", label: "Financiera", icon: "💰", color: "#6B4C9A", question: "¿Qué resultados financieros debemos lograr?" },
  { key: "clientes", label: "Clientes", icon: "🤝", color: "#2D7DD2", question: "¿Cómo nos deben ver nuestros clientes?" },
  { key: "procesos", label: "Procesos Internos", icon: "⚙️", color: "#45B69C", question: "¿En qué procesos debemos ser excelentes?" },
  { key: "aprendizaje", label: "Aprendizaje y Crecimiento", icon: "🌱", color: "#E8530E", question: "¿Cómo seguimos mejorando y creando valor?" },
];

const SCALING_PHASES_BELECTRIC = [
  {
    id: 0, name: "Fase 0 — Blindar la caja", timeline: "Mes 1-3", color: "#E84855", icon: "🚨",
    people: "~25 (actual)", revenue: "Variable", margin: "Estabilizar", net: "Sobrevivir", backlog: "$2,000M",
    actions: [
      "Próximo mes bueno (>$120M): separar $40-50M como reserva INTOCABLE en cuenta aparte",
      "Revisar cobranza: acelerar todo estado de pago pendiente",
      "Negociar plazos con proveedores de materiales a 45-60 días",
      "Seguimiento demanda ejecutiva $160M + adicionales $30M retenidos",
      "P&L mensual real desde este mes — nunca más navegar a ciegas",
    ],
    hires: [], trigger: "Reserva de caja = 2 meses de costos fijos ($74M)",
    kpis: [
      { label: "Reserva de caja", target: "$74M", current: "$0" },
      { label: "Facturas por cobrar", target: "< 30 días", current: "$190M en juicio" },
      { label: "P&L mensual", target: "Implementado", current: "No existe" },
      { label: "Forecast 90 días", target: "Implementado", current: "No existe" },
    ],
  },
  {
    id: 1, name: "Fase 1 — Suavizar ingresos", timeline: "Mes 3-6", color: "#F7B32B", icon: "📊",
    people: "~25 (sin cambios)", revenue: "Piso >$74M", margin: "50% marginal", net: "Break-even constante", backlog: "$2,000M+",
    actions: [
      "Mínimo 4-5 proyectos activos simultáneos (no depender de 1-2 grandes)",
      "Diversificar tipos de cliente para no depender de un solo rubro",
      "Explorar contratos de mantenimiento/servicio = ingreso recurrente",
      "Forecast de facturación a 90 días basado en EP programados",
      "Alerta temprana: si forecast <$80M a 60 días → modo comercial agresivo",
    ],
    hires: [], trigger: "3 meses seguidos sin bajar de $74M (break-even)",
    kpis: [
      { label: "Facturación mínima", target: ">$74M siempre", current: "Baja a <$30M" },
      { label: "Proyectos activos", target: "4-5 simultáneos", current: "Variable" },
      { label: "Ingresos recurrentes", target: ">$10M/mes", current: "$0" },
      { label: "Reserva de caja", target: "$74M mantenida", current: "" },
    ],
  },
  {
    id: 2, name: "Fase 2 — Crecer comercialmente", timeline: "Mes 6-12", color: "#45B69C", icon: "📈",
    people: "+1 Jefe Comercial", revenue: "$120M+ promedio", margin: "50% marginal", net: "+$20M+", backlog: "$3,000M+",
    actions: [
      "Contratar jefe comercial: pasar de referidos pasivos a venta activa",
      "Pipeline formal: $200M+ en propuestas activas permanentes",
      "Desarrollar presencia en licitaciones (no solo contactos)",
      "Casos de éxito documentados para respaldo comercial",
      "CRM básico implementado",
    ],
    hires: ["1 Jefe Comercial ($2.5M bruto)"],
    trigger: "Backlog >$3,000M y 3 meses arriba de $100M facturación",
    kpis: [
      { label: "Facturación promedio", target: "$120M+/mes", current: "" },
      { label: "Pipeline activo", target: ">$200M", current: "Solo referidos" },
      { label: "Backlog", target: "$3,000M+", current: "$2,000M" },
      { label: "Resultado neto", target: "+$20M/mes", current: "" },
    ],
  },
  {
    id: 3, name: "Fase 3 — Escalar estructura", timeline: "Mes 12-18", color: "#2D7DD2", icon: "🚀",
    people: "+5 maestros, +1 admin", revenue: "$150-200M", margin: "50% marginal", net: "+$35M+", backlog: "$5,000M+",
    actions: [
      "Contratar segunda dotación de maestros cuando la actual esté al 100%",
      "Jefe admin/finanzas para profesionalizar la gestión",
      "Departamentos formales con procesos documentados",
      "Dashboard financiero en tiempo real",
      "Tu sueldo: $5M líquido + distribución de utilidades",
    ],
    hires: ["5 Maestros adicionales (~$7M)", "1 Jefe Admin/Finanzas ($2.5M)"],
    trigger: "Rechazando proyectos por capacidad + reserva de 3 meses",
    kpis: [
      { label: "Facturación", target: "$150-200M/mes", current: "" },
      { label: "Personas", target: "~32", current: "~25" },
      { label: "Reserva caja", target: "3 meses ($110M+)", current: "" },
      { label: "Resultado neto", target: "+$35M/mes", current: "" },
    ],
  },
];

const SCALING_PHASES_KIKI = [
  {
    id: 0, name: "Fase 0 — Estabilizar operación", timeline: "Mes 1-3", color: "#E84855", icon: "🚨",
    people: "Por definir", revenue: "Por definir", margin: "Estabilizar", net: "Estabilizar", backlog: "Por definir",
    actions: [
      "Determinar costos fijos mensuales reales",
      "Implementar P&L mensual",
      "Establecer reserva de caja objetivo",
      "Mapear flujo de caja actual",
      "Definir punto de equilibrio",
    ],
    hires: [], trigger: "Reserva de caja = 2 meses de costos fijos",
    kpis: [
      { label: "Reserva de caja", target: "2 meses costos fijos", current: "" },
      { label: "P&L mensual", target: "Implementado", current: "" },
      { label: "Forecast 90 días", target: "Implementado", current: "" },
      { label: "Costos fijos mapeados", target: "100%", current: "" },
    ],
  },
  {
    id: 1, name: "Fase 1 — Suavizar ingresos", timeline: "Mes 3-6", color: "#F7B32B", icon: "📊",
    people: "Por definir", revenue: "Por definir", margin: "Por definir", net: "Break-even constante", backlog: "Por definir",
    actions: [
      "Diversificar canales de venta",
      "Explorar ingresos recurrentes (suscripciones, membresías)",
      "Forecast de ventas a 90 días",
      "Establecer mínimo de clientes activos simultáneos",
      "Alerta temprana: si forecast baja del break-even",
    ],
    hires: [], trigger: "3 meses seguidos sobre break-even",
    kpis: [
      { label: "Ventas mínimas", target: ">Break-even", current: "" },
      { label: "Canales activos", target: "3+", current: "" },
      { label: "Ingresos recurrentes", target: "Por definir", current: "" },
      { label: "Reserva de caja", target: "Mantenida", current: "" },
    ],
  },
  {
    id: 2, name: "Fase 2 — Crecer comercialmente", timeline: "Mes 6-12", color: "#45B69C", icon: "📈",
    people: "Por definir", revenue: "Por definir", margin: "Por definir", net: "Crecimiento", backlog: "Por definir",
    actions: [
      "Desarrollar estrategia comercial activa",
      "Pipeline formal de oportunidades",
      "Expandir presencia de marca",
      "Documentar casos de éxito",
      "Implementar CRM",
    ],
    hires: [], trigger: "Crecimiento sostenido 3 meses + capacidad al límite",
    kpis: [
      { label: "Ventas promedio", target: "Por definir", current: "" },
      { label: "Pipeline activo", target: "Por definir", current: "" },
      { label: "Clientes nuevos/mes", target: "Por definir", current: "" },
      { label: "Resultado neto", target: "Positivo", current: "" },
    ],
  },
  {
    id: 3, name: "Fase 3 — Escalar estructura", timeline: "Mes 12-18", color: "#2D7DD2", icon: "🚀",
    people: "Por definir", revenue: "Por definir", margin: "Por definir", net: "Por definir", backlog: "Por definir",
    actions: [
      "Expandir equipo según demanda",
      "Profesionalizar gestión administrativa",
      "Departamentos formales con procesos documentados",
      "Dashboard financiero en tiempo real",
      "Distribución de utilidades formalizada",
    ],
    hires: [], trigger: "Rechazando oportunidades por capacidad + reserva de 3 meses",
    kpis: [
      { label: "Ventas", target: "Por definir", current: "" },
      { label: "Equipo", target: "Por definir", current: "" },
      { label: "Reserva caja", target: "3 meses", current: "" },
      { label: "Resultado neto", target: "Por definir", current: "" },
    ],
  },
];

const PILLARS = [
  {
    id: 1, name: "Visión y Estrategia", icon: "🧭", color: "#E8530E",
    bscLink: ["financiera", "clientes", "procesos", "aprendizaje"],
    items: [
      { key: "mision", label: "Misión", desc: "¿Por qué existimos?", template: { sections: [
        { key: "definicion", label: "Definición de la misión", placeholder: "Nuestra razón de ser..." },
        { key: "problema", label: "¿Qué problema resolvemos?", placeholder: "Problema principal que solucionamos..." },
        { key: "como", label: "¿Cómo lo resolvemos?", placeholder: "Nuestro enfoque único..." },
        { key: "paraquien", label: "¿Para quién lo hacemos?", placeholder: "Segmentos de clientes principales..." },
      ]}},
      { key: "vision", label: "Visión a 10 años", desc: "¿Cómo se ve el futuro?", template: { sections: [
        { key: "declaracion", label: "Declaración de visión", placeholder: "En 10 años seremos..." },
        { key: "tamano", label: "Tamaño y alcance", placeholder: "Empleados, facturación, cobertura..." },
        { key: "reputacion", label: "Reputación deseada", placeholder: "¿Cómo queremos ser conocidos?" },
        { key: "impacto", label: "Impacto en la industria", placeholder: "¿Qué cambio queremos generar?" },
      ]}},
      { key: "valores", label: "Valores core", desc: "3-5 principios innegociables", template: { sections: [
        { key: "valor1", label: "Valor #1", placeholder: "Nombre y qué significa en la práctica..." },
        { key: "valor2", label: "Valor #2", placeholder: "Nombre y qué significa en la práctica..." },
        { key: "valor3", label: "Valor #3", placeholder: "Nombre y qué significa en la práctica..." },
        { key: "antivalores", label: "Anti-valores", placeholder: "Lo que NO toleramos..." },
      ]}},
      { key: "bhag", label: "BHAG", desc: "Meta grande y audaz (10-25 años)", template: { sections: [
        { key: "meta", label: "La meta audaz", placeholder: "Nuestra meta más ambiciosa..." },
        { key: "porqueimporta", label: "¿Por qué importa?", placeholder: "La motivación profunda..." },
        { key: "indicador", label: "¿Cómo sabremos que lo logramos?", placeholder: "Indicadores concretos..." },
      ]}},
      { key: "meta3", label: "Meta a 3 años", desc: "Objetivo concreto a mediano plazo", template: { sections: [
        { key: "objetivo", label: "Objetivo principal", placeholder: "Facturación, equipo, mercado..." },
        { key: "ingresos", label: "Meta de ingresos", placeholder: "Facturación objetivo..." },
        { key: "equipo", label: "Meta de equipo", placeholder: "Tamaño y estructura en 3 años..." },
        { key: "hitos", label: "Hitos clave", placeholder: "Los 3-5 logros que deben ocurrir..." },
      ]}},
      { key: "planAnual", label: "Plan anual 2026", desc: "Prioridades del año", template: { sections: [
        { key: "temaAnual", label: "Tema del año", placeholder: "Una frase que resuma el foco..." },
        { key: "obj1", label: "Objetivo #1", placeholder: "Medible, con responsable..." },
        { key: "obj2", label: "Objetivo #2", placeholder: "Medible, con responsable..." },
        { key: "obj3", label: "Objetivo #3", placeholder: "Medible, con responsable..." },
      ]}},
      { key: "rocks", label: "Rocks trimestrales", desc: "3-5 prioridades del trimestre", template: { sections: [
        { key: "trimestre", label: "Trimestre actual", placeholder: "Ej: Q1 2026" },
        { key: "rock1", label: "Rock #1", placeholder: "Prioridad, responsable, meta, fecha..." },
        { key: "rock2", label: "Rock #2", placeholder: "Prioridad, responsable, meta, fecha..." },
        { key: "rock3", label: "Rock #3", placeholder: "Prioridad, responsable, meta, fecha..." },
      ]}},
      { key: "diferenciador", label: "Diferenciador", desc: "¿Por qué te eligen?", template: { sections: [
        { key: "propuesta", label: "Propuesta de valor única", placeholder: "Lo que nos hace diferentes..." },
        { key: "fortalezas", label: "Fortalezas clave", placeholder: "Las 3 cosas que hacemos mejor..." },
        { key: "competencia", label: "Competencia", placeholder: "Cómo se posicionan otros..." },
      ]}},
      { key: "clienteIdeal", label: "Cliente ideal", desc: "¿A quién le sirves mejor?", template: { sections: [
        { key: "perfil", label: "Perfil", placeholder: "Industria, tamaño, tipo de proyecto..." },
        { key: "dolor", label: "Su dolor principal", placeholder: "Problema urgente..." },
        { key: "presupuesto", label: "Rango de presupuesto", placeholder: "Tamaño de proyecto ideal..." },
        { key: "noIdeal", label: "Cliente NO ideal", placeholder: "Tipo que genera problemas..." },
      ]}},
    ],
  },
  {
    id: 2, name: "Estructura y Personas", icon: "👥", color: "#2D7DD2", bscLink: ["aprendizaje"],
    items: [
      { key: "organigrama", label: "Organigrama", desc: "Estructura jerárquica", template: { type: "orgchart", dataKey: "tree" }},
      { key: "roles", label: "Roles y responsabilidades", desc: "Cada puesto definido", template: { type: "roles", dataKey: "data" }},
      { key: "contratacion", label: "Proceso de contratación", desc: "Selección de talento", template: { type: "pipeline", dataKey: "pipeline" }},
      { key: "onboarding", label: "Onboarding", desc: "Integración de nuevos", template: { type: "checklist", dataKey: "checklist" }},
      { key: "evaluacion", label: "Evaluación de desempeño", desc: "Medición y feedback", template: { type: "scorecard", dataKey: "scorecard" }},
      { key: "cultura", label: "Cultura organizacional", desc: "Ambiente y dinámicas", template: { type: "cards", dataKey: "cards" }},
    ],
  },
  {
    id: 3, name: "Procesos y Operaciones", icon: "⚙️", color: "#45B69C", bscLink: ["procesos"],
    items: [
      { key: "procesosCore", label: "Procesos core", desc: "Ventas → Ejecución → Entrega", template: { type: "processflow", dataKey: "flow" }},
      { key: "sops", label: "SOPs", desc: "Procedimientos estándar", template: { type: "checklist", dataKey: "list", variant: "sops" }},
      { key: "calidadCtrl", label: "Control de calidad", desc: "Estándares", template: { type: "standards", dataKey: "standards" }},
      { key: "gestionProy", label: "Gestión de proyectos", desc: "Metodología", template: { type: "projectflow", dataKey: "projectflow" }},
    ],
  },
  {
    id: 4, name: "Comercial y Ventas", icon: "💼", color: "#F7B32B", bscLink: ["clientes", "financiera"],
    items: [
      { key: "pipeline", label: "Pipeline de ventas", desc: "Embudo comercial", template: { sections: [{ key: "etapas", label: "Etapas", placeholder: "Prospecto → Cierre..." }, { key: "conversion", label: "Conversión", placeholder: "% entre etapas..." }, { key: "volumen", label: "Volumen actual", placeholder: "Oportunidades por etapa..." }]}},
      { key: "procesoComercial", label: "Proceso comercial", desc: "Paso a paso", template: { sections: [{ key: "prospeccion", label: "Prospección", placeholder: "Cómo se generan oportunidades..." }, { key: "cierre", label: "Cierre", placeholder: "Cómo se cierra..." }]}},
      { key: "propuestas", label: "Propuestas", desc: "Templates profesionales", template: { sections: [{ key: "template", label: "Template", placeholder: "Formato estándar..." }, { key: "aprobacion", label: "Aprobación", placeholder: "Quién aprueba..." }]}},
      { key: "pricing", label: "Pricing", desc: "Estrategia de precios", template: { sections: [{ key: "estructura", label: "Estructura", placeholder: "Cómo se calculan..." }, { key: "margenes", label: "Márgenes objetivo", placeholder: "Por tipo de proyecto..." }]}},
      { key: "crm", label: "CRM", desc: "Gestión de clientes", template: { sections: [{ key: "herramienta", label: "Herramienta actual", placeholder: "Qué usan hoy..." }, { key: "ideal", label: "CRM ideal", placeholder: "Funcionalidades..." }]}},
      { key: "metricas", label: "Métricas comerciales", desc: "KPIs de ventas", template: { sections: [{ key: "kpis", label: "KPIs actuales", placeholder: "Qué miden..." }, { key: "metas", label: "Metas", placeholder: "Objetivos numéricos..." }]}},
    ],
  },
  {
    id: 5, name: "Finanzas", icon: "📊", color: "#6B4C9A", bscLink: ["financiera"],
    items: [
      { key: "pyl", label: "P&L", desc: "Estado de resultados", template: { sections: [{ key: "estructura", label: "Estructura del P&L", placeholder: "Ingresos - Costos = Margen..." }, { key: "frecuencia", label: "Frecuencia de revisión", placeholder: "Mensual, trimestral..." }, { key: "herramienta", label: "Herramienta", placeholder: "Excel, software contable..." }]}},
      { key: "flujoCaja", label: "Flujo de caja", desc: "Entradas y salidas", template: { sections: [{ key: "actual", label: "Estado actual", placeholder: "Visibilidad 30-60-90 días..." }, { key: "cobranza", label: "Cobranza", placeholder: "Cómo se cobran facturas..." }, { key: "reserva", label: "Reserva financiera", placeholder: "Meses de operación cubiertos..." }]}},
      { key: "costeo", label: "Costeo por proyecto", desc: "Costos directos y márgenes", template: { sections: [{ key: "metodologia", label: "Metodología", placeholder: "Materiales, MO, overhead..." }, { key: "seguimiento", label: "Seguimiento", placeholder: "Presupuesto vs real..." }, { key: "desviaciones", label: "Desviaciones", placeholder: "Qué pasa cuando se sale..." }]}},
      { key: "margenes", label: "Márgenes por línea", desc: "Rentabilidad por servicio", template: { sections: [{ key: "lineas", label: "Líneas de negocio", placeholder: "Cuáles y qué margen..." }, { key: "masRentable", label: "Más rentable", placeholder: "Cuál y por qué..." }]}},
      { key: "breakeven", label: "Punto de equilibrio", desc: "Break-even point", template: { type: "breakeven", dataKey: "breakeven" }},
      { key: "cxc", label: "Cuentas por cobrar", desc: "Cobranza y juicios activos", template: { sections: [{ key: "juicios", label: "Juicios activos", placeholder: "Demandas ejecutivas, montos, estado..." }, { key: "pendientes", label: "Facturas pendientes", placeholder: "Facturas no vencidas y próximas a vencer..." }, { key: "politica", label: "Política de cobranza", placeholder: "Plazos, escalamiento, acciones..." }]}},
      { key: "proyecciones", label: "Proyecciones", desc: "Forecast financiero", template: { sections: [{ key: "corto", label: "Proyección 12 meses", placeholder: "Mes a mes..." }, { key: "largo", label: "Proyección 3 años", placeholder: "Escenarios..." }]}},
      { key: "kpiFinancieros", label: "KPIs financieros", desc: "Indicadores clave", template: { sections: [{ key: "indicadores", label: "KPIs que se miden", placeholder: "Margen bruto, EBITDA, ROI..." }, { key: "metas", label: "Metas del año", placeholder: "Objetivos numéricos..." }]}},
    ],
  },
  {
    id: 6, name: "Marketing y Posicionamiento", icon: "📣", color: "#E84855", bscLink: ["clientes"],
    items: [
      { key: "marca", label: "Marca", desc: "Identidad visual y verbal", template: { sections: [{ key: "identidad", label: "Identidad visual", placeholder: "Logo, colores..." }, { key: "tono", label: "Tono", placeholder: "Profesional, cercano..." }]}},
      { key: "canales", label: "Canales de adquisición", desc: "Cómo llegan clientes", template: { sections: [{ key: "actuales", label: "Canales actuales", placeholder: "De dónde vienen..." }, { key: "nuevos", label: "Por explorar", placeholder: "Oportunidades..." }]}},
      { key: "presenciaDigital", label: "Presencia digital", desc: "Web, redes, portafolio", template: { sections: [{ key: "web", label: "Sitio web", placeholder: "URL, estado..." }, { key: "redes", label: "Redes sociales", placeholder: "Plataformas..." }]}},
      { key: "casosExito", label: "Casos de éxito", desc: "Testimonios", template: { sections: [{ key: "documentados", label: "Casos documentados", placeholder: "Cuántos y cuáles..." }, { key: "testimonios", label: "Testimonios", placeholder: "Formato y cantidad..." }]}},
    ],
  },
  {
    id: 7, name: "Sistemas y Tecnología", icon: "🖥️", color: "#3A3A3A", bscLink: ["procesos", "aprendizaje"],
    items: [
      { key: "herramientas", label: "Herramientas digitales", desc: "Stack tecnológico", template: { sections: [{ key: "stack", label: "Stack actual", placeholder: "Software, apps..." }, { key: "brechas", label: "Faltantes", placeholder: "Qué necesitan..." }]}},
      { key: "dashboards", label: "Dashboards", desc: "Paneles de control", template: { sections: [{ key: "existentes", label: "Actuales", placeholder: "Qué paneles..." }, { key: "ideales", label: "Ideal", placeholder: "Qué quieren ver..." }]}},
      { key: "automatizaciones", label: "Automatizaciones", desc: "Procesos automatizados", template: { sections: [{ key: "actuales", label: "Actuales", placeholder: "Qué está automatizado..." }, { key: "oportunidades", label: "Oportunidades", placeholder: "Qué se podría..." }]}},
      { key: "gestionDoc", label: "Gestión documental", desc: "Orden y acceso", template: { sections: [{ key: "sistema", label: "Sistema actual", placeholder: "Dónde guardan docs..." }, { key: "estructura", label: "Estructura", placeholder: "Hay orden lógico..." }]}},
    ],
  },
];

const STATUS_OPTIONS = [
  { value: "none", label: "Sin definir", emoji: "⬜", bg: "#2a2a2a", text: "#888" },
  { value: "idea", label: "En mi cabeza", emoji: "💭", bg: "#3d2a0f", text: "#FFB74D" },
  { value: "progress", label: "En progreso", emoji: "🔧", bg: "#0f2a3d", text: "#64B5F6" },
  { value: "done", label: "Completado", emoji: "✅", bg: "#0f3d1a", text: "#81C784" },
];

const INITIAL_CONTENT_BELECTRIC = {
  "5-pyl-estructura": "P&L MENSUAL REAL — BELECTRIC\n\nESTRUCTURA DE LA EMPRESA: ~25 personas\n  • Admin/oficina: 8-12 personas\n  • Maestros propios: ~15 personas\n  • Subcontrato: mínimo\n\nFACTURACIÓN: MUY VARIABLE\n  • Mes horrible: <$30M\n  • Mes malo: $50M\n  • Break-even: $74M\n  • Mes bueno: $120M\n  • Mes excelente: $180M\n\nCOSTOS VARIABLES (escalan con venta):\n  • Materiales: ~50% de la facturación\n\nCOSTOS FIJOS (se pagan siempre):\n  • Maestros propios (15 x ~$1M bruto + carga): ~$20M\n  • Admin/overhead: $15-18M\n  • Total fijo: $35-38M/mes\n\nMARGEN MARGINAL: ~50%\n  → Cada $1M nuevo de venta deja $500K de contribución\n  → Sobre el break-even ($74M), cada peso extra es casi pura utilidad",
  "5-breakeven-costosFijos": "COSTOS FIJOS MENSUALES: $35-38M\n\n  Maestros propios (15 personas): ~$20M\n    • Bruto promedio: $800K-1.2M\n    • Con carga (~35%): ~$1.3M promedio\n    • Capacidad actual: 80-90%\n\n  Overhead administrativo: $15-18M\n    • Sueldo GG: $3M+ líquido (~$5M con carga)\n    • Nómina admin (7-9 personas): ~$10M\n    • Arriendo + vehículos + servicios: $2-3M\n\n⚠️ Los maestros son costo FIJO disfrazado de directo.\nSe pagan estén o no en proyecto.",
  "5-breakeven-ventaMinima": "BREAK-EVEN: $74M/mes\n\nCálculo: $37M fijos / 0.50 margen contribución = $74M\n\nEscenarios de resultado:\n  $30M facturación → PÉRDIDA de $22M\n  $50M facturación → PÉRDIDA de $12M\n  $74M facturación → $0 (break-even)\n  $100M facturación → UTILIDAD de $13M\n  $120M facturación → UTILIDAD de $23M\n  $180M facturación → UTILIDAD de $53M\n\n⚠️ RIESGO: Sin reserva de caja, 2-3 meses malos seguidos = crisis de liquidez.\nCon $0 de colchón, un mes a $30M genera un déficit de $22M que no hay cómo cubrir.",
  "5-cxc-juicios": "JUICIOS ACTIVOS:\n\n1. DEMANDA EJECUTIVA: $160.000.000\n  • Estado: Demanda ejecutiva en curso + publicación DICOM\n  • Tiene facturas emitidas\n  • Se intentó plan de pago, pagó algunas cuotas, luego dejó de cumplir\n  • Se cortó relación y comunicación\n  • Tiempo estimado de resolución: 6-18 meses (incierto)\n  • ⚠️ NO contar esta plata como disponible\n\n2. ADICIONALES RETENIDOS: ~$30.000.000\n  • Último proyecto donde ya no hay personal en obra\n  • Sin herramienta de presión operacional\n  • Requiere documentación de aprobación de adicionales\n  • [PENDIENTE: Evaluar vía legal]",
  "5-cxc-politica": "[POR DEFINIR] Política de cobranza:\n  • Plazo estándar de pago\n  • Proceso de escalamiento (recordatorio → llamada → carta → legal)\n  • Criterios para cortar servicio\n  • Revisión de cliente antes de tomar proyectos nuevos\n  • Nunca más trabajar sin EP firmado",
  "5-flujoCaja-actual": "ESTADO CRÍTICO:\n  • Reserva de caja: $0 (al día)\n  • Sin visibilidad a 30-60-90 días\n  • Sin forecast de facturación\n  • Dependiente de que los meses buenos compensen los malos\n  • $190M en cuentas por cobrar en proceso legal (no disponible)",
  "5-flujoCaja-reserva": "META DE RESERVA:\n  • Mínima: 2 meses de costos fijos = $74M\n  • Ideal: 3 meses = $111M\n  • Acción: Próximo mes >$120M → separar $40-50M en cuenta aparte INTOCABLE",
  "5-proyecciones-corto": "PROYECCIÓN 12 MESES\n\nMes 1-3 (Fase 0 - Blindar caja):\n  • Construir reserva aprovechando meses buenos\n  • Implementar P&L mensual y forecast a 90 días\n  • Meta: $74M de reserva\n\nMes 3-6 (Fase 1 - Suavizar ingresos):\n  • Diversificar proyectos: mínimo 4-5 activos\n  • Explorar contratos de mantenimiento recurrente\n  • Meta: nunca facturar menos de $74M\n\nMes 6-12 (Fase 2 - Crecer comercialmente):\n  • Contratar jefe comercial\n  • Pasar de referidos pasivos a venta activa\n  • Meta: $120M+ promedio mensual",
  "5-proyecciones-largo": "PROYECCIÓN 3 AÑOS\n\nAño 1: Estabilizar ($120M/mes promedio)\n  • 25 personas, misma estructura\n  • Reserva de caja: 3 meses\n  • Resultado: +$20M/mes en meses promedio\n\nAño 2: Crecer ($150-200M/mes)\n  • 30 personas (+5 maestros, +1 jefe comercial)\n  • Pipeline activo >$300M permanente\n  • Backlog: $4,000M+\n\nAño 3: Escalar ($200-300M/mes)\n  • 35+ personas, departamentos formales\n  • Resultado: +$50M+/mes\n  • Sueldo GG: $5M líquido + distribución utilidades",
  "5-kpiFinancieros-indicadores": "KPIs CRÍTICOS — ORDEN DE PRIORIDAD:\n\n1. CAJA DISPONIBLE (en $ y en meses de costo fijo)\n2. Forecast de facturación a 90 días\n3. Facturación mensual vs break-even ($74M)\n4. Días de cobranza promedio\n5. N° de proyectos activos simultáneos\n6. Capacidad de maestros (%)\n7. Margen de contribución por proyecto\n8. Backlog en meses de facturación\n9. Pipeline comercial activo ($)",
  "5-kpiFinancieros-metas": "METAS 2026:\n\n• Reserva de caja: $0 → $74M (2 meses)\n• Facturación mínima mensual: nunca bajo $74M\n• Facturación promedio: $120M/mes\n• Proyectos activos: 4-5 simultáneos\n• Días de cobranza: <30 días\n• Backlog: $2,000M → $3,000M\n• Resultado neto acumulado: >$150M en el año",
  "1-meta3-objetivo": "META 3 AÑOS: De sobrevivir a empresa sólida\n\nAño 1 (2026): ESTABILIZAR\n  • ~25 personas (misma estructura)\n  • Facturación promedio: $120M/mes\n  • Reserva: 3 meses de caja\n  • Nunca bajo break-even\n\nAño 2 (2027): CRECER\n  • ~30 personas (+maestros +comercial)\n  • Facturación: $150-200M/mes\n  • Backlog: $4,000M+\n\nAño 3 (2028): ESCALAR\n  • 35+ personas, estructura formal\n  • Facturación: $200-300M/mes\n  • Empresa que funciona sin depender 100% del GG",
  "1-planAnual-temaAnual": "2026: \"El año de la caja y la estabilidad\"\n\nFoco: Pasar de operar al día sin colchón a tener reserva de 3 meses y facturación predecible.",
  "1-planAnual-obj1": "OBJ #1: Reserva de caja de $74M antes de junio\nIndicador: Saldo en cuenta de reserva\nAcción: Todo mes >$120M → separar diferencia en cuenta aparte\nResponsable: GG",
  "1-planAnual-obj2": "OBJ #2: Nunca facturar bajo $74M (break-even)\nIndicador: Facturación mensual\nAcción: Forecast a 90 días + alerta si <$80M → modo comercial agresivo\nAcción: Mínimo 4-5 proyectos activos siempre\nResponsable: GG",
  "1-planAnual-obj3": "OBJ #3: Backlog a $3,000M antes de diciembre\nIndicador: Backlog total contratado\nAcción: Pipeline de propuestas >$200M/mes\nAcción: Diversificar canales (no solo referidos)\nResponsable: GG",
  "1-rocks-trimestre": "Q1 2026 (Enero - Marzo)",
  "1-rocks-rock1": "ROCK #1: Implementar P&L mensual y forecast a 90 días\nEntregable: Planilla/sistema funcionando\nFecha: Marzo 2026\nMeta: Visibilidad financiera real, nunca más navegar a ciegas",
  "1-rocks-rock2": "ROCK #2: Iniciar reserva de caja\nEntregable: Cuenta separada con primer depósito\nFecha: Primer mes bueno que llegue\nMeta: Mínimo $30M de reserva en Q1",
  "1-rocks-rock3": "ROCK #3: Conseguir 1-2 proyectos nuevos\nEntregable: Contratos firmados\nFecha: Marzo 2026\nMeta: Mantener 4+ proyectos activos, llenar 10-20% de capacidad libre de maestros",
  "4-pipeline-etapas": "[POR DEFINIR]\nHoy no hay pipeline formal. Los proyectos llegan por contactos y referidos.\nRiesgo: Cuando se acaban los referidos, no hay plan B.\n\nPropuesta de etapas:\n  1. Referido/contacto recibido\n  2. Reunión / visita técnica\n  3. Cotización enviada\n  4. Negociación\n  5. Contrato firmado",
  "4-metricas-kpis": "[POR IMPLEMENTAR]\nKPIs comerciales necesarios:\n  • N° de oportunidades activas\n  • Valor del pipeline ($)\n  • Tasa de cierre (%)\n  • Tiempo promedio de cierre (días)\n  • N° de proyectos activos\n  • Origen del proyecto (referido, licitación, proactivo)",
};

const INITIAL_STATUSES_BELECTRIC = {
  "5-pyl": "progress", "5-breakeven": "progress", "5-cxc": "progress", "5-flujoCaja": "idea",
  "5-costeo": "idea", "5-margenes": "none", "5-proyecciones": "idea", "5-kpiFinancieros": "idea",
  "1-meta3": "idea", "1-planAnual": "idea", "1-rocks": "idea",
  "1-mision": "none", "1-vision": "none", "1-valores": "none", "1-bhag": "none",
  "1-diferenciador": "none", "1-clienteIdeal": "none",
  "4-pipeline": "idea", "4-metricas": "none", "4-procesoComercial": "none",
  "4-propuestas": "none", "4-pricing": "none", "4-crm": "none",
};

const COMPANIES = {
  belectric: {
    key: "belectric", name: "Belectric", storageKey: "belectric-v4",
    primaryColor: "#E8530E", secondaryColor: "#F7B32B",
    gradient: "linear-gradient(135deg,#E8530E,#F7B32B)",
    tagline: "~25 personas · 7 pilares · Plan de estabilización",
    scalingPhases: SCALING_PHASES_BELECTRIC,
    initialContent: INITIAL_CONTENT_BELECTRIC,
    initialStatuses: INITIAL_STATUSES_BELECTRIC,
    alerts: [
      { icon: "🚨", title: "Fase 0: Blindar la caja — Reserva $0 de $74M", subtitle: "Plan de estabilización →", bg: "rgba(232,72,85,.1)", border: "rgba(232,72,85,.2)", color: "#E84855", onClick: "scaling" },
      { icon: "⚖️", title: "$190M en cobranza judicial activa", subtitle: "$160M demanda ejecutiva + $30M adicionales retenidos", bg: "rgba(107,76,154,.08)", border: "rgba(107,76,154,.15)", color: "#6B4C9A", onClick: null },
    ],
    scalingSummary: { title: "📍 Situación actual", color: "#E84855", bg: "rgba(232,72,85,.08)", border: "rgba(232,72,85,.15)", lines: ["~25 personas · Facturación variable ($30M-$180M) · Costos fijos $37M/mes", "Break-even: $74M · Reserva caja: $0 · CxC en juicio: $190M", "Maestros al 80-90% · Proyectos llegan por referidos"] },
    scalingRules: {
      never: ["Reserva de caja < 2 meses de costos fijos ($74M)", "Facturación promedio 3 meses < break-even ($74M)", "No tienes forecast implementado a 90 días"],
      go: ["Reserva de caja > 3 meses ($111M)", "3 meses seguidos arriba de $100M", "Maestros al 100% y rechazando proyectos", "Backlog > 9 meses de facturación actual"],
    },
  },
  kiki: {
    key: "kiki", name: "Kiki Cosméticos", storageKey: "kiki-v4",
    primaryColor: "#E91E90", secondaryColor: "#FF6FB5",
    gradient: "linear-gradient(135deg,#E91E90,#FF6FB5)",
    tagline: "7 pilares · Plan estratégico",
    scalingPhases: SCALING_PHASES_KIKI,
    initialContent: {},
    initialStatuses: {},
    alerts: [],
    scalingSummary: { title: "📍 Situación actual", color: "#E91E90", bg: "rgba(233,30,144,.08)", border: "rgba(233,30,144,.15)", lines: ["Completar con datos reales de la empresa"] },
    scalingRules: {
      never: ["Reserva de caja < 2 meses de costos fijos", "Ventas promedio 3 meses < break-even", "No tienes forecast implementado a 90 días"],
      go: ["Reserva de caja > 3 meses de costos fijos", "3 meses seguidos sobre break-even", "Capacidad operativa al 100%", "Pipeline > 9 meses de ventas actuales"],
    },
  },
};
const COMPANY_ORDER = ["belectric", "kiki"];

function genId() { return Math.random().toString(36).slice(2, 9); }
const VBtn = (label, onClick, color, small) => <button onClick={onClick} style={{ padding: small ? "4px 10px" : "8px 14px", borderRadius: 8, border: `1px solid ${color || "#888"}44`, background: `${color || "#888"}18`, color: color || "#888", fontSize: small ? 11 : 12, fontWeight: 600, cursor: "pointer", fontFamily: "'DM Sans',sans-serif" }}>{label}</button>;
const VInp = (value, onChange, placeholder, style2) => <input value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} style={{ padding: "8px 12px", borderRadius: 8, border: "1px solid rgba(255,255,255,.1)", background: "rgba(0,0,0,.3)", color: "#e0e0e0", fontSize: 13, fontFamily: "'DM Sans',sans-serif", outline: "none", width: "100%", boxSizing: "border-box", ...style2 }} />;

function OrgChartEditor({ pid, ik, ct, onUpdate, color }) {
  const getJSON = (key, fb) => { try { return JSON.parse(ct[key] || "null") || fb; } catch { return fb; } };
  const setJSON = (key, d) => onUpdate(key, JSON.stringify(d));
  const [tab, setTab] = useState("actual");
  const defaultTree = { nodes: [{ id: "root", name: "Director General", cargo: "", children: [] }] };
  const actualKey = `${pid}-${ik}-tree`;
  const projKey = `${pid}-${ik}-tree-proj`;
  const dk = tab === "proyectado" ? projKey : actualKey;
  const actualTree = getJSON(actualKey, defaultTree);
  const tree = getJSON(dk, defaultTree);
  const save = (t) => setJSON(dk, t);
  const updateNode = (nodes, id, fn) => nodes.map(n => n.id === id ? fn({ ...n, children: [...(n.children||[])] }) : { ...n, children: updateNode(n.children||[], id, fn) });
  const removeNode = (nodes, id) => nodes.filter(n => n.id !== id).map(n => ({ ...n, children: removeNode(n.children||[], id) }));
  const addChild = (parentId) => { const nid = genId(); save({ nodes: updateNode(tree.nodes, parentId, n => ({ ...n, children: [...(n.children||[]), { id: nid, name: "Nuevo cargo", cargo: "", children: [] }] })) }); };
  const editNode = (id, field, val) => save({ nodes: updateNode(tree.nodes, id, n => ({ ...n, [field]: val })) });
  const delNode = (id) => save({ nodes: removeNode(tree.nodes, id) });
  const [editing, setEditing] = useState(null);
  const [moving, setMoving] = useState(null);
  const [hoverTarget, setHoverTarget] = useState(null);
  const switchTab = (t) => {
    if (t === "proyectado" && !getJSON(projKey, null)) {
      setJSON(projKey, actualTree);
    }
    setTab(t);
  };
  const findNode = (nodes, id) => { for (const n of nodes) { if (n.id === id) return n; const f = findNode(n.children || [], id); if (f) return f; } return null; };
  const isDescendant = (nodes, ancestorId, targetId) => { const find = (ns) => { for (const n of ns) { if (n.id === ancestorId) { const chk = (cs) => cs.some(c => c.id === targetId || chk(c.children || [])); return chk(n.children || []); } const r = find(n.children || []); if (r) return r; } return false; }; return find(nodes); };
  const moveNode = (nodeId, newParentId) => {
    if (nodeId === newParentId || isDescendant(tree.nodes, nodeId, newParentId)) return;
    const nodeCopy = JSON.parse(JSON.stringify(findNode(tree.nodes, nodeId)));
    const cleaned = removeNode(tree.nodes, nodeId);
    const updated = updateNode(cleaned, newParentId, p => ({ ...p, children: [...(p.children || []), nodeCopy] }));
    save({ nodes: updated }); setMoving(null); setHoverTarget(null);
  };
  const groupChildren = (children) => {
    const groups = [], map = {};
    for (const c of children) {
      if (c.cargo && map[c.cargo] !== undefined) { groups[map[c.cargo]].nodes.push(c); }
      else { if (c.cargo) map[c.cargo] = groups.length; groups.push({ cargo: c.cargo || null, nodes: [c] }); }
    }
    return groups;
  };
  const renderNode = (node, depth, inGroup = false) => {
    const isEdit = editing === node.id;
    const isMoving = moving === node.id;
    const isValidTarget = moving && !isMoving && !isDescendant(tree.nodes, moving, node.id);
    const isInvalid = moving && (isMoving || isDescendant(tree.nodes, moving, node.id));
    const isHover = hoverTarget === node.id;
    return <div key={node.id} style={{ display: "flex", flexDirection: "column", alignItems: "center", minWidth: inGroup ? 90 : 120 }}>
      <div
        onMouseEnter={isValidTarget ? () => setHoverTarget(node.id) : undefined}
        onMouseLeave={isValidTarget ? () => setHoverTarget(null) : undefined}
        style={{ padding: "10px 14px", borderRadius: 10,
          background: isMoving ? "rgba(45,125,210,.15)" : depth === 0 ? `${color}22` : (isValidTarget && isHover) ? "rgba(76,175,80,.1)" : "rgba(255,255,255,.05)",
          border: isMoving ? "2px solid #2D7DD2" : (isValidTarget && isHover) ? "2px dashed #4CAF50" : `1px solid ${depth === 0 ? color + "55" : "rgba(255,255,255,.08)"}`,
          minWidth: inGroup ? 80 : 100, textAlign: "center", position: "relative",
          opacity: isInvalid && !isMoving ? 0.4 : 1, cursor: isValidTarget ? "pointer" : undefined,
          transition: "border-color .15s, opacity .15s, background .15s" }}>
        {isEdit ? <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {VInp(node.name, v => editNode(node.id, "name", v), "Nombre")}
          {VInp(node.cargo, v => editNode(node.id, "cargo", v), "Cargo")}
          <div style={{ display: "flex", gap: 4, justifyContent: "center", flexWrap: "wrap" }}>{VBtn("✓", () => setEditing(null), "#4CAF50", true)}{node.id !== "root" && VBtn("↗ Mover", () => { setMoving(node.id); setEditing(null); }, "#2D7DD2", true)}{node.id !== "root" && VBtn("🗑", () => { delNode(node.id); setEditing(null); }, "#E84855", true)}</div>
        </div> : <div onClick={() => { if (moving && isValidTarget) { moveNode(moving, node.id); } else if (!moving) { setEditing(node.id); } }} style={{ cursor: isValidTarget ? "pointer" : (!moving ? "pointer" : "default") }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: depth === 0 ? color : "#e0e0e0" }}>{node.name || "..."}</div>
          {node.cargo && !inGroup && <div style={{ fontSize: 11, color: "#888", marginTop: 2 }}>{node.cargo}</div>}
        </div>}
        {!moving && <button onClick={() => addChild(node.id)} style={{ position: "absolute", bottom: -10, left: "50%", transform: "translateX(-50%)", width: 20, height: 20, borderRadius: "50%", border: `1px solid ${color}44`, background: "#1a1a2e", color: color, fontSize: 14, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", lineHeight: 1, padding: 0 }}>+</button>}
      </div>
      {(node.children||[]).length > 0 && (() => {
        const groups = groupChildren(node.children);
        return <>
          <div style={{ width: 2, height: 20, background: "rgba(255,255,255,.1)" }} />
          <div style={{ display: "flex", position: "relative" }}>
            {groups.map((g, gIdx) => {
              const onlyG = groups.length === 1;
              const firstG = gIdx === 0;
              const lastG = gIdx === groups.length - 1;
              const multi = g.cargo && g.nodes.length > 1;
              return <div key={multi ? "g-" + g.cargo : g.nodes[0].id} style={{ display: "flex", flexDirection: "column", alignItems: "center", position: "relative", padding: "0 6px" }}>
                {!onlyG && <div style={{ position: "absolute", top: 0, left: firstG ? "50%" : 0, right: lastG ? "50%" : 0, height: 2, background: "rgba(255,255,255,.1)" }} />}
                <div style={{ width: 2, height: 16, background: "rgba(255,255,255,.1)" }} />
                {multi ? <div style={{ border: `1px dashed ${color}44`, borderRadius: 12, padding: "8px 8px 4px", background: `${color}08` }}>
                  <div style={{ fontSize: 10, fontWeight: 700, color: color, textTransform: "uppercase", letterSpacing: .5, textAlign: "center", marginBottom: 6, opacity: .7 }}>{g.cargo}</div>
                  <div style={{ display: "flex", gap: 8 }}>{g.nodes.map(c => renderNode(c, depth + 1, true))}</div>
                </div> : renderNode(g.nodes[0], depth + 1, false)}
              </div>;
            })}
          </div>
        </>;
      })()}
    </div>;
  };
  return <div>
    <div style={{ display: "flex", gap: 8, marginBottom: 16, alignItems: "center" }}>
      {["actual", "proyectado"].map(t => <button key={t} onClick={() => switchTab(t)} style={{ padding: "6px 14px", borderRadius: 8, border: "none", fontSize: 12, fontWeight: 600, cursor: "pointer", background: tab === t ? color + "33" : "rgba(255,255,255,.05)", color: tab === t ? color : "#888", fontFamily: "'DM Sans',sans-serif", textTransform: "capitalize" }}>{t}</button>)}
      {tab === "proyectado" && <div style={{ marginLeft: "auto" }}>{VBtn("↩ Resetear desde actual", () => { if (window.confirm("¿Reemplazar organigrama proyectado con el actual?")) setJSON(projKey, actualTree); }, "#E84855", true)}</div>}
    </div>
    {moving && (() => { const mn = findNode(tree.nodes, moving); return <div style={{ padding: "10px 16px", borderRadius: 10, marginBottom: 12, background: "rgba(45,125,210,.12)", border: "1px solid rgba(45,125,210,.3)", display: "flex", alignItems: "center", justifyContent: "space-between", fontSize: 13, color: "#e0e0e0" }}>
      <span>Selecciona nuevo padre para <strong>{mn?.name || "..."}</strong></span>
      {VBtn("Cancelar", () => { setMoving(null); setHoverTarget(null); }, "#E84855", true)}
    </div>; })()}
    <div style={{ overflowX: "auto", padding: "20px 0" }}>
      <div style={{ display: "inline-flex", minWidth: "100%", justifyContent: "center" }}>
        {tree.nodes.map(n => renderNode(n, 0))}
      </div>
    </div>
    <div style={{ fontSize: 11, color: "#555", marginTop: 8 }}>{moving ? "Clic en un nodo válido para mover · Nodos atenuados no son válidos" : "Toca un nodo para editar · + para agregar subordinado"}</div>
  </div>;
}

function RolesEditor({ pid, ik, ct, onUpdate, color }) {
  const getJSON = (key, fb) => { try { return JSON.parse(ct[key] || "null") || fb; } catch { return fb; } };
  const setJSON = (key, d) => onUpdate(key, JSON.stringify(d));
  const dk = `${pid}-${ik}-data`;
  const data = getJSON(dk, []);
  const save = (d) => setJSON(dk, d);
  const [exp, setExp] = useState(null);
  const depts = [...new Set(data.map(r => r.dept || "Sin departamento"))];
  const addRole = () => save([...data, { id: genId(), name: "Nuevo cargo", dept: "General", reporta: "", responsabilidades: [""] }]);
  const updateRole = (id, field, val) => save(data.map(r => r.id === id ? { ...r, [field]: val } : r));
  const delRole = (id) => save(data.filter(r => r.id !== id));
  return <div>
    {depts.length === 0 && <div style={{ padding: 20, textAlign: "center", color: "#666", fontSize: 13 }}>No hay roles definidos aún</div>}
    {depts.map(dept => <div key={dept} style={{ marginBottom: 16 }}>
      <div style={{ fontSize: 12, fontWeight: 700, color: color, textTransform: "uppercase", letterSpacing: 1, marginBottom: 8, padding: "4px 0", borderBottom: `1px solid ${color}22` }}>📁 {dept}</div>
      <div style={{ display: "grid", gap: 8 }}>
        {data.filter(r => (r.dept || "Sin departamento") === dept).map(r => {
          const isExp = exp === r.id;
          return <div key={r.id} style={{ padding: 12, borderRadius: 10, background: "rgba(255,255,255,.04)", border: `1px solid ${isExp ? color + "44" : "rgba(255,255,255,.06)"}` }}>
            {isExp ? <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {VInp(r.name, v => updateRole(r.id, "name", v), "Nombre del cargo")}
              {VInp(r.dept, v => updateRole(r.id, "dept", v), "Departamento")}
              {VInp(r.reporta, v => updateRole(r.id, "reporta", v), "Reporta a...")}
              <div style={{ fontSize: 11, color: "#888", marginTop: 4 }}>Responsabilidades:</div>
              {(r.responsabilidades||[""]).map((resp, idx) => <div key={idx} style={{ display: "flex", gap: 4 }}>
                {VInp(resp, v => { const nr = [...(r.responsabilidades||[""])]; nr[idx] = v; updateRole(r.id, "responsabilidades", nr); }, `Responsabilidad ${idx+1}`)}
                {idx === (r.responsabilidades||[""]).length - 1 && VBtn("+", () => updateRole(r.id, "responsabilidades", [...(r.responsabilidades||[""]), ""]), color, true)}
              </div>)}
              <div style={{ display: "flex", gap: 6 }}>{VBtn("✓ Cerrar", () => setExp(null), "#4CAF50", true)}{VBtn("🗑 Eliminar", () => { delRole(r.id); setExp(null); }, "#E84855", true)}</div>
            </div> : <div onClick={() => setExp(r.id)} style={{ cursor: "pointer", display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ fontSize: 20 }}>👤</span>
              <div style={{ flex: 1 }}><div style={{ fontSize: 14, fontWeight: 600 }}>{r.name}</div><div style={{ fontSize: 11, color: "#888" }}>{r.reporta ? `Reporta a: ${r.reporta}` : ""} · {(r.responsabilidades||[]).filter(Boolean).length} responsabilidades</div></div>
              <span style={{ color: "#444" }}>✏️</span>
            </div>}
          </div>;
        })}
      </div>
    </div>)}
    <div style={{ marginTop: 12 }}>{VBtn("+ Agregar rol", addRole, color)}</div>
  </div>;
}

function PipelineEditor({ pid, ik, ct, onUpdate, color }) {
  const getJSON = (key, fb) => { try { return JSON.parse(ct[key] || "null") || fb; } catch { return fb; } };
  const setJSON = (key, d) => onUpdate(key, JSON.stringify(d));
  const dk = `${pid}-${ik}-pipeline`;
  const STAGES = ["Búsqueda", "Filtro CV", "Entrevista", "Prueba técnica", "Oferta", "Contratado"];
  const STAGE_COLORS = ["#E84855", "#F7B32B", "#2D7DD2", "#6B4C9A", "#45B69C", "#4CAF50"];
  const data = getJSON(dk, { candidates: [] });
  const save = (d) => setJSON(dk, d);
  const addCandidate = () => save({ candidates: [...data.candidates, { id: genId(), name: "Nuevo candidato", cargo: "", stage: 0, notas: "" }] });
  const updateCand = (id, field, val) => save({ candidates: data.candidates.map(c => c.id === id ? { ...c, [field]: val } : c) });
  const delCand = (id) => save({ candidates: data.candidates.filter(c => c.id !== id) });
  const moveCand = (id, dir) => save({ candidates: data.candidates.map(c => c.id === id ? { ...c, stage: Math.max(0, Math.min(STAGES.length - 1, c.stage + dir)) } : c) });
  const [editId, setEditId] = useState(null);
  return <div>
    <div style={{ overflowX: "auto", paddingBottom: 12 }}>
      <div style={{ display: "flex", gap: 8, minWidth: STAGES.length * 160 }}>
        {STAGES.map((stage, si) => {
          const cands = data.candidates.filter(c => c.stage === si);
          return <div key={si} style={{ flex: 1, minWidth: 150 }}>
            <div style={{ padding: "8px 10px", borderRadius: "8px 8px 0 0", background: STAGE_COLORS[si] + "22", borderBottom: `2px solid ${STAGE_COLORS[si]}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: 12, fontWeight: 700, color: STAGE_COLORS[si] }}>{stage}</span>
              <span style={{ fontSize: 11, color: "#888", background: "rgba(0,0,0,.3)", padding: "2px 6px", borderRadius: 4 }}>{cands.length}</span>
            </div>
            <div style={{ minHeight: 80, padding: 6, background: "rgba(0,0,0,.15)", borderRadius: "0 0 8px 8px" }}>
              {cands.map(c => <div key={c.id} style={{ padding: 8, marginBottom: 6, borderRadius: 8, background: "rgba(255,255,255,.05)", border: "1px solid rgba(255,255,255,.08)" }}>
                {editId === c.id ? <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                  {VInp(c.name, v => updateCand(c.id, "name", v), "Nombre")}
                  {VInp(c.cargo, v => updateCand(c.id, "cargo", v), "Cargo postulado")}
                  {VInp(c.notas, v => updateCand(c.id, "notas", v), "Notas")}
                  <div style={{ display: "flex", gap: 4 }}>{VBtn("✓", () => setEditId(null), "#4CAF50", true)}{VBtn("🗑", () => { delCand(c.id); setEditId(null); }, "#E84855", true)}</div>
                </div> : <div>
                  <div onClick={() => setEditId(c.id)} style={{ cursor: "pointer" }}>
                    <div style={{ fontSize: 13, fontWeight: 600 }}>{c.name}</div>
                    {c.cargo && <div style={{ fontSize: 11, color: "#888" }}>{c.cargo}</div>}
                    {c.notas && <div style={{ fontSize: 10, color: "#666", marginTop: 4, fontStyle: "italic" }}>{c.notas}</div>}
                  </div>
                  <div style={{ display: "flex", gap: 4, marginTop: 6, justifyContent: "center" }}>
                    {si > 0 && <button onClick={() => moveCand(c.id, -1)} style={{ padding: "2px 8px", borderRadius: 4, border: "1px solid rgba(255,255,255,.1)", background: "none", color: "#888", fontSize: 11, cursor: "pointer" }}>←</button>}
                    {si < STAGES.length - 1 && <button onClick={() => moveCand(c.id, 1)} style={{ padding: "2px 8px", borderRadius: 4, border: "1px solid rgba(255,255,255,.1)", background: "none", color: "#888", fontSize: 11, cursor: "pointer" }}>→</button>}
                  </div>
                </div>}
              </div>)}
              {si === 0 && <button onClick={addCandidate} style={{ width: "100%", padding: 6, borderRadius: 6, border: "1px dashed rgba(255,255,255,.15)", background: "none", color: "#666", fontSize: 11, cursor: "pointer", fontFamily: "'DM Sans',sans-serif" }}>+ Candidato</button>}
            </div>
          </div>;
        })}
      </div>
    </div>
  </div>;
}

function ChecklistEditor({ pid, ik, ct, onUpdate, color, variant }) {
  const getJSON = (key, fb) => { try { return JSON.parse(ct[key] || "null") || fb; } catch { return fb; } };
  const setJSON = (key, d) => onUpdate(key, JSON.stringify(d));
  const dk = `${pid}-${ik}-${variant === "sops" ? "list" : "checklist"}`;
  const SOP_STATES = [{ v: "done", l: "✅ Documentado", c: "#4CAF50" }, { v: "progress", l: "🔧 En progreso", c: "#2196F3" }, { v: "missing", l: "⬜ Faltante", c: "#888" }];
  const defSections = variant === "sops" ? [{ id: genId(), title: "SOPs", items: [] }] : [{ id: genId(), title: "Semana 1", items: [] }, { id: genId(), title: "Semana 2", items: [] }, { id: genId(), title: "Semana 3-4", items: [] }];
  const data = getJSON(dk, { sections: defSections });
  const save = (d) => setJSON(dk, d);
  const addSection = () => save({ sections: [...data.sections, { id: genId(), title: "Nueva sección", items: [] }] });
  const addItem = (secId) => save({ sections: data.sections.map(s => s.id === secId ? { ...s, items: [...s.items, { id: genId(), text: "", desc: "", done: false, estado: "missing" }] } : s) });
  const updateItem = (secId, itemId, field, val) => save({ sections: data.sections.map(s => s.id === secId ? { ...s, items: s.items.map(i => i.id === itemId ? { ...i, [field]: val } : i) } : s) });
  const delItem = (secId, itemId) => save({ sections: data.sections.map(s => s.id === secId ? { ...s, items: s.items.filter(i => i.id !== itemId) } : s) });
  const renameSection = (secId, title) => save({ sections: data.sections.map(s => s.id === secId ? { ...s, title } : s) });
  const totalItems = data.sections.reduce((a, s) => a + s.items.length, 0);
  const doneItems = data.sections.reduce((a, s) => a + s.items.filter(i => variant === "sops" ? i.estado === "done" : i.done).length, 0);
  return <div>
    {totalItems > 0 && <div style={{ marginBottom: 12, fontSize: 12, color: "#888" }}>{doneItems}/{totalItems} completados
      <div style={{ height: 4, borderRadius: 2, background: "rgba(255,255,255,.06)", marginTop: 6, overflow: "hidden" }}><div style={{ height: "100%", borderRadius: 2, background: color, width: `${totalItems ? (doneItems/totalItems)*100 : 0}%`, transition: "width .3s" }} /></div>
    </div>}
    {data.sections.map(sec => <div key={sec.id} style={{ marginBottom: 16 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
        {VInp(sec.title, v => renameSection(sec.id, v), "Sección", { fontSize: 14, fontWeight: 700, background: "transparent", border: "none", borderBottom: "1px solid rgba(255,255,255,.1)", borderRadius: 0, padding: "4px 0", width: "auto", flex: 1 })}
      </div>
      {sec.items.map(item => <div key={item.id} style={{ display: "flex", alignItems: "flex-start", gap: 8, marginBottom: 6, padding: "8px 10px", borderRadius: 8, background: "rgba(255,255,255,.03)", border: "1px solid rgba(255,255,255,.06)" }}>
        {variant === "sops" ? <select value={item.estado || "missing"} onChange={e => updateItem(sec.id, item.id, "estado", e.target.value)} style={{ padding: "4px 6px", borderRadius: 6, border: "1px solid rgba(255,255,255,.1)", background: "rgba(0,0,0,.3)", color: SOP_STATES.find(s => s.v === (item.estado||"missing"))?.c || "#888", fontSize: 11, fontFamily: "'DM Sans',sans-serif", cursor: "pointer" }}>
          {SOP_STATES.map(s => <option key={s.v} value={s.v}>{s.l}</option>)}
        </select> : <input type="checkbox" checked={item.done} onChange={e => updateItem(sec.id, item.id, "done", e.target.checked)} style={{ marginTop: 4, accentColor: color, cursor: "pointer" }} />}
        <div style={{ flex: 1 }}>
          {VInp(item.text, v => updateItem(sec.id, item.id, "text", v), variant === "sops" ? "Nombre del SOP" : "Tarea", { fontSize: 13, marginBottom: 4, textDecoration: item.done && variant !== "sops" ? "line-through" : "none", opacity: item.done && variant !== "sops" ? 0.5 : 1 })}
          {VInp(item.desc, v => updateItem(sec.id, item.id, "desc", v), variant === "sops" ? "Área / notas" : "Descripción", { fontSize: 11, color: "#888" })}
        </div>
        <button onClick={() => delItem(sec.id, item.id)} style={{ background: "none", border: "none", color: "#555", fontSize: 12, cursor: "pointer", padding: 4 }}>✕</button>
      </div>)}
      <button onClick={() => addItem(sec.id)} style={{ padding: "4px 10px", borderRadius: 6, border: "1px dashed rgba(255,255,255,.12)", background: "none", color: "#666", fontSize: 11, cursor: "pointer", fontFamily: "'DM Sans',sans-serif", marginTop: 4 }}>+ {variant === "sops" ? "SOP" : "Tarea"}</button>
    </div>)}
    <div style={{ marginTop: 8 }}>{VBtn("+ Sección", addSection, color)}</div>
  </div>;
}

function ScorecardEditor({ pid, ik, ct, onUpdate, color }) {
  const getJSON = (key, fb) => { try { return JSON.parse(ct[key] || "null") || fb; } catch { return fb; } };
  const setJSON = (key, d) => onUpdate(key, JSON.stringify(d));
  const dk = `${pid}-${ik}-scorecard`;
  const data = getJSON(dk, { frecuencia: "Trimestral", formato: "1-5", roles: [] });
  const save = (d) => setJSON(dk, d);
  const addRole = () => save({ ...data, roles: [...data.roles, { id: genId(), name: "Nuevo rol", metricas: [{ id: genId(), kpi: "", meta: "", peso: "" }] }] });
  const updateRole = (rid, field, val) => save({ ...data, roles: data.roles.map(r => r.id === rid ? { ...r, [field]: val } : r) });
  const delRole = (rid) => save({ ...data, roles: data.roles.filter(r => r.id !== rid) });
  const addMetric = (rid) => save({ ...data, roles: data.roles.map(r => r.id === rid ? { ...r, metricas: [...r.metricas, { id: genId(), kpi: "", meta: "", peso: "" }] } : r) });
  const updateMetric = (rid, mid, field, val) => save({ ...data, roles: data.roles.map(r => r.id === rid ? { ...r, metricas: r.metricas.map(m => m.id === mid ? { ...m, [field]: val } : m) } : r) });
  const delMetric = (rid, mid) => save({ ...data, roles: data.roles.map(r => r.id === rid ? { ...r, metricas: r.metricas.filter(m => m.id !== mid) } : r) });
  return <div>
    <div style={{ display: "flex", gap: 12, marginBottom: 16, flexWrap: "wrap" }}>
      <div style={{ flex: 1, minWidth: 150 }}><div style={{ fontSize: 11, color: "#888", marginBottom: 4 }}>Frecuencia</div>
        <select value={data.frecuencia} onChange={e => save({ ...data, frecuencia: e.target.value })} style={{ padding: "8px 12px", borderRadius: 8, border: "1px solid rgba(255,255,255,.1)", background: "rgba(0,0,0,.3)", color: "#e0e0e0", fontSize: 13, fontFamily: "'DM Sans',sans-serif", width: "100%", cursor: "pointer" }}>
          {["Mensual", "Trimestral", "Semestral", "Anual"].map(f => <option key={f} value={f}>{f}</option>)}
        </select></div>
      <div style={{ flex: 1, minWidth: 150 }}><div style={{ fontSize: 11, color: "#888", marginBottom: 4 }}>Escala</div>
        <select value={data.formato} onChange={e => save({ ...data, formato: e.target.value })} style={{ padding: "8px 12px", borderRadius: 8, border: "1px solid rgba(255,255,255,.1)", background: "rgba(0,0,0,.3)", color: "#e0e0e0", fontSize: 13, fontFamily: "'DM Sans',sans-serif", width: "100%", cursor: "pointer" }}>
          {["1-5", "1-10", "Porcentaje"].map(f => <option key={f} value={f}>{f}</option>)}
        </select></div>
    </div>
    {data.roles.map(role => <div key={role.id} style={{ marginBottom: 16, padding: 12, borderRadius: 10, background: "rgba(255,255,255,.03)", border: "1px solid rgba(255,255,255,.06)" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
        <span style={{ fontSize: 16 }}>👤</span>
        {VInp(role.name, v => updateRole(role.id, "name", v), "Nombre del rol", { flex: 1, fontWeight: 700 })}
        <button onClick={() => delRole(role.id)} style={{ background: "none", border: "none", color: "#555", cursor: "pointer" }}>🗑</button>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr auto", gap: 4, fontSize: 10, color: "#666", textTransform: "uppercase", letterSpacing: 1, marginBottom: 4, padding: "0 4px" }}><span>KPI</span><span>Meta</span><span>Peso</span><span></span></div>
      {role.metricas.map(m => <div key={m.id} style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr auto", gap: 4, marginBottom: 4 }}>
        {VInp(m.kpi, v => updateMetric(role.id, m.id, "kpi", v), "Indicador")}
        {VInp(m.meta, v => updateMetric(role.id, m.id, "meta", v), "Meta")}
        {VInp(m.peso, v => updateMetric(role.id, m.id, "peso", v), "%")}
        <button onClick={() => delMetric(role.id, m.id)} style={{ background: "none", border: "none", color: "#555", cursor: "pointer", fontSize: 11 }}>✕</button>
      </div>)}
      <button onClick={() => addMetric(role.id)} style={{ padding: "3px 8px", borderRadius: 4, border: "1px dashed rgba(255,255,255,.12)", background: "none", color: "#666", fontSize: 11, cursor: "pointer", fontFamily: "'DM Sans',sans-serif", marginTop: 4 }}>+ Métrica</button>
    </div>)}
    <div style={{ marginTop: 8 }}>{VBtn("+ Agregar rol", addRole, color)}</div>
  </div>;
}

function CardsEditor({ pid, ik, ct, onUpdate, color }) {
  const getJSON = (key, fb) => { try { return JSON.parse(ct[key] || "null") || fb; } catch { return fb; } };
  const setJSON = (key, d) => onUpdate(key, JSON.stringify(d));
  const dk = `${pid}-${ik}-cards`;
  const ICONS = ["🎯", "💡", "🤝", "🔥", "⭐", "🎉", "🏆", "💪", "🌟", "❤️", "🚀", "🎨"];
  const data = getJSON(dk, []);
  const save = (d) => setJSON(dk, d);
  const addCard = () => save([...data, { id: genId(), title: "", desc: "", icon: ICONS[data.length % ICONS.length] }]);
  const updateCard = (id, field, val) => save(data.map(c => c.id === id ? { ...c, [field]: val } : c));
  const delCard = (id) => save(data.filter(c => c.id !== id));
  return <div>
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
      {data.map(card => <div key={card.id} style={{ padding: 14, borderRadius: 12, background: "rgba(255,255,255,.04)", border: "1px solid rgba(255,255,255,.08)", position: "relative" }}>
        <button onClick={() => delCard(card.id)} style={{ position: "absolute", top: 6, right: 8, background: "none", border: "none", color: "#555", cursor: "pointer", fontSize: 11 }}>✕</button>
        <div style={{ display: "flex", gap: 6, marginBottom: 8, flexWrap: "wrap" }}>
          {ICONS.slice(0, 6).map(ic => <span key={ic} onClick={() => updateCard(card.id, "icon", ic)} style={{ cursor: "pointer", fontSize: 16, opacity: card.icon === ic ? 1 : 0.3, transition: "opacity .2s" }}>{ic}</span>)}
        </div>
        {VInp(card.title, v => updateCard(card.id, "title", v), "Título", { fontWeight: 700, marginBottom: 6 })}
        <textarea value={card.desc} onChange={e => updateCard(card.id, "desc", e.target.value)} placeholder="Descripción..." style={{ width: "100%", minHeight: 60, padding: "8px 10px", borderRadius: 6, border: "1px solid rgba(255,255,255,.08)", background: "rgba(0,0,0,.2)", color: "#ccc", fontSize: 12, fontFamily: "'DM Sans',sans-serif", resize: "vertical", outline: "none", boxSizing: "border-box" }} />
      </div>)}
    </div>
    <div style={{ marginTop: 12 }}>{VBtn("+ Agregar tarjeta", addCard, color)}</div>
  </div>;
}

function ProcessFlowEditor({ pid, ik, ct, onUpdate, color }) {
  const getJSON = (key, fb) => { try { return JSON.parse(ct[key] || "null") || fb; } catch { return fb; } };
  const setJSON = (key, d) => onUpdate(key, JSON.stringify(d));
  const dk = `${pid}-${ik}-flow`;
  const data = getJSON(dk, { flows: [] });
  const save = (d) => setJSON(dk, d);
  const addFlow = () => save({ flows: [...data.flows, { id: genId(), name: "Nuevo flujo", steps: [{ id: genId(), name: "Paso 1", desc: "" }] }] });
  const updateFlow = (fid, field, val) => save({ flows: data.flows.map(f => f.id === fid ? { ...f, [field]: val } : f) });
  const delFlow = (fid) => save({ flows: data.flows.filter(f => f.id !== fid) });
  const addStep = (fid) => save({ flows: data.flows.map(f => f.id === fid ? { ...f, steps: [...f.steps, { id: genId(), name: "Nuevo paso", desc: "" }] } : f) });
  const updateStep = (fid, sid, field, val) => save({ flows: data.flows.map(f => f.id === fid ? { ...f, steps: f.steps.map(s => s.id === sid ? { ...s, [field]: val } : s) } : f) });
  const delStep = (fid, sid) => save({ flows: data.flows.map(f => f.id === fid ? { ...f, steps: f.steps.filter(s => s.id !== sid) } : f) });
  return <div>
    {data.flows.map(flow => <div key={flow.id} style={{ marginBottom: 16, padding: 12, borderRadius: 12, background: "rgba(255,255,255,.03)", border: "1px solid rgba(255,255,255,.06)" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
        {VInp(flow.name, v => updateFlow(flow.id, "name", v), "Nombre del flujo", { fontWeight: 700, fontSize: 14, flex: 1 })}
        <button onClick={() => delFlow(flow.id)} style={{ background: "none", border: "none", color: "#555", cursor: "pointer" }}>🗑</button>
      </div>
      <div style={{ overflowX: "auto" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 0, minWidth: "fit-content" }}>
          {flow.steps.map((step, si) => <div key={step.id} style={{ display: "flex", alignItems: "center" }}>
            <div style={{ minWidth: 130, padding: 10, borderRadius: 10, background: `${color}${(15 + si * 8).toString(16).padStart(2, "0")}`, border: `1px solid ${color}33`, position: "relative" }}>
              {VInp(step.name, v => updateStep(flow.id, step.id, "name", v), "Paso", { fontWeight: 600, fontSize: 12, background: "transparent", border: "none", padding: "2px 0" })}
              {VInp(step.desc, v => updateStep(flow.id, step.id, "desc", v), "Detalle", { fontSize: 10, color: "#888", background: "transparent", border: "none", padding: "2px 0" })}
              {flow.steps.length > 1 && <button onClick={() => delStep(flow.id, step.id)} style={{ position: "absolute", top: 2, right: 4, background: "none", border: "none", color: "#555", cursor: "pointer", fontSize: 10 }}>✕</button>}
            </div>
            {si < flow.steps.length - 1 && <span style={{ color: color, fontSize: 18, padding: "0 4px", flexShrink: 0 }}>→</span>}
          </div>)}
          <button onClick={() => addStep(flow.id)} style={{ marginLeft: 8, width: 32, height: 32, borderRadius: "50%", border: `1px dashed ${color}44`, background: "none", color: color, fontSize: 16, cursor: "pointer", flexShrink: 0 }}>+</button>
        </div>
      </div>
    </div>)}
    <div style={{ marginTop: 8 }}>{VBtn("+ Agregar flujo", addFlow, color)}</div>
  </div>;
}

function ProjectFlowEditor({ pid, ik, ct, onUpdate, color }) {
  const getJSON = (key, fb) => { try { return JSON.parse(ct[key] || "null") || fb; } catch { return fb; } };
  const setJSON = (key, d) => onUpdate(key, JSON.stringify(d));
  const dk = `${pid}-${ik}-projectflow`;
  const defaultData = { phases: [
    { id: genId(), name: "FASE 1: ARRANQUE", subtitle: "Semana 1 después de firmar", columns: ["Paso", "Qué", "Responsable"], steps: [
      { id: genId(), values: ["Reunión de arranque interna", "Supervisor + capataz + técnico presupuestador revisan contrato, plazos, alcance", "Supervisor"] },
      { id: genId(), values: ["Revisión de presupuesto", "Comparar cubicación original vs lo que realmente se va a necesitar", "Técnico"] },
      { id: genId(), values: ["Plan de adquisiciones", "Lista completa de materiales con fechas de necesidad en obra", "Compras"] },
      { id: genId(), values: ["Carta Gantt detallada", "Programa de obra con hitos de avance y fechas de EP", "Supervisor"] },
      { id: genId(), values: ["Asignación de cuadrilla", "Maestros asignados, capataz confirmado", "Supervisor"] },
    ], checkpoints: [
      { id: genId(), title: "Punto de control #1: ¿Tenemos todo para partir?", text: "Checklist antes de empezar: contrato firmado, planos en obra, materiales críticos pedidos, cuadrilla asignada, programa aprobado. Si falta algo, no se parte." }
    ]},
    { id: genId(), name: "FASE 2: EJECUCIÓN", subtitle: "", columns: ["Paso", "Frecuencia", "Qué", "Responsable"], steps: [
      { id: genId(), values: ["Control de avance vs Gantt", "Semanal", "Capataz reporta % avance real vs programado", "Capataz → Supervisor"] },
      { id: genId(), values: ["Coordinación de materiales", "Semanal", "Revisar qué se necesita las próximas 2 semanas", "Supervisor → Compras"] },
      { id: genId(), values: ["Detección de adicionales", "Continuo", "Cualquier trabajo fuera del alcance original se identifica ANTES de ejecutar", "Supervisor"] },
      { id: genId(), values: ["Control de calidad en terreno", "Por hito", "Verificar ejecución según norma antes de avanzar al siguiente tramo", "Capataz"] },
      { id: genId(), values: ["Registro fotográfico", "Diario", "Fotos de avance para respaldo y EP", "Capataz"] },
    ], checkpoints: [
      { id: genId(), title: "Punto de control #2: Revisión semanal de obra", text: "Cada semana el supervisor verifica: avance vs programa, materiales pendientes, adicionales detectados, problemas de calidad. Si el avance se desvía >10%, escala a GG." },
      { id: genId(), title: "Punto de control #3: Gate de adicionales", text: "Regla: NINGÚN adicional se ejecuta sin que se comunique al cliente, se cotice, y se apruebe POR ESCRITO (mail, WhatsApp, lo que sea). Sin aprobación = no se hace." },
      { id: genId(), title: "Punto de control #4: Verificación de calidad por hito", text: "Antes de cerrar cada etapa (canalización, cableado, tableros, terminaciones), el capataz verifica con checklist técnico. Si hay errores, se corrigen ANTES de avanzar. Rehacer trabajo después cuesta 3x más." }
    ]},
    { id: genId(), name: "FASE 3: COBRO", subtitle: "paralelo a ejecución", columns: ["Paso", "Cuándo", "Qué", "Responsable"], steps: [
      { id: genId(), values: ["Preparar estado de pago", "Según hitos del contrato", "Avance valorizado + respaldo fotográfico", "Técnico + Supervisor"] },
      { id: genId(), values: ["Aprobación del EP por cliente", "Dentro de 5 días de enviado", "Gestionar firma del mandante", "Supervisor"] },
      { id: genId(), values: ["Emisión de factura", "Máximo 48 hrs después de EP aprobado", "Facturar inmediatamente", "Jefa Admin"] },
      { id: genId(), values: ["Seguimiento de pago", "Según plazo de factura", "Cobrar activamente, no esperar", "Jefa Admin"] },
    ], checkpoints: [
      { id: genId(), title: "Punto de control #5: EP enviado a tiempo", text: "Regla: Cada EP se envía máximo 3 días después de cumplir el hito. Un EP atrasado = plata atrasada. El supervisor es responsable de tener el respaldo listo." }
    ]},
    { id: genId(), name: "FASE 4: CIERRE", subtitle: "", columns: ["Paso", "Qué", "Responsable"], steps: [
      { id: genId(), values: ["Punch list", "Lista de observaciones pendientes con plazo", "Supervisor + Capataz"] },
      { id: genId(), values: ["Pruebas y certificaciones", "Protocolos de prueba, certificados SEC si aplica", "Capataz"] },
      { id: genId(), values: ["Entrega documental", "Planos as-built, garantías, manuales", "Técnico"] },
      { id: genId(), values: ["EP final + factura final", "Último cobro", "Jefa Admin"] },
      { id: genId(), values: ["Revisión de margen", "Comparar presupuesto original vs costo real del proyecto", "GG + Jefa Admin"] },
      { id: genId(), values: ["Feedback interno", "¿Qué salió bien? ¿Qué salió mal? ¿Qué cambiar?", "Supervisor + GG"] },
    ], checkpoints: [
      { id: genId(), title: "Punto de control #6: Cierre financiero", text: "El proyecto no se da por cerrado hasta que: última factura cobrada, margen real calculado, y lecciones documentadas. Si no, nunca sabes si ganaste o perdiste plata." }
    ]}
  ]};
  const data = getJSON(dk, defaultData);
  const save = (d) => setJSON(dk, d);
  const containerRef = useRef(null);
  const autoResizeAll = () => { if (containerRef.current) containerRef.current.querySelectorAll("textarea").forEach(el => { el.style.height = "auto"; el.style.height = el.scrollHeight + "px"; }); };
  useEffect(() => { autoResizeAll(); });
  const [collapsed, setCollapsed] = useState({});
  const toggleCollapse = (pid2) => setCollapsed(p => ({ ...p, [pid2]: !p[pid2] }));
  const addPhase = () => save({ phases: [...data.phases, { id: genId(), name: "Nueva fase", subtitle: "", columns: ["Paso", "Qué", "Responsable"], steps: [], checkpoints: [] }] });
  const updatePhase = (phaseId, field, val) => save({ phases: data.phases.map(p => p.id === phaseId ? { ...p, [field]: val } : p) });
  const delPhase = (phaseId) => { if (window.confirm("¿Eliminar esta fase?")) save({ phases: data.phases.filter(p => p.id !== phaseId) }); };
  const addStep = (phaseId) => save({ phases: data.phases.map(p => p.id === phaseId ? { ...p, steps: [...p.steps, { id: genId(), values: p.columns.map(() => "") }] } : p) });
  const updateStepVal = (phaseId, stepId, ci, val) => save({ phases: data.phases.map(p => p.id === phaseId ? { ...p, steps: p.steps.map(s => s.id === stepId ? { ...s, values: s.values.map((v, i) => i === ci ? val : v) } : s) } : p) });
  const delStep = (phaseId, stepId) => { if (window.confirm("¿Eliminar esta fila?")) save({ phases: data.phases.map(p => p.id === phaseId ? { ...p, steps: p.steps.filter(s => s.id !== stepId) } : p) }); };
  const addCheckpoint = (phaseId) => save({ phases: data.phases.map(p => p.id === phaseId ? { ...p, checkpoints: [...p.checkpoints, { id: genId(), title: "Nuevo punto de control", text: "" }] } : p) });
  const updateCheckpoint = (phaseId, cpId, field, val) => save({ phases: data.phases.map(p => p.id === phaseId ? { ...p, checkpoints: p.checkpoints.map(c => c.id === cpId ? { ...c, [field]: val } : c) } : p) });
  const delCheckpoint = (phaseId, cpId) => { if (window.confirm("¿Eliminar este punto de control?")) save({ phases: data.phases.map(p => p.id === phaseId ? { ...p, checkpoints: p.checkpoints.filter(c => c.id !== cpId) } : p) }); };
  const addColumn = (phaseId) => save({ phases: data.phases.map(p => p.id === phaseId ? { ...p, columns: [...p.columns, "Nueva columna"], steps: p.steps.map(s => ({ ...s, values: [...s.values, ""] })) } : p) });
  const renameColumn = (phaseId, ci, val) => save({ phases: data.phases.map(p => p.id === phaseId ? { ...p, columns: p.columns.map((c, i) => i === ci ? val : c) } : p) });
  const delColumn = (phaseId, ci) => { if (window.confirm("¿Eliminar esta columna y sus datos?")) save({ phases: data.phases.map(p => p.id === phaseId ? { ...p, columns: p.columns.filter((_, i) => i !== ci), steps: p.steps.map(s => ({ ...s, values: s.values.filter((_, i) => i !== ci) })) } : p) }); };
  const TS = { width: "100%", padding: "6px 8px", borderRadius: 6, border: "1px solid rgba(255,255,255,.06)", background: "transparent", color: "#e0e0e0", fontSize: 12, fontFamily: "'DM Sans',sans-serif", resize: "none", outline: "none", boxSizing: "border-box", minHeight: 32, overflow: "hidden" };
  return <div ref={containerRef}>
    {data.phases.map((phase, pi) => <div key={phase.id} style={{ marginBottom: 20 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px 16px", borderRadius: 10, background: `${color}22`, borderLeft: `4px solid ${color}`, marginBottom: collapsed[phase.id] ? 0 : 12 }}>
        <div style={{ flex: 1 }}>
          {VInp(phase.name, v => updatePhase(phase.id, "name", v), "Nombre de fase", { fontWeight: 800, fontSize: 14, background: "transparent", border: "none", padding: "2px 0", color: color })}
          {VInp(phase.subtitle, v => updatePhase(phase.id, "subtitle", v), "Subtítulo / periodo", { fontSize: 11, color: "#888", background: "transparent", border: "none", padding: "2px 0" })}
        </div>
        <button onClick={() => toggleCollapse(phase.id)} style={{ background: "none", border: "none", color: "#888", cursor: "pointer", fontSize: 16 }}>{collapsed[phase.id] ? "▶" : "▼"}</button>
        <button onClick={() => delPhase(phase.id)} style={{ background: "none", border: "none", color: "#555", cursor: "pointer" }}>🗑</button>
      </div>
      {!collapsed[phase.id] && <>
        <div style={{ overflowX: "auto", marginBottom: 12 }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12, fontFamily: "'DM Sans',sans-serif" }}>
            <thead><tr>
              <th style={{ padding: "8px 10px", textAlign: "left", borderBottom: "1px solid rgba(255,255,255,.12)", fontSize: 10, color: "#888", fontWeight: 700, textTransform: "uppercase", letterSpacing: 1, width: 30 }}>#</th>
              {phase.columns.map((col, ci) => <th key={ci} style={{ padding: "8px 6px", textAlign: "left", borderBottom: "1px solid rgba(255,255,255,.12)", position: "relative" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                  {VInp(col, v => renameColumn(phase.id, ci, v), "Col", { fontSize: 10, fontWeight: 700, textTransform: "uppercase", background: "transparent", border: "none", padding: 0, letterSpacing: 1, color: "#888", width: "auto" })}
                  {phase.columns.length > 1 && <button onClick={() => delColumn(phase.id, ci)} style={{ background: "none", border: "none", color: "#444", cursor: "pointer", fontSize: 9, padding: 0 }}>✕</button>}
                </div>
              </th>)}
              <th style={{ width: 60, textAlign: "center", borderBottom: "1px solid rgba(255,255,255,.12)" }}>
                <button onClick={() => addColumn(phase.id)} style={{ background: "none", border: "1px dashed rgba(255,255,255,.15)", color: "#666", fontSize: 10, cursor: "pointer", padding: "2px 6px", borderRadius: 4, fontFamily: "'DM Sans',sans-serif" }}>+ Col</button>
              </th>
            </tr></thead>
            <tbody>{phase.steps.map((step, si) => <tr key={step.id} style={{ background: si % 2 === 0 ? "transparent" : "rgba(255,255,255,.02)" }}>
              <td style={{ padding: "6px 10px", borderBottom: "1px solid rgba(255,255,255,.05)", color: "#555", fontSize: 11, fontWeight: 600 }}>{si + 1}</td>
              {step.values.map((val, ci) => <td key={ci} style={{ padding: "4px 6px", borderBottom: "1px solid rgba(255,255,255,.05)" }}>
                <textarea value={val} onChange={e => updateStepVal(phase.id, step.id, ci, e.target.value)} placeholder="..." style={TS} />
              </td>)}
              <td style={{ padding: "4px 6px", borderBottom: "1px solid rgba(255,255,255,.05)", textAlign: "center" }}>
                <button onClick={() => delStep(phase.id, step.id)} style={{ background: "none", border: "none", color: "#555", cursor: "pointer", fontSize: 11 }}>✕</button>
              </td>
            </tr>)}</tbody>
          </table>
        </div>
        <div style={{ marginBottom: 12 }}>
          <button onClick={() => addStep(phase.id)} style={{ padding: "4px 10px", borderRadius: 6, border: "1px dashed rgba(255,255,255,.12)", background: "none", color: "#666", fontSize: 11, cursor: "pointer", fontFamily: "'DM Sans',sans-serif" }}>+ Agregar fila</button>
        </div>
        {phase.checkpoints.map(cp => <div key={cp.id} style={{ marginBottom: 10, padding: 12, borderRadius: 10, background: "rgba(232,72,85,.08)", border: "1px solid rgba(232,72,85,.2)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
            <span style={{ fontSize: 14 }}>🔴</span>
            {VInp(cp.title, v => updateCheckpoint(phase.id, cp.id, "title", v), "Título del checkpoint", { fontWeight: 700, fontSize: 13, flex: 1, background: "transparent", border: "none", padding: "2px 0", color: "#E84855" })}
            <button onClick={() => delCheckpoint(phase.id, cp.id)} style={{ background: "none", border: "none", color: "#555", cursor: "pointer", fontSize: 11 }}>✕</button>
          </div>
          <textarea value={cp.text} onChange={e => updateCheckpoint(phase.id, cp.id, "text", e.target.value)} placeholder="Descripción del punto de control..." style={{ width: "100%", minHeight: 50, padding: "8px 10px", borderRadius: 6, border: "1px solid rgba(232,72,85,.15)", background: "rgba(0,0,0,.15)", color: "#ccc", fontSize: 12, fontFamily: "'DM Sans',sans-serif", resize: "none", outline: "none", boxSizing: "border-box", overflow: "hidden" }} />
        </div>)}
        <div style={{ marginBottom: 8 }}>
          <button onClick={() => addCheckpoint(phase.id)} style={{ padding: "4px 10px", borderRadius: 6, border: "1px dashed rgba(232,72,85,.2)", background: "none", color: "#E84855", fontSize: 11, cursor: "pointer", fontFamily: "'DM Sans',sans-serif" }}>+ Punto de control</button>
        </div>
      </>}
    </div>)}
    <div style={{ marginTop: 12, display: "flex", gap: 10 }}>
      {VBtn("+ Agregar fase", addPhase, color)}
      {VBtn("↩ Restaurar datos originales", () => { if (window.confirm("¿Restaurar todas las fases al contenido original? Se perderán los cambios actuales.")) save(defaultData); }, "#E84855", true)}
    </div>
  </div>;
}

function StandardsEditor({ pid, ik, ct, onUpdate, color }) {
  const getJSON = (key, fb) => { try { return JSON.parse(ct[key] || "null") || fb; } catch { return fb; } };
  const setJSON = (key, d) => onUpdate(key, JSON.stringify(d));
  const dk = `${pid}-${ik}-standards`;
  const data = getJSON(dk, []);
  const save = (d) => setJSON(dk, d);
  const addStd = () => save([...data, { id: genId(), name: "", desc: "", nivel: 0, inspecciones: "" }]);
  const updateStd = (id, field, val) => save(data.map(s => s.id === id ? { ...s, [field]: val } : s));
  const delStd = (id) => save(data.filter(s => s.id !== id));
  const getColor = (n) => n < 40 ? "#E84855" : n < 70 ? "#F7B32B" : "#4CAF50";
  return <div>
    {data.map(std => <div key={std.id} style={{ marginBottom: 10, padding: 12, borderRadius: 10, background: "rgba(255,255,255,.03)", border: `1px solid ${getColor(std.nivel)}22` }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
        {VInp(std.name, v => updateStd(std.id, "name", v), "Nombre del estándar", { flex: 1, fontWeight: 600 })}
        <button onClick={() => delStd(std.id)} style={{ background: "none", border: "none", color: "#555", cursor: "pointer" }}>🗑</button>
      </div>
      {VInp(std.desc, v => updateStd(std.id, "desc", v), "Descripción / norma aplicable")}
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 8 }}>
        <span style={{ fontSize: 11, color: "#888", flexShrink: 0 }}>Cumplimiento:</span>
        <input type="range" min={0} max={100} value={std.nivel} onChange={e => updateStd(std.id, "nivel", parseInt(e.target.value))} style={{ flex: 1, accentColor: getColor(std.nivel) }} />
        <span style={{ fontSize: 14, fontWeight: 700, color: getColor(std.nivel), minWidth: 40, textAlign: "right" }}>{std.nivel}%</span>
      </div>
      {VInp(std.inspecciones, v => updateStd(std.id, "inspecciones", v), "Puntos de inspección", { marginTop: 6, fontSize: 11 })}
    </div>)}
    <div style={{ marginTop: 8 }}>{VBtn("+ Agregar estándar", addStd, color)}</div>
  </div>;
}

const MESES = ["Ene","Feb","Mar","Abr","May","Jun","Jul","Ago","Sep","Oct","Nov","Dic"];
const MESES_KEYS = ["ene","feb","mar","abr","may","jun","jul","ago","sep","oct","nov","dic"];
const DEFAULT_BE = {
  gastos: [
    { id: "g1", nombre: "Maestros propios (15)", categoria: "Personal", monto: 20000000 },
    { id: "g2", nombre: "Admin / overhead", categoria: "Personal", monto: 15000000 },
    { id: "g3", nombre: "Arriendo + vehículos + servicios", categoria: "Operación", monto: 2500000 },
  ],
  margen: 50,
  valorUF: 38500,
  pctGastosGen: 12,
  duracionContrato: 18,
  catGastosGen: "",
  meses: Object.fromEntries(MESES_KEYS.map(m => [m, { facProy: 0, facReal: 0, contProyUF: 0, contRealUF: 0, cerrado: false }])),
};

function migrateBE(d) {
  if (!d || !d.gastos) return DEFAULT_BE;
  let changed = false;
  if (d.valorUF === undefined) { d.valorUF = 38500; changed = true; }
  if (d.pctGastosGen === undefined) { d.pctGastosGen = 12; changed = true; }
  if (d.duracionContrato === undefined) { d.duracionContrato = 18; changed = true; }
  if (d.catGastosGen === undefined) { d.catGastosGen = ""; changed = true; }
  d.gastos = d.gastos.map(g => {
    if (g.categoria === undefined) { changed = true; return { ...g, categoria: "" }; }
    return g;
  });
  const nm = {};
  for (const mk of MESES_KEYS) {
    const m = d.meses?.[mk] || {};
    if (m.facProy !== undefined) { nm[mk] = m; }
    else { changed = true; nm[mk] = { facProy: m.facturacion || 0, facReal: 0, contProyUF: m.contratos || 0, contRealUF: 0, cerrado: false }; }
  }
  d.meses = nm;
  return d;
}

function BreakevenEditor({ pid, ik, ct, onUpdate, color }) {
  const getJSON = (key, fb) => { try { return JSON.parse(ct[key] || "null") || fb; } catch { return fb; } };
  const setJSON = (key, d) => onUpdate(key, JSON.stringify(d));
  const dk = `${pid}-${ik}-breakeven`;
  const raw = getJSON(dk, DEFAULT_BE);
  const data = migrateBE(raw);
  const save = (d) => setJSON(dk, d);

  const [editId, setEditId] = useState(null);
  const [editVal, setEditVal] = useState("");
  const [editCatId, setEditCatId] = useState(null);
  const [editCatVal, setEditCatVal] = useState("");
  const [viewMode, setViewMode] = useState("combined");
  const [comparing, setComparing] = useState(false);
  const [selMonths, setSelMonths] = useState([]);

  // Formatters
  const fmt = (n) => { const s = n < 0 ? "-" : "", a = Math.abs(n); if (a >= 1e9) return `${s}$${(a/1e9).toFixed(1)}B`; if (a >= 1e6) return `${s}$${(a/1e6).toFixed(a%1e6===0?0:1)}M`; if (a >= 1e3) return `${s}$${(a/1e3).toFixed(0)}K`; return `${s}$${a}`; };
  const fmtP = (n) => (n < 0 ? "-" : "") + "$" + Math.abs(Math.round(n)).toLocaleString("es-CL");
  const fmtUF = (n) => (n || 0).toLocaleString("es-CL", { minimumFractionDigits: 1, maximumFractionDigits: 1 }) + " UF";
  const ufToCLP = (uf) => Math.round((uf || 0) * (data.valorUF || 38500));

  // Calcs
  const totalFijos = data.gastos.reduce((a, g) => a + (g.monto || 0), 0);
  const margen = Math.max(1, data.margen || 50);
  const breakeven = Math.round(totalFijos / (margen / 100));
  const breakevenAnual = breakeven * 12;
  const categorias = [...new Set(data.gastos.map(g => g.categoria).filter(Boolean))].sort();
  const getFact = (mk) => { const m = data.meses[mk] || {}; return m.cerrado ? (m.facReal || 0) : (m.facProy || 0); };
  const getContUF = (mk) => { const m = data.meses[mk] || {}; return m.cerrado ? (m.contRealUF || 0) : (m.contProyUF || 0); };

  // Actions
  const updateGasto = (id, field, val) => save({ ...data, gastos: data.gastos.map(g => g.id === id ? { ...g, [field]: val } : g) });
  const addGasto = () => save({ ...data, gastos: [...data.gastos, { id: genId(), nombre: "", categoria: categorias[0] || "", monto: 0 }] });
  const delGasto = (id) => save({ ...data, gastos: data.gastos.filter(g => g.id !== id) });
  const updateMargen = (v) => save({ ...data, margen: v });
  const updateMes = (mk, field, val) => save({ ...data, meses: { ...data.meses, [mk]: { ...data.meses[mk], [field]: val } } });
  const resetData = () => { if (window.confirm("¿Restaurar datos originales del break-even?")) save(DEFAULT_BE); };

  // Peso input helper
  const PesoInp = ({ uid, value, onChange, width, style: st2, dashed, readOnly }) => {
    const editing = editId === uid;
    return <input type="text" inputMode="numeric" readOnly={readOnly}
      value={editing ? editVal : fmtP(value || 0)}
      onFocus={() => { if (readOnly) return; setEditId(uid); setEditVal(String(value || "")); }}
      onChange={e => { if (readOnly) return; setEditVal(e.target.value.replace(/[^0-9]/g, "")); }}
      onBlur={() => { if (readOnly) return; onChange(parseInt(editVal) || 0); setEditId(null); }}
      style={{ width: width || 80, padding: "6px 4px", borderRadius: 6, border: dashed ? "1px dashed rgba(255,255,255,.08)" : "1px solid rgba(255,255,255,.08)", background: readOnly ? "rgba(0,0,0,.15)" : "rgba(0,0,0,.3)", color: readOnly ? "#555" : dashed ? "#999" : "#e0e0e0", fontSize: 11, fontFamily: "'DM Sans',sans-serif", outline: "none", textAlign: "right", boxSizing: "border-box", cursor: readOnly ? "not-allowed" : "text", ...st2 }} />;
  };

  const cs = { card: { padding: "12px 16px", borderRadius: 10, background: "rgba(0,0,0,.2)", border: "1px solid rgba(255,255,255,.06)" }, lbl: { fontSize: 10, color: "#888", textTransform: "uppercase", letterSpacing: 1, marginBottom: 4 }, big: { fontSize: 28, fontWeight: 800, color } };

  // Resumen anual
  const totalFact = MESES_KEYS.reduce((a, mk) => a + getFact(mk), 0);
  const totalContUF = MESES_KEYS.reduce((a, mk) => a + getContUF(mk), 0);
  const mesesConDatos = MESES_KEYS.filter(mk => getFact(mk) > 0).length;
  const promMensual = mesesConDatos > 0 ? Math.round(totalFact / mesesConDatos) : 0;
  const mesesSobreBE = MESES_KEYS.filter(mk => getFact(mk) >= breakeven).length;
  const mesesBajoBE = MESES_KEYS.filter(mk => getFact(mk) > 0 && getFact(mk) < breakeven).length;

  // Gastos agrupados por categoría
  const gastosByCat = {};
  data.gastos.forEach(g => { const c = g.categoria || "Sin categoría"; if (!gastosByCat[c]) gastosByCat[c] = []; gastosByCat[c].push(g); });

  const inpS = { padding: "8px 12px", borderRadius: 8, border: "1px solid rgba(255,255,255,.1)", background: "rgba(0,0,0,.3)", color: "#e0e0e0", fontSize: 13, fontFamily: "'DM Sans',sans-serif", outline: "none", boxSizing: "border-box" };
  const tds = { padding: "6px 8px", fontSize: 11, color: "#ccc", whiteSpace: "nowrap", fontWeight: 600 };

  return <div>
    <datalist id="be-cats">{categorias.map(c => <option key={c} value={c} />)}</datalist>

    {/* Headline */}
    <div style={{ ...cs.card, marginBottom: 16, textAlign: "center" }}>
      <div style={cs.lbl}>Break-even mensual calculado</div>
      <div style={cs.big}>{fmtP(breakeven)}/mes</div>
      <div style={{ fontSize: 12, color: "#888", marginTop: 4 }}>Gastos fijos ({fmtP(totalFijos)}) ÷ Margen ({margen}%) = {fmtP(breakeven)}</div>
    </div>

    {/* Tabla gastos fijos con categorías */}
    <div style={{ marginBottom: 16 }}>
      <div style={{ ...cs.lbl, marginBottom: 8 }}>Gastos fijos mensuales</div>
      {Object.entries(gastosByCat).map(([cat, items]) => {
        const subtotal = items.reduce((a, g) => a + (g.monto || 0), 0);
        return <div key={cat} style={{ marginBottom: 10 }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: color, opacity: 0.7, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 4, paddingLeft: 4 }}>{cat}</div>
          {items.map(g => <div key={g.id} style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 5 }}>
            {VInp(g.nombre, v => updateGasto(g.id, "nombre", v), "Concepto", { flex: 2 })}
            <input list="be-cats" value={editCatId === g.id ? editCatVal : (g.categoria || "")}
              onFocus={() => { setEditCatId(g.id); setEditCatVal(g.categoria || ""); }}
              onChange={e => setEditCatVal(e.target.value)}
              onBlur={() => { updateGasto(g.id, "categoria", editCatVal); setEditCatId(null); }}
              placeholder="Categoría" style={{ ...inpS, flex: 1, fontSize: 11 }} />
            <input type="text" inputMode="numeric"
              value={editId === "gm-" + g.id ? editVal : fmtP(g.monto || 0)}
              onFocus={() => { setEditId("gm-" + g.id); setEditVal(String(g.monto || "")); }}
              onChange={e => setEditVal(e.target.value.replace(/[^0-9]/g, ""))}
              onBlur={() => { updateGasto(g.id, "monto", parseInt(editVal) || 0); setEditId(null); }}
              style={{ ...inpS, flex: 1, textAlign: "right" }} />
            <button onClick={() => delGasto(g.id)} style={{ background: "none", border: "none", color: "#555", cursor: "pointer", fontSize: 14 }}>🗑</button>
          </div>)}
          <div style={{ textAlign: "right", fontSize: 11, color: "#888", fontWeight: 600, paddingRight: 36 }}>Subtotal: {fmtP(subtotal)}</div>
        </div>;
      })}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 8 }}>
        {VBtn("+ Agregar gasto", addGasto, color, true)}
        <div style={{ fontSize: 14, fontWeight: 700, color }}>Total: {fmtP(totalFijos)}</div>
      </div>
    </div>

    {/* Slider margen */}
    <div style={{ ...cs.card, marginBottom: 16 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
        <div style={cs.lbl}>Margen de contribución</div>
        <span style={{ fontSize: 18, fontWeight: 800, color }}>{margen}%</span>
      </div>
      <input type="range" min={1} max={100} value={margen} onChange={e => updateMargen(parseInt(e.target.value))} style={{ width: "100%", accentColor: color }} />
      <div style={{ fontSize: 11, color: "#888", marginTop: 4 }}>Por cada $1M vendido → {fmtP(Math.round(1000000 * margen / 100))} de contribución</div>
    </div>

    {/* Valor UF */}
    <div style={{ ...cs.card, marginBottom: 16 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={cs.lbl}>Valor UF</div>
        <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
          <input type="text" inputMode="numeric"
            value={editId === "uf" ? editVal : fmtP(data.valorUF || 38500)}
            onFocus={() => { setEditId("uf"); setEditVal(String(data.valorUF || 38500)); }}
            onChange={e => setEditVal(e.target.value.replace(/[^0-9]/g, ""))}
            onBlur={() => { save({ ...data, valorUF: parseInt(editVal) || 38500 }); setEditId(null); }}
            style={{ ...inpS, width: 100, textAlign: "right", fontSize: 14, fontWeight: 700 }} />
        </div>
      </div>
    </div>

    {/* Cards venta necesaria (break-even) */}
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 16 }}>
      <div style={cs.card}><div style={cs.lbl}>Venta necesaria / mes</div><div style={{ fontSize: 22, fontWeight: 800, color }}>{fmtP(breakeven)}</div></div>
      <div style={cs.card}><div style={cs.lbl}>Venta necesaria / año</div><div style={{ fontSize: 22, fontWeight: 800, color }}>{fmtP(breakevenAnual)}</div></div>
    </div>

    {/* Cálculo por Gastos Generales */}
    {(() => {
      const pct = data.pctGastosGen || 12;
      const dur = data.duracionContrato || 18;
      const catSel = data.catGastosGen || "";
      const gastosGenSum = catSel ? data.gastos.filter(g => g.categoria === catSel).reduce((a, g) => a + (g.monto || 0), 0) : 0;
      const ventaAnualCalc = pct > 0 && gastosGenSum > 0 ? Math.round(gastosGenSum * 12 / (pct / 100)) : 0;
      const contratadoNec = ventaAnualCalc > 0 ? Math.round(ventaAnualCalc * (dur / 12)) : 0;
      const contratadoUF = data.valorUF > 0 ? Math.round(contratadoNec / data.valorUF * 10) / 10 : 0;
      const ventaMensualCalc = ventaAnualCalc > 0 ? Math.round(ventaAnualCalc / 12) : 0;
      return <div style={{ ...cs.card, marginBottom: 16, border: `1px solid ${color}22` }}>
        <div style={{ ...cs.lbl, marginBottom: 10, color }}>Cálculo por gastos generales</div>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center", marginBottom: 10 }}>
          <div style={{ flex: 1, minWidth: 140 }}>
            <div style={{ fontSize: 10, color: "#666", marginBottom: 3 }}>Categoría de gastos generales</div>
            <select value={catSel} onChange={e => save({ ...data, catGastosGen: e.target.value })}
              style={{ ...inpS, width: "100%", fontSize: 12 }}>
              <option value="">— Seleccionar —</option>
              {categorias.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div style={{ minWidth: 80 }}>
            <div style={{ fontSize: 10, color: "#666", marginBottom: 3 }}>% de ingresos</div>
            <div style={{ display: "flex", alignItems: "center", gap: 2 }}>
              <input type="number" value={pct} min={1} max={100} onChange={e => save({ ...data, pctGastosGen: parseInt(e.target.value) || 12 })}
                style={{ ...inpS, width: 50, textAlign: "center", fontSize: 12 }} /><span style={{ fontSize: 11, color: "#888" }}>%</span>
            </div>
          </div>
          <div style={{ minWidth: 80 }}>
            <div style={{ fontSize: 10, color: "#666", marginBottom: 3 }}>Duración contrato</div>
            <div style={{ display: "flex", alignItems: "center", gap: 2 }}>
              <input type="number" value={dur} min={1} max={60} onChange={e => save({ ...data, duracionContrato: parseInt(e.target.value) || 18 })}
                style={{ ...inpS, width: 50, textAlign: "center", fontSize: 12 }} /><span style={{ fontSize: 11, color: "#888" }}>meses</span>
            </div>
          </div>
        </div>
        {catSel && gastosGenSum > 0 ? <div>
          <div style={{ fontSize: 11, color: "#888", marginBottom: 6 }}>
            Si {catSel} ({fmtP(gastosGenSum * 12)}/año) = {pct}% de ingresos, con contratos de {dur} meses:
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
            <div style={{ padding: 10, borderRadius: 8, background: "rgba(0,0,0,.2)" }}>
              <div style={{ fontSize: 9, color: "#888", textTransform: "uppercase", marginBottom: 2 }}>Venta anual necesaria</div>
              <div style={{ fontSize: 18, fontWeight: 800, color }}>{fmtP(ventaAnualCalc)}</div>
              <div style={{ fontSize: 10, color: "#666" }}>{fmtP(ventaMensualCalc)}/mes</div>
            </div>
            <div style={{ padding: 10, borderRadius: 8, background: "rgba(0,0,0,.2)" }}>
              <div style={{ fontSize: 9, color: "#888", textTransform: "uppercase", marginBottom: 2 }}>Contratado necesario</div>
              <div style={{ fontSize: 18, fontWeight: 800, color: "#81C784" }}>{fmtP(contratadoNec)}</div>
              <div style={{ fontSize: 10, color: "#666" }}>{fmtUF(contratadoUF)}</div>
            </div>
            <div style={{ padding: 10, borderRadius: 8, background: "rgba(0,0,0,.2)" }}>
              <div style={{ fontSize: 9, color: "#888", textTransform: "uppercase", marginBottom: 2 }}>Gasto general mensual</div>
              <div style={{ fontSize: 18, fontWeight: 800, color: "#E84855" }}>{fmtP(gastosGenSum)}</div>
              <div style={{ fontSize: 10, color: "#666" }}>{pct}% de {fmtP(ventaMensualCalc)}</div>
            </div>
          </div>
        </div> : <div style={{ fontSize: 11, color: "#666", fontStyle: "italic" }}>Selecciona una categoría para calcular</div>}
      </div>;
    })()}

    {/* Indicador contrato necesario vs adjudicado */}
    {(() => {
      const pct = data.pctGastosGen || 12;
      const dur = data.duracionContrato || 18;
      const catSel2 = data.catGastosGen || "";
      const ggSum = catSel2 ? data.gastos.filter(g => g.categoria === catSel2).reduce((a, g) => a + (g.monto || 0), 0) : 0;
      const ventaAnual2 = pct > 0 && ggSum > 0 ? Math.round(ggSum * 12 / (pct / 100)) : 0;
      const contNecCLP = ventaAnual2 > 0 ? Math.round(ventaAnual2 * (dur / 12)) : 0;
      const contNecUF = data.valorUF > 0 ? Math.round(contNecCLP / data.valorUF * 10) / 10 : 0;
      const adjUF = totalContUF;
      const adjCLP = ufToCLP(adjUF);
      const faltaUF = Math.max(0, contNecUF - adjUF);
      const faltaCLP = Math.max(0, contNecCLP - adjCLP);
      const pctAvance = contNecUF > 0 ? Math.min(100, Math.round(adjUF / contNecUF * 100)) : 0;
      if (contNecCLP <= 0) return null;
      return <div style={{ ...cs.card, marginBottom: 16, border: `1px solid ${adjUF >= contNecUF ? "#81C784" : "#E84855"}33` }}>
        <div style={{ ...cs.lbl, marginBottom: 8 }}>Contrato necesario vs adjudicado</div>
        {/* Barra de progreso */}
        <div style={{ background: "rgba(255,255,255,.06)", borderRadius: 8, height: 28, overflow: "hidden", position: "relative", marginBottom: 10 }}>
          <div style={{ height: "100%", borderRadius: 8, background: adjUF >= contNecUF ? "linear-gradient(90deg, #81C784, #4CAF50)" : `linear-gradient(90deg, ${color}, ${color}88)`, width: pctAvance + "%", transition: "width .4s ease" }} />
          <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 800, color: "#fff", textShadow: "0 1px 3px rgba(0,0,0,.5)" }}>{pctAvance}%</div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
          <div style={{ padding: 10, borderRadius: 8, background: "rgba(0,0,0,.2)", textAlign: "center" }}>
            <div style={{ fontSize: 9, color: "#888", textTransform: "uppercase", marginBottom: 2 }}>Necesario</div>
            <div style={{ fontSize: 16, fontWeight: 800, color }}>{fmtUF(contNecUF)}</div>
            <div style={{ fontSize: 10, color: "#666" }}>{fmtP(contNecCLP)}</div>
          </div>
          <div style={{ padding: 10, borderRadius: 8, background: "rgba(0,0,0,.2)", textAlign: "center" }}>
            <div style={{ fontSize: 9, color: "#888", textTransform: "uppercase", marginBottom: 2 }}>Adjudicado</div>
            <div style={{ fontSize: 16, fontWeight: 800, color: "#81C784" }}>{fmtUF(adjUF)}</div>
            <div style={{ fontSize: 10, color: "#666" }}>{fmtP(adjCLP)}</div>
          </div>
          <div style={{ padding: 10, borderRadius: 8, background: "rgba(0,0,0,.2)", textAlign: "center" }}>
            <div style={{ fontSize: 9, color: "#888", textTransform: "uppercase", marginBottom: 2 }}>{faltaUF > 0 ? "Falta" : "Superávit"}</div>
            <div style={{ fontSize: 16, fontWeight: 800, color: faltaUF > 0 ? "#E84855" : "#81C784" }}>{faltaUF > 0 ? fmtUF(faltaUF) : fmtUF(Math.abs(contNecUF - adjUF))}</div>
            <div style={{ fontSize: 10, color: "#666" }}>{faltaUF > 0 ? fmtP(faltaCLP) : fmtP(Math.abs(contNecCLP - adjCLP))}</div>
          </div>
        </div>
      </div>;
    })()}

    {/* Toggle Real/Proyectado */}
    <div style={{ display: "flex", gap: 6, marginBottom: 8 }}>
      {[{ k: "combined", l: "Todo" }, { k: "projected", l: "Proyectado" }, { k: "real", l: "Real" }].map(t =>
        <button key={t.k} onClick={() => setViewMode(t.k)} style={{ padding: "4px 12px", borderRadius: 6, border: "none", fontSize: 11, fontWeight: 600, cursor: "pointer", fontFamily: "'DM Sans',sans-serif", background: viewMode === t.k ? color + "33" : "rgba(255,255,255,.05)", color: viewMode === t.k ? color : "#888" }}>{t.l}</button>
      )}
    </div>

    {/* Grilla mensual */}
    <div style={{ marginBottom: 16 }}>
      <div style={{ ...cs.lbl, marginBottom: 8 }}>Seguimiento mensual 2026</div>
      <div style={{ overflowX: "auto", WebkitOverflowScrolling: "touch" }}>
        <table style={{ borderCollapse: "collapse", minWidth: 950, width: "100%" }}>
          <thead><tr>
            <th style={{ padding: "6px 8px", fontSize: 10, color: "#888", textAlign: "left", whiteSpace: "nowrap", borderBottom: "1px solid rgba(255,255,255,.08)" }}></th>
            {MESES.map((m, i) => {
              const mk = MESES_KEYS[i]; const cerr = data.meses[mk]?.cerrado;
              return <th key={i} style={{ padding: "4px 6px", fontSize: 10, color: "#aaa", textAlign: "center", whiteSpace: "nowrap", borderBottom: "1px solid rgba(255,255,255,.08)", fontWeight: 700 }}>
                <div>{m}</div>
                <button onClick={() => updateMes(mk, "cerrado", !cerr)} style={{ fontSize: 10, background: "none", border: "none", cursor: "pointer", color: cerr ? "#81C784" : "#555", padding: 0 }}>{cerr ? "🔒" : "🔓"}</button>
              </th>;
            })}
          </tr></thead>
          <tbody>
            {/* Fact. Proyectado */}
            {(viewMode === "combined" || viewMode === "projected") && <tr>
              <td style={tds}>Fact. proy.</td>
              {MESES_KEYS.map(mk => { const cerr = data.meses[mk]?.cerrado; return <td key={mk} style={{ padding: "4px 2px" }}>
                <PesoInp uid={"fp-" + mk} value={data.meses[mk]?.facProy || 0} onChange={v => updateMes(mk, "facProy", v)} width={72} dashed readOnly={cerr} />
              </td>; })}
            </tr>}
            {/* Fact. Real */}
            {(viewMode === "combined" || viewMode === "real") && <tr>
              <td style={tds}>Fact. real</td>
              {MESES_KEYS.map(mk => <td key={mk} style={{ padding: "4px 2px" }}>
                <PesoInp uid={"fr-" + mk} value={data.meses[mk]?.facReal || 0} onChange={v => updateMes(mk, "facReal", v)} width={72} />
              </td>)}
            </tr>}
            {/* Contratos Proyectado UF */}
            {(viewMode === "combined" || viewMode === "projected") && <tr>
              <td style={tds}>Cont. proy. (UF)</td>
              {MESES_KEYS.map(mk => <td key={mk} style={{ padding: "4px 2px" }}>
                <input type="number" step="0.1" value={data.meses[mk]?.contProyUF || ""} onChange={e => updateMes(mk, "contProyUF", parseFloat(e.target.value) || 0)} placeholder="0" style={{ width: 72, padding: "6px 4px", borderRadius: 6, border: "1px dashed rgba(255,255,255,.08)", background: "rgba(0,0,0,.3)", color: "#999", fontSize: 11, fontFamily: "'DM Sans',sans-serif", outline: "none", textAlign: "right", boxSizing: "border-box" }} />
              </td>)}
            </tr>}
            {/* Contratos Real UF */}
            {(viewMode === "combined" || viewMode === "real") && <tr>
              <td style={tds}>Cont. real (UF)</td>
              {MESES_KEYS.map(mk => <td key={mk} style={{ padding: "4px 2px" }}>
                <input type="number" step="0.1" value={data.meses[mk]?.contRealUF || ""} onChange={e => updateMes(mk, "contRealUF", parseFloat(e.target.value) || 0)} placeholder="0" style={{ width: 72, padding: "6px 4px", borderRadius: 6, border: "1px solid rgba(255,255,255,.08)", background: "rgba(0,0,0,.3)", color: "#e0e0e0", fontSize: 11, fontFamily: "'DM Sans',sans-serif", outline: "none", textAlign: "right", boxSizing: "border-box" }} />
              </td>)}
            </tr>}
            {/* Contratos CLP equiv */}
            <tr>
              <td style={tds}>Cont. ($)</td>
              {MESES_KEYS.map(mk => {
                const uf = getContUF(mk); const clp = ufToCLP(uf);
                return <td key={mk} style={{ padding: "6px 4px", fontSize: 10, color: clp > 0 ? "#888" : "#444", textAlign: "right" }}>{clp > 0 ? fmt(clp) : "—"}</td>;
              })}
            </tr>
            {/* Resultado */}
            <tr>
              <td style={tds}>Resultado</td>
              {MESES_KEYS.map(mk => {
                const f = getFact(mk); const r = f - breakeven; const hasData = f > 0;
                return <td key={mk} style={{ padding: "6px 4px", fontSize: 11, fontWeight: 700, textAlign: "right", color: !hasData ? "#444" : r >= 0 ? "#81C784" : "#E84855" }}>{hasData ? (r >= 0 ? "+" : "") + fmt(r) : "—"}</td>;
              })}
            </tr>
            {/* Acum contratos UF */}
            <tr>
              <td style={tds}>Acum. (UF)</td>
              {MESES_KEYS.map((mk, i) => {
                const acc = MESES_KEYS.slice(0, i + 1).reduce((a, m) => a + getContUF(m), 0);
                return <td key={mk} style={{ padding: "6px 4px", fontSize: 11, fontWeight: 600, textAlign: "right", color: acc > 0 ? "#aaa" : "#444" }}>{acc > 0 ? fmtUF(acc) : "—"}</td>;
              })}
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    {/* Comparar meses */}
    <div style={{ marginBottom: 16 }}>
      {VBtn(comparing ? "✕ Cerrar comparación" : "Comparar meses", () => { setComparing(!comparing); if (comparing) setSelMonths([]); }, color, true)}
      {comparing && <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginTop: 8 }}>
        {MESES.map((m, i) => {
          const mk = MESES_KEYS[i]; const sel = selMonths.includes(mk); const full = selMonths.length >= 3 && !sel;
          return <button key={mk} onClick={() => { if (sel) setSelMonths(selMonths.filter(s => s !== mk)); else if (!full) setSelMonths([...selMonths, mk]); }}
            style={{ padding: "4px 10px", borderRadius: 6, fontSize: 11, fontWeight: 600, cursor: full ? "not-allowed" : "pointer", border: sel ? `2px solid ${color}` : "1px solid rgba(255,255,255,.1)", background: sel ? color + "22" : "rgba(0,0,0,.2)", color: sel ? color : "#888", opacity: full ? 0.4 : 1, fontFamily: "'DM Sans',sans-serif" }}>{m}</button>;
        })}
      </div>}
      {comparing && selMonths.length >= 2 && <div style={{ display: "grid", gridTemplateColumns: `repeat(${selMonths.length}, 1fr)`, gap: 8, marginTop: 10 }}>
        {selMonths.map(mk => {
          const m = data.meses[mk] || {}; const fact = getFact(mk); const factP = m.facProy || 0; const factR = m.facReal || 0;
          const contUF = getContUF(mk); const resultado = fact - breakeven;
          const label = MESES[MESES_KEYS.indexOf(mk)];
          return <div key={mk} style={{ ...cs.card }}>
            <div style={{ fontSize: 14, fontWeight: 800, color, marginBottom: 8, textAlign: "center" }}>{label} {m.cerrado ? "🔒" : ""}</div>
            <div style={{ fontSize: 10, color: "#888", marginBottom: 2 }}>Facturación</div>
            <div style={{ fontSize: 14, fontWeight: 700, color: "#e0e0e0" }}>{fmtP(fact)}</div>
            {m.cerrado && factP > 0 && <div style={{ fontSize: 10, color: factR >= factP ? "#81C784" : "#E84855" }}>Proy: {fmtP(factP)} ({factR >= factP ? "+" : ""}{fmt(factR - factP)})</div>}
            <div style={{ fontSize: 10, color: "#888", marginTop: 6, marginBottom: 2 }}>Contratos</div>
            <div style={{ fontSize: 14, fontWeight: 700, color: "#e0e0e0" }}>{fmtUF(contUF)}</div>
            <div style={{ fontSize: 10, color: "#666" }}>{fmtP(ufToCLP(contUF))}</div>
            <div style={{ fontSize: 10, color: "#888", marginTop: 6, marginBottom: 2 }}>Resultado</div>
            <div style={{ fontSize: 14, fontWeight: 800, color: resultado >= 0 ? "#81C784" : "#E84855" }}>{(resultado >= 0 ? "+" : "") + fmtP(resultado)}</div>
          </div>;
        })}
      </div>}
    </div>

    {/* Resumen anual */}
    <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8, marginBottom: 16 }}>
      <div style={cs.card}><div style={cs.lbl}>Total facturación</div><div style={{ fontSize: 16, fontWeight: 700, color: totalFact > 0 ? color : "#555" }}>{totalFact > 0 ? fmtP(totalFact) : "—"}</div></div>
      <div style={cs.card}><div style={cs.lbl}>Total contratos</div><div style={{ fontSize: 16, fontWeight: 700, color: totalContUF > 0 ? "#81C784" : "#555" }}>{totalContUF > 0 ? fmtUF(totalContUF) : "—"}</div>{totalContUF > 0 && <div style={{ fontSize: 10, color: "#666" }}>{fmtP(ufToCLP(totalContUF))}</div>}</div>
      <div style={cs.card}><div style={cs.lbl}>Promedio mensual</div><div style={{ fontSize: 16, fontWeight: 700, color: promMensual >= breakeven ? "#81C784" : promMensual > 0 ? "#E84855" : "#555" }}>{promMensual > 0 ? fmtP(promMensual) : "—"}</div></div>
      <div style={cs.card}><div style={cs.lbl}>Meses sobre BE</div><div style={{ fontSize: 16, fontWeight: 700, color: "#81C784" }}>{mesesSobreBE}</div></div>
      <div style={cs.card}><div style={cs.lbl}>Meses bajo BE</div><div style={{ fontSize: 16, fontWeight: 700, color: mesesBajoBE > 0 ? "#E84855" : "#555" }}>{mesesBajoBE}</div></div>
      <div style={cs.card}><div style={cs.lbl}>Meta anual</div><div style={{ fontSize: 16, fontWeight: 700, color }}>{fmtP(breakevenAnual)}</div></div>
    </div>

    {/* Restaurar */}
    <div style={{ textAlign: "center" }}>{VBtn("↩ Restaurar datos originales", resetData, "#888", true)}</div>
  </div>;
}

function SuppliersEditor({ pid, ik, ct, onUpdate, color }) {
  const getJSON = (key, fb) => { try { return JSON.parse(ct[key] || "null") || fb; } catch { return fb; } };
  const setJSON = (key, d) => onUpdate(key, JSON.stringify(d));
  const dk = `${pid}-${ik}-list`;
  const data = getJSON(dk, []);
  const save = (d) => setJSON(dk, d);
  const addSup = () => save([...data, { id: genId(), name: "", rubro: "", contacto: "", rating: 3, notas: "" }]);
  const updateSup = (id, field, val) => save(data.map(s => s.id === id ? { ...s, [field]: val } : s));
  const delSup = (id) => save(data.filter(s => s.id !== id));
  const sorted = [...data].sort((a, b) => (b.rating || 0) - (a.rating || 0));
  return <div>
    {sorted.map(sup => <div key={sup.id} style={{ marginBottom: 10, padding: 12, borderRadius: 10, background: "rgba(255,255,255,.04)", border: "1px solid rgba(255,255,255,.06)" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
        <span style={{ fontSize: 18 }}>🏭</span>
        {VInp(sup.name, v => updateSup(sup.id, "name", v), "Nombre del proveedor", { flex: 1, fontWeight: 600 })}
        <button onClick={() => delSup(sup.id)} style={{ background: "none", border: "none", color: "#555", cursor: "pointer" }}>🗑</button>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6, marginBottom: 6 }}>
        {VInp(sup.rubro, v => updateSup(sup.id, "rubro", v), "Rubro / categoría")}
        {VInp(sup.contacto, v => updateSup(sup.id, "contacto", v), "Contacto")}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 6 }}>
        <span style={{ fontSize: 11, color: "#888" }}>Evaluación:</span>
        {[1, 2, 3, 4, 5].map(n => <span key={n} onClick={() => updateSup(sup.id, "rating", n)} style={{ cursor: "pointer", fontSize: 18, opacity: n <= (sup.rating || 0) ? 1 : 0.2, transition: "opacity .2s" }}>⭐</span>)}
      </div>
      {VInp(sup.notas, v => updateSup(sup.id, "notas", v), "Notas")}
    </div>)}
    <div style={{ marginTop: 8 }}>{VBtn("+ Agregar proveedor", addSup, color)}</div>
  </div>;
}

function getSt(v) { return STATUS_OPTIONS.find(s => s.value === v) || STATUS_OPTIONS[0]; }
function calcProg(p, st) {
  const t = p.items.length; if (!t) return 0;
  const d = p.items.filter(i => st[`${p.id}-${i.key}`] === "done").length;
  const pr = p.items.filter(i => st[`${p.id}-${i.key}`] === "progress").length;
  const id = p.items.filter(i => st[`${p.id}-${i.key}`] === "idea").length;
  return Math.round(((d + pr * .5 + id * .15) / t) * 100);
}
function Ring({ pct, clr, sz = 64 }) {
  const s = 5, r = (sz - s) / 2, c = 2 * Math.PI * r, o = c - (pct / 100) * c;
  return <svg width={sz} height={sz} style={{ transform: "rotate(-90deg)", flexShrink: 0 }}>
    <circle cx={sz/2} cy={sz/2} r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={s} />
    <circle cx={sz/2} cy={sz/2} r={r} fill="none" stroke={clr} strokeWidth={s} strokeDasharray={c} strokeDashoffset={o} strokeLinecap="round" style={{ transition: "stroke-dashoffset .5s" }} />
    <text x={sz/2} y={sz/2} textAnchor="middle" dominantBaseline="central" style={{ transform: "rotate(90deg)", transformOrigin: "center", fontSize: sz > 50 ? 14 : 10, fontWeight: 700, fill: clr, fontFamily: "'DM Sans',sans-serif" }}>{pct}%</text>
  </svg>;
}

// --- BSC ← Pillar data extraction ---
function extractNumbers(text) {
  if (!text) return { money: [], pcts: [], nums: [] };
  const money = text.match(/\$[\d.,]+[MmKk]?/g) || [];
  const pcts = text.match(/\d+%/g) || [];
  const nums = text.match(/\d[\d.,]*/g) || [];
  return { money, pcts, nums };
}

function extractPillarInsights(ct, pillar) {
  const gj = (k, fb) => { try { return JSON.parse(ct[k] || "null") || fb; } catch { return fb; } };
  const pid = pillar.id;
  const items = {};
  let filled = 0, total = 0;

  for (const it of pillar.items) {
    const tpl = it.template;
    total++;
    if (tpl.type) {
      const dk = `${pid}-${it.key}-${tpl.dataKey}`;
      const raw = ct[dk];
      if (!raw) continue;
      const t = tpl.type;
      if (t === "processflow") {
        const d = gj(dk, { flows: [] });
        if (d.flows.length) { filled++; items[it.key] = { type: t, label: it.label, processCount: d.flows.length, totalSteps: d.flows.reduce((a, f) => a + (f.steps || []).length, 0), names: d.flows.map(f => f.name).filter(Boolean) }; }
      } else if (t === "projectflow") {
        const d = gj(dk, { phases: [] });
        if (d.phases.length) { filled++; items[it.key] = { type: t, label: it.label, phaseCount: d.phases.length, totalSteps: d.phases.reduce((a, p) => a + (p.steps || []).length, 0), checkpoints: d.phases.reduce((a, p) => a + (p.checkpoints || []).length, 0) }; }
      } else if (t === "checklist") {
        const d = gj(dk, { sections: [] });
        const tot = d.sections.reduce((a, s) => a + (s.items || []).length, 0);
        const done = d.sections.reduce((a, s) => a + (s.items || []).filter(i => tpl.variant === "sops" ? i.estado === "done" : i.done).length, 0);
        if (tot > 0) { filled++; items[it.key] = { type: t, label: it.label, variant: tpl.variant, totalItems: tot, doneItems: done, completionRate: Math.round((done / tot) * 100) }; }
      } else if (t === "standards") {
        const d = gj(dk, []);
        if (d.length) { filled++; items[it.key] = { type: t, label: it.label, count: d.length, avgLevel: Math.round(d.reduce((a, s) => a + (s.nivel || 0), 0) / d.length), lowCount: d.filter(s => (s.nivel || 0) < 40).length }; }
      } else if (t === "orgchart") {
        const d = gj(dk, { nodes: [] });
        const cnt = (ns) => ns.reduce((a, n) => a + 1 + cnt(n.children || []), 0);
        const sz = cnt(d.nodes);
        if (sz > 0) { filled++; items[it.key] = { type: t, label: it.label, teamSize: sz }; }
      } else if (t === "roles") {
        const d = gj(dk, []);
        if (d.length) { filled++; items[it.key] = { type: t, label: it.label, roleCount: d.length, withResp: d.filter(r => (r.responsabilidades || []).filter(Boolean).length > 0).length }; }
      } else if (t === "pipeline") {
        const d = gj(dk, { candidates: [] });
        if (d.candidates.length) { filled++; items[it.key] = { type: t, label: it.label, count: d.candidates.length }; }
      } else if (t === "scorecard") {
        const d = gj(dk, { roles: [] });
        if (d.roles.length) { filled++; items[it.key] = { type: t, label: it.label, roles: d.roles.length, metrics: d.roles.reduce((a, r) => a + (r.metricas || []).length, 0) }; }
      } else if (t === "cards") {
        const d = gj(dk, []);
        if (d.length) { filled++; items[it.key] = { type: t, label: it.label, count: d.length }; }
      } else if (t === "breakeven") {
        const d = gj(dk, null);
        if (d) {
          filled++;
          const md = typeof migrateBE === "function" ? migrateBE(d) : d;
          const totalFijos = (md.gastos || []).reduce((a, g) => a + (g.monto || 0), 0);
          const margen = Math.max(1, md.margen || 50);
          const be = Math.round(totalFijos / (margen / 100));
          const vUF = md.valorUF || 38500;
          const mks = ["ene","feb","mar","abr","may","jun","jul","ago","sep","oct","nov","dic"];
          let totFact = 0, totContUF = 0;
          for (const mk of mks) { const m = md.meses?.[mk] || {}; totFact += m.cerrado ? (m.facReal || 0) : (m.facProy || 0); totContUF += m.cerrado ? (m.contRealUF || 0) : (m.contProyUF || 0); }
          items[it.key] = { type: t, label: it.label, totalFijos, margen, breakeven: be, breakevenAnual: be * 12, valorUF: vUF, totalFacturacion: totFact, totalContratosUF: totContUF };
        }
      }
    } else if (tpl.sections) {
      const secs = tpl.sections;
      const filledSecs = secs.filter(s => (ct[`${pid}-${it.key}-${s.key}`] || "").trim().length > 0);
      if (filledSecs.length > 0) {
        filled++;
        const allText = secs.map(s => ct[`${pid}-${it.key}-${s.key}`] || "").join("\n");
        const nums = extractNumbers(allText);
        items[it.key] = { type: "sections", label: it.label, filled: filledSecs.length, total: secs.length, completionRate: Math.round((filledSecs.length / secs.length) * 100), numbers: nums, texts: filledSecs.map(s => ({ key: s.key, label: s.label, preview: (ct[`${pid}-${it.key}-${s.key}`] || "").slice(0, 300) })) };
      }
    }
  }
  return { pillarId: pid, pillarName: pillar.name, pillarIcon: pillar.icon, pillarColor: pillar.color, items, overallCompleteness: total > 0 ? Math.round((filled / total) * 100) : 0 };
}

function suggestKPIs(perspKey, insights, ct) {
  const sugs = [];
  const find = (pid, ik) => { const ins = insights.find(i => i.pillarId === pid); return ins?.items?.[ik]; };
  const hasText = (pid, ik) => { const d = find(pid, ik); return d?.type === "sections" && d.filled > 0; };
  const textPreview = (pid, ik, sk) => {
    const key = `${pid}-${ik}-${sk}`;
    return (ct[key] || "").trim();
  };
  const firstMoney = (pid, ik) => { const d = find(pid, ik); return d?.numbers?.money?.[0] || ""; };

  if (perspKey === "financiera") {
    // Pilar 5: Finanzas
    const be = find(5, "breakeven");
    if (be) {
      const fmt = (n) => n >= 1e6 ? `$${(n / 1e6).toFixed(n % 1e6 === 0 ? 0 : 1)}M` : `$${n}`;
      const m = be.breakeven ? fmt(be.breakeven) : "$74M";
      sugs.push({ objetivo: `Superar punto de equilibrio (${m}/mes)`, indicador: "Facturacion mensual vs break-even", meta: `Nunca bajo ${m}/mes`, iniciativa: "Forecast a 90 dias + alerta si baja de umbral", source: "Pilar 5: Break-even", confidence: "alta" });
    }
    const fc = find(5, "flujoCaja");
    if (fc) {
      const reservaTxt = textPreview(5, "flujoCaja", "reserva");
      const meta = reservaTxt.match(/\$[\d.,]+[MmKk]?/) ? reservaTxt.match(/\$[\d.,]+[MmKk]?/)[0] : "$74M";
      sugs.push({ objetivo: "Construir reserva de caja", indicador: "Meses de caja disponible vs costos fijos", meta: `Reserva: ${meta} (2-3 meses)`, iniciativa: "Separar excedentes en cuenta aparte cada mes bueno", source: "Pilar 5: Flujo de caja", confidence: "media" });
    }
    const kf = find(5, "kpiFinancieros");
    if (kf) {
      sugs.push({ objetivo: "Monitorear KPIs financieros clave", indicador: "Caja + Facturacion + Dias cobranza + Backlog", meta: "Dashboard mensual con 5+ indicadores", iniciativa: "Implementar P&L mensual y revision sistematica", source: "Pilar 5: KPIs financieros", confidence: "media" });
    }
    const cxc = find(5, "cxc");
    if (cxc) {
      sugs.push({ objetivo: "Reducir cuentas por cobrar", indicador: "Dias promedio de cobranza", meta: "<30 dias promedio", iniciativa: "Politica de cobranza + escalamiento automatico", source: "Pilar 5: CxC", confidence: "media" });
    }
    if (hasText(4, "pricing")) {
      sugs.push({ objetivo: "Optimizar margenes por tipo de proyecto", indicador: "Margen de contribucion promedio", meta: ">50% margen marginal", iniciativa: "Costeo por proyecto + revision mensual", source: "Pilar 4: Pricing", confidence: "media" });
    }
    if (sugs.length === 0) {
      sugs.push({ objetivo: "Definir metas financieras del ano", indicador: "Facturacion mensual", meta: "Definir break-even y meta mensual", iniciativa: "Completar Pilar 5: Finanzas", source: "Sin datos en pilares", confidence: "baja" });
    }
  }

  if (perspKey === "clientes") {
    if (hasText(4, "pipeline")) {
      const m = firstMoney(4, "pipeline") || ">$200M";
      sugs.push({ objetivo: "Pipeline comercial activo permanente", indicador: "Valor del pipeline ($)", meta: `${m} en propuestas activas`, iniciativa: "Revisar pipeline semanalmente, nutrir cada etapa", source: "Pilar 4: Pipeline", confidence: "media" });
    }
    if (hasText(4, "metricas")) {
      sugs.push({ objetivo: "Mejorar tasa de cierre comercial", indicador: "Tasa de cierre (%)", meta: "Medir y mejorar 5pp cada trimestre", iniciativa: "Tracking de oportunidades + analisis de perdidas", source: "Pilar 4: Metricas", confidence: "media" });
    }
    if (hasText(6, "canales")) {
      sugs.push({ objetivo: "Diversificar canales de adquisicion", indicador: "Nro. canales activos generando leads", meta: "3+ canales con flujo constante", iniciativa: "Activar al menos 1 canal nuevo por trimestre", source: "Pilar 6: Canales", confidence: "media" });
    }
    if (hasText(6, "casosExito")) {
      sugs.push({ objetivo: "Documentar casos de exito", indicador: "Casos documentados con resultados", meta: "5+ casos publicados", iniciativa: "1 caso nuevo por proyecto terminado", source: "Pilar 6: Casos de exito", confidence: "media" });
    }
    if (hasText(1, "clienteIdeal")) {
      sugs.push({ objetivo: "Atraer perfil de cliente ideal", indicador: "% proyectos con cliente ideal", meta: ">70% de proyectos", iniciativa: "Filtro en cotizacion + decir NO a no-ideales", source: "Pilar 1: Cliente ideal", confidence: "media" });
    }
    if (sugs.length === 0) {
      sugs.push({ objetivo: "Desarrollar estrategia comercial", indicador: "Oportunidades activas", meta: "Definir pipeline y metricas", iniciativa: "Completar Pilar 4: Comercial y Ventas", source: "Sin datos en pilares", confidence: "baja" });
    }
  }

  if (perspKey === "procesos") {
    const pf = find(3, "procesosCore");
    if (pf) {
      sugs.push({ objetivo: "Documentar procesos core", indicador: `Procesos documentados (${pf.processCount} actuales)`, meta: `${pf.processCount}+ procesos con pasos claros`, iniciativa: "Revisar y actualizar trimestralmente", source: "Pilar 3: Procesos core", confidence: "alta" });
    }
    const sops = find(3, "sops");
    if (sops) {
      sugs.push({ objetivo: "Cumplimiento de SOPs", indicador: `Tasa de SOPs completados (${sops.completionRate}% actual)`, meta: `${sops.completionRate}% → 100%`, iniciativa: "Revisar SOPs pendientes mensualmente", source: "Pilar 3: SOPs", confidence: "alta" });
    }
    const std = find(3, "calidadCtrl");
    if (std) {
      sugs.push({ objetivo: "Elevar nivel de calidad", indicador: `Cumplimiento promedio estandares (${std.avgLevel}% actual)`, meta: `${std.avgLevel}% → 90%+`, iniciativa: `Resolver ${std.lowCount} estandares bajo 40%`, source: "Pilar 3: Control de calidad", confidence: "alta" });
    }
    const gp = find(3, "gestionProy");
    if (gp) {
      sugs.push({ objetivo: "Estandarizar gestion de proyectos", indicador: `Checkpoints activos (${gp.checkpoints} definidos)`, meta: `${gp.phaseCount} fases con ${gp.checkpoints} puntos de control`, iniciativa: "Aplicar metodologia en cada proyecto nuevo", source: "Pilar 3: Gestion de proyectos", confidence: "alta" });
    }
    if (hasText(7, "automatizaciones")) {
      sugs.push({ objetivo: "Automatizar procesos repetitivos", indicador: "Procesos automatizados", meta: "3+ automatizaciones implementadas", iniciativa: "Identificar top 3 tareas manuales repetitivas", source: "Pilar 7: Automatizaciones", confidence: "media" });
    }
    if (sugs.length === 0) {
      sugs.push({ objetivo: "Documentar operaciones", indicador: "Procesos core documentados", meta: "Al menos 3 procesos", iniciativa: "Completar Pilar 3: Procesos y Operaciones", source: "Sin datos en pilares", confidence: "baja" });
    }
  }

  if (perspKey === "aprendizaje") {
    const org = find(2, "organigrama");
    if (org) {
      sugs.push({ objetivo: "Crecer equipo segun plan", indicador: `Tamano equipo (${org.teamSize} actual)`, meta: `${org.teamSize} → meta definida en organigrama proyectado`, iniciativa: "Revisar brechas vs organigrama proyectado trimestralmente", source: "Pilar 2: Organigrama", confidence: "alta" });
    }
    const roles = find(2, "roles");
    if (roles) {
      sugs.push({ objetivo: "Roles con responsabilidades claras", indicador: `Roles definidos (${roles.withResp}/${roles.roleCount})`, meta: `${roles.roleCount}/${roles.roleCount} con responsabilidades`, iniciativa: "Completar descripcion de cada rol pendiente", source: "Pilar 2: Roles", confidence: "alta" });
    }
    const onb = find(2, "onboarding");
    if (onb) {
      sugs.push({ objetivo: "Onboarding efectivo", indicador: `Completitud onboarding (${onb.completionRate}%)`, meta: `${onb.completionRate}% → 100%`, iniciativa: "Revisar items pendientes y actualizar proceso", source: "Pilar 2: Onboarding", confidence: "alta" });
    }
    const ev = find(2, "evaluacion");
    if (ev) {
      sugs.push({ objetivo: "Evaluacion de desempeno sistematica", indicador: `Roles con evaluacion (${ev.roles})`, meta: `${ev.roles} roles con ${ev.metrics} metricas activas`, iniciativa: `Evaluar con frecuencia ${ev.frecuencia || "definida"}`, source: "Pilar 2: Evaluacion", confidence: "alta" });
    }
    if (hasText(7, "herramientas")) {
      sugs.push({ objetivo: "Implementar stack tecnologico", indicador: "Herramientas definidas vs implementadas", meta: "100% del stack implementado", iniciativa: "Cerrar brechas tecnologicas identificadas", source: "Pilar 7: Herramientas", confidence: "media" });
    }
    if (sugs.length === 0) {
      sugs.push({ objetivo: "Desarrollar equipo y capacidades", indicador: "Roles definidos", meta: "Organigrama + roles claros", iniciativa: "Completar Pilar 2: Estructura y Personas", source: "Sin datos en pilares", confidence: "baja" });
    }
  }

  return sugs;
}

export default function App() {
  const [co, setCo] = useState("belectric");
  const [st, setSt] = useState({});
  const [ct, setCt] = useState({});
  const [ap, setAp] = useState(null);
  const [ai, setAi] = useState(null);
  const [vw, setVw] = useState("dashboard");
  const [bsc, setBsc] = useState({});
  const [bscExp, setBscExp] = useState({});
  const [pn, setPn] = useState({});
  const [loaded, setLoaded] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(null);
  const [ep, setEp] = useState(0);
  const timer = useRef(null);
  const CC = COMPANIES[co];

  useEffect(() => {
    (async () => {
      try {
        const r = await window.storage.get(CC.storageKey);
        if (r?.value) { const d = JSON.parse(r.value); if (d.st) setSt(d.st); if (d.ct) setCt(d.ct); if (d.bsc) setBsc(d.bsc); if (d.pn) setPn(d.pn); setLoaded(true); return; }
      } catch(e) {}
      setSt(CC.initialStatuses); setCt(CC.initialContent); setLoaded(true);
    })();
  }, []);

  const save = useCallback(async (s, c, b, p, key) => {
    setSaving(true);
    try { await window.storage.set(key || CC.storageKey, JSON.stringify({ st: s, ct: c, bsc: b, pn: p, ts: Date.now() })); setSaved(Date.now()); } catch(e) {}
    setSaving(false);
  }, [CC.storageKey]);

  useEffect(() => { if (!loaded) return; if (timer.current) clearTimeout(timer.current); timer.current = setTimeout(() => save(st, ct, bsc, pn), 800); return () => clearTimeout(timer.current); }, [st, ct, bsc, pn, loaded, save]);

  const switchCompany = useCallback(async (newCo) => {
    if (newCo === co) return;
    if (timer.current) clearTimeout(timer.current);
    await save(st, ct, bsc, pn, CC.storageKey);
    const cfg = COMPANIES[newCo];
    try {
      const r = await window.storage.get(cfg.storageKey);
      if (r?.value) { const d = JSON.parse(r.value); setSt(d.st || {}); setCt(d.ct || {}); setBsc(d.bsc || {}); setPn(d.pn || {}); }
      else throw new Error("no data");
    } catch(e) { setSt(cfg.initialStatuses); setCt(cfg.initialContent); setBsc({}); setPn({}); }
    setVw("dashboard"); setAp(null); setAi(null); setEp(0); setCo(newCo);
  }, [co, st, ct, bsc, pn, save, CC.storageKey]);

  const uSt = (pid, ik, v) => setSt(p => ({ ...p, [`${pid}-${ik}`]: v }));
  const uCt = (pid, ik, sk, v) => setCt(p => ({ ...p, [`${pid}-${ik}-${sk}`]: v }));
  const uCt2 = (fullKey, value) => setCt(p => ({ ...p, [fullKey]: value }));
  const uBsc = (pk, sk, v) => setBsc(p => ({ ...p, [`${pk}-${sk}`]: v }));
  const toggleBscExp = k => setBscExp(p => ({ ...p, [k]: !p[k] }));
  const uPn = (id, v) => setPn(p => ({ ...p, [id]: v }));
  const getJSON = (key, fallback) => { try { return JSON.parse(ct[key] || "null") || fallback; } catch { return fallback; } };
  const setJSON = (key, data) => uCt2(key, JSON.stringify(data));

  const tp = Math.round(PILLARS.reduce((a, p) => a + calcProg(p, st), 0) / PILLARS.length);
  const pl = PILLARS.find(p => p.id === ap);
  const it = pl?.items.find(i => i.key === ai);
  const fSec = (pid, ik, t) => {
    if (!t) return 0;
    if (t.type) {
      const k = `${pid}-${ik}-${t.dataKey}`;
      try { const d = JSON.parse(ct[k] || "null"); if (!d) return 0; if (Array.isArray(d)) return d.length > 0 ? 1 : 0; if (d.nodes) return d.nodes.length > 1 ? 1 : 0; return 1; } catch { return 0; }
    }
    return t.sections ? t.sections.filter(s => ct[`${pid}-${ik}-${s.key}`]?.trim()).length : 0;
  };
  const fSecTotal = (t) => { if (!t) return 0; if (t.type) return 1; return t.sections?.length || 0; };

  const Badge = () => <div style={{ position: "fixed", bottom: 16, right: 16, padding: "6px 12px", borderRadius: 16, background: saving ? hexToRgba(CC.primaryColor, 0.25) : saved ? "rgba(76,175,80,.15)" : "transparent", color: saving ? CC.primaryColor : "#81C784", fontSize: 11, fontWeight: 600, fontFamily: "'DM Sans',sans-serif", zIndex: 100, opacity: saving || saved ? 1 : 0, backdropFilter: "blur(6px)", border: "1px solid rgba(255,255,255,.05)", transition: "all .3s" }}>{saving ? "💾 Guardando..." : "✅ Guardado"}</div>;
  const F = <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&family=Space+Mono:wght@700&display=swap" rel="stylesheet" />;
  const S = { minHeight: "100vh", background: "linear-gradient(165deg,#0a0a0a 0%,#1a1a2e 50%,#16213e 100%)", fontFamily: "'DM Sans',sans-serif", color: "#f0f0f0" };
  const Bk = (l, fn) => <button onClick={fn} style={{ display: "flex", alignItems: "center", gap: 6, background: "none", border: "none", color: "#888", fontSize: 13, cursor: "pointer", padding: "0 0 12px", fontFamily: "'DM Sans',sans-serif" }}>← {l}</button>;

  const TabBar = <div style={{ display: "flex", borderBottom: "1px solid rgba(255,255,255,.08)", background: "rgba(0,0,0,.3)", backdropFilter: "blur(10px)", position: "sticky", top: 0, zIndex: 50 }}>
    {COMPANY_ORDER.map(k => { const c = COMPANIES[k]; const active = co === k; return <button key={k} onClick={() => switchCompany(k)} style={{ flex: 1, padding: "12px 16px", background: active ? hexToRgba(c.primaryColor, 0.12) : "transparent", border: "none", borderBottom: active ? `3px solid ${c.primaryColor}` : "3px solid transparent", color: active ? c.primaryColor : "#666", fontSize: 14, fontWeight: active ? 700 : 500, cursor: "pointer", fontFamily: "'DM Sans',sans-serif", transition: "all .2s" }}>{c.name}</button>; })}
  </div>;

  if (!loaded) return <div style={{ ...S, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 16 }}>{F}<div style={{ fontSize: 36, animation: "p 1.5s infinite" }}>⚡</div><div style={{ color: "#888", fontSize: 14 }}>Cargando...</div><style>{`@keyframes p{0%,100%{opacity:1}50%{opacity:.4}}`}</style></div>;

  // ─── VISUAL EDITORS (defined outside App to preserve state) ───

  // ─── DETAIL VIEW ───
  if (vw === "detail" && pl && it) {
    const cs = st[`${pl.id}-${it.key}`] || "none";
    const tplType = it.template?.type || "text";
    const isVisual = tplType !== "text";
    const detailHeader = <>{F}{TabBar}<Badge />
      <div style={{ padding: 20, borderBottom: "1px solid rgba(255,255,255,.06)" }}>
        {Bk(pl.name, () => { setVw("pillar"); setAi(null); })}
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}><span style={{ fontSize: 24 }}>{pl.icon}</span><div><h1 style={{ margin: 0, fontSize: 22, fontWeight: 800, color: pl.color }}>{it.label}</h1><p style={{ margin: "2px 0 0", fontSize: 13, color: "#888" }}>{it.desc}</p></div></div>
      </div>
      <div style={{ padding: "16px 20px", borderBottom: "1px solid rgba(255,255,255,.04)" }}>
        <label style={{ fontSize: 11, color: "#666", textTransform: "uppercase", letterSpacing: 1, display: "block", marginBottom: 8 }}>Estado</label>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          {STATUS_OPTIONS.map(o => <button key={o.value} onClick={() => uSt(pl.id, it.key, o.value)} style={{ padding: "8px 14px", borderRadius: 10, fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "'DM Sans',sans-serif", border: cs === o.value ? `2px solid ${pl.color}` : "2px solid transparent", background: cs === o.value ? o.bg : "rgba(255,255,255,.04)", color: cs === o.value ? o.text : "#666" }}>{o.emoji} {o.label}</button>)}
        </div>
      </div>
    </>;

    if (isVisual) {
      return <div style={S}>{detailHeader}
        <div style={{ padding: "16px 20px 40px" }}>
          {tplType === "orgchart" && <OrgChartEditor pid={pl.id} ik={it.key} ct={ct} onUpdate={uCt2} color={pl.color} />}
          {tplType === "roles" && <RolesEditor pid={pl.id} ik={it.key} ct={ct} onUpdate={uCt2} color={pl.color} />}
          {tplType === "pipeline" && <PipelineEditor pid={pl.id} ik={it.key} ct={ct} onUpdate={uCt2} color={pl.color} />}
          {tplType === "checklist" && <ChecklistEditor pid={pl.id} ik={it.key} ct={ct} onUpdate={uCt2} color={pl.color} variant={it.template.variant} />}
          {tplType === "scorecard" && <ScorecardEditor pid={pl.id} ik={it.key} ct={ct} onUpdate={uCt2} color={pl.color} />}
          {tplType === "cards" && <CardsEditor pid={pl.id} ik={it.key} ct={ct} onUpdate={uCt2} color={pl.color} />}
          {tplType === "processflow" && <ProcessFlowEditor pid={pl.id} ik={it.key} ct={ct} onUpdate={uCt2} color={pl.color} />}
          {tplType === "projectflow" && <ProjectFlowEditor pid={pl.id} ik={it.key} ct={ct} onUpdate={uCt2} color={pl.color} />}
          {tplType === "standards" && <StandardsEditor pid={pl.id} ik={it.key} ct={ct} onUpdate={uCt2} color={pl.color} />}
          {tplType === "breakeven" && <BreakevenEditor pid={pl.id} ik={it.key} ct={ct} onUpdate={uCt2} color={pl.color} />}
          {tplType === "suppliers" && <SuppliersEditor pid={pl.id} ik={it.key} ct={ct} onUpdate={uCt2} color={pl.color} />}
        </div>
      </div>;
    }

    // Original textarea-based detail view for text type
    return <div style={S}>{detailHeader}
      <div style={{ padding: "16px 20px 40px" }}>
        <div style={{ fontSize: 11, color: "#666", textTransform: "uppercase", letterSpacing: 1, marginBottom: 12 }}>Desarrollo · {fSec(pl.id, it.key, it.template)}/{fSecTotal(it.template)}</div>
        <div style={{ height: 4, borderRadius: 2, background: "rgba(255,255,255,.06)", marginBottom: 20, overflow: "hidden" }}><div style={{ height: "100%", borderRadius: 2, background: pl.color, transition: "width .4s", width: `${fSecTotal(it.template) ? (fSec(pl.id, it.key, it.template) / fSecTotal(it.template)) * 100 : 0}%` }} /></div>
        {it.template.sections.map((sec, i) => {
          const v = ct[`${pl.id}-${it.key}-${sec.key}`] || ""; const fl = v.trim().length > 0;
          return <div key={sec.key} style={{ marginBottom: 16 }}>
            <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 14, fontWeight: 600, marginBottom: 8, color: fl ? "#e0e0e0" : "#999" }}>
              <span style={{ width: 22, height: 22, borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, background: fl ? pl.color + "33" : "rgba(255,255,255,.06)", color: fl ? pl.color : "#555" }}>{fl ? "✓" : i + 1}</span>{sec.label}
            </label>
            <textarea value={v} onChange={e => uCt(pl.id, it.key, sec.key, e.target.value)} placeholder={sec.placeholder} style={{ width: "100%", minHeight: 90, padding: "12px 14px", borderRadius: 10, border: `1px solid ${fl ? pl.color + "33" : "rgba(255,255,255,.08)"}`, background: "rgba(0,0,0,.25)", color: "#e0e0e0", fontSize: 13, lineHeight: 1.5, fontFamily: "'DM Sans',sans-serif", resize: "vertical", outline: "none", boxSizing: "border-box" }} onFocus={e => e.target.style.borderColor = pl.color + "88"} onBlur={e => e.target.style.borderColor = fl ? pl.color + "33" : "rgba(255,255,255,.08)"} />
          </div>;
        })}
      </div>
    </div>;
  }

  // PILLAR VIEW
  if (vw === "pillar" && pl) {
    return <div style={S}>{F}{TabBar}<Badge />
      <div style={{ padding: 20 }}>
        {Bk("Pilares", () => { setVw("dashboard"); setAp(null); })}
        <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 6 }}>
          <Ring pct={calcProg(pl, st)} clr={pl.color} sz={60} />
          <div><h1 style={{ margin: 0, fontSize: 22, fontWeight: 800, color: pl.color }}>{pl.icon} {pl.name}</h1><p style={{ margin: "2px 0 0", fontSize: 12, color: "#666" }}>{pl.items.length} elementos</p></div>
        </div>
        <div style={{ margin: "16px 0", padding: "12px 16px", background: "rgba(255,255,255,.02)", borderRadius: 10, border: "1px solid rgba(255,255,255,.05)" }}>
          <div style={{ fontSize: 10, color: "#666", textTransform: "uppercase", letterSpacing: 1, marginBottom: 8 }}>🎯 BSC</div>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>{BSC_PERSPECTIVES.filter(b => pl.bscLink.includes(b.key)).map(b => <span key={b.key} style={{ padding: "4px 10px", borderRadius: 6, fontSize: 11, fontWeight: 600, background: b.color + "22", color: b.color }}>{b.icon} {b.label}</span>)}</div>
        </div>
      </div>
      <div style={{ padding: "0 20px 40px" }}>
        {pl.items.map(i => {
          const s = getSt(st[`${pl.id}-${i.key}`] || "none"); const f = fSec(pl.id, i.key, i.template); const t = fSecTotal(i.template);
          return <button key={i.key} onClick={() => { setAi(i.key); setVw("detail"); }} style={{ display: "flex", alignItems: "center", gap: 12, width: "100%", padding: "14px 16px", marginBottom: 8, background: "rgba(255,255,255,.03)", borderRadius: 12, border: "1px solid rgba(255,255,255,.06)", cursor: "pointer", textAlign: "left", color: "#f0f0f0", fontFamily: "'DM Sans',sans-serif" }} onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,.06)"} onMouseLeave={e => e.currentTarget.style.background = "rgba(255,255,255,.03)"}>
            <span style={{ padding: "4px 10px", borderRadius: 8, fontSize: 11, fontWeight: 600, background: s.bg, color: s.text, whiteSpace: "nowrap" }}>{s.emoji}</span>
            <div style={{ flex: 1 }}><div style={{ fontSize: 14, fontWeight: 600 }}>{i.label}</div><div style={{ fontSize: 11, color: "#666", marginTop: 2 }}>{i.desc} · <span style={{ color: f > 0 ? pl.color : "#555" }}>{f}/{t}</span></div></div>
            <span style={{ color: "#444", fontSize: 14 }}>→</span>
          </button>;
        })}
      </div>
    </div>;
  }

  // BSC VIEW
  if (vw === "bsc") {
    return <div style={S}>{F}{TabBar}<Badge />
      <div style={{ padding: 20 }}>{Bk("Volver", () => setVw("dashboard"))}<h1 style={{ margin: "0 0 4px", fontSize: 22, fontWeight: 800 }}>🎯 Balanced Scorecard</h1><p style={{ margin: 0, fontSize: 13, color: "#888" }}>Estrategia → Ejecución · Auto-vinculado a pilares</p></div>
      <div style={{ padding: "0 20px 40px" }}>
        {BSC_PERSPECTIVES.map(p => {
          const lk = PILLARS.filter(pl => pl.bscLink.includes(p.key));
          const insArr = lk.map(lp => extractPillarInsights(ct, lp));
          const sgs = suggestKPIs(p.key, insArr, ct);
          return <div key={p.key} style={{ marginBottom: 16, padding: 16, background: "rgba(255,255,255,.03)", borderRadius: 14, border: `1px solid ${p.color}22` }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}><span style={{ fontSize: 22 }}>{p.icon}</span><div><h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: p.color }}>{p.label}</h3><p style={{ margin: 0, fontSize: 12, color: "#888" }}>{p.question}</p></div></div>

            {/* Pillar data completeness bars */}
            <div style={{ marginBottom: 12, padding: 10, borderRadius: 8, background: "rgba(0,0,0,.15)" }}>
              <div style={{ fontSize: 9, color: "#555", textTransform: "uppercase", letterSpacing: 1, marginBottom: 6 }}>Datos desde pilares</div>
              {insArr.map(ins => <div key={ins.pillarId} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                <span style={{ fontSize: 11, color: ins.pillarColor, fontWeight: 600, minWidth: 140, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{ins.pillarIcon} {ins.pillarName}</span>
                <div style={{ flex: 1, height: 4, borderRadius: 2, background: "rgba(255,255,255,.06)", overflow: "hidden" }}>
                  <div style={{ height: "100%", borderRadius: 2, background: ins.pillarColor, width: `${ins.overallCompleteness}%`, transition: "width .3s" }} />
                </div>
                <span style={{ fontSize: 10, color: "#666", minWidth: 30, textAlign: "right" }}>{ins.overallCompleteness}%</span>
              </div>)}
            </div>

            {/* Suggestions panel */}
            {sgs.length > 0 && <div style={{ marginBottom: 12, padding: 12, borderRadius: 10, background: `${p.color}08`, border: `1px dashed ${p.color}33` }}>
              <div onClick={() => toggleBscExp(p.key)} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", cursor: "pointer", marginBottom: bscExp[p.key] ? 10 : 0 }}>
                <span style={{ fontSize: 11, fontWeight: 700, color: p.color, textTransform: "uppercase", letterSpacing: 1 }}>💡 {sgs.length} sugerencia{sgs.length > 1 ? "s" : ""} desde pilares</span>
                <span style={{ color: "#666", fontSize: 12 }}>{bscExp[p.key] ? "▼" : "▶"}</span>
              </div>
              {bscExp[p.key] && sgs.map((sg, idx) => <div key={idx} style={{ padding: 10, marginBottom: 8, borderRadius: 8, background: "rgba(0,0,0,.2)", border: "1px solid rgba(255,255,255,.06)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 4 }}>
                  <div style={{ fontSize: 12, fontWeight: 600, color: "#e0e0e0" }}>{sg.objetivo}</div>
                  <span style={{ fontSize: 9, padding: "2px 6px", borderRadius: 4, whiteSpace: "nowrap", marginLeft: 8, background: sg.confidence === "alta" ? "#4CAF5022" : sg.confidence === "media" ? "#FF980022" : "#88888822", color: sg.confidence === "alta" ? "#4CAF50" : sg.confidence === "media" ? "#FF9800" : "#888" }}>{sg.confidence === "alta" ? "Dato concreto" : sg.confidence === "media" ? "Texto libre" : "Genérica"}</span>
                </div>
                <div style={{ fontSize: 11, color: "#888", marginBottom: 2 }}>KPI: {sg.indicador}</div>
                <div style={{ fontSize: 11, color: "#888", marginBottom: 2 }}>Meta: {sg.meta}</div>
                <div style={{ fontSize: 10, color: "#555", marginBottom: 6, fontStyle: "italic" }}>{sg.source}</div>
                <div style={{ display: "flex", gap: 6 }}>
                  {VBtn("Usar todo", () => { uBsc(p.key, "objetivo", sg.objetivo); uBsc(p.key, "indicador", sg.indicador); uBsc(p.key, "meta", sg.meta); uBsc(p.key, "iniciativa", sg.iniciativa); }, p.color, true)}
                  {VBtn("Solo KPI", () => { uBsc(p.key, "indicador", sg.indicador); uBsc(p.key, "meta", sg.meta); }, "#888", true)}
                </div>
              </div>)}
            </div>}

            {[{ k: "objetivo", l: "Objetivo", ph: "¿Qué lograr?" }, { k: "indicador", l: "KPI", ph: "¿Cómo medir?" }, { k: "meta", l: "Meta", ph: "Número concreto" }, { k: "iniciativa", l: "Iniciativa", ph: "¿Qué hacer?" }].map(f => <div key={f.k} style={{ marginBottom: 10 }}><label style={{ fontSize: 11, color: "#999", fontWeight: 600, display: "block", marginBottom: 4 }}>{f.l}</label><textarea value={bsc[`${p.key}-${f.k}`] || ""} onChange={e => uBsc(p.key, f.k, e.target.value)} placeholder={f.ph} style={{ width: "100%", minHeight: 50, padding: "10px 12px", borderRadius: 8, border: "1px solid rgba(255,255,255,.08)", background: "rgba(0,0,0,.25)", color: "#e0e0e0", fontSize: 13, fontFamily: "'DM Sans',sans-serif", resize: "vertical", outline: "none", boxSizing: "border-box" }} /></div>)}
            <div style={{ borderTop: "1px solid rgba(255,255,255,.05)", paddingTop: 10 }}><span style={{ fontSize: 10, color: "#555", textTransform: "uppercase", letterSpacing: 1 }}>Pilares:</span><div style={{ display: "flex", gap: 6, marginTop: 6, flexWrap: "wrap" }}>{lk.map(l => <span key={l.id} onClick={() => { setAp(l.id); setVw("pillar"); }} style={{ padding: "4px 10px", borderRadius: 6, fontSize: 11, fontWeight: 600, cursor: "pointer", background: l.color + "22", color: l.color }}>{l.icon} {l.name}</span>)}</div></div>
          </div>;
        })}
      </div>
    </div>;
  }

  // SCALING VIEW
  if (vw === "scaling") {
    return <div style={S}>{F}{TabBar}<Badge />
      <div style={{ padding: 20 }}>{Bk("Volver", () => setVw("dashboard"))}
        <h1 style={{ margin: "0 0 4px", fontSize: 22, fontWeight: 800, background: CC.gradient, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Plan de Escalamiento</h1>
        <p style={{ margin: 0, fontSize: 13, color: "#888" }}>Blindar → Estabilizar → Crecer → Escalar</p>
      </div>

      {/* Summary box */}
      <div style={{ margin: "0 20px 16px", padding: 14, borderRadius: 12, background: CC.scalingSummary.bg, border: `1px solid ${CC.scalingSummary.border}` }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: CC.scalingSummary.color, marginBottom: 6 }}>{CC.scalingSummary.title}</div>
        <div style={{ fontSize: 12, color: "#ccc", lineHeight: 1.7 }}>
          {CC.scalingSummary.lines.map((line, i) => <span key={i}>{line}{i < CC.scalingSummary.lines.length - 1 && <br/>}</span>)}
        </div>
      </div>

      <div style={{ padding: "0 20px", marginBottom: 20 }}>
        <div style={{ display: "flex", alignItems: "center" }}>
          {CC.scalingPhases.map((ph, i) => <div key={ph.id} style={{ flex: 1, textAlign: "center", position: "relative" }}>
            <button onClick={() => setEp(ph.id)} style={{ width: 36, height: 36, borderRadius: "50%", border: `3px solid ${ph.color}`, background: ep === ph.id ? ph.color : "transparent", color: ep === ph.id ? "#fff" : ph.color, fontSize: 14, fontWeight: 800, cursor: "pointer", fontFamily: "'DM Sans',sans-serif", position: "relative", zIndex: 2 }}>{ph.id}</button>
            <div style={{ fontSize: 10, color: ep === ph.id ? ph.color : "#666", marginTop: 4, fontWeight: 600 }}>{ph.timeline}</div>
            {i < 3 && <div style={{ position: "absolute", top: 18, left: "55%", right: "-45%", height: 2, background: "rgba(255,255,255,.1)", zIndex: 1 }} />}
          </div>)}
        </div>
      </div>
      <div style={{ padding: "0 20px 40px" }}>
        {CC.scalingPhases.map(ph => {
          const open = ep === ph.id;
          const actChecks = pn[`${ph.id}-actions`] || {};
          const hireChecks = pn[`${ph.id}-hires`] || {};
          const kpiVals = pn[`${ph.id}-kpis`] || {};
          const triggerDone = pn[`${ph.id}-trigger`] || false;
          const totalItems = ph.actions.length + ph.hires.length;
          const doneItems = Object.values(actChecks).filter(Boolean).length + Object.values(hireChecks).filter(Boolean).length;
          const allDone = totalItems > 0 && doneItems === totalItems;
          return <div key={ph.id} style={{ marginBottom: 12, borderRadius: 14, border: `1px solid ${open ? ph.color + "44" : "rgba(255,255,255,.06)"}`, background: "rgba(255,255,255,.03)", overflow: "hidden" }}>
            <button onClick={() => setEp(open ? null : ph.id)} style={{ display: "flex", alignItems: "center", gap: 12, width: "100%", padding: 16, background: "none", border: "none", cursor: "pointer", color: "#f0f0f0", fontFamily: "'DM Sans',sans-serif", textAlign: "left" }}>
              <span style={{ fontSize: 24 }}>{ph.icon}</span>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ fontSize: 15, fontWeight: 700, color: ph.color }}>{ph.name}</span>
                  {totalItems > 0 && <span style={{ fontSize: 10, fontWeight: 700, padding: "2px 7px", borderRadius: 10, background: allDone ? "#81C78433" : "rgba(255,255,255,.08)", color: allDone ? "#81C784" : "#888" }}>{doneItems}/{totalItems}</span>}
                </div>
                <div style={{ fontSize: 11, color: "#888" }}>{ph.timeline} · {ph.people}</div>
              </div>
              <div style={{ textAlign: "right" }}><div style={{ fontSize: 12, fontWeight: 800, color: ph.color }}>{ph.net}</div></div>
            </button>
            {open && <div style={{ padding: "0 16px 16px" }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 16 }}>
                {ph.kpis.map((k, i) => {
                  const val = kpiVals[i] !== undefined ? kpiVals[i] : "";
                  const hasVal = val !== "";
                  return <div key={k.label} style={{ padding: "10px 12px", borderRadius: 8, background: "rgba(0,0,0,.2)", border: "1px solid rgba(255,255,255,.05)" }}>
                    <div style={{ fontSize: 10, color: "#888", marginBottom: 2 }}>{k.label}</div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: ph.color }}>{k.target}</div>
                    <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 4 }}>
                      <span style={{ width: 6, height: 6, borderRadius: "50%", background: hasVal ? "#81C784" : "#555", flexShrink: 0 }} />
                      <input value={val} onChange={e => uPn(`${ph.id}-kpis`, { ...kpiVals, [i]: e.target.value })} placeholder={k.current || "Actual..."} style={{ padding: "4px 8px", borderRadius: 6, border: "1px solid rgba(255,255,255,.08)", background: "rgba(0,0,0,.2)", color: "#e0e0e0", fontSize: 11, fontFamily: "'DM Sans',sans-serif", outline: "none", width: "100%", boxSizing: "border-box" }} />
                    </div>
                  </div>;
                })}
              </div>
              <div style={{ marginBottom: 12 }}>
                <div style={{ fontSize: 11, color: "#999", textTransform: "uppercase", letterSpacing: 1, marginBottom: 8 }}>Acciones</div>
                {ph.actions.map((a, i) => {
                  const checked = actChecks[i] || false;
                  return <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 8, marginBottom: 6, fontSize: 13 }}>
                    <input type="checkbox" checked={checked} onChange={e => uPn(`${ph.id}-actions`, { ...actChecks, [i]: e.target.checked })} style={{ marginTop: 3, accentColor: ph.color, cursor: "pointer", flexShrink: 0 }} />
                    <span style={{ color: checked ? "#666" : "#ccc", textDecoration: checked ? "line-through" : "none", opacity: checked ? 0.5 : 1 }}>{a}</span>
                  </div>;
                })}
              </div>
              {ph.hires.length > 0 && <div style={{ marginBottom: 12 }}>
                <div style={{ fontSize: 11, color: "#999", textTransform: "uppercase", letterSpacing: 1, marginBottom: 8 }}>Contrataciones</div>
                {ph.hires.map((h, i) => {
                  const checked = hireChecks[i] || false;
                  return <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4, fontSize: 13 }}>
                    <input type="checkbox" checked={checked} onChange={e => uPn(`${ph.id}-hires`, { ...hireChecks, [i]: e.target.checked })} style={{ accentColor: ph.color, cursor: "pointer", flexShrink: 0 }} />
                    <span style={{ color: checked ? "#666" : "#ccc", textDecoration: checked ? "line-through" : "none", opacity: checked ? 0.5 : 1 }}>👤 {h}</span>
                  </div>;
                })}
              </div>}
              <div style={{ padding: "10px 12px", borderRadius: 8, background: triggerDone ? "#81C78411" : ph.color + "11", border: `1px solid ${triggerDone ? "#81C78422" : ph.color + "22"}`, marginBottom: 12 }}>
                <div style={{ fontSize: 10, color: triggerDone ? "#81C784" : ph.color, textTransform: "uppercase", letterSpacing: 1, marginBottom: 4 }}>🎯 Gatillo para avanzar</div>
                <div style={{ display: "flex", alignItems: "flex-start", gap: 8 }}>
                  <input type="checkbox" checked={triggerDone} onChange={e => uPn(`${ph.id}-trigger`, e.target.checked)} style={{ marginTop: 3, accentColor: "#81C784", cursor: "pointer", flexShrink: 0 }} />
                  <span style={{ fontSize: 13, color: triggerDone ? "#81C784" : "#ddd", textDecoration: triggerDone ? "line-through" : "none" }}>{ph.trigger}</span>
                </div>
              </div>
              <div><div style={{ fontSize: 11, color: "#999", textTransform: "uppercase", letterSpacing: 1, marginBottom: 6 }}>Mis notas</div><textarea value={pn[ph.id] || ""} onChange={e => uPn(ph.id, e.target.value)} placeholder="Avances, decisiones, pendientes..." style={{ width: "100%", minHeight: 70, padding: "10px 12px", borderRadius: 8, border: "1px solid rgba(255,255,255,.08)", background: "rgba(0,0,0,.25)", color: "#e0e0e0", fontSize: 13, fontFamily: "'DM Sans',sans-serif", resize: "vertical", outline: "none", boxSizing: "border-box" }} /></div>
            </div>}
          </div>;
        })}
        <div style={{ marginTop: 20, padding: 16, borderRadius: 14, background: "rgba(255,255,255,.02)", border: "1px solid rgba(255,255,255,.06)" }}>
          <h3 style={{ margin: "0 0 12px", fontSize: 14, fontWeight: 700, color: CC.secondaryColor }}>⚖️ Reglas de decisión</h3>
          <div style={{ marginBottom: 12 }}><div style={{ fontSize: 12, fontWeight: 700, color: "#E84855", marginBottom: 6 }}>🚫 NUNCA escalar si:</div><div style={{ fontSize: 12, color: "#ccc", lineHeight: 1.6 }}>{CC.scalingRules.never.map((r, i) => <span key={i}>• {r}{i < CC.scalingRules.never.length - 1 && <br/>}</span>)}</div></div>
          <div><div style={{ fontSize: 12, fontWeight: 700, color: "#81C784", marginBottom: 6 }}>✅ Escalar cuando:</div><div style={{ fontSize: 12, color: "#ccc", lineHeight: 1.6 }}>{CC.scalingRules.go.map((r, i) => <span key={i}>• {r}{i < CC.scalingRules.go.length - 1 && <br/>}</span>)}</div></div>
        </div>
      </div>
    </div>;
  }

  // COMPARE VIEW
  if (vw === "compare") {
    return <div style={S}>{F}{TabBar}<Badge />
      <div style={{ padding: 20 }}>{Bk("Volver", () => setVw("dashboard"))}<h2 style={{ fontSize: 18, fontWeight: 700, margin: "0 0 16px" }}>📊 Comparación</h2>
        {PILLARS.map(p => {
          const pg = calcProg(p, st); const d = p.items.filter(i => st[`${p.id}-${i.key}`] === "done").length; const pr = p.items.filter(i => st[`${p.id}-${i.key}`] === "progress").length; const id = p.items.filter(i => st[`${p.id}-${i.key}`] === "idea").length; const n = p.items.length - d - pr - id;
          const fl = p.items.reduce((a, i) => a + fSec(p.id, i.key, i.template), 0); const ts = p.items.reduce((a, i) => a + fSecTotal(i.template), 0);
          return <div key={p.id} style={{ marginBottom: 12, padding: 14, background: "rgba(255,255,255,.03)", borderRadius: 12, border: "1px solid rgba(255,255,255,.06)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}><span style={{ fontSize: 14, fontWeight: 600 }}>{p.icon} {p.name}</span><span style={{ fontSize: 16, fontWeight: 800, color: p.color }}>{pg}%</span></div>
            <div style={{ display: "flex", height: 6, borderRadius: 3, overflow: "hidden", background: "#222", marginBottom: 6 }}>{d > 0 && <div style={{ width: `${(d/p.items.length)*100}%`, background: "#4CAF50" }} />}{pr > 0 && <div style={{ width: `${(pr/p.items.length)*100}%`, background: "#2196F3" }} />}{id > 0 && <div style={{ width: `${(id/p.items.length)*100}%`, background: "#FF9800" }} />}</div>
            <div style={{ fontSize: 11, color: "#666" }}>✅{d} 🔧{pr} 💭{id} ⬜{n} · {fl}/{ts} secciones</div>
          </div>;
        })}
      </div>
    </div>;
  }

  // DASHBOARD
  return <div style={S}>{F}{TabBar}<Badge />
    <div style={{ padding: "24px 20px 16px", borderBottom: "1px solid rgba(255,255,255,.06)" }}>
      <span style={{ fontSize: 10, letterSpacing: 4, textTransform: "uppercase", color: "#555", fontFamily: "'Space Mono',monospace" }}>{CC.name.toUpperCase()}</span>
      <h1 style={{ fontSize: 28, fontWeight: 800, margin: "4px 0 6px", background: CC.gradient, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>ESTRATEGIA</h1>
      <p style={{ fontSize: 13, color: "#777", margin: 0 }}>{CC.tagline}</p>
    </div>
    <div style={{ margin: "20px 20px 8px", padding: 20, background: "rgba(255,255,255,.03)", borderRadius: 16, border: "1px solid rgba(255,255,255,.06)", display: "flex", alignItems: "center", gap: 20 }}>
      <Ring pct={tp} clr={CC.primaryColor} sz={72} />
      <div><div style={{ fontSize: 11, color: "#888", textTransform: "uppercase", letterSpacing: 1, marginBottom: 2 }}>Madurez empresarial</div><div style={{ fontSize: 20, fontWeight: 800 }}>{tp < 20 ? "Inicial" : tp < 40 ? "En desarrollo" : tp < 60 ? "Estructurándose" : tp < 80 ? "Madurando" : "Sólido"}</div><div style={{ fontSize: 11, color: "#666", marginTop: 2 }}>{PILLARS.reduce((a, p) => a + p.items.filter(i => st[`${p.id}-${i.key}`] === "done").length, 0)}/{PILLARS.reduce((a, p) => a + p.items.length, 0)} completados</div></div>
    </div>

    {/* Alert banners */}
    {CC.alerts.map((al, i) => <div key={i} style={{ margin: i === 0 ? "8px 20px 4px" : "4px 20px 4px", padding: "12px 16px", borderRadius: 12, background: al.bg, border: `1px solid ${al.border}`, display: "flex", alignItems: "center", gap: 10, cursor: al.onClick ? "pointer" : "default" }} onClick={() => al.onClick && setVw(al.onClick)}>
      <span style={{ fontSize: 18 }}>{al.icon}</span><div style={{ flex: 1 }}><div style={{ fontSize: 13, fontWeight: 700, color: al.color }}>{al.title}</div>{al.subtitle && <div style={{ fontSize: 11, color: "#999" }}>{al.subtitle}</div>}</div>
    </div>)}

    <div style={{ display: "flex", gap: 6, padding: "12px 20px 8px", flexWrap: "wrap" }}>
      {[{ k: "dashboard", l: "📋 Pilares" }, { k: "scaling", l: "🚀 Plan" }, { k: "bsc", l: "🎯 BSC" }, { k: "compare", l: "📊 Comparar" }].map(t => <button key={t.k} onClick={() => setVw(t.k)} style={{ padding: "8px 14px", borderRadius: 20, border: "none", fontSize: 13, fontWeight: 600, cursor: "pointer", background: vw === t.k ? hexToRgba(CC.primaryColor, 0.2) : "rgba(255,255,255,.05)", color: vw === t.k ? CC.primaryColor : "#888", fontFamily: "'DM Sans',sans-serif" }}>{t.l}</button>)}
    </div>
    <div style={{ padding: "8px 20px 40px" }}>
      {PILLARS.map(p => {
        const pg = calcProg(p, st); const fl = p.items.reduce((a, i) => a + fSec(p.id, i.key, i.template), 0); const ts = p.items.reduce((a, i) => a + fSecTotal(i.template), 0);
        return <button key={p.id} onClick={() => { setAp(p.id); setVw("pillar"); }} style={{ display: "flex", alignItems: "center", gap: 14, width: "100%", padding: 16, marginBottom: 8, background: "rgba(255,255,255,.03)", borderRadius: 14, border: "1px solid rgba(255,255,255,.06)", cursor: "pointer", textAlign: "left", color: "#f0f0f0", fontFamily: "'DM Sans',sans-serif" }} onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,.06)"} onMouseLeave={e => e.currentTarget.style.background = "rgba(255,255,255,.03)"}>
          <Ring pct={pg} clr={p.color} sz={50} />
          <div style={{ flex: 1 }}><div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 2 }}><span style={{ fontSize: 15 }}>{p.icon}</span><span style={{ fontSize: 15, fontWeight: 700 }}>{p.name}</span></div><span style={{ fontSize: 11, color: "#666" }}>{p.items.filter(i => st[`${p.id}-${i.key}`] === "done").length}/{p.items.length} items · {fl}/{ts} secciones</span></div>
          <span style={{ fontSize: 16, color: "#444" }}>→</span>
        </button>;
      })}
    </div>
    <div style={{ textAlign: "center", padding: 20, fontSize: 11, color: "#333" }}>{CC.name} — Estrategia · {new Date().getFullYear()}</div>
  </div>;
}
