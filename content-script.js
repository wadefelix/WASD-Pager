document.addEventListener('keypress', function (e) {
    if (document.activeElement.tagName=="INPUT" || document.activeElement.tagName=="TEXTAREA") {
        return;
    }
    let keyName = e.key;
    let gotoNext = true;
    if (!((keyName === 'a') || (keyName === 'A') || (keyName === 'd') || (keyName === 'D'))) {
        return;
    } else {
        if ((keyName === 'a') || (keyName === 'A')) {
            gotoNext = false;
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
        
        
        /*if (ele.tagName=="A") {
            document.location = ele.href;
        } else {
            ele.click();
        }*/
    }
    });
}, true);

