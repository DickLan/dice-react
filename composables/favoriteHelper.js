import { useAuthStore } from './../stores/auth'
import { apiHelper } from './../utils/helpers'

const favoriteHelper = {
  addFavorite: async (tombId) => {
    try {
      // 避免在fun之外直接調用useAuthStore()
      // 在fun內使用useAuthStore() 才能確保是在 vue 初始化掛載pinia後 才執行
      const authStore = useAuthStore()
      const user = authStore.currentUser
      const response = await apiHelper.post(`/favorite/${tombId}`, {
        tombId,
        userId: user.id
      })
      if (!response) {
        alert('收藏失敗')
        return false
      }
      return true

    } catch (error) {
      console.log('error', error);
      return false

    }
  },


  deleteFavorite: async (tombId) => {
    try {
      const authStore = useAuthStore()
      const user = authStore.currentUser
      const response = await apiHelper.delete(`/favorite/${tombId}`, {
        tombId,
        userId: user.id
      })
      if (!response) {
        alert('取消收藏失敗')
        return false
      }
      return true
    } catch (error) {
      console.log('error', error);
      return false
    }
  }
}

export { favoriteHelper } 