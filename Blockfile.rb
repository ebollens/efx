##
## WebBlocks Blockfile (experimental)
## https://github.com/WebBlocks/WebBlocks
##

##
## DEFINITION
##

block 'efx', :path => 'src' do |efx|

  block 'engine', :required => true do
    loose_dependency framework.route 'jquery'
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