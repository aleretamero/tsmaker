import express from 'express';
import { router } from './router';

class App {
  private readonly app = express();

  constructor() {
    this.middlewares();
    this.routes();
  }

  private middlewares(): void {
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
  }

  private routes(): void {
    this.app.use(router);
  }

  public listen(port: number, callback: () => void) {
    this.app.listen(port, callback);
  }
}

export const app = new App();
