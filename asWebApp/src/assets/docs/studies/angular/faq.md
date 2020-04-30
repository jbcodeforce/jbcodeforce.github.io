# Angular FAQ

### How to reference an image with source coming from controller?
in html:
```
    <img [src]="c.img" width="100" height="100”/>
```
in controller
```
   {…   ,"img": "./app/images/d-f-diagram140.png"}
```

### How to route to a new location inside of a function of a component?
```
  onSelect(hero: Hero) {
    this.router.navigate(['/hero', hero.id]);
  }
```

### How to make a dom element visible using if condition?
```
  <div *ngIf="hero">
```

### How to separate the compilation of .ts file to separate folder?

add to the tsconfig.json file

    "outDir": "dist"

### TDD: how to set value to combo list?
The cli includes all dependencies (including Karma, Jasmine, Protractor) and has the configuration files already setup ([karma,protractor].conf.js) for us.
Angular Testing utilities provide several classes for testing Angular components. `TestBed` is the first and most important of the Angular testing utilities. It creates an Angular testing module - an @NgModule class - that you configure with the configureTestingModule method to produce the module environment for the class you want to test.

combo list needs to have a change model call back in the controller:
HTML

.spec.ts file


See [real world unit testing](https://blog.realworldfullstack.io/real-world-angular-part-9-unit-testing-c62ba20b1d93)

### How to add modal with angular 2 material?
The new angular material delivers a set of enhanced controls. The modal is one of them.

* In your module add import { MaterialModule } from '@angular/material’;
* In your component add   import { MdDialog, MdDialogConfig, MdDialogRef} from '@angular/material'; and then in the constructor method inject the public dialog: MdDialog,
* in the method that add the element from the dialog form
```
let dialogRef = this.dialog.open(UseCaseDialogComponent, {
      width: '400px'
    });
    dialogRef.afterClosed().subscribe(result => {
      if(result == 'cancel'){
        console.log("result canceled");
      } else if (result) {
```

then at the bottom of the file declare the dialog component
```
@Component({
  moduleId: module.id.replace("/dist/", "/app/"),
  selector : 'cbo-uc-dialog',
  template:…

export class UseCaseDialogComponent {
 public entity: CboUsecase;
 constructor(public dialogRef: MdDialogRef<UseCaseDialogComponent>) {
  this.entity= JSON.parse(localStorage.getItem('currentBE'));
   if (this.entity === null) {
     this.entity = new CboUsecase();
   }
 }
}
```
then in the encompassing module add the dialog in the declarations
```
declarations: [
    CBOListComponent,
    CBOComponent,
    UseCaseDialogComponent
  ],
  entryComponents:[
    UseCaseDialogComponent
  ],
```

### How to use auth0 as authentication mechanism?
https://auth0.com/blog/angular-2-authentication/

Injecting Oauth token using http interceptor
Use HTTP interceptor to intercept an HttpRequest and handles them, and pass to the next interceptor in the chain.
https://angular.io/api/common/http/HttpInterceptor
```
@Injectable()
export class JwtInterceptor  implements HttpInterceptor {
  constructor() { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
```


### How to change the element style class dynamically?

```
  <div *ngFor="let p of currentDialog">
         <div class={{p.class}} [innerHTML]="p.text">
          </div>
   </div>

export class ConversationComponent {
    this.currentDialog.push({"class":"shape bubble1","text":"<p>Hi. My name is Watson. What's your name?"})
    this.currentDialog.push({"class":"shape bubble2","text":"<p>Bob"})
```

### How to present text with html element?
See example above with innerHtml

### How to loop over collection to build a list?
```
<li *ngFor="let p of projects”>
```

### How to propagate data to children after parent ?
A parent page get data initiated after a remote call:
```
this.service.getAssets().subscribe(
    data => {
      this.assets = data;
    },
```

The template passes this data to a child:
```
<dashboard-table [data]="assets"></dashboard-table>
```
So the simplest way is to add a div in front of it.
```
<div *ngIf='assets'>
  <dashboard-table [data]="assets"></dashboard-table>
</div>
```
