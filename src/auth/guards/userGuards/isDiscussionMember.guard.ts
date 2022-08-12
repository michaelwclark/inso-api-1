import { Injectable, CanActivate, ExecutionContext, HttpException, HttpStatus } from "@nestjs/common";
import { Observable } from "rxjs";
import { AuthService } from "../../auth.service";

@Injectable()
export class IsDiscussionMemberGuard implements CanActivate {

    constructor(private authService: AuthService){}

    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        const request = context.switchToHttp().getRequest();
        
        const discussionId = request.params.discussionId;
        const user = request.user.userId;

        this.authService.verifyMongoIds([discussionId, user]);

        return this.authService.isDiscussionMember(user, discussionId);
    }    
}