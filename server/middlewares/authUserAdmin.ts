import { NextFunction } from "express"
import { userRol } from "../services/users"
import express from "express"


export const adminAuthentication =  async (req: express.Request, res: express.Response, next: NextFunction ) =>{  
    const username  = String(req.header('username')) || ' '
    const { success, data } = await userRol(username)
 
    if(success){
        const rol = data?.recordset[0]?.rol
        if(rol == "Admin"){
            next()
        }else res.status(401).json({  error: 'Usuario no administrador' })
    }else res.status(401).json( { error: 'Usuario no encontrado' })
}

export const rolAuthentication =  async (req: express.Request, res: express.Response, next: NextFunction ) =>{ 
    const username = String(req.header('username')) || ' ' 
    const rol = String(req.header('rol')) || ' '
    const { success, data } = await userRol(username)
    if(success){
        const rolUser = data?.recordset[0]?.rol
        if(rol == rolUser || rolUser == 'Admin'){
            next()
        }else res.status(401).json({  error: 'Rol de usuario no coincide' })
    }else res.status(400).json( { error: 'Usuario no encontrado' })
}




