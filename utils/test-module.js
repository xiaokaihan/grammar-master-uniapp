/**
 * 简单测试模块
 */

console.log('🧪 测试模块开始加载...')

export const testValue = 'Hello World'
export const testFunction = () => {
  console.log('✅ 测试函数执行成功')
  return 'success'
}

export const testObject = {
  name: 'TestModule',
  version: '1.0.0',
  sayHello: () => 'Hello from TestModule'
}

console.log('🎉 测试模块加载完成')
