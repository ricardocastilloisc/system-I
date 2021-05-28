export interface AUDGENESTADOPROCESO_INTERFACE {
    __typename: "SiaGenAudEstadoProcesosDev";
    ESTADO?: string | null;
    ESTADO_EJECUCION?: string | null;
    ETAPA_INICIAL?: {
      __typename: "ETAPAS_PROCESO";
      ESTADO_INICIAL?: string | null;
      ESTADO_FINAL?: string | null;
      FECHA_INICIAL?: string | null;
      FECHA_FINAL?: string | null;
    } | null;
    ETAPA_FINAL?: {
      __typename: "ETAPAS_PROCESO";
      ESTADO_INICIAL?: string | null;
      ESTADO_FINAL?: string | null;
      FECHA_INICIAL?: string | null;
      FECHA_FINAL?: string | null;
    } | null;
    ETAPA_PROCESAMIENTO?: {
      __typename: "ETAPAS_PROCESO";
      ESTADO_INICIAL?: string | null;
      ESTADO_FINAL?: string | null;
      FECHA_INICIAL?: string | null;
      FECHA_FINAL?: string | null;
    } | null;
    FECHA_ACTUALIZACION?: string | null;
    FECHA_CREADO?: string | null;
    FECHA_FINALIZADO?: string | null;
    ID_PROCESO?: string | null;
    INSUMO?: string | null;
    INTERFAZ?: string | null;
    TIPO_PROCESO?: string | null;
  };