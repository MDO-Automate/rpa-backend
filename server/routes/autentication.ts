import { Router } from "express";

import { createUser, userAuthentication, listUsers, updateUser, delteUser } from "../services/users";
import { tokenVerify } from "../middlewares/authToken";
import { adminAuthentication } from "../middlewares/authUserAdmin";

const authRoute = Router()

authRoute.post('/create', adminAuthentication,tokenVerify, async (req, res)=> {
    try{
        const { usuario, clave, rol } = req.body
        const dataSave = {
            usuario, 
            clave,
            rol 
        }
        const dataSaved = await createUser(dataSave)

        if(dataSaved.success){
            res.status(200).json({ message: dataSaved.message })
        }else {
            res.status(400).json({ message: dataSaved.message })
        }
    }catch{
        res.status(400).json({error: 'No se han enviado los campos correspondiente en el cuerpo de la peticion'})
    }
    
})

authRoute.post('/update', adminAuthentication,tokenVerify, async(req, res)=> {
    try{
        const { id, usuario , rol } = req.body
        const clave = req.body?.clave
        const dataUpdate = {
            usuario,
            rol
        }
        const updatedData = await updateUser(dataUpdate, { id }, clave)
        if(updatedData.success){
            res.status(200).json({ message: updatedData.message })
        }else {
            res.status(400).json({ message: updatedData.message })
        }
    }catch{
       res.status(400).json({error: 'No se han enviado los campos correspondiente en el cuerpo de la peticion'})
    }
})

authRoute.post('/delete', adminAuthentication,tokenVerify, async(req, res)=> {
    try {
        const { id } = req.body
        const { success, message } =  await delteUser(id)
        if(success){
            res.status(200).json(message)
        }else  res.status(400).json(message)
    } catch{
        res.status(400).json({ message:  'No se encontró id del usuario en la petición'})
    }

})

authRoute.post('/list', adminAuthentication,tokenVerify, async( _req, res)=> {
    const { success, data, message } = await listUsers()
    if(success) res.status(200).json(data)
    else res.status(400).json(message)   
} )

authRoute.post('/login', async (req, res)=>{
    const { success, token, rol, message } = await userAuthentication(req.body)
    if(success){
        res.status(200).json({token: token, rol: String(rol) })
    }else res.status(400).json({error: message})
})


export default authRoute