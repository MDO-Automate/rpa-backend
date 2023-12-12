export interface novedades {
    fecha: string,
    hora: string,
    unidad: number,
    clave: string,
    origen: string,
    descripcion? :string
    prioridad: number,
    fecha_entrega?: string,
    hora_entrega?: string
    gestion?: string,
    fecha_gestion?: string,
    hora_gestion?: string,
    destinatario: string
}

export interface wherePrioridad {
    prioridad: number,
    gestion: string,
    destinatario?: string
}

export interface whereHistorico {
    gestion: string
    destinatario?: string
}