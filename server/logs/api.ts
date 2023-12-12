import fs from 'fs'
import { today } from '../utils/date'
import { logs } from '../config/logs'

const file = logs.apiPath

const logApi = (route: string, error: string, object: object) => {
    const { dateToday, now  } = today()
    const errString = `[${dateToday} - ${now}] Path: '${route}' Error: ${error} \ndataObject: ${JSON.stringify(object)} \n`
    fs.appendFileSync(file, errString)
}

export default logApi
