import { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { AXIOS } from "../services";
import { BiPencil, BiTrash } from "react-icons/bi";

const Tarefas = () => {
    // State de tarefas
    const [tarefas, setTarefas] = useState([]);

    // State Formulario de cração das tarefas
    const [criarForm, setCriarForm] = useState(false);

    // State de Editar tarefa
    const [editarForm, setEditarForm] = useState(false);

    // É um espaço de armazenamento dentro do navegador, 
    // onde você guarda pequenos dados em formato de texto, no esquema "nome → valor". 
    // No seu projeto ele guarda o usuário depois do cadastro ou login.
    const usuario = JSON.parse(sessionStorage.getItem("usuarios"));
    


    const criarTitulo = useRef(null);
    const criarDescricao = useRef(null);

    const editarId = useRef(null);
    const editarTitulo = useRef(null);
    const editarDescricao = useRef(null);

    const navegar = useNavigate();


    function pesquisarTarefas(palavra) {
        if (palavra.length == 0) {
            setTarefas(tarefas);
            return;
        };
        if (palavra.length >= 3) {
            let tarefaFiltradas = tarefas.filter(tarefa => tarefa.titulo.toLowerCase().includes(palavra.toLowerCase()));
        };
    };

    async function buscarTarefa() {
        try {
            if (!usuario) {
                navegar("/");
                return;
            };
            const resposta = await AXIOS.get(`/tarefa/${usuario.id}`);
            setTarefas(resposta.data)
        } catch (error) {
            console.log("Error: ", error.message);

        };
    }

    async function criarTarefa() {
        try {
            let dados = {
                titulo: criarTitulo.current.value,
                descricao: criarDescricao.current.value,
                usuario_id: usuario.id
            }
            const resposta = await AXIOS.post("/tarefa", dados);

            alert(resposta.data.mensagem);
            setCriarForm(false);
            buscarTarefa();

        } catch (error) {
            alert("Error: ", error.message);

        };
    }

    async function editarTarefa() {
        event.preventDefault();

        try {
            let dados = {
                id: idEditar.current.value,
                titulo: editarTitulo.current.value,
                descricao: editarDescricao.current.value,
                usuario_id: usuario.id
            }

            const resposta = await AXIOS.put(`/tarefa/${dados.id}`, dados);

            alert(resposta.data.mensagem);
            setEditarForm(false);
            buscarTarefa();

        } catch (error) {
            alert("Error: ", error.message);
        }
    }

    async function deletarTarefa(id) {
        event.preventDefault();

        try {
            if (!confirm("Deseja realmente deletar a tarefa?")) {
                const resposta = await AXIOS.delete(`/tarefa/${id}`);

            }

            alert(resposta.data.mensagem);
            buscarTarefa();

        } catch (error) {
            alert("Error: ", error.message);
        }
    }

    useEffect(() => {
        buscarTarefa();
    }, []);
    return (
        <div>
            <header className="flex items-center py-4 px-15 bg-linear-to-r from-purple-900 via-purple-600 to-purple-900">
                <input onChange={(event) => pesquisarTarefas((event.target.value))} type="text" placeholder="Pesquisar" className="w-100 h-10 pl-4 mx-2 rounded bg-white" />

                <button
                    onClick={() => setTarefas(true)}
                    className="leading-10 bg-purple-800 rounded px-4 font-bold text-white duration-200 cursor-pointer hover:bg-purple-400 hover:text-black">Buscar Tarefa</button>
            </header>
            <main className="p-5 bg-slate-200">
                <h1 className="text-3xl font-bold mb-6">Tarefas</h1>
                {/* Sessão de criar tarefas */}
                <div className="grid grid-cols-3 gap-4">
                    {
                        tarefas.length == 0 ? (
                            <div>Crie a sua primeira tarefa</div>
                        ) : (
                            tarefas.map(tarefa => (
                                <div className="bg-white p-4 rounded-lg">
                                    <h3 className=" font-bold mb-4">{tarefa.titulo}</h3>
                                    <p>{tarefa.decricao}</p>
                                    <div>
                                        <BiPencil
                                            onClick={() => {
                                                editarId.current.value = tarefa.id,
                                                    editarTitulo.current.value = tarefa.titulo,
                                                    editarDescricao.current.value = tarefa.descricao,
                                                    setEditarForm(true);
                                            }}
                                            className=" cursor-pointer hover:fill-purple-500"
                                        />

                                        <BiTrash
                                            onClick={() => deletarTarefa(tarefa.id)} className="cursor-pointer hover:fill-purple-500"
                                        />
                                    </div>
                                </div>
                            ))
                        )
                    }
                    <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md" id="form-tarefa">

                        <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">Lista De Tarefas</h1>

                        <form id="" className="flex gap-2 mb-6">

                            <input onchange="criarTarefa(event.target.value)" type="text" id="input-tarefa" placeholder="Digite uma tarefa" className="flex-1 border border-x-gray-300 rounded-lg px-4 focus:outline-none focus:border-blue-500" />

                            <button type="submit" className="bg-blue-500 text-white px-4 py-2
                                rounded-lg p-2 hover:border-blue-600 cursor-pointer">Adicionar</button>
                        </form>
                        <ul id="lista-tarefas" className="space-y-2"></ul>
                    </div>
                </div>

                {/* Sessão de criar tarefas */}

                <div
                    id="overlay"
                    onClick={() => {
                        setCriarForm(false);
                    }}
                    className={`w-full h-screen bg-black/70 fixed top-0 left-0 duration-200 ${criarForm ? "" : "opacity-0 invisible"}`}
                >

                </div>
                <div id="form-criar"
                    className={`w-100 p-4 rounded-lg bg-white fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 duration-200 delay-200 ${criarForm ? "" : "opacity-0 invisible"}`}>
                    <div className="flex justify-end">
                        <box-icon
                            name='x'
                            className="cursor-pointer"
                            onClick={() => setCriarForm(false)}
                        ></box-icon>
                    </div>

                    <form
                        onSubmit={criarTarefa}
                        className="flex flex-col">
                        <label for="titulo" className="uppercase text-xs font-bold mb-2 block">Titulo</label>
                        <input
                            ref={criarTitulo}
                            id="titulo"
                            type="text"
                            placeholder="Titulo da tarefa"
                            className="pl-3 h-10 border-2 border-slate-400 focus:border-purple-600 duration-150 rounded outline-none mb-4"
                            required
                        />
                        <label for="descricao" className="uppercase text-xs font-bold mb-2 block">Descrição</label>
                        <textarea
                            ref={criarDescricao}
                            id="descricao"
                            className="pl-3 h-30 border-2 border-slate-400 focus:border-purple-600 duration-150 rounded outline-none mb-4"
                            required
                        ></textarea>
                        <button type="submit"
                            className="w-full h-10 rounded bg-purple-400 hover:bg-purple-600 duration-200 hover:text-white font-bold">Criar</button>
                    </form>
                </div>

                <div id="form-editar"
                    className={`w-100 p-4 rounded-lg bg-white fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 duration-200 delay-200 ${editarForm ? "" : "opacity-0 invisible"}`}>
                    <div className="flex justify-end">
                        <box-icon
                            name='x'
                            className="cursor-pointer"
                            onClick={() => setEditarForm(false)}
                        ></box-icon>
                    </div>

                    <form
                        onSubmit={editarTarefa}
                        className="flex flex-col">
                        <input type="hidden" ref={editarId} />
                        <label
                            className="uppercase text-xs font-bold mb-2 block"
                        >
                            Titulo
                        </label>
                        <input
                            ref={editarTitulo}
                            type="text"
                            placeholder="Titulo da tarefa"
                            className="pl-3 h-10 border-2 border-slate-400 focus:border-purple-600 duration-150 rounded outline-none mb-4"
                            required
                        />
                        <label className="uppercase text-xs font-bold mb-2 block">Descrição</label>
                        <textarea
                            ref={editarDescricao}
                            className="pl-3 h-30 border-2 border-slate-400 focus:border-purple-600 duration-150 rounded outline-none mb-4"
                            required></textarea>
                        <button type="submit"
                            className="w-full h-10 rounded bg-purple-400 hover:bg-purple-600 duration-200 hover:text-white font-bold">Editar</button>
                    </form>
                </div>
            </main >
        </div>

    );
}

export default Tarefas;