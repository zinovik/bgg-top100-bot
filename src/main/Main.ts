import { MainInterface } from './Main.interface';
import { Configuration } from './Configuration.interface';
import { DataService } from '../data/DataService.interface';
import { DataBaseService } from '../database/DataBaseService.interface';
import { ProcessService } from '../process/ProcessService.interface';
import { MessengerService } from '../messenger/MessengerService.interface';

export class Main implements MainInterface {
  constructor(
    private readonly configuration: Configuration,
    private readonly dataService: DataService,
    private readonly databaseService: DataBaseService,
    private readonly processService: ProcessService,
    private readonly messengerService: MessengerService,
  ) {
    this.configuration = configuration;
    this.dataService = dataService;
    this.databaseService = databaseService;
    this.processService = processService;
    this.messengerService = messengerService;
  }

  async sendMessage(): Promise<void> {
    console.log(`New message`);

    const newData = await this.dataService.getData();
    const oldData = await this.databaseService.getData();

    const message = this.processService.formatMessage({ newData, oldData });
    await this.messengerService.sendMessage({ chatId: this.configuration.channelId, text: message });

    await this.databaseService.setData(newData);
  }
}
