const http = require('http')
const url = require('url')
const fs = require('fs')

const htmlfile = fs.readdirSync('./pages/', {withFileTypes: true}).map(file => file.name)
const cssfile = fs.readdirSync('./style/', {withFileTypes: true}).map(file => file.name)

let page404
fs.readFile('./pages/404.html', (err,data) => {
    page404 = data
})

let home = '/'

const server = http.createServer(function(req,res){
    let filename = req.url
    let requestedDir

    console.log(`requesting ${filename}`)

    filename = filename === home ? 'index': filename.substr(1)

    if(htmlfile.includes(filename + '.html')){
        console.log('requesting pages')
        filename += '.html'
        requestedDir = './pages/'

    }else if(cssfile.includes(filename)){
        console.log('requesting css')
        requestedDir = './style'
    }

    fs.readFile(requestedDir + filename, (err,data) => {
        if(err){
            res.writeHead(404, {'Content-type':'text/html'})
            res.write(page404)
            return res.end()
        }else if(requestedDir === './pages/'){
            console.log(req.url)
            res.writeHead(200, {'Content-type':'text/html'})
            res.write(data)
            return res.end()
        }else{
            res.writeHead(200, {'Content-type':'text/css'})
            res.write(data)
            return res.end()
        }
    })
})

server.listen(8080, () => {
    console.log('Running')
})