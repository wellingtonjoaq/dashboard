import { useNavigate } from "react-router-dom";
import { LayoutDashboard } from "../../components/LayoutDashboard";
import { useEffect, useState } from "react";
import { IToken } from "../../interfaces/token";
import { validaPermissao, verificaTokenExpirado } from "../../services/token";
import { Loading } from "../../components/Loading";
import axios from "axios";

interface IVoluntarios {
    id: number;
    nome: string;
    email: string;
    cpf: string;
    telefone: string;
    areas: string;
}

export default function Voluntarios() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [dadosVoluntarios, setDadosVoluntarios] = useState<IVoluntarios[]>([]);

    const handleExcluir = (id: number) => {
        const confirmacao = window.confirm("Tem certeza que deseja excluir este voluntário?");
        if (confirmacao) {
            setLoading(true);
            axios
                .delete(`http://localhost:8000/api/voluntarios/${id}`)
                .then(() => {
                    alert("Voluntário excluído com sucesso.");
                    setDadosVoluntarios((voluntariosAtuais) =>
                        voluntariosAtuais.filter((voluntario) => voluntario.id !== id)
                    );
                })
                .catch(() => {
                    alert("Erro ao excluir o voluntário. Tente novamente mais tarde.");
                })
                .finally(() => setLoading(false));
        }
    };

    useEffect(() => {
        const lsStorage = localStorage.getItem("casadapaz.token");
        let token: IToken | null = null;

        if (typeof lsStorage === "string") {
            token = JSON.parse(lsStorage);
        }

        if (!token || verificaTokenExpirado(token.accessToken)) {
            navigate("/");
            return;
        }

        console.log("Pode desfrutar do sistema :D");

        setLoading(true);
        axios
            .get("http://localhost:8000/api/voluntarios/")
            .then((response) => {
                const data = response.data;
                setDadosVoluntarios(Array.isArray(data) ? data : []);
            })
            .catch((error) => {
                console.error("Erro ao carregar dados de voluntários:", error);
                alert("Erro ao carregar os dados. Por favor, tente novamente.");
            })
            .finally(() => setLoading(false));
    }, [navigate]);

    return (
        <>
            <Loading visible={loading} />
            <LayoutDashboard>
                <div className="d-flex justify-content-between align-items-center mt-3 mb-4">
                    <h1 className="h2">Voluntários</h1>
                    <button
                        type="button"
                        className="btn btn-success"
                        onClick={() => navigate("/voluntarios/criar")}
                    >
                        Adicionar
                    </button>
                </div>

                <div className="table-responsive">
                    <table className="table table-striped">
                        <thead>
                            <tr>
                                <th scope="col">#</th>
                                <th scope="col">Nome</th>
                                <th scope="col">Email</th>
                                <th scope="col">CPF</th>
                                <th scope="col">Telefone</th>
                                <th scope="col">Áreas</th>
                                <th scope="col">Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            {dadosVoluntarios.map((voluntario) => (
                                <tr key={voluntario.id}>
                                    <th scope="row">{voluntario.id}</th>
                                    <td>{voluntario.nome}</td>
                                    <td>{voluntario.email}</td>
                                    <td>{voluntario.cpf}</td>
                                    <td>{voluntario.telefone}</td>
                                    <td>{voluntario.areas}</td>
                                    <td>
                                        <button
                                            className="btn btn-warning"
                                            style={{ marginRight: 5 }}
                                            onClick={() => navigate(`/voluntarios/${voluntario.id}`)}
                                        >
                                            Editar
                                        </button>
                                        <button
                                            className="btn btn-danger"
                                            onClick={() => handleExcluir(voluntario.id)}
                                        >
                                            Excluir
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </LayoutDashboard>
        </>
    );
}
