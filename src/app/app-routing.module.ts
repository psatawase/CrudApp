import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StudentCrudComponent } from './student-crud/student-crud.component';
import { StudentTableComponent } from './student-table/student-table.component';

const routes: Routes = [
  { path: '', component: StudentCrudComponent },  // Default route
  { path: 'students', component: StudentTableComponent }  // Route for student table
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
