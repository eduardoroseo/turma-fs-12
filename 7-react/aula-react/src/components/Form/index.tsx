import { useState } from "react";
import usuariosService from "../../services/usuarios";
import { useUsuario } from "../../contexts/UsuarioProvider";

function Form() {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");

  const { qtdUsuarios, setQtdUsuarios, usuarios, setUsuarios } = useUsuario();

  const salvarUsuario = async function () {
    const novoUsuario: Usuario = {
      nome,
      email,
      id: null,
    };

    const usuarioCriado = await usuariosService.criarUsuario(novoUsuario);

    setUsuarios([...usuarios, usuarioCriado]);
    setQtdUsuarios(qtdUsuarios + 1);

    setNome("");
    setEmail("");
  };

  return (
    <>
      <div className="row">
        <div className="col">
          <label className="form-label">Nome</label>
          <input
            value={nome}
            onChange={(evento) => setNome(evento.target.value)}
            placeholder="Nome Teste"
            type="text"
            className="form-control"
          />
        </div>
        <div className="col">
          <label className="form-label">Email</label>
          <input
            placeholder="email@teste.com"
            value={email}
            onChange={(evento) => setEmail(evento.target.value)}
            type="email"
            className="form-control"
          />
        </div>
        <div className="col d-flex align-items-end">
          <button onClick={salvarUsuario} className="btn btn-primary">
            Salvar
          </button>
        </div>
        <div className="col d-flex align-items-end">
          <span>Qtd Usuários: {qtdUsuarios}</span>
        </div>
      </div>
    </>
  );
}

export default Form;
