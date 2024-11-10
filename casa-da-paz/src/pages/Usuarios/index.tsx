import { useNavigate } from "react-router-dom"
import { LayoutDashboard } from "../../components/LayoutDashboard"
import { useEffect, useState } from "react"
import { IToken } from "../../interfaces/token"
import { validaPermissao, verificaTokenExpirado } from "../../services/token"
import { Loading } from "../../components/Loading"
import axios from "axios"

interface IUsuarios {
    id: number
    nome: string
    email: string
    permissoes: string
}

export default function Usuarios() {

    const navigate = useNavigate()

    const [loading, setLoading] = useState(false)
    
    const [dadosUsuarios, setDadosUsuarios] =
        useState<Array<IUsuarios>>([])

    // Função para excluir um usuário
    const handleExcluir = (id: number) => {
        const confirmacao = window.confirm("Tem certeza que deseja excluir este usuário?");
        if (confirmacao) {
            axios.delete(import.meta.env.VITE_URL + '/users/' + id) 
                .then(() => {
                    alert("Usuário excluído com sucesso.");

                    setDadosUsuarios((usuariosAtuais) => 
                        usuariosAtuais.filter(usuario => usuario.id !== id));
                })
                .catch((err) => {
                    alert("Erro ao excluir o usuário. Tente novamente mais tarde.");
                    console.error("Erro ao excluir usuário:", err);
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
        axios.get('http://localhost:3001/users')
            .then((res) => {
                setDadosUsuarios(res.data)
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
            <div className="d-flex justify-content-between align-items-center mt-3 mb-4">
                <h1 className="h2">Usuários</h1>
                <button
                    type="button"
                    className="btn btn-success"
                    onClick={() => {
                        navigate('/usuarios/criar')
                    }}
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
                            <th scope="col">Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {dadosUsuarios.map((usuario, index) => {
                            return (
                                <tr key={index}>
                                    <th scope="row">{usuario.id}</th>
                                    <td>{usuario.nome}</td>
                                    <td>{usuario.email}</td>
                                    <td>
                                        <button
                                            className="btn btn-warning"
                                            type="submit"
                                            style={{
                                                marginRight: 5
                                            }}
                                            onClick={() => {
                                                navigate(`/usuarios/${usuario.id}`)
                                            }}
                                        >
                                            Editar
                                        </button>
                                        <button
                                            className="btn btn-danger"
                                            type="button"
                                            onClick={() => handleExcluir(usuario.id)}
                                        >
                                            Excluir
                                        </button>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
            </LayoutDashboard>
        </>
    )
}
