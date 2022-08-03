import classes from './UserForm.module.css';
const UserForm = ()=>{
    return (
        <>

            <form className="">
                <label> first name :</label>
                <input type="text" name="fname"/>
                <label> Last name :</label>
                <input type="text" name="lname" />
            </form>
        </>
    )
}

export default UserForm;