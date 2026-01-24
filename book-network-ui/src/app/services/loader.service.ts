import { Injectable, signal } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class LoaderService {
    private readonly _isLoading = signal(false);
    public readonly isLoading = this._isLoading.asReadonly();

    show() {
        this._isLoading.set(true);
    }

    hide() {
        this._isLoading.set(false);
    }
}
