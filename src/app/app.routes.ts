import { Routes } from '@angular/router';
import { ListComponent } from './page/list/list.component';
import { AddComponent } from './page/add/add.component';
import { EditComponent } from './page/edit/edit.component';
import { RegisterComponent } from './page/register/register.component';
import { LoginComponent } from './page/login/login.component';
import { HomepageComponent } from './page/homepage/homepage.component';
import { CollectionComponent } from './page/collection/collection.component';
import { NewComponent } from './page/new/new.component';
import { BestComponent } from './page/best/best.component';
import { ContactComponent } from './page/contact/contact.component';
import { AboutComponent } from './page/about/about.component';
import {ProductDetailComponent} from './page/product-detail/product-detail.component'
import { CartComponent } from './page/cart/cart.component';
import { CheckoutComponent } from './page/checkout/checkout.component';
import { OrderComponent } from './page/order/order.component';
import { SearchComponent } from './page/search/search.component';
import { WishListComponent } from './page/wishlist/wishlist.component';
export const routes: Routes = [
  {
    path: 'admin',
    children: [
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
    ],
  },
  {
    path: '',
    component: HomepageComponent,
  },
  {
    path: 'register',
    component: RegisterComponent,
  },
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'collection',
    component: CollectionComponent
  },
  {
    path: 'new',
    component: NewComponent
  },
  {
    path: 'best',
    component: BestComponent
  },
  {
    path: 'contact',
    component: ContactComponent
  },
  {
    path: 'about',
    component: AboutComponent
  },
  {
    path: 'productDetails/:id',
    component: ProductDetailComponent
  },
  {
    path: 'cart',
    component: CartComponent
  },
  {
    path: 'checkout',
    component: CheckoutComponent
  },
  {
    path: 'order',
    component: OrderComponent
  },
  {
    path:'search',
    component: SearchComponent
  },
  {
    path:'wishlist',
    component: WishListComponent
  }
];
