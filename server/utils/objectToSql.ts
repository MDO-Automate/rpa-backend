
export const objectToBetween = (campo: string, start: string, end: string)=> {
    return `${campo} BETWEEN '${start}' AND '${end}'`
}

/* Convierte un objecto en campos y valores para una consulta insert into con sus respectivos tipos de datos
para los valores a agregar.

`INSERT INTO ${table}(${columnStringWithoutLast}) VALUES(${valuesStringWithoutLast})`

parametros: 
    object: objeto con la información de los campos a ingresar

*/
export const objectToInsertInto = (object: any): string[]=> {
    
    let columnString = ''
    let valuesString = ''
    const keys = <any[]> Object.keys(object)

    keys.map((itemKey: any)=> {         
        // dependiendo del tipo de valor le agrega ' ' o convierte los booleanos en 1 o 0
        switch (typeof(object[itemKey])){
            case 'string': 
                valuesString+= "'" + object[itemKey] + "',"
                break
            case 'boolean':
                valuesString+= object[itemKey] == 'true' ? '1,' : '0,'
                break
            default: 
                valuesString+= object[itemKey] + ','
                break       
        }
        columnString += itemKey + ','
    })

    // le quita la ultima coma al texto de los valores y campos
    const valuesStringWithoutLast = valuesString.slice(0, -1)
    const columnStringWithoutLast = columnString.slice(0, -1)
    
    return [valuesStringWithoutLast, columnStringWithoutLast]
}

// convierte un objeto a 'key=value' y lo devuelve en un string
export const objectInLine = (keys: any, object: any)=> {
    let value = ''
    let keyAndValues = ''
    
    keys.map((key: any)=> {
        switch (typeof(object[key])){
            case 'string': 
                value+=  "'" + object[key] + "',"
                break
            case 'boolean':
                value+= object[key] == 'true' ||  object[key] == true ? '1,' : '0,'
                break
            default: 
                value+= object[key] + ','
                break       
        }
        keyAndValues += key + '=' + value
        value = ' '
    })

    return keyAndValues.slice(0, -1)
}

export const objectInLineWhere = (keys: any, object: any, denotation: string)=> {
    let value = ''
    let keyAndValues = ''
    
    keys.map((key: any)=> {
        switch (typeof(object[key])){
            case 'string': 
                value+=  "'" + object[key] + "' " + denotation + ' '
                break
            case 'boolean':
                value+= object[key] == 'true' ||  object[key] == true ? '1 ' + denotation  + ' ': '0 ' + denotation + ' '
                break
            default: 
                value+= object[key] +' '+ denotation + ' '
                break       
        }
        if(typeof(object[key]) == 'object' && object[key].hasOwnProperty('contains')){
            keyAndValues += `${key} LIKE '%${object[key].contains}%'     AND `
        } else keyAndValues += key + '=' + value
        value = ''
    })

    return keyAndValues.slice(0, -4)
}