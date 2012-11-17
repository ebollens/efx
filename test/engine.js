test("Module Attached", function() {

    ok(jQuery.fn.efx, "jQuery.efx() exists");
    ok($.fn.efx, "$.efx() exists");

    $('<div/>', {
        'data-toggle': 'aaa',
        text: 'Go to Google!'
    }).appendTo();
});

module("engine.js", {
    
    setup: function() {
        
        var counter = 0
        
        $(null).efx('add', 'test', function(data){
            
            var container = data.container,
                target    = data.target,
                trigger   = data.trigger;
            
            this.init = function(){
                
                $([trigger,target,container]).each(function(){
                    this.attr('data-init', 'true')
                })
                
            }
            
            this.execute = function(){
                
                var arr = [target,trigger]
                
                if(target[0] !== container[0])
                    arr.push(container)
                
                $(arr).each(function(){
                    var count = this.attr('data-execute') ? (parseInt(this.attr('data-execute'))+1) : 1
                    this.attr('data-execute', count)
                    this.attr('data-execute-last-effect', 'test')
                })
            }
            
        })
    },
    
    teardown: function() {
        $('#test > *').remove();
    }
    
});

test("Listener attached by ID", function() {
    
    $('<button/>', {'id': 'trigger', 'data-target': 'target'}).appendTo('#test');
    $('<div/>', {'id': 'target', 'data-effect': 'test'}).appendTo('#test');

    $('#test').efx()
    
    $('#trigger').click();
    
    ok($('#trigger').data('execute'), 'Trigger executed')
    ok($('#target').data('execute'), 'Target executed')
    
});

test("Listener attached by class", function() {
    
    $('<button/>', {'id': 'trigger', 'data-target': '.target'}).appendTo('#test');
    $('<div/>', {'class': 'target', 'data-effect': 'test'}).appendTo('#test');
    $('<div/>', {'class': 'target', 'data-effect': 'test'}).appendTo('#test');

    $('#test').efx()
    
    $('#trigger').click();
    
    ok($('#trigger').data('execute'), 'Trigger executed')
    equal($('.target').length, 2, 'Number of targets')
    $('.target').each(function(idx){
        ok($(this).data('execute'), 'Target '+(idx+1)+' executed')
    })
    
});

test("Effect resolved to parent", function() {
    
    $('<button/>', {'id': 'trigger', 'data-target': 'target'}).appendTo('#test');
    $('<div/>', {'id': 'container', 'data-effect': 'test'}).appendTo('#test');
    $('<div/>', {'id': 'target'}).appendTo('#container');

    $('#test').efx()
    
    $('#trigger').click();
    
    ok($('#trigger').data('execute'), 'Trigger executed')
    ok($('#container').data('execute'), 'Container executed')
    ok($('#target').data('execute'), 'Target executed')
    
});

test("Effect resolved to child", function() {
    
    $('<button/>', {'id': 'trigger', 'data-target': 'target'}).appendTo('#test');
    $('<div/>', {'id': 'container', 'data-effect': 'test'}).appendTo('#test');
    $('<div/>', {'id': 'target', 'data-effect': 'test'}).appendTo('#container');

    $('#test').efx()
    
    $('#trigger').click();
    
    ok($('#trigger').data('execute'), 'Trigger executed')
    ok(!$('#container').data('execute'), 'Container did not execute')
    ok($('#target').data('execute'), 'Target executed')
    
});

test("Effect resolved to ignore undefined effect", function() {
    
    $('<button/>', {'id': 'trigger', 'data-target': 'target'}).appendTo('#test');    
    $('<div/>', {'id': 'container', 'data-effect': 'test'}).appendTo('#test');
    $('<div/>', {'id': 'target', 'data-effect': 'undefined'}).appendTo('#container');

    $('#test').efx()
    
    $('#trigger').click();
    
    equal($('#trigger').data('execute-last-effect'), 'test', 'Effect resolved')
    equal($('#container').data('execute-last-effect'), 'test', 'Effect resolved')
    equal($('#target').data('execute-last-effect'), 'test', 'Effect resolved')
    
});