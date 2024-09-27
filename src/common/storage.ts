export const getCache = (key : string ) =>{
    const  value = localStorage.getItem(key)
    let _val 
    try{
        _val = JSON.parse(value ? value : "")
    } catch(e){
        _val = undefined
    }

    return _val
}

export const setCache = (key: string, value : any) =>{
    value = JSON.stringify(value)
    localStorage.setItem(key, value)
}