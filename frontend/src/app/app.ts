import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Register } from './features/auth/register/register';
import { Navbar } from './shared/components/navbar/navbar';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet,Register,Navbar],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('frontend');
}
