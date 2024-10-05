import { Request, Response } from "express";
import { Usuario } from "../models/Usuario";
import bcrypt from "bcrypt";
import config from "../../config.json";
import jwt from "jsonwebtoken";
import { AppDataSource } from "..";

type UsuarioRequestDTO = {
  name: string;
  email: string;
  senha: string;
};

export class AuthController {
  async register(req: Request, res: Response) {
    const dados: UsuarioRequestDTO = req.body;

    if (!dados.email) {
      return res
        .status(422)
        .send({ error: "O campo email é obrigatório!" })
        .json();
    }

    if (!dados.name) {
      return res
        .status(422)
        .send({ error: "O campo nome é obrigatório!" })
        .json();
    }

    if (!dados.senha) {
      return res
        .status(422)
        .send({ error: "O campo senha é obrigatório!" })
        .json();
    }

    const novoUsuario = new Usuario();
    novoUsuario.nome = dados.name;
    novoUsuario.email = dados.email;
    novoUsuario.senha = await bcrypt.hash(dados.senha, 10);
    const result = await AppDataSource.manager.save(novoUsuario);

    return res
      .status(201)
      .send({ message: "Usuário salvo com sucesso" })
      .json();
  }

  async login(req: Request, res: Response) {

    const { email, senha } = req.body;

    if (!email) {
      return res
        .status(422)
        .send({ error: "O campo email é obrigatório!" })
        .json();
    }

    if (!senha) {
      return res
        .status(422)
        .send({ error: "O campo senha é obrigatório!" })
        .json();
    }

    const userRepository = AppDataSource.getRepository(Usuario);

    const usuario = await userRepository.findOneBy({
      email: email
    });

    if (!usuario) {
      return res
        .status(401)
        .send({ error: "Email ou senha inválido!" })
        .json();
    }

    const senhaCorreta = await bcrypt.compare(senha, usuario.senha);

    if (!senhaCorreta) {
      return res
        .status(401)
        .send({ error: "Email ou senha inválido!" })
        .json();
    }

    const token = jwt.sign({ id: usuario.id }, config.jwt_token, {
      expiresIn: 86400,
    });

    return res.send({ token }).json();
  }
}
