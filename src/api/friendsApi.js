import request from "@/utils/request";

const friends = {
    getFirendsList(){
        return request({
            url:'/sys/user/friend/list',
            method:"get",
            params:{}
        })
    },
    searchFriend(username){
        return request({
            url:'/sys/user/friend/search',
            method:'get',
            params:{
                username
            }
        })
    },
    addFriends(friendId){
        return request({
            url:'/sys/user/add',
            method:'post',
            params:{
                friendId
            }
        })
    },
    getNotifyList(){
        return request({
            url:'/sys/user/friend/notify',
            method:'get',
            params:{}
        })
    },
    consent(data){
        return request({
            url:'/sys/user/friend/request',
            method:'get',
            params:data
        })
    },
    //已读系统消息
    readMsg(){
        return request({
            url:'/sys/user/isread',
            method:'get',
            params:{}
        })
    },
    //分享土地给好友
    shareLand(data){
        return request({
            url:'/lms/work/account/share',
            method:'post',
            params:data
        })
    },
    //分享多块土地、文件夹给好友
    shareLands(data){
        return request({
            url:'/lms/work/account/shares',
            method:'post',
            params:data
        })
    },
    //将分享的土地添加到好友地图
    addLandToFm(data){
        return request({
            url:'lms/work/account/share/confirm',
            method:'post',
            params:data
        })
    },
}
export default friends;