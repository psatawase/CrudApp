import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-student-crud',
  templateUrl: './student-crud.component.html',
  styleUrls: ['./student-crud.component.css']
})
export class StudentCrudComponent implements OnInit {

  StudentArray: any[] = [];
  isResultLoaded = false;
  isUpdateFormActive = false;
  studentForm: FormGroup;
  currentStudentId: string = "";

  constructor(private http: HttpClient, private fb: FormBuilder, private router: Router) {
    this.studentForm = this.fb.group({
      stname: ['', Validators.required], 
      course: ['', Validators.required],  
      fee: ['', [Validators.required, Validators.pattern("^[0-9]*$")]] 
    });

    // Check for state data to populate the form for editing
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras.state) {
      const student = navigation.extras.state['student'];

      if (student) {
        this.setUpdate(student);
      }
    }

    this.getAllStudents();
  }

  ngOnInit(): void {}

  getAllStudents() {
    this.http.get("http://localhost:3001/api/students").subscribe(
      (value: any) => {
        this.isResultLoaded = true;
        this.StudentArray = value;
      }
    );
  }

  save() {
    let bodyData = this.studentForm.value;

    this.http.post("http://localhost:3001/api/student/add", bodyData).subscribe(
      (value: any) => {
        alert("Student Added Successfully");
        this.getAllStudents();
        this.resetForm();
        this.router.navigate(['students']);
      }
    );
  }

  setUpdate(student: any) {
    this.studentForm.patchValue({
      stname: student.stname,
      course: student.course,
      fee: student.fee
    });
    this.currentStudentId = student.id; 
    this.isUpdateFormActive = true; 
  }

  updateStudent() {
    const updatedData = this.studentForm.value;

    this.http.put(`http://localhost:3001/api/student/update/${this.currentStudentId}`, updatedData).subscribe(
      (value: any) => {
        alert("Student updated successfully!");
        this.getAllStudents();
        this.resetForm();
        this.router.navigate(['students']);
      }
    );
  }

  onDelete(studentId: any) {
    this.http.delete(`http://localhost:3001/api/student/delete/${studentId}`).subscribe(
      (value: any) => {
        alert("Student Deleted Successfully");
        this.getAllStudents();
      }
    );
  }

  resetForm() {
    this.studentForm.reset();
    this.currentStudentId = "";
    this.isUpdateFormActive = false;
  }
}
