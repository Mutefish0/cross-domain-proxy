# cross-domain-proxy
请求代理，解决跨域、防盗链等问题

# 用法
`node proxy` 

```js
// 在主机 myhost.com 上运行 proxy 
var proxy = 'http://myhost.com/'
//要访问跨域资源及接口
var url = 'http://abc.com/get-new'

$.get('http://abc.com/get-news')  //跨域不能得到数据

//改为如下即可得到数据
$.get(proxy+url) 

// post 是一样的用法


```
