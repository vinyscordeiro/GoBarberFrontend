import React from 'react';
import { useTransition } from 'react-spring';

import Toast from './Toast/index';
import { ToastMessage } from '../../hooks/ToastContext';
import {} from '../../hooks/ToastContext';
import { Container } from './styles';

interface ToastContainerProps{
  messages: ToastMessage[];
}

const ToastContainer: React.FC<ToastContainerProps> = ({ messages }) => {
const messageWithTransitions = useTransition(
  messages,
  message => message.id,
  {
    from: { right: '-120%', opacity: 0 },
    enter: { right: '0%', opacity: 1 },
    leave: { right: '-120%', opacity: 0},
  },
);

  return (
    <Container>
      {messageWithTransitions.map(({ item, key, props }) => (
        <Toast key={key} message={item} style={props}/>
        // Aqui a ordem tem que ser a mesma pois se colocar o estile antes
        // pode dar um problema.
      )
    )
  }
    </Container>
  )
};

export default ToastContainer;
