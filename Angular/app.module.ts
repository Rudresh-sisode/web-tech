const appRoutes:Routes = [
    {path:'',component:HomeComponent},
    {path:'users',component:UsersComponent},
    {path:'users/:id/:name',component:ServerComponent,children:[
        {path:':id',component:ServerComponent},
        {path:'id/edit',component:EditServerComponent}
    ]}
]