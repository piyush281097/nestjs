import { Observable } from 'rxjs';
import { JwtService } from '@nestjs/jwt';
import { GetUserByEmailWithPassword } from '../user/dto/database/get-user-by-email.db-dto';
import { LoginRequestDto } from '../user/dto/request/login.request-dto';
import { UserService } from '../user/user.service';
export declare class AuthService {
    private usersService;
    private jwtService;
    constructor(usersService: UserService, jwtService: JwtService);
    validateUser(loginRequest: LoginRequestDto): Observable<GetUserByEmailWithPassword | null>;
    login(user: any): {
        access_token: string;
        user: any;
    };
}
