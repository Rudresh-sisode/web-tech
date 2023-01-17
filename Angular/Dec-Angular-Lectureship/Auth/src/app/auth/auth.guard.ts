import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from "@angular/router";
import { Observable } from "rxjs";
import { map, take, tap } from "rxjs/operators";
import { AuthService } from "./auth.service";

@Injectable({providedIn:'root'})

export class AuthGuard implements CanActivate{

    constructor(private authService:AuthService,private router:Router){

    }
    //old approche
    // canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
    //     return this.authService.user.pipe(map(user=>{
    //         return !!user;//this method convert falsy and null value into boolean
    //     }),tap(isAuth=>{
    //         if(!isAuth){
    //             this.router.navigate['/auth'];
    //         }
    //     }))
    // }

    //new approches
    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
        return this.authService.user.pipe(take(1),map(user=>{
            const isAuth = !!user;//this method convert falsy and null value into boolean
            if(isAuth){
                return true;
            }
            else{
                return this.router.createUrlTree(['/auth']);
            }
        }));
    }
}


