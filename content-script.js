/*
    https://addons.mozilla.org/en-US/firefox/search/?q=page+scroll&appver=&platform=linux
    后面还可以增加 1 自动卷屏的指令， 2 同步配置，导入导出配置， 3 按站点改为按url控制粒度更细，4 增加个禁用按钮
*/
var browser=chrome;

document.addEventListener('keypress', function (e) {
  // 文字输入区避免激活
  if (document.activeElement.tagName=="INPUT" || document.activeElement.tagName=="TEXTAREA") {
    return;
  }
  browser.storage.local.get('wasd-enabled', enabled => {
    let _enabled = true;;
    if (enabled.hasOwnProperty('wasd-enabled')) {
        _enabled = enabled['wasd-enabled'] ? true:false;
    }
    // 功能关闭时不激活
    if (!_enabled) {
        return;
    }

    let keyName = e.key.toUpperCase();
    
    let gotoNext = true;
    let gotoHome = false;
    let gotoEnd = false;
    let gotoPageup = false;
    let gotoPagedown = false;
    
    if (['A','D','S','W','Q','E'].indexOf(keyName)<0) {
        return;
    } else {
        if (keyName === 'A') {
            gotoNext = false;
        } else if (keyName === 'D') {
            gotoNext = true;
        } else if (keyName === 'W') {
            gotoPageup = true;
            window.scrollByPages(-1);
            return;
        } else if (keyName === 'S') {
            gotoPagedown = true;
            window.scrollByPages(1);
            return;
        } else if (keyName === 'E') {
            gotoEnd = true;
            window.scroll(document.documentElement.scrollLeft,document.documentElement.scrollHeight);
            return;
        } else if (keyName === 'Q') {
            gotoHome = true;
            window.scroll(document.documentElement.scrollLeft,0);
            return;
        }
    }

    /**
     * 站点配置信息保存在sync区吧
     * 格式 key - 站点域名
     *     value - {next:"<next>", pre: "<pre>"}
     */
    browser.storage.sync.get(document.location.host, (sites_cfg) => {
        let cfg = sites_cfg[document.location.host]
        if (cfg !== undefined) {
            let ele = document.querySelector(gotoNext?cfg["next"]:cfg["pre"]);
            if (ele) {
                ele.click();
            }
        }
    });
  });
}, true);

