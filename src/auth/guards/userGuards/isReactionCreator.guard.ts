import { Injectable, CanActivate, ExecutionContext } from "@nestjs/common";
import { Observable } from "rxjs";
import { AuthService } from "../../auth.service";

@Injectable()
export class IsReactionCreatorGuard implements CanActivate {

    constructor(private authService: AuthService){}

    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        const request = context.switchToHttp().getRequest();
        
        const reactionId = request.params.reactionId;
        const user = request.user.userId;

        this.authService.verifyMongoIds([reactionId, user]);

        return this.authService.isReactionCreator(user, reactionId);
    }    
}