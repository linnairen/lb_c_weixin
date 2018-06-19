import Vue from 'vue'
import Vuex from 'vuex'
import * as actions from './actions'
import * as getters from './getters'

Vue.use(Vuex)

// 应用初始状态
const state = {
    token: '',
    isOrdered: false,
    orderState: null,  //    状态 -3平台取消；-2商家取消；-1用户取消；0可抢单；1已被抢单未到达；2用户确认已到达；3平台自动确认结束；4商家确认结束；5延时中'
}

// 定义所需的 mutations
const mutations = {
    SETTOKEN(state,token){
        state.token = token
    },
    SETISORDERED(state,isOrdered){
        state.isOrdered = isOrdered
    },
    SETORDERSTATE(state,orderState){
        state.orderState = orderState
    }
}

// 创建 store 实例
export default new Vuex.Store({
    actions,
    getters,
    state,
    mutations
})