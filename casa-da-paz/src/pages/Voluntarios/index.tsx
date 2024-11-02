import { useNavigate } from "react-router-dom"
import { LayoutDashboard } from "../../components/LayoutDashboard"
import { useEffect, useState } from "react"
import { IToken } from "../../interfaces/token"
import { validaPermissao, verificaTokenExpirado } from "../../services/token"
import { Loading } from "../../components/Loading"
import axios from "axios"

interface IVoluntarios {
    id: number
    nome: string
    email: string
    cpf: string
    telefone: string
    area: string
}

export default function Voluntarios() {

    const navigate = useNavigate()

    const [loading, setLoading] = useState(false)
    
    const [dadosVoluntarios, setDadosVoluntarios] =
        useState<Array<IVoluntarios>>([])

    // Função para excluir um usuário
    const handleExcluir = (id: number) => {
        const confirmacao = window.confirm("Tem certeza que deseja excluir este usuário?");
        if (confirmacao) {
            axios.delete(import.meta.env.VITE_URL + '/voluntary/' + id) 
                .then(() => {
                    alert("Voluntario excluído com sucesso.");

                    setDadosVoluntarios((voluntariosAtuais) => 
                        voluntariosAtuais.filter(voluntario => voluntario.id !== id));
                })
                .catch((err) => {
                    alert("Erro ao excluir o voluntario. Tente novamente mais tarde.");
                    console.error("Erro ao excluir voluntario:", err);
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

        if (!validaPermissao(
            ['admin', 'secretarios'],
            token?.user.permissoes
        )) {
            navigate('/dashboard')
        }

        console.log("Pode desfrutar do sistema :D")

        setLoading(true)
        axios.get('http://localhost:3001/voluntary')
            .then((res) => {
                setDadosVoluntarios(res.data)
                setLoading(false)
            })
            .catch((err) => {
                setLoading(false)
                console.log(err)
            })

            
    }, [])

        
    return (
        <>
            <Loading visible={loading} />
            <LayoutDashboard>
                <div
                    className="d-flex justify-content-between mt-3"
                >
                    <h1 className="h2">Voluntarios</h1>
                    
                    <button
                        type="button"
                        className="btn btn-success"
                        onClick={() => {
                            navigate('/voluntarios/criar')
                        }}
                    >
                        Adicionar
                    </button>

                </div>

                <table className="table table-striped">
                    <thead>
                        <tr>
                            <th scope="col">#</th>
                            <th scope="col">Nome</th>
                            <th scope="col">Email</th>
                            <th scope="col">Cpf</th>
                            <th scope="col">Telefone</th>
                            <th scope="col">Areas</th>
                            <th scope="col">Ações</th>
                        </tr>
                    </thead>
                    <tbody>

                        {
                            dadosVoluntarios.map((
                                voluntario,
                                index
                            ) => {
                                return (
                                    <tr key={index}>
                                        <th scope="row">{voluntario.id}</th>
                                        <td>{voluntario.nome}</td>
                                        <td>{voluntario.email}</td>
                                        <td>{voluntario.cpf}</td>
                                        <td>{voluntario.telefone}</td>
                                        <td>{voluntario.area}</td>
                                        <td>
                                            <button
                                                className="btn btn-warning"
                                                type="submit"
                                                style={{
                                                    marginRight: 5
                                                }}
                                                onClick={() => {
                                                    navigate(`/voluntarios/${voluntario.id}`)
                                                }}
                                            >
                                                Editar
                                            </button>
                                            <button
                                            className="btn btn-danger"
                                            type="button"
                                            onClick={() => handleExcluir(voluntario.id)}
                                            >
                                            Excluir
                                            </button>
                                        </td>
                                    </tr>
                                )
                            })
                        }

                    </tbody>

                </table>
            </LayoutDashboard>
        </>
    )
}
