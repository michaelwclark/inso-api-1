import { Injectable, CanActivate, ExecutionContext } from "@nestjs/common";
import { Observable } from "rxjs";
import { AuthService } from "../../auth.service";

@Injectable()
export class IsPostCreatorGuard implements CanActivate {

    constructor(private authService: AuthService){}

    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        const request = context.switchToHttp().getRequest();
        
        const postId = request.params.postId;
        const user = request.user.userId;

        this.authService.verifyMongoIds([postId, user]);

        return this.authService.isPostCreator(user, postId);
    }    
}