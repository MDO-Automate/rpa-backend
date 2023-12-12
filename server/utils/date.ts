export const dateConvert = (date: string) =>{ 
    if(date?.search('/') != -1) {
        const format = {
            year : date.split('/')[2],
            month : date.split('/')[1],
            day: date.split('/')[0]
        }
        return format['year'] + '-' + format['month'] + '-' + format['day']
    }else return date   
}

export const today = () =>{ 
    const objectDate = new Date().toLocaleString('en-GB')
    const dateToday = objectDate.split(',')[0]
    const now = objectDate.split(',')[1].replace(' ', '')
    
    return {
        dateToday,
        now
    }
}