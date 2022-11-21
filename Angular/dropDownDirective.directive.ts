import {Directive,HostBiding,HostListener} from '@angular/core';

@Directive({
    selector:'[appDirective]'
})
class DropDownDirective{
    @HostBinding('class.open') isOpen = false;
    @HostListener('click') toggleOpen(){
        this.isOpen = !this.isOpen;
    }
}