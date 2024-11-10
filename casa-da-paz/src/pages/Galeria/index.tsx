import { useNavigate } from "react-router-dom"
import { LayoutDashboard } from "../../components/LayoutDashboard"
import { useEffect, useState } from "react"
import { IToken } from "../../interfaces/token"
import { validaPermissao, verificaTokenExpirado } from "../../services/token"
import { Loading } from "../../components/Loading"
import axios from "axios"

interface IGaleria {
    id: number
    titulo: string
    data: string
    imagem: string
}

export default function Galeria() {

    const navigate = useNavigate()

    const [loading, setLoading] = useState(false)
    
    const [dadosGaleria, setDadosGaleria] =
        useState<Array<IGaleria>>([])

    // Função para excluir um usuário
    const handleExcluir = (id: number) => {
        const confirmacao = window.confirm("Tem certeza que deseja excluir este usuário?");
        if (confirmacao) {
            axios.delete(import.meta.env.VITE_URL + '/galery/' + id) 
                .then(() => {
                    alert("Imagem excluída com sucesso.");

                    setDadosGaleria((galeriasAtuais) => 
                        galeriasAtuais.filter(galeria => galeria.id !== id));
                })
                .catch((err) => {
                    alert("Erro ao excluir a imagem. Tente novamente mais tarde.");
                });
        }}


    // Inicio, Update State, Destruir
    useEffect(() => {

        let lsStorage = localStorage.getItem('americanos.token')

        let token: IToken | null = null

        if (typeof lsStorage === 'string') {
            token = JSON.parse(lsStorage)
        }


        if (!token || verificaTokenExpirado(token.accessToken)) {

            navigate("/")
        }

        setLoading(true)
        axios.get('http://localhost:3001/galery')
            .then((res) => {
                setDadosGaleria(res.data)
                setLoading(false)
            })
            .catch((err) => {
                setLoading(false)
            })

            
    }, [])

        
    return (
        <>
            <Loading visible={loading} />
            <LayoutDashboard>
            <div className="d-flex justify-content-between align-items-center mt-3 mb-4">
                <h1 className="h2">Galeria</h1>
                <button
                    type="button"
                    className="btn btn-success"
                    onClick={() => {
                        navigate('/galeria/criar')
                    }}
                >
                    Adicionar
                </button>
            </div>

            <div className="container mt-3 mb-4">
                <div className="row">
                    {dadosGaleria.map((galeria) => (
                        <div className="col-lg-3 col-md-4 col-sm-6 mb-4" key={galeria.id}>
                            <div className="card h-100 text-center">
                                <div className="card-body d-flex flex-column justify-content-between">
                                    <h2 className="card-title">{galeria.titulo}</h2>
                                    <img src={galeria.imagem} alt="" className="img-fluid mb-3" /> {/* Descrição na imagem para acessibilidade */}
                                    <p className="card-text"><strong>{galeria.data}</strong></p>
                                    <div className="d-flex justify-content-center gap-2 mt-3">
                                        <button
                                            className="btn btn-warning"
                                            type="button"
                                            onClick={() => navigate(`/galerias/${galeria.id}`)}
                                        >
                                            Editar
                                        </button>
                                        <button
                                            className="btn btn-danger"
                                            type="button"
                                            onClick={() => handleExcluir(galeria.id)}
                                        >
                                            Excluir
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            </LayoutDashboard>
        </>
    )
}
