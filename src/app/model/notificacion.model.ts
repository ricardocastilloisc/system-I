export interface NOTIFICACION_INTERFACE {
  __typename: string;
  ESTADO?: string;
  ESTADO_EJECUCION: string;
  ETAPA: string;
  FECHA_ACTUALIZACION: string;
  FECHA_CREADO: string;
  ID_PROCESO: string;
  INSUMO: string;
  INTERFAZ: string;
  TIPO_PROCESO: string;
  LEIDO: boolean;
  ETAPA_FINAL: any;
  ETAPA_INICIAL: any;
  ETAPA_PROCESAMIENTO: any;
}
