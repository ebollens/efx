##
## WebBlocks Blockfile (experimental)
## https://github.com/WebBlocks/WebBlocks
##

##
## INCLUDES
##
## When building with WebBlocks directly from this repo, rather than when building as part of
## a larger set of blocks, uncomment include lines below to specify build:
##

#include 'efx', 'engine'
#include 'efx', 'driver', 'accordion'
#include 'efx', 'driver', 'tabs'
#include 'efx', 'driver', 'toggle'


##
## DEFINITION
##

block 'efx', :path => 'src' do |efx|

  block 'engine', :required => true do
    js_file 'engine.js'
  end

  block 'driver', :path => 'driver' do

    dependency efx.route 'engine'

    block 'accordion' do
      scss_file 'accordion.css'
      js_file 'accordion.js'
    end

    block 'tabs' do
      scss_file 'tabs.css'
      js_file 'tabs.js'
    end

    block 'toggle' do
      scss_file 'toggle.css'
      js_file 'toggle.js'
    end

  end

end