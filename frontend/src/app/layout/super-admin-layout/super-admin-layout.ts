import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Sidebar } from '../sidebar/sidebar';

@Component({
  selector: 'app-super-admin-layout',
  standalone: true,
  imports: [RouterOutlet, Sidebar],
  templateUrl: './super-admin-layout.html',
  styleUrl: './super-admin-layout.scss',
})
export class SuperAdminLayout {}