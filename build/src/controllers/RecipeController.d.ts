import { Request, Response } from "express";
export declare class RecipeController {
    index(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    show(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    create(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    update(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    delete(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
}
