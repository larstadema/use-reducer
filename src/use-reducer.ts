import { MutableRefObject, useCallback, useRef, useState, useMemo } from 'react';

import { composeMiddlewares } from './compose-middlewares';
import { Dispatch, Middleware } from './types';
import { useSkipInitialEffect } from './use-skip-initial-effect';

export const useReducer = <Action, State>(
  reducer: (state: State, action: Action) => State,
  initialState: State,
  middlewares: Middleware<Action, State>[] = []
): [State, Dispatch<Action>] => {
  const composedMiddleware = useMemo(() => composeMiddlewares<Action, State>(middlewares), [
    middlewares,
  ]);

  const stateRef = useRef(initialState);
  const [, forceUpdate] = useState(stateRef.current);

  const dispatch = useCallback(
    (action: Action) => {
      stateRef.current = reducer(stateRef.current, action);

      forceUpdate(stateRef.current);

      return action;
    },
    [reducer]
  );

  const dispatchRef: MutableRefObject<Dispatch<Action>> = useRef(
    composedMiddleware(
      {
        getState: () => stateRef.current,
        dispatch: (...args: [Action]) => dispatchRef.current(...args),
      },
      dispatch
    )
  );

  // Only update enhanced dispatch after the first run
  useSkipInitialEffect(() => {
    dispatchRef.current = composedMiddleware(
      {
        getState: () => stateRef.current,
        dispatch: (...args: [Action]) => dispatchRef.current(...args),
      },
      dispatch
    );
  }, [dispatch]);

  return [stateRef.current, dispatchRef.current];
};
