import { SyntheticEvent, useCallback, useRef, useState } from 'react'
import axios from 'axios'
import styles from './styles.module.css'
import { Loading } from '../../components/Loading';
import { Toast } from '../../components/Toast';
import { useNavigate } from 'react-router-dom';

export default function Login() {

    const navigate = useNavigate();

    const refForm = useRef<any>();

    const [loading, setLoading] = useState(false)
    const [toast, setToast] = useState(false)

    const submitForm = useCallback((event: SyntheticEvent) => {

        event.preventDefault();

        if (refForm.current.checkValidity()) {

            setLoading(true)

            const target = event.target as typeof event.target & {
                email: { value: string },
                senha: { value: string }
            }


            axios.post('http://localhost:8000/api/login',
                {
                    email: target.email.value,
                    password: target.senha.value,
                }
            ).then((response) => {

                localStorage.setItem(
                    'casadapaz.token',
                    JSON.stringify(response.data)
                )

                navigate('/usuarios')


            }).catch((error) => {
                console.log('deu ruim')
                console.log(error)
                setLoading(false)
                setToast(true)
            })



        } else {
            refForm.current.classList.add('was-validated')
        }

    }, [])

    return (
        <>
            <Loading
                visible={loading}
            />
            <Toast
                show={toast}
                message='Dados inválidos'
                colors='danger'
                onClose={() => { setToast(false) }}
            />
            <div
                className={styles.main}
            >
                <div className='col-8 col-sm-6 col-md-6 col-lg-4 col-xl-4'>
                <div
                    className={styles.border}

                >
                    <div
                        className='d-flex flex-column align-items-center'
                    >
                        <h1
                            style={{
                                color: 'rgb(137, 183,45)'
                            }}
                        >Login</h1>
                        <p
                            className='text-secondary'
                        >
                            Preencha os campos para logar
                        </p>
                    </div>

                    <hr />

                    <form
                        className='needs-validation align-items-center'
                        noValidate
                        onSubmit={submitForm}
                        ref={refForm}
                        style={{
                            borderColor: 'rgb(137, 183,45)',
                        }}
                    >
                        <div
                            className='col-md-12'
                        >
                            <label
                                htmlFor='email'
                                className='form-label'
                            >
                                Email
                            </label>
                            <input
                                type='email'
                                className='form-control'
                                placeholder='Digite seu email'
                                id='email'
                                required
                            />
                            <div
                                className='invalid-feedback'
                            >
                                Por favor digite seu email
                            </div>
                        </div>

                        <div className='col-md-12 mt-1'>
                            {/* comentario */}
                            <label
                                htmlFor='senha'
                                className='form-label'
                            >
                                Senha
                            </label>
                            <input
                                type='password'
                                className='form-control'
                                placeholder='Digite sua senha'
                                id='senha'
                                required
                            />
                            <div
                                className='invalid-feedback'
                            >
                                Por favor digite sua senha
                            </div>
                        </div>

                        <div
                            className='col-md-12 mt-3'
                        >
                            <button
                                className='btn btn-primary w-100'
                                type='submit'
                                id='botao'
                                style={{
                                    backgroundColor: 'rgb(137, 183,45)',
                                    borderColor: 'rgb(137, 183,45)',
                                }}
                            >
                                Enviar
                            </button>
                        </div>
                    </form>
                </div>
                </div>
            </div>
        </>
    )
}