import { Routes } from '@angular/router';
import { RegisterComponent } from './page/register/register.component';
import { LoginComponent } from './page/login/login.component';
import { HomepageComponent } from './page/homepage/homepage.component';
import { CollectionComponent } from './page/collection/collection.component';
import { NewComponent } from './page/new/new.component';
import { ContactComponent } from './page/contact/contact.component';
import { AboutComponent } from './page/about/about.component';
import { ProductDetailComponent } from './page/product-detail/product-detail.component';
import { CartComponent } from './page/cart/cart.component';
import { CheckoutComponent } from './page/checkout/checkout.component';
import { OrderComponent } from './page/order/order.component';
import { SearchComponent } from './page/search/search.component';
import { WishlistComponent } from './page/wishlist/wishlist.component';
import { ProfileComponent } from './page/profile/profile.component';
import { DashboardComponent } from './server/dashboard/dashboard.component';
import { EditProductComponent } from './server/product/edit-product/edit-product.component';
import { AddProductComponent } from './server/product/add-product/add-product.component';
import { ListProductComponent } from './server/product/list-product/list-product.component';
import { ListUserComponent } from './server/user/list-user/list-user.component';
import { OrderListComponent } from './server/order/order-list/order-list.component';
import { OrderDetailComponent } from './server/order/order-detail/order-detail.component';
import { CommentListComponent } from './server/comment/comment-list/comment-list.component';
import { CommentEditComponent } from './server/comment/comment-edit/comment-edit.component';
import { SpecialofferComponent } from './page/specialoffer/specialoffer.component';

export const routes: Routes = [
  {
    path: 'admin',
    children: [
      {
        path: '',
        component: DashboardComponent,
      },
      {
        path: 'list-product',
        component: ListProductComponent,
      },
      {
        path: 'add-product',
        component: AddProductComponent,
      },
      {
        path: 'edit-product/:id',
        component: EditProductComponent,
      },
      {
        path: 'list-user',
        component: ListUserComponent
      },
      {
        path: 'list-order',
        component: OrderListComponent
      },
      {
        path: 'order-detail/:id',
        component: OrderDetailComponent
      },
      {
        path: 'list-comment',
        component: CommentListComponent
      },
      {
        path: 'edit-comment/:id',
        component: CommentEditComponent
      }

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
    component: CollectionComponent,
  },
  {
    path: 'new',
    component: NewComponent,
  },
  {
    path: 'specialOffer',
    component: SpecialofferComponent,
  },
  {
    path: 'contact',
    component: ContactComponent,
  },
  {
    path: 'about',
    component: AboutComponent,
  },
  {
    path: 'productDetails/:id',
    component: ProductDetailComponent,
  },
  {
    path: 'cart',
    component: CartComponent,
  },
  {
    path: 'checkout',
    component: CheckoutComponent,
  },
  {
    path: 'order',
    component: OrderComponent,
  },
  {
    path: 'search',
    component: SearchComponent,
  },
  {
    path: 'wishlist',
    component: WishlistComponent,
  },
  {
    path: 'profile',
    component: ProfileComponent,
  },
];
