import { HttpException, HttpStatus } from "@nestjs/common";

/** validates the password for a new user meets all the required conditions to ensure password strength */
export function validatePassword(password: string){

    if(password.length < 8 || password.length > 32){
      throw new HttpException('Password length must be at least 8 characters and no more than 32', HttpStatus.BAD_REQUEST)
    }
  
    var checkStrength: boolean;
    var lowercaseRegexp = new RegExp('(?=.*[a-z])')
    var uppercaseRegexp = new RegExp('(?=.*[A-Z])')
    var numberRegexp = new RegExp('(?=.*[0-9])')
    var specialCharRegexp = new RegExp('(?=.*[^A-Za-z0-9])')
  
    checkStrength = lowercaseRegexp.test(password);
    if(checkStrength == false){ 
      throw new HttpException('Password must contain at least one lowercase character', HttpStatus.BAD_REQUEST)
    }
  
    checkStrength = uppercaseRegexp.test(password);
    if(checkStrength == false){ 
      throw new HttpException('Password must contain at least one uppercase character', HttpStatus.BAD_REQUEST)
    }
  
    checkStrength = numberRegexp.test(password);
    if(checkStrength == false){ 
      throw new HttpException('Password must contain at least one number', HttpStatus.BAD_REQUEST)
    }
  
    checkStrength = specialCharRegexp.test(password);
    if(checkStrength == false){ 
      throw new HttpException('Password must contain at least one special character', HttpStatus.BAD_REQUEST)
    }
  
  }