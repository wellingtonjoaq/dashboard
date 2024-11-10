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
    cpf: string
    telefone: string
    area: string
}

export default function GerenciarVoluntarios() {

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

        const idVoluntary = Number(id)

        console.log(import.meta.env.VITE_URL)
        if (!isNaN(idVoluntary)) {
            // editar

            // sweetalert2
            axios.get(import.meta.env.VITE_URL +
                '/voluntary?id=' + idVoluntary)
                .then((res) => {
                    setIsEdit(true)

                    // seed - BD - backend(Parecido com migrations)

                    setValue("nome", res.data[0].nome)
                    setValue("email", res.data[0].email)
                    setValue("cpf", res.data[0].cpf)
                    setValue("telefone", res.data[0].telefone)
                    setValue("area", res.data[0].area)


                })
        }

    }, [])

    const submitForm: SubmitHandler<IForm> = useCallback(
        (data) => {

            if (isEdit) {
                
                axios.put(import.meta.env.VITE_URL +
                    '/voluntary/' + id,
                    data
                )
                    .then((res) => {
                        navigate('/voluntarios')
                    })
                    .catch((err) => {
                        // COLOCAR ALERT DE ERRO!!
                    })
            } else {

                // cadastrando
                axios.post('http://localhost:3001/voluntary',
                    data
                ).then((res) => {
                    navigate('/voluntarios')
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
                    {isEdit ? "Editar Voluntario" : " Adicionar Voluntario"}
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
                            htmlFor="nome"
                            className="form-label"
                        >
                            Nome
                        </label>
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Insira seu nome"
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
                            htmlFor="cpf"
                            className="form-label"
                        >
                            Cpf
                        </label>
                        <input
                            type="cpf"
                            className="form-control"
                            placeholder="Digite seu cpf"
                            id="cpf"
                            required
                            {...register('cpf',
                                {
                                    required: 'Cpf é obrigatório!',
                                }
                            )}
                        />
                        <div className="invalid-feedback">
                            {errors.cpf && errors.cpf.message}
                        </div>

                    </div>

                    <div className="col-md-12">
                        <label
                            htmlFor="telefone"
                            className="form-label"
                        >
                            Telefone
                        </label>
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Digite seu telefone"
                            id="telefone"
                            required
                            {...register('telefone',
                                {
                                    required: 'Telefone é obrigatório!',
                                }
                            )}
                        />
                        <div className="invalid-feedback">
                            {errors.telefone && errors.telefone.message}
                        </div>

                    </div>

                    <div className="col-md-12">
                        <label
                            htmlFor="area"
                            className="form-label"
                        >
                            Area
                        </label>
                        <select className="form-select" id="areas" required
                            {...register('area',
                                {
                                    required: 'Selecione uma area!',
                                }
                            )}>
                            <option selected disabled>Selecione uma área</option>
                            <option value="Audiovisual">Audiovisual</option>
                            <option value="Marketing">Marketing</option>
                            <option value="Programador Web designer">Programador Web designer</option>
                            <option value="Captador de recursos">Captador de recursos</option>
                            <option value="Oficineiro">Oficineiro</option>
                            <option value="Auxiliar de bazar">Auxiliar de bazar</option>
                            <option value="Atividades com as crianças">Atividades com as crianças</option>
                            <option value="Palestrante">Palestrante</option>
                            <option value="Promoções e Eventos">Promoções e Eventos</option>
                        </select>
                        <div className="invalid-feedback">
                            {errors.area && errors.area.message}
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