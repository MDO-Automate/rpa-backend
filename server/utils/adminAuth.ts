import { querySQL } from "../services/sqlServer"
import bcrypt from 'bcrypt'

import { errorHandler } from "../../types"

/*
 Parametros:
    @table: tabla donde se hará la consulta
    @userAdmin: nombre de usuario administrador
    @claveAdmin: contraseña de usuario administrador
*/

export const adminAuthentication =  async (userAdmin: string | undefined, claveAdmin: string | undefined): Promise<errorHandler> =>{    
    const table = 'UserToken'
    const queryAdmin = `SELECT clave, rol FROM ${table} WHERE usuario = '${userAdmin}';`
    const resultAdmin = await querySQL(queryAdmin)
    const rowsResult = resultAdmin?.data?.rowsAffected[0] 

    if(Number(rowsResult) > 0){
        const passAdmin = resultAdmin?.data?.recordset[0]?.clave
        const rolAdmin = resultAdmin?.data?.recordset[0]?.rol
        const isAdminPass = await bcrypt.compare(String(claveAdmin), passAdmin)

        if(isAdminPass && rolAdmin == "Admin"){   
            return { success: true, message: 'Usuario admnistrador' }
        } else return { success : false, message: 'Contraseña incorrecta o usuario sin rol administrador.'}
    }
    else
        return { success : false, message: 'No se ha encontrado el usuario.'}

}