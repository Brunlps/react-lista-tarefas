import { AXIOS, getUsuarioSessao } from "../services";
import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router";

const Login = () => {
    const email = useRef(null);
    const senha = useRef(null);
    const navegar = useNavigate();
    const [carregando, setCarregando] = useState(false);

    useEffect(() => {
        const usuario = getUsuarioSessao();

        if (usuario?.id) {
            navegar("/tarefas", { replace: true });
        }
    }, [navegar]);

    async function logar(event) {
        event.preventDefault();
        setCarregando(true);

        const dados = {
            email: email.current.value,
            senha: senha.current.value
        };

        try {
            const resposta = await AXIOS.post("/login", dados);
            const usuario = resposta.data?.usuario;

            setCarregando(false);

            if (resposta.data?.tipo === "warning") {
                alert(resposta.data.mensagem);
                return;
            }

            if (!usuario?.id) {
                alert("Dados de usuário inválidos na resposta da API.");
                return;
            }

            sessionStorage.setItem("usuario", JSON.stringify(usuario));
            alert(resposta.data.mensagem);
            navegar("/tarefas", { replace: true });
        } catch (error) {
            setCarregando(false);
            alert(error.message);
        }
    }

    return (
        <div className="bg-slate-200 h-screen flex justify-center items-center">

            <div className="bg-white shadow-lg rounded-lg p-4">

                <h1 className="font-bold text-xl mb-6">Seja bem-vindo(a)</h1>

                <form onSubmit={logar} className="flex flex-col w-80">

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

                    <Link to="/cadastro"className="my-5">Cadastre-se</Link>

                    <button disabled={carregando} className="w-full h-10 rounded bg-purple-400 hover:bg-purple-600 duration-200 hover:text-white font-bold">
                        {carregando ? "Carregando..." : "Logar"}
                    </button>

                </form>
            </div>

        </div>
    );
}

export default Login;