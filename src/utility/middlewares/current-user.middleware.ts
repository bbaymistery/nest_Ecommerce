import { Injectable, NestMiddleware } from '@nestjs/common';
import { isArray } from 'class-validator';
import { NextFunction, Request, Response } from 'express';
import { verify } from 'jsonwebtoken';
import { UserEntity } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';


declare global {
    namespace Express {
        interface Request {
            currentUser?: UserEntity
        }
    }
}
interface JwtPayload {
    id: string
}

@Injectable()
export class CurrentUserMiddleware implements NestMiddleware {
    constructor(private readonly usersService: UsersService) { }

    async use(req: Request, res: Response, next: NextFunction) {
        const authHeader = req.headers.authorization || req.headers.Authorization;

        if (!authHeader || isArray(authHeader) || !authHeader.startsWith('Bearer')) {
            next()
        } else {
            const token = authHeader.split(' ')[1];

            const { id } = verify(token, process.env.JWT_ACCESS_TOKEN_SECRET as string) as JwtPayload;
            const currentUser = await this.usersService.findById(+id);
            req.currentUser = currentUser;
            next()

        }
    }
}
