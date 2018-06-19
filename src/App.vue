<template>
    <div id="app">
        <transition name="scroll">
            <router-view @changeShow="changeShow" />
        </transition>
        
        <keep-alive><links v-show="showLink" /></keep-alive>
        <keep-alive><common-confirm /></keep-alive>
    </div>
</template>

<script>
require('./common/js/rem.js')
import { mapActions } from 'vuex'
import commonConfirm from '@c/common_confirm.vue'
import token from './common/js/token.js'
import links from '@c/main_nav.vue'
export default {
    name: 'app',
    data () {
        return {
            showLink: true
        }
    },
    created () {
        console.log('%c你发现了不得了的东西','color:transparent;font-size:24px;background:linear-gradient(to right,#00f,#ff0);background-size:100%;-webkit-background-clip:text;)')
        let that = this
        token.getToken(function (d) {
            that.passToken(d.token)
        })
    },
    components: {
        links,
        commonConfirm
    },
    methods: {
        changeShow (val) {
            this.showLink = val
        },
        ...mapActions([
            'passToken'
        ])
    }
}
</script>

<style>
*{
    margin: 0;
    padding: 0;
    letter-spacing: 0;
    user-select: none;
}
body{
    font-size: 0.16rem;
    font-family: 'PingFangSC-Regular 微软雅黑';
    color: #444;
    background: #f1f1f1;
}
li{
    list-style: none;
}
a{
    text-decoration: none;
    color: #444444;
}
input,button,textarea{
    outline: none;
}
b{
    font-weight: normal;
    font-family: 'PingFangSC-Medium';
}
.scroll-enter-active, .scroll-leave-active {
    transition: opacity .5s
}
.scroll-enter, .scroll-leave-to /* .scroll-leave-active in below version 2.1.8 */ {
    opacity: 0;
    transform: translateX(100vw)
}
</style>

