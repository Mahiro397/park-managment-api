import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { Park } from '@prisma/client';
 

const parkRouter = Router();
const prisma = new PrismaClient();


parkRouter.get('/hello', (req: Request, res: Response) => {
    res.json({ message: 'Hello from /v1/park!' });
});

parkRouter.post('/', async (req: Request, res: Response) => {
    const { name, lon, lat }: { name: string; lon?: number; lat?: number } = req.body;
  
    try {
      const createPark: Park = await prisma.park.create({
        data: {
          name,
          lon,
          lat,
        },
      });
      res.status(201).json(createPark);
      return;
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: '公園の作成に失敗しました' });
      return;
    }
  });
  
  // 公園の取得
  parkRouter.get('/', async (req: Request, res: Response) => {
    try {
      const getParks: Park[] = await prisma.park.findMany();
      res.json(getParks);
      return;
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: '公園の取得に失敗しました' });
      return;
    }
  });
  
  // 公園の更新
  parkRouter.put('/:parkId', async (req: Request, res: Response) => {
    const { parkId } = req.params;
    const { name, lon, lat } = req.body;
  
    try {
      const updatedPark: Park = await prisma.park.update({
        where: { park_id: parkId },
        data: {
          name,
          lon,
          lat,
        },
      });
      res.json(updatedPark);
      return;
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: '公園の更新に失敗しました' });
      return;
    }
  });
  
  // 公園の削除
  parkRouter.delete('/:parkId', async (req: Request, res: Response) => {
    const { parkId } = req.params;
  
    try {
      await prisma.park.delete({
        where: { park_id: parkId },
      });
      res.status(204).send(); // 削除成功
      return;
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: '公園の削除に失敗しました' });
      return;
    }
  });
  


export default parkRouter;