import { Component, ElementRef, OnInit, OnDestroy, ViewChild } from '@angular/core';

import { UntypedFormGroup, UntypedFormControl, Validators, FormGroup, FormControl } from '@angular/forms';
import { NetlifyFormsService } from '../netify-forms/netlify-forms.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'contact-form',
  templateUrl: './contact-form.component.html',
  styleUrls: ['./contact-form.component.scss']
})
export class ContactFormComponent implements OnInit, OnDestroy {
  @ViewChild('contactForm') private form:ElementRef;
  @ViewChild('nameControl') private name:ElementRef;
  @ViewChild('lastNameControl') private nameL:ElementRef;
  @ViewChild('emailControl') private email:ElementRef;
  @ViewChild('bodyControl') private body:ElementRef;

  @ViewChild('errors') private errors:ElementRef;

  contactGroup = new FormGroup({
    _name: new FormControl('', Validators.required),
    _nameLast: new FormControl(''),
    _email: new FormControl('', [
      Validators.required,
      Validators.email
    ]),
    _body: new FormControl('', Validators.required)
  });

  private formStatus: Subscription;

  constructor(private netlifyForms: NetlifyFormsService) {}

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this.formStatus ? this.formStatus.unsubscribe() : null;
  }

  onClickSubmit(form) {
    if (this.errors)
      this.errors.nativeElement.classList.remove('hidden');

    const _name = this.name.nativeElement;
    const _nameL = this.nameL.nativeElement;
    const _email = this.email.nativeElement;
    const _body = this.body.nativeElement;

    const _errorClass = "errors";

    form.get('_name').errors?
      _name.classList.add(_errorClass):
      _name.classList.remove(_errorClass);

    form.get('_email').errors?
      _email.classList.add(_errorClass):
      _email.classList.remove(_errorClass);

    form.get('_body').errors?
      _body.classList.add(_errorClass):
      _body.classList.remove(_errorClass);

    if (form.invalid) {

    } else {
      const data = {
        firstName: _name.querySelector("input").value,
        lastName: _nameL.querySelector("input").value,
        email: _email.querySelector("input").value,
        body: _body.querySelector("textarea").value
      } as Contact;

      this.netlifyForms.submitEntry(data).subscribe(
        (res) => {
          console.log("Form Sent!!!");
        },
        (err) => {
          console.log("Form failed to send...");
        }
      );

      // const metaForm = <HTMLFormElement>document.querySelector("form[name='contact']");
      // const metaName = <HTMLInputElement>document.querySelector("form[name='contact'] input[name='firstName']");
      // const metaNameL = <HTMLInputElement>document.querySelector("form[name='contact'] input[name='lastName']");
      // const metaEmail = <HTMLInputElement>document.querySelector("form[name='contact'] input[name='email']");
      // const metaBody = <HTMLInputElement>document.querySelector("form[name='contact'] input[name='body']");
      //
      // metaName.value = _name.querySelector("input").value;
      // metaNameL.value = _nameL.querySelector("input").value;
      // metaEmail.value = _email.querySelector("input").value;
      // metaBody.value = _body.querySelector("textarea").value;
      //
      // metaForm.submit();

      // this.form.nativeElement.submit();
    }
  }

  onSubmit(e, data) {
    e.preventDefault();
    e.stopPropagation();

    console.log(document.querySelector("form[name='contact']"));

    console.log("submit");
    console.log(data);
  }
}

export interface Contact {
  firstName: string;
  lastName: string;
  email: string;
  body: string;
}
