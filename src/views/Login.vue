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
                <!-- <a-spin :spinning="loadingType"> -->
                <div style="font-size:30px;font-weight:600;line-height:38px;margin-bottom:24px;">Log In</div>
                <a-spin :spinning="loadingType">
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
                    <a-input size="large" v-model:value="formState.username">
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
                    <a-input-password size="large" v-model:value="formState.password">
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
                </a-spin>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import axios from 'axios';
import { defineComponent,reactive, ref } from 'vue'
import { UserOutlined, LockOutlined, UnlockOutlined, CodeSandboxCircleFilled } from '@ant-design/icons-vue'
import { setCache } from '@/common/storage'
import { decodeJWT2Obj } from '@/common/jwt'
import { message } from 'ant-design-vue'
import router from '@/router'
import Api from '@/api/Api';


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
       
        const loadingType = ref(false)

        const onFinish = async(values: any) => {
            let data  = {
                "clientId": "e5cd7e4891bf95d1d19206ce24a7b32e",
                "grantType": "password",
                "tenantId": "000000",
                "username": formState.username,
                "password": formState.password,
            }
            loadingType.value = true
            
            axios.post('/api/auth/login', data).then(response =>{
                
                let response_data = response.data
                if( response_data.code === 200) {
                    setCache('jwt', response_data.data.access_token)
                    
                    getUserInfo()
                    router.push('/')
                }else{
                    loadingType.value = false
                    message.error(response_data.msg, 3)
                }
            }).catch(error => {

                console.log("error", error)
            })

            const getUserInfo = async() =>{
                let response_data = await Api.getUserInfo()
                loadingType.value = false
                if( response_data.code !==200){
                    setCache('jwt', "")
                    message.error(response_data.msg,3)
                    router.push('/')
                }
                console.log("get user data", response_data)

                let userInfo = response_data.data.user
                setCache("userInfo", userInfo)
                router.push('/')
            }
        }

        const onFinishFailed = (errorInfo: any) => {
            console.log('Failed:', errorInfo)
        }
        return {
            formState,
            onFinish,
            onFinishFailed,
            loadingType,
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