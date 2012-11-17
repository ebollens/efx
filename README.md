# Efx

## 1. Status

Efx is currently a WORK IN PROGRESS and not yet intended for production use.

## 2. Overview

Efx is a Javascript library designed to make it easy to implement effects 
through HTML 5 markup. At its root, it is based on the "trigger-target" 
paradigm whereby, when a user interacts with a trigger in a defined manner, an 
effect occurs on its target(s).

### 2.1. Motivation

The simplest example of an expandable content area:

```html
<button data-target="element">Trigger</button>
<div id="element" data-effect="expand">Target</div>
```

Parent-based resolution of an effect on a target:

```html
<button data-target="element">Trigger</button>
<div data-effect="expand">
    <div id="element">Target</div>
    <div>Not a target</div>
</div>
```

Selector-based resolution for expanding multiple content areas at once:

```html
<button data-target=".element">Trigger</button>
<div data-effect="expand">
    <div class="element">One target</div>
    <div>Not a target</div>
    <div class="element">Another target</div>
</div>
```

### 2.2. Dynamics

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

## 3. Credits

Efx is written and maintained by Eric Bollens.

Efx would not be possible without the good work of several other projects:

* jQuery - http://jquery.com - Efx is implemented as a jQuery module
* QUnit - http://qunitjs.com - Efx uses QUnit in its test suite

## 4. License

Efx is open-source software licensed under the BSD 3-clause license. The full 
text of the license may be found in the LICENSE file.
