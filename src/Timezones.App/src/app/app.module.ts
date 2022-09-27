import { NgModule } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { JwtModule, JWT_OPTIONS } from '@auth0/angular-jwt';

import { MatCardModule } from '@angular/material/card';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
const materialImports = [
  MatCardModule,
  MatSnackBarModule,
  MatSidenavModule,
  MatMenuModule,
  MatButtonModule,
  MatIconModule
];

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthService } from './core/services/auth.service';
import { environment } from './../environments/environment';
import { NavigationLayoutContainerComponent } from './core/containers/navigation-layout-container/navigation-layout-container.component';
import { NavigationLayoutComponent } from './core/components/navigation-layout/navigation-layout.component';
import { ServerErrorInterceptor } from './core/interceptors/server-error.interceptor';
import { NavigationService } from './core/services/navigation.service';
import { PageInfoContainerComponent } from './core/containers/page-info-container/page-info-container.component';

function jwtOptionsFactory(tokenService: AuthService) {
  return {
    tokenGetter: () => {
      return tokenService.getToken();
    },
    allowedDomains: [environment.apiDomain]
  };
}

@NgModule({
  declarations: [
    AppComponent,
    PageInfoContainerComponent,
    NavigationLayoutContainerComponent,
    NavigationLayoutComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    JwtModule.forRoot({
      jwtOptionsProvider: {
        provide: JWT_OPTIONS,
        useFactory: jwtOptionsFactory,
        deps: [AuthService]
      }
    }),
    ...materialImports
  ],
  providers: [{
    provide: HTTP_INTERCEPTORS,
    useClass: ServerErrorInterceptor,
    multi: true,
    deps: [NavigationService, AuthService]
  }],
  bootstrap: [AppComponent]
})
export class AppModule { }
