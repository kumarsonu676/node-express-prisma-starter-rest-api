import "reflect-metadata";

jest.setTimeout(10000);

beforeAll(() => {
    process.env.NODE_ENV = "test";
    process.env.JWT_SECRET = "test-jwt-secret-key-for-testing-minimum-32-chars";
    process.env.JWT_REFRESH_SECRET = "test-jwt-refresh-secret-key-for-testing-minimum-32";
    process.env.DATABASE_URL = "postgresql://test:test@localhost:5432/test";
});

afterAll(() => {
    jest.clearAllMocks();
});

jest.mock("../src/utils/logger", () => ({
    logger: {
        info: jest.fn(),
        warn: jest.fn(),
        error: jest.fn(),
        debug: jest.fn(),
    },
}));
