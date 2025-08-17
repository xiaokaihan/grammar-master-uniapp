'use strict';

const db = uniCloud.database()
const usersCollection = db.collection('users')
const loginLogsCollection = db.collection('login_logs')

exports.main = async (event, context) => {
  try {
    const { code, userInfo } = event
    
    if (!code) {
      return {
        success: false,
        message: '缺少登录凭证'
      }
    }
    
    // 调用微信接口获取 openid
    const wxResult = await uniCloud.httpclient.request(
      'https://api.weixin.qq.com/sns/jscode2session',
      {
        method: 'GET',
        data: {
          appid: 'wx7205f37efa5fb5d4',
          secret: '7e8812afff2b5444c084b441a4893ce7', // 需要在微信公众平台获取
          js_code: code,
          grant_type: 'authorization_code'
        },
        dataType: 'json'
      }
    )
    
    if (wxResult.status !== 200 || !wxResult.data.openid) {
      return {
        success: false,
        message: '微信登录验证失败'
      }
    }
    
    const { openid, unionid, session_key } = wxResult.data
    
    // 查找或创建用户
    let user = await usersCollection.where({ openid }).get()
    
    if (user.data.length === 0) {
      // 创建新用户
      const userData = {
        openid,
        unionid,
        nickname: userInfo?.nickName || '微信用户',
        avatar: userInfo?.avatarUrl || '',
        gender: userInfo?.gender || 0,
        country: userInfo?.country || '',
        province: userInfo?.province || '',
        city: userInfo?.city || '',
        language: userInfo?.language || 'zh_CN',
        createTime: Date.now(),
        lastLoginTime: Date.now(),
        loginCount: 1,
        isGuest: false
      }
      
      const result = await usersCollection.add(userData)
      userData._id = result.id
      user = { data: [userData] }
    } else {
      // 更新现有用户
      const updateData = {
        nickname: userInfo?.nickName || user.data[0].nickname,
        avatar: userInfo?.avatarUrl || user.data[0].avatar,
        lastLoginTime: Date.now(),
        loginCount: (user.data[0].loginCount || 0) + 1
      }
      
      await usersCollection.doc(user.data[0]._id).update(updateData)
      user.data[0] = { ...user.data[0], ...updateData }
    }
    
    // 记录登录日志
    await loginLogsCollection.add({
      userId: user.data[0]._id,
      openid,
      loginTime: Date.now(),
      userAgent: context.CLIENTUA,
      ip: context.CLIENTIP
    })
    
    // 生成简单的用户标识（实际项目中可以使用 JWT）
    const userToken = `${openid}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    
    return {
      success: true,
      message: '登录成功',
      data: {
        userInfo: user.data[0],
        token: userToken,
        openId: openid
      }
    }
    
  } catch (error) {
    console.error('登录云函数执行失败:', error)
    return {
      success: false,
      message: '登录失败，请重试'
    }
  }
}
