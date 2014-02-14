# Efx

## Status

Efx is currently a WORK IN PROGRESS and not yet intended for production use.

## Overview

Efx is a Javascript library designed to make it easy to implement effects 
through HTML 5 markup. At its root, it is based on the "trigger-target" 
paradigm whereby, when a user interacts with a trigger in a defined manner, an 
effect occurs on its target(s).

### Motivation

The simplest example of an expandable content area:

```html
<button data-target="element">Trigger</button>
<div id="element" data-effect="toggle">Target</div>
```

Parent-based resolution of an effect on a target:

```html
<button data-target="element">Trigger</button>
<div data-effect="toggle">
    <div id="element">Target</div>
    <div>Not a target</div>
</div>
```

Selector-based resolution for expanding multiple content areas at once:

```html
<button data-target=".element">Trigger</button>
<div data-effect="toggle">
    <div class="element">One target</div>
    <div>Not a target</div>
    <div class="element">Another target</div>
</div>
```

### Dynamics

The Efx engine is implemented as a jQuery module.

Consequently, it can be initialized as:

```js
$('#target').efx()
```

However, before initialization occurs, one or more drivers should be added.

```js
$().efx('add', effect, event, driver)
```

The `effect` is a common name given to the effect, such as "expand". The 
`event` is a DOM event such as "click". The `driver` is a function that is 
initiated upon the event occurring.

While the engine manages the delegation of the trigger-target paradigm, it is 
the drivers that actually provide the effects functionality.

The general prototype for a driver function is:

```js
function(data){

    var trigger   = data.trigger,
        target    = data.target,
        container = data.container;

    /* do something to the container, target and trigger */
}
```

In this prototype, `trigger` is the element that was clicked, `target` is the
element that was directly targeted, and `container` is the element that defines
the effect (which might be the same as `target`). All three are jQuery objects.

A simple expand effect on the click event might be implemented as:

```js
$().efx('add', 'expand', 'click', function(data){

    var target    = data.target,
        trigger   = data.trigger;

    if(target.is(':hidden')){
        trigger.addClass('active');
        target.slideDown();
    }else{
        trigger.removeClass('active');
        target.slideUp();
    }

})
```

The engine also reserves a special `init` event that will fire when the Efx is 
first initialized on the element or a containing element.

Running with the expand example above, `init` might set the initial state of 
the trigger:

```js
$().efx('add', 'expand', 'init', function(data){

    var target    = data.target,
        trigger   = data.trigger;

    if(target.is(':hidden')){
        trigger.addClass('active');
    }else{
        trigger.removeClass('active');
    }

})
```

For each event that invokes the engine, the engine will only invoke one effect 
callback per target. Resolution of the effect (and container) occurs by way of 
a closest ancestor search, meaning that an effect on the element itself takes
precedence over its direct ancestor, its direct ancestor takes precedence over 
further ancestors, and so on.

In situations where multiple targets exist for a single trigger and the driver 
modifies trigger state, the driver must be careful not to modify the trigger's 
state multiple times.

It should also be noted that all drivers should be attached before Efx is 
initialized over element(s). Efx may be updated later in development to no 
longer impose this constraint.

## Drivers

### Toggle

The `toggle` driver provides the ability to designate a trigger that toggles 
the visibility on target(s). If a target is show, then it hides it, while if a
target is hidden, then it shows it. This driver has no side-effects on the
container or any of another elements besides the target.

The `data-toggle` attribute supports two visibility states on targets:

* `show` sets a target to be shown
* `hide` sets a target to be hidden

The `hide` visibility is the default behavior.

The `data-toggle` attribute also supports behavior states on the container:

* `basic` hides and shows the content without any effects.
* `slide` slides the content up and down rather than just showing and hiding it.
* `fade` fades the content in and out rather than just showing and hiding it.

The `basic` behavior is the default behavior.

If the target is also the container (the `data-effect` attribute is assigned 
directly on the target, then both a visibility and a behavior state may be 
specified at the same time.

A simple example:

```html
<button data-target="element">Trigger</button>
<div id="element" data-effect="toggle">Target</div>
```

An example that starts with the content visible:

```html
<button data-target="element">Trigger</button>
<div id="element" data-effect="toggle" data-toggle="show">Target</div>
```

An example that slides the content in and out rather than showing and hiding it,
also starting with the content visible in this particular example:

```html
<button data-target="element">Trigger</button>
<div id="element" data-effect="toggle" data-toggle="slide show">Target</div>
```

An example that fades the content in and out rather than showing and hiding it,
also starting with the content visible in this particular example:

```html
<button data-target="element">Trigger</button>
<div id="element" data-effect="toggle" data-toggle="fade show">Target</div>
```

### Accordion

The `accordion` driver is similar to `toggle` in that it handles visibility.
However, as opposed to `toggle`, the `accordion` driver hides all other 
targets in the `data-effect="accordion"` container. It will not, however,
affect any elements that are not targets of `data-effect`, allowing one to
specify other elements within the accordion that are not affected by the effect.

The `data-accordion` attribute supports two visibility states on targets:

* `show` sets a target to be shown
* `hide` sets a target to be hidden

The `hide` visibility is the default behavior.

The `data-toggle` attribute also supports behavior states on the container:

* `basic` simply hides and shows the content without any effects.
* `slide` slides the content up and down rather than just showing and hiding 
it. The slide effect simultaneously slides up any non-targeted contents while
sliding down any targeted contents.
* `fade` fades the content in and out rather than just showing and hiding it. 
In this case, the non-targeted contents will be hidden without a fade, because
otherwise this creates a jarring effect on the page layout.

The `slide` behavior is the default behavior.

A visibility and behavior state should not be specified on the same element,
because a target should not also be the container. If a target is the same
as a container, then the `toggle` driver should be used instead.

A simple example:

```html
<div data-effect="accordion">
    <div data-target="element1">Trigger 1</div>
    <div id="element1">Target 1</div>
    <div data-target="element2">Trigger 2</div>
    <div id="element2">Target 2</div>
</div>
```

Triggers may also reside outside of the accordion container:

```html
<div data-target="element1">Trigger 1</div>
<div data-target="element2">Trigger 2</div>
<div data-effect="accordion">
    <div id="element1">Target 1</div>
    <div id="element2">Target 2</div>
</div>
```

An example that slides the content in and out rather than showing and hiding it:

```html
<div data-effect="accordion" data-accordion="slide">
    <div data-target="element1">Trigger 1</div>
    <div id="element1">Target 1</div>
    <div data-target="element2">Trigger 2</div>
    <div id="element2">Target 2</div>
</div>
```

An example that fades the content in and out rather than showing and hiding it:

```html
<div data-effect="accordion" data-accordion="fade">
    <div data-target="element1">Trigger 1</div>
    <div id="element1">Target 1</div>
    <div data-target="element2">Trigger 2</div>
    <div id="element2">Target 2</div>
</div>
```

### Tabs

The `tabs` driver is similar to `toggle` in that it handles visibility.
However, as opposed to `toggle`, the `tabs` driver hides all other 
targets in the `data-effect="tabs"` container. It will not, however,
affect any elements that are not targets of `data-effect`, allowing one to
specify other elements within the tabs markup that are not affected by the 
effect.

The `data-tabs` attribute supports two visibility states on targets:

* `show` sets a target to be shown
* `hide` sets a target to be hidden

The `hide` visibility is the default behavior.

The `data-toggle` attribute also supports behavior states on the container:

* `basic` simply hides and shows the content without any effects.
* `slide` slides the content up and down rather than just showing and hiding 
it. The slide effect simultaneously slides up any non-targeted contents while
sliding down any targeted contents.
* `fade` fades the content in and out rather than just showing and hiding it. 
In this case, the non-targeted contents will be hidden without a fade, because
otherwise this creates a jarring effect on the page layout.

The `fade` behavior is the default behavior.

A visibility and behavior state should not be specified on the same element,
because a target should not also be the container. If a target is the same
as a container, then the `toggle` driver should be used instead.

A simple example:

```html
<div data-target="element1">Trigger 1</div>
<div data-target="element2">Trigger 2</div>
<div data-effect="tabs">
    <div id="element1">Target 1</div>
    <div id="element2">Target 2</div>
</div>
```

Triggers may also reside within the tabs container:

```html
<div data-effect="tabs">
    <div data-target="element1">Trigger 1</div>
    <div data-target="element2">Trigger 2</div>
    <div id="element1">Target 1</div>
    <div id="element2">Target 2</div>
</div>
```

An example that just hides/shows the content without fading it:

```html
<div data-target="element1">Trigger 1</div>
<div data-target="element2">Trigger 2</div>
<div data-effect="tabs" data-tabs="basic">
    <div id="element1">Target 1</div>
    <div id="element2">Target 2</div>
</div>
```

An example that slides the content in and out rather than fading it:

```html
<div data-target="element1">Trigger 1</div>
<div data-target="element2">Trigger 2</div>
<div data-effect="tabs" data-tabs="slide">
    <div id="element1">Target 1</div>
    <div id="element2">Target 2</div>
</div>
```

## Development

In all cases, you must run:

```
npm install
```

To run the tests, additionally run:

```
./node_modules/bower/bin/bower install
```

To compile the engine with base drivers, call grunt:

```
./node_modules/grunt-cli/bin/grunt
```

## Credits

Efx is written and maintained by Eric Bollens.

Efx is implemented as a jQuery (http://jquery.com) module.

In unit tests, Efx uses the QUnit (http://qunitjs.com) library.

In its demos, Efx uses Twitter Bootstrap (http://twitter.github.com/bootstrap)
and the jQuery Syntax Highlighter (https://github.com/balupton/jquery-syntaxhighlighter)
for presentational styles.

## License

Efx is open-source software licensed under the BSD 3-clause license. The full 
text of the license may be found in the LICENSE file.
