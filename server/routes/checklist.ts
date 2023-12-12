import Router from 'express'
import { listAllCheckList, saveManyChecklist } from '../services/checkList'

import { tokenVerify } from '../middlewares/authToken'

const checkListRoute = Router()

// Petición GET con todos los datos
checkListRoute.get('/', tokenVerify, async (req, res)=>{ 
    const response = await listAllCheckList()
    if(response.success){
        res.status(200).json({data: response.data})
    }else res.status(400).json({ error: response.message })
})


checkListRoute.post('/', tokenVerify, async(req, res)=> {
    //recoge el body de la petición
    const dataCheckList = req.body
    const { success, message} = await saveManyChecklist(dataCheckList)
    if(success){
        res.status(200).json({ message })
    }else res.status(400).json({ message})
})


export default checkListRoute