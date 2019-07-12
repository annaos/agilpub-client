import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UserListComponent } from './user-list/user-list.component';
import {AuthGuard} from "./_guards";
import {LoginComponent} from "./login/login.component";
import {DocumentListComponent} from "./document-list/document-list.component";
import {DocumentVersionListComponent} from "./document-version-list/document-version-list.component";
import {DocumentFormComponent} from "./document-form/document-form.component";
import {DocumentVersionFormComponent} from "./document-version-form/document-version-form.component";
import {RegisterComponent} from "./register/register.component";
import {DocumentVersionFileComponent} from "./document-version-file/document-version-file.component";
import {HomeComponent} from "./home/home.component";

const routes: Routes = [
  { path: 'users', component: UserListComponent, canActivate: [AuthGuard] },
  { path: 'documents', component: DocumentListComponent, canActivate: [AuthGuard] },
  { path: 'adddocument', component: DocumentFormComponent, canActivate: [AuthGuard] },
  { path: 'addversion/:id', component: DocumentVersionFormComponent, canActivate: [AuthGuard] },
  { path: 'versions/:id', component: DocumentVersionListComponent, canActivate: [AuthGuard] },
  { path: 'version/:id', component: DocumentVersionFileComponent, canActivate: [AuthGuard] },

  { path: '', component: HomeComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'login', component: LoginComponent },

  // otherwise redirect to home
  { path: '**', redirectTo: '' }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }


