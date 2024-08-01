import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { MainComponent } from './main/main.component';
import { AuthGuard } from '../core/security/auth.guard';

const routes: Routes = [
    {
        path: "", component: MainComponent, canActivate: [AuthGuard]
    },
    {
        path: "trash", component: MainComponent, canActivate: [AuthGuard]
    },
    {
        path: "label/:name", component: MainComponent, canActivate: [AuthGuard]
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class NoteRoutingModule { }