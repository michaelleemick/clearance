import axios from "axios"
import { getCache } from "@/common/storage"

//const baseUrl : string = "http://121.41.167.176:20001"
const baseUrl : string = "/api"

// axios.interceptors.request.use(
//     (config) => {
//         let jwt = getCache('jwt')
//         let userInfo = getCache('userInfo')

//         if( jwt ){
//             config.headers.Authorization = "Bearer " + jwt
//         }

//         if( userInfo.clientid ){
//             config.headers.clientid = userInfo.clientid
//         }
//         return config

//     }
// )

const getPending = async( params: any = {}) =>{
    let url = baseUrl + "/t86/normal/master/pagination?eqStatus=Draft"

    if( params ){
        if( params.masterBillNumber ){
            url = url + '&masterBillNumber=' + params.masterBillNumber
        }

        if( params.pageSize ){
            url = url + '&PageSize=' + params.pageSize
        }else{
            url = url +  '&PageSize=10'
        }

        if( params.firstLogisticsProviderCode ){
            url = url + '&firstLogisticsProviderCode=' + params.firstLogisticsProviderCode
        }
    }

    url = url + "&time=" + Date.now()

    let config = {
        method : 'get',
        url : url,
        headers: {
            'Accept': '*/*', 
        },
    }

    const { data: response_data }  = await axios(config)
    console.log(url, response_data)
    return response_data
}

const login = async( params: any = {}) =>{
    
    let url = baseUrl + "/t86/normal/master/pagination?eqStatus=Draft"

    if( params ){
        if( params.masterBillNumber ){
            url = url + '&masterBillNumber=' + params.masterBillNumber
        }

        if( params.pageSize ){
            url = url + '&PageSize=' + params.pageSize
        }else{
            url = url +  '&PageSize=10'
        }
        
        if( params.firstLogisticsProviderCode ){
            url = url + '&firstLogisticsProviderCode=' + params.firstLogisticsProviderCode
        }
    }

    url = url + "&time=" + Date.now()

    let config = {
        method : 'get',
        url : url,
        headers: {
            'Accept': '*/*', 
        },
    }

    const { data: response_data }  = await axios(config)
    //console.log(url, response_data)
    return response_data
}

const getT86 = async( params : any = {}) =>{
    let url = baseUrl + "/t86/normal/master/pagination?neStatus=Draft"
    console.log('lasdlflsda', params)
    if( params ){
        if( params.masterBillNumber ){
            url = url + '&masterBillNumber=' + params.masterBillNumber
        }

        if( params.pageSize ){
            url = url + '&PageSize=' + params.pageSize
        }else{
            url = url +  '&PageSize=10'
        }

        if( params.pageNum ){
            url = url + '&pageNum=' + params.pageSize
        }else{
            url = url + '&pageNum=1'
        }
    }
    url = url + "&time=" + Date.now()
    let config = {
        method : 'get',
        url : url,
        headers: {
            'Accept': '*/*', 
        },
    }
    const { data: response_data }  = await axios(config)
    console.log(url, response_data)
    return response_data
}

const getHtsById = async( mainId : string, params : any = {} ) =>{
    if( mainId == null ){
        return undefined;
    }
    let url = baseUrl + "/t86/normal/items/" + mainId + "/review?time=" + Date.now()
    //url = url + "statusList=Invalid&statusList=HTS%20Warning&statusList=Description%20Warning&PageSize=10&pageNum=10&time=" + Date.now()
    console.log("resresr0", params)
    if( params ){
        if( params.statusList ){
            for(let i = 0; i < params.statusList.length; i++){
                url = url + "&statusList=" + params.statusList[i]
            }
        }

        if( params.pageSize ){
            url = url + '&PageSize=' + params.pageSize
        }
        if( params.pageNum ){
            url = url + '&pageNum=' + params.pageNum
        }
    }

    let config = {
        method: 'get',
        url : url,
        hearders :  {
            'Accept': '*/*', 
        }
    }
    const { data: response_data }  = await axios(config)
    console.log("testest", response_data)
    return response_data
}

const getfirstLogisticsProviderName = async() =>{
    let url = baseUrl + "/system/dict/data/type/origin_carrier"
    let config = {
        method : 'get',
        url : url,
        Headers : {
            'Accept' : '*/*'
        }
    }

    const { data : response_data } = await axios(config)
    return response_data
}

const approvePassBill = async( mainId : number) =>{
    let url = baseUrl + "/t86/normal/master/" + mainId + "/approval_pass"
    let config = {
        method : "put",
        url : url,
    }
    const { data : response_data } = await axios(config)
    return response_data
}

const updateFirstProvider = async( mainId : number, data : any ) =>{
    
    let url = baseUrl + "/t86/normal/master/" + mainId + "/firstLogisticsProvider"
    let config = {
        method: 'put',
        url : url,
        data : data
    }
    const { data : response_data }  = await axios(config)
    console.log("update res", response_data)
    return response_data
}

const sentTOCC = async(mainId : number ) =>{
    let url = baseUrl + '/t86/normal/master/upload/' + mainId
    let config = {
        method : 'post',
        url : url,
    }

    const { data : response_data } = await axios(config)
    return response_data
}

const getClreanceProfile = async(masterBillNumber: string, type: string) =>{
    let url = baseUrl + "/t86/normal/master/export/" + masterBillNumber +  "/" + type
    let config = {
        method : 'get',
        url : url
    }

    const { data : response_data } = await axios(config)
    return response_data
}

const getHtsRecommond = async(itemId : number )=>{
    let url = baseUrl + "/t86/normal/items/suggest/" + itemId
    let config = {
        method : 'get',
        url : url
    }

    let { data : response_data } = await axios(config)
    console.log("get recommond", response_data)
    return response_data;
}

export default {
    getPending,
    getT86,
    getHtsById,
    getfirstLogisticsProviderName,
    approvePassBill,
    updateFirstProvider,
    sentTOCC,
    getClreanceProfile,
    getHtsRecommond,
}