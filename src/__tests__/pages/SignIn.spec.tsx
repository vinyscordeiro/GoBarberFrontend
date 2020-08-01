import React from 'react';
import SignIn from '../../pages/SignIn';
import { render, fireEvent, wait } from '@testing-library/react';

const mockedHistoryPush = jest.fn();
const mockedSignIn = jest.fn();
const mockedAddToast = jest.fn();

jest.mock('react-router-dom', ()=> {
  return {
    useHistory: () => ({
      push: mockedHistoryPush,
    }),
    Link: ({ children }: { children: React.ReactNode }) => children,
  };
});

jest.mock('../../hooks/AuthContext', () => {
  return {
    useAuth: () => ({
      signIn: mockedSignIn,
    }),
  }
});


jest.mock('../../hooks/ToastContext', () => {
  return {
    useToast: () => ({
      addToast: mockedAddToast,
    })
  }
});

describe('SignIn Page', () => {
  beforeEach(()=> {
    mockedHistoryPush.mockClear();
  })
  it('Should be able to  SignIn', async ()=> {
    const { getByPlaceholderText, getByText } = render(<SignIn />);
    
    const emailField = getByPlaceholderText('Email');
    const passwordField = getByPlaceholderText('Senha');
    const ButtonElement = getByText('Entrar');

    fireEvent.change(emailField, { target: { value: 'johndoe@example.com'}});
    fireEvent.change(passwordField, { target: { value: '123456'}});

    fireEvent.click(ButtonElement);

    await wait(() => {
      expect(mockedHistoryPush).toHaveBeenCalledWith('/dashboard'); 
    });

  });

  it('Should not be able to SignIn with invalid credentials', async ()=> {
    const { getByPlaceholderText, getByText } = render(<SignIn />);
    
    const emailField = getByPlaceholderText('Email');
    const passwordField = getByPlaceholderText('Senha');
    const ButtonElement = getByText('Entrar');

    fireEvent.change(emailField, { target: { value: 'not-valid-email'}});
    fireEvent.change(passwordField, { target: { value: '123456'}});

    fireEvent.click(ButtonElement);

    await wait(() => {
      expect(mockedHistoryPush).not.toHaveBeenCalled(); 
    });
  });
  

  it('Should display erros if login fails', async ()=> {
    mockedSignIn.mockImplementation(()=> {
      throw new Error();
    })

    const { getByPlaceholderText, getByText } = render(<SignIn />);
    
    const emailField = getByPlaceholderText('Email');
    const passwordField = getByPlaceholderText('Senha');
    const ButtonElement = getByText('Entrar');

    fireEvent.change(emailField, { target: { value: 'johndoe@example.com'}});
    fireEvent.change(passwordField, { target: { value: '123456'}});

    fireEvent.click(ButtonElement);

    await wait(() => {
      expect(mockedAddToast).toHaveBeenCalled(); 
    });
  });
});
