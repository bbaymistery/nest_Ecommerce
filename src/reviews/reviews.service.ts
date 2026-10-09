import { Injectable } from '@nestjs/common';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ReviewEntity } from './entities/review.entity';
import { Repository } from 'typeorm';
import { ProductsService } from 'src/products/products.service';
import { UserEntity } from 'src/users/entities/user.entity';

@Injectable()
export class ReviewsService {
  constructor(
    @InjectRepository(ReviewEntity) private readonly reviewRepository: Repository<ReviewEntity>,
    private readonly productsService: ProductsService,
  ) { }

  async create(createReviewDto: CreateReviewDto, currentUser: UserEntity) {

    //getting product
    const product = await this.productsService.findOne(createReviewDto.productId);

    //creating review on that product 
    const review = this.reviewRepository.create(createReviewDto);

    review.product = product;
    review.user = currentUser;
    //adding here select for getting addedby and category

    return await this.reviewRepository.save(review);
  }

  async findAll() {
    return await this.reviewRepository.find({
      relations: {
        product: true,
        user: true,
      }
    });
  }

  async findOne(id: number) {
    const review = await this.reviewRepository.findOne(
      {
        where: { id },
        relations: { product: true, user: true }
      });
    return review;
  }

  async update(id: number, updateReviewDto: UpdateReviewDto) {
    const review = await this.findOne(id);
    review.ratings = updateReviewDto.ratings;
    review.comment = updateReviewDto.comment;
    return this.reviewRepository.save(review);

  }

  async remove(id: number) {
    const review = await this.findOne(id);
    if (!review) {
      return `Review #${id} not found`;
    }
    await this.reviewRepository.remove(review);
    return `Review #${id} removed successfully`;
  }
}
