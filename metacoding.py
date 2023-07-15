from types import FunctionType

# functionstring = '''
# def arithmetic(a, b): 
#     op = __import__('operator') 
#     result = op.add(a, b) 
#     return result '''

# functiontemplate = compile(functionstring, 'functionstring','exec')
# dynamicfunction = FunctionType(functiontemplate.co_consts[0], globals(),"add")
a =20
b = 5
operator = ['op.add','op.sub','op.mul','op.truediv','op.pow','op.mod', 'op.gt', 'op.lt']
functionname = ['add','sub', 'multiply', 'divide', 'power', 'modulus', 'greaterthan', 'lesserthan']

def functiongenerator(functionname, operator, a,b):
    from types import FunctionType
    functionstring = []
    for i in operator:
        functionstring.append('''
                              def arithmetic(a, b): 
                                op = __import__('operator') 
                                result = '''+ i + '''(a, b) 
                                return result '''
                                )
        print('''
                              def arithmetic(a, b): 
                                op = __import__('operator') 
                                result = '''+ i + '''(a, b) 
                                return result ''')
        functiontemplate = []
        for i in functionstring:
            functiontemplate.append(compile(i, 'functionstring', 'exec'))
            dynamicfunction = []
            
        for i,j in zip(functiontemplate,functionname):
            dynamicfunction.append(FunctionType(i.co_consts[0],  globals(), j))
            functiondict = {}
            
        for i,j in zip(functionname,dynamicfunction):
            functiondict[i]=j
            
        for i in dynamicfunction:
            print (i(a,b))
            
        return functiondict

funcdict = functiongenerator(functionname, operator, a,b)
