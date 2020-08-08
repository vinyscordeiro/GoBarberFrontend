import React, { useEffect } from 'react';

import { FiAlertCircle, FiCheckCircle, FiInfo, FiXCircle } from 'react-icons/fi';
import { ToastMessage, useToast } from '../../../hooks/ToastContext';
import { Container } from './styles';

interface ToastProps {
  message: ToastMessage;
  style: object;
}

const icons = {
  info: <FiInfo size={24} />,
  error: <FiAlertCircle size={24} />,
  sucess: <FiCheckCircle size={24} />,
}

const Toast:React.FC<ToastProps> = ({ message, style }) => {
  const { rmToast } = useToast();

  useEffect(() => {
    const timer = setTimeout(() => {
      rmToast(message.id);
    }, 3000 );
    return () => {
      clearTimeout(timer);
      // Toda vez que utiliza o return no useEffect ela é automaticamente 
      //executada quando o objeto é removido.
    }
  },[ rmToast, message.id ]);

  return(
    <Container 
      type={message.type} 
      hasdescription={Number(!!message.description ? 1 : 0)} 
      style={style}
    >
      {icons[message.type || 'info']}
      <div>
      <strong>{message.title}</strong>
        {message.description && <p>{message.description}</p>}
      </div>
      <button onClick={() => rmToast(message.id)} type="button">
        <FiXCircle size={18}/>
      </button>
    </Container>
  );
};

export default Toast;
