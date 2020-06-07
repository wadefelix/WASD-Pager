var browser=chrome;
/*
 * 更新icon
 */
function updateIcon(_enabled) {
      browser.browserAction.setIcon({
            path: _enabled ? {
              16: "icons/page-16-colored.png",
              32: "icons/page-32-colored.png"
            } : {
              16: "icons/page-16.png",
              32: "icons/page-32.png"
            }
      });
      browser.browserAction.setTitle({
        title: _enabled ? 'disable WASD' : 'enable WASD'
      });
}

/*
 * Enable/Disable WASD
 */
function toggleWASD() {
  browser.storage.local.get('wasd-enabled').then( enabled => {
        let _enabled;
        if (enabled.hasOwnProperty('wasd-enabled')) {
            _enabled = enabled['wasd-enabled'] ? true:false;
        } else if (enabled.hasOwnProperty(0) && enabled[0].hasOwnProperty('wasd-enabled')) {
            sites = enabled[0]['sites'] ? true:false;
        } else {
            _enabled = true;
        }
        
        _enabled = !_enabled;
        
        browser.storage.local.set({
          'wasd-enabled' : _enabled
        });
        updateIcon(_enabled);
  });
}

function initialWASD() {
  browser.storage.local.get('wasd-enabled').then( enabled => {
        let _enabled;
        if (enabled.hasOwnProperty('wasd-enabled')) {
            _enabled = enabled['wasd-enabled'] ? true:false;
        } else if (enabled.hasOwnProperty(0) && enabled[0].hasOwnProperty('wasd-enabled')) {
            sites = enabled[0]['sites'] ? true:false;
        } else {
            _enabled = true;
        }
        
        updateIcon(_enabled);
  });
}
initialWASD();

browser.browserAction.onClicked.addListener(toggleWASD);