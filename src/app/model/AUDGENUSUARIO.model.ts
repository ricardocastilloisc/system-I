export interface AUDGENUSUARIO_INTERFACE {
    __typename: "AUDGENUSUARIOS";
    ID?: string;
    FECHA?: string | null;
    CORREO?: string | null;
    AREA_NEGOCIO?: string | null;
    MODULO?: string | null;
    ROL?: string | null;
    USUARIO?: {
        __typename: "AUD_USER";
        NOMBRE?: string | null;
        INICIO_SESION?: string | null;
        FIN_SESION?: string | null;
        APELLIDO_PATERNO?: string | null;
      };
    SECCION?: {
        __typename: "AUD_SECCION";
        NOMBRE?: string | null;
        ACCION?: string | null;
        SUBSECCION?: string | null;
      };
    PROCESOS?: {
        __typename: "AUD_PROCESOS";
        NOMBRE?: string | null;
        ACCION?: string | null;
        DESCRIPCION?: string | null;
        ESTADO?: string | null;
        TIPO?: string | null;
      };
    CATALOGOS?: {
        __typename: "AUD_CATALOGOS";
        ACCION?: string | null;
        DESCRIPCION?: string | null;
        DETALLE_MODIFICACIONES?: Array<{
            __typename: "AUD_VALORES";
            valorAnterior?: string | null;
            valorNuevo?: string | null;
          } | null> | null;
        ESTADO?: string | null;
        NOMBRE?: string | null;
      };
    PERMISOS_USUARIOS?: {
        __typename: "AUD_PERMISOS";
        ACCION?: string | null;
        APELLIDO_MATERNO?: string | null;
        APELLIDO_PATERNO?: string | null;
        CORREO?: string | null;
        DETALLE_MODIFICACIONES?: Array<{
            __typename: "AUD_VALORES";
            valorAnterior?: string | null;
            valorNuevo?: string | null;
          } | null> | null;
        ESTADO?: string | null;
        NOMBRE?: string | null;
        ROL?: string | null;
      };
  };
