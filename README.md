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
    -i, --input <path>             Specify swagger file path. (defailt "./swagger.ya?ml")
    -c, --common <path>            Specify common config of serverless file path. (default "./serverless.common.ya?ml")
    -o, --out-dir <path>           Specify dist directory of services. (default "./")
    -A, --api-prefix <prefix>      Specify target prefix for swagger tags. (default "sls")
    -S, --service-prefix <prefix>  Specify prefix that added service name. (default none)
    -B, --base-path                If add this option, run in a mode of dividing a service by a api base path.
    -f, --force                    If add this option, overwriten serverless.yml by generated definitinos.
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
