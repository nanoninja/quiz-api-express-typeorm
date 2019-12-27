import * as bcrypt from 'bcryptjs';

export class Password {

    static async hash(value: string): Promise<string> {
        return await bcrypt.hashSync(value, 8);
    }

    static async verify(value: string, hash: string): Promise<boolean> {
        return await bcrypt.compare(value, hash);
    }

}
