/**
 * 判读字符是否是运算符
 * @param {string} char 字符
 * @returns {Boolean}
 */
function isOperator (char) {
  let operatorString = '+-*/()'
  return operatorString.indexOf(char) > -1
}

/**
 * 获取优先级
 * 加减为1，乘除为2，其他为0。
*/
function getPrioraty (value) {
  switch (value) {
    case '+':
    case '-':
      return 1
    case '*':
    case '/':
      return 2
    default:
      return 0
  }
}

/**
 * 比较运算符优先级
*/
function prioraty (o1, o2) {
  return getPrioraty(o1) >= getPrioraty(o2)
}

/**
 * @constant {Object} STATUS 状态
 * STATUS.BEGINNING 起始状态
 * STATUS.OPERATOR 运算符
 * STATUS.TERM 公式因子
 * STATUS.VALUE 值 只在计算时使用
*/
const STATUS = {
  BEGINNING: 'BEGINNING',
  OPERATOR: 'OPERATOR',
  TERM: 'TERM',
  VALUE: 'VALUE'
}

/**
 * 解析公式表达式
 * @param {string} formulaStr 公式表达式
 * @returns {Array} result 解析结果
 */
function parseFormulaStr (formulaStr) {
  // 过滤掉空白字符
  formulaStr = formulaStr.replace(/\s/g, '')

  let result = []
  let state = STATUS.BEGINNING
  let index = 0
  let subString = ''
  let char = ''

  // 推出当前状态
  function exit () {
    result.push({
      state: state,
      subString: subString
    })
    state = STATUS.BEGINNING
    subString = ''
  }

  // 进入新的状态
  function newState (newState) {
    subString += char
    state = newState
    index++
  }

  while (index < formulaStr.length) {
    char = formulaStr[index]

    switch (state) {
      case STATUS.BEGINNING:
        if (isOperator(char)) {
          newState(STATUS.OPERATOR)
        } else {
          newState(STATUS.TERM)
        }
        break
      case STATUS.OPERATOR:
        exit()
        break
      case STATUS.TERM:
        if (isOperator(char)) {
          exit()
        } else {
          newState(STATUS.TERM)
        }
        break
      default:
        break
    }
  }

  if (state !== STATUS.BEGINNING) {
    exit()
  }

  return result
}

/**
 * 生成逆波兰式
 * @param {Array} parseResult 公式表达式的解析结果 来自 parseFormulaStr
 * @returns {Array} outputStack 逆波兰式（后缀表达式）
 */
function dal2Rpn (parseResult) {
  /**
  * 代码流程
  * 1 首先创建两个栈 用Array模拟
  * operatorStack 用于存储运算符的栈 越靠近栈顶优先级越高
  * outputStack 用于存储输出结果的栈
  * 
  * 2 从中缀式的左端开始逐个读取待处理项cur，逐序进行如下步骤：
  * 2.1 若cur是公式中的因子(TERM)，将cur直接压入栈outputStack；
  * 2.2 若cur是运算符(OPERATOR)，则分情况讨论：
  * 2.2.1 若cur是'('，则直接压入栈operatorStack；
  * 2.2.2 若cur是')'则将距离栈operatorStack栈顶的最近的'('之间的运算符，逐个出栈，依次压入栈outputStack，此时抛弃'('；
  * 2.2.3 若cur是除'('和')'外的运算符：
  *   如果检查operatorStack的栈顶的运算符的优先级。
  *   如果栈顶的运算符的优先级大于等于cur的优先级，将operatorStack的栈顶元素压入到outputStack中，
  *   直到栈operatorStack的栈顶运算符优先级别低于cur的优先级。
  *   将cur压入operatorStack
  *   注：'('的优先级为 0，operatorStack的栈顶的运算符为'('时，cur直接压入operatorStack中
  * 
  * 3 检查栈operatorStack是否为空，若不为空，则将栈中元素依次弹出并压入栈outputStack中
  * TODO：按《数据结构与算法分析》修正逻辑。
  * 逻辑简述
  */
  let inputArray = parseResult.map(d => d) // 避免直接操作parseResult
  // 操作符栈
  let operatorStack = []
  // 输出
  let outputStack = []
  // 当前的待处理项
  let cur

  while (inputArray.length > 0) {

    cur = inputArray.shift()

    if (isOperator(cur.subString)) {
      // 代码流程 2.2
      if (cur.subString === '(') {
        // 代码流程 2.2.1
        operatorStack.push(cur)
      } else if (cur.subString === ')') {
        // 代码流程 2.2.2
        var po = operatorStack.pop()
        while (po.subString !== '(' && operatorStack.length > 0) {
          outputStack.push(po)
          po = operatorStack.pop()
        }

        if (po.subString !== '(') {
          throw new Error('error: unmatched ()')
        }
      } else {
        // 代码流程 2.2.3
        while (
          operatorStack.length > 0 &&
          prioraty(operatorStack[operatorStack.length - 1].subString, cur.subString)
        ) {
          outputStack.push(operatorStack.pop())
        }
        operatorStack.push(cur)
      }
    } else {
      // 代码流程 2.1
      outputStack.push(cur)
    } 
  }

  if (operatorStack.length > 0) {
    if (
      operatorStack[operatorStack.length - 1].subString === ')' ||
      operatorStack[operatorStack.length - 1].subString === '('
    ) {
      throw new Error('error: unmatched ()')
    }
    while (operatorStack.length > 0) {
      outputStack.push(operatorStack.pop())
    }
  }

  return outputStack
}

function evalRpn (rpnQueue, getResult) {
  var outputStack = []
  rpnQueue = rpnQueue.map(d => d)

  while (rpnQueue.length > 0) {
    var cur = rpnQueue.shift()

    if (!isOperator(cur.subString)) {
      outputStack.push(cur)
    } else {
      if (outputStack.length < 2) {
        throw new Error('unvalid stack length')
      }
      var sec = outputStack.pop()
      var fir = outputStack.pop()

      outputStack.push(getResult(fir, sec, cur))
    }
  }

  if (outputStack.length !== 1) {
    throw new Error('unvalid expression')
  } else {
    return outputStack[0]
  }
}