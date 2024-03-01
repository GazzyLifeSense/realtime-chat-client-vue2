<template>
    <div id="panel-wrap" class="full scrollbar">
        <div class="addFriend-wrap">
            <div class="title bounceInRight">添加好友</div>
            <div class="subtitle">您可以输入用户名来添加好友。记得区分大小写哦！</div>
            <div class="input-wrap flex-center" :class="{active}">
                <input type="text" class="input line" v-model="to" placeholder="输入用户名" maxlength="15">
                <button class="btn line" ref="applyFriend_btn" >发送好友请求</button>
            </div>
        </div>
        <div class="addGroup-wrap">
            <div class="title bounceInRight">搜索群组</div>
            <div class="subtitle">您可以输入群组名来搜索群组。记得区分大小写哦！</div>
            <div class="input-wrap flex-center" :class="{active1}">
                <input type="text" class="input line" v-model="groupName" placeholder="输入群组名" maxlength="13">
                <button class="btn line" ref="searchGroup_btn" >查找</button>
            </div>
            <div class="list-wrap scrollbar">
                <div class="item-wrap" v-for="group of groupList" :key="group._id">
                    <img :src="getGroupAvatar(group.avatar)"  height=48 width=48 class="icon">
                    <div class="groupInfo">{{group.name}}</div>
                    <el-button type="primary" size="small" @click="applyGroup(group._id)">申请</el-button>
                </div>
            </div>
        </div>
        <div class="discover-wrap">
            <div class="title bounceInRight">其他能交友的地方</div>
            <button class="discover-btn flex-center line" @click.prevent="enterDiscovery">
                <img src="../assets/discover.svg" height="35" class="discover-img iconflex-center">
                <div class="desc">探索公开服务器</div>
                <svg class="arrow" fill="none" height="20" viewBox="0 0 20 20" width="20" xmlns="http://www.w3.org/2000/svg"><path clip-rule="evenodd" d="m5.41667 4.2625 5.66573 5.7375-5.66573 5.7375 1.74426 1.7625 7.42237-7.5-7.42237-7.5z" fill="currentColor" fill-rule="evenodd"></path></svg>
            </button>
        </div>
    </div>
</template>
<script>
import imgMixin from '@/mixin/imgMixin.js'
export default {
    name: 'Panel',
    mixins: [imgMixin],
    data(){
        return {
            to: '',
            groupName: '',
            groupList: [],
            active: false,
            active1: false
        }
    },
    computed:{
        user(){
            return this.$store.getters['userAbout/getUser']
        }
    },
    methods:{
        // 申请添加好友
        applyFriend(){
            if(!this.user.username || this.to.trim().length === 0) return this.$message.error('信息不能为空')
            if(this.to === this.user.username) return this.$message.warning('请不要添加你自己！')
            this.$axios.post('/api/applyFriend', {userId: this.user._id, username: this.to}).then((resp)=>{
                if(resp.code === 200) {
                    this.$message.success(resp.msg)
                }else{
                    this.$message.error(resp.msg)
                }
            })
        },
        // 申请加入群组
        applyGroup(to){
            this.$axios.post('/api/applyGroup', {userId: this.user._id, groupId: to}).then((resp)=>{
                if(resp.code === 200) {
                    this.$message.success(resp.msg)
                }else{
                    this.$message.error(resp.msg)
                }
            })
        },
        // 搜索群组
        getGroupsByName(){
            if(this.groupName.trim().length === 0) return this.$message.error('信息不能为空')
            this.$axios.post('/api/getGroupsByName', {groupName: this.groupName}).then((resp)=>{
                if(resp.code === 200) {
                    this.groupList = resp.data
                }else{
                    this.$message.error(resp.msg)
                }
            })
        },
        // 进入探索页面
        enterDiscovery(){
            this.$bus.$emit('enterPage', {type:3})
        }
    },
    watch:{
        // 控制按钮样式
        to(newV,oldV){
            if(newV.length > 0) {
                this.active = true;
                this.$refs.applyFriend_btn.onclick = this.applyFriend
            }else{
                this.active = false;
                this.$refs.applyFriend_btn.onclick = null
            } 
        },
        groupName(newV,oldV){
            if(newV.length > 0) {
                this.active1 = true;
                this.$refs.searchGroup_btn.onclick = this.getGroupsByName
            }else{
                this.active1 = false;
                this.$refs.searchGroup_btn.onclick = null
            } 
        },
    }
}
</script>
<style lang="less" scoped>
#panel-wrap{
    overflow-y: scroll;
    min-width: 450px;
    flex: 1;
    background: #37393F;
    color: white;
    .title{
        font-size: 16px;
        font-weight: 600;
        margin-bottom: 8px;
    }
    .subtitle{
        font-size: 14px;
        color: #B5BABD;
    }
    .addFriend-wrap,.addGroup-wrap,.discover-wrap{
        padding: 20px 30px;
    }
    .addFriend-wrap,.addGroup-wrap{
        border-bottom: 1px solid #42454A; 
        .input-wrap{
            padding: 0 12px;
            background: #212326;
            height: 50px;
            border-radius: 10px;
            margin-top: 16px;
            .input{
                flex: 1;
                background: transparent;
                outline: none;
                border: 0;
                font-size: 16px;
                color: white;
            }
            .btn{
                border-radius: 5px;
                font-size: 14px;
                padding: 2px 16px;
                color: #8C8E94;
                background: #3C438C;
                height: 32px;
                cursor: not-allowed;
            }
        }
        .input-wrap:focus-within{
            border: 1px solid rgb(0, 217, 255);
        }
        .active,.active1{
            .btn{
                color: white;
                background: #5865F2;
                cursor: pointer;
            }
        }
        .success:focus-within{
            border: 1px solid rgb(62, 241, 116);
        }
    }
    .list-wrap{
        overflow-x: hidden;
        overflow-y: scroll;
        margin-top: 5px;
        padding:10px 5px;
        height: 200px;
        .item-wrap{
            display: flex;
            justify-content: flex-start;
            align-items: center;
            padding: 5px;
            .groupInfo{
                flex: 1;
                overflow: hidden;
                padding-left: 10px;
            }
        }
    }


    .discover-wrap{
        .discover-btn{
            background: #2E3136;
            color: #D6D7D6;
            font-size: 16px;
            height: 56px;
            padding: 1px 6px;
            margin: 10px 0;
            .discover-img{
                margin: 5px;
            }
            .arrow{
                margin: 0 16px;
            }
        }
        .discover-btn:hover{
            background: #3F454D;
        }
    }
    
}
</style>