import { ReactNode, useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { IToken } from '../../interfaces/token'
import { validaPermissao } from '../../services/token'
import styles from './style.module.css'

//Exemplo enterder undefined ou null
let Pessoa = {
    nome: "Junior",
    email: null,
    // idade: undefined
}

interface IProps {
    children: ReactNode
}

export const LayoutDashboard = (props: IProps) => {

    const navigate = useNavigate();

    const aLogout = () => {
        localStorage.removeItem('americanos.token');
        navigate('/');
    };

    const [token, setToken] = useState<IToken>()

    useEffect(() => {
        let lsToken =
            localStorage.getItem('americanos.token')

        let token: IToken | undefined

        if (typeof lsToken === 'string') {
            token = JSON.parse(lsToken)
            setToken(token)
        }
    }, [])

    return (
        <>

            <header
                className={styles.navbar}
            >
                <div className="navbar sticky-top flex-md-nowrap p-0">
                <a className="navbar-brand col-md-3 col-lg-2 me-0 px-3"
                    href="#">
                    Gerenciamento
                </a>
                

                <div className="col-2 col-sm-1 col-md-1 col-lg-1 col-xl-1 navbar-nav">
                    <div className="nav-item text-nowrap">
                        <Link
                            className="nav-link px-3"
                            to="/"
                            onClick={
                                aLogout
                            }
                            >
                            Sair
                        </Link>
                    </div>
                </div>
                </div>
            </header>
            
            <div className="container-fluid">
                <div className="row">

                    <nav
                        id="sidebarMenu"
                        className="col-3 col-sm-3 col-md-2 col-lg-2 col-xl-2 d-md-block bg-light sidebar" 
                    >
                        <div className="position-sticky pt-3">
                            <ul className="nav flex-column">
                                {
                                    validaPermissao(
                                        ['admin', 'secretarios'],
                                        token?.user.permissoes
                                    ) &&
                                    <li className="nav-item">
                                        <Link
                                            className={`nav-link`}
                                            to={'/usuarios'}
                                        >
                                            Usuários
                                        </Link>
                                    </li>
                                }
                                <li className="nav-item">
                                    <Link
                                        className={`nav-link`}
                                        to={'/voluntarios'}
                                    >
                                        Voluntarios
                                    </Link>
                                </li>
                                <li className="nav-item">
                                    <Link
                                        className={`nav-link`}
                                        to={'/galeria'}
                                    >
                                        Galeria
                                    </Link>
                                </li>
                                <li className="nav-item">
                                    <Link
                                        className={`nav-link`}
                                        to={'/memorial'}
                                    >
                                        Memorial
                                    </Link>
                                </li>
                            </ul>
                        </div>
                    </nav>


                    <main
                        className="col-1 col-sm-9 col-md-10 col-lg-10 col-xl-10 ms-sm-auto col-lg-10 px-md-4"
                    >
                        {props.children}
                    </main>

                </div>
            </div>
            
        </>
    )
}