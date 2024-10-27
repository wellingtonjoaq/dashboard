
interface IProps {
    visible?: boolean
}

export const Loading = (props: IProps) => {

    return (
        props.visible &&
        <div
            className="d-flex justify-content-center align-items-center"
            style={{
                position: 'fixed',
                zIndex: 99,
                width: '100%',
                height: '100%',
                backgroundColor: 'rgb(0,0,0,0.3)'
            }}
        >
            <div
                className="spinner-border"
                role="status"
                style={{
                    width: '3rem',
                    height: '3rem',
                }}
            ></div>

        </div>
    )
}