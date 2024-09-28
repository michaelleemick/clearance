<template>
    <div class="main_layout">
        <Topbar></Topbar>
        <a-alert class="alert-tip" :message="alert_data.alert_message" :type="alert_data.alert_type" v-if="alert_data.alert_visible" show-icon />
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
                                <a-config-provider :theme="{}">
                                <a-table :dataSource="mbols_data" :columns="columns_info" >
                                    <template #bodyCell="{ column, record, index}">
                                        <template v-if="column.key === 'actions'">
                                            <span>

                                                <a-popconfirm
                                                    title="Are you sure pass this task?"
                                                    cancel-text="No"
                                                    @confirm="approveHandle(record)"
                                                    ok-text="Yes"
                                                >   
                                                    <a href="#">Approve</a>
                                                </a-popconfirm>
                                                <a-divider type="vertical" />
                                                <a-popconfirm
                                                    title="Are you sure reject this task"
                                                    cancel-text="No"
                                                    ok-text="Yes"
                                                    okType="primary"
                                                    @confirm="rejectHandle(record)"
                                                >
                                                    <template #description>
                                                        <a-form layout="vertical">
                                                            <a-form-item label="Reject reseaon:">
                                                                <a-textarea :rows="3" ref="rejectRef" placeholder="Please enter reject reason" v-model:value="text.rejectContent"/>
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
                                            <label v-else>{ record.firstLogisticsProviderName }</label>
                                            
                                        </template>
                                    </template>
                                </a-table>
                            </a-config-provider>
                            </div>
                        </div>
                    </a-tab-pane>

                    <a-tab-pane key="2" tab="T86">
                        <T86></T86>
                    </a-tab-pane>
                    <a-tab-pane key="3" tab="Reject" disabled>Reject</a-tab-pane>
                </a-tabs>
            </div>
        </div>
    </div>
  </template>
  
<script lang="ts">
import { defineComponent, onMounted, reactive, ref, nextTick, watch } from 'vue'
import { SearchOutlined,DownOutlined } from '@ant-design/icons-vue'
import axios from 'axios'
import Topbar from '@/components/TopBar.vue'
import T86 from '@/components/T86.vue'
import Api from '@/api/Api'
import { getCache } from '@/common/storage'


  export default defineComponent({
    name: 'ClearanceView',
    components: {
      Topbar,
      SearchOutlined,
      DownOutlined,
      T86,
    },
    setup(){
        const alert_data = ref({
            alert_message: "",
            alert_type: "success",
            alert_visible : false
        })

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
        

        const mbols_data: any = ref([])

        const fetchBills = async(params: any = {}) =>{
            try {
            
                const response_data = await Api.getPending(params)
                let carrier_data : string[] = [];
                mbols_data.value  = [];

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
            {title:'SKU Total', dataIndex:'sku_total', key:'sku_total'},
            {title:'Origin Carrier', dataIndex:'firstLogisticsProviderName', key:'firstLogisticsProviderName', width : "200px"},
            {title:'IOR', dataIndex:'ior', key:'ior'},
            {title:'Source', dataIndex:'source', key:'source'},
            {title:'Creator', dataIndex:'creator', key:'creator'},
            {title:'Created Date', dataIndex:'createdAt', key:'createdAt'},
            {title:'Actions', key:'actions'}, 
        ]

        const rejectHandle = (item : any)=>{
            console.log("reject", item)
            nextTick(()=>{
                fetchBills()
            })
            
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
            console.log("select carrier", value)
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
            let data = {
                firstLogisticsProviderName : value,
                firstLogisticsProviderCode : value,
            }
            let result = await Api.updateFirstProvider(record.mainId, data)
        }
        
        const approveHandle = async( item: any ) => {
            console.log("approve ", item)

            if( item.firstLogisticsProviderCode === null){
                alert_data.value = {
                    alert_message: "Must Select Carrier",
                    alert_type: 'error',
                    alert_visible : true
                }
                setTimeout(()=>{
                    alert_data.value.alert_visible = false
                }, 3000)
            }
        }

        return {
            alert_data,
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
        }
        
    },
    onReady(){

    },
    methods:{
        
        // async approveHandle(item: any) {
        //     console.log("approve ", item, item.firstLogisticsProviderName)
        //     //let _url = '/api/t86/normal/' + item.mainId + '/approval_pass'
        //     let _url = '/api/t86/normal/master/' + item.mainId + '/approval_pass'
        //     let config = {
        //         method : "put",
        //         url : _url,
        //         headers:{
        //             'Authorization' : 'Bearer ' +  getCache('jwt')
        //         },
        //     }
        //     let response = await axios(config)
        //     console.log("=====appprove ove", response)
        //     return
            
        // },
    }
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
.alert-tip {
    position: fixed;
    top: 60px;
    width: 400px;
    left : 50%;
    border-radius: 5px;
    margin-left : -200px;
    line-height: 16px;
}
</style>
  