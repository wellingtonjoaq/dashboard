import React, { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom"
import { IToken } from "../../../interfaces/token";
import { verificaTokenExpirado } from "../../../services/token";
import { LayoutDashboard } from "../../../components/LayoutDashboard";
import { SubmitHandler, useForm } from "react-hook-form";
import axios from "axios";

interface IForm {
    nome: string
    descricao: string
    imagem: string
}

export default function GerenciarGaleria() {

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
                '/galery?id=' + idUser)
                .then((res) => {
                    setIsEdit(true)

                    // seed - BD - backend(Parecido com migrations)

                    setValue("nome", res.data[0].imagem)
                    setValue("descricao", res.data[0].imagem)
                    setValue("imagem", res.data[0].nome)


                })
        }

    }, [])

    const submitForm: SubmitHandler<IForm> = useCallback(
        (data) => {

            if (isEdit) {

                // Loading true
                axios.put(import.meta.env.VITE_URL +
                    '/galery/' + id,
                    data
                )
                    .then((res) => {
                        navigate('/galeria')
                    })
                    .catch((err) => {
                        // COLOCAR ALERT DE ERRO!!
                    })
            } else {

                // cadastrando
                axios.post('http://localhost:3001/galery',
                    data
                ).then((res) => {
                    navigate('/galeria')
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
                    {isEdit ? "Editar Imagem" : " Adicionar Imagem"}
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
                            htmlFor="descricao"
                            className="form-label"
                        >
                            descricao
                        </label>
                        <input
                            type="descricao"
                            className="form-control"
                            id="descricao"
                            required
                            {...register('descricao')}
                        />
                        <div className="invalid-feedback">
                            {errors.descricao && errors.descricao.message}
                        </div>

                    </div>

                    <div className="col-md-12">
                        <label
                            htmlFor="imagem"
                            className="form-label"
                        >
                            imagem
                        </label>
                        <input
                            type="img"
                            className="form-control"
                            id="imagem"
                            required
                            {...register('imagem')}
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