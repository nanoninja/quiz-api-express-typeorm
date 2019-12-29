import { sign, verify, SignCallback, VerifyCallback } from 'jsonwebtoken';
import { User } from '../entity/User';

export class JWT {

    public static readonly SECRET_KEY = 'sdf34@dsf5sdrzeuoPU3BS78R?SDKLSD5df58sdf6-SDF5jkfdkjsJH';

    /**
     * Sign the given payload into a JSON Web Token string.
     */
    async sign(user: User, callback: SignCallback) {
        sign(
            {
                id: user.id,
                email: user.email
            },
            JWT.SECRET_KEY,
            {
                algorithm: 'HS256',
                expiresIn: 30
            },
            callback
        );
    }

    /**
     * Asynchronously verify given token using a secret or a public key to get a decoded token.
     */
    async verify(token: string, callback: VerifyCallback) {
        verify(token, JWT.SECRET_KEY, callback);
    }
}
