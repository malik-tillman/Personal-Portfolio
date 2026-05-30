/*********************
 * Component Routing
 * Malik Tillman 2019
 *********************/

/**
 * Import routing helpers
 */
import { Routes, RouterModule } from '@angular/router';

/**
 * Import application components
 */
import { WorksComponent } from './works/works.component';
import { ProjectComponent } from './project/project.component';
import { HomeComponent } from './home/home.component';
import { AboutComponent } from './about/about.component';
import { ContactComponent } from './contact/contact.component';
import { CaseStudiesComponent } from './case-studies/case-studies.component';
import { CaseStudyComponent } from './case-study/case-study.component';

/**
 * Define application routes
 * Todo: Add NotFoundComponent and ComingSoonComponent
 */
const appRoutes: Routes = [
  { path: 'contact', component: ContactComponent },
  { path: 'about', component: AboutComponent },
  { path: 'case-studies', component: CaseStudiesComponent },
  { path: 'case-studies/:slug', component: CaseStudyComponent },
  { path: 'works/project', component: ProjectComponent },
  { path: 'works/project/:slug', component: ProjectComponent },
  {
    path: 'works',
    component: WorksComponent,
    children: [
      {
        path: ':type',
        component: WorksComponent
      }
    ],
    runGuardsAndResolvers: 'always'
  },
  { path: 'home', component: HomeComponent },
  {
    path: '',
    redirectTo: '/home',
    pathMatch: 'full'
  },
  { path: '**', redirectTo: '/home' }
];

/**
 * Export routing module
 */
export const routing = RouterModule.forRoot(appRoutes, {
    onSameUrlNavigation: 'reload',
    // useHash: true
});
