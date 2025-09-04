import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ToolbarModule } from 'primeng/toolbar';
import { ButtonModule } from 'primeng/button';
@Component({
  selector: 'app-header',
  imports: [RouterLink,ToolbarModule,ButtonModule],
  templateUrl: './header.html',
  styleUrl: './header.css'
})
export class Header {

}
