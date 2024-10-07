import axios, { AxiosResponse } from "axios"
import { getCache, setCache } from "@/common/storage"
import { saveAs } from "file-saver"
import router from "@/router"

//const baseUrl : string = "http://121.41.167.176:20001"

const baseUrl : string = ''
if( process.env?.VUE_APP_BASE_URL){
    axios.defaults.baseURL = process.env?.VUE_APP_BASE_URL
}

axios.interceptors.request.use(
    (config) => {
        let jwt = getCache('jwt')
        let userInfo = getCache('userInfo')


        if( jwt ){
            config.headers.Authorization = "Bearer " + jwt
        }

        if( userInfo && userInfo.clientid ){
            config.headers.clientid = userInfo.clientid
        }
        return config

    }
)

axios.interceptors.response.use(
    response => {
        if( response.data && response.data.code === 401){
            setCache('userInfo', '')
            setCache('jwt', '')
            router.push({path: '/login'})
        }
        return response
    },
    error =>{
        console.log("error", error)
    }
)

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
            url = url + '&firstLogisticsProviderName=' + params.firstLogisticsProviderCode
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

const rejectBill = async( mainId : number, reason : string = "") =>{
    let url = baseUrl + '/t86/normal/master/' + mainId + '/approval_reject'
    let data = {}
    if( reason ){
        data = {
            reason : reason
        }
    }
    let config = {
        method: 'put',
        url : url,
        data : data
    }
    const { data : response_data } = await axios(config)
    return response_data
}

const updateFirstProvider = async( data : any ) =>{
    
    let url = baseUrl + "/t86/normal/master/firstLogisticsProvider"
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

    const response : AxiosResponse<Blob> = await axios.get(url, {
        responseType : 'blob',
        headers: {
            'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        }
    })
    if( response.status !== 200){
        return "Network Error"
    }

    if( response.data.type !== "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"){
        return "Download Error"
    }
    if( response.data.size === 0) {
        return "Empty File Data"
    }
    const fileName = getFileNameFromContentDisposition(decodeURIComponent(response.headers['content-disposition']))

    const blob: Blob = new Blob([response.data], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    })
    
    saveAs(blob, fileName)
    
    return 'Download Succ'
}

const getFileNameFromContentDisposition = (contentDisposition: string | undefined): string =>{
    if (!contentDisposition) {
      return 'file.xlsx';
    }

    const filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
    const matches = filenameRegex.exec(contentDisposition);
    if (matches != null && matches[1]) {
        let filename =  decodeURI(matches[1].replace(/['"]/g, ''));

        if( filename.startsWith('utf-8')){
            filename = filename.slice(5)
        }
        return filename
    }

    return 'file.xlsx';
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
    rejectBill
}