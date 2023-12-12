import { Request, Response, NextFunction } from "express";
import { querySQL } from "../services/sqlServer";

const table = '[CHECKLIST].[dbo].[UserToken]'

export const tokenVerify = async(req: Request, res: Response, next: NextFunction ): Promise<void>=> {
    try{
        const authHeader = req.header('Authorization')
        if (authHeader === undefined) {
          console.log('Error')
          console.log(authHeader)
          throw new Error('No se encontró la api key en la petición')
        } 
        const token = authHeader.split(' ')[1]
        if (token === undefined) {
          throw new Error('No se encontró token en la petición.')
        }
        const queryAuthToken = `SELECT * FROM ${table} WHERE token = '${token}'` 
        const resutlAuthToken = await querySQL(queryAuthToken)
        const rowsAuthToken = resutlAuthToken?.data?.rowsAffected[0]
        if(Number(rowsAuthToken) > 0) next()
        else res.status(401).json({ message: 'Token no valido'})
              
    }catch(e){
        res.status(401).json({ message: String(e) })
    }
}
