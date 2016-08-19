var http = require('http')

var server = http.createServer((req,resp)=>{
    
    console.log(`url:${req.url}`)

    var origin,host,path,options,headers =  Object.assign({},req.headers)
    
    //host后没有带路径
    var matchNoPath = req.url.match(/(https?:\/\/([^\/]*?))$/)
    var matchPath = req.url.match(/(https?:\/\/(.*?))(\/.*$)/)

    console.log(`matchPath:${matchPath},matchNoPath:${matchNoPath}`)

    if(matchNoPath){
        origin = matchNoPath[1]
        host = matchNoPath[2]
        path = '/'
    }
     
    else if(matchPath){
        origin = matchPath[1]
        host   = matchPath[2]
        path   = matchPath[3]

    }

    else{
        resp.end()
        return
    }
    

    headers = Object.assign({},req.headers)

    headers.referer && (headers.referer = origin)
    headers.origin  && (headers.origin = origin)

    headers.host = host 
       
    var options = {               
        hostname:host,
        port:80,
        method:req.method,
        path,
        headers
    } 
                                                
    var _req = http.request(options,_resp=>{
    
        resp.writeHead(_resp.statusCode,_resp.headers)
        _resp.on('data',chunk=>{
            resp.write(chunk)
        })
        _resp.on('end',()=>{
            resp.end()
        })
    })
    _req.on('error',e=>{
        
        //关闭请求

        _req.abort()

        resp.statusCode = 500
        resp.end()
        console.log(e)
    })

    _req.on('close',()=>{
    
        resp.end()
        //console.log('Closed!')
    })

    //POST请求，先获取请求数据，然后发送
    if(options.method==='POST'){
        //options已经写了headers,所以无需再设置headers
        req.on('data',chunk=>{
            _req.write(chunk)
        })

        req.on('end',()=>{
            //请求数据读取完成，转发请求
            _req.end()
        })
    }
    //GET或其他请求，直接发送
    else if(options.method==='GET')
        _req.end()
    else{

        _req.abort()
        resp.end()
    }

})

server.listen(80)
