# serverless-import-swagger
Import functions from OpenAPI spec file to serverless.yml of [Serverless Framework](https://serverless.com/)  

[![Build Status](https://travis-ci.com/AKIRA-MIYAKE/serverless-import-swagger.svg?branch=master)](https://travis-ci.com/AKIRA-MIYAKE/serverless-import-swagger)

# Note

In v0.2, there are breaking changes.  
Please be careful when upgrading.  

# Install

```
$ npm install -g serverless-import-swagger
```

# Usage
## Quick start
Add a file named `openapi.yaml` on application root directory.  
Then, run following command and serverless-import-swagger generate service of Serverless Framework.  

```
$ sis
```

## Command option.
```
Usage: sis [options]

Import functions from OpenAPI spec filet to serverless.yml

Options:
  -V, --version                 output the version number
  -C, --config <path>           Specify config file path. (defailt "./sis.config.json")
  -s, --service-name <string>  Specify service name. (default "service")
  -i, --input [path]            Specify OpenAPI file path. (defailt "./openapi.ya?ml")
  -o, --out-dir <path>          Specify dist directory of services. (default "./")
  -c, --common <path>           Specify common config of serverless file path. (default "./serverless.common.ya?ml")
  -f, --force                   If add this option, overwriten serverless.yml by generated definitinos.
  -h, --help                    output usage information
```

Example
```
$ sis -i /path/to/swagger.yml -c /path/to/serverless.common.yml -o ./src
```

## `sis.config.json`
You can set options using a configuration file. By default, `sis.config.json` will be applied automatically if it exists.  

```
{
  "all": <boolean>, // Specify whether to target all of the document. (default true)
  "serviceName": <string>, // Specify service name. (default "service")
  "basePath": <boolean | { "servicePrefix": <string> }>, // Specify base path mode enabled. (defualt false)
  "input": <string[] | null>, // Specify OpenAPI file path. (defailt "./openapi.ya?ml")
  "outDir": <string | null>, // Specify dist directory of services. (default "./")
  "common": <string | null>, // Specify common config of serverless file path. (default "./serverless.common.ya?ml")
  "force": <boolean>, // Specify overwrite enabled. (default false)
  "options": {
    "cors": <boolean | any>, // Specify the addition of cors setting. Accept the format of the Serverless Framework's cors settings. (default false) 
    "optionsMethod": <boolean>, // Specify addition of options method for the path. (default false)
    "authorizer": <string | null>, // Specify AWS_IAM authorizers or custom authorizers. (default null)
    "operationId": <boolean> // Specify use of operationId in function name. (default false)
  }
}
```
The default values ​​apply to items not set.  

## Base path mode
Due to the limitations of CloudFormation, it is not possible to create a service with a large number of endpoints.   
The base path mode splits services based on the top level path.  
If base path mode is set to true, the top level path will be the service name. If you specify servicePrefix, a prefix can be added before the service name.  

## `x-sis-config`
You can use the extension of `x-sis-config` to write config in the spec file.  
The config at the top level apply to the entire file, and the config at operation parameters apply only to that function.  
If you disable `all` in config, only operations for which x-sis-config is set are imported. 

# Caution
Serverless depends on constraints of amazon web service.  
For example...

+ The maximum number of CloudFormation resources is 200. Therefore, APIs that contain many paths need to be divided using `--base-path` mode.
+ The function name of AWS Lambda must be 64 characters or less. For that reason, if long function names are generated, they can not be deployed.
+ API Gateway requires that path parameters in the same hierarchy be unique. Serverless also suffers from similar restrictions.
