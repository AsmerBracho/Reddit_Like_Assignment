import request from "supertest";
import { expect } from "chai";
import { it, describe } from "mocha";
import { getApp } from "../src/app";

// describe the Test 
describe("My API Test", function () {
    // declre data to be test 
    var data = {
        title: "Integration Test",
        url: "http://integration.test/with/asmerbracho",
        user: 1
    };
    describe("Create Link service", () => {
        it("POST /links shoul post a new Link", (done) => {
            (async () => {
                // create an app 
                const app = await getApp();
                
                // use supertest to test full funcionality
                request(app)
                    .post('/links')
                    .send(data)
                    .end(function (err, res) {
                        expect(200)
                        expect(data.title).to.equal("Integration Test");
                        data = res.body;
                        done();
                    })
            })();
        });
    });
});