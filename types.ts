export interface userAuth {
    usuario: string, 
    clave: string
}

export interface userCreate {
    usuario: String, 
    clave: string, 
    rol: string
}

export interface checklist {
    estado_bus: string,
    fecha_hora: string,
    aux_salida: string,
    operador: string,
    lic_conduccion: string,
    carne_arl: string,
    carne_empresa: string,
    ruta: string,
    servicio_bus: string,
    baja_presion: string,
    falla_alternador: string,
    num_bus: string,
    palanca_freno: string,
    pedal_freno: string,
    alta_tempMotor: string,
    freno_seg: string,
    falla_motor: string,
    falla_ABS: string,
    bajoNivel_refrig: string,
    puertaTras_Del: string,
    est_volanteBocina: string,
    luces_altBajas: string,
    tipo_servicio: string,
    luces_laterales: string,
    est_Panoramicos: string,
    espejos_interExter: string,
    TFT: string,
    novedad_TFT: string,
    radio: string,
    novedades_radio: string,
    torniquete: string,
    validador: string,
    rutero_frontal: string,
    rutero_lateral: string,
    rutero_trasero: string,
    novedades_EquipoComuni: string,
    matricula: string,
    soat: string,
    tarj_operacion: string,
    tecnomecanica: string,
    botiquin: string,
    cant_extintores: string,
    cant_conos: string,
    novedades_varias: string,
    medida_gas: string,
    tec_asignado: string,
    descrip_mant: string,
    fecha_mant: string,
    numero_OT: string,
    responsable_mnto: string,
    checklist_registro: string,
    est_despacho: string,
    lugar_atencion: string,
    manometro_extintor: string,
    PINSeguridad_extintor: string,
    manija_extintor: string,
    vencimiento_extintor: string,
    boquilla_extintor: string,
    fechaHora_Servicio: string,
    silla_corre: string,
    silla_subeBaja: string,
    silla_torcida: string,
    sillaLinea_volante: string,
    espaldar_silla: string,
    obs_silla: string,
    PMR: string,
    cinturon: string
}

export interface errorHandler {
    success: boolean,
    message: string
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

export interface Prueba {
    gestion: string
    destinatario?: string
}
