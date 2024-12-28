import { Router } from "express";
import homePageController from "../controllers/homePageController.js";

let router = Router();

let initWebRoutes = (app) => {
    router.get('/', homePageController.getHomePage);
    router.get('/webhook', homePageController.getWebhook);
    router.post('/webhook', homePageController.postWebhook);
    router.post('/set-up-profile', homePageController.handleSetupProfile);
    router.get("/setup-profile", homePageController.getSetupProfile);
    return app.use('/', router);
}

export default initWebRoutes;


