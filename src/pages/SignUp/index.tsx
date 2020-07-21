import React, { useCallback, useRef } from 'react';
import { FiArrowLeft, FiMail, FiLock, FiUser } from 'react-icons/fi';
import { Form } from '@unform/web';
import { FormHandles } from '@unform/core';
import * as Yup from 'yup';
import { Link, useHistory } from 'react-router-dom'

import api from '../../services/api';
import Button from '../../components/Button/index';
import Input from '../../components/Input/index';
import logoImg from '../../assets/logo.svg';
import getValidationErrors from '../../utils/getValidationErrors';
import { useToast } from '../../hooks/ToastContext';

import { Container, Content, Background, AnimationContainer } from './styles';

interface SignUpFormData{
  name: string;
  email: string;
  password: string;
}

const SignUp: React.FC = () => {
  const formRef = useRef<FormHandles>(null);
  const { addToast } = useToast();
  const history = useHistory();

  console.log(formRef);

  const handleSubmit = useCallback(async(data: SignUpFormData) => {
    
    try{
      formRef.current?.setErrors({});
      const schema = Yup.object().shape({
        name: Yup.string().required('Nome obrigatório'),
        email: Yup.string()
          .required('Email obrigatório')
          .email('Digite um email válido'),
        password: Yup.string()
          .required('Senha obrigatória')
          .min(6,'Mínimo de 6 caracteres'),
      });

      await schema.validate(data, { abortEarly: false });

      await api.post('/users', data);
      addToast({
        type: 'sucess',
        title: 'Usuário Cadastrado',
        description: 'Já podes fazer seu login no GoBarber'
      });
      history.push('/');

    }catch(err){
      console.log(err);
      if(err instanceof Yup.ValidationError){
        const errors = getValidationErrors(err);
        formRef.current?.setErrors(errors);
        return;
      }
      addToast({
        type: 'error',
        title: 'Erro no cadastro',
        description: 'Verifique seus dados',
      });
    }
  },[addToast, history]);
  
  return (
    <Container>
    <Background/>
    <Content>
      <AnimationContainer>
        <img src={logoImg} alt="GoBarber"/>
        
        <Form ref={formRef} onSubmit={handleSubmit}>
          <h1>Faça seu Cadastro</h1>
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
            name="password" 
            icon={FiLock} 
            type="password" 
            placeholder="Senha"
          />

          <Button type="submit">Cadastrar</Button>
        </Form>

        <Link to="/">
          <FiArrowLeft/>
          Voltar para logon
        </Link>
        </AnimationContainer>
    </Content>
  </Container>
  );
};

export default SignUp;
