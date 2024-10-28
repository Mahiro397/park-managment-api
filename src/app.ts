import express, { Request, Response } from 'express';
import env from '@/configs/env';
import cors from 'cors';
import { loggerMiddleware } from '@/middleware/logger';
import router from '@/routes';
import path from 'path';

const app = express();
const uploadDir = path.join(process.cwd(), 'uploads');
app.use('/uploads', express.static(uploadDir)); // uploadsディレクトリを静的ファイルとして公開


// cors 設定
app.use(cors());

// ミドルウェア設定
app.use(express.json());
app.use(loggerMiddleware);

// ルーティング設定
app.use('/', router);

export default app;