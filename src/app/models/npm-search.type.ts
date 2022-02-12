
import { AsyncProcessStatus } from './shared.type';

export class NpmSearchState {
    public status: AsyncProcessStatus;
    public cacheResults: string[];
    public liveResults: string[];
    constructor() {
        this.cacheResults = [];
        this.liveResults = [];
    }
}

export interface NpmPackageSearchApiResponse {
    objects: {
        package: {
            name: string
        }
    }[]
}