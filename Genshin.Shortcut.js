function parseCookie() {
    return document.cookie.split(';').map(v=>v.split('=')).reduce((acc, v)=>{
        acc[decodeURIComponent(v[0].trim())] = decodeURIComponent(v[1].trim());
        return acc
    }, {})
}
const cookie = parseCookie();
const token = cookie['ltoken'];
const uid = cookie['ltuid'];
if (!token || !uid) {
    setTimeout(() => alert('请先登录后再运行此脚本。'), 0);
    completion();
} else {
    completion(`ltoken=${token};ltuid=${uid}`);
}