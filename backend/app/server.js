const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv').config();
const middleware = require('./middleware/is-auth');
const isAuth = require('./middleware/is-auth');
const routes = require('./routes/routes');

/**
 * Server
 * @Class
 */
class Server {
    constructor() {
        this.app = express()
    }

    /**
     * DataBase connect
     * @return {Object} connect
     */
    dbConnect() {
        const host = `${process.env.MONGO_URI}`
        const connect = mongoose.createConnection(host, { useNewUrlParser: true, useUnifiedTopology: true })

        connect.on('error', (err) => {
            setTimeout(() => {
                console.error(`[ERROR], api dbConnect() -> ${err}`);
                this.connect = this.dbConnect(host)
            }, 5000)
        }) 

        connect.on('disconnected', (err) => {
            setTimeout(() => {
                console.log(`[DISCONNECTED], api dbConnect() -> mongodb disconnected`);
                this.connect = this.dbConnect(host)
            }, 5000)
        }) 

        process.on('SIGINT', () => {
            connect.close(() => {
                console.log('[API END PROCESS] api dbConnect() -> close mongodb connection')
                process.exit(0)
            })
        }) 
        return connect
    }
    
    /**
     * isAuth
     */
    isAuth() {
        this.app.use(function(req, res, next){
            res.header('/posts', isAuth, routes)
            next();
        })
    }

    /**
     * Middleware
     */
    middleware() {
        this.app.use(cors())
        this.app.use(bodyParser.json())
        this.app.use(bodyParser.urlencoded({'extended': true}))
    }
    /**
     * Routes
     */
    routes() {
        this.app.use(function(req, res, next) {
            res.header("Access-Control-Allow-Origin", "*");
            res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
            next();
        });

        new routes.User(this.app, this.connect)
        new routes.Post(this.app, this.connect)
        
        this.app.use((req, res) => {
            res.status(404).json({
                code: 404,
                message: 'not found'
            })
        })
    }

    /**
     * Run
     */
    run() {
        try {
            this.connect = this.dbConnect()
            this.dbConnect()
            this.isAuth()
            this.middleware()
            this.routes()
            this.app.listen(8080)
            console.log(`listen on ${process.env.BASE_PORT}`);
            
        } catch(err) {
            console.log(`[ERROR] SERVER -> ${err}`)
        }
    }
}

module.exports = Server
