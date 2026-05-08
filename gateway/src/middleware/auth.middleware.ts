import type { NextFunction, Request, Response } from "express";
import { verifyToken } from '../utils/jwt.js';


export function requireAuth(req: Request, res: Response, next: NextFunction) {
  const header = req.header('authorization');

  let token: string | undefined;

  if(header?.startsWith('Bearer')){
   token = header.slice("Bearer ".length);
  }else if(req.cookies?.skillgraph_access){
    token = req.cookies.skillgraph_access as string;
  }

  if(!token){
    res.status(401).json({
      success:false,
      error:{code:"UNAUTHORIZED",message:"Missing bearer token",statusCode:401}
    });
    return;
  }

  try{
    const payload = verifyToken(token);
    req.user={
      id:payload.sub,
      role:payload.role,
      githubHandle:payload.githubHandle,
    };
    next();
  }catch{
    res.status(401).json({
      success:false,
      error:{code:"UNAUTHORIZED",message:"Invalid token",statusCode:401}
    });
  }
}
