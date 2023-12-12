// import sql from 'mssql'
import dotenv from 'dotenv'
 
dotenv.config()

const configDB = {
    server: String(process.env.DBSERVER),
    port: Number(process.env.DBPORT),
    authentication: {
        type: 'default',
        options: {
            userName: String(process.env.DBUSER), 
            password: String(process.env.DBPASS) 
        }
    },
    options: {
        database: String(process.env.DBNAME),
        encrypt: false,
        trustServerCertificate: true,
        enableArithAbort : true
    }
}

export default configDB
