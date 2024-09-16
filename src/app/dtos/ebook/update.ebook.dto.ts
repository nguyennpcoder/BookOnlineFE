import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsArray,
  IsEnum,
  ArrayNotEmpty
} from 'class-validator';
import { KindOfBook } from '../../models/kind-of-book.enum';

export class UpdateEbookDTO {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNumber()
  price: number;

  @IsString()
  @IsNotEmpty()
  title: string;

  @IsEnum(KindOfBook)
  kindofbook: KindOfBook;

  @IsNumber()
  evaluate: number;

  @IsString()
  audioUrl: string;

  @IsString()
  thumbnail: string;

  @IsString()
  @IsNotEmpty()
  document: string;

  @IsArray()
  @ArrayNotEmpty()
  @IsNumber({}, { each: true })
  category_ids: number[]; // Changed from category_id to category_ids

  @IsOptional()
  audioFile?: File;

  constructor(data: any) {
    this.name = data.name;
    this.price = data.price;
    this.title = data.title;
    this.kindofbook = data.kindofbook;
    this.evaluate = data.evaluate;
    this.audioUrl = data.audioUrl;
    this.thumbnail = data.thumbnail;
    this.document = data.document;
    this.category_ids = data.category_ids; // Changed to category_ids
  }
}
