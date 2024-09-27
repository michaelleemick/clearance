import axios from "axios"
import axio from "axios"

const baseUrl : string = "http://121.41.167.176:20001"

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
    let url = baseUrl + "/t86/normal/items/" + mainId + "/reveiew?time=" + Date.now()
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
            url = url + '&pageNum=' + params.pageSize
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

    return response_data
}

export default {
    getPending,
    getT86,
    getHtsById,
}