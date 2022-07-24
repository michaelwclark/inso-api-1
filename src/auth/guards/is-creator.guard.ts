import { Injectable, CanActivate, ExecutionContext, HttpException, HttpStatus } from "@nestjs/common";
import { HttpErrorByCode } from "@nestjs/common/utils/http-error-by-code.util";
import { Observable } from "rxjs";
import { DiscussionController } from "src/modules/discussion/discussion.controller";
import { AuthService } from "../auth.service";

@Injectable()
export class IsCreatorGuard implements CanActivate {
    constructor(private authService: AuthService){}
    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        const request = context.switchToHttp().getRequest();
        
        const arr = [ 'discussion' ];
        if(!arr.includes(request.params.entity)){
            throw new HttpException('Invalid entity entry in parameter', HttpStatus.BAD_REQUEST);
        }

        return this.authService.validateAuthor(
            request.user.username, 
            request.params.entity, 
            request.params.discussionId
        );
    }    
}
