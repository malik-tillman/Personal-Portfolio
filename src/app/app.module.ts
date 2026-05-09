import { BrowserModule, provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { routing } from './app.routing';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

import { ReactiveFormsModule } from '@angular/forms';

import { SwiperModule } from 'swiper/angular';

import { AppComponent } from './app.component';
import { ThreeComponent } from './three/three.component';
import { HeaderComponent } from './header/header.component';
import { HomeComponent } from './home/home.component';
import { ProjectComponent } from './project/project.component';
import { WorksComponent } from './works/works.component';
import { AboutComponent } from './about/about.component';
import { ContactComponent } from './contact/contact.component';
import { FooterComponent } from './footer/footer.component';
import { LoaderComponent } from './loader/loader.component';
import { SocialIconsComponent } from './social-icons/social-icons.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { SwiperToolboxComponent } from './swiper-toolbox/toolbox.component';
import { ContactFormComponent } from './contact-form/contact-form.component';
import { ContactInfoComponent } from './contact-info/contact-info.component';
import { SwiperShowcaseComponent } from './swiper-showcase/swiper-showcase.component';
import { LinksComponent } from './links/links.component';
import { CaseStudiesComponent } from './case-studies/case-studies.component';
import { CaseStudyComponent } from './case-study/case-study.component';

@NgModule({ declarations: [
        AppComponent,
        ThreeComponent,
        HeaderComponent,
        HomeComponent,
        ProjectComponent,
        WorksComponent,
        AboutComponent,
        ContactComponent,
        FooterComponent,
        LoaderComponent,
        SocialIconsComponent,
        NotFoundComponent,
        SwiperToolboxComponent,
        ContactFormComponent,
        ContactInfoComponent,
        SwiperShowcaseComponent,
        LinksComponent,
        CaseStudiesComponent,
        CaseStudyComponent
    ],
    bootstrap: [AppComponent], imports: [BrowserModule,
        routing,
        ReactiveFormsModule,
        SwiperModule], providers: [provideHttpClient(withInterceptorsFromDi()), provideClientHydration(withEventReplay())] })

export class AppModule { }
