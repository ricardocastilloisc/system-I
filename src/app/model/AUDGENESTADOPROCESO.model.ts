export interface AUDGENESTADOPROCESO_INTERFACE {
    __typename: "SiaGenAudEstadoProcesosDev";
    ESTADO?: string | null;
    ESTADO_EJECUCION?: string | null;
    ETAPA?: {
      __typename: "siaGenAudEtapas";
      INICIAL?:{
        __typename: "ETAPA";
        ESTADO?: string | null;
      };
      PROCESAMIENTO?: {
        __typename: "ETAPA";
        ESTADO?: string | null;
      };
      FINAL?:{
        __typename: "ETAPA";
        ESTADO?: string | null;
      };
    };
    FECHA_ACTUALIZACION?: string | null;
    FECHA_CREADO?: string | null;
    ID_PROCESO?: string | null;
    INSUMO?: string | null;
    INTERFAZ?: string | null;
    TIPO_PROCESO?: string | null;
  };