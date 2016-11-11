# serverless-import-swagger
Import functions from swagger spec filet to serverless.yml

# Install

```
$ npm install serverless-import-swagger
```

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

Example
```
$ sis -i /path/to/swagger.yml -c /path/to/serverless.common.yml -o ./src
```
