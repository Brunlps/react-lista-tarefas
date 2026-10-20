import { BrowserRouter, Route, Routes } from "react-router";
import Login from "../pages/Login";
import Cadrastro from "../pages/Cadastro";
import NaoEncotrada from "../pages/NaoEncotrada";
import Tarefas from "../pages/Tarefas";

const Rotas = () => {
    return (  
        <BrowserRouter>
        <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/cadastro" element={<Cadrastro />} />
            <Route path="/tarefas" element={<Tarefas />} />
            <Route path="/*" element={<NaoEncotrada />} />
        </Routes>
        </BrowserRouter>
     );
}
 
export default Rotas;