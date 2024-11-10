import { useNavigate } from "react-router-dom"
import { LayoutDashboard } from "../../components/LayoutDashboard"
import { useEffect, useState } from "react"
import { IToken } from "../../interfaces/token"
import { validaPermissao, verificaTokenExpirado } from "../../services/token"
import { Loading } from "../../components/Loading"
import axios from "axios"

interface IMemorial {
    id: number
    titulo: string
    data: string
    imagem: string
}

export default function Memorial() {

    const navigate = useNavigate()

    const [loading, setLoading] = useState(false)
    
    const [dadosMemorial, setDadosMemorial] =
        useState<Array<IMemorial>>([])

    // Função para excluir um usuário
    const handleExcluir = (id: number) => {
        const confirmacao = window.confirm("Tem certeza que deseja excluir esse memorial?");
        if (confirmacao) {
            axios.delete(import.meta.env.VITE_URL + '/memorial/' + id) 
                .then(() => {
                    alert("Memorial excluído com sucesso.");

                    setDadosMemorial((memorialsAtuais) => 
                        memorialsAtuais.filter(memorial => memorial.id !== id));
                })
                .catch((err) => {
                    alert("Erro ao excluir o memorial. Tente novamente mais tarde.");
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
        axios.get('http://localhost:3001/memorial')
            .then((res) => {
                setDadosMemorial(res.data)
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
                    <h1 className="h2">Memorial</h1>
                    <button
                        type="button"
                        className="btn btn-success"
                        onClick={() => navigate('/memorial/criar')}
                    >
                        Adicionar
                    </button>
                </div>

                <div className="container mt-3 mb-4">
                    <div className="row">
                        {dadosMemorial.map((memorial) => (
                            <div className="col-lg-3 col-md-4 col-sm-6 mb-4" key={memorial.id}> 
                                <div className="card h-100 text-center">
                                    <div className="card-body d-flex flex-column justify-content-between">
                                        <h2 className="card-title">{memorial.titulo}</h2>
                                        <img src={memorial.imagem} alt="" className="img-fluid mb-3" />
                                        <p className="card-text"><strong>{memorial.data}</strong></p>
                                        <div className="d-flex justify-content-center gap-2 mt-3">
                                            <button
                                                className="btn btn-warning"
                                                type="button"
                                                onClick={() => navigate(`/memorial/${memorial.id}`)}
                                            >
                                                Editar
                                            </button>
                                            <button
                                                className="btn btn-danger"
                                                type="button"
                                                onClick={() => handleExcluir(memorial.id)}
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
