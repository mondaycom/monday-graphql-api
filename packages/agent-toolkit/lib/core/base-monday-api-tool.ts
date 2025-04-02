import { z, ZodRawShape, ZodTypeAny } from 'zod';
import { ApiClient } from '@mondaydotcomorg/api';
import { ToolInputType, ToolOutputType, Tool, ToolType } from './tool';

export abstract class BaseMondayApiTool<Input extends ZodRawShape, Output extends Record<string, unknown> = never> implements Tool<Input, Output> {
  abstract name: string;
  abstract type: ToolType;

  constructor(protected readonly mondayApi: ApiClient) {}

  abstract getDescription(): string;
  abstract getInputSchema(): Input;
  abstract execute(input: ToolInputType<Input>): Promise<ToolOutputType<Output>>;
}
