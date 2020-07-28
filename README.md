# Neos CMS gulp processor for BEM Themes

This package aims to be one of many solutions to tackle theming in Neos CMS. We love BEM, that's why we wanted to have theme packages with self contained fusion components (fusion, js, css) and a corresponding build process for that.

WARNING: This package is work in process!

## What does it do?

Basically it iterates through your site packages and generates js and css dist files configured in several Gulp.yaml files.

Hint: The loading order of the package components is not relevant as long as you stick to the BEM pattern.

## Install

After the installation, change to the directory `./Build/Gulp` and run `npm install`. 

### Gulp.yaml

In order to specify the entrypoint you have to create a `Configuration/Gulp.yaml` within your Neos package.

Hint: As composer type for a theme package we use `"type": "neos-site"`.

### Global Gulp.yaml
You can also specify a global Gulp.yaml file in `PROJECT_ROOT/Configuration/Gulp.yaml`. The config of this file will be merged into every other specified Gulp.yaml file. It is possible to remove global config in a project config file by setting the  config to `null`.

Additionally, in this file you can add additional packages that should also be processed (some package in `Packages/Application` for example).

#### Example 

Please check the example file [Gulp.yaml.example](Gulp.yaml.example) and [Global_Gulp.yaml.example](Global_Gulp.yaml.example) for more information.

## Commands

To exectute commands, please go to `./Build/Gulp`.
```
- dist
- clean
- rebuild
- dist-css-bundle
- dist-css-fusion
- dist-js-bundle
- dist-js-fusion
- dist-js-library
- dist-copy
- dist-serviceworker
- favicon
- lint-js
- lint-scss
- server
- watch
```

Known issues
------------
If you have the watcher running and you create new scss or js files, you have to restart the watch or server task in order to consider them for processing. 

Acknowledgments
---------------

Development sponsored by [web&co](http://webandco.com).

License
----------
Licensed under MIT, see [LICENSE](LICENSE)
