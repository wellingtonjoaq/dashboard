import React, { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { IToken } from "../../../interfaces/token";
import { verificaTokenExpirado } from "../../../services/token";
import { LayoutDashboard } from "../../../components/LayoutDashboard";
import { SubmitHandler, useForm } from "react-hook-form";
import axios from "axios";

interface IForm {
    nome: string;
    data: string;
    imagem: FileList; 
}

export default function GerenciarGaleria() {
    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue,
    } = useForm<IForm>();

    const refForm = useRef<any>();
    const navigate = useNavigate();
    const { id } = useParams();
    const [isEdit, setIsEdit] = useState<boolean>(false);

    useEffect(() => {
        const lsStorage = localStorage.getItem('casadapaz.token');
        let token: IToken | null = null;

        if (typeof lsStorage === 'string') {
            token = JSON.parse(lsStorage);
        }

        if (!token || verificaTokenExpirado(token.accessToken)) {
            navigate("/");
        }

        if (id) {
            const idGaleria = Number(id);
            if (!isNaN(idGaleria)) {
                axios.get(`http://localhost:8000/api/galerias/${idGaleria}`)
                    .then((res) => {
                        const galeria = res.data;
                        setIsEdit(true);
                        setValue("nome", galeria.nome);
                        setValue("data", galeria.data);
                        setValue("imagem", galeria.imagem);
                    })
                    .catch((err) => {
                        console.error("Erro ao carregar dados da galeria", err);
                    });
            }
        }
    }, [id, navigate, setValue]);

    const submitForm: SubmitHandler<IForm> = useCallback(
        (data) => {
            const formData = new FormData();
            formData.append('nome', data.nome);
            formData.append('data', data.data);
            
            if (data.imagem && data.imagem.length > 0) {
                formData.append('imagem', data.imagem[0]);
            }

            if (isEdit && id) {
                axios.put(`http://localhost:8000/api/galerias/${id}`, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                })
                    .then(() => {
                        navigate('/galeria'); 
                    })
                    .catch((err) => {
                        alert("Erro ao atualizar a galeria.");
                        console.error(err);
                    });
            } else {
                axios.post('http://localhost:8000/api/galerias/', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                })
                    .then((response) => {
                        navigate('/galeria'); 
                    })
                    .catch((err) => {
                        alert("Erro ao cadastrar a galeria.");
                        console.error(err);
                    });
            }
        },
        [isEdit, id, navigate]
    );

    return (
        <LayoutDashboard>
            <h1>{isEdit ? "Editar Galeria" : "Adicionar Galeria"}</h1>

            <form
                className="row g-3 needs-validation mb-3"
                noValidate
                style={{ alignItems: 'center' }}
                onSubmit={(event: React.FormEvent<HTMLFormElement>) => {
                    event.preventDefault();
                    refForm.current.classList.add('was-validated');
                    handleSubmit(submitForm)(event);
                }}
                ref={refForm}
            >
                <div className="col-md-12">
                    <label htmlFor="nome" className="form-label">Nome</label>
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Digite o nome"
                        id="nome"
                        required
                        {...register('nome', { required: 'Nome é obrigatório!' })}
                    />
                    <div className="invalid-feedback">
                        {errors.nome && errors.nome.message}
                    </div>
                </div>

                <div className="col-md-12">
                    <label htmlFor="imagem" className="form-label">Imagem</label>
                    <input
                        type="file"
                        className="form-control"
                        id="imagem"
                        accept="image/*"
                        {...register('imagem')}
                    />
                    <div className="invalid-feedback">
                        {errors.imagem && errors.imagem.message}
                    </div>
                </div>

                <div className="col-md-12">
                    <label htmlFor="data" className="form-label">Data</label>
                    <input
                        type="date"
                        className="form-control"
                        id="data"
                        required
                        {...register('data', { required: 'Informar a data é obrigatório!' })}
                    />
                    <div className="invalid-feedback">
                        {errors.data && errors.data.message}
                    </div>
                </div>

                <div className="col-md-12">
                    <button type="submit" className="btn btn-success">
                        Salvar
                    </button>
                </div>
            </form>
        </LayoutDashboard>
    );
}
