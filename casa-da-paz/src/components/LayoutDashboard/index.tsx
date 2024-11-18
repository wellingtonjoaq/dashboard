import { ReactNode, useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { IToken } from '../../interfaces/token'
import styles from './style.module.css'

interface IProps {
    children: ReactNode
}

export const LayoutDashboard = (props: IProps) => {

    const navigate = useNavigate();

    const aLogout = () => {
        localStorage.removeItem('casadapaz.token');
        navigate('/');
    };

    const [token, setToken] = useState<IToken>()

    useEffect(() => {
        let lsToken =
            localStorage.getItem('casadapaz.token')

        let token: IToken | undefined

        if (typeof lsToken === 'string') {
            token = JSON.parse(lsToken)
            setToken(token)
        }
    }, [])

    return (
        <>

<header className={styles.navbar}>
    <div className="navbar sticky-top flex-md-nowrap p-0">
        <a className="navbar-brand col-6 col-md-3 col-lg-2 me-0 px-3" href="#">
            Gerenciamento
        </a>

        <div className="navbar-nav ms-auto">
            <div className="nav-item text-nowrap">
                <Link
                    className="nav-link px-3"
                    to="/"
                    onClick={aLogout}
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
            className="col-12 col-sm-3 col-md-2 col-lg-2 col-xl-2 d-none d-md-block bg-light sidebar"
        >
            <div className="position-sticky pt-3">
                <ul className="nav flex-column">

                    <li className="nav-item">
                        <Link className="nav-link" to={'/usuarios'}>
                            Usuários
                        </Link>
                    </li>

                    <li className="nav-item">
                        <Link className="nav-link" to={'/voluntarios'}>
                            Voluntários
                        </Link>
                    </li>
                    <li className="nav-item">
                        <Link className="nav-link" to={'/galeria'}>
                            Galeria
                        </Link>
                    </li>
                    <li className="nav-item">
                        <Link className="nav-link" to={'/memorial'}>
                            Memorial
                        </Link>
                    </li>
                </ul>
            </div>
        </nav>

        <main className="col-12 col-sm-9 col-md-10 col-lg-10 col-xl-10 ms-sm-auto px-md-4">
            {props.children}
        </main>
    </div>
</div>
            
        </>
    )
}