export interface AUDGENUSUARIO_INTERFACE {
  id: string;
  name: string;
  schedule: string;
  description: string;
  enabled: boolean;
  seconds?: number;
  ACTUALIZAR?: boolean;
  CONSULTAR?: boolean;

  ayuda?: string;
  cron?: string;
  estatus?: boolean;
  interfaz?: string;
  negocio?: string;
  nombre?: string;
  tipo?: string;
}
