/**
 * CCT 
 * Interactive Web Application 
 * 
 * Author: Asmer Bracho
 * Student number: 2016328  
 */

import "reflect-metadata";
import { getApp } from "./app";

(async () => {
    // define port number 
    const port = 8080;
    // create the App
    const app = await getApp();
    //start the server
    app.listen(port, () => {
        console.log('App listening on port 8080');
    });
})();