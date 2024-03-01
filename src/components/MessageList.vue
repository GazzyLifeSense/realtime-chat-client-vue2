<template>
    <div id="messageList" class="flex-center" ref='menu' :style="{display: config.display}">
        <img class="cancel" src="@/assets/arrowDown.svg" @click.stop="hide">
         <div class="detail-wrap flex-start-center miniscrollbar">
             <div class="detail flex-between-center" v-for="message of messageList" :key="message._id" @click="enterPrivateChat(getTo(message.from))">
                <div class="left line">
                    <div class="nickname">{{ getNickname(message.from) }}</div>
                    <div class="text">{{ message.content }}</div>
                </div>
                <div class="time">{{ parseTime(message.create_time) }}</div>
            </div>
         </div>
    </div>
</template>

<script>
import imgMixin from '@/mixin/imgMixin.js'
import { parseTime } from '@/utils'
export default {
    name: 'messageList',
    props: ['config'],
    mixins: [imgMixin],
    computed:{
        messageList(){  
            return this.$store.getters['messageAbout/getMessageList']
        },
        friendList(){
            return this.$store.getters['friendAbout/getFriendList']
        }
    },
    methods:{
        parseTime,
        hide(){
            this.config.display='none'
                        console.log(this.messageList);
        },
        getNickname(id){
            for(let i = 0; i < this.friendList.length; i++){
                if(this.friendList[i]._id == id){
                    return this.friendList[i].nickname
                }
            }
        },
        getTo(id){
            for(let i = 0; i < this.friendList.length; i++){
                if(this.friendList[i]._id == id){
                    return this.friendList[i]
                }
            }
        },
        enterPrivateChat(to){
            this.$bus.$emit('enterPage', {type:1, to})
            this.$store.commit('messageAbout/Reset_Message', to._id)
            this.$store.commit('friendAbout/Reset_Friend_hasNew', to._id)
            this.config.display = 'none'
        }
    }
}
</script>

<style lang="less" setup>
#messageList{
    background: #232429;
    position: fixed;
    width: 340px;
    border: 6px solid;
    border-image: linear-gradient(#63e984, #5c3cec) 20;
    display: none;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
    cursor: default;
    z-index: 1;
    left: 50%;
    top:50%;
    transform: translateX(-50%) translateY(-50%);
    .cancel{
        position: absolute;
        right: 15px;
        top: 15px;
        cursor: pointer;
        z-index: 1;
    }
    .avatar{
        position: absolute;
        left: 15px;
        top: 15px;
        border: 5px solid #232429;
        border-radius: 60%;
        height: 80px;
        img{
            position: relative;
            overflow: hidden;
            border-radius: 50%;
        }
        .online{
            background-color: #21A65A;
            height: 26px;
            width: 26px;        
            top: 55px;
            right: -5px;
            z-index: 1;
            position: absolute;
            border-radius: 50%;
            border: solid 6px #292A2E;
        }   
    }
    .detail-wrap{
        width: 100%;
        height: 500px;
        padding: 35px 16px 16px;
        background: linear-gradient(to bottom,rgb(17, 6, 17), 70%, rgb(39, 36, 192));
        flex-direction: column;
        overflow-y: scroll;
        .detail{
            font-size: 20px;
            border-radius: 15px;
            padding: 7px 12px 7px;
            background: #101316;
            width: 100%;
            font-size: 14px;
            color: white;
            .nickname{
                font-weight: 600;
            }
            .text{
                color: #BDBEC6;
            }
            .time{
                margin-left: 5px;
            }
            &:hover{
                background: #55585673;
                cursor: pointer;
            }
        }
    }
}
</style>