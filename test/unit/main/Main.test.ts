import { IMock, Mock } from 'typemoq';

import { Main } from '../../../src/main/Main';
import { DataService } from '../../../src/data/DataService.interface';
import { DataBaseService } from '../../../src/database/DataBaseService.interface';
import { ProcessService } from '../../../src/process/ProcessService.interface';
import { MessengerService } from '../../../src/messenger/MessengerService.interface';

const CHANNEL_ID = '@testChannelId';

describe('Main', () => {
  let dataServiceMock: IMock<DataService>;
  let dataBaseServiceMock: IMock<DataBaseService>;
  let processServiceMock: IMock<ProcessService>;
  let messengerServiceMock: IMock<MessengerService>;

  let main: Main;

  beforeEach(() => {
    dataServiceMock = Mock.ofType<DataService>();
    dataBaseServiceMock = Mock.ofType<DataBaseService>();
    processServiceMock = Mock.ofType<ProcessService>();
    messengerServiceMock = Mock.ofType<MessengerService>();

    const configuration = {
      channelId: CHANNEL_ID,
    };

    main = new Main(
      configuration,
      dataServiceMock.object,
      dataBaseServiceMock.object,
      processServiceMock.object,
      messengerServiceMock.object,
    );
  });

  afterEach(() => {
    dataServiceMock.verifyAll();
    dataBaseServiceMock.verifyAll();
    processServiceMock.verifyAll();
    messengerServiceMock.verifyAll();
  });

  it('Should process message', async () => {
    // Arrange

    // Act
    main.sendMessage();

    // Assert
    expect(true).toBeTruthy();
  });
});
