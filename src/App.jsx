import { useState, useEffect, useRef, useCallback } from "react";

const BSC_PERSPECTIVES = [
  { key: "financiera", label: "Financiera", icon: "💰", color: "#6B4C9A", question: "¿Qué resultados financieros debemos lograr?" },
  { key: "clientes", label: "Clientes", icon: "🤝", color: "#2D7DD2", question: "¿Cómo nos deben ver nuestros clientes?" },
  { key: "procesos", label: "Procesos Internos", icon: "⚙️", color: "#45B69C", question: "¿En qué procesos debemos ser excelentes?" },
  { key: "aprendizaje", label: "Aprendizaje y Crecimiento", icon: "🌱", color: "#E8530E", question: "¿Cómo seguimos mejorando y creando valor?" },
];

const SCALING_PHASES = [
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

const PILLARS = [
  {
    id: 1, name: "Visión y Estrategia", icon: "🧭", color: "#E8530E",
    bscLink: ["financiera", "clientes", "procesos", "aprendizaje"],
    items: [
      { key: "mision", label: "Misión", desc: "¿Por qué existe Belectric?", template: { sections: [
        { key: "definicion", label: "Definición de la misión", placeholder: "Ej: Proveer soluciones eléctricas y de telecomunicaciones de alta calidad..." },
        { key: "problema", label: "¿Qué problema resolvemos?", placeholder: "Problema principal que Belectric soluciona..." },
        { key: "como", label: "¿Cómo lo resolvemos?", placeholder: "Nuestro enfoque único..." },
        { key: "paraquien", label: "¿Para quién lo hacemos?", placeholder: "Segmentos de clientes principales..." },
      ]}},
      { key: "vision", label: "Visión a 10 años", desc: "¿Cómo se ve el futuro?", template: { sections: [
        { key: "declaracion", label: "Declaración de visión", placeholder: "En 10 años, Belectric será..." },
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
        { key: "meta", label: "La meta audaz", placeholder: "Ej: Ser la empresa de ingeniería eléctrica más innovadora de Sudamérica..." },
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
      { key: "organigrama", label: "Organigrama", desc: "Estructura jerárquica", template: { sections: [{ key: "estructura", label: "Estructura actual", placeholder: "Jerarquía actual..." }, { key: "brechas", label: "Brechas", placeholder: "Roles que faltan..." }, { key: "futuro", label: "Organigrama objetivo", placeholder: "Cómo debería verse..." }]}},
      { key: "roles", label: "Roles y responsabilidades", desc: "Cada puesto definido", template: { sections: [{ key: "puestos", label: "Puestos clave", placeholder: "Lista de roles..." }, { key: "accountability", label: "Accountability chart", placeholder: "¿Quién responde por qué?" }]}},
      { key: "contratacion", label: "Proceso de contratación", desc: "Selección de talento", template: { sections: [{ key: "proceso", label: "Proceso paso a paso", placeholder: "Etapas y filtros..." }, { key: "criterios", label: "Criterios", placeholder: "Competencias y fit cultural..." }]}},
      { key: "onboarding", label: "Onboarding", desc: "Integración de nuevos", template: { sections: [{ key: "plan", label: "Plan primeros 30 días", placeholder: "Qué debe aprender..." }, { key: "materiales", label: "Materiales", placeholder: "Manual, accesos..." }]}},
      { key: "evaluacion", label: "Evaluación de desempeño", desc: "Medición y feedback", template: { sections: [{ key: "frecuencia", label: "Frecuencia y formato", placeholder: "Cada cuánto y cómo..." }, { key: "metricas", label: "Métricas por rol", placeholder: "KPIs por puesto..." }]}},
      { key: "cultura", label: "Cultura organizacional", desc: "Ambiente y dinámicas", template: { sections: [{ key: "definicion", label: "Cultura deseada", placeholder: "Cómo se siente trabajar aquí..." }, { key: "rituales", label: "Rituales", placeholder: "Reuniones, celebraciones..." }]}},
    ],
  },
  {
    id: 3, name: "Procesos y Operaciones", icon: "⚙️", color: "#45B69C", bscLink: ["procesos"],
    items: [
      { key: "procesosCore", label: "Procesos core", desc: "Ventas → Ejecución → Entrega", template: { sections: [{ key: "mapa", label: "Mapa de procesos", placeholder: "Flujo completo..." }, { key: "ejecucion", label: "Ejecución", placeholder: "Planificación, asignación..." }, { key: "entrega", label: "Entrega", placeholder: "Pruebas, documentación..." }]}},
      { key: "sops", label: "SOPs", desc: "Procedimientos estándar", template: { sections: [{ key: "existentes", label: "SOPs existentes", placeholder: "Lista..." }, { key: "faltantes", label: "SOPs faltantes", placeholder: "Los que faltan..." }]}},
      { key: "calidadCtrl", label: "Control de calidad", desc: "Estándares", template: { sections: [{ key: "estandares", label: "Estándares", placeholder: "Normas y criterios..." }, { key: "inspecciones", label: "Inspecciones", placeholder: "Puntos de verificación..." }]}},
      { key: "gestionProy", label: "Gestión de proyectos", desc: "Metodología", template: { sections: [{ key: "metodologia", label: "Metodología actual", placeholder: "Cómo gestionan hoy..." }, { key: "seguimiento", label: "Seguimiento", placeholder: "Monitoreo de avance..." }]}},
      { key: "proveedores", label: "Gestión de proveedores", desc: "Evaluación y relación", template: { sections: [{ key: "evaluacion", label: "Criterios", placeholder: "Cómo se seleccionan..." }, { key: "listado", label: "Proveedores clave", placeholder: "Los más importantes..." }]}},
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
      { key: "breakeven", label: "Punto de equilibrio", desc: "Break-even point", template: { sections: [{ key: "costosFijos", label: "Costos fijos mensuales", placeholder: "Arriendos, sueldos..." }, { key: "ventaMinima", label: "Venta mínima mensual", placeholder: "Cuánto vender para no perder..." }]}},
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

const INITIAL_CONTENT = {
  // P&L REAL
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
  // VISIÓN Y ESTRATEGIA
  "1-meta3-objetivo": "META 3 AÑOS: De sobrevivir a empresa sólida\n\nAño 1 (2026): ESTABILIZAR\n  • ~25 personas (misma estructura)\n  • Facturación promedio: $120M/mes\n  • Reserva: 3 meses de caja\n  • Nunca bajo break-even\n\nAño 2 (2027): CRECER\n  • ~30 personas (+maestros +comercial)\n  • Facturación: $150-200M/mes\n  • Backlog: $4,000M+\n\nAño 3 (2028): ESCALAR\n  • 35+ personas, estructura formal\n  • Facturación: $200-300M/mes\n  • Empresa que funciona sin depender 100% del GG",
  "1-planAnual-temaAnual": "2026: \"El año de la caja y la estabilidad\"\n\nFoco: Pasar de operar al día sin colchón a tener reserva de 3 meses y facturación predecible.",
  "1-planAnual-obj1": "OBJ #1: Reserva de caja de $74M antes de junio\nIndicador: Saldo en cuenta de reserva\nAcción: Todo mes >$120M → separar diferencia en cuenta aparte\nResponsable: GG",
  "1-planAnual-obj2": "OBJ #2: Nunca facturar bajo $74M (break-even)\nIndicador: Facturación mensual\nAcción: Forecast a 90 días + alerta si <$80M → modo comercial agresivo\nAcción: Mínimo 4-5 proyectos activos siempre\nResponsable: GG",
  "1-planAnual-obj3": "OBJ #3: Backlog a $3,000M antes de diciembre\nIndicador: Backlog total contratado\nAcción: Pipeline de propuestas >$200M/mes\nAcción: Diversificar canales (no solo referidos)\nResponsable: GG",
  "1-rocks-trimestre": "Q1 2026 (Enero - Marzo)",
  "1-rocks-rock1": "ROCK #1: Implementar P&L mensual y forecast a 90 días\nEntregable: Planilla/sistema funcionando\nFecha: Marzo 2026\nMeta: Visibilidad financiera real, nunca más navegar a ciegas",
  "1-rocks-rock2": "ROCK #2: Iniciar reserva de caja\nEntregable: Cuenta separada con primer depósito\nFecha: Primer mes bueno que llegue\nMeta: Mínimo $30M de reserva en Q1",
  "1-rocks-rock3": "ROCK #3: Conseguir 1-2 proyectos nuevos\nEntregable: Contratos firmados\nFecha: Marzo 2026\nMeta: Mantener 4+ proyectos activos, llenar 10-20% de capacidad libre de maestros",
  // COMERCIAL
  "4-pipeline-etapas": "[POR DEFINIR]\nHoy no hay pipeline formal. Los proyectos llegan por contactos y referidos.\nRiesgo: Cuando se acaban los referidos, no hay plan B.\n\nPropuesta de etapas:\n  1. Referido/contacto recibido\n  2. Reunión / visita técnica\n  3. Cotización enviada\n  4. Negociación\n  5. Contrato firmado",
  "4-metricas-kpis": "[POR IMPLEMENTAR]\nKPIs comerciales necesarios:\n  • N° de oportunidades activas\n  • Valor del pipeline ($)\n  • Tasa de cierre (%)\n  • Tiempo promedio de cierre (días)\n  • N° de proyectos activos\n  • Origen del proyecto (referido, licitación, proactivo)",
};

const INITIAL_STATUSES = {
  "5-pyl": "progress", "5-breakeven": "progress", "5-cxc": "progress", "5-flujoCaja": "idea",
  "5-costeo": "idea", "5-margenes": "none", "5-proyecciones": "idea", "5-kpiFinancieros": "idea",
  "1-meta3": "idea", "1-planAnual": "idea", "1-rocks": "idea",
  "1-mision": "none", "1-vision": "none", "1-valores": "none", "1-bhag": "none",
  "1-diferenciador": "none", "1-clienteIdeal": "none",
  "4-pipeline": "idea", "4-metricas": "none", "4-procesoComercial": "none",
  "4-propuestas": "none", "4-pricing": "none", "4-crm": "none",
};

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

export default function App() {
  const [st, setSt] = useState({});
  const [ct, setCt] = useState({});
  const [ap, setAp] = useState(null);
  const [ai, setAi] = useState(null);
  const [vw, setVw] = useState("dashboard");
  const [bsc, setBsc] = useState({});
  const [pn, setPn] = useState({});
  const [loaded, setLoaded] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(null);
  const [ep, setEp] = useState(0);
  const timer = useRef(null);

  useEffect(() => {
    (async () => {
      try {
        const r = await window.storage.get("belectric-v4");
        if (r?.value) { const d = JSON.parse(r.value); if (d.st) setSt(d.st); if (d.ct) setCt(d.ct); if (d.bsc) setBsc(d.bsc); if (d.pn) setPn(d.pn); setLoaded(true); return; }
      } catch(e) {}
      setSt(INITIAL_STATUSES); setCt(INITIAL_CONTENT); setLoaded(true);
    })();
  }, []);

  const save = useCallback(async (s, c, b, p) => {
    setSaving(true);
    try { await window.storage.set("belectric-v4", JSON.stringify({ st: s, ct: c, bsc: b, pn: p, ts: Date.now() })); setSaved(Date.now()); } catch(e) {}
    setSaving(false);
  }, []);

  useEffect(() => { if (!loaded) return; if (timer.current) clearTimeout(timer.current); timer.current = setTimeout(() => save(st, ct, bsc, pn), 800); return () => clearTimeout(timer.current); }, [st, ct, bsc, pn, loaded, save]);

  const uSt = (pid, ik, v) => setSt(p => ({ ...p, [`${pid}-${ik}`]: v }));
  const uCt = (pid, ik, sk, v) => setCt(p => ({ ...p, [`${pid}-${ik}-${sk}`]: v }));
  const uBsc = (pk, sk, v) => setBsc(p => ({ ...p, [`${pk}-${sk}`]: v }));
  const uPn = (id, v) => setPn(p => ({ ...p, [id]: v }));

  const tp = Math.round(PILLARS.reduce((a, p) => a + calcProg(p, st), 0) / PILLARS.length);
  const pl = PILLARS.find(p => p.id === ap);
  const it = pl?.items.find(i => i.key === ai);
  const fSec = (pid, ik, t) => t ? t.sections.filter(s => ct[`${pid}-${ik}-${s.key}`]?.trim()).length : 0;

  const Badge = () => <div style={{ position: "fixed", bottom: 16, right: 16, padding: "6px 12px", borderRadius: 16, background: saving ? "rgba(232,83,14,.25)" : saved ? "rgba(76,175,80,.15)" : "transparent", color: saving ? "#E8530E" : "#81C784", fontSize: 11, fontWeight: 600, fontFamily: "'DM Sans',sans-serif", zIndex: 100, opacity: saving || saved ? 1 : 0, backdropFilter: "blur(6px)", border: "1px solid rgba(255,255,255,.05)", transition: "all .3s" }}>{saving ? "💾 Guardando..." : "✅ Guardado"}</div>;
  const F = <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&family=Space+Mono:wght@700&display=swap" rel="stylesheet" />;
  const S = { minHeight: "100vh", background: "linear-gradient(165deg,#0a0a0a 0%,#1a1a2e 50%,#16213e 100%)", fontFamily: "'DM Sans',sans-serif", color: "#f0f0f0" };
  const Bk = (l, fn) => <button onClick={fn} style={{ display: "flex", alignItems: "center", gap: 6, background: "none", border: "none", color: "#888", fontSize: 13, cursor: "pointer", padding: "0 0 12px", fontFamily: "'DM Sans',sans-serif" }}>← {l}</button>;

  if (!loaded) return <div style={{ ...S, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 16 }}>{F}<div style={{ fontSize: 36, animation: "p 1.5s infinite" }}>⚡</div><div style={{ color: "#888", fontSize: 14 }}>Cargando...</div><style>{`@keyframes p{0%,100%{opacity:1}50%{opacity:.4}}`}</style></div>;

  // DETAIL VIEW
  if (vw === "detail" && pl && it) {
    const cs = st[`${pl.id}-${it.key}`] || "none";
    return <div style={S}>{F}<Badge />
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
      <div style={{ padding: "16px 20px 40px" }}>
        <div style={{ fontSize: 11, color: "#666", textTransform: "uppercase", letterSpacing: 1, marginBottom: 12 }}>Desarrollo · {fSec(pl.id, it.key, it.template)}/{it.template.sections.length}</div>
        <div style={{ height: 4, borderRadius: 2, background: "rgba(255,255,255,.06)", marginBottom: 20, overflow: "hidden" }}><div style={{ height: "100%", borderRadius: 2, background: pl.color, transition: "width .4s", width: `${(fSec(pl.id, it.key, it.template) / it.template.sections.length) * 100}%` }} /></div>
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
    return <div style={S}>{F}<Badge />
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
          const s = getSt(st[`${pl.id}-${i.key}`] || "none"); const f = fSec(pl.id, i.key, i.template); const t = i.template?.sections.length || 0;
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
    return <div style={S}>{F}<Badge />
      <div style={{ padding: 20 }}>{Bk("Volver", () => setVw("dashboard"))}<h1 style={{ margin: "0 0 4px", fontSize: 22, fontWeight: 800 }}>🎯 Balanced Scorecard</h1><p style={{ margin: 0, fontSize: 13, color: "#888" }}>Estrategia → Ejecución</p></div>
      <div style={{ padding: "0 20px 40px" }}>
        {BSC_PERSPECTIVES.map(p => {
          const lk = PILLARS.filter(pl => pl.bscLink.includes(p.key));
          return <div key={p.key} style={{ marginBottom: 16, padding: 16, background: "rgba(255,255,255,.03)", borderRadius: 14, border: `1px solid ${p.color}22` }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}><span style={{ fontSize: 22 }}>{p.icon}</span><div><h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: p.color }}>{p.label}</h3><p style={{ margin: 0, fontSize: 12, color: "#888" }}>{p.question}</p></div></div>
            {[{ k: "objetivo", l: "Objetivo", ph: "¿Qué lograr?" }, { k: "indicador", l: "KPI", ph: "¿Cómo medir?" }, { k: "meta", l: "Meta", ph: "Número concreto" }, { k: "iniciativa", l: "Iniciativa", ph: "¿Qué hacer?" }].map(f => <div key={f.k} style={{ marginBottom: 10 }}><label style={{ fontSize: 11, color: "#999", fontWeight: 600, display: "block", marginBottom: 4 }}>{f.l}</label><textarea value={bsc[`${p.key}-${f.k}`] || ""} onChange={e => uBsc(p.key, f.k, e.target.value)} placeholder={f.ph} style={{ width: "100%", minHeight: 50, padding: "10px 12px", borderRadius: 8, border: "1px solid rgba(255,255,255,.08)", background: "rgba(0,0,0,.25)", color: "#e0e0e0", fontSize: 13, fontFamily: "'DM Sans',sans-serif", resize: "vertical", outline: "none", boxSizing: "border-box" }} /></div>)}
            <div style={{ borderTop: "1px solid rgba(255,255,255,.05)", paddingTop: 10 }}><span style={{ fontSize: 10, color: "#555", textTransform: "uppercase", letterSpacing: 1 }}>Pilares:</span><div style={{ display: "flex", gap: 6, marginTop: 6, flexWrap: "wrap" }}>{lk.map(l => <span key={l.id} onClick={() => { setAp(l.id); setVw("pillar"); }} style={{ padding: "4px 10px", borderRadius: 6, fontSize: 11, fontWeight: 600, cursor: "pointer", background: l.color + "22", color: l.color }}>{l.icon} {l.name}</span>)}</div></div>
          </div>;
        })}
      </div>
    </div>;
  }

  // SCALING VIEW
  if (vw === "scaling") {
    return <div style={S}>{F}<Badge />
      <div style={{ padding: 20 }}>{Bk("Volver", () => setVw("dashboard"))}
        <h1 style={{ margin: "0 0 4px", fontSize: 22, fontWeight: 800, background: "linear-gradient(135deg,#E84855,#F7B32B)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Plan de Escalamiento</h1>
        <p style={{ margin: 0, fontSize: 13, color: "#888" }}>Blindar → Estabilizar → Crecer → Escalar</p>
      </div>

      {/* Summary box */}
      <div style={{ margin: "0 20px 16px", padding: 14, borderRadius: 12, background: "rgba(232,72,85,.08)", border: "1px solid rgba(232,72,85,.15)" }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: "#E84855", marginBottom: 6 }}>📍 Situación actual</div>
        <div style={{ fontSize: 12, color: "#ccc", lineHeight: 1.7 }}>
          ~25 personas · Facturación variable ($30M-$180M) · Costos fijos $37M/mes<br/>
          Break-even: $74M · Reserva caja: $0 · CxC en juicio: $190M<br/>
          Maestros al 80-90% · Proyectos llegan por referidos
        </div>
      </div>

      <div style={{ padding: "0 20px", marginBottom: 20 }}>
        <div style={{ display: "flex", alignItems: "center" }}>
          {SCALING_PHASES.map((ph, i) => <div key={ph.id} style={{ flex: 1, textAlign: "center", position: "relative" }}>
            <button onClick={() => setEp(ph.id)} style={{ width: 36, height: 36, borderRadius: "50%", border: `3px solid ${ph.color}`, background: ep === ph.id ? ph.color : "transparent", color: ep === ph.id ? "#fff" : ph.color, fontSize: 14, fontWeight: 800, cursor: "pointer", fontFamily: "'DM Sans',sans-serif", position: "relative", zIndex: 2 }}>{ph.id}</button>
            <div style={{ fontSize: 10, color: ep === ph.id ? ph.color : "#666", marginTop: 4, fontWeight: 600 }}>{ph.timeline}</div>
            {i < 3 && <div style={{ position: "absolute", top: 18, left: "55%", right: "-45%", height: 2, background: "rgba(255,255,255,.1)", zIndex: 1 }} />}
          </div>)}
        </div>
      </div>
      <div style={{ padding: "0 20px 40px" }}>
        {SCALING_PHASES.map(ph => {
          const open = ep === ph.id;
          return <div key={ph.id} style={{ marginBottom: 12, borderRadius: 14, border: `1px solid ${open ? ph.color + "44" : "rgba(255,255,255,.06)"}`, background: "rgba(255,255,255,.03)", overflow: "hidden" }}>
            <button onClick={() => setEp(open ? null : ph.id)} style={{ display: "flex", alignItems: "center", gap: 12, width: "100%", padding: 16, background: "none", border: "none", cursor: "pointer", color: "#f0f0f0", fontFamily: "'DM Sans',sans-serif", textAlign: "left" }}>
              <span style={{ fontSize: 24 }}>{ph.icon}</span>
              <div style={{ flex: 1 }}><div style={{ fontSize: 15, fontWeight: 700, color: ph.color }}>{ph.name}</div><div style={{ fontSize: 11, color: "#888" }}>{ph.timeline} · {ph.people}</div></div>
              <div style={{ textAlign: "right" }}><div style={{ fontSize: 12, fontWeight: 800, color: ph.color }}>{ph.net}</div></div>
            </button>
            {open && <div style={{ padding: "0 16px 16px" }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 16 }}>
                {ph.kpis.map(k => <div key={k.label} style={{ padding: "10px 12px", borderRadius: 8, background: "rgba(0,0,0,.2)", border: "1px solid rgba(255,255,255,.05)" }}><div style={{ fontSize: 10, color: "#888", marginBottom: 2 }}>{k.label}</div><div style={{ fontSize: 14, fontWeight: 700, color: ph.color }}>{k.target}</div>{k.current && <div style={{ fontSize: 10, color: "#666" }}>Actual: {k.current}</div>}</div>)}
              </div>
              <div style={{ marginBottom: 12 }}><div style={{ fontSize: 11, color: "#999", textTransform: "uppercase", letterSpacing: 1, marginBottom: 8 }}>Acciones</div>{ph.actions.map((a, i) => <div key={i} style={{ display: "flex", gap: 8, marginBottom: 6, fontSize: 13, color: "#ccc" }}><span style={{ color: ph.color, fontWeight: 700, flexShrink: 0 }}>{i + 1}.</span>{a}</div>)}</div>
              {ph.hires.length > 0 && <div style={{ marginBottom: 12 }}><div style={{ fontSize: 11, color: "#999", textTransform: "uppercase", letterSpacing: 1, marginBottom: 8 }}>Contrataciones</div>{ph.hires.map((h, i) => <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4, fontSize: 13 }}>👤 <span style={{ color: "#ccc" }}>{h}</span></div>)}</div>}
              <div style={{ padding: "10px 12px", borderRadius: 8, background: ph.color + "11", border: `1px solid ${ph.color}22`, marginBottom: 12 }}><div style={{ fontSize: 10, color: ph.color, textTransform: "uppercase", letterSpacing: 1, marginBottom: 4 }}>🎯 Gatillo para avanzar</div><div style={{ fontSize: 13, color: "#ddd" }}>{ph.trigger}</div></div>
              <div><div style={{ fontSize: 11, color: "#999", textTransform: "uppercase", letterSpacing: 1, marginBottom: 6 }}>Mis notas</div><textarea value={pn[ph.id] || ""} onChange={e => uPn(ph.id, e.target.value)} placeholder="Avances, decisiones, pendientes..." style={{ width: "100%", minHeight: 70, padding: "10px 12px", borderRadius: 8, border: "1px solid rgba(255,255,255,.08)", background: "rgba(0,0,0,.25)", color: "#e0e0e0", fontSize: 13, fontFamily: "'DM Sans',sans-serif", resize: "vertical", outline: "none", boxSizing: "border-box" }} /></div>
            </div>}
          </div>;
        })}
        <div style={{ marginTop: 20, padding: 16, borderRadius: 14, background: "rgba(255,255,255,.02)", border: "1px solid rgba(255,255,255,.06)" }}>
          <h3 style={{ margin: "0 0 12px", fontSize: 14, fontWeight: 700, color: "#F7B32B" }}>⚖️ Reglas de decisión</h3>
          <div style={{ marginBottom: 12 }}><div style={{ fontSize: 12, fontWeight: 700, color: "#E84855", marginBottom: 6 }}>🚫 NUNCA escalar si:</div><div style={{ fontSize: 12, color: "#ccc", lineHeight: 1.6 }}>• Reserva de caja &lt; 2 meses de costos fijos ($74M)<br/>• Facturación promedio 3 meses &lt; break-even ($74M)<br/>• No tienes forecast implementado a 90 días</div></div>
          <div><div style={{ fontSize: 12, fontWeight: 700, color: "#81C784", marginBottom: 6 }}>✅ Escalar cuando:</div><div style={{ fontSize: 12, color: "#ccc", lineHeight: 1.6 }}>• Reserva de caja &gt; 3 meses ($111M)<br/>• 3 meses seguidos arriba de $100M<br/>• Maestros al 100% y rechazando proyectos<br/>• Backlog &gt; 9 meses de facturación actual</div></div>
        </div>
      </div>
    </div>;
  }

  // COMPARE VIEW
  if (vw === "compare") {
    return <div style={S}>{F}<Badge />
      <div style={{ padding: 20 }}>{Bk("Volver", () => setVw("dashboard"))}<h2 style={{ fontSize: 18, fontWeight: 700, margin: "0 0 16px" }}>📊 Comparación</h2>
        {PILLARS.map(p => {
          const pg = calcProg(p, st); const d = p.items.filter(i => st[`${p.id}-${i.key}`] === "done").length; const pr = p.items.filter(i => st[`${p.id}-${i.key}`] === "progress").length; const id = p.items.filter(i => st[`${p.id}-${i.key}`] === "idea").length; const n = p.items.length - d - pr - id;
          const fl = p.items.reduce((a, i) => a + fSec(p.id, i.key, i.template), 0); const ts = p.items.reduce((a, i) => a + (i.template?.sections.length || 0), 0);
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
  return <div style={S}>{F}<Badge />
    <div style={{ padding: "24px 20px 16px", borderBottom: "1px solid rgba(255,255,255,.06)" }}>
      <span style={{ fontSize: 10, letterSpacing: 4, textTransform: "uppercase", color: "#555", fontFamily: "'Space Mono',monospace" }}>BELECTRIC</span>
      <h1 style={{ fontSize: 28, fontWeight: 800, margin: "4px 0 6px", background: "linear-gradient(135deg,#E8530E,#F7B32B)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>ESTRATEGIA</h1>
      <p style={{ fontSize: 13, color: "#777", margin: 0 }}>~25 personas · 7 pilares · Plan de estabilización</p>
    </div>
    <div style={{ margin: "20px 20px 8px", padding: 20, background: "rgba(255,255,255,.03)", borderRadius: 16, border: "1px solid rgba(255,255,255,.06)", display: "flex", alignItems: "center", gap: 20 }}>
      <Ring pct={tp} clr="#E8530E" sz={72} />
      <div><div style={{ fontSize: 11, color: "#888", textTransform: "uppercase", letterSpacing: 1, marginBottom: 2 }}>Madurez empresarial</div><div style={{ fontSize: 20, fontWeight: 800 }}>{tp < 20 ? "Inicial" : tp < 40 ? "En desarrollo" : tp < 60 ? "Estructurándose" : tp < 80 ? "Madurando" : "Sólido"}</div><div style={{ fontSize: 11, color: "#666", marginTop: 2 }}>{PILLARS.reduce((a, p) => a + p.items.filter(i => st[`${p.id}-${i.key}`] === "done").length, 0)}/{PILLARS.reduce((a, p) => a + p.items.length, 0)} completados</div></div>
    </div>

    {/* Alert banners */}
    <div style={{ margin: "8px 20px 4px", padding: "12px 16px", borderRadius: 12, background: "rgba(232,72,85,.1)", border: "1px solid rgba(232,72,85,.2)", display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }} onClick={() => setVw("scaling")}>
      <span style={{ fontSize: 18 }}>🚨</span><div style={{ flex: 1 }}><div style={{ fontSize: 13, fontWeight: 700, color: "#E84855" }}>Fase 0: Blindar la caja — Reserva $0 de $74M</div><div style={{ fontSize: 11, color: "#999" }}>Plan de estabilización →</div></div>
    </div>
    <div style={{ margin: "4px 20px 4px", padding: "10px 16px", borderRadius: 12, background: "rgba(107,76,154,.08)", border: "1px solid rgba(107,76,154,.15)", display: "flex", alignItems: "center", gap: 10 }}>
      <span style={{ fontSize: 16 }}>⚖️</span><div><div style={{ fontSize: 12, fontWeight: 600, color: "#6B4C9A" }}>$190M en cobranza judicial activa</div><div style={{ fontSize: 11, color: "#888" }}>$160M demanda ejecutiva + $30M adicionales retenidos</div></div>
    </div>

    <div style={{ display: "flex", gap: 6, padding: "12px 20px 8px", flexWrap: "wrap" }}>
      {[{ k: "dashboard", l: "📋 Pilares" }, { k: "scaling", l: "🚀 Plan" }, { k: "bsc", l: "🎯 BSC" }, { k: "compare", l: "📊 Comparar" }].map(t => <button key={t.k} onClick={() => setVw(t.k)} style={{ padding: "8px 14px", borderRadius: 20, border: "none", fontSize: 13, fontWeight: 600, cursor: "pointer", background: vw === t.k ? "rgba(232,83,14,.2)" : "rgba(255,255,255,.05)", color: vw === t.k ? "#E8530E" : "#888", fontFamily: "'DM Sans',sans-serif" }}>{t.l}</button>)}
    </div>
    <div style={{ padding: "8px 20px 40px" }}>
      {PILLARS.map(p => {
        const pg = calcProg(p, st); const fl = p.items.reduce((a, i) => a + fSec(p.id, i.key, i.template), 0); const ts = p.items.reduce((a, i) => a + (i.template?.sections.length || 0), 0);
        return <button key={p.id} onClick={() => { setAp(p.id); setVw("pillar"); }} style={{ display: "flex", alignItems: "center", gap: 14, width: "100%", padding: 16, marginBottom: 8, background: "rgba(255,255,255,.03)", borderRadius: 14, border: "1px solid rgba(255,255,255,.06)", cursor: "pointer", textAlign: "left", color: "#f0f0f0", fontFamily: "'DM Sans',sans-serif" }} onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,.06)"} onMouseLeave={e => e.currentTarget.style.background = "rgba(255,255,255,.03)"}>
          <Ring pct={pg} clr={p.color} sz={50} />
          <div style={{ flex: 1 }}><div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 2 }}><span style={{ fontSize: 15 }}>{p.icon}</span><span style={{ fontSize: 15, fontWeight: 700 }}>{p.name}</span></div><span style={{ fontSize: 11, color: "#666" }}>{p.items.filter(i => st[`${p.id}-${i.key}`] === "done").length}/{p.items.length} items · {fl}/{ts} secciones</span></div>
          <span style={{ fontSize: 16, color: "#444" }}>→</span>
        </button>;
      })}
    </div>
    <div style={{ textAlign: "center", padding: 20, fontSize: 11, color: "#333" }}>Belectric — Estrategia · {new Date().getFullYear()}</div>
  </div>;
}
