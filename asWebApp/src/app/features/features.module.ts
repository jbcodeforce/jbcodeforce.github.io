import { NgModule } from '@angular/core';
import { NgxMdModule } from 'ngx-md';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home/home.component';
import { AboutComponent } from './about/about.component';
import { SharedModule } from '../shared/shared.module';
import { CodeComponent } from './code/code.component';
import { StudiesComponent } from './studies/studies.component';
import { TutorialsComponent } from './tutorials/tutorials.component';
import { CompendiumComponent } from './compendium/compendium.component';
import { AIComponent } from './ai/ai.component';


@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    NgxMdModule.forRoot(),
  ],
  declarations: [HomeComponent, AboutComponent, CodeComponent, StudiesComponent, TutorialsComponent, CompendiumComponent, AIComponent],
  exports: [HomeComponent, AboutComponent, CodeComponent, StudiesComponent, TutorialsComponent]
})
export class FeaturesModule { }
