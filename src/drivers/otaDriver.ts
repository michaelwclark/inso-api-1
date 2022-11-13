import { HttpException, HttpStatus } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import environment from 'src/environment';

export interface otaCode {
  code: string;
}

export interface decodedOtaCode {
  data: any;
  action: string;
  iat: string;
  exp: string;
  iss: string;
}

export function generateCode(payload: any) {
  return new Promise<otaCode>((resolve, reject) => {
    jwt.sign(
      {
        data: payload,
      },
      environment.OTA_SECRET,
      {
        expiresIn: '1h',
      },
      (err: any, token: any) => {
        if (err) {
          reject(err);
        }
        const code = token.replace(
          environment.OTA_CODE_REPLACER,
          environment.TOKEN_REPLACEMENT,
        );
        resolve({ code });
      },
    );
  });
}

export function decodeOta(ota: string): Promise<decodedOtaCode> {
  const code = ota.replace(
    environment.OTA_CODE_REPLACER,
    environment.TOKEN_REPLACEMENT,
  );
  return new Promise((resolve) => {
    jwt.verify(code, environment.OTA_SECRET, (err: any, decoded: any) => {
      if (err) {
        throw new HttpException(
          'The OTA code is invalid or expired',
          HttpStatus.UNAUTHORIZED,
        );
      } else {
        resolve(decoded as decodedOtaCode);
      }
    });
  });
}
