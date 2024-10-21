import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-student-table',
  templateUrl: './student-table.component.html',
  styleUrls: ['./student-table.component.css']
})
export class StudentTableComponent implements OnInit {

  StudentArray: any[] = [];
  isResultLoaded = false;

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit(): void {
    this.getAllStudents();
  }

  getAllStudents() {
    this.http.get("http://localhost:3001/api/students").subscribe(
      (value: any) => {
        this.isResultLoaded = true;
        this.StudentArray = value;
      }
    );
  }

  onDelete(studentId: any) {
    const confirmDelete = window.confirm("Are you sure you want to delete this student?");
    if (confirmDelete) {
      this.http.delete(`http://localhost:3001/api/student/delete/${studentId}`).subscribe(
        (value: any) => {
          alert("Student Deleted Successfully");
          this.getAllStudents();
        }
      );
    }
  }

  setUpdate(student: any) {
    // Navigate to the student registration page with the student data
    this.router.navigate(['/'], { state: { student } });
  }
}
