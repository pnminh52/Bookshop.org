import { Routes } from '@angular/router';
import { ListComponent } from './page/list/list.component';
import { AddComponent } from './page/add/add.component';
import { EditComponent } from './page/edit/edit.component';
import { RegisterComponent } from './page/register/register.component';
import { LoginComponent } from './page/login/login.component';
import { HomepageComponent } from './page/homepage/homepage.component';

export const routes: Routes = [
  {
    path: '',
    component: HomepageComponent,
  },
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
  {
    path:'register',
    component:RegisterComponent,
  },
  {
    path:'login',
    component:LoginComponent,
  }
];
