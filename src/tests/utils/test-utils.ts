import supertest from "supertest";

export const createMockRequest = (app: any) => {
    return supertest(app);
};

export const mockResponse = () => {
    const res: any = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    res.send = jest.fn().mockReturnValue(res);
    res.setHeader = jest.fn().mockReturnValue(res);
    return res;
};

export const mockNext = jest.fn();

export const mockRequestObject = (overrides: any = {}) => ({
    id: "test-request-id",
    headers: {},
    body: {},
    query: {},
    params: {},
    user: undefined,
    ...overrides,
});
