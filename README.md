# serverless-import-swagger
Import functions from swagger spec filet to serverless.yml

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
    -f, --force                    If add this option, overwriten serverless.yml by generated definitinos.
```

Example
```
$ sis -i /path/to/swagger.yml -c /path/to/serverless.common.yml -o ./src
```
