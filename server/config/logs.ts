import path from 'path'

const logsPath = path.resolve(__dirname, '../../logs')

export const logs = {
    apiPath : path.join(`${logsPath}`, 'api.txt')
}