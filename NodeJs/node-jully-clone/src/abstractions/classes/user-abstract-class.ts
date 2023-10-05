
export abstract class UserAbstractClass<T> {
    abstract signUpUser(request: T): Promise<any>;
}