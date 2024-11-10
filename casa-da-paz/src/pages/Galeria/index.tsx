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
                <div
                    className="d-flex justify-content-between mt-3"
                >
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

                <div className="card">
                <div style={{
                                    display: "flex",
                                    flexWrap: "wrap" // Isso permitirá que os cards que não cabem em uma linha sejam quebrados para a linha de baixo.
                                }}>
                    {
                        dadosGaleria.map((galeria) => {
                            return (
                                <div className="card-body" key={galeria.id} style={{
                                    maxWidth: "18rem",
                                    margin: "18px",
                                    border: "1px solid #d2d2d2",
                                    textAlign: "center",
                                    padding: "10px",
                                    display: "flex",
                                    flexDirection: "column",
                                    justifyContent: "space-between"
                                }}>
                                    <h2>{galeria.titulo}</h2>
                                    <img src="././public/images-removebg-preview.png" alt="" />                                 
                                    <p><strong>{galeria.data}</strong></p>
                                </div>
                            )
                        })
                    }
                </div>
                </div>
            </LayoutDashboard>
        </>
    )
}
