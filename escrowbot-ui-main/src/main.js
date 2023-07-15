const logout = ()=>{
    console.log("Logging out current user")
    window.sessionStorage.clear()
    window.location.replace("/signin")
}
