import React, { useCallback, useRef, ChangeEvent } from 'react';
import {  FiMail, FiLock, FiUser, FiCamera, FiArrowLeft } from 'react-icons/fi';
import { Form } from '@unform/web';
import { FormHandles } from '@unform/core';
import * as Yup from 'yup';
import {  useHistory, Link } from 'react-router-dom'

import api from '../../services/api';
import Button from '../../components/Button/index';
import Input from '../../components/Input/index';
import getValidationErrors from '../../utils/getValidationErrors';
import { useToast } from '../../hooks/ToastContext';

import { Container, Content, AvatarInput } from './styles';
import { useAuth } from '../../hooks/AuthContext';

interface ProfileFormData{
  name: string;
  email: string;
  old_password: string;
  password: string;
  password_confirmation: string;

}

const Profile: React.FC = () => {
  const formRef = useRef<FormHandles>(null);
  const { addToast } = useToast();
  const history = useHistory();

  const  { user, updateUser } = useAuth();

  const handleSubmit = useCallback(async(data: ProfileFormData) => {
    
    try{
      formRef.current?.setErrors({});

      const schema = Yup.object().shape({
        name: Yup.string().required('Nome obrigatório'),
        email: Yup.string()
          .required('Email obrigatório')
          .email('Digite um email válido'),
        old_password: Yup.string(),
        password: Yup.string().when('old_password', {
          is: val => !!val.length,
          then: Yup.string().required('Campo obrigatório'),
          otherwise: Yup.string(),
        }),
        password_confirmation:  Yup.string()
        .when('old_password', {
          is: val => !!val.length,
          then: Yup.string().required('Campo obrigatório'),
          otherwise: Yup.string(),
        })
        .oneOf(
          [Yup.ref('password'), undefined],
          'Senhas precisam ser iguais',
        ),
      });

      await schema.validate(data, { abortEarly: false });

      const {name, email, old_password, password, password_confirmation} = data;
      
      const formData = {
        name,
        email,
       ...(old_password
          ? {
              old_password,
              password,
              password_confirmation,
            } 
          : {}),
          };

      const response = await api.put('/profile', formData);

      updateUser(response.data);

      addToast({
        type: 'sucess',
        title: 'Perfil Atualizado',
        description: 'Informações do perfil foram atualizadas com sucesso'
      });

      history.push('/dashboard');

    }catch(err){
      console.log(err);
      if(err instanceof Yup.ValidationError){
        const errors = getValidationErrors(err);
        formRef.current?.setErrors(errors);
        return;
      }
      addToast({
        type: 'error',
        title: 'Erro na atualização',
        description: 'Verifique seus dados e tente novamente',
      });
    }
  },[addToast, history, updateUser]);
  

  const handleAvatarChange = useCallback((e: ChangeEvent<HTMLInputElement>)=> {
    if(e.target.files){
      const data = new FormData();

      data.append('avatar', e.target.files[0]);
      
      api.patch('users/avatar', data).then(response => {
        updateUser(response.data);
        addToast({
          type: 'sucess',
          title:'Avatar atualizado',
        });
      });
    }
  }, [addToast, updateUser]);

  return (
    <Container>
      <header>
        <div>
          <Link to="/dashboard">
            <FiArrowLeft/>
          </Link>
        </div>
      </header>
    <Content>
        <Form ref={formRef} initialData={{
          name: user.name,
          email: user.email,
        }} onSubmit={handleSubmit}>
          <AvatarInput>
            <img src={user.avatar_url} alt={user.name}/> 
            <label htmlFor="avatar">
              <FiCamera />
              <input type="file" id="avatar" onChange={handleAvatarChange}/>
            </label>
          </AvatarInput>

          <h1>Meu Perfil</h1>
          
          <Input 
            name="name" 
            icon={FiUser} 
            type="text" 
            placeholder="Nome"
          />

          <Input 
            name="email" 
            icon={FiMail} 
            type="text" 
            placeholder="Email"
          />

          <Input 
            containerStyle={{ marginTop: 24 }}
            name="old_password" 
            icon={FiLock} 
            type="password" 
            placeholder="Senha antiga"
          />

          <Input 
            name="password" 
            icon={FiLock} 
            type="password" 
            placeholder="Nova senha"
          />

          <Input 
            name="password_confirmation" 
            icon={FiLock} 
            type="password" 
            placeholder="Confirmar nova senha"
          />



          <Button type="submit">Confirmar mudanças</Button>
        </Form>

      
    </Content>
  </Container>
  );
};

export default Profile;
