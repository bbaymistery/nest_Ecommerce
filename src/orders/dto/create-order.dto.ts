import { Type } from "class-transformer";
import { ValidateNested } from "class-validator";
import { CreateShippingDto } from "./create-shipping.dto";
import { OrderedProductsDto } from "./ordered-products.dto";

/**
 * CREATE ORDER DTO (Sipariş Oluşturma Veri Transfer Nesnesi)
 * 
 * Frontend / Postman'den sipariş oluşturulurken gelen JSON isteğinin 
 * yapısını ve doğrulamasını (Validation) kontrol eder.
 */
export class CreateOrderDto {

    /*
      @Type(() => CreateShippingDto):
      Gelen ham JSON nesnesini CreateShippingDto sınıf türüne dönüştürür (class-transformer).

      @ValidateNested():
      İç içe geçmiş (nested) nesnenin (shippingAddress) içindeki IsNotEmpty, IsString gibi 
      kuralların da çalışmasını sağlar.
    */
    @Type(() => CreateShippingDto)
    @ValidateNested()
    shippingAddress: CreateShippingDto;

    /*
      @Type(() => OrderedProductsDto):
      Gelen JSON dizisindeki (array) her bir elemanı OrderedProductsDto nesnesine dönüştürür.

      @ValidateNested({ each: true }):
      Dizi içerisindeki HER BİR ürün elemanı için (id, quantity, unit_price) 
      doğrulama kurallarının çalışmasını sağlar.
    */
    @Type(() => OrderedProductsDto)
    @ValidateNested({ each: true })
    orderedProducts: OrderedProductsDto[];
}

