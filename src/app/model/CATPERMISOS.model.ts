export interface CATPERMISOS_INTERFACE {
    __typename: "CATPERMISOS";
    ID?: string;
    AREA?: string | null;
    AUDITORIA?: {
        __typename: "AUDITORIA";
        ARCHIVOS?: boolean | null;
        CATALOGOS?: boolean | null;
        PROCESOS?: boolean | null;
      };
    CATALOGOS?: {
        __typename: "CATALOGOS";
        ACTUALIZAR?: boolean | null;
        BORRAR?: boolean | null;
        CONSULTAR?: boolean | null;
        CREAR?: boolean | null;
      };
    FLUJO?: string | null;
    PROCESOS?: {
        __typename: "PROCESOS";
        DETENER?: boolean | null;
        INICIAR?: boolean | null;
        MONITOREAR?: boolean | null;
      };
    ROL?: string | null;
    USUARIOS?: {
        __typename: "USUARIOS";
        ACTUALIZAR?: boolean | null;
        BORRAR?: boolean | null;
        CONSULTAR?: boolean | null;
      };
  };