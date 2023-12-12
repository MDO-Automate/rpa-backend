import sql from 'mssql'

import configDB from "../config/database"
import { objectInLine, objectInLineWhere } from '../utils/objectToSql'

const connectDB = async ()=> {
    let connection : sql.ConnectionPool
    try{
        connection = await sql.connect(configDB)
        return  {
            success: true,  
            message: 'Conectado a la base de datos con exito',  
            connection
        }
    }catch(e){
        return  {
            success: false,  
            message: 'No se ha podido conectar a la base de datos'
        }
    }   
}

export const querySQL = async (sql: string)=> {
        const db = await connectDB()
        console.log(sql)
        if(db.success){
            try{
                const Result = await db.connection?.query(sql)      
                return { success: true, message: 'Query realizada', data: Result }      
            }
            catch(err: any){
                return { success: false, message: err?.originalError?.info?.message}
            }
        } 
        else return { success: false, message: db.message }
}

/**
 * Función asincrónica para guardar un objeto en una tabla de la base de datos
 * @param table - nombre de la tabla en la que se guardarán los datos
 * @param object - objeto con los datos que se guardarán en la tabla
 * @returns - objeto con información sobre si la operación fue exitosa o no, y un mensaje
 */

export const saveField = async(table: string, object: any) => {
    let columnString = ''
    let valuesString = ''
    const keys = <any[]> Object.keys(object)

    keys.map((itemKey: any)=> {         
        // dependiendo del tipo de valor le agrega ' ' o convierte los booleanos en 1 o 0
        switch (typeof(object[itemKey])){
            case 'string': 
                valuesString+= "'" + object[itemKey] + "',"
                break
            case 'boolean':
                valuesString+= object[itemKey] == 'true' || object[itemKey] == true  ? '1,' : '0,'
                break
            default: 
                valuesString+= object[itemKey] + ','
                break       
        }
        columnString += itemKey + ','
    })

    // le quita la ultima coma al texto de los valores y campos
    const valuesStringWithoutLast = valuesString.slice(0, -1)
    const columnStringWithoutLast = columnString.slice(0, -1)
    const query = `INSERT INTO ${table} (${columnStringWithoutLast}) VALUES (${valuesStringWithoutLast});`
    const executedQuery = await querySQL(query)

    if(executedQuery.success){
     return { 
         success: true, 
         message: 'Datos guardados con exito' 
     }
    }else { 
        if(executedQuery?.message?.includes('PK_UserToken')){
            return {
             success: false, 
             message: 'El elemento que desea guardar, se encuentra repetido por Primary Key. Values: ' + valuesStringWithoutLast
            }
        }else return { 
                success: false, 
                message: executedQuery.message
        }
    } 
}    

/**
 * Función asincrónica para guardar varios objetos en una tabla de la base de datos
 * @param table - nombre de la tabla en la que se guardarán los datos
 * @param object - array de objetos con los datos que se guardarán en la tabla
 * @returns - objeto con información sobre si la operación fue exitosa o no, y un mensaje
 */

export const saveManyFields = async (table: string, object : any[])=> { 
    for(let itemObject of object ){
        const savedData = await saveField(table, itemObject)
        if(!savedData.success) return {
                success: false,
                message: savedData.message    
        }
    }
    return {
        success: true,
        message: 'Grupo de elementos guardados con exito'
    }
}

export const updateField = async(table: string, objectValues: any, objectWhere: any)=> {
    const keysobjectValues = <any[]> Object.keys(objectValues)
    const keysobjectWhere = <any[]> Object.keys(objectWhere)
    const querySET = objectInLine(keysobjectValues, objectValues)
    const queryWhere = objectInLine(keysobjectWhere, objectWhere)

    const query = `UPDATE ${table} SET ${querySET} WHERE ${queryWhere};`
    const executedQuery = await querySQL(query) 
    if(executedQuery.success){
        return {success: true, message: 'Datos actualizados con exito' }
    } return {success: false, message: executedQuery.message }
} 

export const listFilds = async(table: string, columnsArray: any[], objectWhere: object) => {
    let columns = ' '
    // concatena las columnas de la consulta y les coloca un ',' al final
    columnsArray?.map((item)=> columns += item + ',')
    // toma las keys del objeto del where de la consulta 
    if(Object.keys(objectWhere ?? {}).length >= 1 && columnsArray != undefined){
        const keysObjectWhere = Object.keys(objectWhere ?? {})
        //convierte el objeto en formato value sql ej. key = 'value'
        const whereValues = objectInLineWhere(keysObjectWhere, objectWhere, 'AND')
        
        // concatena la consulta quitandole la ultima ',' al string de columnas
        const query = `SELECT ${columns.slice(0, -1)} FROM ${table} WHERE ${whereValues};`
        const queryResult = await querySQL(query)
    
        if(queryResult.success){
            return { success: true, data: queryResult.data, message: queryResult.message }
        }else return { success: false, data: undefined, message: queryResult.message }
    }else return { 
        success: false, 
        message: 'Se debe ingresar columnas a filtrar y los valores de referencia para el filtro.' 
    }
}

export const listFildsOrderBy = async(table: string, columnsArray: any[], objectWhere: object, orderBy: string[], order: string[], between:string = '') => {
    let columns = ' '

    let orderByString= ''
    orderBy.map((item, index)=> {
        orderByString += `${item} ${order[index]},`
    }) 

    //Agrega AND si existen columnas en la consulta
    const betweenAND = Object.keys(objectWhere).length > 0 ? 'AND' : ''
    between = between !== '' ? `${between} ${betweenAND}`: ''
    // concatena las columnas de la consulta y les coloca un ',' al final
    columnsArray?.map((item)=> columns += item + ',')
    // toma las keys del objeto del where de la consulta 

    const keysObjectWhere = Object.keys(objectWhere ?? {})
    //convierte el objeto en formato value sql ej. key = 'value'
    const whereValues = objectInLineWhere(keysObjectWhere, objectWhere, 'AND')
    console.log(whereValues);
    
    // concatena la consulta quitandole la ultima ',' al string de columnas
    const query = `SELECT ${columns.slice(0, -1)} FROM ${table} WHERE ${between} ${whereValues} ORDER BY ${orderByString.substring(0, orderByString.length -1 )};`  
    console.log(query)
    const queryResult = await querySQL(query)
    if(queryResult.success){
        return { success: true, data: queryResult.data, message: queryResult.message }
    }else return { success: false, data: undefined, message: queryResult.message }

}

export const listAllFilds = async (table: string)=> {
    const query = `SELECT * FROM ${table};`
    const queryResult = await querySQL(query)
    if(queryResult.success){
        return { success: true, data: queryResult.data?.recordset, message: queryResult.message }
    }else return { success: false, data: {}, message: queryResult.message }
}

export const deleteField =async (table:string, where: object) => {
    const keys = Object.keys(where)    
    const whereQuery = objectInLine(keys, where)
    const query = `DELETE FROM ${table} WHERE ${whereQuery};`
    const { success, message } = await querySQL(query)
    if(success){
        return { success, message: 'Infromación eliminada con exito' }
    }else return { success, message }

}