# [bower proxy](http://bowerproxy.herokuapp.com/)
  I'm working behind a corporate proxy that doesn't allow me to use the internets via `git:`. This makes using bower impossible. So I thought it would be cool to have some kind of app to at least download bower packages and receive them as a zip file. That's what bower proxy is for.

## Usage

  Bower proxy will download and zip any bower package for you.

### Downloading packages and dependencies

```
http://bowerproxy.herokuapp.com/install/jquery
```
```
http://bowerproxy.herokuapp.com/install/jquery/1.8.3
```

## Todo
  * caching
  * download multiple packages
  * support other types of compression than zip

## License

Copyright 2013 Martin Knopf

Licensed under the MIT License
