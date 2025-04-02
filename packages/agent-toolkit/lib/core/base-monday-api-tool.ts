import { z, ZodRawShape, ZodTypeAny } from 'zod';
import { ApiClient } from '@mondaydotcomorg/api';
import { Tool } from './tool';

export abstract class BaseMondayApiTool<Input extends ZodRawShape> implements Tool<Input> {
  abstract name: string;
  abstract description: string;
  abstract inputSchema: Input;

  constructor(protected readonly mondayApi: ApiClient) {}

  abstract execute(input: z.objectOutputType<Input, ZodTypeAny>): Promise<string>;
}
