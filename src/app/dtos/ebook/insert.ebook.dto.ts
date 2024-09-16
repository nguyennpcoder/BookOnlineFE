// // import {
// //   IsString, 
// //   IsNotEmpty, 
// //   IsPhoneNumber,     
// // } from 'class-validator';
// // import { KindOfBook } from '../../models/kind-of-book.enum';
// // import { StringifyOptions } from 'querystring';

// // export class InsertEbookDTO {
// //   @IsPhoneNumber()
// //   name: string;

// //   price: number;

// //   @IsString()
// //   @IsNotEmpty()
// //   title: string;

  
// //   @IsString()
// //   @IsNotEmpty()
// //   document: string;

  
// //   @IsString()
// //   @IsNotEmpty()
// //   kinofbook: KindOfBook;

// //   @IsString()
// //   @IsNotEmpty()
// //   audio: string;

// //   category_id: number;
// //   images: File[] = [];
  
// //   constructor(data: any) {
// //       this.name = data.name;
// //       this.price = data.price;
// //       this.title = data.title;
// //       this.document = data.document;
// //       this.audio=data.audio;
// //       this.kinofbook = data.kinofbook;
// //       this.category_id = data.category_id;
// //   }
// // }
// import {
//   IsString, 
//   IsNotEmpty, 
//   IsPhoneNumber,
//   IsNumber,     
// } from 'class-validator';
// import { KindOfBook } from '../../models/kind-of-book.enum';

// export class InsertEbookDTO {
//   @IsPhoneNumber()
//   @IsNotEmpty()
//   name: string;

//   price: number;

//   @IsString()
//   @IsNotEmpty()
//   title: string;

//   @IsString()
//   @IsNotEmpty()
//   document: string;

//   thumbnail: string;


//   @IsString()
//   kinofbook: KindOfBook;

//   @IsNumber()
//   evaluate: number;

//   @IsString()
//   @IsNotEmpty()
//   audio_url: string;

//   category_id: number;
//   images: File[] = [];

//   constructor(data: any) {
//     this.name = data.name;
//     this.price = data.price;
//     this.title = data.title;
//     this.document = data.document;
//     this.thumbnail=data.thumbnail;
//     this.audio_url = data.audio_url;
//     this.evaluate=data.evaluate;
//     this.kinofbook = data.kinofbook;
//     this.category_id = data.category_id;
//   }
// }

import { KindOfBook } from "../../models/kind-of-book.enum";

export class InsertEbookDTO {
  name: string;
  price: number;
  title: string;
  document: string;
  thumbnail: string;
  kindofbook: KindOfBook; // Assuming kindofbook is a string enum or string
  evaluate: number;
  audio_url: string;
  category_id: number[]; // Ensure categoryId is correctly spelled in TypeScript
  images: File[] = [];
  mp3s: File[] = [];

  constructor(data: any) {
    this.name = data.name;
    this.price = data.price;
    this.title = data.title;
    this.document = data.document;
    this.thumbnail= data.thumbnail;
    this.kindofbook = data.kindofbook;
    this.evaluate = data.evaluate;
    this.audio_url = data.audio_url;
    this.category_id = data.category_id; // Ensure this matches your backend DTO structure
  }
}