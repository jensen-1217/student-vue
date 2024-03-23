import { login, logout, getInfo } from '@/api/login'
import { getToken, setToken, removeToken } from '@/utils/auth'

const user = {
  state: {
    token: getToken(),
    id: '',
    name: '',
    avatar: '',
    roles: [],
    permissions: []
  },

  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_ID: (state, id) => {
      state.id = id
    },
    SET_NAME: (state, name) => {
      state.name = name
    },
    SET_AVATAR: (state, avatar) => {
      state.avatar = avatar
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles
    },
    SET_PERMISSIONS: (state, permissions) => {
      state.permissions = permissions
    }
  },

  actions: {
    // 登录
    Login({ commit }, userInfo) {
      const username = userInfo.username.trim()
      const password = userInfo.password
      const role=userInfo.role
      const uuid = userInfo.uuid
      return new Promise((resolve, reject) => {
        login(username, password, role, uuid).then(res => {
          setToken(res.token)
          commit('SET_TOKEN', res.token)
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },

  // 获取用户信息
GetInfo({ commit, state }) {
  return new Promise((resolve, reject) => {
    getInfo().then(res => {
      if (res && res.user) {
        const user = res.user;
        const avatar = (user.avatar == "" || user.avatar == null) ? require("@/assets/images/profile.jpg") : process.env.VUE_APP_BASE_API + user.avatar;
        if (res.role && res.role.length > 0) { // 验证返回的roles是否是一个非空数组
          commit('SET_ROLE', res.role);
          commit('SET_PERMISSIONS', res.permissions);
        } else {
          commit('SET_ROLE', ['ROLE_DEFAULT']);
        }
        commit('SET_ID', user.userId);
        commit('SET_NAME', user.userName);
        commit('SET_AVATAR', avatar);
        resolve(res);
      } else {
        reject(new Error("未找到用户信息"));
      }
    }).catch(error => {
      reject(error);
    });
  });
},


    // 退出系统
    LogOut({ commit, state }) {
      return new Promise((resolve, reject) => {
        logout(state.token).then(() => {
          commit('SET_TOKEN', '')
          commit('SET_ROLES', [])
          commit('SET_PERMISSIONS', [])
          removeToken()
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 前端 登出
    FedLogOut({ commit }) {
      return new Promise(resolve => {
        commit('SET_TOKEN', '')
        removeToken()
        resolve()
      })
    }
  }
}

export default user
