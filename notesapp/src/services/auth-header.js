export default function authHeader() {
    const accessToken = JSON.parse(localStorage.getItem('accessToken'));
    const user = JSON.parse(localStorage.getItem('user'));
  
    if (user && accessToken) {
      return { Authorization: 'Bearer ' + accessToken };
    } else {
      return {};
    }
  }