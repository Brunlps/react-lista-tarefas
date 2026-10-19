import { BrowserRouter, Route, Routes } from "react-router";
import Login from "../pages/Login";
import Cadrastro from "../pages/Cadastro";
import NaoEncotrada from "../pages/NaoEncotrada";

const Rotas = () => {
    return (  
        <BrowserRouter>
        <Routes>
            <Route path="/" element={<Login />}></Route>
            <Route path="/cadastro" element={<Cadrastro />}></Route>
            <Route path="/tarefas" element={<Tarefas />}></Route>
            <Route path="/*" element={<NaoEncotrada />}></Route>
        </Routes>
        </BrowserRouter>
     );
}
 
export default Rotas;