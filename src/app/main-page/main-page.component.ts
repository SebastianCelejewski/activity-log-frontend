import { Component } from '@angular/core';
import { Subject } from "rxjs";
import { AuthService } from "../../services/auth.service";

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.css']
})
export class MainPageComponent {

    constructor(private authService: AuthService) {}

}