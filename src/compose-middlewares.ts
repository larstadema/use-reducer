import { Dispatch, Middleware, Store } from 'types';

export const composeMiddlewares = <Action, State>(middlewares: Middleware<Action, State>[]) => {
  const composedMiddlewares = (store: Store<Action, State>, dispatch: Dispatch<Action>) => {
    const enhancedDispatch = middlewares.reduceRight(
      (next, middleware) => middleware(store)(next),
      dispatch
    );

    return enhancedDispatch;
  };

  return composedMiddlewares;
};
