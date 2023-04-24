let nextId:number = 1;

@Directive({selector:'[appPeekAboo]', exportAs:'peekAboo'})

export class PeekAbooDirective implements OnInit {
    constructor(private logger: loggerService){

    }



    ngOnInit(){
        this.logger.log('OnInit');
    }

    logIt(msg: string){
        this.logger.log(`#${nextId++} ${msg}`);
    }
}