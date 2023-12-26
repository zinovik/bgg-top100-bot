export interface Data {
    games: Array<{
        id: string;
        rank: number;
        name: string;
        year: string;
    }>;
    date: string;
}
