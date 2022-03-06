const Article = require('../models/Article');
const {getMatureContent} = require("./articles");

const mockResponse = () => {
    const res = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
};

let mockArticle = {
    "dataValues": {
        "slug": "test-article",
        "title": "Test Article",
        "description": "test article description",
        "body": "MATURE CONTENT",
        "isMatureContent": true,
        "createdAt": "2022-03-06T18:38:50.005Z",
        "updatedAt": "2022-03-06T18:38:50.005Z",
        "UserEmail": "admin@admin.pl",
        "Tags": [{name: 'aaa'}, {name: 'bbb'}],
        "User": {
            "email": "placeholder@email.com",
            "username": "testUser",
            "bio": null,
            "image": null,
        }
    }
}

let mockSanitizedArticle = {
    "dataValues": {
        "slug": "test-article",
        "title": "Test Article",
        "description": "test article description",
        "body": "MATURE CONTENT",
        "isMatureContent": true,
        "createdAt": "2022-03-06T18:38:50.005Z",
        "updatedAt": "2022-03-06T18:38:50.005Z",
        "UserEmail": "admin@admin.pl",
        "tagList": ['aaa', 'bbb'],
        "author": {
            "username": "testUser",
            "email": "placeholder@email.com",
            "bio": null,
            "image": null
        }
    }
}

const clone = (obj) => {
    return JSON.parse(JSON.stringify(obj));
}

describe('./articles -> getMatureContent', () => {

    let articleFindAllSpy = jest.spyOn(Article, 'findAll');

    describe('when findAll returns proper values', () => {

        it('should return 200 status', async () => {
            articleFindAllSpy.mockReturnValueOnce(Promise.resolve([]));
            const req = {};
            const res = mockResponse();
            await getMatureContent(req, res);
            expect(res.status).toHaveBeenCalledWith(200);
        });

        it('should sanitize article', async () => {
            articleFindAllSpy.mockReturnValueOnce(Promise.resolve([clone(mockArticle)]));
            const req = {};
            const res = mockResponse();
            await getMatureContent(req, res);
            expect(res.json).toHaveBeenCalledWith({articles: [mockSanitizedArticle]});
        });

        it('should sanitize every article', async () => {
            const sampleArticles = [clone(mockArticle), clone(mockArticle), clone(mockArticle)];
            const expectedSanitizedArticles = [mockSanitizedArticle, mockSanitizedArticle, mockSanitizedArticle]
            articleFindAllSpy.mockReturnValueOnce(Promise.resolve(sampleArticles));
            const req = {};
            const res = mockResponse();
            await getMatureContent(req, res);
            expect(res.json).toHaveBeenCalledWith({articles: expectedSanitizedArticles});
            expect(sampleArticles.length).toBe(expectedSanitizedArticles.length);
        });

    })

    describe('when findAll throws error', () => {

        const mockErrorMessage = "mock error message";

        beforeEach(() => {
            articleFindAllSpy.mockReturnValue(Promise.reject({message: mockErrorMessage}));
        })

        it('should return 422 error status', async () => {
            const req = {};
            const res = mockResponse();
            await getMatureContent(req, res);
            expect(res.status).toHaveBeenCalledTimes(1);
            expect(res.status).toHaveBeenCalledWith(422);
        });

        it('should return error message', async () => {
            const req = {};
            const res = mockResponse();
            await getMatureContent(req, res);
            expect(res.json).toHaveBeenCalledTimes(1);
            expect(res.json).toHaveBeenCalledWith({
                errors: {
                    "body": [
                        "Could not get mature content ",
                        mockErrorMessage,
                    ],

                }
            })
        });

    })


})

