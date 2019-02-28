# serverless-import-swagger
Import functions from swagger spec filet to serverless.yml of [Serverless Framework](https://serverless.com/)  

# Install

```
$ npm install serverless-import-swagger
```

# Add tag to Operation Object in swagger.yaml
Add `sls-{service-name}` tag to the operation that targeted by serverless.  
Default prefix is "sls". If you want to use other prefix, call sls command with `-A` option.  

# Usage
Set `swagger.yaml` file on applicaion root directory.  
If you want to apply common configs to serverless.yml, set `serverless.common.yml` file on application root directory.   

```
Usage: sis [options]

  Import functions from swagger spec filet to serverless.yml

  Options:

    -h, --help                     output usage information
    -V, --version                  output the version number

    # Common options.
    -i, --input <path1>[,<path2>...,<pathN>]
                                   Specify swagger file paths. (defailt "./swagger.ya?ml")
                                   If multiple paths separated by comma given, merged result is produced.
    -c, --common <path>            Specify common config of serverless file path. (default "./serverless.common.ya?ml")
    -o, --out-dir <path>           Specify dist directory of services. (default "./")
    -f, --force                    If add this option, overwriten serverless.yml by generated definitinos.

    # Services and tags prefix options.
    -A, --api-prefix <prefix>      Specify target prefix for swagger tags. (default "sls")
    -S, --service-prefix <prefix>  Specify prefix that added service name. (default none)

    # Base path mode that spliting large api specification settings.
    -B, --base-path                If add this option, run in a mode of dividing a service by a api base path.

    # CORS and OPTIONS method settings.
    -C, --cors                     If add this option, added cors setting to all http event.
    -O, --options-method           If add this option, added cors setting to get http event, and added OPTIONS method to api path that including other http method.

    # Other settings.
    --operation-id                 If this option is added and an API has operationId, the function is named from operationId.
```

Example
```
$ sis -i /path/to/swagger.yml -c /path/to/serverless.common.yml -o ./src
```

# Caution
Serverless depends on constraints of amazon web service.  
For example...

+ The maximum number of CloudFormation resources is 200. Therefore, APIs that contain many paths need to be divided using `--base-path` mode.
+ The function name of AWS Lambda must be 64 characters or less. For that reason, if long function names are generated, they can not be deployed.
+ API Gateway requires that path parameters in the same hierarchy be unique. Serverless also suffers from similar restrictions.
