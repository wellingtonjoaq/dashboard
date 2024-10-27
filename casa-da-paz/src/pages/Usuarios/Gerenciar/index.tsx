import React, { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom"
import { IToken } from "../../../interfaces/token";
import { verificaTokenExpirado } from "../../../services/token";
import { LayoutDashboard } from "../../../components/LayoutDashboard";
import { SubmitHandler, useForm } from "react-hook-form";
import axios from "axios";

interface IForm {
    nome: string
    email: string
    password?: string
    permissoes: string
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

        // console.log("Pode desfrutar do sistema :D")

        const idUser = Number(id)

        console.log(import.meta.env.VITE_URL)
        if (!isNaN(idUser)) {
            // editar

            // sweetalert2
            axios.get(import.meta.env.VITE_URL +
                '/users?id=' + idUser)
                .then((res) => {
                    setIsEdit(true)

                    // seed - BD - backend(Parecido com migrations)

                    setValue("nome", res.data[0].nome)
                    setValue("email", res.data[0].email)
                    setValue("permissoes", res.data[0].permissoes)


                })
        }

    }, [])

    const submitForm: SubmitHandler<IForm> = useCallback(
        (data) => {

            if (isEdit) {
                // esta editando

                if (data.password?.trim() === '') {
                    delete data.password
                }

                // Loading true
                axios.put(import.meta.env.VITE_URL +
                    '/users/' + id,
                    data
                )
                    .then((res) => {
                        navigate('/usuarios')
                    })
                    .catch((err) => {
                        // COLOCAR ALERT DE ERRO!!
                    })
            } else {

                // cadastrando
                axios.post('http://localhost:3001/users',
                    data
                ).then((res) => {
                    navigate('/usuarios')
                })
                    .catch((err) => {
                        console.log(err)
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
                // ref={(valorReferenciaHtml) => { refForm.current = valorReferenciaHtml }}
                >
                    <div className="col-md-12">
                        <label
                            htmlFor="nome"
                            className="form-label"
                        >
                            Nome
                        </label>
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Yuri"
                            id="nome"
                            required
                            {...register('nome',
                                {
                                    required: 'Nome é obrigatório!',
                                }
                            )}
                        />
                        <div className="invalid-feedback">
                            {errors.nome && errors.nome.message}
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
                            placeholder="Yuri"
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
                            htmlFor="permissoes"
                            className="form-label"
                        >
                            Perfil
                        </label>

                        <select
                            className="form-select"
                            defaultValue={''}
                            id="permissoes"
                            required
                            {
                            ...register("permissoes",
                                { required: 'Selecione' }
                            )
                            }
                        >
                            <option value="">
                                Selecione o tipo
                            </option>
                            <option value="admin">
                                Admin
                            </option>
                            <option value="colaborador">
                                Colaborador
                            </option>
                        </select>
                        <div className="invalid-feedback">
                            {errors.permissoes && errors.permissoes.message}
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
                            placeholder="Yuri"
                            id="password"
                            // required={!isEdit}
                            // {
                            //     ...register('password',
                            //         {required: isEdit ? undefined : 'Senha é obrigatoria'}
                            //     )
                            // }
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