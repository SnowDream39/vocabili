import axios from "axios";

interface UserLogin {
  username: string,
  password: string
}

interface UserRegister {
  email: string,
  password: string,
  username: string
}

const api = axios.create({
  baseURL: 'https://api.vocabili.top/user'
})


export const login = async (form: UserLogin) => {

  const data = new URLSearchParams()
  data.append('grant_type', 'password')
  data.append('username', form.username)
  data.append('password', form.password)
  data.append('scope', '')
  data.append('client_id', 'string')        // 如果Swagger要求，这里必须写
  data.append('client_secret', '********') // 同上

  const response = await api.post('/auth/jwt/login', data, {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Accept': 'application/json',
    },
  })

  return response.data.access_token
}

export const register = async (form: UserRegister) => {
  const response = await api.post('/auth/register', {
    email: form.email,
    password: form.password,
    username: form.username
  })

  return response.data
}
