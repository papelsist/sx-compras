import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { APP_INITIALIZER, NgModule, LOCALE_ID } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { registerLocaleData } from '@angular/common';
import localeMx from '@angular/common/locales/es-MX';

import {
  StoreRouterConnectingModule,
  RouterStateSerializer
} from '@ngrx/router-store';
import { StoreModule, MetaReducer } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';

import { reducers, effects, CustomSerializer } from './store';

// Not used in production
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { storeFreeze } from 'ngrx-store-freeze';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SharedModule } from './_shared/shared.module';
import { CoreModule } from './_core/core.module';

import { ConfigService } from './utils/config.service';

import { environment } from 'environments/environment.prod';
import { ProveedoresModule } from './proveedores/proveedores.module';
import { AuthModule } from './auth/auth.module';
import { ProductosModule } from './productos/productos.module';

export const metaReducers: MetaReducer<any>[] = !environment.production
  ? [storeFreeze]
  : [];

export function onAppInit(configService: ConfigService): () => Promise<any> {
  return () => configService.load();
}

// registerLocaleData(localeMx, 'es-MX');

@NgModule({
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    AppRoutingModule,

    // Ngrx Store configuration
    StoreModule.forRoot(reducers, { metaReducers }),
    StoreDevtoolsModule.instrument({
      name: 'SIIPAPX Dev Tools',
      logOnly: environment.production
    }),
    EffectsModule.forRoot(effects),
    StoreRouterConnectingModule,
    SharedModule,
    AuthModule.forRoot(),
    CoreModule,
    ProveedoresModule.forRoot(),
    ProductosModule.forRoot()
  ],
  providers: [
    ConfigService,
    {
      provide: APP_INITIALIZER,
      useFactory: onAppInit,
      multi: true,
      deps: [ConfigService]
    },
    { provide: RouterStateSerializer, useClass: CustomSerializer },
    // { provide: LOCALE_ID, useValue: 'es-MX' }
  ],
  declarations: [AppComponent],
  bootstrap: [AppComponent]
})
export class AppModule {}
