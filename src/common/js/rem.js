!function(n){
    var e=n.document,
        t=e.documentElement,
        i=750,
        d=i/100,
        o="orientationchange"in n?"orientationchange":"resize",
        a=function(){
            var w=t.clientWidth||320;w>750&&(w=750);
            t.style.fontSize=w/d+"px"
        };
        e.addEventListener&&(n.addEventListener(o,a,!1),e.addEventListener("DOMContentLoaded",a,!1))
}(window);