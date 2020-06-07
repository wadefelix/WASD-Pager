var browser=chrome;

// 将数据保存到local storage中
function saveOptions(allData) {
    var sites_cfg = {};
    for (var i in allData) {
        var data = allData[i];
        if (data[0].length>0) {
            sites_cfg[data[0]] = {next: data[2], pre:data[1]};
        }
    }
    // 先把本地数据全部擦了，待实现单个擦除后就可以不全部擦除了。
    browser.storage.sync.clear();
    browser.storage.sync.set(sites_cfg);
}

// 获取数据
var getAllData = function(){
    var tb = document.getElementById('sitesoptions');
        var allData=[];
        var ctr = tb.childNodes;
        for(var i=0; i<ctr.length; i++){
            allData[i]=[];
            for(var j=0; j<ctr[i].children.length-1; j++)
                allData[i].push(ctr[i].children[j].children[0].firstChild.nodeValue.trim());
        }
        ctr=[];
        return allData;
};

// 添加保存全部数据保存事件
function saveAllData(){
        var allData = getAllData();
        if(allData.length){
            saveOptions(allData)
        }else{
            //alert('No data!');
        }
};

function restoreOptions() {

    var saveAllBtn = document.getElementById('btnsave');
    saveAllBtn.onclick = saveAllData;

    var tb = document.getElementById('sitesoptions');
    var colnum = 4;
    var addBtn = document.getElementById('btnadd');

    var del = tb.getElementsByTagName('a');
    var span = tb.getElementsByTagName('span');
    
    var delEvent = function(){
        var dder = this.parentNode.parentNode;
        dder.parentNode.removeChild(dder);
    };
    
    
    // 点击生成修改框
    var spanEvent = function(){
        var value = this.firstChild.nodeValue;
        var input = document.createElement('input');
        input.value = value;
        this.parentNode.appendChild(input);
        this.parentNode.removeChild(this);
        input.focus();
        // 失去焦点移除修改框
        input.onblur = function(){
            var span = document.createElement('span');
            // 如果修改了单元格的默认值，这里也做相应修改
            span.appendChild(document.createTextNode(this.value?this.value:'null'));
            span.onclick =spanEvent;
            this.parentNode.appendChild(span);
            this.parentNode.removeChild(this);
        }
        input.onkeydown = function (e) {
        	if (!e) var e = window.event;
            var code;
        	if (e.keyCode) code = e.keyCode;
        	else if (e.which) code = e.which;
            if(code == 13)
        	{		
        		input.blur();
        		//return false;
        	}
        }
    };

    // 给现在有元素添加事件
    for(var i in del) del[i].onclick = delEvent;
    for(var j in span) span[j].onclick = spanEvent;

    var strDel = browser.i18n.getMessage("stringDel");
    if (strDel.length==0) strDel = "Del";

    // 默认值，在这里修改的
    function* genSample(){
        yield 'bing.com';
        yield 'a.sb_pagP';
        yield 'a.sb_pagN';
    }
    addrow = function(){
        var tr = document.createElement('tr');
        let sample = genSample();
        for(var j=0; j<colnum; j++){
            var td = document.createElement('td');
            if(j==(colnum-1)){
                var del = document.createElement('a');
                del.href='javascript:;';
                del.appendChild(document.createTextNode(strDel));
                del.onclick = delEvent;// 给新加元素添加事件
                td.appendChild(del);
            }else{
                var span = document.createElement('span');
                span.appendChild(document.createTextNode(arguments[0] instanceof Array?arguments[0][j]:sample.next().value));
                td.appendChild(span);
                span.onclick =spanEvent;
            }
            tr.appendChild(td);
        }
        tb.appendChild(tr);
    };
    addBtn.onclick = addrow;

    browser.storage.sync.get(null,(sites_cfg)=>{
        if (sites_cfg===undefined || sites_cfg===null) {
            return
        }

        for (var s in sites_cfg) {
            addrow(Array(s, sites_cfg[s].pre, sites_cfg[s].next))
        }
    })
}



document.addEventListener('DOMContentLoaded', function(){
    restoreOptions();
    document.getElementById("thsite").innerText = browser.i18n.getMessage("stringSite");
    document.getElementById("pre").innerText = browser.i18n.getMessage("stringPre");
    document.getElementById("next").innerText = browser.i18n.getMessage("stringNext");
    document.getElementById("op").innerText = browser.i18n.getMessage("stringOp");
    
    document.getElementById("btnadd").innerText = browser.i18n.getMessage("stringAdd");
    document.getElementById("btnsave").innerText = browser.i18n.getMessage("stringSave");
});
