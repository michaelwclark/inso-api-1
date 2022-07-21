import { Injectable, CanActivate, ExecutionContext } from "@nestjs/common";
import { Observable } from "rxjs";
import { UserController } from "src/modules/user/user.controller";
import { AuthService } from "../auth.service";

@Injectable()
export class IsCreatorGuard implements CanActivate {
    constructor(private authService: AuthService){}
    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        const request = context.switchToHttp().getRequest();
        //return validateRequest(request);
        
        //const parameter = request.params.discussionId;
        console.log(request);
        return this.authService.validateAuthor(request.user.username, request.params.discussionId);
    }    
}





            //***********************************************************//
function validateRequest(request: any): boolean | Promise<boolean> | Observable<boolean> {
    console.log(request.user);
    const user = this.userController.returnUser(request.user)
    return this.authService.validateAuthor(user);
}



// function validateAuthor(user: any, object: any){
//     if(user._id == object.createrId){
//         return true;
//     } else {
//         return false
//     }
// }
