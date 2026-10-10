import { NestInterceptor, ExecutionContext, CallHandler, UseInterceptors } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export function SerializeIncludes(dto: any) {
  return UseInterceptors(new SerializeInterceptor(dto))
}
export class SerializeInterceptor<T> implements NestInterceptor<T, unknown> {
  constructor(private dto: any) {

  }
  intercept(context: ExecutionContext, next: CallHandler<T>): Observable<unknown> {
    console.log('Before...');
    const now = Date.now();

    // 1. next.handle(): Controller fonksiyonunun (route handler) çalıştırılmasını başlatır.
    // 2. .pipe(...): RxJS'in yanıt akışına (response stream) müdahale etmek için boru hattı açar.
    return next.handle().pipe(
      // 3. map((data: unknown) => ...): Controller'dan dönen HAM VERİYİ (data) yakalar.
      map((data: unknown) => {
        // İsteğin başından sonuna kadar kaç milisaniye geçtiğini hesaplayıp terminale yazdırır.
        console.log(`After... ${Date.now() - now}ms`);

        // PlainToClass (ya da plainToInstance): 
        // Veritabanından gelen ham nesneyi (data), hedef DTO sınıfının (this.dto) kurallarına göre dönüştürür.
        // - Entity/Veritabanı sadece ham veriyi sağlar.
        // - DTO ise bu verinin hangilerinin gösterileceğini (@Expose) ve alan adlarını belirler.
        return plainToClass(this.dto, data, { 
          // excludeExtraneousValues: true -> DTO'da @Expose() yazılmayan TÜM gereksiz/gizli kolonları süzüp temizler.
          excludeExtraneousValues: true,

          // exposeUnsetFields: true -> Değeri undefined olan alanların yanıtta görünmesini engeller.
          exposeUnsetFields: true 
        });
      }),
    );
  }
}
