import { Post,Img } from '@prisma/client';

// 投稿作成のときのレスポンス全体の型
export type createPostResponse = {
    message: string;     
    post: Post;          
    image: Img;        
}
