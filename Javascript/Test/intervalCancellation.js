// 
var cancellable = function(fn, args, t) {
    fn(...args);

    let startInterval = setInterval(()=> fn(...args),t);

    function cancelFn(){
        clearInterval(startInterval);
    }

    return cancelFn;
};