import { Component, OnInit } from "@angular/core";
import { FormGroup, FormBuilder, Validators, FormControl } from "@angular/forms";
import { NzMessageService } from "ng-zorro-antd";
import { HttpClient, HttpResponse } from "@angular/common/http";
import { NzNotificationService } from 'ng-zorro-antd';


@Component({
    selector: 'change-pw',
    templateUrl: './changePassword.component.html',
  })
  export class ChangePwComponent implements OnInit{
    isConfirmLoading = false;
    isVisible = false;
    validateForm: FormGroup;
  
    constructor(
      private fb: FormBuilder,
      private msg: NzMessageService,
      private nsg: NzNotificationService,
      private http: HttpClient,
    ) {}
  
    ngOnInit(): void {
      this.validateForm = this.fb.group({
        currentPassword            : [ null, [ Validators.required  ] ],
        newPassword         : [ null, [ Validators.required, Validators.minLength(4), Validators.maxLength(100), this.confirmationValidatorWithCurrent] ],
        checkPassword    : [ null, [ Validators.required, this.confirmationValidator ] ],
      });
    }
  
    showModal(): void {
      this.isVisible = true;
    }
  
    handleCancel(): void {
      this.validateForm.reset();
      this.isVisible = false;
    }
    
    submitForm(): void {
      for (const i in this.validateForm.controls) {
        this.validateForm.controls[ i ].markAsDirty();
        this.validateForm.controls[ i ].updateValueAndValidity();
      }
      if(!this.validateForm.valid){
        this.msg.warning("请确认密码填写正确");
        return;
      }
      this.isConfirmLoading = true;
      this.http.post('/thsuaa/api/sys-users/change-password', {
        currentPassword: this.validateForm.controls['currentPassword'].value,
        newPassword: this.validateForm.controls['newPassword'].value}).subscribe((res: HttpResponse<any>) =>{
            this.nsg.success("密码修改成功", "请妥善保管好新密码，下次登陆生效",{nzDuration: 6000});
            this.validateForm.reset();
            this.isVisible = false;
            this.isConfirmLoading = false;
        },(error) => {
          this.msg.error(error);
          this.isConfirmLoading = false;
        });
    }
  
    updateConfirmValidator(): void {
      /** wait for refresh value */
      Promise.resolve().then(() => this.validateForm.controls.checkPassword.updateValueAndValidity());
    }
  
    confirmationValidator = (control: FormControl): { [s: string]: boolean } => {
      if (!control.value) {
        return { required: true };
      } else if (control.value !== this.validateForm.controls.newPassword.value) {
        return { confirm: true, error: true };
      }
    }

    confirmationValidatorWithCurrent = (control: FormControl): { [s: string]: boolean } => {
      if ( control.value && control.value == this.validateForm.controls.currentPassword.value) {
        return { confirm: true, error: true };
      }
    }
  }
  