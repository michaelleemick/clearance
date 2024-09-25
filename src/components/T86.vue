<template>
    <a-table :dataSource="dataSource" :columns="columns_info" >
        <template #bodyCell="{ column, text }">
            <template v-if="column.key === 'actions'">
                <template v-if="text.status === 'draft'">
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

    <a-drawer
    v-model:open="drawerOpen"
    :width="drawerWidth"
    title="Review HTS Code"
    >
    <div class="statusLine" style="margin-top: 24px">
        <a-checkbox-group :value="checkedHtsStatus" :options="checkStatusOption" />
    </div>
    </a-drawer>
    
</template>
<script lang="ts">

import router from '@/router'
import { defineComponent, nextTick, onMounted, reactive, ref, useTemplateRef } from 'vue'

export default defineComponent({
    name: 'T86',
   
    setup() {
        
        const dataSource : any = ref([])
        const drawerOpen = ref(false)
        const drawerWidth = ref(1200)

        
        //const checkedHtsStatus = ref(['Apple'])
        const checkedHtsStatus = reactive(['htswarning','descwarnings'])
        //const checkStatusOption : any = ref(['Apple'])
        const checkStatusOption = [
            { label: 'Valid', value: 'valid' },
            { label: 'HTS Warning', value: 'htswarning' },
            { label: 'Shipment Description Warning', value: 'descwarnings' },
        ]
       
        const statusInfo = ref({
            valid: 200,
            htsWarning: 50,
            descWarning: 20,
            invalid : 5
        })

        

        const btnClick = () => {
            const input = useTemplateRef('textRef')
            console.log("test", input.value)

        }

        const checkHtsHandle = (item : any ) => {
            //drawerOpen.value = true
            console.log("click ====", item)
            router.push({
                name: 't86info',
                query: {
                    mbol: item.mbol
                }
                })
        }
        for( let i = 0; i< 10; i++){
            dataSource.value.push({
                index: i,
                mbol: "test111d3",
                pgasummary: "shipments with pga 250",
                status: "draft",
                respondTime: '2024-02-05 08:28:36',
                submitTime: '2024-02-05 09:28:36',

            })
        }
        onMounted(()=>{
            nextTick(()=>{
                drawerWidth.value = window.innerWidth
               
            })
        })

        const columns_info = [
            {title:'MBOL', dataIndex:'mbol', key:'mbol'},
            {title:'PGA Summary', dataIndex:'pgasummary', key:'pgasummary'},
            {title:'Status', dataIndex:'status', key:'status'},
            {title:'Respond Time', dataIndex:'respondTime', key:'respondTime'},
            {title:'Submit Time', dataIndex:'submitTime', key:'submitTime'},
            {title:'Action',  key:'actions'},            
        ]

        return {
            btnClick,
            columns_info,
            dataSource,
            drawerOpen,
            checkHtsHandle,
            drawerWidth,
            checkedHtsStatus,
            checkStatusOption,
        }
    },
})
</script>

