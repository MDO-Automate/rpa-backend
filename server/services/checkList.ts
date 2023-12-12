import { listAllFilds, saveManyFields } from "./sqlServer"

const table = 'CheckList'

export const listAllCheckList = async()=> {
   const { success, message, data } = await listAllFilds(table)
   if(success){
        return { success, message: 'Datos del checklist listado.', data }
   }else return { success, message, data }
}

export const saveManyChecklist = async(object: any[])=> {
    const response  = await saveManyFields(table, object)
    return response
}