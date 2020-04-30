## Angular Summary and Tricks
In Angular apps, we write HTML markup that becomes our interactive single page application.
## My repositories
* [angular-sandbox](https://github.com/jbcodeforce/angular-sandbox)
* [Complete web app with Watson Conversation integration, table - Case WebPortal](https://github.com/ibm-cloud-architecture/refarch-caseportal-app)
* [Simple interface with login, material tables, action... Key Opinion Leader asset]()
* [Map, real time event in the Asset Analytics solution](https://github.com/ibm-cloud-architecture/refarch-asset-analytics)
* [Using canvas and programming games](https://github.com/jbcodeforce/jmcbridge)

## Angular quick summary
* Install the Angular CLI: `npm install -g @angular/cli`
* Create a project: `ng new project_name`
* Add modules per group of features: `ng g module features`
* Add component: `ng g component features/login`
* Add service: 'ng g service features/authentication'

Angularjs uses typescript. The .ts file needs to be compiled to javascript using `ng build`.

## Module and declarations

The purpose of a NgModule is to declare each thing you create in Angular, and group them together.
* declarations is for things you’ll use in your templates: mainly components.
* providers is for services declarations and providers do not have the same scope / visibility:
 * declarations / components are in local scope (private visibility),
 * providers / services are (generally) in global scope (public visibility)

Components you declared are only usable in the current module. If you need to use them outside, in other modules, you’ll have to export them. In the module below the components are declared and also exported as they are at the application global scope.
```
declarations: [
    InputComponent,
    DropdownComponent,
    MessageErrorComponent,
    FileUploadComponent
],
providers: [
  FileUploadService,
],
exports: [
    InputComponent,
    DropdownComponent,
    MessageErrorComponent,
    FileUploadComponent
]
```
On the contrary, **services** you provided will generally be available / injectable anywhere in your app, in all modules.
When assessing the import of module, you need to consider:
* if the module is imported for components, you’ll need to import it in each module needing them,
* if the module is imported for services, you’ll need to import it only once, in the first app module.
Modules to import each time you need them:
* common module except in the first app module, because it’s already part of the BrowserModule.
* FormsModule / ReactiveFormsModule
* MatXModule and other UI modules
* any other module giving you components, directives or pipes
Modules to import only once
* HttpClientModule
* BrowserAnimationsModule or NoopAnimationsModule
* any other module providing you services only.

## Parent to Child
The parent template can inject data to a child via sqare braket around a variable:
```
  <app-ships [fleetName]="selectedFleet"></app-ships>
```
The variable fleetName is defined with the @Input operator of the child: here is the child component:
```
 export class ShipsComponent implements OnInit {
  @Input()
  fleetName : string;
 }
```

How to intercept change to the input so we can call a service to load all the ships of the newly selected fleet. We leverage Typescript setter, so move the @Input decorator from a variable to a setter method:
```
@Input()
  set name(fname: string) {
    if (this.fleetName !== fname) {
      this.fleetName = fname;
      this.ngOnInit(); // call the service that was called on the component initialization
    }    
  }
```

## A test driven approach for angular app
This is my work on presenting trick and TDD in [this article](https://github.com/ibm-cloud-architecture/refarch-caseportal-app/blob/master/docs/tdd.md)
