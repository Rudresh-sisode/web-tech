import { HttpEvent, HttpEventType, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Observable } from "rxjs";
import { tap } from "rxjs/operators";

export class AuthInterceptorService implements HttpInterceptor{

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const mRequest = req.clone({
            headers:req.headers.append('Auth','xyz')
        })
        console.log("requrest is on it's way")
        return next.handle(mRequest).pipe(tap(event =>{
            console.log('event data',event);
            if(event.type === HttpEventType.Response){
                console.log('response arrived, body data ');
                console.log('event body',event.body);
            }
        }))
    }
}