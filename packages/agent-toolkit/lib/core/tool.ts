import { z, ZodRawShape, ZodTypeAny } from 'zod';
import { Executable } from './executable';

export type ToolInputType<Input extends ZodRawShape> = z.objectOutputType<Input, ZodTypeAny>;

export type ToolOutputType<T extends Record<string, unknown>> = {
  content: string;
  metadata?: T;
};

export enum ToolType {
  QUERY = 'query',
  MUTATION = 'mutation',
}

export interface Tool<Input extends ZodRawShape, Output extends Record<string, unknown> = never>
  extends Executable<ToolInputType<Input>, ToolOutputType<Output>> {
  name: string;
  type: ToolType;
  
  getDescription(): string;
  getInputSchema(): Input;
}
