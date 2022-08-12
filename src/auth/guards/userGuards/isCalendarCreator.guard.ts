import { Injectable, CanActivate, ExecutionContext, HttpException, HttpStatus } from "@nestjs/common";
import { Observable } from "rxjs";
import { AuthService } from "../../auth.service";

@Injectable()
export class IsCalendarCreatorGuard implements CanActivate {

    constructor(private authService: AuthService){}

    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        const request = context.switchToHttp().getRequest();
        
        const calendarId = request.params.calendarId;
        const user = request.user.userId;

        this.authService.verifyMongoIds([calendarId, user]);

        return this.authService.isCalendarCreator(user, calendarId);
    }    
}