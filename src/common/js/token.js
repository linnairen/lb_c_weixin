import axios from 'axios'
const des = require('./des.js')
const urlList = {
    getParks: '/skyparksearch/parkSearch/get',
    aliPay: '/skypark/pay/aliPayMobile',
    login: '/skyauth/oauth/login.shtml',
    getParkList: '/skymap/parkClassify/list',
    getParkInfo: '/skymap/parkClassify/detail',
    getSms: '/skyauth/sms/send.shtml',
    getPay: '/skymap/parkOrder/findAppointmentMoney',
    getThree: '/skyparksearch/parkSearch/getThreePark',
    getRec: '/skymap/parkOrganization/recommendPark',
    getOpen: '/skymap/city/getStartParkMap',
    getSearch: '/skymap/parkOrganization/getSearchParkOrg',
    getCar: '/skymap/userCar/getUserCarInfo',
    addCar: '/skymap/userCar/insertPlateNo',
    saveOrder: '/skymap/parkOrder/send',
    searchOrderOn: '/skymap/parkOrder/getGoingOderNo',
    addThanks: '/skymap/parkOrder/addThankFee'
}
const clientType = {
    Android: 2, 
    IOS: 3, 
    WindowsPhone: 4, 
    web: 5,
    pc: 6
}

const links = {
    produce: 'http://192.168.11.170',
    // test: 'http://192.168.11.110',
    // pay: 'http://192.168.11.160',
    // finalL: 'http://auth.cheweiditu.com',
    // finalS: 'http://s.cheweiditu.com',
    // finalM: 'http://manager.cheweiditu.com'
}

const nowLinks = links.produce
const path = {
    logPath: nowLinks + ':8001',
    search: nowLinks + ':8013',
    map: nowLinks + ':8009',
    outPath: nowLinks + ':8003',
    alipay: links.pay + ':8002',
    test: links.test + ':8001'
}

// const nowLinks = links.finalL
// const path = {
//     logPath: links.finalL,
//     search: links.finalS,
//     outPath: links.finalM
// }

axios.defaults.headers.post['Content-Type'] = 'application/json';

const getToken = (fun,err) => {//获取token
    let type = ''
    if(navigator.userAgent.toLocaleLowerCase().indexOf('android') != -1){
        type = clientType.Android
    }
    else if(navigator.userAgent.toLocaleLowerCase().indexOf('iphone') != -1){
        type = clientType.IOS
    }
    else{
        type = clientType.pc
    }
    // alert(unescape(localStorage.getItem('skytkn')))
    if(location.hash.indexOf('skytkn') != -1){
        let cookie = location.hash
        let start = cookie.indexOf('skytkn')+7
        let end = cookie.indexOf('&',start)
        if(end == -1){
            end = cookie.length
        }
        localStorage.setItem('skytkn',unescape(cookie.substring(start,end)))
        fun({
            token: unescape(cookie.substring(start,end))
        })
        return
    }
    if(localStorage.getItem('skytkn')){
        axios({
            baseURL: path.logPath,
            headers: { 'skytkn': unescape(localStorage.getItem('skytkn')) },
            url: '/skyauth/token/get.shtml?clientType=' + type,
            method: 'get',
        }).then(function(d){
            // console.log(d)
            if(d.data.code == 200){
                fun(d.data.rs)
                if(d.data.rs.state == -1 || d.data.rs.state == 0){
                    localStorage.setItem('skytkn',d.data.rs.token)
                }
            }
            else{
                err && err(d.data)
            }
        })
        // fun({
        //     token: unescape(localStorage.getItem('skytkn'))
        // })
    }
    else{
        axios({
            baseURL: path.logPath,
            url: '/skyauth/token/get.shtml?clientType=' + type,
            method: 'get',
        }).then(function(d){
            // console.log(d)
            if(d.data.code == 200){
                fun(d.data.rs)
                if(d.data.rs.state == -1 || d.data.rs.state == 0){
                    localStorage.setItem('skytkn',d.data.rs.token)
                }
            }
            else{
                err && err(d.data)
            }
        })
    }
    
}

const getParks = (token,data,fun,err) => {
    axios({
        baseURL: path.search,
        headers: {
            'skytkn': token
        },
        url: urlList.getParks,
        method: 'get',
        params: data
    }).then(function(d){
        fun && fun(d.data)
    },function(e){
        err && err(e)
    })
}

const getThree = (token,data,fun,err) => {
    axios({
        baseURL: path.map,
        headers: {
            'skytkn': token
        },
        url: urlList.getThree,
        method: 'get',
        params: data
    }).then(function(d){
        fun && fun(d.data)
    },function(e){
        err && err(e)
    })
}

