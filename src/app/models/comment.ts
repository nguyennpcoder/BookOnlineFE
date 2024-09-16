import { BaseEntity } from "./baseEntity";
import { Ebook } from "./ebook";
import { User } from "./user";


export interface Comment {
    id: number;
    user_id: User;
    ebook_id: Ebook;
    content: string;
    create_at: BaseEntity;
    updated_at: BaseEntity;
  }
  