import { sign, verify, SignOptions } from 'jsonwebtoken';
import { User } from '../entity/User';

export class JWT {

    /**
     * JWT secret sign key.
     */
    public static readonly SECRET_KEY = 'G@pLKDDYux#9rty3koFwP8E%5R2qg56yu54sf@glkdsf7!g7fc714xx%$D4190NvZeqS7d1e5&sDh8nCK';

    /**
     * Sign the given payload into a JSON Web Token string.
     */
    static async sign(user: User): Promise<string> {
        const options: SignOptions = { algorithm: 'HS256', expiresIn: 380 };
        const payload = {
            id: user.id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName
        };

        return sign(payload, JWT.SECRET_KEY, options);
    }

    /**
     * Asynchronously verify given token using a secret or a public key to get a decoded token.
     */
    static async verify(token: string): Promise<object | string> {
        return verify(token, JWT.SECRET_KEY);
    }
}
