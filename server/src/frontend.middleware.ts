import { NestMiddleware } from "@nestjs/common/interfaces";
import { Injectable } from "@nestjs/common";
import { Response } from "express";

const allowedExt = [
    '.js',
    '.ico',
    '.css',

];

@Injectable()
export class FrontendMiddleware implements NestMiddleware {
    use(req: Request, res: Response, next: Function) {
        if (req.url.startsWith('/api')) {
            next();
        } else {
            res.sendFile('')
        }
    }
}