import axio from "axios"

const baseUrl : string = "http://121.41.167.176:20001"

const getPending = async( params: object = {}) =>{
    // response = await axios.get("http://121.41.167.176:20001/t86/normal/master/pagination?eqStatus=Draft&pageSize=10&pageNum=1&time="+ Date.now())
    // for()
    // let response = await.get()      
}

const login = async( params: object) =>{
    
    if( params === null){
        return 
    }else{
        
    }
}

export default {
    getPending,
}