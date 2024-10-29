import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { Post,Img, } from '@prisma/client';
import { createPostResponse } from '@/types/post';


 

const postRouter = Router();
const prisma = new PrismaClient();


// GET /v1/test のエンドポイント
postRouter.get('/hello', (req: Request, res: Response) => {
    res.json({ message: 'Hello from /v1/post!' });
});


// 画像の保存先ディレクトリ
const uploadDir = 'uploads';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);  // uploads ディレクトリが存在しない場合は作成
}

// Multer の設定
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${Date.now()}${ext}`);  // タイムスタンプを使ってユニークなファイル名を作成
  },
});

const upload = multer({ storage });

// 画像とコメントを受け取るエンドポイント
postRouter.post('/', upload.single('image'), async (req: Request, res: Response) => {
  const comment:string = req.body.comment;  // コメントを取得
  const parkId:string = req.body.parkId;    // parkId を取得
  const userId:string|null= req.body.userId;    // userId を取得
  const lon:number|null = req.body.lon;
  const lat:number|null = req.body.lat;
  const file  = req.file;              // アップロードされたファイルを取得
  const postId: string = uuidv4();

  if (!comment || !parkId || !file) {
   res.status(400).json({ message: 'コメント、parkId、userId、および画像を含めてください' });
   return;
  }

  try {
    // Prisma を使用して Post を作成
    const createPost:Post = await prisma.post.create({
      data: {
        post_id: postId,
        comment: comment,   // コメントを保存
        park_id: parkId,   // parkId を保存
        user_id: userId,   // userId を保存
        lon: lon,
        lat: lat,
      },
    });

    if (file) {
        const createImage:Img = await prisma.img.create({
          data: {
            post_id: postId, // 新しく作成した Post の ID
            img_path: file.path,      // アップロードしたファイルのパス
            is_processed: false,  // デフォルト値を設定
          },
        });
        
        const createPostResponse:createPostResponse = {
          message: 'アップロードが完了しました',
          post: createPost,
          image: createImage,
        }

        res.json(createPostResponse);
        return;
      }
  
      // ファイルがない場合のエラーハンドリング (理論上ここには到達しない)
      res.status(400).json({ message: '画像がアップロードされていません' });
      return;
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'データベースへの保存に失敗しました' });
    }
    return;
  });


postRouter.get('/', async (req: Request, res: Response) => {
    try {
      const posts = await prisma.post.findMany({
        include: {
          images: true, // Postに関連する画像データを含めて取得
          park: true,
        },
      });

        // 画像パスをベースURLに変換（フロントエンドでアクセスできるようにする）
        const postsWithImages = posts.map(post => ({
          ...post,
          images: post.images.map(image => ({
            ...image,
            img: `https://${req.get('host')}/${image.img_path.replace(/\\/g, '/')}`, // バックスラッシュをスラッシュに置き換え
          })),
        }));
    

      res.json(postsWithImages);
      return;
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'データの取得中にエラーが発生しました' });
      return;
    }
  });

  postRouter.delete('/:post_id', async (req: Request, res: Response) => {
    const { post_id } = req.params;

    try {
        // まず、関連するImgを削除
        await prisma.img.deleteMany({
            where: { post_id: post_id },
        });

        // 次に、Postを削除
        const deletedPost = await prisma.post.delete({
            where: { post_id: post_id },
        });

        // 成功した場合のレスポンス
        res.json({ message: 'Postを削除しました', deletedPost });
    } catch (error) {
        console.error('削除エラー:', error);
        res.status(500).json({ error: '削除中にエラーが発生しました', details: error });
    }
});

  


export default postRouter;