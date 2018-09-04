# Neos CMS gulp processor for BEM Themes

This package aims to be one of many solutions to tackle theming in Neos CMS. We love BEM, that's why we wanted to have theme packages with self contained fusion components (fusion, js, css) and a corresponding build process for that.

WARNING: This package is work in process!

## What does it do?
Basically it iterates thoug your theme package and generates js and css dist files.

Hint: The loading order of the package components is not relevant as long as you stick to the BEM pattern.

## Install

After installation, go to `./Build/Gulp` and run `npm install`. 

### Gulp.yaml
In order to specify the entrypoint you have to create a `Configuration/Gulp.yaml` within your theme package.

Hint: The composer type we use for that is `"type": "neos-theme"`.

Hint: If you have defined `copyFiles`, please execute `gulp dist-copy`

#### Example 
Please check the example file [Gulp.yaml.example](Gulp.yaml.example) for more information.

## Commands

To exectute commands, please go to `./Build/Gulp`.
```
- dist-css
- dist-js
- dist-copy
- favicon
- hint-js
- lint-scss
- sass
- server
- watch
```

Known issues
------------
If you have the watcher running and you create new scss or js files, you have to restart to watch processor in order to consider them for processing. 

Acknowledgments
---------------
Development sponsored by [web&co](http://webandco.com).

License
----------
Licensed under MIT, see [LICENSE](LICENSE)