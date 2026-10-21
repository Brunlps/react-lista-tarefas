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
    const usuario = JSON.parse(sessionStorage.getItem("usuario") || null);
    

// Referências para os campos do formulário
    const criarTitulo = useRef(null);
    const criarDescricao = useRef(null);

// Referências para os campos do formulário de edição
    const editarId = useRef(null);
    const editarTitulo = useRef(null);
    const editarDescricao = useRef(null);

// Navegação entre páginas
    const navegar = useNavigate();


    function pesquisarTarefas(palavra) {
        if (palavra.length == 0) {
            setTarefas(tarefas);
            return;
        };
        if (palavra.length >= 3) {
            let tarefasFiltradas = tarefas.filter(tarefa => tarefa.titulo.toLowerCase().includes(palavra.toLowerCase()));
            setTarefas(tarefasFiltradas);
        };
    };

    async function buscarTarefa() {
        try {
            if (!usuario) {
                navegar("/");
                return;
            };
            const resposta = await AXIOS.get(`/tarefas/${usuario.id}`);
            setTarefas(resposta.data)
        } catch (error) {
            console.log("Error: ", error.message);

        };
    }

    async function criarTarefa(event) {
        event.preventDefault();

        try {
            let dados = {
                titulo: criarTitulo.current.value,
                descricao: criarDescricao.current.value,
                usuario_id: usuario.id
            }
            const resposta = await AXIOS.post("/tarefas", dados);

            alert(resposta.data.mensagem);
            setCriarForm(false);
            buscarTarefa();

        } catch (error) {
            alert(`Error: ${error.message}`);

        };
    }

    async function editarTarefa(event) {
        event.preventDefault();

        try {
            let dados = {
                id: editarId.current.value,
                titulo: editarTitulo.current.value,
                descricao: editarDescricao.current.value,
                usuario_id: usuario.id
            }

            const resposta = await AXIOS.put(`/tarefas/${dados.id}`, dados);

            alert(resposta.data.mensagem);
            setEditarForm(false);
            buscarTarefa();

        } catch (error) {
            alert(`Error: ${error.message}`);
        }
    }

    async function deletarTarefa(id) {

        try {
            if (!confirm("Deseja realmente deletar a tarefa?")) {
                return;
            }
            
            const resposta = await AXIOS.delete(`/tarefas/${id}`);
            alert(resposta.data.mensagem);
            buscarTarefa();

        } catch (error) {
            alert(`Error: ${error.message}`);
        }
    }

    useEffect(() => {
        buscarTarefa();
    }, []);
    return (
        <div>
            <header
                className="flex justify-between items-center py-4 px-15 bg-linear-to-r from-purple-900 via-purple-600 to-purple-900">
                <input
                    onChange={(event) => pesquisarTarefa(event.target.value)}
                    type="text"
                    placeholder="Pesquisar"
                    className="w-100 h-10 pl-4 rounded bg-white"
                />
                <button
                    onClick={() => setCriarForm(true)}
                    className="leading-10 bg-purple-800 rounded px-4 font-bold text-white duration-200 cursor-pointer hover:bg-purple-400 hover:text-black">Nova
                    Tarefa</button>
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
                                <div key={tarefa.id} className="bg-white p-4 rounded-lg">
                                    <h3 className=" font-bold mb-4">{tarefa.titulo}</h3>
                                    <p>{tarefa.descricao}</p>
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
                </div>
                {/* Formulario de criação de tarefas */}
                {/* ALTERADO: adicionado z-40 no overlay e z-50 no modal para o form ficar na frente */}
                <div
                    id="overlay"
                    onClick={() => {
                        setCriarForm(false);
                    }}
                    className={`w-full h-screen bg-black/70 fixed top-0 left-0 z-40 duration-200 ${criarForm ? "" : "opacity-0 invisible"}`}
                >
                </div>
                <div id="form-criar"
                    className={`w-100 p-4 rounded-lg bg-white fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 duration-200 delay-200 ${criarForm ? "" : "opacity-0 invisible"}`}>
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
                        <label htmlFor="titulo" className="uppercase text-xs font-bold mb-2 block">Titulo</label>
                        <input
                            ref={criarTitulo}
                            id="titulo"
                            type="text"
                            placeholder="Titulo da tarefa"
                            className="pl-3 h-10 border-2 border-slate-400 focus:border-purple-600 duration-150 rounded outline-none mb-4"
                            required
                        />
                        <label htmlFor="descricao" className="uppercase text-xs font-bold mb-2 block">Descrição</label>
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

                {/* ALTERADO: adicionado z-50 para o modal de editar ficar na frente do overlay */}
                <div id="form-editar"
                    className={`w-100 p-4 rounded-lg bg-white fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 duration-200 delay-200 ${editarForm ? "" : "opacity-0 invisible"}`}>
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