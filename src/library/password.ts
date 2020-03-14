import * as bcrypt from 'bcryptjs';

export class Password {
    static hash(value: string, cost: number = 8) {
        return bcrypt.hashSync(value, cost);
    }

    static verify(value: string, hash: string) {
        return bcrypt.compareSync(value, hash);
    }
}
