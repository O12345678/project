import axios from 'axios'

export function request( url, data, config) {
    const instance = axios.create({
        baseURL: '/apis'
    })
    return instance.post(url, data, config)
}
export function testRequest( url, data, config) {
    const instance = axios.create({
        baseURL: '/testapis'
    })
    return instance.post(url, data, config)
}
























