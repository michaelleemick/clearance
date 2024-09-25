<template>
    <div class="main_layout">
        <Topbar></Topbar>
        <a-layout-content>
            <div class="content-body">
                <a-tabs v-model:activeKey="activeKey" class="tabs-a">
                    <a-tab-pane key="1" tab="Pending">
                        <div class="pending_content" style="margin-top:8px;">
                            <div class="search-equals" style="display: flex;align-items: center;margin-left: 24px;">

                                <!-- //search-input -->
                                <label style="vertical-align:middle;" >MBOL:</label>
                                <a-input v-model:value="bill_search" placeholder="Seacrch" style="vertical-align:middle;margin-left:20px;width:240px">
                                    <template #suffix>
                                        <SearchOutlined />
                                    </template>
                                </a-input>

                                <label style="margin-left: 24px;vertical-align:middle;">OriginCarries:</label>

                                <!-- //carries-dropdown -->
                                <a-select ref="select" 
                                    v-model:value="carriesName"
                                    style="width: 200px;text-align: left;margin-left:12px;"
                                    @change="handleCarrierChange"
                                >
                                    <a-select-option v-for="item in carriesData" :key="item.key" value="{{ item.text }}">{{ item.text }}</a-select-option>
                                </a-select>
                                <!-- //upload-btn -->

                            </div>

                            <div class="content-table">
                                <a-config-provider :theme="{
                                    token:{
                                        colorPrimary:'#000000'
                                    }
                                }">
                                <a-table :dataSource="mbols_data" :columns="columns_info" >
                                    <template #bodyCell="{ column, text }">
                                        <template v-if="column.key === 'actions'">
                                            <span>

                                                <a-popconfirm
                                                    title="Are you sure pass this task?"
                                                    cancel-text="No"
                                                    @confirm="approveHandle(text)"
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
                                                    @confirm="rejectHandle(text)"
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
                                        <!-- <template v-else-if="column.key === 'carrier'"> -->
                                            <!-- <a-select v-if="text.carrier == null">
                                                <a-select-option>ZIMU</a-select-option>
                                            </a-select> -->

                                            <!-- <a-select v-else-if="text.carrier != null" value="hdt" disabled>
                                            </a-select> -->
                                        <!-- </template> -->
                                    </template>
                                </a-table>
                            </a-config-provider>
                            </div>
                        </div>
                    </a-tab-pane>

                    <a-tab-pane key="2">
                        <template #tab>
                            <span>
                                T86
                                <a-badge 
                                v-model:count="pending_count"
                                :number-Style="{
                                    color: '#1890FF',
                                    backgroundColor: '#E6F7FF'
                                }"
                                />
                            </span>    
                        </template>
                        <T86></T86>
                    </a-tab-pane>
                    <a-tab-pane key="3" tab="Reject" disabled>Reject</a-tab-pane>
                </a-tabs>
            </div>
        </a-layout-content>
    </div>
  </template>
  
  <script lang="ts">
  import { defineComponent, onMounted, ref, nextTick, watch } from 'vue'
  import { SearchOutlined,DownOutlined } from '@ant-design/icons-vue'
  import axios from 'axios'
  import Topbar from '@/components/TopBar.vue'
  import T86 from '@/components/T86.vue'

  export default defineComponent({
    name: 'ClearanceView',
    components: {
      Topbar,
      SearchOutlined,
      DownOutlined,
      T86,
    },
    setup(){
        const pending_count = ref(0)
        const activeKey = ref('1')
        const bill_search = ref<string>("")
        const carriesName = "All"
        const approveVisible = ref<boolean>(false)
        const rejectRef = ref(null)
        const carriesData: any = ref([
            {key: '1', text: 'All'},
        ])
        

        const mbols_data: any = ref([])

        watch(mbols_data, (new_data, old_data) =>{
            console.log("teststst", new_data, old_data)
        })

        const fetchBills = async() =>{
            try {
                let response
                response = await axios.get("http://121.41.167.176:20001/t86/normal/master/pagination?eqStatus=Draft&pageSize=10&pageNum=1&time="+ Date.now())
                
                console.log("http back:", response)
                const response_data = response.data
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
                    response_data.rows[key].source = response_data.rows[key].creatorName
                    response_data.rows[key].creator = response_data.rows[key].creatorName
                    response_data.rows[key].createdAt = response_data.rows[key].createTime
                    mbols_data.value.push(response_data.rows[key])
                    if( !carrier_data.includes(response_data.rows[key].carrierCode)){
                        carrier_data.push(response_data.rows[key].carrierCode)
                    }
                }
                pending_count.value = 10
                carriesData.value = [
                    {key: '1', text: 'All'},
                ]
                for(let i = 0; i < carrier_data.length; i++){
                    carriesData.value.push({
                        key: i+2,
                        text: carrier_data[i]
                    })
                }

            }catch ( error){
                console.error('axios error', error)
            }
        }

    
        onMounted(() =>{
            nextTick(()=>{
                fetchBills()
            })
        })
        

        const columns_info = [
            {title:'MBOL', dataIndex:'mbol', key:'mbol'},
            {title:'Type', dataIndex:'type', key:'type'},
            {title:'HBOL', dataIndex:'hbol', key:'hbol'},
            {title:'SKU Total', dataIndex:'sku_total', key:'sku_total'},
            {title:'Origin Carrier', dataIndex:'carrier', key:'carrier'},
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
                //mbols_data.value = []
            })
            
        }
        return {
            activeKey,
            pending_count,
            bill_search,
            carriesData,
            carriesName : carriesName,
            mbols_data,
            columns_info,
            approveVisible,
            rejectRef,
            rejectHandle,
        }
        
    },
    onReady(){

    },
    methods:{
        handleCarrierChange( value : string){
            console.log("select carrier", value)
            this.carriesName = value
        },
        async approveHandle(item: any) {
            console.log("approve ", item)
            let url : string = "http://121.41.167.176:20001/t86/normal/" + item.mainId + "/approval_pass"
            try{
                let response = await(axios.put(url))
                console.log(response)
            }catch(error){
                console.log("axios error", error)
            }  
            
        },
    }
  });
</script>
<style scoped>

.main_layout{
    width: 100%;
    height: 100%;
    margin: 0 auto;
}
.tabs-a .ant-tabs-tab{
    margin-left: 12px;
    font-size: 16px;
    padding: 0, 12px, 0,12px;
}
.content-body {
    margin-left: 24px;
    margin-right: 24px;
    margin-top: 24px;
    background-color: #FFFFFF;
}
.earch-equals{
    display: flex;
}
</style>
  