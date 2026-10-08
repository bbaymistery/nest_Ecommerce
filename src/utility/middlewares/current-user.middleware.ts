import { Injectable, NestMiddleware } from '@nestjs/common';
import { isArray } from 'class-validator';
import { NextFunction, Request, Response } from 'express';
import { verify } from 'jsonwebtoken';
import { UserEntity } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';

/**
 * Express Request arabirimine 'currentUser' özelliğini ekliyoruz.
 * Böylece req.currentUser diyerek oturum açan kullanıcıya her yerden erişebiliriz.
 */
//normalda rq.user yazardik budefe req.currentuzerin calismasi icin
//asagidakilari yazdik
declare global {
  namespace Express {
    interface Request {
      currentUser?: UserEntity;
    }
  }
}

interface JwtPayload {
  id: string;
}

@Injectable()
export class CurrentUserMiddleware implements NestMiddleware {
  constructor(private readonly usersService: UsersService) { }

  async use(req: Request, res: Response, next: NextFunction) {
    // 1. İsteğin başlığından (Headers) Authorization bilgisini alıyoruz
    const authHeader = req.headers.authorization || req.headers.Authorization;

    // 2. Eğer Token yoksa veya 'Bearer ' ile başlamıyorsa zinciri bozmadan devam et
    if (!authHeader || isArray(authHeader) || !authHeader.startsWith('Bearer ')) {
      req.currentUser = undefined;
      return next();
    }

    try {
      // 3. 'Bearer eyJhbGci...' ifadesinden sadece Token kısmını alıyoruz
      const token = authHeader.split(' ')[1];

      // 4. Token'ın şifresini çözüp içindeki id bilgisini çıkarıyoruz
      const { id } = verify(token, process.env.JWT_ACCESS_TOKEN_SECRET as string,) as JwtPayload;

      // 5. Veritabanından bu ID'ye sahip kullanıcıyı bulup req.currentUser'a yüklüyoruz
      const currentUser = await this.usersService.findById(+id);
      req.currentUser = currentUser;

      next();
    } catch (error) {
      // Token geçersizse veya süresi dolmuşsa hatayı yutup isteğin devam etmesine izin veriyoruz
      req.currentUser = undefined;
      next();
    }
  }
}
