import { z, ZodRawShape, ZodTypeAny } from 'zod';
import { Executable } from './executable';

export interface Tool<Input extends ZodRawShape> extends Executable<Input, string> {
  name: string;
  description: string;
  inputSchema: z.objectOutputType<Input, ZodTypeAny>;
}
