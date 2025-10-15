import * as bcrypt from 'bcrypt';

export class AuthHelper {
    // Encode User Password
    async encodePassword(password: string) {
        const salt: string = bcrypt.genSaltSync(10);
        return bcrypt.hashSync(password, salt);
    }

    // Validate User's password
    async isPasswordValid(password: string, userPassword: string) {
        return bcrypt.compareSync(password, userPassword);
    }
}