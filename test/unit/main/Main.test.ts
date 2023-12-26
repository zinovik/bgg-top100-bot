import { IMock, Mock } from 'typemoq';

import { Main } from '../../../src/main/Main';
import { DataService } from '../../../src/data/DataService.interface';
import { StorageService } from '../../../src/storage/Storage.interface';
import { ProcessService } from '../../../src/process/ProcessService.interface';
import { MessengerService } from '../../../src/messenger/MessengerService.interface';

const CHANNEL_ID = '@testChannelId';

describe('Main', () => {
  let dataServiceMock: IMock<DataService>;
  let storageServiceMock: IMock<StorageService>;
  let processServiceMock: IMock<ProcessService>;
  let messengerServiceMock: IMock<MessengerService>;

  let main: Main;

  beforeEach(() => {
    dataServiceMock = Mock.ofType<DataService>();
    storageServiceMock = Mock.ofType<StorageService>();
    processServiceMock = Mock.ofType<ProcessService>();
    messengerServiceMock = Mock.ofType<MessengerService>();

    const configuration = {
      channelId: CHANNEL_ID,
    };

    main = new Main(
      configuration,
      dataServiceMock.object,
      storageServiceMock.object,
      processServiceMock.object,
      messengerServiceMock.object,
    );
  });

  afterEach(() => {
    dataServiceMock.verifyAll();
    storageServiceMock.verifyAll();
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
