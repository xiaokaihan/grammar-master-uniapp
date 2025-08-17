'use strict';

const db = uniCloud.database()
const usersCollection = db.collection('users')

exports.main = async (event, context) => {
  try {
    const { userId } = event
    
    if (!userId) {
      return {
        success: false,
        message: '缺少用户ID'
      }
    }
    
    const user = await usersCollection.doc(userId).get()
    
    if (user.data.length === 0) {
      return {
        success: false,
        message: '用户不存在'
      }
    }
    
    return {
      success: true,
      message: '获取用户信息成功',
      data: user.data[0]
    }
    
  } catch (error) {
    console.error('获取用户信息失败:', error)
    return {
      success: false,
      message: '获取用户信息失败'
    }
  }
}
