import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { ApplicationService } from '../../../services/application.service';

@Component({
  selector: 'app-apply',
  imports: [CardModule, ButtonModule, CommonModule, ReactiveFormsModule, InputTextModule, InputNumberModule],
  templateUrl: './apply.component.html',
  styleUrl: './apply.component.scss'
})
export class ApplyComponent implements OnInit {
  form!:FormGroup;
  constructor(private fb: FormBuilder, private appService: ApplicationService){}

  ngOnInit(): void {
    this.form = this.fb.group({
      aadhar: ['', [
        Validators.required, 
        Validators.pattern(/^\d{12}$/), // 12 digit validation
        Validators.minLength(12),
        Validators.maxLength(12)
      ]],
      name: ['', [
        Validators.required, 
        Validators.minLength(2),
        Validators.pattern(/^[a-zA-Z\s]+$/) // Only letters and spaces
      ]],
      income: [null, [
        Validators.required, 
        Validators.max(99999999) // Max 8 digits
      ]]
    });
  }

  onSubmit(){
     if (this.form.valid) {
       this.appService.apply(this.form.value).subscribe({
        next: res => { 
          alert(res.message || 'Application submitted');
          this.form.reset();
        },
        error: err => alert(err.error.error || 'Something went wrong')
    });
  }
  }
}
