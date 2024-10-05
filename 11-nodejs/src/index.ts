import express, { Express } from "express";
import usuarioRoutes from "./routes/usuarioRoutes";
import "reflect-metadata";
import ormconfig from "../ormconfig.json";
import { DataSource } from "typeorm";
import { Usuario } from "./models/Usuario";
import { authMiddleware } from "./middlewares/authMiddleware";
import authRoutes from "./routes/authRoutes";

const app: Express = express();
app.use(express.json());
app.use(authRoutes);
app.use(authMiddleware, usuarioRoutes);

export const AppDataSource = new DataSource({
  type: "mysql",
  host: ormconfig.host,
  port: ormconfig.port,
  username: ormconfig.username,
  password: ormconfig.password,
  database: ormconfig.database,
  synchronize: ormconfig.synchronize,
  logging: ormconfig.logging,
  entities: [Usuario],
  migrations: [],
});

AppDataSource.initialize()
  .then(() => {
    console.log("Conectado ao banco de dados");
    app.listen(3000, () => console.log("Servidor rodando na porta 3000"));
  })
  .catch((error) => {
    console.error("Erro ao conectar ao banco de dados", error);
  });
