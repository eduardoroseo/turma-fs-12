import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import config from "../../config.json";

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).send({ error: "Token não informado" });
  }

  const [, token] = authHeader.split(" ");

  if (!token) {
    return res.status(401).send({ error: "Token não informado" });
  }

  try {
    const user = jwt.verify(token, config.jwt_token) as JwtPayload;
    next();
  } catch (error) {
    return res.status(401).send({ error: "Token inválido" });
  }
};
