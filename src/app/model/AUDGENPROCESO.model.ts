export interface AUDGENPROCESO_INERFACE {
  __typename: 'AUDGENPROCESOS';
  ACTIVIDAD?: string | null;
  DESTINO?: string | null;
  ETAPA?: string | null;
  FECHA?: string | null;
  ID_FLUJO_PROCESO?: string | null;
  ID_REGISTRO?: string | null;
  INSUMO?: string | null;
  INTERFAZ?: string | null;
  MENSAJE?: {
    __typename: string;
    DETALLE?: string | null;
    TIPO?: string | null;
  } | null;
  NEGOCIO?: string | null;
  PROCESO?: {
    __typename: string;
    EJECUCION?: string | null;
    ESTADO?: string | null;
    TIPO?: string | null;
  } | null;
  SERVICIOAWS?: string | null;
  USUARIO?: {
    __typename: string;
    CORREO?: string | null;
    ROL?: string | null;
  } | null;
}
