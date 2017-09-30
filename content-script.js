/*
    https://addons.mozilla.org/en-US/firefox/search/?q=page+scroll&appver=&platform=linux
    后面还可以增加 1 自动卷屏的指令， 2 同步配置，导入导出配置， 3 按站点改为按url控制粒度更细，4 增加个禁用按钮
*/
document.addEventListener('keypress', function (e) {
    if (document.activeElement.tagName=="INPUT" || document.activeElement.tagName=="TEXTAREA") {
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
    
    browser.storage.local.get('sites').then( sites_query => {
        let sites = sites_query[0]['sites'].split(',');
        let site_key;
        for (site in sites) {
            let patt = new RegExp(sites[site]);
            if (patt.test(document.location.host)) {
                site_key = sites[site];
                break;
            }
        }
        if (site_key !== undefined) {
            let key = site_key+(gotoNext?"#next":"#pre");
            
            browser.storage.local.get(key).then(result=>{
                //console.dir(result);
                let ele = document.querySelector(result[0][key]);
                ele.click();
            }, error => {
              console.log(`Error: ${error}`);
            });
        }
    });
}, true);

