# Welance Craft Grid Plugin
Add datatypes to use [welance-bs](https://github.com/welance/welance-bs) Grid System to customise positions of Matrix Blocks.

- - -

## General Info

This project aims to add a dataype of "block position" which can then be added to any other field in the CraftCMS (2.6.x) ecosystem.
It uses the [welance-bs 12 Grid System](https://github.com/welance/welance-bs/tree/master/src/sass/welanstrap/layout) which works this way:
```html
<!-- Width of 12 cols for XS, 6 cols for MD and XL -->
<div class="col col--12-12@xs col--6-12@md col--6-12@xl"></div>
```
It allows to give clean CSS classes coming from the welance-bs grid any block of CraftCMS, allowing the developer (or whoever setup fields) to specify a maximum of **4 breakpoints:**
* mobile
* tablet
* desktop
* wide

#### This project features:
* CraftCMS plugin
* CraftCMS fieldtype (with settings)
* Basic CSS (no SASS)
* Basic JS (jquery inherited from CraftCMS CP)

[TODO]: Add webpack or any other bundler to bundle production ready files (not extremely important since code is very small)


## Software Requirements
* Any PHP environment

## Application Requirements

* [CraftCMS 2.6.x](https://craftcms.com/)
* A CraftCMS template using [Welance Bootstrap](https://www.npmjs.com/package/@welance/welance-bs) Grid System (CSS/SASS)

## Installation Instructions

1. Move to your **plugins/** folder of your CraftCMS installation
2. `git clone https://github.com/welance/welance-craft-grid-plugin/`
3. Activate the plugin
4. Now you can modify your fields and add the new "position datatype" to any field

### Development

1. Fork this repo
2. Follow the Installation instructions to activate it
3. Modify the plugin as you please
4. If you think what you did is great and could work for us as well: send us a pull-request! :wink:

## Recovery Procedures
* No specific Recovery procedures.

## Project Documentation and Specification
* Check out the **[demo/documentation page](https://welance.github.io/welance-bs/)** to learn about Welance Bootstrap

## Contribution guidelines

* Read **[Welance Development Guidelines](https://welance-handbook.herokuapp.com/welance-development-guidelines.html)**
* Follow the **Development** procedure to contribute


- - -

* When you need to refer to **static assets**, always reference like `/assets/[folder]/[folder_or_file].[extension]` in both HTML, SASS and JS files

- - -

1. Use exclusively `npm` to install new modules

## Who do I talk to?

For more info you can ask [enrico](https://github.com/ricricucit/).
Check this project's open issues to see what needs to be developed!
