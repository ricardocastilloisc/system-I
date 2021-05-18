export interface AUDGENPROCESO_INERFACE {
  __typename: 'AUDGENPROCESOS';
  DESTINO?: string | null;
  ETAPA?: string | null;
  FECHA?: string | null;
  ID_PROCESO?: string | null;
  ID_REGISTRO?: string | null;
  INSUMO?: string | null;
  INTERFAZ?: string | null;
  MENSAJE_NEGOCIO?: string | null;
  MENSAJE_SOPORTE?: string | null;
  NEGOCIO?: string | null;
  PROCESO?: {
    __typename: string;
    EJECUCION?: string | null;
    TIPO?: string | null;
  } | null;
  SERVICIOAWS?: string | null;
  USUARIO?: {
    __typename: string;
    CORREO?: string | null;
    ROL?: string | null;
  } | null;
  TIPO?: string | null;
  NIVEL?: string | null;
  STEP?: string | null;
  ACTIVIDAD?: string | null;
}
