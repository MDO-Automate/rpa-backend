import dotenv from 'dotenv'

import { novedades } from "../../interfaces"

import { saveField, listFilds, listFildsOrderBy , updateField } from "./sqlServer"
 
dotenv.config()

const TABLE = `[${process.env.DBNAME}].[dbo].[NovClasificadas]`

//crea una novedad
export const createNovedad = async (novedad : novedades)=> {
    const { success, message }  = await saveField(TABLE, novedad)
    if(success){
        return { 
            success: true,
            message: 'Novedad creada con exito'
        }
    }
    else return{
        success: false,
        message : 'No se pudo guardar la novedad: ' + message
    }
}

// Lista las novedades de forma filtrada.
export const listNovedad = async (columns: string[], where: object ) => {
    const { data, success, message } = await listFilds(TABLE, columns, where)
    if(success){
        return {
            data,
            message: 'datos listados exitosamente',
            success
        }
    }else return{
        message : 'No se ha podido listar la información. ERROR: ' + message,
        success
    }
}

export const listNovedadOrderBy = async (columns: string[], where: object, orderby: string[], order: string[], between?: string ) => {
    const { data, success, message } = await listFildsOrderBy(TABLE, columns, where, orderby, order, between)
    if(success){
        return {
            data,
            message: 'datos listados exitosamente',
            success
        }
    }else return{
        message : 'No se ha podido listar la información. ERROR: ' + message,
        success
    }
}

export const updateNovedad = async (dataUpdate: object, where: object )=> {
    const { success, message } = await updateField(TABLE, dataUpdate, where)
    if(success){
        return {
            message: 'Datos actualizados exitosamente',
            success
        }
    }else return{
        message  : 'No se han podido acutalizar los datos. ERROR: ' + message,
        success
    }
}