
/* eslint-disable */
console.log("Saa")

const login = async (email,password) => {
    console.log("Login")
    try {
    const res = await axios({
        method : 'POST',
        url: 'http://127.0.0.1:3000/api/v1/users/login',
        data: {
            email,
            password
        }
    });

    if(res.data.status === 'success') {
        alert('logged in successfully')
        window.setTimeout(() => {
            location.assign('/');
        },1500)
    }

    console.log(res);
} catch (err) {
    console.log(err.response.data.message);
    
}

}

document.querySelector('form.form').addEventListener('submit', e => {
    e.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    login(email,password);
    

})