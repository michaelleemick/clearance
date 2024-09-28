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
            <a-checkbox-group v-model:value="checkedHtsStatus" :options="checkStatusOption" name="hts-select" />
            
        </div>
        <div class='replace_line'>
            
            <div class="replace_btn">
                <a-button type="primary">Replace by rules</a-button>
            </div>
            <div class="replace_bank"></div>
            <div class='replace_AI'>
                <label>Intelligent Replace:</label>
                <a-switch v-model:checked="aiChecked" size="small" />
            </div>
            
        </div>
        
        <div class='hts-table'>
            <a-table :dataSource="dataSource" :columns="columnsInfo" :pagination="pageData" @change="tableChangeHandle">
                <template #bodyCell="{ column, record }">
                    <template v-if="column.key === 'PGA Flag'">
                        <a-tag v-for="(tag) in record.pgaFlags"
                        :key="tag.title"
                        :color="tag.color"
                        >
                        {{ tag.title }}
                        </a-tag>
                    </template>
                    <template v-else-if="column.key === 'Valid'">
                        <div v-for="name in record.status" :key="name">
                            <a-badge v-if="name === 'Invalid'" color="red" />
                            <a-badge v-if="name === 'HTS Invalid'" color="red" />
                            <a-badge v-else-if="name === 'HTS Warning'" color="yellow" />
                            <a-badge v-else-if="name === 'Description Warning'" color="orange" />
                            <a-badge v-else color="green" />
                            <label>{{ name }}</label>
                        </div>
                    </template>
                    <template v-else-if="column.key === 'actions'">
                        <a href="javascript:void(0)" @click="getRecommond(record)">Recommond</a>
                    </template>
                </template>
            </a-table>
            
        </div>
    </div>
</template>

<script lang="ts">

import { defineComponent, onMounted, ref, watch, nextTick} from 'vue'
import { useRoute } from 'vue-router'
import Api from '../api/Api'
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
        const checkedHtsStatus = ref(['Invalid', 'HTS Warning','Description Warning'])
        const pageData = ref({
            current : 1,
            pageSize : 10,
            total: 0,
            showSizeChanger: true,
            showQuickJumper: true
        })

        const dataSource : any = ref([])
        const columnsInfo : any = ref([
            {title:'Valid', dataIndex:'status', key:'Valid'},
            {title: 'HTS', dataIndex : 'htsCode', key: 'HTS'},
            {title: 'Shipment Description', dataIndex: 'nameEn', key: 'Shipment Description'},
            {title:'PGA Flag', dataIndex:'pgaFlags', key:'PGA Flag'},
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

        onMounted(() =>{
            nextTick(()=>{
                getData(mainId)
            })
        })
        
        const checkStatusOption = [
            { label: 'Valid', value: 'Valid' },
            { label: 'HTS Warning', value: 'HTS Warning' },
            { label: 'Shipment Description Warning', value: 'Description Warning' },
            { label: 'InValid', value: 'Invalid'},
        ]

        const getData = async(mainId : any)=>{

            let params = {
                pageSize : pageData.value.pageSize,
                pageNum : pageData.value.current,
                statusList : checkedHtsStatus.value
            }
            let data = await Api.getHtsById(mainId, params)
            dataSource.value = []
            if( data.total > 0 ){
                pageData.value.total = data.total
                //dataSource.value = data.rows
            }
        
            for( let i = 0 ; i< data.rows.length; i++){
                //console.log("dddd", data.rows[i])
                data.rows[i].index = i +1;
                if( data.rows[i].pgaFlags && data.rows[i].pgaFlags.length> 0){
                    for( let k = 0; k < data.rows[i].pgaFlags.length; k++ ){
                        let obj = {
                            title : data.rows[i].pgaFlags[k],
                            color : "red"
                        }
                        data.rows[i].pgaFlags[k] = obj
                    }
                }
                dataSource.value.push(data.rows[i])
            }
            console.log('datasource', dataSource.value)
        }

        const tableChangeHandle = async(pagination : any) =>{
            console.log("table change ")
            if( pageData.value.current == pagination.current && pageData.value.pageSize == pagination.pageSize){
                return
            }else{
                
                pageData.value.current = pagination.current
                pageData.value.pageSize = pagination.pageSize
                getData(mainId)
            }
        }

        const getRecommond = async(item : any ) =>{
            console.log("get recommond", item.itemId)
            let data = await Api.getHtsRecommond(item.itemId)
        }

        return {
            checkedHtsStatus,
            checkStatusOption,
            aiChecked,
            dataSource,
            columnsInfo,
            pageData,
            tableChangeHandle,
            getRecommond
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