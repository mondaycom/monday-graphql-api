export interface Executable<Input, Output> {
  execute: (input?: Input) => Promise<Output>;
}