const getSearch = (token,data,fun,err) => {
    axios({
        baseURL: path.map,
        headers: {
            'skytkn': token
        },
        url: urlList.getSearch,
        method: 'get',
        params: data
    }).then(function(d){
        fun && fun(d.data)
    },function(e){
        err && err(e)
    })
}

const getRec = (token,data,fun,err) => {
    axios({
        baseURL: path.map,
        headers: {
            'skytkn': token
        },
        url: urlList.getRec,
        method: 'get',
        params: data
    }).then(function(d){
        fun && fun(d.data)
    },function(e){
        err && err(e)
    })
}

const getParkList = (token,fun,err) => {
    axios({
        baseURL: path.map,
        headers: {
            'skytkn': token
        },
        url: urlList.getParkList,
        method: 'get'
    }).then(function(d){
        fun && fun(d.data)
    },function(e){
        err && err(e)
    })
}

const getCar = (token,fun,err) => {
    axios({
        baseURL: path.map,
        headers: {
            'skytkn': token
        },
        url: urlList.getCar,
        method: 'get'
    }).then(function(d){
        fun && fun(d.data)
    },function(e){
        err && err(e)
    })
}

const addCar = (token,data,fun,err) => {
    axios({
        baseURL: path.map,
        headers: {
            'skytkn': token
        },
        url: urlList.addCar,
        method: 'post',
        data: data
    }).then(function(d){
        fun && fun(d.data)
    },function(e){
        err && err(e)
    })
}

const getParkInfo = (token,data,fun,err) => {
    axios({
        baseURL: path.map,
        headers: {
            'skytkn': token
        },
        url: urlList.getParkInfo,
        method: 'get',
        params: data
    }).then(function(d){
        fun && fun(d.data)
    },function(e){
        err && err(e)
    })
}

const getPay = (token,data,fun,err) => {
    axios({
        baseURL: path.map,
        headers: {
            'skytkn': token
        },
        url: urlList.getPay,
        method: 'get',
        params: data
    }).then(function(d){
        fun && fun(d.data)
    },function(e){
        err && err(e)
    })
}

const getOpen = (token,fun,err) => {
    axios({
        baseURL: path.map,
        headers: {
            'skytkn': token
        },
        url: urlList.getOpen,
        method: 'get',
    }).then(function(d){
        fun && fun(d.data)
    },function(e){
        err && err(e)
    })
}

const saveOrder = (token,data,fun,err) => {
    axios({
        baseURL: path.map,
        headers: {
            'skytkn': token
        },
        url: urlList.saveOrder,
        method: 'get',
        params: data
    }).then(function(d){
        fun && fun(d.data)
    },function(e){
        err && err(e)
    })
}

const addThanks = (token,data,fun,err) => {
    axios({
        baseURL: path.map,
        headers: {
            'skytkn': token
        },
        url: urlList.addThanks,
        method: 'post',
        data: data
    }).then(function(d){
        fun && fun(d.data)
    },function(e){
        err && err(e)
    })
}

const searchOrderOn = (token,fun,err) => {
    axios({
        baseURL: path.map,
        headers: {
            'skytkn': token
        },
        url: urlList.searchOrderOn,
        method: 'get'
    }).then(function(d){
        fun && fun(d.data)
    },function(e){
        err && err(e)
    })
}

const alipay = (token,data,fun,err) => {
    axios({
        baseURL: path.alipay,
        headers: {
            'skytkn': token
        },
        url: urlList.aliPay,
        method: 'get',
        params: data
    }).then(function(d){
        fun(d)
    })
}

const getSms = (token,data,fun,err) => {
    console.log(des.des.encrypt(token + new Date()))
    axios({
        baseURL: path.logPath,
        headers: {
            'skytkn': token,
            'skytknAnn': des.des.encrypt(token + new Date())
        },
        url: urlList.getSms,
        method: 'post',
        params: data
    }).then(function(d){
        fun && fun(d.data)
    },function(e){
        err && err(e)
    })
}

const login = (token,data,fun,err) => {
    axios({
        baseURL: path.logPath,
        headers: {
            'skytkn': token
        },
        url: urlList.login,
        method: 'post',
        params: data
    }).then(function(d){
        fun && fun(d.data)
    },function(e){
        err && err(e)
    })
}

export default { 
	getToken,
    getParks,
    alipay,
    login,
    getParkList,
    getParkInfo,
    getPay,
    getSms,
    getThree,
    getRec,
    getOpen,
    getSearch,
    getCar,
    addCar,
    saveOrder,
    searchOrderOn,
    addThanks
}