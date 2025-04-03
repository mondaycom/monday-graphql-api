import { ParsedArgs, ValidatedArgs } from './args.types.js';
import { ARG_CONFIGS } from './args.config.js';

/**
 * Parse command line arguments based on the defined configurations
 * @param args Command line arguments (process.argv.slice(2))
 * @returns Object with parsed arguments
 */
export function parseArgs(args: string[]): ParsedArgs {
  const result: ParsedArgs = {};

  ARG_CONFIGS.forEach((config) => {
    let argValue: string | undefined;
    for (const flag of config.flags) {
      const flagIndex = args.findIndex((arg) => arg === flag);
      if (flagIndex !== -1 && flagIndex + 1 < args.length) {
        argValue = args[flagIndex + 1];
        break;
      }
    }

    result[config.name] = argValue;
  });

  return result;
}

/**
 * Validates required arguments and displays error messages for missing ones
 * @param parsedArgs The parsed arguments to validate
 * @returns Strongly typed validated arguments
 */
export function validateArgs(parsedArgs: ParsedArgs): ValidatedArgs {
  const missingArgs = ARG_CONFIGS.filter((config) => config.required && !parsedArgs[config.name]);

  if (missingArgs.length > 0) {
    console.error('Error: The following required arguments are missing:');

    missingArgs.forEach((config) => {
      console.error(`  - ${config.name}: ${config.description}`);
      console.error('    You can provide it using:');

      const flagsString = config.flags.join(' or ');
      console.error(`     ${flagsString} command line argument`);
    });

    process.exit(1);
  }

  // At this point, all required args are present, so we can safely cast
  return parsedArgs as unknown as ValidatedArgs;
}
