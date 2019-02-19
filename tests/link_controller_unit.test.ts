import * as express from "express";
import { expect } from "chai";
import { it, describe } from "mocha";
import { getHandlers } from "../src/backend/controllers/link_controller";
import { Link } from "../src/backend/entities/link";


describe("Link Controller", () => {

    it("Should be able to post a link", () => {

        const fakeRequest: any = {
            body: {
                id: 1,
                title: "This is a fake Link for Testing",
                url: "http://thi.is.a.fake.url/to.test/the.links", 
            }
        };

        // creates the fake link to be POST base in values got from the fakeRequest 
        const fakeLink: any =   {
            id: fakeRequest.id,
            title: fakeRequest.title,
            url: fakeRequest.url,
            user: (fakeRequest as any).userId, 
        };
        
        // creates a fakeResponse
        const fakeResponse: any = {
            json: (link: Link) =>
                expect(link).to.eq(fakeLink)
        };
        
        // fake repository with expect 
        const fakeRepository: any = {
            save: (link: Link) => {
                expect(link).to.eq(fakeLink);
                return Promise.resolve(fakeLink);
            }
        };

        const handlers = getHandlers(fakeRepository);
        handlers.createLinkHandler(fakeRequest, fakeResponse, fakeLink);
    });
});


