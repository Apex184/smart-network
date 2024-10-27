import { Request, Response, NextFunction } from 'express';
import { RateLimiterMemory } from 'rate-limiter-flexible';

const rateLimiter = new RateLimiterMemory({
    points: 10,
    duration: 60,
});

export const rateLimiterMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    try {
        await rateLimiter.consume(req.ip || '');
        next();
    } catch {
        console.log(`Rate limit exceeded by IP: ${req.ip}`);
        res.status(429).json({ message: 'Too Many Requests' });
    }
};