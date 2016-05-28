var host = 'https://leanote.com';
var datas = location.href.match(/\?data=(.*)$/);
var data = {};
if (datas) {
    try {
        data = JSON.parse(decodeURIComponent(datas[1]));
    } catch(e) {
        console.error(e);
    }
}
window.addEventListener('message', function(e) {
    // console.log('frame get msg');
    // console.log(e.data);
    window.frames['leanote-ifr'].postMessage(data, host);
}, false);