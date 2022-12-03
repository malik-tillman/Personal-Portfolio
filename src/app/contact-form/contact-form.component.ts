import { Component, ElementRef, OnInit, OnDestroy, ViewChild } from '@angular/core';

import { Validators, FormGroup, FormControl } from '@angular/forms';
import { NetlifyFormsService } from '../netify-forms/netlify-forms.service';
import { CMSService, _File } from '../cms.service';
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

  @ViewChild('container') private containerRef:ElementRef;

  contactGroup = new FormGroup({
    _name: new FormControl('', Validators.required),
    _nameLast: new FormControl(''),
    _email: new FormControl('', [
      Validators.required,
      Validators.email
    ]),
    _body: new FormControl('', Validators.required)
  });

  public success_media: _File = {
    url: "",
    alt: ""
  };

  public error_media: _File = {
    url: "",
    alt: ""
  };

  private formStatus: Subscription;

  constructor(
    private netlifyForms: NetlifyFormsService,
    private cms: CMSService
  ) {}

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this.formStatus ? this.formStatus.unsubscribe() : null;
  }

  onSubmit(form) {
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
      this.netlifyForms.submitEntry({
        firstName: _name.querySelector("input").value,
        lastName: _nameL.querySelector("input").value,
        email: _email.querySelector("input").value,
        body: _body.querySelector("textarea").value
      } as Contact).subscribe(
        () => this.toggleSuccess(),
        () => this.toggleFail()
      );
    }
  }

  toggleSuccess() {
    this.containerRef.nativeElement.classList.add("form-sent");
    this.containerRef.nativeElement.classList.remove("form-fail");

    this.cms.fetchSuccessMedia().then(media => {
      this.success_media = media[Math.floor(Math.random() * (media.length))];
    });
  }

  toggleFail() {
    this.containerRef.nativeElement.classList.remove("form-sent");
    this.containerRef.nativeElement.classList.add("form-fail");

    this.cms.fetchErrorMedia().then(media => {
      this.error_media = media[Math.floor(Math.random() * (media.length))];
    });
  }
}

export interface Contact {
  firstName: string;
  lastName: string;
  email: string;
  body: string;
}
