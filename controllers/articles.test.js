const Article = require('../models/Article');
const {getMatureContent} = require("./articles");

const mockResponse = () => {
    const res = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
};


describe('./articles -> getMatureContent', () => {

    let spy = jest.spyOn(Article, 'findAll');

    describe('when findAll returns proper values', () => {

        const mockArticleInput = {
            "dataValues": {
                "slug": "-",
                "title": "1",
                "description": "aaa",
                "body": "content",
                "isMatureContent": true,
                "UserEmail": "admin@admin.pl",
                "Tags": [],
                "User": {
                    "dataValues": {
                        "email": "admin@admin.pl",
                        "username": "admin",
                        "bio": null,
                        "image": null
                    }
                }
            }
        }

        const mockArticleOutput =
            {
                dataValues: {
                    slug: '-',
                    title: '1',
                    description: 'aaa',
                    body: 'content',
                    isMatureContent: true,
                    UserEmail: 'admin@admin.pl',
                    tagList: [],
                    author: {
                        "bio": undefined,
                        "email": undefined,
                        "image": undefined,
                        "username": undefined,
                    }
                }
            }


        it('should return empty array for empty findAll', async () => {
            spy.mockReturnValueOnce(Promise.resolve([]));
            const req = {};
            const res = mockResponse();
            await getMatureContent(req, res);
            expect(res.json).toBeCalledTimes(1);
            expect(res.json).toBeCalledWith({"articles": []})
        })

        it('should sanitize output', async () => {
            spy.mockReturnValueOnce(Promise.resolve([mockArticleInput]));
            const req = {};
            const res = mockResponse();
            await getMatureContent(req, res);
            expect(res.json).toBeCalledTimes(1);
            expect(res.json).toBeCalledWith({"articles": [mockArticleOutput]})
        })

    })

    describe('when findAll throws error', () => {

        const mockErrorMessage = "mock error message";

        beforeEach(() => {
            spy.mockReturnValue(Promise.reject({message: mockErrorMessage}));
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

