# serverless-import-swagger
Import functions from swagger spec filet to serverless.yml

# Install

```
$ npm install serverless-import-swagger
```

# Add tag to Operation Object in swagger.yaml
Add `sls-{service-name}` tag to the operation that targeted by serverless.  
Default prefix is "sls". If you want to use other prefix, call sls command with `-p` option.  

# Usage
Set `swagger.yaml` file on applicaion root directory.  
If you want to apply common configs to serverless.yml, set `serverless.common.yml` file on application root directory.   

```
$ sis [options]  
```

Options:  
  -i, --input <path>   specify swagger file path  
  -c, --common <path>  specify common config of serverless file path  
  -o, --outDir <path>  specify dist directory of service  
  -p, --prefix <prefix>   specify target prefix (default "sls")

Example
```
$ sis -i /path/to/swagger.yml -c /path/to/serverless.common.yml -o ./src
```
