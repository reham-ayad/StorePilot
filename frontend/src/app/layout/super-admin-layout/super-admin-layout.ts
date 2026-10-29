import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { superAdminSidebar } from '../../features/super-admin-dashboard/sidebar/sidebar';

@Component({
  selector: 'app-super-admin-layout',
  standalone: true,
  imports: [RouterOutlet,superAdminSidebar ],
  templateUrl: './super-admin-layout.html',
  styleUrl: './super-admin-layout.scss',
})
export class SuperAdminLayout {}