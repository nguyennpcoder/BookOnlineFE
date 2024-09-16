import { KindOfBook } from './kind-of-book.enum';
import { EbookImage } from './ebook.image';
import { EbookMp3 } from './ebook.mp3';
import { Category } from './category';

export interface Ebook {
    id: number;
    category_ids: number[]; // Changed from category_id to category_ids
    name: string;
    title: string;
    kindofbook: KindOfBook;
    document: string;
    thumbnail: string;
    audioUrl: string;
    evaluate: number;
    price: number;
    url: string;
    ebook_images: EbookImage[];
    ebook_mp3s: EbookMp3[];
    categories: Category[]; // Represents the full details of the categories
    isLoved?: boolean;
    active: boolean;
}
