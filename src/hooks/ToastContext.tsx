import React, { createContext, useCallback, useContext, useState } from 'react';
import ToastContainer from '../components/ToastContainer/index';


import { uuid } from 'uuidv4';

export interface ToastMessage {
  id: string;
  type?: 'sucess' | 'error' | 'info';
  title: string;
  description?: string;
}

interface ToastContextData {
  addToast(message: Omit<ToastMessage,'id'>): void;
  rmToast(id: string): void;
}

const ToastContext = createContext<ToastContextData>({} as ToastContextData);

const ToastProvider: React.FC = ({children}) => {
  const [messages, setMessages] = useState<ToastMessage[]>([]);
  
  const addToast = useCallback(
    ({ type, title, description}: Omit<ToastMessage,'id'>)=>{
  const id = uuid();
  // Aqui foi utilizado para gerar o uuid e embaixo para o toast.

    const toast = {
      id,
      type,
      title,
      description,
    }
    setMessages((oldMessages) => [...messages, toast]);

  },[messages]);

  const rmToast = useCallback((id: string) => {
    setMessages((state) => state.filter(message => message.id !== id));
  },[]);

  return (
    <ToastContext.Provider value={{ addToast, rmToast }}>
      {children}
      <ToastContainer messages={messages}/>
    </ToastContext.Provider>
  );
}

function useToast(): ToastContextData {
  const context = useContext(ToastContext);
  if(!context){
    throw new Error('useToast must be used within a Toast Provider');
  }
  return context;
}

export { ToastProvider, useToast };
