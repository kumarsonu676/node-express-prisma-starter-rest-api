import jwt, { SignOptions } from "jsonwebtoken";
import appConfig from "../../config/app.config";

export interface TokenPayload {
    userId: string;
    username: string;
    roles: string[];
    email?: string;
}

export interface RefreshPayload extends TokenPayload {
    tokenId: string;
}

export interface TokenPair {
    accessToken: string;
    refreshToken: string;
    expiresIn: number;
    refreshExpiresIn: number;
}

export const generateTokens = (payload: TokenPayload): TokenPair => {
    const tokenId = crypto.randomUUID();
    const expiresIn = parseJwtExpiry(appConfig.jwt.expiresIn);
    const refreshExpiresIn = parseJwtExpiry(appConfig.jwt.refreshExpiresIn);

    const accessTokenOptions: SignOptions = {
        expiresIn: appConfig.jwt.expiresIn as jwt.SignOptions["expiresIn"],
    };
    if (appConfig.jwt.audience) accessTokenOptions.audience = appConfig.jwt.audience;
    if (appConfig.jwt.issuer) accessTokenOptions.issuer = appConfig.jwt.issuer;

    const accessToken = jwt.sign(payload, appConfig.jwt.secret, accessTokenOptions);

    const refreshPayload: RefreshPayload = { ...payload, tokenId };
    const refreshTokenOptions: SignOptions = {
        expiresIn: appConfig.jwt.refreshExpiresIn as jwt.SignOptions["expiresIn"],
    };
    if (appConfig.jwt.audience) refreshTokenOptions.audience = appConfig.jwt.audience;
    if (appConfig.jwt.issuer) refreshTokenOptions.issuer = appConfig.jwt.issuer;

    const refreshToken = jwt.sign(refreshPayload, appConfig.jwt.refreshSecret, refreshTokenOptions);

    return {
        accessToken,
        refreshToken,
        expiresIn,
        refreshExpiresIn,
    };
};

export const verifyAccessToken = (token: string): TokenPayload => {
    const options: jwt.VerifyOptions = {};
    if (appConfig.jwt.audience) options.audience = appConfig.jwt.audience;
    if (appConfig.jwt.issuer) options.issuer = appConfig.jwt.issuer;

    return jwt.verify(token, appConfig.jwt.secret, options) as TokenPayload;
};

export const verifyRefreshToken = (token: string): RefreshPayload => {
    const options: jwt.VerifyOptions = {};
    if (appConfig.jwt.audience) options.audience = appConfig.jwt.audience;
    if (appConfig.jwt.issuer) options.issuer = appConfig.jwt.issuer;

    return jwt.verify(token, appConfig.jwt.refreshSecret, options) as RefreshPayload;
};

export const decodeToken = (token: string): TokenPayload | null => {
    const decoded = jwt.decode(token);
    return decoded as TokenPayload | null;
};

function parseJwtExpiry(expiry: string): number {
    const match = expiry.match(/^(\d+)([dhms])$/);
    if (!match) return 3600;

    const value = parseInt(match[1], 10);
    const unit = match[2];

    const multipliers: Record<string, number> = {
        s: 1,
        m: 60,
        h: 3600,
        d: 86400,
    };

    return value * (multipliers[unit] || 1);
}
