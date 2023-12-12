import Router from 'express'
import checkListRoute  from './checklist'
import authRoute from './autentication'
import novRoutes from './novedades'

export const apiRoutes = (app: any )=> {
    const routes = Router()
    routes.use('/auth',authRoute )
    routes.use('/checklist', checkListRoute)
    routes.use('/novedades', novRoutes)
    app.use('/api/v1', routes)  
}