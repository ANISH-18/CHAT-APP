import { IsEmail, IsNotEmpty } from "class-validator";

export class SignInUserDto{
    @IsNotEmpty({message: 'Email Is Required'})
    @IsEmail({}, {message: 'EMail must be valid email address'})
    email: string;

    @IsNotEmpty({message: "Password is requried"})
    password: string;
}