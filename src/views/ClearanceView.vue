<template>
    <a-spin :spinning="loadingType">
    <div class="main_layout">
        <Topbar @custom-event="show_loading"></Topbar>
        <a-modal v-model:open="showFrame" title="Bill Infos" class="bill-iframe" width="950px" height="500px" :footer="null" @afterClose="modalCloseHandle" :destroyOnClose="true">
            <a-spin class="loading-spin" size="large" v-if="showLoading"/>
            <iframe :src="iframe_url" class="iframe-class" @load="frameLoaded" ref="iframeComp"></iframe>
        </a-modal>
        <div style="flex:1;background-color:#f5f5f5;padding: 24px 24px 40px 24px;">
            <div class="content-body">
                <a-tabs v-model:activeKey="activeKey" class="tabs-a">
                    <a-tab-pane key="1" tab="Pending">
                        <div class="pending_content" style="margin-top:8px;">
                            
                            <div class="search-equals" style="display: flex;align-items: center;margin-bottom: 16px;">

                                <!-- //search-input -->
                                <label style="vertical-align:middle;" >MBOL:</label>
                                <a-input-search 
                                    v-model:value="bill_search" 
                                    placeholder="Search" 
                                    @search="searchMbolHanlde"  
                                    style="vertical-align:middle;margin-left:20px;width:240px" />
                                

                                <label style="margin-left: 24px;vertical-align:middle;">OriginCarries:</label>

                                <!-- //carries-dropdown -->
                                <a-select ref="select" 
                                    v-model:value="carriesName"
                                    style="width: 200px;text-align: left;margin-left:12px;"
                                    @change="handleCarrierChange"
                                >
                                    <a-select-option v-for="item in carriesData" :key="item.key" :value="item.text">{{ item.text }}</a-select-option>
                                </a-select>
                                <!-- //upload-btn -->

                            </div>

                            <div class="content-table">
                                <a-table :dataSource="mbols_data" :columns="columns_info" :pagination="pageData" @change="tableChangeHandle" >
                                    <template #bodyCell="{ column, record, index}">
                                        <template v-if="column.key === 'actions'">
                                            <span>
                                                <a-popconfirm
                                                    title="Are you sure pass this task?"
                                                    placement="bottom"
                                                    cancel-text="No"
                                                    @confirm="approveHandle(record)"
                                                    ok-text="Yes"
                                                >   
                                                    <a href="#">Approve</a>
                                                </a-popconfirm>
                                                <a-divider type="vertical" />
                                                <a-popconfirm
                                                    title="Are you sure reject this task"
                                                    placement="bottom"
                                                    cancel-text="No"
                                                    ok-text="Yes"
                                                    okType="primary"
                                                    @confirm="rejectHandle(record)"
                                                >
                                                    <template #description>
                                                        <a-form layout="vertical">
                                                            <a-form-item label="Reject reseaon:">
                                                                <a-textarea :rows="3" ref="rejectRef" placeholder="Please enter reject reason" v-model:value="record.rejectContent"/>
                                                            </a-form-item>
                                                        </a-form>
                                                    </template>
                                                    <a href="#">Reject</a>
                                                </a-popconfirm>
                                                <!-- <a @click="rejectHandle(text)">Reject</a> -->
                                            </span>
                                        </template>
                                        <template v-else-if="column.key === 'firstLogisticsProviderName'">
                                            <a-select 
                                                v-if="record.firstLogisticsProviderName === null"
                                                :value="record.firstLogisticsProviderName" 
                                                style="width: 120px;text-align:left;"
                                                @change="(value)=> setItemFirstProvider(value, record, index)"
                                            >
                                                <a-select-option v-for="item in carrierItemData" :key="item.key" :value="item.text">{{ item.text }}</a-select-option>
                                            </a-select>
                                            <label v-else>{{ record.firstLogisticsProviderName }}</label>
                                            
                                        </template>
                                        <template v-else-if="column.key === 'mbol'">
                                            <a href="javascript:void(0)" @click="showIframe(record)">{{ record.mbol }}</a><CopyOutlined  @click="copyMbolHandle(record.mbol)" style="margin-left: 8px;color: #1677ff"/>
                                        </template>
                                    </template>
                                </a-table>
                            </div>
                        </div>
                    </a-tab-pane>

                    <a-tab-pane key="2" tab="T86">
                        <T86 @custom-event="show_loading"></T86>
                    </a-tab-pane>
                    <a-tab-pane key="3" tab="Reject" disabled>Reject</a-tab-pane>
                </a-tabs>
            </div>
        </div>
    </div>
    </a-spin>
  </template>
  
