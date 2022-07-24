import { Injectable, CanActivate, ExecutionContext, HttpException, HttpStatus } from "@nestjs/common";
import { Observable } from "rxjs";
import { AuthService } from "../../auth.service";

@Injectable()
export class IsScoreCreatorGuard implements CanActivate {

    constructor(private authService: AuthService){}

    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        const request = context.switchToHttp().getRequest();
        
        const scoreId = request.params.scoreId;
        const user = request.user.userId;

        this.authService.verifyMongoIds([scoreId, user]);

        return this.authService.isScoreCreator(user, scoreId);
    }    
}