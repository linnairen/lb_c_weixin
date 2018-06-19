import Vue from 'vue'
import Router from 'vue-router'
import Index from '@p/index'
const Index_list = r => require.ensure([], () => r(require('@p/index/list.vue')), 'Index_list')


const Login = r => require.ensure([], () => r(require('@p/login.vue')), 'Login')
const Phone = r => require.ensure([], () => r(require('@p/login/phone.vue')), 'Phone')
const Sms = r => require.ensure([], () => r(require('@p/login/sms.vue')), 'Sms')


const releaseOrder = r => require.ensure([], () => r(require('@p/releaseOrder.vue')), 'releaseOrder')

const mapSearch = r => require.ensure([], () => r(require('@p/mapSearch.vue')), 'mapSearch')

const license = r => require.ensure([], () => r(require('@p/license.vue')), 'license')
const addCar = r => require.ensure([], () => r(require('@p/license/addCar.vue')), 'addCar')

const alipay = r => require.ensure([], () => r(require('@p/pay/aliPay.vue')), 'alipay')

Vue.use(Router)

export default new Router({
  routes: [
    {
        path: '/',
        redirect: '/index'
    },
    {
      	path: '/index',
      	component: Index,
        children: [
            {
                path: '/',
                name: 'index_list',
                component: Index_list
            }
        ]
    },
    {
    	path: '/login',
    	component: Login,
    	children: [
    		{
    			path: '/',
    			redirect: '/login/phone'
    		},
    		{
    			path: '/login/phone',
    			name: '输入手机号',
    			component: Phone
    		},
    		{
    			path: '/login/sms',
    			name: '输入验证码',
    			component: Sms
    		}
    	]
    },
    {
        path: '/mapSearch',
        name: '地图搜索',
        component: mapSearch
    },
    {
        path: '/releaseOrder',
        name: '发布订单',
        component: releaseOrder
    },
    {
        path: '/license',
        component: license,
        children: [
            {
                path: '/license/addCar',
                component: addCar,
                name: '添加车牌'
            }
        ]
    },
    {
        path: '/alipay',
        component: alipay,
        name: '支付宝支付'
    }
  ]
})
