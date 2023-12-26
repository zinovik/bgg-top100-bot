import { GoogleAuth, IdTokenClient } from 'google-auth-library';
import { DataService } from './DataService.interface';
import { Data } from '../common/model/Data.interface';

const URL =
    'https://us-central1-zinovik-project.cloudfunctions.net/bgg-games-ranks-parser';

export class BGGGamesRanksService implements DataService {
    private client: Promise<IdTokenClient>;

    constructor() {
        const auth = new GoogleAuth();
        this.client = auth.getIdTokenClient(URL);
    }

    async getData(): Promise<Data> {
        const { data }: { data: Data } = await (
            await this.client
        ).request<Data>({
            url: `${URL}?amount=100`,
            method: 'GET',
        });

        return data;
    }
}
