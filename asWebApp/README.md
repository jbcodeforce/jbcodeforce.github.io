# Older app to use angular to present the content

This web site is done using Angular 6 and Angular Material with the angular markdown library to display markdown files. 

To build and deploy:

* ng build to compile
* ng serve to test locally on http://localhost:4200
* All git push is done on the `code branch`
* Use `ng build --prod --base-href https://jbcodeforce.github.io/` to build the code for github pages
* Use `ngh -d dist/mykb -b master -S` to upload compiled web app to the master branch of the jbcodeforce.io repository.

## Some content development tricks

* The tilecard is in shared folder and can do two types of view: Dialog, or page by page with 3 tops categories.  
* use [urlPath]="'an-url-in-route'" to navigate from a tile to another Component
* use [urlMdPath]="'assets/docs/studies/kafka.md'" to load a markdown page into the tile view as modal.

* The md files are presented by [ngx-markdown](https://www.npmjs.com/package/ngx-markdown) angular which is doing a correct job to layout md file, but could be far better. 

