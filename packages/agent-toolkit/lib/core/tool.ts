import { z, ZodRawShape, ZodTypeAny } from 'zod';
import { Executable } from './executable';

export type ToolInputType<Input extends ZodRawShape | undefined> = Input extends ZodRawShape
  ? z.objectOutputType<Input, ZodTypeAny>
  : undefined;

export type ToolOutputType<T extends Record<string, unknown>> = {
  content: string;
  metadata?: T;
};

export enum ToolType {
  QUERY = 'query',
  MUTATION = 'mutation',
  ALL_API = 'all_api',
}

export interface Tool<Input extends ZodRawShape | undefined, Output extends Record<string, unknown> = never>
  extends Executable<ToolInputType<Input>, ToolOutputType<Output>> {
  name: string;
  type: ToolType;

  getDescription(): string;
  getInputSchema(): Input;
}
