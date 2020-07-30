import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-bind',
  templateUrl: './bind.component.html',
  styleUrls: ['./bind.component.less']
})
export class BindComponent implements OnInit {

  form: FormGroup;
  loading;
  error;

  constructor(fb: FormBuilder,private router: Router) { 
    this.form = fb.group({
      userName: [null, [Validators.required, Validators.minLength(5)]],
      password: [null, Validators.required]
    });
  }

  // region: fields
  get userName() {
    return this.form.controls.userName;
  }
  get password() {
    return this.form.controls.password;
  }

  ngOnInit() {
  }

  goRegister() {
    this.router.navigate(['/passport/register'])
  }
  submit(){

  }

}
