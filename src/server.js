import express from 'express';
import initWebRoutes from './routes/web.js';
import configViewEngine from './configs/configViewEngine.js';
import 'dotenv/config';
import bodyParser from 'body-parser';
let app = express();


app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: true }));


configViewEngine(app)

initWebRoutes(app)




let port = process.env.PORT ;

app.listen(port , () => {
    console.log("App is running at the port " + port)
})