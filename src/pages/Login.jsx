import { Axios } from "axios";
import { useRef } from "react";
import { Link } from "react-router";

const Login = () => {
    
    function logar() {
        event.preventDefault();

        let dados = {
            email: email.current.value,
            senha: senha.current.value
        }

        try {
            const resposta = await Axios.post("/login")
            
            if (resposta.data.tipo == "waning") {
                    alert(resposta.data.mensage)
                    return;
                }
                sessionStorage(resposta.data.mensage)
                window.location.href = "tarefas.html"
        } catch (error) {
            
        }


    //     fetch("https://js-lista-de-tarefas-api.onrender.com/login",
    //         {
    //             method: "post",
    //             headers: {
    //                 "Content-type": "application/json"
    //             },
    //             body: JSON.stringify(dados)
    //         })
    //         .then(resposta => resposta.json())
    //         .then(json => {

    //             if (json.tipo == "error") {
    //                 alert(json.mensage)
    //                 return;
    //             }
    //             alert(json.mensage)
    //             window.location.href = "tarefas.html"
    //         })
    //         .catch(error => {
    //             alert(error.message);
    //         });
    // };

    return (
        <div className="bg-slate-200 h-screen flex justify-center items-center">

            <div className="bg-white shadow-lg rounded-lg p-4">

                <h1 className="font-bold text-xl mb-6">Seja bem-vindo(a)</h1>

                <form onsubmit="logar()" className="flex flex-col w-80">

                    <label for="email" className="uppercase text-xs font-bold mb-2 block">Email</label>
                    <input ref="email" type="email" placeholder="email@email.com" className="pl-3 h-10 border-2 border-slate-400 focus:border-purple-600 duration-150 rounded outline-none mb-4" required />

                    <label for="senha" className="uppercase text-xs font-bold mb-2 block">Senha</label>
                    <input ref="senha" type="password" placeholder="********" className="pl-3 h-10 border-2 border-slate-400 focus:border-purple-600 duration-150 rounded outline-none mb-4" required />

                    <Link to="cadastro" className="my-5">Cadastre-se</Link>

                    <button type="submit" className="w-full h-10 rounded bg-purple-400 hover:bg-purple-600 duration-200 hover:text-white font-bold">Logar</button>

                </form>
            </div>

        </div>
    );
}

export default Login;