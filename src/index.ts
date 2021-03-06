import express from "express"
import { createServer } from "http"
import { Server } from "socket.io"
import cookie from 'cookie-session'
// import cors from 'cors'

const app = express()
// app.use(cors())
app.use(cookie({
    name: 'mySession',
    keys: ['id']
}))

const httpServer = createServer(app)
const io = new Server(httpServer, {
    cors: {
        origin: 'http://localhost:8080'
    }
})

io.on("connection", socket => {

    socket.join('main-room')

    socket.on('join-chat', (args: { socketID: string, name: string }) => {
        // io.to('main-room').emit('user-join', `${args.name} joined the chat room`)
        io.to('main-room').emit('user-join', `${args.name} joined the chat room`)
    })

    socket.on('send-msg', (args: { socketID: string, name: string, msg: string, time: string }) => {
        // socket.join('main-room')
        io.to('main-room').emit('output-msg', { name: args.name, msg: args.msg, time: args.time, socketID: args.socketID })
    })

})

httpServer.listen(3000, () => {
    console.log('Server is running')
})