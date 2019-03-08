import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [

  {
    path: 'home',
    loadChildren: './home/home.module#HomePageModule'
  },
  {
    path: 'list',
    loadChildren: './list/list.module#ListPageModule'
  },
  { path: '', loadChildren: './register/register.module#RegisterPageModule' },
  { path: 'add', loadChildren: './add/add.module#AddPageModule' },
  { path: 'view', loadChildren: './view/view.module#ViewPageModule' },
  { path: 'cart', loadChildren: './cart/cart.module#CartPageModule' },
  { path: 'edit', loadChildren: './edit/edit.module#EditPageModule' },
  { path: 'info', loadChildren: './info/info.module#InfoPageModule' },
  { path: 'gps', loadChildren: './gps/gps.module#GpsPageModule' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
