import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router";
import { AXIOS, getUsuarioSessao } from "../services";

const Cadastro = () => {
    const nome = useRef(null);
    const email = useRef(null);
    const senha = useRef(null);
    const navegar = useNavigate();
    const [dadosCadastrados, setDadosCadastrados] = useState(false);

    useEffect(() => {
        const usuario = getUsuarioSessao();

        if (usuario?.id) {
            navegar("/tarefas", { replace: true });
        }
    }, [navegar]);

    async function cadastrar(event) {
        event.preventDefault();
        setDadosCadastrados(true);

        const dados = {
            nome: nome.current.value,
            email: email.current.value,
            senha: senha.current.value
        };

        try {
            const resposta = await AXIOS.post("/usuarios", dados);
            setDadosCadastrados(false);

            if (resposta.data?.tipo === "error") {
                alert(resposta.data.mensagem);
                return;
            }

            const usuario = resposta.data?.usuario;

            if (!usuario?.id) {
                alert("Dados de usuário inválidos na resposta da API.");
                return;
            }

            sessionStorage.setItem("usuario", JSON.stringify(usuario));
            alert(resposta.data.mensagem);
            navegar("/tarefas", { replace: true });
        } catch (error) {
            setDadosCadastrados(false);
            alert(error.message);
        }
    }
    return (
        <div className="bg-slate-200 h-screen flex justify-center items-center">
            <div className="bg-white shadow-lg rounded-lg p-4">
                <Link to="/" className="flex justify-end">logar</Link>
                <h1 className="font-bold text-xl mb-6">Cadastre-se</h1>

                <form onSubmit={cadastrar} className="flex flex-col w-80">

                    <label className="uppercase text-xs font-bold mb-2 block">Nome</label>
                    <input
                        ref={nome}
                        type="text"
                        placeholder="Digite seu nome"
                        className="pl-3 h-10 border-2 border-slate-400 focus:border-purple-600 duration-150 rounded outline-none mb-4"
                        required />

                    <label className="uppercase text-xs font-bold mb-2 block">Email</label>
                    <input
                        ref={email}
                        type="email"
                        placeholder="email@email.com"
                        className="pl-3 h-10 border-2 border-slate-400 focus:border-purple-600 duration-150 rounded outline-none mb-4"
                        required />

                    <label className="uppercase text-xs font-bold mb-2 block">Senha</label>
                    <input
                        ref={senha}
                        type="password"
                        placeholder="********"
                        className="pl-3 h-10 border-2 border-slate-400 focus:border-purple-600 duration-150 rounded outline-none mb-4"
                        required />

                    <button type="submit"
                        className="w-full h-10 rounded bg-purple-400 hover:bg-purple-600 duration-200 hover:text-white font-bold">
                        {dadosCadastrados ? "Cadastrando..." : "Cadastrar"}
                    </button>

                </form>
            </div>
        </div>
    );
}
export default Cadastro;