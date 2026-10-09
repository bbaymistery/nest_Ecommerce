import { IsEnum, IsNotEmpty } from 'class-validator';
import { OrderStatus } from '../enums/oder-status.enum';

/**
 * UPDATE ORDER DTO (Sipariş Durumu Güncelleme DTO'su)
 * 
 * Admin yetkilisi siparişin durumunu (PROCESSING -> SHIPPED -> DELIVERED -> CANCELLED)
 * güncellemek istediğinde gönderilen veriyi doğrular.
 */
export class UpdateOrderDto {
  @IsNotEmpty({ message: 'Sipariş durumu boş olamaz.' })
  @IsEnum(OrderStatus, { message: 'Geçersiz sipariş durumu.' })
  status: OrderStatus;
}
