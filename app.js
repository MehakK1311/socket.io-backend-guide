const app = require('express')()
const http = require('http').Server(app)
const path = require('path')
const io = require('socket.io')(http)

app.get('/', (req,res)=>{
    const options={
        root: path.join(__dirname)
    }
    const fileName = 'index.html'
    res.sendFile(fileName, options)
})

io.on('connection', (socket)=>{
    console.log('user connected')

    setTimeout(()=>{

        socket.emit('myCustomEvent', {
            desc: 'Custom message from server'
        })

    }, 3000)

    socket.on('disconnect', ()=>{
        console.log('user disconnected')
    })
});

http.listen(3000, ()=>{
    console.log('app running')
})