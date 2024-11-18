import { useNavigate } from "react-router-dom";
import { LayoutDashboard } from "../../components/LayoutDashboard";
import { useEffect, useState } from "react";
import { Loading } from "../../components/Loading";
import axios from "axios";
import { IToken } from "../../interfaces/token";

interface IMemorialItem {
    id: number;
    nome: string;
    informacao: string;
    imagem: string;
}

export default function Memorial() {
    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);
    const [dadosPresidentes, setDadosPresidentes] = useState<Array<IMemorialItem>>([]);
    const [dadosSecretaria, setDadosSecretaria] = useState<Array<IMemorialItem>>([]);
    const [dadosTesoureiro, setDadosTesoureiro] = useState<Array<IMemorialItem>>([]);
    const [dadosConselheiroFiscal, setDadosConselheiroFiscal] = useState<Array<IMemorialItem>>([]);
    const [dadosSuplente, setDadosSuplente] = useState<Array<IMemorialItem>>([]);

    const carregarDados = async (tipo: "presidente" | "secretaria" | "tesoureiro" | "conselheiroFiscal" | "suplente") => {
        setLoading(true);
        try {
            const res = await axios.get(`${import.meta.env.VITE_URL}/memorial?tipo=${tipo}`);
            
            if (tipo === "presidente") {
                setDadosPresidentes(res.data);
            } else if (tipo === "secretaria") {
                setDadosSecretaria(res.data);
            } else if (tipo === "tesoureiro") {
                setDadosTesoureiro(res.data);
            } else if (tipo === "conselheiroFiscal") {
                setDadosConselheiroFiscal(res.data);
            } else if (tipo === "suplente") {
                setDadosSuplente(res.data);
            }
        } catch (err) {
            console.error(`Erro ao carregar ${tipo}s, err`);
        } finally {
            setLoading(false);
        }
    };
    
    const handleExcluir = (id: number, tipo: "presidente" | "secretaria" | "tesoureiro" | "conselheiroFiscal" | "suplente") => {
        const confirmacao = window.confirm(`Tem certeza que deseja excluir este ${tipo}?`);
        if (confirmacao) {
            axios
                .delete(`${import.meta.env.VITE_URL}/memorial/${id}?tipo=${tipo}`)
                .then(() => {
                    alert(`${tipo.charAt(0).toUpperCase() + tipo.slice(1)} excluído com sucesso.`);
                    
                    if (tipo === "presidente") {
                        setDadosPresidentes((atual) => atual.filter((item) => item.id !== id));
                    } else if (tipo === "secretaria") {
                        setDadosSecretaria((atual) => atual.filter((item) => item.id !== id));
                    } else if (tipo === "tesoureiro") {
                        setDadosTesoureiro((atual) => atual.filter((item) => item.id !== id));
                    } else if (tipo === "conselheiroFiscal") {
                        setDadosConselheiroFiscal((atual) => atual.filter((item) => item.id !== id));
                    } else if (tipo === "suplente") {
                        setDadosSuplente((atual) => atual.filter((item) => item.id !== id));
                    }
                })
                .catch(() => {
                    alert(`Erro ao excluir o ${tipo}. Tente novamente mais tarde.`);
                });
        }
    };

    useEffect(() => {
        let lsStorage = localStorage.getItem('casadapaz.token')

        let token: IToken | null = null

        if (typeof lsStorage === 'string') {
            token = JSON.parse(lsStorage)
        }
            carregarDados("presidente");
            carregarDados("secretaria");
            carregarDados("tesoureiro");
            carregarDados("conselheiroFiscal");
            carregarDados("suplente");
        
        }, []);

    const renderCard = (item: IMemorialItem, tipo: "presidente" | "secretaria" | "tesoureiro" | "conselheiroFiscal" | "suplente") => (
        <div className="col-lg-3 col-md-4 col-sm-6 mb-4" key={item.id}>
            <div className="card h-100 text-center">
                <div className="card-body d-flex flex-column justify-content-between">
                    <h2 className="card-title">{item.nome}</h2>
                    <img
                        src={item.imagem || "/path/to/default-image.jpg"}
                        alt={item.nome}
                        className="img-fluid mb-3"
                    />
                    <p className="card-text">
                        <strong>{item.informacao}</strong>
                    </p>
                    <div className="d-flex justify-content-center gap-2 mt-3">
                        <button
                            className="btn btn-warning"
                            type="button"
                            onClick={() => navigate(`/memorial/${item.id}?tipo=${tipo}`)}
                        >
                            Editar
                        </button>
                        <button
                            className="btn btn-danger"
                            type="button"
                            onClick={() => handleExcluir(item.id, tipo)}
                        >
                            Excluir
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );

    return (
        <>
            <Loading visible={loading} />
            <LayoutDashboard>
                <div className="d-flex justify-content-between align-items-center mt-3 mb-4">
                    <h1 className="h2">Memorial</h1>
                </div>

                <div className="border border-dark p-3 mb-4">
                    <h2>Presidentes</h2>
                    <div className="container mt-3 mb-4">
                        <div className="row">
                            {dadosPresidentes.map((item) => renderCard(item, "presidente"))}
                        </div>
                    </div>
                    <button
                        type="button"
                        className="btn btn-success"
                        onClick={() => navigate("/memorial/criar?tipo=presidente")}
                    >
                        Adicionar Presidente
                    </button>
                </div>

                <div className="border border-dark p-3 mb-4">
                    <h2>Secretarias</h2>
                    <div className="container mt-3 mb-4">
                        <div className="row">
                            {dadosSecretaria.map((item) => renderCard(item, "secretaria"))}
                        </div>
                    </div>
                    <button
                        type="button"
                        className="btn btn-success"
                        onClick={() => navigate("/memorial/criar?tipo=secretaria")}
                    >
                        Adicionar Secretaria
                    </button>
                </div>

                <div className="border border-dark p-3 mb-4">
                    <h2>Tesoureiros</h2>
                    <div className="container mt-3 mb-4">
                        <div className="row">
                            {dadosTesoureiro.map((item) => renderCard(item, "tesoureiro"))}
                        </div>
                    </div>
                    <button
                        type="button"
                        className="btn btn-success"
                        onClick={() => navigate("/memorial/criar?tipo=tesoureiro")}
                    >
                        Adicionar Tesoureiro
                    </button>
                </div>

                <div className="border border-dark p-3 mb-4">
                    <h2>Conselheiros Fiscais</h2>
                    <div className="container mt-3 mb-4">
                        <div className="row">
                            {dadosConselheiroFiscal.map((item) => renderCard(item, "conselheiroFiscal"))}
                        </div>
                    </div>
                    <button
                        type="button"
                        className="btn btn-success"
                        onClick={() => navigate("/memorial/criar?tipo=conselheiroFiscal")}
                    >
                        Adicionar Conselheiro Fiscal
                    </button>
                </div>

                <div className="border border-dark p-3 mb-4">
                    <h2>Suplentes</h2>
                    <div className="container mt-3 mb-4">
                        <div className="row">
                            {dadosSuplente.map((item) => renderCard(item, "suplente"))}
                        </div>
                    </div>
                    <button
                        type="button"
                        className="btn btn-success"
                        onClick={() => navigate("/memorial/criar?tipo=suplente")}
                    >
                        Adicionar Suplente
                    </button>
                </div>
            </LayoutDashboard>
        </>
    );
}