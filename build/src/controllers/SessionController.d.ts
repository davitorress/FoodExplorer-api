import { Request, Response } from "express";
export declare class SessionController {
    create(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
}
