<template>
    <div class="center-container">
        <div v-if="showLogin" class="login-wrap">
            <form method="post">
                <h1>欢迎回来！</h1>
                <label for="username">用户名<span>*</span></label>
                <div class="input-wrap">
                    <input type="text" id="username" v-model="user.username" maxlength="15" required>
                </div>
                <label for="password">密码<span>*</span></label>
                <div class="input-wrap">
                    <input type="password" id="password" v-model="user.password" required>
                </div>
                <button class="login-btn" @click.prevent="toLogin">
                    <div>登 录</div>
                </button>
                <a class="link" @click="showLogin=!showLogin">注册新账号</a>
            </form>
        </div>
        <div v-if="!showLogin" class="reg-wrap">
            <form method="post">
                <h1>创建账号</h1>
                <label for="nickname">给你的用户取一个闪亮的昵称<span>*</span></label>
                <div class="input-wrap">
                    <input type="text" id="nickname" v-model="user.nickname" maxlength="6" required>
                </div>
                <label for="username">用户名<span>*</span></label>
                <div class="input-wrap">
                    <input type="text" id="username" v-model="user.username" maxlength="15" required>
                </div>
                <label for="password">密码<span>*</span></label>
                <div class="input-wrap">
                    <input type="password" id="password" v-model="user.password" required>
                </div>
                <label for="check_password">确认密码<span>*</span></label>
                <div class="input-wrap">
                    <input type="password" id="check_password" v-model="check_password" required>
                </div>
                <button class="reg-btn" @click.prevent="toRegister">
                    <div>注 册</div>
                </button>
                <a class="link tologin" @click="showLogin=!showLogin">已有账户？</a>
            </form>
        </div>
    </div>

</template>

<script>
import Vue from 'vue'
export default {
    name: 'Login',
    data(){
        return {
            showLogin:true,
            check_password: '',
            user: {
                username: '',
                nickname: '',
                password: '',
            }
        }
    },
    methods:{
        // 登录
        toLogin(){
            sessionStorage.removeItem("securityToken")
            if(this.user.username && this.user.password){
                this.$axios.post("/api/login", {username: this.user.username, password: this.user.password}).then((resp)=>{
                    if(resp.code === 200) {
                        // 存储token
                        sessionStorage.setItem("securityToken", JSON.stringify(resp.data).replaceAll("\"", ""))

                        this.$router.push('/mainwrap')
                    }else{
                        this.$message.error(resp.msg)
                    }
                })
            }else this.$message.warning('请输入用户名和密码！')
            
        },

        // 注册用户
        toRegister(){
            if(this.user.nickname && this.user.username && this.user.password && this.check_password)
            {
                // 密码一致
                if(this.user.password === this.check_password){
                    this.$axios.post("/api/register", this.user).then((data)=>{
                        if(data.code === 200){
                            this.$message.success(data.msg)

                            // 跳转登录页面
                            this.$router.go(0)
                        } else{
                            this.$message.error(data.msg)
                        }
                    })
                }else this.$message.error('密码不一致！')
            }else this.$message.warning('请输入信息！')
        }
    },
    async created(){
        await this.$store.dispatch('userAbout/resetUser')
        await this.$store.dispatch('pageAbout/resetPage')
        await this.$store.dispatch('messageAbout/resetMessageList')
        await this.$store.dispatch('groupAbout/resetGroupList')
        await this.$store.dispatch('groupAbout/resetMemberList')
        await this.$store.dispatch('friendAbout/resetFriendList')
    }
}
</script>

<style lang="less" scoped>
.center-container{
    background: url('../assets/bg.jpg');
    background-size: cover;
    color: white;
}
h1{ text-align: center; }
.login-wrap, .reg-wrap{
    width: 480px;
    background: #595b63b0;
    padding:32px;
    border-radius: 5px;
    form{
        display: flex;
        flex-direction: column;
    }
}
.login-wrap{
    height: 450px;
}
.reg-wrap{
    height: 550px;
}
label{
    font-size: 12px;
    display: block;
    margin-bottom: 8px;
    color: #B5BABD;
    span{
        color: red;
    }
}
.forget-pwd{
    margin: 5px 0 20px 0;
}
.login-btn, .reg-btn{
    flex: 1;
    background-color: #4752C3;
    border: none;
    border-radius: 2px;
    padding: 10px;
    margin-bottom: 5px;
    div{
        color: white;
        font-size: 18px;
        font-weight: 600;
    }
}
.input-wrap{
    display: flex;
    input{
        outline: none;
        border: none;
        border-radius: 2px;
        flex: 1;
        color: white;
        background-color: #212326;
        padding:10px;
        margin-bottom: 20px;
    }
}
</style>