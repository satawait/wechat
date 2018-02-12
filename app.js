'use strict'

const Koa = require('koa')
const wechat = require('./wechat/g')

const config = {
    wechat: {
        appID: 'wx18d83a6f8e34b912',
        appSecret: 'd65138af6a8bf0d2bdc34f91658ab0bd',
        token: 'satawaitgithubcom'
    }
}

// 创建一个Koa对象表示web app本身:
const app = new Koa()

// 对于任何请求，app将调用该异步函数处理请求：
app.use(wechat(config))

// 在端口3100监听:
app.listen(3100)
console.log('app started at port 3100...')