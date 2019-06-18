const baseUrl = 'http://www.baidu.com';
const timeoutSeconds = 30; // 网络超时

export default class HTTPUtil{
    // POST方法
    static async post(url, params){
        let requestUrl = baseUrl + url;
        const user = await Store.get('user');
        let token = user.token;
        console.log('post requestUrl:',requestUrl);
        console.log('token:',token);
        console.log('params:',params);
        let header = {
            'device': 'app',
            'Content-Type': 'application/x-www-form-urlencoded',
            'token':token
        };
        const body = this.parsePostParams(params);
        let p1 = new Promise((resolve,reject)=>{
            fetch(requestUrl,{
                method:'POST',
                // 请求头参数
                headers: header,
                // 请求参数
                body:body,
            }).then((response)=>{
                return response.json()
            }).then((responseJson)=>{
                // 拿到数据可以在此同意处理服务器返回的信息
                console.log('responseData:',responseJson);
                resolve(responseJson);
            }).catch((error)=>{
                console.log('requestError:',error);
                reject(error);
            });
        });
        let p2 = this.requestTimeout();
        /// 因为fetch网络请求没有超时时间设置，所以使用Promise实现请求超时
        return Promise.race([p1,p2])
    }

    // Get方法
    static async get(url,params){
        let requestUrl = baseUrl + url;
        const user = await Store.get('user');
        let token = user.token;
        console.log('requestParams:',params);
        console.log('token',token);
        if (params) {
            let paramsArray = [];
            //拼接参数
            Object.keys(params).forEach(key => paramsArray.push(key + '=' + params[key]))
            if (requestUrl.search(/\?/) === -1) {
                requestUrl += '?' + paramsArray.join('&')
            } else {
                requestUrl += '&' + paramsArray.join('&')
            }
        }
        console.log('get requestUrl:',requestUrl);
        let p1= new Promise((resolve,reject)=>{
            fetch(requestUrl,{
                method: "GET",
                headers: {
                    'token': token,
                    'device': 'app'
                }})
                .then((response)=>{
                    console.log(response);
                    return response.json();
                })
                .then((responseJson)=>{
                    // 拿到数据可以在此同意处理服务器返回的信息
                    console.log('responseData:',responseJson);
                    resolve(responseJson);
                })
                .catch((error)=>{
                    console.log('requestError:',error);
                    reject(error);
                })
        });
        let p2 = this.requestTimeout();
        return Promise.race([p1,p2]);
    }

    // upload方法
    static async upload(url, params){
        const user = await Store.get('user');
        let token = user.token;
        let requestUrl = baseUrl + url;
        let header = {
            'device': 'app',
            'Content-Type': 'multipart/form-data',
            'token':token,
        };
        let p1 = new Promise((resolve,reject)=>{
            fetch(requestUrl,{
                method:'POST',
                ///请求头参数
                headers: header,
                /// 请求参数
                body: params,
            }).then((response)=>{
                console.log(response)
                return response.json();
            }).then((responseJson)=>{
                // 拿到数据可以在此同意处理服务器返回的信息
                console.log('responseData:',responseJson);
                resolve(responseJson);
            }).catch((error)=>{
                console.log('requestError:',error);
                reject(error);
            });
        });
        let p2 = this.requestTimeout();
        /// 因为fetch网络请求没有超时时间设置，所以使用Promise实现请求超时
        return Promise.race([p1,p2])
    }

    // 设置超时的方法
    static requestTimeout(){
        return new Promise((resolve,reject)=>{
            setTimeout(()=>{
                reject('链接超时');
            },timeoutSeconds * 1000)
        })
    }

    // 解析post方法的参数
    static parsePostParams(data){
        let ret = '';
        for (let it in data) {
            ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
        }
        return ret;
    }
}