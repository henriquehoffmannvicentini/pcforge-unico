import { Request, Response, NextFunction } from "express";
import { TokenPayload } from "./jwt";
declare global {
    namespace Express {
        interface Request {
            cliente?: TokenPayload;
        }
    }
}
export declare const authMiddleware: (req: Request, res: Response, next: NextFunction) => void;
export declare const adminMiddleware: (req: Request, res: Response, next: NextFunction) => void;
export declare const selfOrAdminMiddleware: (paramName?: string) => (req: Request, res: Response, next: NextFunction) => void;
//# sourceMappingURL=auth.middleware.d.ts.map