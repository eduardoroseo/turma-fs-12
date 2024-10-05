import { Request, Response } from "express";
import { usuarios } from "../usuarios";
import { Usuario } from "../models/Usuario";
import { AppDataSource } from "..";

type UsuarioRequestDTO = {
  name: string;
  email: string;
};

export class UsuarioController {
  async getUsuarios(req: Request, res: Response) {
    const userRepository = AppDataSource.getRepository(Usuario);

    const allUsers = await userRepository.find();
    /** Uso de query bruta */
    // const allUsers = await AppDataSource.query('SELECT * FROM usuario');

    return res.send(allUsers).json();
  }

  async getUsuario(req: Request, res: Response) {
    const { id } = req.params;

    const userRepository = AppDataSource.getRepository(Usuario);

    const resultado = await userRepository.findOneBy({
      id: parseInt(id),
    });

    if (!resultado) {
      return res.status(404).send({ error: "Usuário não encontrado" }).json();
    }

    return res.send(resultado).json();
  }

  async createUsuario(req: Request, res: Response) {
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

    const novoUsuario = new Usuario();
    novoUsuario.nome = dados.name;
    novoUsuario.email = dados.email;
    const result = await AppDataSource.manager.save(novoUsuario);

    return res.status(201).send(result).json();
  }

  async updateUsuario(req: Request, res: Response) {
    const { id } = req.params;
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

    const userRepository = AppDataSource.getRepository(Usuario);

    const usuario = await userRepository.findOneBy({
      id: parseInt(id),
    });

    if (!usuario) {
      return res.status(404).send({ error: "Usuário não encontrado" }).json();
    }

    usuario.email = dados.email;
    usuario.nome = dados.name;

    const result = await AppDataSource.manager.save(usuario);

    res.send(result).json();
  }

  async deleteUsuario(req: Request, res: Response) {
    const { id } = req.params;

    const userRepository = AppDataSource.getRepository(Usuario);

    const usuario = await userRepository.findOneBy({
      id: parseInt(id),
    });

    if (!usuario) {
      return res.status(404).send({ error: "Usuário não encontrado" }).json();
    }

    await userRepository.delete(usuario);

    res.send({ message: "Excluído com sucesso!" }).json();
  }
}
