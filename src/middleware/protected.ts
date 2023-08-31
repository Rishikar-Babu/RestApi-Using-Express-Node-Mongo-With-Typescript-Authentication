import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../config/config';
import { Request, Response, NextFunction } from 'express';

const validateToken = async (req: Request, res: Response, next: NextFunction) => {
    let token;
    let authHeader = req.headers.authorization || req.headers.Authorization;
    if (authHeader && authHeader.toString().startsWith('Bearer')) {
        token = authHeader.toString().split(' ')[1];
        jwt.verify(token, JWT_SECRET, (err: jwt.VerifyErrors | null, decode: any) => {
            if (err) {
                res.status(401).json({ msg: 'Token not generated, user not authorized' });
            } else {
                req.query.user = decode.user;
                next();
            }
        });
    } else {
        res.status(401);
        throw new Error('User not authorized');
    }
};

export default validateToken;
