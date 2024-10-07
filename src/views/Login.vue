<template>
    <div class="home">
        <div class="home-item login-left"><img class='logo' src="../assets/image/image.png" />
            <div class="logo-text">
                <div class="logo-text-top">Welcome back!</div>
                <div class="logo-text-bottom">Seamlessly connect cross-border logistics and effortlessly expand your global market!</div>
            </div>
        </div>
        <div class="home-item">
            <div class="login-form-container">
                <div style="font-size:30px;font-weight:600;line-height:38px;margin-bottom:24px;">Log In</div>
                <a-form
                    :hideRequiredMark="true"
                    :model="formState"
                    layout="vertical"
                    name="normal_login"
                    class="login-form"
                    @finish="onFinish"
                    @finishFailed="onFinishFailed"
                >
                    <a-form-item
                    label="Username"
                    name="username"
                    :rules="[{ required: true, message: 'Please input your username!', trigger: 'blur' }]"
                    >
                    <a-input v-model:value="formState.username">
                        <template #suffix>
                        <UserOutlined class="site-form-item-icon" />
                        </template>
                    </a-input>
                    </a-form-item>

                    <a-form-item
                    label="Password"
                    name="password"
                    :rules="[{ required: true, message: 'Please input your password!', trigger: 'blur' }]"
                    >
                    <a-input-password v-model:value="formState.password">
                        <template #iconRender="v">
                        <UnlockOutlined class="site-form-item-icon" style="color:rgba(0,0,0,0.88);" v-if="v"/>
                        <LockOutlined class="site-form-item-icon" style="color:rgba(0,0,0,0.88);" v-else/>
                        </template>
                    </a-input-password>
                    </a-form-item>

                    <a-form-item>
                       
                        <a-button type="primary" html-type="submit" class="login-form-button" block>Login</a-button>
                        
                        
                    </a-form-item>
                </a-form>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import axios from 'axios';
import { defineComponent,reactive, computed, ref } from 'vue'
import { UserOutlined, LockOutlined, UnlockOutlined } from '@ant-design/icons-vue'
import { setCache } from '@/common/storage'
import { decryptWithAes } from '@/common/aes'
import { decodeJWT2Obj } from '@/common/jwt'
import { message } from 'ant-design-vue'
import router from '@/router'


export default defineComponent({
    name: 'Login',
    components: {
        UserOutlined,
        LockOutlined,
        UnlockOutlined,
    },
    setup() {
        interface FormState {
            username: string,
            password: string,
        }
        const formState = reactive<FormState>({
            username: '',
            password: '',
        })

        const onFinish = async(values: any) => {
            // let data : string = JSON.stringify({
            //     "clientId": "e5cd7e4891bf95d1d19206ce24a7b32e",
            //     "grantType": "password",
            //     "tenantId": "000000",
            //     "username": formState.username,
            //     "password": formState.password,
            // })
            let data  = {
                "clientId": "e5cd7e4891bf95d1d19206ce24a7b32e",
                "grantType": "password",
                "tenantId": "000000",
                "username": formState.username,
                "password": formState.password,
            }
            
            axios.post('/auth/login', data).then(response =>{
                let response_data = response.data
                if( response_data.code === 200) {
                    setCache('jwt', response_data.data.access_token)
                    let user_info = decodeJWT2Obj(response.data.data.access_token).payload
                    if( response_data.data.expire_in){
                        user_info.expire_in = Date.now()  + response_data.data.expire_in
                    }else{
                        user_info.expire_in = Date.now() + 600000
                    }
                    setCache('userInfo', user_info)
                    router.push('/')
                }else{
                    message.error(response_data.msg, 3)
                }
            }).catch(error => {
                console.log("error", error)
            })

            // let config = {
            //     method: 'post',
            //     //url: 'http://121.41.167.176:20001/auth/login',
            //     url : "/api/auth/login",
            //     headers: { 
            //         'Content-Type': 'application/json', 
            //         'Accept': '*/*', 
            //     },
            //     data: data
            // }
            // axios(config).then(function(response) {
            //     console.log('login res', JSON.stringify(response.data))
            //     // 保存用户基本信息至localStorage
            //     // setCache('userInfo', {name: response.data.name, avatarUrl: response.data.avatar})
            //     // router.push('/')
            // }).catch(function (error) {
            //     console.log(error)
            // })
            // setTimeout(()=>{
            //     setCache('userInfo', {name:'Truety', avatarUrl:'https://gd-hbimg.huaban.com/dc4b46d78ad5d8f1657dc3b3dd28d7bec4a9b6c418bc9-TFXE1F_fw658webp'})
            //     router.push('/')
            // }, 3000)
        }

        const onFinishFailed = (errorInfo: any) => {
            console.log('Failed:', errorInfo)
        }
        return {
            formState,
            onFinish,
            onFinishFailed,
        }
    }
});
</script>
<style lang="less" scoped>
.home {
    width: 100%;
    height: 100vh;
    display: flex;
    overflow: hidden;
    .home-item {
        width: 50%;
        &.login-left {
            background-image: url('../assets/image/login_bg.png');
            background-repeat: no-repeat;
            -webkit-background-repeat: no-repeat;
            -moz-background-repeat: no-repeat;
            background-size: cover;
            -webkit-background-size: cover;
            -moz-background-size: cover;
            background-position: top;
            -webkit-background-position: top;
            -moz-background-position: top;
            position: relative;
            .logo {
                position: absolute;
                width: 94px;
                top: 60px;
                left: 90px;
            }
            .logo-text {
                position: absolute;
                left: 90px;
                top: 50%;
                margin-top: -75px;
                text-align: left;
                color: #fff;
                .logo-text-top {
                    font-size: 48px;
                    font-weight: 500;
                    margin-bottom: 32px;
                }
                .logo-text-bottom {
                    width: 527px;
                    font-size: 20px;
                    font-weight: 500;
                    line-height: 32px;
                    word-wrap: break-word;
                }
            }
        }
        .login-form-container {
            width: 540px;
            color: rgba(0, 0, 0, 0.85);
            margin: auto;
            margin-top: calc(50% - 133px);
        }
    }
}

</style>
<style>
@media screen and (max-width: 1440px) {
    .login-form-container {
        width: 500px;
    }
}
</style>  