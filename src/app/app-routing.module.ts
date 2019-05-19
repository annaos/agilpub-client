import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UserListComponent } from './user-list/user-list.component';
import { UserFormComponent } from './user-form/user-form.component';
import {AuthGuard} from "./_guards";
import {LoginComponent} from "./login/login.component";
import {DocumentListComponent} from "./document-list/document-list.component";
import {DocumentVersionListComponent} from "./document-version-list/document-version-list.component";

const routes: Routes = [
  { path: 'users', component: UserListComponent, canActivate: [AuthGuard] },
  { path: 'documents', component: DocumentListComponent, canActivate: [AuthGuard] },
  { path: 'adduser', component: UserFormComponent, canActivate: [AuthGuard] },
  { path: 'versions/:id', component: DocumentVersionListComponent, canActivate: [AuthGuard] },

  {
    path: 'login',
    component: LoginComponent
  },

  // otherwise redirect to home
  { path: '**', redirectTo: '' }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }


