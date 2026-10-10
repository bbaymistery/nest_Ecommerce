import { Expose, Transform, Type } from "class-transformer";

export class ProductDto {
    @Expose()
    totalProducts: number;

    @Expose()
    limit: number;

    // 🔴 DÜZELTME 1: Dizi (Array) olan nested objelerin DTO dönüşümü için @Type() şarttır!
    // class-transformer 'products' dizisi içindeki her bir elemanı ProductList sınıfına dönüştüreceğini bu dekoratör ile anlar.
    @Type(() => ProductList)
    @Expose()
    products: ProductList[];
}

// http://localhost:3000/api/v1/products/all?minRating=2&maxRating=5&limit=2 bura req edende 
/*
     "products_id": 3,
        "products_title": "Home esyasi salamlar ",
        "products_description": "texxt text text tex",
        "products_price": "22.00",
        "products_stock": 3,
        "products_images": "image 2233,image 111",
        "products_createdAt": "2026-10-08T10:15:06.679Z",
        "products_updatedAt": "2026-10-09T17:21:59.603Z",
        "products_addedById": 7,
        "products_categoryId": 8,
        "category_id": 8,
        "category_title": "Home",
        "category_description": "Category 3",
        "category_is_active": true,
        "category_createdAt": "2026-10-08T05:51:02.902Z",
        "category_updatedAt": "2026-10-08T05:51:02.902Z",
        "category_addedById": 7,
        "reviewcount": "1",
        "avgrating": "4.00"
*/

//yuxardaki kimi gelirdi datalar 
//asagidaki sekilde onu  ⬇️  yazarag gelen datanin product_id ni id ye ceviririk

//ve buda interseptorun diger guclerinden biridir
export class ProductList {
    @Expose({ name: 'products_id' })
    id: number;

    @Expose({ name: 'products_title' })
    title: string;

    @Expose({ name: 'products_description' })
    description: string;

    @Expose({ name: 'products_price' })
    price: string;

    @Expose({ name: 'products_stock' })
    stock: number;

    @Expose({ name: 'products_images' })
    // Resim verisi boş/null gelirse hata vermemesi için güvenli kontrol eklendi:
    @Transform(({ value }) => value ? value.toString().split(",") : [])
    images: string[];


    // Category section
    // 💡 `obj` NEREDEN GELDİ? 
    // class-transformer kütüphanesi @Transform fonksiyonuna otomatik olarak bir nesne parametresi verir.
    // Bu parametrenin içindeki `obj` alanı, veritabanından dönen HAM VERİNİN (yukarıda yorum satırında yazdığınız tüm alanların) TAMAMIDIR.
    // Yani obj.category_id denildiğinde, veritabanından gelen raw nesnedeki "category_id": 8 değerini otomatik okur!
    @Transform(({ obj }) => {
        return {
            id: obj.category_id,
            title: obj.category_title,
        };
    })
    @Expose()
    category: any;

    @Expose({ name: "reviewcount" })
    review: string;

    @Expose({ name: "avgrating" })
    rating: string;
}
// asgidaki gibi yapdik yukardaki mni 
/*
 {
            "id": 3,
            "title": "Home esyasi salamlar ",
            "description": "texxt text text tex",
            "price": "22.00",
            "stock": 3,
            "images": [
                "image 2233",
                "image 111"
            ],
            "category": {
                "id": 8,
                "title": "Home"
            },
            "review": "1",
            "rating": "4.00"
        } 
*/