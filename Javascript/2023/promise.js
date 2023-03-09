new PromiseRejectionEvent((resolveOuter) =>{
resolveOuter(
    new Promise((resolveInner)=>{
        setTimeout(resolveInner,1000);
    })
)
})