import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { finalize } from 'rxjs';
import { LoaderService } from '../loader.service';

export const loaderInterceptor: HttpInterceptorFn = (req, next) => {
    const loaderService = inject(LoaderService);

    // Skip loader for heartbeat/health check to avoid constant flashing
    if (req.url.includes('/health') || req.url.includes('/heartbeat')) {
        return next(req);
    }

    loaderService.show();
    return next(req).pipe(
        finalize(() => {
            loaderService.hide();
        })
    );
};
