import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { MenubarModule } from 'primeng/menubar';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, MenubarModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  title = 'pmuy-app';
  items:MenuItem[] = [];
  ngOnInit(): void {
      this.items=[
        { label: 'Apply', icon: 'pi pi-file', routerLink: '/apply', routerLinkActiveOptions: { exact: true } },
        { label: 'Status', icon: 'pi pi-search', routerLink: '/status' },
        { label: 'Admin', icon: 'pi pi-users', routerLink: '/admin/applications' }
      ]
  }
}
