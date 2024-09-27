<template>
    <div class="search-equals" style="display: flex;align-items: center;margin-bottom: 16px;">

        <!-- //search-input -->
        <label style="vertical-align:middle;" >MBOL:</label>
        <a-input-search 
            v-model:value="bill_search" 
            placeholder="Search" 
            @search="searchMbolHanlde"  
            style="vertical-align:middle;margin-left:20px;width:240px" />
    </div>
    <a-table :dataSource="dataSource" :columns="columns_info" >
        <template #bodyCell="{ column, text }">
            <template v-if="column.key === 'actions'">
                <template v-if="text.status === 'Draft'">
                    <a @click="checkHtsHandle(text)">Check</a>
                    <a-divider type="vertical"></a-divider>
                    <a @click="sendHtsHandle(text)">Send</a>
                </template>
                <template v-else-if="text.status ==='uploaded'">
                    <a href="#" @onClick="downloadHandle">DownLoad</a>
                </template>
            </template>
        </template>
    </a-table>
    
</template>
<script lang="ts">

import Api from '@/api/Api';
import router from '@/router'
import { defineComponent, nextTick, onMounted, reactive, ref } from 'vue'


export default defineComponent({
    name: 'T86',
   
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
            console.log("click ====", item)        
            router.push({
                name: 't86info',
                query: {
                    mainId: item.mainId
                }
            })
        }

        const getT86Data = async( params : any = {})=> {
            let response_data = await Api.getPending(params)
            dataSource.value = []
            for( let i = 0; i < response_data.rows.length; i++){
                response_data.rows[i].index = i + 1
                dataSource.value.push(response_data.rows[i])
            }
            console.log("datasource", dataSource.value)
        }
        
        onMounted(()=>{
            nextTick(()=>{
                getT86Data()
            })
        })

        const columns_info = [
            {title:'MBOL', dataIndex:'masterBillNumber', key:'masterBillNumber'},
            {title: 'HBOL', dataIndex : 'totalHouseCount', key: 'totalHouseCount'},
            {title: 'SKU Total', dataIndex: 'totalShipmentQuantity', key: 'totalShipmentQuantity'},
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
        }
    },
})
</script>

