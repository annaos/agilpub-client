import { Component, OnInit } from '@angular/core';
import {Document} from "../model/document";
import {DocumentVersion} from "../model/document-version";
import {ActivatedRoute, Router} from "@angular/router";
import {DocumentService} from "../service/document.service";
import {DocumentVersionService} from "../service/document-version.service";
import {AuthenticationService} from "../service/authentication.service";
import {User} from "../model/user";
import {UserService} from "../service/user.service";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  registerForm: FormGroup;
  user: User;
  submitted = false;
  error = '';

  constructor(private formBuilder: FormBuilder,
              private route: ActivatedRoute,
              private router: Router,
              private userService: UserService,
              private authenticationService: AuthenticationService) {
  }

  ngOnInit() {
    this.registerForm = this.formBuilder.group({
      username: ['', Validators.required],
      name: ['', Validators.required],
    });

    this.user = new User();
  }

  onSubmit() {
    this.submitted = true;

    if (this.registerForm.invalid) {
      return;
    }
    this.user.username = this.f.username.value;
    this.user.name = this.f.name.value;

    this.userService.save(this.user).subscribe(result => {
      this.authenticationService.register(this.user).subscribe((resut =>
        this.gotoDocumentList()));
    });
  }

  get f() { return this.registerForm.controls; }

  gotoDocumentList() {
    this.router.navigate(['/documents']);
  }

}
