import { useEffect } from "react";
import { LayoutDashboard } from "../../components/LayoutDashboard";
import { IToken } from "../../interfaces/token";
import { verificaTokenExpirado } from "../../services/token";
import { useNavigate } from "react-router-dom";
import styles from "./style.module.css"

export default function Dashboard() {
    
    const navigate = useNavigate()

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

        console.log("Pode desfrutar do sistema :D")
        

    }, [])

    return(
        <LayoutDashboard>
            <h1>Painel Administrativo</h1>
        </LayoutDashboard>
    )
}

