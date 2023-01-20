import { Directive,ViewContainerRef } from "@angular/core";

@Directive({
    selector:'[appPlaceholder]'
})

export class PlaceholderDirective{
    // viewContainerRef: any;
    constructor(public viewContainerRef:ViewContainerRef){

    }
}