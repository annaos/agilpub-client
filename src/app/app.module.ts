import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { UserListComponent } from './user-list/user-list.component';
import { UserFormComponent } from './user-form/user-form.component';
import { UserService } from './service/user.service';
import {JwtInterceptor} from "./_helpers/jwt.interceptor";
import {ErrorInterceptor} from "./_helpers/error.interceptor";
import { LoginComponent } from './login/login.component';
import {fakeBackendProvider} from "./_helpers/fake-backend";
import { DocumentListComponent } from './document-list/document-list.component';
import { DocumentVersionListComponent } from './document-version-list/document-version-list.component';
import {createdDateFormatPipe} from "./_helpers";
import { DocumentFormComponent } from './document-form/document-form.component';
import { DocumentVersionFormComponent } from './document-version-form/document-version-form.component';

@NgModule({
  declarations: [
    AppComponent,
    UserListComponent,
    UserFormComponent,
    LoginComponent,
    DocumentListComponent,
    DocumentVersionListComponent,
    createdDateFormatPipe,
    DocumentFormComponent,
    DocumentVersionFormComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
    UserService,
    fakeBackendProvider
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
