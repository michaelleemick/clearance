<template>
    <a-layout-header class="layout-header" >
        <div class="logo_content">
            <img class='logo' src="../assets/image/image.png" />
        </div>
        <div class="menus">
            <a-menu class='top-bar-menu' v-model:selectedKeys="current" :items="items" mode="horizontal" theme="dark" @onClick="topbar_change"></a-menu>
            <!-- <a-menu v-model:selectedKeys="current" mode="horizontal" style="gap:12px;" theme="dark" class="top-menu">
                <a-menu-item key="Dashboard" class="top-menu-item">
                    <BellOutlined /><span>Dashboard</span>
                </a-menu-item>
                <a-menu-item key="Clearance" class="top-menu-item">
                    <BellOutlined />Clearance
                </a-menu-item>
                <a-menu-item class="top-menu-item">
                    <BellOutlined />Lifecycle
                </a-menu-item>
            </a-menu> -->
        </div>
        <div class="toolbar_layout">
            <div class="toolbar">
                <div class="notice">
                    <a-badge count="5">
                        <BellOutlined />
                    </a-badge>
                </div>
                <div class="management"></div>
                <div class="language"></div>
                <div class="user_info"></div>
            </div>
        </div>
        
    </a-layout-header>
</template>

<script lang="ts">
import { h, defineComponent, ref } from 'vue';
import { BellOutlined, AppstoreOutlined} from '@ant-design/icons-vue';
import { MenuProps } from 'ant-design-vue';
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
    return {
        current: current,
        items: items,
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
    background-color: aquamarine;
}
.management{
    width: 48px;
    background-color: beige;
}
.language{
    width: 42px;
    background-color: blue;
}
.user_info{
    width: 113px;
    background-color: bisque;
}
 /* .ant-menu-horizontal > .ant-menu-item-selected {
    border-radius: 100px;
    height: 28px;
    padding: 2px,12px,2px,12px;
    border-radius: 100px;
} */

</style>