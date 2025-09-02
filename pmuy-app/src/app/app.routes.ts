import { Routes } from '@angular/router';
import { ApplyComponent } from './feature/user/apply/apply.component';
import { StatusComponent } from './feature/user/status/status.component';
import { ApplicationsComponent } from './feature/admin/applications/applications.component';
import { LoginComponent } from './feature/admin/login/login.component';
import { authGuard } from './feature/admin/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'apply', pathMatch: 'full' },
  { path: 'apply', component: ApplyComponent },
  { path: 'login', component: LoginComponent },
  { path: 'status', component: StatusComponent },
  { path: 'admin/applications', component: ApplicationsComponent, canActivate: [authGuard] },
  { path: '**', redirectTo: '/apply' } 
];
