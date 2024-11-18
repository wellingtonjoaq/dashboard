import React, { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom"
import { IToken } from "../../../interfaces/token";
import { verificaTokenExpirado } from "../../../services/token";
import { LayoutDashboard } from "../../../components/LayoutDashboard";
import { SubmitHandler, useForm } from "react-hook-form";
import axios from "axios";

interface IForm {
    name: string
    email: string
    password?: string
}

export default function GerenciarUsuarios() {

    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue
    } = useForm<IForm>()

    const refForm = useRef<any>();

    const navigate = useNavigate();

    const { id } = useParams()

    const [isEdit, setIsEdit] = useState<boolean>(false)

    useEffect(() => {

        let lsStorage = localStorage.getItem('casadapaz.token')

        let token: IToken | null = null

        if (typeof lsStorage === 'string') {
            token = JSON.parse(lsStorage)
        }


        if (!token || verificaTokenExpirado(token.accessToken)) {

            navigate("/")
        }


        const idUser = Number(id)

        if (!isNaN(idUser)) {

            axios.get('http://localhost:8000/api/user?id=' + idUser)
                .then((response) => {
                    setIsEdit(true)

                    setValue("name", response.data[0].name)
                    setValue("email", response.data[0].email)


                })
        }

    }, [])

    const submitForm: SubmitHandler<IForm> = useCallback(
        (data) => {

            if (isEdit) {

                if (data.password?.trim() === '') {
                    delete data.password
                }

                axios.put('http://localhost:8000/api/user/' + id,
                    data
                )
                    .then(() => {
                        navigate('/usuarios')
                    })
                    .catch((error) => {
                        console.log(error)
                    })
            } else {

                axios.post('http://localhost:8000/api/register', data
                ).then(() => {
                    navigate('/usuarios')
                })
                    .catch((error) => {
                        console.log(error)
                    })

            }


        }, [isEdit])

    return (
        <>
            <LayoutDashboard>
                <h1>
                    {isEdit ? "Editar Usuário" : " Adicionar Usuário"}
                </h1>

                <form
                    className="row g-3 needs-validation mb-3"
                    noValidate
                    style={{
                        alignItems: 'center'
                    }}
                    onSubmit={(event: React.FormEvent<HTMLFormElement>) => {
                        event.preventDefault()

                        refForm.current.classList.add('was-validated')

                        handleSubmit(submitForm)(event)

                    }}
                    ref={refForm}
                >
                    <div className="col-md-12">
                        <label
                            htmlFor="name"
                            className="form-label"
                        >
                            Nome
                        </label>
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Insira seu nome"
                            id="name"
                            required
                            {...register('name',
                                {
                                    required: 'Nome é obrigatório!',
                                }
                            )}
                        />
                        <div className="invalid-feedback">
                            {errors.name && errors.name.message}
                        </div>

                    </div>

                    <div className="col-md-12">
                        <label
                            htmlFor="email"
                            className="form-label"
                        >
                            Email
                        </label>
                        <input
                            type="email"
                            className="form-control"
                            placeholder="Digite seu email"
                            id="email"
                            required
                            {...register('email',
                                {
                                    required: 'Email é obrigatório!',
                                }
                            )}
                        />
                        <div className="invalid-feedback">
                            {errors.email && errors.email.message}
                        </div>

                    </div>

                        
                    <div className="col-md-12">
                        <label
                            htmlFor="password"
                            className="form-label"
                        >
                            Senha
                        </label>
                        <input
                            type="password"
                            className="form-control"
                            placeholder="Digite sua senha"
                            id="password"
                            required
                            {...register('password',
                                {
                                    required: 'Senha é obrigatório!',
                                }
                            )}
                        />
                        <div className="invalid-feedback">
                            {errors.password && errors.password.message}
                        </div>

                    </div>

                    <div className="col-md-12">
                        <button
                            type="submit"
                            className="btn btn-success"
                        >
                            Salvar
                        </button>
                    </div>
                </form>
            </LayoutDashboard>
        </>
    )
}