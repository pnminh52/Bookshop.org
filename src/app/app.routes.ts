import { Routes } from '@angular/router';
import { ListComponent } from './pase/list/list.component';
import { AddComponent } from './pase/add/add.component';
import { EditComponent } from './pase/edit/edit.component';
// import { RegisterComponent } from './pase/register/register.component';
// import { LoginComponent } from './pase/login/login.component';

export const routes: Routes = [
  {
    path: 'list',
    component: ListComponent,
  },
  {
    path: 'addproduct',
    component: AddComponent,
  },
  {
    path: 'edit/:id',
    component: EditComponent,
  },
  // {
  //   path:'register',
  //   component:RegisterComponent,
  // },
  // {
  //   path:'login',
  //   component:LoginComponent,
  // }
];
