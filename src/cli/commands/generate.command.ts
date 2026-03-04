import {CommandInterface} from './models/index.js';
import {
  getErrorMessage,
  MockServerData, TSVFileWriter,
  TSVOfferGenerator
} from '../../shared/index.js';
import got from 'got';
import chalk from 'chalk';

export class GenerateCommand implements CommandInterface {
  private initialData!: MockServerData;

  public getName(): string {
    return '--generate';
  }

  public async execute(...params: string[]): Promise<void> {
    const [count, filePath, url] = params;
    const offerCount = Number.parseInt(count, 10);

    try {
      await this.load(url);
      await this.write(filePath, offerCount);
      console.info(chalk.green(`File ${filePath} was created`));
    } catch (error: unknown) {
      console.error(chalk.red('Can\'t generate data'));
      console.error(chalk.red(getErrorMessage(error)));
    }
  }

  private async load(url: string) {
    try {
      this.initialData = await got.get(url).json();
    } catch {
      throw new Error(`Can't load data from ${url}`);
    }
  }

  private async write(filepath: string, offerCount: number) {
    const tsvOfferGenerator = new TSVOfferGenerator(this.initialData);
    const tsvFileWriter = new TSVFileWriter(filepath);

    for (let i = 0; i < offerCount; i++) {
      await tsvFileWriter.write(tsvOfferGenerator.generate());
    }
  }
}
