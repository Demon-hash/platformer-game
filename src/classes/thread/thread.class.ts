import { BehaviorSubject, type Observable } from 'rxjs';
import type { ThreadEvent } from './types';

export class Thread {
    private readonly thread: Worker;
    private readonly data = new BehaviorSubject<unknown>([]);

    constructor(thread: Worker) {
        this.thread = thread;
        this.thread.onmessage = (message) => this.data.next(message.data);
    }

    detach() {
        if (this.thread instanceof Worker) {
            this.thread.terminate();
        }
    }

    send({ type, data }: ThreadEvent) {
        this.thread.postMessage({
            message: {
                type,
                data,
            },
        });
    }

    get(): Observable<unknown> {
        return this.data;
    }
}
