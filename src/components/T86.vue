<template>
    <div class="search-equals" style="display: flex;align-items: center;margin-top: 8px;">

        <label style="vertical-align:middle;" >MBOL:</label>
        <a-input-search 
            v-model:value="bill_search" 
            placeholder="Search" 
            @search="searchMbolHanlde"  
            style="vertical-align:middle;margin-left:20px;width:240px" />
    </div>
    <a-table :dataSource="dataSource" :columns="columns_info" style="margin-top: 8px;">
        <template #bodyCell="{ column, record }">
            <template v-if="column.key === 'actions'">
                <template v-if="record.status === 'Approved'">
                    <!-- <a @click="checkHtsHandle(record)">Check</a> -->
                    <!-- <a-divider type="vertical"></a-divider> -->
                    <a @click="sendHtsHandle(record)">Send</a>
                    <a-divider type="vertical"></a-divider>
                    <a-dropdown :trigger="['click']" >
                        <a class='ant-dropdown-link' @click.prevent>
                            DownLoad
                        </a>
                        <template #overlay>
                            <a-menu>
                                <a-menu-item key='1'>
                                    <a href="javascript:void(0)" @click="downloadFileHandle('T86', record)">T86</a>
                                </a-menu-item>
                                <a-menu-item key='2'>
                                    <a  href="javascript:void(0)" @click="downloadFileHandle('ISF', record)">ISF</a>
                                </a-menu-item>
                                <a-menu-item  key='3'>
                                    <a v-if="record.transportMode==='OCEAN'" href="javascript:void(0)" @click="downloadFileHandle('AMS', record)">AMS</a>
                                    <a v-else href="javascript:void(0)" @click="downloadFileHandle('ACAS', record)">ACAS</a>
                                </a-menu-item>
                                <a-menu-item>
                                    <a  href="javascript:void(0)" @click="downloadFileHandle('T86V2', record)">Ocean T86 V2</a>
                                </a-menu-item>
                            </a-menu>
                        </template>
                    </a-dropdown>
                </template>
            </template>
            <template v-else-if="column.key === 'status'" >
                <a-tag v-if="record.status === 'Draft'" color="red">{{ record.status }}</a-tag>
                <a-tag v-else-if="record.status === 'Approved'" color="green">{{ record.status }}</a-tag>
            </template>
            <template v-else-if="column.key === 'masterBillNumber' ">
                {{ record.masterBillNumber }}<CopyOutlined  @click="copyMbolHandle(record.masterBillNumber)" style="margin-left: 8px;color: #1677ff"/>
            </template>
        </template>
    </a-table>
    
</template>
<script lang="ts">

import Api from '@/api/Api'
import router from '@/router'
import { message } from 'ant-design-vue'
import { defineComponent, nextTick, onMounted, reactive, ref } from 'vue'
import { CopyOutlined } from "@ant-design/icons-vue"

export default defineComponent({
    name: 'T86',
    components: {
        CopyOutlined,
    },
   
    setup() {
        const dataSource : any = ref([])
        const bill_search = ref('')
        const searchMbolHanlde = () =>{
            
            if( bill_search.value === null){
                return
            }

            let params = {
                masterBillNumber : bill_search.value
            }
            getT86Data(params)
            
        }

        const checkHtsHandle = (item : any ) => {    
            router.push({
                name: 't86info',
                query: {
                    mainId: item.mainId
                }
            })
        }

        const getT86Data = async( params : any = {})=> {
            let response_data = await Api.getT86(params)
            if( response_data.code != 200) {
                message.error(response_data.msg)
                return 
            }
            dataSource.value = []
            for( let i = 0; i < response_data.rows.length; i++){
                response_data.rows[i].index = i + 1
                dataSource.value.push(response_data.rows[i])
            }
            console.log("datasource", dataSource.value)
        }

        const sendHtsHandle = async(item: any) =>{
            if( item.mainId === null) {
                return
            }
            console.log("send to cc", item)
            //return
            let response = await Api.sentTOCC(item.mainId)
            console.log("send over", response)
            if( response.code === 200){
                message.success("Send")
            }else{
                message.error(response.msg)
            }
        }

        const downloadFileHandle = async(type: string, record : any) =>{
            console.log("get profile", record, type)
            let loading = message.loading('Apply For Serve',10)
            
            let result = await Api.getClreanceProfile(record.masterBillNumber, type)
            if( result == "Download Succ"){
                loading()
                message.success("Loaded", 3)
            }else{
                console.log("download error ", result)
                loading()
                message.error(result, 3)
            }
           
        }
        const copyMbolHandle = async( mbol : string ) =>{
            await navigator.clipboard.writeText(mbol);
            message.success("Copy Succ", 2)
        }
        
        onMounted(()=>{
            nextTick(()=>{
                getT86Data()
            })
        })

        const columns_info = [
            {title:'MBOL', dataIndex:'masterBillNumber', key:'masterBillNumber'},
            {title: 'HBOL', dataIndex : 'totalHouseCount', key: 'totalHouseCount'},
            {title: 'Manifest Quantity', dataIndex: 'totalShipmentQuantity', key: 'totalShipmentQuantity'},
            {title:'PGA Summary', dataIndex:'pgaSummary', key:'pgasummary'},
            {title:'Status', dataIndex:'status', key:'status'},
            {title:'Respond Time', dataIndex:'createTime', key:'createTime'},
            {title:'Submit Time', dataIndex:'updateTime', key:'updateTime'},
            {title:'Action',  key:'actions'},            
        ]

        return {
            columns_info,
            dataSource,
            checkHtsHandle,
            searchMbolHanlde,
            bill_search,
            sendHtsHandle,
            downloadFileHandle,
            copyMbolHandle
        }
    },
})
</script>

