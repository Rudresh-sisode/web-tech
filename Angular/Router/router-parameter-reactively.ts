export class UserComponent implements OnInit{

    ngOnInit(){
        const id = +this.route.snapshot.params['id'];
        this.server = this.serverService.getServer(id);
        this.route.params.subscribe(params:Params)=>{
            this.server = this.serversService.getServer(+params['id']);
        }

    }

    onEdit(){
        this.router.navigate(['edit'],{relativeTo:this.route,queryParamsHandling:'preserve'})
    }

}