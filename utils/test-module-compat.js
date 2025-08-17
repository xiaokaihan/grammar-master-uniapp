/**
 * 兼容性测试模块
 */

console.log('🧪 兼容性测试模块开始加载...')

// 使用 CommonJS 风格的导出
const testValue = 'Hello World'

const testFunction = function() {
  console.log('✅ 测试函数执行成功')
  return 'success'
}

const testObject = {
  name: 'TestModule',
  version: '1.0.0',
  sayHello: function() {
    return 'Hello from TestModule'
  }
}

// 导出对象
module.exports = {
  testValue: testValue,
  testFunction: testFunction,
  testObject: testObject
}

// 同时支持 ES6 导出
export { testValue, testFunction, testObject }

console.log('🎉 兼容性测试模块加载完成')
console.log('📦 模块内容:', { testValue, testFunction, testObject })
