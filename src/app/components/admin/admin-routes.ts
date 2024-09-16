import { AdminComponent } from "./admin.component";
import { OrderAdminComponent } from "./order/order.admin.component";
import { DetailOrderAdminComponent } from "./detail-order/detail.order.admin.component";
import { Route, Router,Routes } from "@angular/router";
import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { ProductAdminComponent } from "./product/product.admin.component";
import { CategoryAdminComponent } from "./category/category.admin.component";
import { UpdateProductAdminComponent } from "./product/update/update.product.admin.component";
import { InsertProductAdminComponent } from "./product/insert/insert.product.admin.component";
import { InsertCategoryAdminComponent } from "./category/insert/insert.category.admin.component";
import { UpdateCategoryAdminComponent } from "./category/update/update.category.admin.component";
import { UserAdminComponent } from "./user/user.admin.component";
import { CommentComponent } from "./comment/comment.admin.component";
import { AuthGuard } from "../../guards/auth.guard";

export const adminRoutes: Routes = [
    {
        path: 'admin',
        component: AdminComponent,
        children: [
            {
                path: 'orders',
                component: OrderAdminComponent,
                canActivate: [AuthGuard], // Bảo vệ route này bằng AuthGuard
                data: { roles: ['admin'] } 
            },            
            {
                path: 'products',
                component: ProductAdminComponent,
                canActivate: [AuthGuard], // Bảo vệ route này bằng AuthGuard
                data: { roles: ['admin'] } 
            },
            {
                path: 'categories',
                component: CategoryAdminComponent,
                canActivate: [AuthGuard], // Bảo vệ route này bằng AuthGuard
                data: { roles: ['admin'] } 
            },
            {
                path: 'users',
                component: UserAdminComponent
            },
            {
                path: 'comments',
                component: CommentComponent
            },
            
            //sub path
            {
                path: 'orders/:id',
                component: DetailOrderAdminComponent
            },
            {
                path: 'products/update/:id',
                component: UpdateProductAdminComponent
            },
            {
                path: 'products/insert',
                component: InsertProductAdminComponent
            },
            //categories            
            {
                path: 'categories/update/:id',
                component: UpdateCategoryAdminComponent
            },
            {
                path: 'categories/insert',
                component: InsertCategoryAdminComponent
            },
            
        ]
    }
];
/*
@NgModule({
    imports: [
        RouterModule.forChild(routes)
    ],
    exports: [RouterModule]
})
export class AdminRoutingModule { }
*/
