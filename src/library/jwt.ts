import { sign, verify, SignCallback, VerifyCallback } from 'jsonwebtoken';
import { User } from '../entity/User';

export class JWT {

    /**
     * JWT secret sign key.
     */
    public static readonly SECRET_KEY = 'G@pLKDD#9rty3koFwP8E%5R2qg56yu54sf@glkdsf7!g7fc714xx%$D4190NvZeqS7d1e5&sDhnCK';

    /**
     * Sign the given payload into a JSON Web Token string.
     */
    static async sign(user: User, callback: SignCallback) {
        sign(
            {
                id: user.id,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName
            },
            JWT.SECRET_KEY,
            { algorithm: 'HS256', expiresIn: 240 },
            callback
        );
    }

    /**
     * Asynchronously verify given token using a secret or a public key to get a decoded token.
     */
    static async verify(token: string, callback: VerifyCallback) {
        verify(token, JWT.SECRET_KEY, callback);
    }
}
