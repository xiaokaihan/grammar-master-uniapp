'use strict';

const db = uniCloud.database()
const usersCollection = db.collection('users')
const loginLogsCollection = db.collection('login_logs')

// 获取客户端信息
function getClientInfo(context) {
  return {
    platform: 'wechat_miniprogram', // 微信小程序平台
    userAgent: context.CLIENTUA || '',
    ip: context.CLIENTIP || '',
    timestamp: Date.now(),
    // 可以添加更多设备信息
    deviceInfo: {
      // 微信小程序环境信息
      env: 'wechat_miniprogram',
      version: context.WXMINIPROGRAM_VERSION || '',
      systemInfo: context.SYSTEM_INFO || {}
    }
  }
}

// 记录登录日志
async function recordLoginLog(loginData, success = true, errorMessage = '') {
  try {
    const clientInfo = getClientInfo(loginData.context)
    
    const logData = {
      userId: loginData.userId || null,
      openid: loginData.openid || '',
      loginTime: clientInfo.timestamp,
      userAgent: clientInfo.userAgent,
      ip: clientInfo.ip,
      platform: clientInfo.platform,
      success: success,
      errorMessage: errorMessage || '',
      // 添加更多上下文信息
      context: {
        deviceInfo: clientInfo.deviceInfo,
        loginMethod: 'wechat_code',
        loginSource: 'miniprogram'
      }
    }
    
    await loginLogsCollection.add(logData)
    console.log('登录日志记录成功:', logData)
  } catch (error) {
    console.error('记录登录日志失败:', error)
    // 不抛出错误，避免影响主要登录流程
  }
}

exports.main = async (event, context) => {
  const startTime = Date.now()
  let loginResult = null
  
  try {
    const { code, userInfo } = event
    
    if (!code) {
      const errorMsg = '缺少登录凭证'
      await recordLoginLog({ context }, false, errorMsg)
      
      return {
        success: false,
        message: errorMsg
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
      const errorMsg = '微信登录验证失败'
      await recordLoginLog({ context }, false, errorMsg)
      
      return {
        success: false,
        message: errorMsg
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
    
    // 生成简单的用户标识（实际项目中可以使用 JWT）
    const userToken = `${openid}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    
    loginResult = {
      success: true,
      message: '登录成功',
      data: {
        userInfo: user.data[0],
        token: userToken,
        openId: openid
      }
    }
    
    // 记录成功登录日志
    await recordLoginLog({
      userId: user.data[0]._id,
      openid,
      context
    }, true)
    
    return loginResult
    
  } catch (error) {
    console.error('登录云函数执行失败:', error)
    
    // 记录失败登录日志
    await recordLoginLog({
      openid: event.code ? 'unknown' : '',
      context
    }, false, error.message || '登录过程中发生未知错误')
    
    return {
      success: false,
      message: '登录失败，请重试'
    }
  } finally {
    // 记录执行时间
    const executionTime = Date.now() - startTime
    console.log(`登录云函数执行完成，耗时: ${executionTime}ms`)
  }
}
