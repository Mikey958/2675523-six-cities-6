import { CommandInterface } from './models/index.js';
import {
  createOffer,
  getErrorMessage,
  TSVFileReader
} from '../../shared/index.js';
import chalk from 'chalk';

export class ImportCommand implements CommandInterface {
  public getName(): string {
    return '--import';
  }

  public async execute(...parameters: string[]): Promise<void> {
    const [filename] = parameters;
    const fileReader = new TSVFileReader(filename.trim());

    fileReader.on('line', this.onImportedLine);
    fileReader.on('end', this.onCompleteImport);

    try {
      await fileReader.read();
    } catch (error) {
      console.error(chalk.red(`Can't import data from file: ${filename}`));
      console.error(chalk.redBright(`Details: ${getErrorMessage(error)}`));
    }
  }

  private onImportedLine(line: string) {
    const offer = createOffer(line);
    console.info(offer);
  }

  private onCompleteImport(count: number) {
    console.info(chalk.green(`${count} rows imported`));
  }
}
