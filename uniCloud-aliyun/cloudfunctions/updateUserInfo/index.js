'use strict';

const db = uniCloud.database()
const usersCollection = db.collection('users')

exports.main = async (event, context) => {
  try {
    const { userId, updateData } = event
    
    if (!userId) {
      return {
        success: false,
        message: '缺少用户ID'
      }
    }
    
    if (!updateData || Object.keys(updateData).length === 0) {
      return {
        success: false,
        message: '缺少更新数据'
      }
    }
    
    // 验证更新字段
    const allowedFields = ['nickname', 'gender', 'country', 'province', 'city', 'language', 'avatar']
    const filteredData = {}
    
    for (const key in updateData) {
      if (allowedFields.includes(key)) {
        filteredData[key] = updateData[key]
      }
    }
    
    if (Object.keys(filteredData).length === 0) {
      return {
        success: false,
        message: '没有有效的更新字段'
      }
    }
    
    // 添加更新时间
    filteredData.updateTime = Date.now()
    
    // 更新用户信息
    const result = await usersCollection.doc(userId).update(filteredData)
    
    if (result.updated === 1) {
      // 获取更新后的用户信息
      const updatedUser = await usersCollection.doc(userId).get()
      
      return {
        success: true,
        message: '用户信息更新成功',
        data: updatedUser.data[0]
      }
    } else {
      return {
        success: false,
        message: '用户信息更新失败'
      }
    }
    
  } catch (error) {
    console.error('更新用户信息失败:', error)
    return {
      success: false,
      message: '更新用户信息失败，请重试',
      error: error.message
    }
  }
}
