import { CommandInterface } from './models/index.js';
import { TSVFileReader } from '../../shared/index.js';
import chalk from 'chalk';

export class ImportCommand implements CommandInterface {
  public getName(): string {
    return '--import';
  }

  public execute(...parameters: string[]): void {
    const [filename] = parameters;
    const fileReader = new TSVFileReader(filename.trim());

    try {
      fileReader.read();
      console.log(fileReader.toArray());
    } catch (err) {

      if (!(err instanceof Error)) {
        throw err;
      }

      console.error(chalk.red(`Can't import data from file: ${filename}`));
      console.error(chalk.redBright(`Details: ${err.message}`));
    }
  }
}
