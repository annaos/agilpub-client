import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { UserListComponent } from './user-list/user-list.component';
import { UserService } from './service/user.service';
import {ErrorInterceptor} from "./_helpers/error.interceptor";
import { LoginComponent } from './login/login.component';
import { DocumentListComponent } from './document-list/document-list.component';
import { DocumentVersionListComponent } from './document-version-list/document-version-list.component';
import {createdDateFormatPipe} from "./_helpers";
import {getLastVersionPipe} from "./_helpers";
import {getTagsPipe} from "./_helpers";
import { DocumentFormComponent } from './document-form/document-form.component';
import { DocumentVersionFormComponent } from './document-version-form/document-version-form.component';
import { RegisterComponent } from './register/register.component';
import {FileUploadModule} from 'ng2-file-upload';
import { FlashMessagesModule } from 'angular2-flash-messages';
import { DocumentVersionFileComponent } from './document-version-file/document-version-file.component';
import * as fileSaver from 'file-saver';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import {Document} from './model/document';
import { HomeComponent } from './home/home.component';
import {NgbModule} from "@ng-bootstrap/ng-bootstrap";
import {AppConfigModule} from "./app-config.module";

@NgModule({
  declarations: [
    AppComponent,
    UserListComponent,
    LoginComponent,
    DocumentListComponent,
    DocumentVersionListComponent,
    createdDateFormatPipe,
    getLastVersionPipe,
    getTagsPipe,
    DocumentFormComponent,
    DocumentVersionFormComponent,
    RegisterComponent,
    DocumentVersionFileComponent,
    HomeComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    FileUploadModule,
    FlashMessagesModule.forRoot(),
    PdfViewerModule,
    NgbModule,
    AppConfigModule
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
    UserService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
