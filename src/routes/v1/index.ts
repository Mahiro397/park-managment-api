import { Router } from 'express';
import testRouter from './test';
import postRouter from './post/post';
import parkRouter from './park/park';

const v1Router = Router();

// /v1/testのルート
v1Router.use('/test', testRouter);
v1Router.use('/post',postRouter)
v1Router.use('/park',parkRouter)


v1Router.use((req, res, next) => {
    res.status(404).end();
});

export default v1Router;
