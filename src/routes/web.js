import { Router } from "express";
import homePageController from "../controllers/homePageController.js";

let router = Router();

let initWebRoutes = (app) => {
    router.get('/', homePageController.getHomePage);
    router.get('/webhook', homePageController.getWebhook);
    router.post('/webhook', homePageController.postWebhook);
    return app.use('/', router);
}

export default initWebRoutes;


curl -X GET "localhost:3000/webhook?hub.verify_token=153OEJ6FIXRXBC0VRK3&hub.challenge=CHALLENGE_ACCEPTED&hub.mode=subscribe"
