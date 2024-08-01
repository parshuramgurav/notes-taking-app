import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { AuthGuard } from './core/security/auth.guard';

const routes: Routes = [
    { path: 'login', component: LoginComponent },
    {
        path: '',
        loadChildren: () =>
            import('./note/note.module').then(m => m.NoteModule)
        , canActivate: [AuthGuard]
    },
    // { path: '', component: HeaderComponent, canActivate: [AuthGuard] },
    { path: '**', redirectTo: '' }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }