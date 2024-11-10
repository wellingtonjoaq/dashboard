import React, { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom"
import { IToken } from "../../../interfaces/token";
import { verificaTokenExpirado } from "../../../services/token";
import { LayoutDashboard } from "../../../components/LayoutDashboard";
import { SubmitHandler, useForm } from "react-hook-form";
import axios from "axios";

interface IForm {
    titulo: string
    data: string
    imagem: string
}

export default function GerenciarMemorial() {

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
                '/memorial?id=' + idUser)
                .then((res) => {
                    setIsEdit(true)

                    // seed - BD - backend(Parecido com migrations)

                    setValue("titulo", res.data[0].titulo)
                    setValue("data", res.data[0].data)
                    setValue("imagem", res.data[0].imagem)


                })
        }

    }, [])

    const submitForm: SubmitHandler<IForm> = useCallback(
        (data) => {

            if (isEdit) {

                // Loading true
                axios.put(import.meta.env.VITE_URL +
                    '/memorial/' + id,
                    data
                )
                    .then((res) => {
                        navigate('/memorial')
                    })
                    .catch((err) => {
                        // COLOCAR ALERT DE ERRO!!
                    })
            } else {

                // cadastrando
                axios.post('http://localhost:3001/memorial',
                    data
                ).then((res) => {
                    navigate('/memorial')
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
                    {isEdit ? "Editar Memorial" : " Adicionar Memorial"}
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
                            htmlFor="titulo"
                            className="form-label"
                        >
                            Titulo
                        </label>
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Insira seu titulo"
                            id="titulo"
                            required
                            {...register('titulo',
                                {
                                    required: 'Titulo é obrigatório!',
                                }
                            )}
                        />
                        <div className="invalid-feedback">
                            {errors.titulo && errors.titulo.message}
                        </div>

                    </div>

                    <div className="col-md-12">
                        <label
                            htmlFor="data"
                            className="form-label"
                        >
                            data
                        </label>
                        <input
                            type="date"
                            className="form-control"
                            id="data"
                            required
                            {...register('data',
                                {
                                    required: 'Informar a data é obrigatório!',
                                })}
                        />
                        <div className="invalid-feedback">
                            {errors.data && errors.data.message}
                        </div>

                    </div>

                    <div className="col-md-12">
                        <label
                            htmlFor="imagem"
                            className="form-label"
                        >
                            Imagem
                        </label>
                        <input
                            type="file" className="form-control" id="imagem" accept="image/*"
                            required
                            {...register('imagem',
                                {
                                    required: 'Esse campo é obrigatório!',
                                })}
                        />
                        <div className="invalid-feedback">
                            {errors.imagem && errors.imagem.message}
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