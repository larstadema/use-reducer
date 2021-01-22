export type Dispatch<Action> = (action: Action) => void;

export interface Store<Action, State> {
  getState: () => State;
  dispatch: Dispatch<Action>;
}

export type Middleware<Action, State> = (
  store: Store<Action, State>
) => (next: Dispatch<Action>) => (action: Action) => void;
