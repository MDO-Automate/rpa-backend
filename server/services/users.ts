import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

import {  saveField } from './sqlServer'
import { updateField, listFilds, listAllFilds, deleteField } from './sqlServer'


import { userCreate, userAuth } from '../../types'

const table = '[CHECKLIST].[dbo].[UserToken]'

const getUserToken =  async (isCorrect: boolean, usuario: string) => {
    if(isCorrect){
        const generedToken =  jwt.sign({ foo: 'bar' }, 'shhhhh');
        const resultUpdate = await updateField(table, {token: generedToken}, {usuario})
        if(resultUpdate.success){
            return { success: true,  token: generedToken, message: resultUpdate.message }
        } else return { success: false, token: undefined, message: resultUpdate.message }
    } else return { success: false, token: undefined, message: 'Credenciales incorrectas' }
}

export const userAuthentication = async({usuario, clave}: userAuth) =>{
    const queryClave = await listFilds(table, ['clave', 'rol'], {usuario})
    const errorText = 'Credenciales incorrectas'
    if(queryClave.success){
        const rowsQuery =  queryClave?.data?.rowsAffected[0]
        if(Number(rowsQuery) > 0){
            const userPass = queryClave?.data?.recordset[0]?.clave 
            const rol = queryClave?.data?.recordset[0]?.rol
            const isCorrect = await bcrypt.compare(clave, String(userPass))
            const { success, token, message  } = await getUserToken(isCorrect, usuario)
            return { success, token, message, rol }
        }else return { success: false, rol :undefined, token: undefined, message: errorText }
    }else return { success: false, rol :undefined, token: undefined, message: queryClave.message } 
}

export const createUser = async (
    {
        usuario,
        clave,
        rol
    }: userCreate
    ) => {
        const userHashPass = await bcrypt.hash(clave, 10)
        const data = {
            usuario,
            clave: userHashPass,
            rol
        }
        const dataSaved = await saveField(table, data)     
        if(dataSaved.success){
            return { 
                success: dataSaved.success, 
                message: 'Usuario creado satisfactoriamente'
            }
        }else return { 
                success: dataSaved.success, 
                message: 'No se ha podido guardar la información. Error: ' + dataSaved.message 
        }           

}

export const updateUser = async(objectValues: any, objectWhere: any, password: string | undefined)=> {
    let updateData = objectValues
    
    if(password != undefined){
          const userHashPass = await bcrypt.hash(password, 10)
          updateData = { ...updateData, clave : userHashPass}
    }  
    const updatedData = await updateField(table, updateData, objectWhere)
    if(updatedData.success){
     return { success: true, message: 'Usuario actualizado con exito' }
    }else return { success: false, message: 'Error al actualizar el usuario Error: '+ updatedData.message }
} 

export const listUsers = async() => {
    const { success, data, message } = await listAllFilds(table)
    if(success){
        return { success, data, message}
    }else return {
        data: null,
        success,
        message: 'No se ha podido listar los usuarios. Error:' + message
    }
}

export const delteUser = async (id: number)=> {
    const { success, message } = await deleteField(table, { id })
    if(success){
        return { success, message: 'Usuario eliminado satisfactoriamente' }
    } return {  success, message }
}

export const userRol = async(userAdmin: string )=> {
    const columns =[ 'rol' ] 
    const where = {
        usuario: userAdmin
    }

    const { success, data, message }  = await listFilds(table, columns, where )
    if(success)return {success, data}  
    else return { success, message }
}