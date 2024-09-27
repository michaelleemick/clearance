<template>
    <TopBar></TopBar>
    <div class="hts-content">
        <div class='bread-cls'>
            <a-breadcrumb>
                <a-breadcrumb-item><a href="#">T86</a></a-breadcrumb-item>
                <a-breadcrumb-item>HTS Check</a-breadcrumb-item>
            </a-breadcrumb>
        </div>

        <div class='group-check-hts'>
            <a-config-provider :theme="{
                token:{
                    colorPrimary:'#000000'
                }
            }">
            <a-checkbox-group v-model:value="checkedHtsStatus" :options="checkStatusOption" name="hts-select" />
            </a-config-provider>
        </div>
        <div class='replace_line'>
            <a-config-provider :theme="{
                token:{
                    colorPrimary:'#000000'
                }
            }">
            <div class="replace_btn">
                <a-button type="primary">Replace by rules</a-button>
            </div>
            <div class="replace_bank"></div>
            <div class='replace_AI'>
                <label>Intelligent Replace:</label>
                <a-switch v-model:checked="aiChecked" size="small" />
            </div>
            </a-config-provider>
        </div>
        
        <div class='hts-table'>
            <a-table :dataSource="dataSource" :columns="columnsInfo" >
                
            </a-table>
            
        </div>
    </div>
</template>

<script lang="ts">

import { defineComponent, ref, watch} from 'vue'
import { useRoute } from 'vue-router'
import Api from '../api/Api'
import { theme } from 'ant-design-vue';
import TopBar from '@/components/TopBar.vue';

export default defineComponent({
    name : 't86info',
    components:{
        TopBar,
    },
    setup() {
       
        const route = useRoute()
        console.log(route.query)
        const mainId = route.query.mainId

        //Api.getHtsById(route.query().mainId)
        const aiChecked = ref(false)
        const checkedHtsStatus = ref([])

        const dataSource : any = ref([])
        const columnsInfo : any = ref([
            {title:'Valid', dataIndex:'Valid', key:'Valid'},
            {title: 'HTS', dataIndex : 'HTS', key: 'HTS'},
            {title: 'Shipment Description', dataIndex: 'Shipment Description', key: 'Shipment Description'},
            {title:'PGA Flag', dataIndex:'PGA Flag', key:'PGA Flag'},
            {title:'HTS Description', dataIndex:'HTS Description', key:'HTS Description'},
            //{title:'Action',  key:'actions'},            
        ])

        watch(aiChecked, (nval, oval)=>{
            console.log(nval, oval)
            if( nval == true){
                columnsInfo.value.push({title:'Action',  key:'actions'})
            }else{
                columnsInfo.value.pop()
            }
        } )
        
        const checkStatusOption = [
            { label: 'Valid', value: 'valid' },
            { label: 'HTS Warning', value: 'htswarning' },
            { label: 'Shipment Description Warning', value: 'descwarnings' },
            { label: 'InValid', value: 'invalid'},
        ]

        // const getData = async(mainId : any, params : any = {})=>{
        //     Api.getHtsById(mainId)
        // }

        return {
            checkedHtsStatus,
            checkStatusOption,
            aiChecked,
            dataSource,
            columnsInfo,
        }
    },
})
</script>
<style scoped>
.hts-content{
    width: 100%;
    height: 100vh; 
}

.bread-cls{
        padding-left: 24px;
        padding-top: 24px;
        padding-right: 24px;
}

.group-check-hts {
    margin-left: 24px;
    margin-top: 24px;
}
.replace_line {
    display: flex;
    height: 32px;
    width: 100%;
    margin-top: 24px;
}
.replace_btn {
    margin-left: 24px;
}
.replace_bank {
    flex :1;
}
.replace_AI{
    display: flex;
    align-items: center;
    width : 154px;
    font-size: 14px;
    font-weight: 400;
    color: rgba(0,0,0,0.85);
}
.hts-table{
    margin-left: 24px;
    margin-top: 24px;
}
</style>