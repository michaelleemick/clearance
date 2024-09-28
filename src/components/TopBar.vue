<template>
    <div class="layout-header" >
        <div class="logo_content">
            <img class='logo' src="../assets/image/image.png" />
        </div>
        <div class="menus">
            <a-menu class='top-bar-menu' v-model:selectedKeys="current" :items="items" mode="horizontal" theme="dark" @onClick="topbar_change"></a-menu>
        </div>
        <div class="toolbar_layout">
            <div class="toolbar">
                <div class="notice">
                    <a-badge count="5" :offset="[4, -2]" :number-style="{width: '20px', height: '20px'}">
                        <BellOutlined style="color:#fff;width:18px;font-size:18px;" />
                    </a-badge>
                </div>
                <div class="management">
                    <div class="management-icon"></div>
                </div>
                <div class="language">
                    <div class="management-icon language-icon"></div>
                </div>
                <!-- <div class="user_info">
                    <img style="width:24px;height:24px;border-radius:12px;margin-right:8px;" :src="userInfo.avatarUrl" />
                    <span style="max-width:64px;font-size:14px;font-weight:400;color:#fff;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;line-height:22px;">{{ userInfo.name }}</span>
                </div> -->
                <a-dropdown :trigger="['click']" :overlay-style="{background:'#0F172A'}">
                    <div class="user_info" @click.prevent>
                        <img style="width:24px;height:24px;border-radius:12px;margin-right:8px;" :src="userInfo.avatarUrl" />
                        <span style="max-width:64px;font-size:14px;font-weight:400;color:#fff;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;line-height:22px;">{{ userInfo.name }}</span>
                    </div>
                    <template #overlay>
                        <div class="user-menu"><a-menu>
                            <a-menu-item key="1">
                            <a style="color:#fff;" href="javascript:void(0)" @click="logOut">Sign out</a>
                            </a-menu-item>
                        </a-menu></div>
                    </template>
                </a-dropdown>
            </div>
        </div>
        
    </div>
</template>

<script lang="ts">
import { h, defineComponent, ref } from 'vue';
import { BellOutlined, AppstoreOutlined} from '@ant-design/icons-vue';
import { MenuProps } from 'ant-design-vue';
import axios from 'axios';
import { setCache, getCache } from '@/common/storage';
import router from '@/router'
export default defineComponent({
  name: 'TopBar',
  components:{
    BellOutlined,
    AppstoreOutlined
  },

  methods: {
    topbar_change(item:any){
        console.log('click over', item);
    }
  },
  setup(){
    const current = ref<string[]>(['clearance'])
    const notice_count = 10
    const items = ref<MenuProps['items']>([
        {
            key: 'dashboard',
            icon: ()=> h(AppstoreOutlined),
            label: 'DashBoard',
            title: 'DashBoard',
            disabled: true
        },
        {
            key: 'clearance',
            icon: () => h(BellOutlined),
            label: 'Clearance',
            title: 'Clearance',
        },
        {
            key: 'Lifecycle',
            icon: () => h(BellOutlined),
            label: 'Lifecycle',
            title: 'Lifecycle',
            disabled : true,
        },

    ])
    interface userInfo {
        name: string,
        avatarUrl: string,
    }
    const userInfo = ref<userInfo>({
        name: '',
        avatarUrl: '',
    })
    let userCacheInfo = getCache('userInfo')
    if (userCacheInfo && userCacheInfo.userName) {
        userInfo.value.name = userCacheInfo.userName
    }
    if(userCacheInfo ) {
        //userInfo.value.avatarUrl = userCacheInfo.avatarUrl
        userInfo.value.avatarUrl = "https://gd-hbimg.huaban.com/dc4b46d78ad5d8f1657dc3b3dd28d7bec4a9b6c418bc9-TFXE1F_fw658webp"
    }
    const logOut = async()=> {
        console.log('logOut')
        let config = {
        method: 'post',
        url: '/api/auth/logout',
        headers: { 
            
            'Accept': '*/*', 
            'Authorization' : 'Bearer ' + getCache('jwt'),
            'clientid' : userCacheInfo.clientid
        }
        };
        axios(config).then(function (response) {
            console.log(JSON.stringify(response.data))
            // 登出成功后需置空userInfo
            setCache('userInfo', '')
            setCache('jwt', '')
            router.push({path: '/login'})
        }).catch(function (error) {
            console.log(error)
        })
        // setCache('userInfo', '')
        // router.push({path: '/login'})
    }
    return {
        current: current,
        items: items,
        userInfo,
        logOut,
    }
    
  }

});
</script>

<style scoped>
.layout-header {
    background-color: #0F172A;
    width: 100%;
    height: 48px; 
    /* position: sticky; */
    display: flex;
}
.logo_content{
    margin-left: 24px;
    width: 94px;
    height: 48px;
    align-content: center;
}
.logo{
    /* top: 10px; */
    width: 94px;
    height: 28px;
}
.menus{
    margin-left: 154px;
    flex:1
}
.top-bar-menu{
    gap:6px;
    height: 28px;
    line-height: 28px;
    margin-top: 10px;
}
.top-bar-menu /deep/ .ant-menu-item-selected{
    border-radius: 100px;
    line-height: 28px;
    padding-top: 0px;
    background: #1677ff;
    
}
.top-bar-menu /deep/ .ant-menu-item{
    line-height: 28px;
}
.toolbar_layout{
    display: flex;
    justify-content: flex-end; /* 使子元素靠右 */
    margin-block-end: 0px;
    width:275px;
}
.toolbar{
    width: 275px;
    height: 48px;
    display: flex;
}
.notice{
    width: 48px;
    align-content: center;
    text-align: center;
}
.management{
    width: 48px;
    align-content: center;
    text-align: center;
}
.management-icon {
    margin: auto;
    width: 24px;
    height: 24px;
    mask-image: url('../assets/image/expand.svg');
    background-color: #fff;
    mask-repeat: no-repeat;
    -webkit-mask-repeat: no-repeat;
    -moz-mask-repeat: no-repeat;
    mask-size: contain;
    -webkit-mask-size: contain;
    -moz-mask-size: contain;
    mask-position: center;
    -webkit-mask-position: center;
    -moz-mask-position: center;
}
.language-icon {
    width: 18px;
    height: 18px;
    mask-image: url('../assets/image/lang.svg');
}
.language{
    width: 42px;
    align-content: center;
    text-align: center;
}
.user_info{
    width: 113px;
    display: flex;
    align-items: center;
    justify-content: center;
}
.user-menu ul {
    background: #0F172A;
}
.user-menu li a {
    color: #fff;
}
 /* .ant-menu-horizontal > .ant-menu-item-selected {
    border-radius: 100px;
    height: 28px;
    padding: 2px,12px,2px,12px;
    border-radius: 100px;
} */

</style>