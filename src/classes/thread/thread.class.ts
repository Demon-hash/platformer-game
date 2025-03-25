import { BehaviorSubject, type Observable } from 'rxjs';
import type { ThreadEvent } from './types';

export class Thread {
    private readonly _thread: Worker | SharedWorker;
    private readonly _data = new BehaviorSubject<unknown>([]);

    constructor(thread: Worker | SharedWorker) {
        this._thread = thread;

        this._listenForData();
        this._start();
    }

    detach() {
        if (this._thread instanceof Worker) {
            return this._thread.terminate();
        }

        this._thread.port.close();
    }

    send({ type, data }: ThreadEvent) {
        this._getAccess().postMessage({ message: { type, data } });
    }

    get(): Observable<unknown> {
        return this._data;
    }

    private _start() {
        if (this._thread instanceof SharedWorker) {
            this._thread.port.addEventListener('error', console.log);
            this._thread.port.start();
        }
    }

    private _getAccess() {
        return this._thread instanceof Worker ? this._thread : this._thread.port;
    }

    private _listenForData() {
        this._getAccess().onmessage = (message) => this._data.next(message.data);
    }
}
