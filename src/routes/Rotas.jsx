import { BrowserRouter, Navigate, Route, Routes } from "react-router";
import Login from "../pages/Login";
import Cadrastro from "../pages/Cadastro";
import NaoEncotrada from "../pages/NaoEncotrada";
import Tarefas from "../pages/Tarefas";
import { getUsuarioSessao } from "../services";

const ProtectedRoute = ({ children }) => {
    const usuario = getUsuarioSessao();

    if (!usuario?.id) {
        return <Navigate to="/" replace />;
    }

    return children;
};

const Rotas = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/cadastro" element={<Cadrastro />} />
                <Route
                    path="/tarefas"
                    element={
                        <ProtectedRoute>
                            <Tarefas />
                        </ProtectedRoute>
                    }
                />
                <Route path="/*" element={<NaoEncotrada />} />
            </Routes>
        </BrowserRouter>
    );
}

export default Rotas;