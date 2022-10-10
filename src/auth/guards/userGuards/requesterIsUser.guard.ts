import { Injectable, CanActivate, ExecutionContext } from "@nestjs/common";
import { Observable } from "rxjs";
import { AuthService } from "../../auth.service";

@Injectable()
export class RequesterIsUserGuard implements CanActivate {

    constructor(private authService: AuthService){}

    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        const request = context.switchToHttp().getRequest();
        
        const userId = request.params.userId;
        const user = request.user.userId;

        this.authService.verifyMongoIds([userId, user]);

        return userId === user;
    }    
}