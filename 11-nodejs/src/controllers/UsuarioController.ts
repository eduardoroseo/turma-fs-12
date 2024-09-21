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
    return res.send(usuarios).json();
  }

  async getUsuario(req: Request, res: Response) {
    const { id } = req.params;

    const resultado = usuarios.filter((user) => user.id == id);

    if (resultado.length == 0) {
      return res.status(404).send({ error: "Usuário não encontrado" }).json();
    }

    return res.send(resultado[0]).json();
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

    const indiceUsuario = usuarios.findIndex((user) => user.id == id);

    if (indiceUsuario < 0) {
      return res.status(404).send({ error: "Usuário não encontrado" }).json();
    }

    usuarios[indiceUsuario] = {
      ...usuarios[indiceUsuario],
      name: dados.name,
      email: dados.email,
    };

    res.send(usuarios[indiceUsuario]).json();
  }

  async deleteUsuario(req: Request, res: Response) {
    const { id } = req.params;

    const indiceUsuario = usuarios.findIndex((user) => user.id == id);

    if (indiceUsuario < 0) {
      return res.status(404).send({ error: "Usuário não encontrado" }).json();
    }

    usuarios.splice(indiceUsuario, 1);

    res.send({ message: "Excluído com sucesso!" }).json();
  }
}
