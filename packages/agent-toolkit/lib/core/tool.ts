import { z, ZodRawShape, ZodTypeAny } from 'zod';
import { Executable } from './executable';

export type InputType<Input extends ZodRawShape> = z.objectOutputType<Input, ZodTypeAny>;

export enum ToolType {
  QUERY = 'query',
  MUTATION = 'mutation',
}

export interface Tool<Input extends ZodRawShape> extends Executable<Input, string> {
  name: string;
  description: string;
  inputSchema: InputType<Input>;
  type: ToolType;
}
