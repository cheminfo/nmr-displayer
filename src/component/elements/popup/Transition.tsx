import { CSSProperties, ReactNode, useRef } from 'react';
import { Transition as ContainerTransition } from 'react-transition-group';

import { transitions } from './options';

const duration = 250;

const defaultStyle: Record<string, CSSProperties> = {
  [transitions.FADE]: {
    transition: `opacity ${duration}ms ease`,
    opacity: 0,
  },
  [transitions.SCALE]: {
    transform: 'scale(1)',
    transition: `all ${duration}ms ease-in-out`,
  },
};

type TransitionStyles = Record<
  string,
  Partial<{
    entering: CSSProperties;
    entered: CSSProperties;
    exiting: CSSProperties;
    exited: CSSProperties;
  }>
>;

const defaultTransitionStyles: TransitionStyles = {
  [transitions.FADE]: {
    entering: { opacity: 0 },
    entered: { opacity: 1 },
  },
  [transitions.SCALE]: {
    entering: { transform: 'scale(0)' },
    entered: { transform: 'scale(1)' },
    exiting: { transform: 'scale(0)' },
    exited: { transform: 'scale(1)' },
  },
};

interface TransitionProps {
  children: ReactNode;
  type: string;
  transitionStyles?: TransitionStyles;
}

export default function Transtion({
  children,
  type,
  transitionStyles = defaultTransitionStyles,
  ...props
}: TransitionProps) {
  const ref = useRef(null);
  return (
    <ContainerTransition nodeRef={ref} {...props} timeout={duration}>
      {(state) => (
        <div
          ref={ref}
          style={{
            ...defaultStyle[type],
            ...transitionStyles[type][state],
            ...transitionStyles.default,
          }}
        >
          {children}
        </div>
      )}
    </ContainerTransition>
  );
}
