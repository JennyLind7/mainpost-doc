# <i class="fas fa-lock"></i>  Login
After all container are started, you can login to the application on [Netlify](https://mainpost-projektseminar.netlify.app/). Login with you credentials. Your username is the first letter of the name and the full surename.
<br>
<br>

![Login](login.png)

The login process is performed using the loginWithSupabase method, which uses the Supabase authentication services and redirects to the /dashboard page if the login is successful.


[<i class="fas fa-folder"></i> Check out our vue.js LoginComponent component](https://github.com/UHPDome/backend_mainpost/blob/main/frontend/src/components/Authentification/Login/LoginComponent.vue)

---
**The following queries were executed to extract authentification information:**

<details open>
<summary>Authentification functions</summary>

```
## retrieve auth State from session when changes occur
async function getAuthState()

## get all users 
async function fetchUsers()

## get currently logged in user from session
async function fetchLoggedUser()

```
</details>
