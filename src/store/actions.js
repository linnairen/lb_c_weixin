
export const passToken = ({commit},token) => {
    commit('SETTOKEN',token)
}
export const passIsOrdered = ({commit},isOrdered) => {
    commit('SETISORDERED',isOrdered)
}
export const passOrderState = ({commit},orderState) => {
    commit('SETORDERSTATE',orderState)
}