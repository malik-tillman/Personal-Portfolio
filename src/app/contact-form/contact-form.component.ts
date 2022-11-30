import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';

import {UntypedFormGroup, UntypedFormControl, Validators} from '@angular/forms';

@Component({
  selector: 'contact-form',
  templateUrl: './contact-form.component.html',
  styleUrls: ['./contact-form.component.scss']
})
export class ContactFormComponent implements OnInit {
  @ViewChild('contactForm') private form:ElementRef;
  @ViewChild('nameControl') private name:ElementRef;
  @ViewChild('lastNameControl') private nameL:ElementRef;
  @ViewChild('emailControl') private email:ElementRef;
  @ViewChild('bodyControl') private body:ElementRef;

  @ViewChild('errors') private errors:ElementRef;

  contactGroup = new UntypedFormGroup({
    _name: new UntypedFormControl('', Validators.required),
    _nameLast: new UntypedFormControl(''),
    _email: new UntypedFormControl('', [
      Validators.required,
      Validators.email
    ]),
    _body: new UntypedFormControl('', Validators.required)
  });

  constructor() { }

  ngOnInit(): void {
  }

  onClickSubmit(group) {
    if (this.errors)
      this.errors.nativeElement.classList.remove('hidden');

    const _name = this.name.nativeElement;
    const _nameL = this.nameL.nativeElement;
    const _email = this.email.nativeElement;
    const _body = this.body.nativeElement;

    const _errorClass = "errors";

    group.get('_name').errors?
      _name.classList.add(_errorClass):
      _name.classList.remove(_errorClass);

    group.get('_email').errors?
      _email.classList.add(_errorClass):
      _email.classList.remove(_errorClass);

    group.get('_body').errors?
      _body.classList.add(_errorClass):
      _body.classList.remove(_errorClass);

    if (group.invalid) {

    } else {
      const metaForm = <HTMLFormElement>document.querySelector("form[name='contact']");
      const metaName = <HTMLInputElement>document.querySelector("form[name='contact'] input[name='firstName']");
      const metaNameL = <HTMLInputElement>document.querySelector("form[name='contact'] input[name='lastName']");
      const metaEmail = <HTMLInputElement>document.querySelector("form[name='contact'] input[name='email']");
      const metaBody = <HTMLInputElement>document.querySelector("form[name='contact'] input[name='body']");

      console.log(metaBody);

      metaName.value = _name.querySelector("input").value;
      metaNameL.value = _nameL.querySelector("input").value;
      metaEmail.value = _email.querySelector("input").value;
      metaBody.value = _body.querySelector("textarea").value;

      metaForm.submit();

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
