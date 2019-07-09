import commander from 'commander';
import _ from 'lodash';

import { CLIOptions, SlsService } from './interfaces';

import prepareConfig from './functions/prepare-config';
import loadAPIDocuments from './functions/load-api-documents';
import convert from './functions/convert';
import generateServicesIfNeeded from './functions/generate-services-if-needed';
import loadCommonConfig from './functions/load-common-config';
import loadExistsServices from './functions/load-exists-services';
import mergeService from './functions/merge-service';
import writeServices from './functions/write-services';

commander
  .version('0.2.0')
  .description('Import functions from swagger spec filet to serverless.yml')
  .option(
    '-C, --config <path>',
    'Specify config file path. (defailt "./sis.config.json")'
  )
  .option(
    '-s, --service-name <strinng>',
    'Specify service name. (default "service")'
  )
  .option(
    '-i, --input [path]',
    'Specify swagger file path. (defailt "./swagger.ya?ml")',
    (item, acc) => (!acc ? [item] : [...acc, item]),
    undefined
  )
  .option(
    '-o, --out-dir <path>',
    'Specify dist directory of services. (default "./")'
  )
  .option(
    '-c, --common <path>',
    'Specify common config of serverless file path. (default "./serverless.common.ya?ml")'
  )
  .option(
    '-f, --force',
    'If add this option, overwriten serverless.yml by generated definitinos.'
  )
  .parse(process.argv);

const exec = async (com: any): Promise<void> => {
  const cliOptions: CLIOptions = {
    config: com.config,
    serviceName: com.serviceName,
    input: com.input,
    outDir: com.outDir,
    common: com.common,
    force: com.force,
  };

  const config = await prepareConfig(cliOptions);
  const apiDocuments = await loadAPIDocuments(config);
  const services = await convert(apiDocuments, config);

  await generateServicesIfNeeded(services, config);

  const common = await loadCommonConfig(config);
  const existsArray = await loadExistsServices(services, config);

  const mergedServices = (_.zip(services, existsArray) as Array<
    [SlsService, SlsService]
  >).map(([service, exists]) => mergeService(service, exists, common, config));

  await writeServices(mergedServices, config);

  // tslint:disable-next-line
  console.log('Import success.');
};

// tslint:disable-next-line
exec(commander).catch(error => console.error(error));
