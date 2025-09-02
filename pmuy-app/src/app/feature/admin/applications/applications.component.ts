import { CurrencyPipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { TableModule } from 'primeng/table';
import { FormsModule } from '@angular/forms';
import { ApplicationService } from '../../../services/application.service';
import { ButtonModule } from 'primeng/button';
import { ConfirmationService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { InputTextModule } from 'primeng/inputtext';
import { DialogModule } from 'primeng/dialog';
import { AuthService } from '../../../services/auth.service';

interface Person {
  _id: string;
  aadhar: string;
  name: string;
  income: number;
  status: string;
  officerInfo?: string;
  setupDate?: string;
  rejectReason?: string;
}
@Component({
  selector: 'app-applications',
  imports: [TableModule, CurrencyPipe, FormsModule, ButtonModule,ConfirmDialogModule, InputTextModule, DialogModule],
  templateUrl: './applications.component.html',
  styleUrl: './applications.component.scss',
  providers:[ConfirmationService]
})
export class ApplicationsComponent implements OnInit {
  people: Person[] = [];
  rejectDialogVisible = false;
  rejectReason = '';
  selectedPerson!: Person;

  constructor(private appService: ApplicationService, private confirmationService: ConfirmationService, private auth: AuthService){}

  ngOnInit(): void {
    this.loadData();
  }
  loadData() {
    this.appService.getAll().subscribe(res => this.people = (res as Person[]).reverse());
  }
  approve(person: Person) {
    this.confirmationService.confirm({
      message: 'Are you sure you want to approve this application?',
      header: 'Confirm Approval',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        const currentOffice = this.auth.getCurrentUser();
        const payload = {
          status: 'Approved',
          officerInfo: currentOffice
        };
        this.appService.update(person._id, payload).subscribe(() => this.loadData());
      },
      reject: () => {}
    })
  }

  openRejectDialog(person: Person) {
    this.selectedPerson = person;
    this.rejectReason = '';
    this.rejectDialogVisible = true;
  }

  confirmReject() {
    if (!this.rejectReason.trim()) {
      alert('Please enter a rejection reason');
      return;
    }
    const currentUser = this.auth.getCurrentUser();
    const payload = { status: 'Rejected', rejectReason: this.rejectReason, officerInfo: currentUser };
    this.appService.update(this.selectedPerson._id, payload).subscribe(() => {
      this.loadData();
      this.rejectDialogVisible = false;
    });
  }

}
