import axios from "axios";

const API_URL = "http://localhost:3000/api/user/";

class AuthService {
  login(email, password) {
    return axios
      .post(API_URL + "signin", {
        "user": {
          email,
          password
        }
      })
      .then(response => {
        if (response.data.accessToken) {
          localStorage.setItem("accessToken", JSON.stringify(response.data.accessToken));
          localStorage.setItem("user", JSON.stringify(response.data.user));
        }

        return response.data;
      });
  }

  logout() {
    localStorage.removeItem("user");
  }

  register(username, email, password) {
    return axios.post(API_URL + "signup", {
      "user": {
        username,
        email,
        password
      }
    });
  }

  getCurrentUser() {
    return JSON.parse(localStorage.getItem('user'));;
  }
}

export default new AuthService();