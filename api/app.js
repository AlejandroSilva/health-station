import express from 'express'
import bodyParser from 'body-parser'
import morgan from 'morgan'
import { appConfig } from '../config'
let app = express()

/**
 * Middlewares
 */
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({
    extended: false
}))
// parse application/json
app.use(bodyParser.json());
app.use(morgan('combined'));

/**
 * Routes
 */
app.get('/', (req, res)=>{
    res.send(`hello, this is a Toth Health Station ${appConfig.version}.`)
})

import v1 from './v1'
app.use('/v1/', v1)

/*
 * Middlewares
 */
import errorsHandler  from './middlewares/errorsHandler.js'
app.use(errorsHandler)

export default app;

// ....