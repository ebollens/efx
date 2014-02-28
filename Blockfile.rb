block 'efx', :path => 'src' do |efx|

  block 'engine', :require => true do
    js_file 'engine.js'
  end

  block 'driver', :path => 'driver' do

    dependency efx.route 'engine'

    block 'accordion' do
      scss_file 'accordion.scss'
      js_file 'accordion.js'
    end

    block 'tabs' do
      scss_file 'tabs.scss'
      js_file 'tabs.js'
    end

    block 'toggle' do
      scss_file 'toggle.scss'
      js_file 'toggle.js'
    end

  end

end