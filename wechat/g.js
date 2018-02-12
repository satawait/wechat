'use strict'

const sha1 = require('sha1')
const prefix = 'https://api.weixin.qq.com/cgi-bin/'
const api = {
    accessToken: prefix + 'token?grant_type=client_credential'
}

async function Wechat(opts) {
    let that = this
    this.appID = opts.appID
    this.appSecret = opts.appSecret
    this.getAccessToken = opts.getAccessToken
    this.saveAccessToken = opts.saveAccessToken

    let data = await this.getAccessToken()
    try {
        data = JSON.parse(data)
    } catch (e) {
        return that.updateAccessToken()
    }
    if (that.isValidAccessToken(data)) {
        await data;
    } else {
        return that.updateAccessToken()
    }

    let access_token = await data.access_token
    let expire_in = await data.expire_in
    let now = new Date().getTime()

    return now < expire_in

    that.saveAccessToken(data)
}

Wechat.prototype.updateAccessToken = async() => {
    let appID = this.appID
    let appSecret = this.appSecret

    let url = api.accessToken + '&appid=' + appID + '&secret' + appSecret
    let response = await request({ url: url, json: true })
    let data = response[1]
    let now = new Date().getTime()
    let expire_in = now + (data.expire_in - 20) * 1000
}

module.exports = opts =>
    async(ctx, next) => {
        await next()
        let query = ctx.request.query
        console.log('query', query)
        let token = opts.wechat.token
        let signature = query.signature
        let timestamp = query.timestamp
        let nonce = query.nonce
        let echostr = query.echostr
        let str = [token, timestamp, nonce].sort().join('')
        console.log('str', str)
        let sha = sha1(str)
        console.log('sha', sha)

        if (signature === sha) {
            ctx.response.body = echostr + ''
        } else {
            ctx.response.type = 'text/html';
            ctx.response.body = '<h1>wrong!</h1>';
        }
    }