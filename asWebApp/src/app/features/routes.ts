import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { AboutComponent } from './about/about.component';
import { CodeComponent } from './code/code.component';
import { StudiesComponent } from './studies/studies.component';
import { TutorialsComponent } from './tutorials/tutorials.component';
import { CompendiumComponent } from './compendium/compendium.component';
import { AIComponent } from './ai/ai.component';
import { StudyComponent } from '../shared/study/study.component';

export const routes: Routes = [
    { path: 'home', component: HomeComponent},
    { path: 'about', component: AboutComponent},
    { path: 'code', component: CodeComponent},
    { path: 'studies', component: StudiesComponent},
    { path: 'tutorials', component: TutorialsComponent},
    { path: 'compendium', component: CompendiumComponent},
    { path: 'ai', component: AIComponent},
    { path: 'study', component: StudyComponent},
    { path: '**', redirectTo: '/home', pathMatch: 'full'}
];
