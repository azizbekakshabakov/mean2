import { ApplicationConfig } from '@angular/core';
import { provideClientHydration, withHttpTransferCacheOptions } from '@angular/platform-browser';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

export const appConfig: ApplicationConfig = {
  providers: [provideClientHydration(
    // withHttpTransferCacheOptions({
    //   includePostRequests: true
    // })
  ), provideAnimationsAsync()]
};
