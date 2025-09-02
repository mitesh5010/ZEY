import { Component, OnInit } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { CardModule } from 'primeng/card';
import { CommonModule } from '@angular/common';
import { ApplicationService } from '../../../services/application.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-status',
  imports: [ButtonModule, InputTextModule, CardModule, CommonModule,FormsModule],
  templateUrl: './status.component.html',
  styleUrl: './status.component.scss'
})
export class StatusComponent{

  aadhar!:string;
  status!: "Approved" | "Rejected" | "Pending";
  result: any = null;
  rejectionReason!:string;

  constructor(private appService: ApplicationService){}

 checkStatus(){
 if (this.aadhar) {
   this.appService.getStatus(this.aadhar).subscribe({
     next: res => {
       this.result = res,
       this.aadhar = '';
      },
      error: err => alert(err.error.error || 'Application not found')
    });
  } else {
    alert("Please Enter Aadhar Number.")
  }
}
}