<script lang="ts">
import { defineComponent, onMounted, ref, nextTick } from 'vue'
import { SearchOutlined,DownOutlined, CopyOutlined } from '@ant-design/icons-vue'
import Topbar from '@/components/TopBar.vue'
import T86 from '@/components/T86.vue'
import Api from '@/api/Api'
import { getCache } from '@/common/storage'
import { message } from 'ant-design-vue'


  export default defineComponent({
    name: 'ClearanceView',
    components: {
      Topbar,
      SearchOutlined,
      DownOutlined,
      CopyOutlined,
      T86,
    },
    setup(){
        
        const showFrame = ref(false)
        const showLoading = ref(false)
        const loadingType = ref(false)
        const iframe_url = ref("")
        const iframeComp = ref(null)

        const pending_count = ref(0)
        const activeKey = ref('1')
        const bill_search = ref<string>("")
        const carriesName = ref("All")
        const approveVisible = ref<boolean>(false)
        const rejectRef = ref(null)
        const carriesData: any = ref([
            {key: '1', text: 'All'},
        ])
        const carrierItemData : any = ref([])

        const pageData = ref({
            current : 1,
            pageSize : 10,
            total: 0,
            showSizeChanger: true,
            showQuickJumper: true
        })
        

        const mbols_data: any = ref([])

        const fetchBills = async(params: any = {}) =>{
            loadingType.value = true
            try {
                if(pageData.value ){
                    params.pageSize = pageData.value.pageSize
                    params.pageNum = pageData.value.current
                }
                if( carriesName.value != "All"){
                    params.firstLogisticsProviderCode = carriesName.value
                }

                if( bill_search.value != null) {
                    params.masterBillNumber = bill_search.value
                }
                
                const response_data = await Api.getPending(params)
                let carrier_data : string[] = [];
                loadingType.value = false
                if( response_data.code != 200){
                    message.error(response_data.msg,3)
                    return
                }
                mbols_data.value  = [];
                if( response_data.total > 0) {
                    pageData.value.total = response_data.total
                }

                for(let key in response_data.rows){
                    response_data.rows[key].mbol = response_data.rows[key].masterBillNumber
                    let index = parseInt(key, 10) + 1
                    response_data.rows[key].index = index
                    
                    response_data.rows[key].type = "Ocean T86 + AMS + ISF10"
                    
                    response_data.rows[key].hbol = response_data.rows[key].totalHouseCount
                    response_data.rows[key].sku_total = response_data.rows[key].totalShipmentQuantity
                    response_data.rows[key].carrier = response_data.rows[key].carrierCode
                    response_data.rows[key].ior = response_data.rows[key].clientName
                    if( response_data.rows[key].ior ==='拼多多'){
                        response_data.rows[key].ior = 'Temu'
                    }
                    response_data.rows[key].source = response_data.rows[key].creatorName
                    response_data.rows[key].creator = response_data.rows[key].creatorName
                    response_data.rows[key].createdAt = response_data.rows[key].createTime
                    mbols_data.value.push(response_data.rows[key])
                    if( !carrier_data.includes(response_data.rows[key].carrierCode)){
                        carrier_data.push(response_data.rows[key].carrierCode)
                    }
                }

            }catch ( error){
                console.error('axios error', error)
            }
        }

        const getLogicProvider = async()=>{
            let response = await Api.getfirstLogisticsProviderName()
            if( response.code != 200) {
                message.error(response.msg, 3)
                return
            }
            let providerDatas  = response.data
            carriesData.value = [
                {key: '1', text: 'All'},
            ]
            carrierItemData.value = []

            for( let key in providerDatas ){
                let obj = { 
                    key : providerDatas[key].dictSort + 1,
                    text : providerDatas[key].dictValue
                }

                carriesData.value.push(obj)
                let obj2 = {
                    key : providerDatas[key].dictSort,
                    text : providerDatas[key].dictValue
                }
                carrierItemData.value.push(obj2)
            }
        }

    
        onMounted(() =>{
            nextTick(()=>{
                fetchBills()
                getLogicProvider()
            })
        })
        
        const columns_info = [
            {title:'MBOL', dataIndex:'mbol', key:'mbol'},
            {title:'Type', dataIndex:'type', key:'type'},
            {title:'HBOL', dataIndex:'hbol', key:'hbol'},
            {title:'Manifest Quantity', dataIndex:'sku_total', key:'sku_total'},
            {title:'Origin Carrier', dataIndex:'firstLogisticsProviderName', key:'firstLogisticsProviderName', width : "200px"},
            {title:'IOR', dataIndex:'ior', key:'ior'},
            {title:'Source', dataIndex:'source', key:'source'},
            {title:'Creator', dataIndex:'creator', key:'creator'},
            {title:'Created Date', dataIndex:'createdAt', key:'createdAt'},
            {title:'Actions', key:'actions'}, 
        ]

        const rejectHandle = async(item : any)=>{     
            console.log('item', item)    
            let response = await Api.rejectBill(item.mainId, item.rejectContent)
            if( response.code == 200){
                message.success('Reject Succ', 1, ()=>{
                    fetchBills()
                })
            }else{
                message.error(response.msg, 1)
            }
        }

        const searchMbolHanlde = () =>{
            
            if( bill_search.value === null){
                return
            }

            let params = {
                masterBillNumber : bill_search.value
            }
            fetchBills(params)
        }

        const handleCarrierChange = ( value : string) =>{
           
            carriesName.value = value
            if( value === "All") {
              
                fetchBills()
            }else{
                let params : any = {
                    firstLogisticsProviderCode : value
                }
                if( bill_search.value != null ){
                    params.masterBillNumber = bill_search.value
                }
                fetchBills(params)
            }
        }

        const setItemFirstProvider = async(value: any, record:any, index : any) => {
            console.log("set provider",record, value ) 
            record.firstLogisticsProviderName = value
            record.firstLogisticsProviderCode = value
            let result = await Api.updateFirstProvider( record)
            if(result.code === 200){
                message.success('Update Succ', 1, ()=>{
                    fetchBills()
                })
            }else{
                message.error(result.msg, 1, ()=>{
                    fetchBills()
                })
            }
        }

        const tableChangeHandle = async(pagination : any) =>{
            console.log("table change ")
            if( pageData.value.current == pagination.current && pageData.value.pageSize == pagination.pageSize){
                return
            }else{
                
                pageData.value.current = pagination.current
                pageData.value.pageSize = pagination.pageSize
                fetchBills()
            }
        }
        
        const approveHandle = async( item: any ) => {
            console.log("approve ", item)

            if( item.firstLogisticsProviderCode === null){
                message.error('Must Select Carrier',3)
                return
            }
            let response = await Api.approvePassBill(item.mainId)

            if( response.code === 200){
                message.success('Appreved Succ', 1, ()=>{
                    fetchBills()
                })
            }else{
                message.error(response.msg, 2)
            }
        }
        const copyMbolHandle = async( mbol : string ) =>{
            await navigator.clipboard.writeText(mbol);
            message.success("Copy Succ", 2)
        }
        
        const showIframe = async(record: any) =>{
            showFrame.value = true
            iframe_url.value = "https://api.clearance.great-way.link/api/jmreport/view/1001739101741998080?masterBillNumber=" + record.masterBillNumber
            console.log("frame start")
            showLoading.value = true
        }

        const frameLoaded = ()=>{
            showLoading.value = false
        }

        const modalCloseHandle = () =>{
            
            if( iframeComp.value ){
                if( iframeComp.value){
                    console.log("clear iframe")
                    let iframe = iframeComp.value as HTMLIFrameElement
                    iframe.contentWindow?.document.open()
                    iframe.contentWindow?.document.write("")
                    iframe.contentWindow?.document.close()
                }
            }
        }
        const show_loading = (b : boolean = false) =>{
            loadingType.value = b
        }

        return {
            activeKey,
            pending_count,
            bill_search,
            carriesData,
            carriesName,
            mbols_data,
            columns_info,
            approveVisible,
            rejectRef,
            rejectHandle,
            searchMbolHanlde,
            handleCarrierChange,
            setItemFirstProvider,
            carrierItemData,
            approveHandle,
            copyMbolHandle,
            iframe_url,
            showFrame,
            showIframe,
            frameLoaded,
            showLoading,
            modalCloseHandle,
            loadingType,
            pageData,
            tableChangeHandle,
            show_loading,
        }
        
    },
   
  });
</script>
<style scoped>

.main_layout{
    width: 100%;
    height: 100vh;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    background: #F5F5F5;
}
.tabs-a .ant-tabs-tab{
    margin-left: 12px;
    font-size: 16px;
    padding: 0, 12px, 0,12px;
}

.content-body {
    height: 100%;
    background: #fff;
    padding: 0 24px;
}
.earch-equals{
    display: flex;
}
.bill-iframe{
    width: 950px;
    height: 500px;
}
.iframe-class{
    /* position: fixed; */
    width: 850px;
    height: 500px;
    overflow: auto;
    border: 0px;

}
.loading-spin{
    position: fixed;
    margin-left: 400px;
    margin-top: 250px;
}
</style>
  