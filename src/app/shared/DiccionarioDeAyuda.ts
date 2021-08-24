/*
Aqui ira el diccionario de las ayudas para el usuario
*/

export const dataDiccionario = [
    {
        id: "Catalogos",
        label: "Catálogos",
        filasAyuda: [
            "Consulta catalogos",
            "Los pasos para realizar consultas de catálogos:",
            "* Ir al módulo de Administración y seleccionar Catálogos.",
            "* Se enlistarán todos los catálogos a los que se tiene acceso de lectura y/o escritura.",
            "* Seleccionar el catálogo del cual se quieren consultar los registros.",
            "* Se mostrarán los registros que pertenecen a dicho catálogo.",
        ],
        hiperVinculos: [
            "https://docs.principal.com/pages/viewpage.action?pageId=553861811",
        ],
    },
    {
        id: "Notificaciones",
        label: "Notificaciones",
        filasAyuda: [
            "Consultar y editar programa de notificaciones:",
            "* Ir al módulo de Administración y seleccionar Notificaciones.",
            "* Se enlistarán todas las configuraciones.",
            "* Seleccionar la notificación que se desea actualizar.",
            "Actualizar los valores deseados para las ejecuciones:",
            "* Hora: hora de inicio y fin (opcional).",
            "* Minutos: intervalo de tiempo en minutos.",
            "* Día: día de inicio y fin (opcional).",
            "* Activar: si la alarma estará activada o desactivada.",
            "* Dar clic en Actualizar.",
            "* La configuración de la alerta se habrá actualizado y nos aparece un mensaje de Registro actualizado.",
        ],
        hiperVinculos: [
            "https://docs.principal.com/pages/viewpage.action?pageId=553861811",
        ],
    },
    {
        id: "Usuarios",
        label: "Usuarios",
        filasAyuda: [
            "Consultar los datos de los usuarios del sistema",
            "Los pasos para realizar consultas de usuarios que están registrados dentro del sistema:",
            "* Ir al módulo de Administración y seleccionar Usuarios.",
            "* Se enlistarán todos los usuarios con acceso al sistema.",
            "Si desea filtrar los datos:",
            "Introducir los valores apara realizar la búsqueda.",
            "* Dar clic en Buscar.",
            "* Se mostrarán los resultados que coincidan con los parámetros de la búsqueda.",
        ],
        hiperVinculos: [
            "https://docs.principal.com/pages/viewpage.action?pageId=553861811",
        ],
    },
    {
        id: "Interfaces",
        label: "Interfaces",
        filasAyuda: [
            "Consultar resumen de las ejecuciones",
            "Esta sección muestra el resumen de las ejecuciones de las interfaces que se procesaron en un rango de tiempo (por omisión los últimos 30 días). ",
            "En el apartado Resumen de las ejecuciones, se muestra un cuadro interactivo que indica las cantidades de las ejecuciones por tipo Diurno y Nocturno, en donde a dar clic sobre cada uno de estos valores se detallará el número de ejecuciones que lo conforma de acuerdo al tipo de lanzamiento (automático o manual), negocio (Afore, Fondos), interfaz y estado final de la ejecución (éxito o fallo).",
            "Por otro lado en los apartados de Diurnos y Nocturnos se encuentra desglosada la información de las ejecuciones en formato de gráficas, en donde se pueden ubicar:",
            "* Resumen de las ejecuciones de Afore contra Fondos.",
            "* Resumen de las ejecuciones con lanzamiento Automático vs. Manual.",
            "* El detalle por Afore de las ejecuciones exitosas y fallidas.",
            "* Al dar clic sobre la parte de exitosas o fallidas, se mostrará una gráfica extra con el detalle por cada una de las interfaces.",
            "* El detalle por Fondos de las ejecuciones exitosas y fallidas.",
            "* Al dar clic sobre la parte de exitosas o fallidas, se mostrará una gráfica extra con el detalle por cada una de las interfaces.",
            "",
            "NOTA",
            "Este módulo se mostrará al usuario si cuenta con los permisos necesarios.",
            "Las ejecuciones que se muestran en pantalla corresponden a las ejecutadas a través del sistema SIA.",
        ],
        hiperVinculos: [
            "https://docs.principal.com/pages/viewpage.action?pageId=553861815",
        ],
    },
    {
        id: "Catalogos2",
        label: "Catálogos",
        filasAyuda: [
            "Consultar auditoría de las acciones sobre los catálogos",
            "En esta sección encuentra el registro de los cambios que se realizaron sobre los catálogos mediante SIA.",
            "A continuación, se describen los pasos para la consulta:",
            "Entrar al módulo Auditoría, Catálogos.",
            "Se enlistarán los registros.",
            "Para ver el detalle de los cambios:",
            "* Identificar el registro del que se quiere obtener el detalle.",
            "* Dar clic sobre el botón detalle del registro.",
            "* Se abrirá en pantalla el detalle del cambio del catálogo indicando día, hora, el usuario que realizó el cambio y en color azul la o las filas que sufrieron una actualización.",
            "",

            "NOTA",

            "Este módulo se mostrará al usuario si cuenta con los permisos necesarios.",
        ],
        hiperVinculos: [
            "https://docs.principal.com/pages/viewpage.action?pageId=553861815",
        ],
    },
    {
        id: "Procesos",
        label: "Procesos",
        filasAyuda: [
            "Consultar auditoría de las acciones sobre los lanzamientos de los procesos",
            "En esta sección encuentra el registro de los lanzamientos de procesos manuales mediante SIA.",
            "A continuación, se describen los pasos para la consulta:",

            "Entrar al módulo Auditoría, Procesos.",
            ,
            "Se enlistarán los registros.",
            "Para ver el detalle de cada lanzamiento:",
            "*Identificar el registro del que se quiere obtener el detalle.",
            "*Dar clic sobre el botón detalle del registro.",
            "*Se abrirá en pantalla el detalle del lanzamiento del proceso indicando día, hora, el usuario que realizó el inicio del proceso, estado, descripción y un vínculo para el resumen de la ejecución en caso de haber sido exitoso el lanzamiento.",
            "",
            "NOTA",

            "Este módulo se mostrará al usuario si cuenta con los permisos necesarios.",
        ],
        hiperVinculos: [
            "https://docs.principal.com/pages/viewpage.action?pageId=553861815",
        ],
    },
    {
        id: "Usuarios2",
        label: "Usuarios",
        filasAyuda: [
            "Consultar auditoría de las acciones sobre los usuarios",
            "En esta sección encuentra el registro de los cambios que se realizaron sobre los usuarios pertenecientes al SIA.",

            "A continuación, se describen los pasos para la consulta:",

            "* Entrar al módulo Auditoría, Usuarios.",
            "* Se enlistarán los registros.",
            "Para ver el detalle de los cambios:",
            "* Identificar el registro del que se quiere obtener el detalle.",
            "* Dar clic sobre el botón detalle del registro.",
            "* Se abrirá en pantalla el detalle del cambio de los datos del perfil del usuario indicando día, hora, el usuario que realizó el cambio y en color azul la o las filas que sufrieron una actualización.",

            "",
            "NOTA",

            "Este módulo se mostrará al usuario si cuenta con los permisos necesarios.",
        ],
        hiperVinculos: [
            "https://docs.principal.com/pages/viewpage.action?pageId=553861815",
        ],
    },
];
