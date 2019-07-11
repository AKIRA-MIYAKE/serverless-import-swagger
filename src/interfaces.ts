export interface CLIOptions {
  config?: string;
  serviceName?: string;
  input?: string[];
  outDir?: string;
  common?: string;
  force?: boolean;
}

export interface ConfFileConfig {
  all?: boolean;
  serviceName?: string;
  basePath?: boolean | { servicePrefix: string };
  input?: string[] | null;
  outDir?: string | null;
  common?: string | null;
  force?: boolean;
  options?: FunctionOptions;
}

export interface DocumentConfig {
  all?: boolean;
  serviceName?: string;
  basePath?: boolean | { servicePrefix: string };
  options?: FunctionOptions;
}

export interface OperationConfig {
  serviceName?: string;
  options?: FunctionOptions;
}

export interface FunctionOptions {
  cors?: boolean | any;
  optionsMethod?: boolean;
  authorizer?: string | null;
  operationId?: boolean;
}

export interface InternalConfig {
  all: boolean;
  serviceName: string;
  basePath: boolean | { servicePrefix: string };
  input: string[] | null;
  outDir: string | null;
  common: string | null;
  force: boolean;
  options: InternalFunctionOptions;
}

export interface InternalFunctionOptions {
  cors: boolean | any;
  optionsMethod: boolean;
  authorizer: string | null;
  operationId: boolean;
}

export interface SlsService {
  service: string;
  functions: { [key: string]: SlsFunction };
}

export interface SlsFunction {
  handler: string;
  events: SlsHttpEvent[];
}

export interface SlsHttpEvent {
  http: {
    path: string;
    method: string;
    integration: string;
    cors?: any;
    authorizer?: string;
  };
}
