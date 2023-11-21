// auth.ts 登录获取Token用
import { createStore, Commit } from 'vuex';

interface AuthState {
  token: string | null;
}

const state: AuthState = {
  token: localStorage.getItem('token') || null,
};


const mutations = {
  setToken(state: AuthState, token: string) {
    state.token = token;
    localStorage.setItem('token', token);
  },
  clearToken(state: AuthState) {
    state.token = null;
    localStorage.removeItem('token');
  },
};

const actions = {
  login({ commit }: { commit: Commit }, credentials: { username: string; password: string }) {
    // 调用您的身份验证API，获取令牌
    console.log(credentials)
    const token = 'your_generated_token';
    commit('setToken', token);
  },
  logout({ commit }: { commit: Commit }) {
    // 清除令牌，即退出登录
    commit('clearToken');
  },
};

const getters = {
  isAuthenticated: (state: AuthState) => !!state.token,
  getToken: (state: AuthState) => state.token,
};

export default createStore({
  state,
  mutations,
  actions,
  getters,
});
