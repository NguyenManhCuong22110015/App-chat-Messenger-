import express from 'express';
import initWebRoutes from './routes/web.js';
import configViewEngine from './configs/configViewEngine.js';
import 'dotenv/config';

let app = express();

configViewEngine(app)

initWebRoutes(app)


let port = process.env.PORT ;

app.listen(port , () => {
    console.log("App is running at the port " + port)
})