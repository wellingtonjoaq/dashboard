import {
    Toast as ToastBootstrap,
    ToastProps
} from 'react-bootstrap'

interface IProps extends ToastProps {
    colors?: string
    message: string
}

// Exemplo
interface IPropsTeste {
    onClose: () => void
}

export const Toast = (props: IProps) => {
    return (
        <ToastBootstrap
            show={props.show}
            onClose={props.onClose}
            delay={3000}
            bg={props?.colors ? props.colors : 'success'}
            autohide
            style={{
                position: 'absolute',
                zIndex: 100,
                right: 0
            }}
        >
            <ToastBootstrap.Body
                style={{
                    color: "#FFF"
                }}
            >
                {props.message}
            </ToastBootstrap.Body>

        </ToastBootstrap>
    )
}