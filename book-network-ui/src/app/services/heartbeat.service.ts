import { Injectable, NgZone, Inject, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { isPlatformBrowser } from '@angular/common';
import { ApiConfiguration } from './api-configuration';

@Injectable({
    providedIn: 'root'
})
export class HeartbeatService {
    private readonly HEARTBEAT_INTERVAL = 60 * 1000; // 9 minutes

    constructor(
        private http: HttpClient,
        private config: ApiConfiguration,
        private zone: NgZone,
        @Inject(PLATFORM_ID) private platformId: any
    ) { }

    startHeartbeat() {
        if (!isPlatformBrowser(this.platformId)) {
            return;
        }

        // Run outside of Angular zone to prevent unnecessary change detection cycles
        this.zone.runOutsideAngular(() => {
            setInterval(() => {
                this.sendPing();
            }, this.HEARTBEAT_INTERVAL);
        });

        // Initial ping on start
        this.sendPing();
    }

    private sendPing() {
        const url = `${this.config.rootUrl}/health`;
        this.http.get(url, { responseType: 'text' }).subscribe({
            next: () => console.log('Heartbeat ping successful'),
            error: (err) => console.error('Heartbeat ping failed', err)
        });
    }
}
