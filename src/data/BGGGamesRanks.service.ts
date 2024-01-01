import { GoogleAuth, IdTokenClient } from 'google-auth-library';
import { DataService } from './DataService.interface';
import { Data } from '../common/model/Data.interface';

export class BGGGamesRanksService implements DataService {
    private client: Promise<IdTokenClient>;

    constructor(private readonly parserUrl: string) {
        const auth = new GoogleAuth();
        this.client = auth.getIdTokenClient(this.parserUrl);
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
