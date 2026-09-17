import React, { useState } from 'react';
import { 
    BookOpen, Code2, FlaskConical, BrainCircuit, Flame, XCircle, Zap, 
    MousePointerClick, Hand, Coffee, Moon, Sun, Menu, X, HelpCircle, 
    AlertTriangle, Code as CodeIcon, XOctagon, Brain, ArrowRight, Play, LayoutDashboard
} from 'lucide-react';

const theoryData = [
    {
        id: 'exceptions',
        title: 'Exceptions & Handling (Lab 8)',
        simple: 'A way to catch errors so the program doesn\'t crash instantly.',
        technical: 'A mechanism to handle runtime errors, maintaining normal application flow by intercepting anomalous events.',
        why: 'Files might be missing, users might enter letters instead of numbers, or math might divide by zero. We need to handle these gracefully.',
        syntax: `try {\n    // risky code\n} catch (Exception e) {\n    // handle error\n} finally {\n    // always runs\n}`,
        rules: [
            'Checked exceptions (like IOException) MUST be handled or declared.',
            'Unchecked exceptions (like ArithmeticException) happen at runtime.',
            'Specific catch blocks must come BEFORE general Exception blocks.',
            'throw is an action. throws is a warning on the method signature.'
        ],
        mistake: { 
            wrong: 'catch (Exception e) {...} catch (FileNotFoundException e) {...}', 
            right: 'catch (FileNotFoundException e) {...} catch (Exception e) {...}', 
            why: 'Subclasses must be caught before their parent classes, otherwise the subclass block is unreachable.' 
        },
        memory: '"try" the code, "catch" the fall, "finally" clean it all up.'
    },
    {
        id: 'threads',
        title: 'Threads & Concurrency (Lab 9)',
        simple: 'Doing multiple tasks at the exact same time in the background.',
        technical: 'A thread is a lightweight process. Multithreading allows concurrent execution of two or more parts of a program for maximum CPU utilization.',
        why: 'If a program is downloading a large file, the UI shouldn\'t freeze. Threads let the download happen in the background.',
        syntax: `class MyThread extends Thread {\n    public void run() {\n        // background task\n    }\n}\n// usage:\nnew MyThread().start();`,
        rules: [
            'Always call start(), never call run() directly.',
            'Thread.sleep() requires catching InterruptedException.',
            'Runnable is preferred over extending Thread because Java allows only one parent class.',
            'Synchronized keyword locks a resource for one thread at a time.'
        ],
        mistake: { 
            wrong: 'MyThread t1 = new MyThread();\nt1.run();', 
            right: 'MyThread t1 = new MyThread();\nt1.start();', 
            why: 'Calling run() executes synchronously on the main thread. start() actually spawns a new background thread.' 
        },
        memory: 'START creates a new path. RUN just walks down the current path.'
    },
    {
        id: 'strings',
        title: 'String Immutability (Lab 10)',
        simple: 'Once you create a String, you cannot change its text. You can only create a new one.',
        technical: 'String objects in Java are immutable. Any operation that appears to modify a String actually creates and returns a newly allocated String object.',
        why: 'Security, thread-safety, and memory optimization (String Pool).',
        syntax: `String s = "Hello";\ns.concat(" World"); // s is STILL "Hello"\ns = s.concat(" World"); // Now s points to the new string`,
        rules: [
            'Use .equals() for content comparison, NEVER ==.',
            'Use StringBuilder when modifying strings heavily inside loops.',
            'trim() removes spaces, substring(start, end) extracts parts.'
        ],
        mistake: { 
            wrong: 'if (str1 == str2)', 
            right: 'if (str1.equals(str2))', 
            why: '== compares memory addresses (locations). .equals() compares the actual text characters (content).' 
        },
        memory: 'String is Stubborn (Immutable). Builder is Building (Mutable).'
    },
    {
        id: 'fileio',
        title: 'File I/O & ArrayList (Lab 11)',
        simple: 'Reading files from the hard drive and storing them in dynamic lists.',
        technical: 'Using File, BufferedReader, and ArrayList to interact with the file system and store dynamic sequential data.',
        why: 'Programs need to save and retrieve permanent data, and we often don\'t know how many lines a file has, so we use ArrayList.',
        syntax: `File f = new File("D:\\test.txt");\nif(f.exists()) {\n    List<String> list = new ArrayList<String>();\n}`,
        rules: [
            'Creating a File object does NOT create a file on disk.',
            'Always check f.exists() and f.canRead() before reading.',
            'BufferedReader is more efficient for reading text line-by-line.'
        ],
        mistake: { 
            wrong: 'File f = new File("D:\\file.txt");\n// Assume file is there', 
            right: 'if(!f.exists()) { return; }', 
            why: 'Attempting to read a non-existent file will throw a FileNotFoundException.' 
        },
        memory: 'File is just a map (path). BufferedReader is the car that drives there.'
    }
];

const codeBreakdownData = [
    {
        id: 'threads-breakdown',
        title: 'Multithreading & Runnable (Lab 9)',
        code: `class Task implements Runnable {\n  public void run() {\n    System.out.println("Running");\n  }\n}\n\nTask task = new Task();\nThread t1 = new Thread(task);\nt1.start();`,
        tokens: [
            { text: 'class Task implements Runnable', type: 'decl', explain: 'Creates a class that fulfills the Runnable contract.', why: 'Implementing Runnable is preferred over extending Thread to keep class inheritance open.' },
            { text: 'public void run()', type: 'method', explain: 'The required method from the Runnable interface.', why: 'This contains the exact background job the thread will perform.' },
            { text: 'Task task = new Task();', type: 'obj', explain: 'Creates the task object.', why: 'We need an instance of our logic to give to the Thread.' },
            { text: 'Thread t1 = new Thread(task);', type: 'thread', explain: 'Wraps our task inside a Java Thread object.', why: 'A Runnable cannot start itself. It needs a Thread to execute it.' },
            { text: 't1.start();', type: 'call', explain: 'Starts the background thread.', why: 'Allocates OS resources and schedules the thread. Never call run() directly!' }
        ]
    }
];

const executionFlowData = [
    {
        id: 'exec-exceptions',
        title: 'Execution Flow: Exception Propagation (Lab 8)',
        lines: [
            "public void calculate(int a, int b) throws Exception {",
            "  if (b == 0) {",
            "    throw new Exception(\"Div by Zero\");",
            "  }",
            "  System.out.println(a / b);",
            "}",
            "// Inside main():",
            "try {",
            "  calculate(10, 0);",
            "} catch (Exception e) {",
            "  System.out.println(e.getMessage());",
            "}"
        ],
        steps: [
            { line: 7, msg: 'Main enters the try block.', why: 'Prepares to catch any errors from risky code.' },
            { line: 8, msg: 'Calls calculate(10, 0).', why: 'Passes 10 as a, and 0 as b.' },
            { line: 0, msg: 'Execution jumps to calculate method.', why: 'Method signature warns it might throw an Exception.' },
            { line: 1, msg: 'Checks if b == 0. It is true.', why: 'Division by zero is mathematically undefined.' },
            { line: 2, msg: 'Manually creates and throws a new Exception.', why: 'The throw keyword instantly stops normal execution here.' },
            { line: 9, msg: 'Execution jumps directly back to the catch block in main.', why: 'Line 4 (printing result) is skipped entirely because the exception was thrown.' },
            { line: 10, msg: 'Prints "Div by Zero".', why: 'e.getMessage() fetches the string we passed in line 2.' }
        ]
    }
];

const CodeReadingGuide = () => (
    <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-slate-700">
        <h3 className="text-xl font-bold mb-4 flex items-center text-slate-800 dark:text-white"><BookOpen className="mr-2 text-blue-600 dark:text-blue-400"/> How to Read Java OOP Code</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
                <div className="flex items-start"><div className="bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 w-6 h-6 rounded-full flex items-center justify-center font-bold text-sm mr-3 shrink-0">1</div><p className="text-sm dark:text-slate-300"><strong>Find the Classes:</strong> Look for `class X`. What blueprints exist?</p></div>
                <div className="flex items-start"><div className="bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 w-6 h-6 rounded-full flex items-center justify-center font-bold text-sm mr-3 shrink-0">2</div><p className="text-sm dark:text-slate-300"><strong>Find the Fields:</strong> What data does this object hold? (Variables outside methods).</p></div>
                <div className="flex items-start"><div className="bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 w-6 h-6 rounded-full flex items-center justify-center font-bold text-sm mr-3 shrink-0">3</div><p className="text-sm dark:text-slate-300"><strong>Find Constructors:</strong> How is it born? Methods with the EXACT same name as the class.</p></div>
                <div className="flex items-start"><div className="bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 w-6 h-6 rounded-full flex items-center justify-center font-bold text-sm mr-3 shrink-0">4</div><p className="text-sm dark:text-slate-300"><strong>Find Relationships:</strong> Does it `extend` or `implement` anything?</p></div>
            </div>
            <div className="space-y-3">
                <div className="flex items-start"><div className="bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 w-6 h-6 rounded-full flex items-center justify-center font-bold text-sm mr-3 shrink-0">5</div><p className="text-sm dark:text-slate-300"><strong>Trace "main":</strong> Execution starts at `public static void main`.</p></div>
                <div className="flex items-start"><div className="bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 w-6 h-6 rounded-full flex items-center justify-center font-bold text-sm mr-3 shrink-0">6</div><p className="text-sm dark:text-slate-300"><strong>Track "new":</strong> Every time you see `new`, visualize a new box in memory.</p></div>
                <div className="flex items-start"><div className="bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 w-6 h-6 rounded-full flex items-center justify-center font-bold text-sm mr-3 shrink-0">7</div><p className="text-sm dark:text-slate-300"><strong>Follow Method Calls:</strong> When `s.display()` is called, jump to `display()` inside class `s`.</p></div>
                <div className="flex items-start"><div className="bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 w-6 h-6 rounded-full flex items-center justify-center font-bold text-sm mr-3 shrink-0">8</div><p className="text-sm dark:text-slate-300"><strong>Identify Output:</strong> Mentally note what `System.out.println` produces.</p></div>
            </div>
        </div>
    </div>
);

const CodeExplainer = ({ data }) => {
    const [activeToken, setActiveToken] = useState(null);

    const renderCode = () => {
        let codeHtml = data.code;
        data.tokens.forEach((token, index) => {
            const regex = new RegExp(token.text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g');
            codeHtml = codeHtml.replace(regex, `%%TOKEN_${index}%%`);
        });

        const parts = codeHtml.split(/(%%TOKEN_\d+%%)/);
        
        return parts.map((part, i) => {
            const match = part.match(/%%TOKEN_(\d+)%%/);
            if (match) {
                const tokenIdx = parseInt(match[1]);
                const token = data.tokens[tokenIdx];
                const isActive = activeToken === tokenIdx;
                return (
                    <span 
                        key={i} 
                        className={`cursor-pointer transition-all duration-200 rounded px-1 -mx-1 border border-transparent ${
                            isActive 
                            ? 'bg-blue-200 border-blue-500 dark:bg-blue-900/60 dark:border-blue-400' 
                            : 'hover:bg-blue-100 hover:border-blue-300 dark:hover:bg-blue-900/40 dark:hover:border-blue-700'
                        }`}
                        onClick={() => setActiveToken(tokenIdx)}
                    >
                        {token.text}
                    </span>
                );
            }
            return <span key={i}>{part}</span>;
        });
    };

    return (
        <div className="flex flex-col md:flex-row gap-6 bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-slate-700">
            <div className="flex-1 overflow-hidden">
                <h4 className="font-bold text-slate-800 dark:text-slate-200 mb-3 flex items-center">
                    <CodeIcon size={18} className="mr-2 text-blue-500"/> Interactive Code
                </h4>
                <pre className="bg-slate-900 text-slate-100 p-4 rounded-lg overflow-x-auto font-mono text-sm leading-loose whitespace-pre-wrap">
                    <code>{renderCode()}</code>
                </pre>
                <p className="text-xs text-slate-500 mt-3 italic flex items-center">
                    <MousePointerClick size={14} className="mr-1"/> Click highlighted parts of the code to understand them.
                </p>
            </div>
            
            <div className="w-full md:w-1/3 flex flex-col">
                <h4 className="font-bold text-slate-800 dark:text-slate-200 mb-3 flex items-center">
                    <BrainCircuit size={18} className="mr-2 text-purple-500"/> Breakdown
                </h4>
                {activeToken !== null ? (
                    <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 p-4 rounded-lg flex-1">
                        <div className="font-mono text-sm text-blue-700 dark:text-blue-400 font-bold mb-3 pb-2 border-b border-blue-200 dark:border-blue-800">
                            {data.tokens[activeToken].text}
                        </div>
                        <p className="text-sm font-medium text-slate-800 dark:text-slate-200 mb-4 leading-relaxed">
                            {data.tokens[activeToken].explain}
                        </p>
                        <div className="bg-white dark:bg-slate-900 p-3 rounded text-sm text-slate-600 dark:text-slate-300 shadow-sm border border-slate-100 dark:border-slate-700">
                            <span className="font-bold text-purple-600 dark:text-purple-400 block mb-1 text-xs uppercase tracking-wider">Why?</span>
                            {data.tokens[activeToken].why}
                        </div>
                    </div>
                ) : (
                    <div className="h-full border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-lg flex flex-col items-center justify-center p-6 text-slate-400 text-center">
                        <Hand size={32} className="mb-3 opacity-50 text-slate-400" />
                        <p className="text-sm font-medium">Select a code segment on the left to see its explanation and purpose here.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

const ExecutionTracer = ({ data }) => {
    const [step, setStep] = useState(0);

    return (
        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-slate-700">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 gap-4">
                <h3 className="text-xl font-bold flex items-center text-slate-800 dark:text-white">
                    <Play size={20} className="mr-2 text-green-500"/> {data.title}
                </h3>
                <div className="flex items-center gap-2">
                    <button onClick={() => setStep(Math.max(0, step - 1))} disabled={step === 0} className="px-4 py-2 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 font-medium rounded-lg disabled:opacity-50 hover:bg-slate-200 dark:hover:bg-slate-600 transition">Prev</button>
                    <span className="px-4 py-2 font-mono text-sm bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300 rounded-lg font-bold">Step {step + 1}/{data.steps.length}</span>
                    <button onClick={() => setStep(Math.min(data.steps.length - 1, step + 1))} disabled={step === data.steps.length - 1} className="px-4 py-2 bg-blue-600 text-white font-medium rounded-lg disabled:opacity-50 hover:bg-blue-700 transition shadow-sm">Next</button>
                </div>
            </div>

            <div className="flex flex-col md:flex-row gap-6">
                <div className="flex-1 bg-slate-900 rounded-xl py-4 font-mono text-sm overflow-hidden shadow-inner">
                    {data.lines.map((line, idx) => {
                        const isActive = data.steps[step].line === idx;
                        return (
                            <div key={idx} className={`flex px-4 py-1.5 transition-all duration-300 ${isActive ? 'bg-yellow-500/20 border-l-4 border-yellow-500' : 'border-l-4 border-transparent text-slate-400'}`}>
                                <span className="w-6 text-right mr-4 text-slate-600 select-none">{idx + 1}</span>
                                <span className={isActive ? 'text-white font-bold' : ''}>{line}</span>
                            </div>
                        )
                    })}
                </div>
                
                <div className="w-full md:w-1/3 flex flex-col gap-4">
                    <div className="bg-yellow-50 dark:bg-yellow-900/10 border border-yellow-200 dark:border-yellow-800/30 p-5 rounded-xl shadow-sm">
                        <span className="text-xs font-bold uppercase text-yellow-600 dark:text-yellow-500 mb-2 block tracking-wider flex items-center">
                            <Zap size={14} className="mr-1"/> What's happening?
                        </span>
                        <p className="text-slate-800 dark:text-slate-200 font-medium leading-relaxed">{data.steps[step].msg}</p>
                    </div>
                    <div className="bg-blue-50 dark:bg-blue-900/10 border border-blue-200 dark:border-blue-800/30 p-5 rounded-xl shadow-sm">
                        <span className="text-xs font-bold uppercase text-blue-600 dark:text-blue-400 mb-2 block tracking-wider flex items-center">
                            <HelpCircle size={14} className="mr-1"/> Why? / The Concept
                        </span>
                        <p className="text-slate-700 dark:text-slate-300 text-sm leading-relaxed">{data.steps[step].why}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

const LabViewer = () => {
    const [activeLab, setActiveLab] = useState(8);
    
    const labs = {
        8: {
            title: 'Lab 08: Exception Handling',
            topics: [
                { name: 'Checked Exceptions', rule: 'Must be caught (try-catch) or declared (throws). Checked at compile time.', code: `try {\n  File f = new File("test.txt");\n  FileReader fr = new FileReader(f);\n} catch (FileNotFoundException e) {\n  System.out.println("File missing!");\n}`, explanation: 'The compiler forces us to handle this because reading a file from disk is risky—it might not exist.' },
                { name: 'Unchecked Exceptions', rule: 'Happen at runtime due to logical errors. Not forced by compiler.', code: `int num2 = sc.nextInt();\nint result = 12 / num2; // if num2 is 0 -> ArithmeticException`, explanation: 'The compiler assumes your math is logical. It only crashes at runtime if the user actually enters 0.' },
                { name: 'throw vs throws', rule: 'throw = action inside method, throws = warning label on signature.', code: `void check(int mark) throws Exception {\n  if(mark < 40) \n    throw new Exception("Fail");\n}`, explanation: 'Use "throw" inside the method to crash it manually. Use "throws" in the method signature to warn whoever calls this method.' },
                { name: 'Custom Exceptions', rule: 'Extend Exception class and call super(String).', code: `class InvalidWeightException extends Exception {\n  InvalidWeightException(String s) {\n    super(s);\n  }\n}`, explanation: 'We create our own rule. Calling super(s) ensures the message is stored correctly in the parent Exception class so e.getMessage() works.' }
            ]
        },
        9: {
            title: 'Lab 09: Threads & Synchronization',
            topics: [
                { name: 'Extending Thread', rule: 'Override run(), call start().', code: `class SubjectThread extends Thread {\n  public void run() { /* logic */ }\n}\n\nSubjectThread t1 = new SubjectThread();\nt1.start();`, explanation: 'Creates a parallel execution path.' },
                { name: 'Implementing Runnable', rule: 'Pass to a Thread object, call start().', code: `class Task implements Runnable {\n  public void run() { /* logic */ }\n}\nThread t = new Thread(new Task());\nt.start();`, explanation: 'Preferred method because Java only allows one parent class. Implementing an interface leaves your class free to extend something else.' },
                { name: 'Thread.sleep()', rule: 'Always throws InterruptedException.', code: `try {\n  Thread.sleep(1000); // 1 sec\n} catch (InterruptedException e) {}`, explanation: 'Pauses the current thread. Must be in a try-catch because another thread might try to wake it up abruptly (using .interrupt()).' },
                { name: 'Synchronization', rule: 'Locks the shared resource.', code: `public synchronized void printCount() {\n  // only one thread inside at a time\n}`, explanation: 'Prevents Thread A and Thread B from modifying or printing data at the exact same time, which causes corrupted/jumbled output.' }
            ]
        },
        10: {
            title: 'Lab 10: Strings & StringBuilder',
            topics: [
                { name: 'String Immutability', rule: 'Strings cannot change once created.', code: `String name = "Nimal";\nname.concat(" Perera");\n// name is STILL "Nimal"\nname = name.concat(" Perera"); // Now it updates`, explanation: 'Methods like concat(), trim(), toLowerCase() return brand new strings. They do not alter the original string in memory.' },
                { name: '== vs .equals()', rule: '== for Address, .equals() for Content.', code: `String s1 = "admin";\nString s2 = new String("admin");\n// s1 == s2 is FALSE (Different memory)\n// s1.equals(s2) is TRUE (Same letters)`, explanation: 'new String() forces Java to make a new box in the Heap memory. == checks if they are the exact same box. equals() checks if the letters inside are the same.' },
                { name: 'StringBuilder', rule: 'Mutable sequence of characters.', code: `StringBuilder sb = new StringBuilder("Race");\nsb.reverse();\nSystem.out.println(sb.toString());`, explanation: 'Unlike String, StringBuilder modifies its own internal buffer. Great for reversing or appending inside loops without wasting memory.' }
            ]
        },
        11: {
            title: 'Lab 11: File I/O',
            topics: [
                { name: 'File Paths', rule: 'File object is just an abstract path, not the actual file.', code: `File f = new File("D:\\\\test.txt");\nif(f.exists() && f.isFile()) {\n  // safe to proceed\n}`, explanation: 'Creating a File object does not create a file on disk. You must use .exists() to verify it.' },
                { name: 'Reading files', rule: 'Use BufferedReader for efficiency.', code: `BufferedReader reader = new BufferedReader(new FileReader(f));\nString line;\nwhile ((line = reader.readLine()) != null) {\n  System.out.println(line);\n}`, explanation: 'Reads text line by line until it hits the end of the file (which returns null).' },
                { name: 'ArrayList', rule: 'Dynamic array for storing data.', code: `List<String> list = new ArrayList<String>();\nlist.add("Line 1");\nSystem.out.println(list.get(0));`, explanation: 'Often used to store file contents because we don\'t know how many lines are in the file beforehand. Arrays have fixed size, ArrayLists are dynamic.' }
            ]
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-wrap gap-2 pb-2">
                {[8, 9, 10, 11].map(num => (
                    <button 
                        key={num}
                        onClick={() => setActiveLab(num)}
                        className={`px-5 py-2.5 rounded-xl font-semibold transition shadow-sm ${activeLab === num ? 'bg-blue-600 text-white' : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'}`}
                    >
                        Lab {num < 10 ? '0'+num : num}
                    </button>
                ))}
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 overflow-hidden">
                <div className="bg-slate-50 dark:bg-slate-900/50 p-6 border-b border-slate-100 dark:border-slate-700">
                    <h2 className="text-2xl font-bold text-slate-800 dark:text-white flex items-center">
                        <FlaskConical className="mr-3 text-green-500" /> {labs[activeLab].title}
                    </h2>
                    <p className="text-slate-500 dark:text-slate-400 mt-2 font-medium">Concepts & Code Patterns derived from the Lab Sheet</p>
                </div>
                <div className="p-6 md:p-8 space-y-10">
                    {labs[activeLab].topics.map((topic, i) => (
                        <div key={i} className="flex flex-col lg:flex-row gap-8 pb-10 border-b border-slate-100 dark:border-slate-700/50 last:border-0 last:pb-0">
                            <div className="lg:w-1/3">
                                <h4 className="text-xl font-bold text-slate-800 dark:text-slate-200 mb-3">{topic.name}</h4>
                                <div className="bg-blue-50/50 dark:bg-blue-900/20 text-blue-900 dark:text-blue-300 text-sm p-4 rounded-xl border border-blue-100 dark:border-blue-800/50 font-medium shadow-sm">
                                    <div className="flex items-center text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 mb-2">
                                        <AlertTriangle size={14} className="mr-1" /> Key Rule
                                    </div>
                                    {topic.rule}
                                </div>
                            </div>
                            <div className="lg:w-2/3 flex flex-col gap-4">
                                <div className="relative">
                                    <pre className="bg-[#0d1117] text-slate-300 p-5 rounded-xl font-mono text-sm overflow-x-auto shadow-inner border border-slate-800">
                                        <code>{topic.code}</code>
                                    </pre>
                                </div>
                                <div className="bg-slate-50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-700 p-5 rounded-xl text-sm text-slate-700 dark:text-slate-300">
                                    <span className="font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wide text-xs mb-2 block flex items-center">
                                        <Brain size={14} className="mr-1" /> Execution & Why
                                    </span>
                                    <p className="leading-relaxed">{topic.explanation}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

const CheatSheet = () => (
    <div className="space-y-6">
        <div className="bg-gradient-to-r from-red-600 to-orange-500 text-white p-8 rounded-2xl shadow-md">
            <h2 className="text-3xl font-bold flex items-center mb-3"><Flame size={28} className="mr-3"/> Last-Minute Revision</h2>
            <p className="text-lg opacity-90 font-medium">Read this 10 minutes before walking into the exam hall.</p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700">
                <h3 className="text-xl font-bold mb-6 text-red-600 dark:text-red-400 border-b border-slate-100 dark:border-slate-700 pb-3 flex items-center">
                    <XOctagon className="mr-2" /> Traps & Common Mistakes
                </h3>
                <ul className="space-y-5 text-sm">
                    <li className="flex items-start bg-red-50 dark:bg-red-900/10 p-3 rounded-lg border border-red-100 dark:border-red-900/30">
                        <XCircle size={18} className="text-red-500 mr-3 shrink-0 mt-0.5"/> 
                        <div>
                            <span className="font-bold block text-slate-800 dark:text-slate-200 mb-1">t1.run() instead of t1.start()</span>
                            <span className="text-slate-600 dark:text-slate-400">Wrong! Using run() executes code on the main thread. Always use start() to actually multithread.</span>
                        </div>
                    </li>
                    <li className="flex items-start bg-red-50 dark:bg-red-900/10 p-3 rounded-lg border border-red-100 dark:border-red-900/30">
                        <XCircle size={18} className="text-red-500 mr-3 shrink-0 mt-0.5"/> 
                        <div>
                            <span className="font-bold block text-slate-800 dark:text-slate-200 mb-1">s1 == s2 for Strings</span>
                            <span className="text-slate-600 dark:text-slate-400">Wrong! == compares memory addresses. Use s1.equals(s2) to compare actual text.</span>
                        </div>
                    </li>
                    <li className="flex items-start bg-red-50 dark:bg-red-900/10 p-3 rounded-lg border border-red-100 dark:border-red-900/30">
                        <XCircle size={18} className="text-red-500 mr-3 shrink-0 mt-0.5"/> 
                        <div>
                            <span className="font-bold block text-slate-800 dark:text-slate-200 mb-1">catch(Exception e) above Specifics</span>
                            <span className="text-slate-600 dark:text-slate-400">Wrong! Specific exceptions (like FileNotFoundException) MUST go above the general Exception class.</span>
                        </div>
                    </li>
                    <li className="flex items-start bg-red-50 dark:bg-red-900/10 p-3 rounded-lg border border-red-100 dark:border-red-900/30">
                        <XCircle size={18} className="text-red-500 mr-3 shrink-0 mt-0.5"/> 
                        <div>
                            <span className="font-bold block text-slate-800 dark:text-slate-200 mb-1">s.concat("A") without reassigning</span>
                            <span className="text-slate-600 dark:text-slate-400">Strings are immutable! s.concat("A") returns a new string. You must reassign it: s = s.concat("A").</span>
                        </div>
                    </li>
                </ul>
            </div>

            <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700">
                <h3 className="text-xl font-bold mb-6 text-blue-600 dark:text-blue-400 border-b border-slate-100 dark:border-slate-700 pb-3 flex items-center">
                    <CodeIcon className="mr-2" /> Quick Keyword Check
                </h3>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <tbody>
                            <tr className="border-b border-slate-100 dark:border-slate-700/50 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition">
                                <td className="py-3 px-2 font-mono font-bold text-blue-700 dark:text-blue-400">throw</td>
                                <td className="py-3 px-2 text-slate-700 dark:text-slate-300">Action: Crashes code manually (throw new Exception).</td>
                            </tr>
                            <tr className="border-b border-slate-100 dark:border-slate-700/50 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition">
                                <td className="py-3 px-2 font-mono font-bold text-blue-700 dark:text-blue-400">throws</td>
                                <td className="py-3 px-2 text-slate-700 dark:text-slate-300">Warning: Placed on method signature (void run() throws X).</td>
                            </tr>
                            <tr className="border-b border-slate-100 dark:border-slate-700/50 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition">
                                <td className="py-3 px-2 font-mono font-bold text-blue-700 dark:text-blue-400">synchronized</td>
                                <td className="py-3 px-2 text-slate-700 dark:text-slate-300">Locks method/resource for 1 thread at a time.</td>
                            </tr>
                            <tr className="border-b border-slate-100 dark:border-slate-700/50 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition">
                                <td className="py-3 px-2 font-mono font-bold text-blue-700 dark:text-blue-400">super(...)</td>
                                <td className="py-3 px-2 text-slate-700 dark:text-slate-300">Calls parent constructor (used in Custom Exceptions).</td>
                            </tr>
                            <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition">
                                <td className="py-3 px-2 font-mono font-bold text-blue-700 dark:text-blue-400">implements</td>
                                <td className="py-3 px-2 text-slate-700 dark:text-slate-300">Used to attach the Runnable interface.</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
);

export default function App() {
    const [activeTab, setActiveTab] = useState('dashboard');
    const [theme, setTheme] = useState('light');
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const toggleTheme = () => {
        setTheme(theme === 'light' ? 'dark' : 'light');
    };

    const NavItem = ({ id, label, icon: IconCmp }) => (
        <button 
            onClick={() => { setActiveTab(id); setMobileMenuOpen(false); }}
            className={`w-full flex items-center p-3.5 mb-2 rounded-xl transition-all duration-200 ${
                activeTab === id 
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20' 
                : 'text-slate-600 dark:text-slate-400 hover:bg-blue-50 dark:hover:bg-slate-800 hover:text-blue-600 dark:hover:text-blue-400'
            }`}
        >
            <IconCmp size={20} className="mr-3" />
            <span className="font-semibold tracking-wide">{label}</span>
        </button>
    );

    const renderDashboard = () => (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="bg-white dark:bg-slate-800 p-10 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 text-center">
                <div className="inline-block bg-blue-100 dark:bg-blue-900/50 p-4 rounded-full mb-6">
                    <Coffee size={40} className="text-blue-600 dark:text-blue-400" />
                </div>
                <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white mb-4 tracking-tight">OOP Java Learning Hub</h1>
                <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto font-medium">
                    Understand OOP theory → Understand Java syntax → Read code → Trace execution.
                </p>
                <div className="flex flex-wrap justify-center gap-4 mt-10">
                    <button onClick={()=>setActiveTab('theory')} className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-bold transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5 flex items-center">
                        <BookOpen size={20} className="mr-2"/> Theory & Rules
                    </button>
                    <button onClick={()=>setActiveTab('labs')} className="bg-slate-800 hover:bg-slate-700 dark:bg-slate-700 dark:hover:bg-slate-600 text-white px-8 py-3 rounded-xl font-bold transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5 flex items-center">
                        <FlaskConical size={20} className="mr-2"/> Lab Walkthroughs
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 flex flex-col items-center text-center cursor-pointer hover:shadow-md hover:-translate-y-1 transition-all duration-300 group" onClick={()=>setActiveTab('code-learner')}>
                    <div className="bg-blue-50 dark:bg-blue-900/30 p-4 rounded-2xl mb-4 text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform"><Code2 size={28}/></div>
                    <h3 className="font-bold text-slate-800 dark:text-slate-200 text-lg">Code Learner</h3>
                    <p className="text-sm text-slate-500 mt-2">Interactive code breakdowns & tracing</p>
                </div>
                <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 flex flex-col items-center text-center cursor-pointer hover:shadow-md hover:-translate-y-1 transition-all duration-300 group" onClick={()=>setActiveTab('labs')}>
                    <div className="bg-green-50 dark:bg-green-900/30 p-4 rounded-2xl mb-4 text-green-600 dark:text-green-400 group-hover:scale-110 transition-transform"><FlaskConical size={28}/></div>
                    <h3 className="font-bold text-slate-800 dark:text-slate-200 text-lg">Lab Code Viewer</h3>
                    <p className="text-sm text-slate-500 mt-2">Labs 8, 9, 10, 11 explained</p>
                </div>
                <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 flex flex-col items-center text-center cursor-pointer hover:shadow-md hover:-translate-y-1 transition-all duration-300 group" onClick={()=>setActiveTab('theory')}>
                    <div className="bg-purple-50 dark:bg-purple-900/30 p-4 rounded-2xl mb-4 text-purple-600 dark:text-purple-400 group-hover:scale-110 transition-transform"><BrainCircuit size={28}/></div>
                    <h3 className="font-bold text-slate-800 dark:text-slate-200 text-lg">OOP Theory</h3>
                    <p className="text-sm text-slate-500 mt-2">Syntax, Rules, Why</p>
                </div>
                <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 flex flex-col items-center text-center cursor-pointer hover:shadow-md hover:-translate-y-1 transition-all duration-300 group" onClick={()=>setActiveTab('cheat')}>
                    <div className="bg-red-50 dark:bg-red-900/30 p-4 rounded-2xl mb-4 text-red-600 dark:text-red-400 group-hover:scale-110 transition-transform"><Flame size={28}/></div>
                    <h3 className="font-bold text-slate-800 dark:text-slate-200 text-lg">Quick Revision</h3>
                    <p className="text-sm text-slate-500 mt-2">10-min exam prep & traps</p>
                </div>
            </div>

            <CodeReadingGuide />
        </div>
    );

    const renderTheory = () => {
        return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700">
                <h2 className="text-2xl font-bold flex items-center text-slate-800 dark:text-white">
                    <BookOpen className="mr-3 text-blue-500"/> Theory Modules
                </h2>
                <p className="text-slate-500 mt-2 font-medium">Core concepts simplified from your lectures and lab sheets.</p>
            </div>

            {theoryData.map(concept => (
                <div key={concept.id} className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700">
                    <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 flex items-center">
                        <ArrowRight className="mr-2 text-slate-400"/> {concept.title}
                    </h3>
                    
                    <div className="bg-blue-50/80 dark:bg-blue-900/10 p-6 rounded-xl mb-8 border-l-4 border-blue-600 shadow-sm">
                        <span className="text-xs font-bold uppercase text-blue-700 dark:text-blue-400 mb-2 block tracking-wider">Simple Explanation</span>
                        <p className="text-slate-800 dark:text-slate-200 text-lg font-medium">{concept.simple}</p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8 mb-8">
                        <div>
                            <h4 className="font-bold text-slate-800 dark:text-slate-200 mb-3 flex items-center text-lg"><HelpCircle size={20} className="mr-2 text-purple-500"/> Why do we use it?</h4>
                            <p className="text-slate-600 dark:text-slate-400 leading-relaxed bg-slate-50 dark:bg-slate-900/40 p-4 rounded-xl border border-slate-100 dark:border-slate-700">{concept.why}</p>
                        </div>
                        <div>
                            <h4 className="font-bold text-slate-800 dark:text-slate-200 mb-3 flex items-center text-lg"><AlertTriangle size={20} className="mr-2 text-yellow-500"/> Important Rules</h4>
                            <ul className="space-y-2 bg-slate-50 dark:bg-slate-900/40 p-4 rounded-xl border border-slate-100 dark:border-slate-700">
                                {concept.rules.map((rule, i) => (
                                    <li key={i} className="flex items-start text-slate-600 dark:text-slate-400">
                                        <div className="w-1.5 h-1.5 rounded-full bg-yellow-500 mt-2 mr-3 shrink-0"></div>
                                        <span>{rule}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    <div className="mb-8">
                        <h4 className="font-bold text-slate-800 dark:text-slate-200 mb-3 flex items-center text-lg"><CodeIcon size={20} className="mr-2 text-green-500"/> Syntax Pattern</h4>
                        <pre className="bg-[#0d1117] text-green-400 p-5 rounded-xl font-mono text-sm overflow-x-auto shadow-inner border border-slate-800">
                            <code>{concept.syntax}</code>
                        </pre>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="border border-red-200 dark:border-red-900/40 bg-red-50 dark:bg-red-900/10 p-6 rounded-xl shadow-sm">
                            <span className="text-xs font-bold uppercase tracking-wider text-red-600 dark:text-red-400 mb-3 flex items-center"><XOctagon size={16} className="mr-2"/> Common Mistake</span>
                            <div className="line-through text-red-500/80 font-mono text-sm mb-2">{concept.mistake.wrong}</div>
                            <div className="text-green-600 dark:text-green-400 font-mono text-sm mb-4 font-bold">{concept.mistake.right}</div>
                            <p className="text-sm text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-900/50 p-3 rounded border border-red-100 dark:border-red-900/30"><b>Why?</b> {concept.mistake.why}</p>
                        </div>
                        <div className="border border-purple-200 dark:border-purple-900/40 bg-purple-50 dark:bg-purple-900/10 p-6 rounded-xl flex flex-col justify-center items-center text-center shadow-sm">
                            <Brain size={32} className="text-purple-500 mb-3"/>
                            <span className="text-xs font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400 mb-2">Memory Trick</span>
                            <p className="font-bold text-purple-900 dark:text-purple-200 text-lg">"{concept.memory}"</p>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    )};

    const renderContent = () => {
        switch(activeTab) {
            case 'dashboard': return renderDashboard();
            case 'theory': return renderTheory();
            case 'code-learner': return (
                <div className="space-y-8 animate-in fade-in duration-500">
                    <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700">
                        <h2 className="text-2xl font-bold mb-3 flex items-center text-slate-800 dark:text-white">
                            <Code2 className="mr-3 text-blue-500" /> Code Learner & Execution Flow
                        </h2>
                        <p className="text-slate-500 dark:text-slate-400 font-medium text-lg">Interact with code snippets to see exactly what each token does, or trace execution step-by-step.</p>
                    </div>
                    <CodeExplainer data={codeBreakdownData[0]} />
                    <ExecutionTracer data={executionFlowData[0]} />
                </div>
            );
            case 'labs': return <div className="animate-in fade-in duration-500"><LabViewer /></div>;
            case 'cheat': return <div className="animate-in fade-in duration-500"><CheatSheet /></div>;
            default: return renderDashboard();
        }
    };

    return (
        <div className={`min-h-screen font-sans ${theme === 'dark' ? 'dark bg-slate-900' : 'bg-slate-50'} transition-colors duration-300`}>
            <div className="flex flex-col md:flex-row h-screen overflow-hidden text-slate-800 dark:text-slate-200">
                
                {/* Mobile Header */}
                <div className="md:hidden bg-white dark:bg-slate-900 p-4 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center z-20 shadow-sm shrink-0">
                    <div className="font-black text-xl text-blue-600 dark:text-blue-500 flex items-center tracking-tight">
                        <Coffee size={24} className="mr-2" /> OOP Learner
                    </div>
                    <div className="flex gap-4">
                        <button onClick={toggleTheme} className="text-slate-500 hover:text-slate-800 dark:hover:text-white"><Moon className="hidden dark:block" /><Sun className="block dark:hidden" /></button>
                        <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="text-slate-500 hover:text-slate-800 dark:hover:text-white">{mobileMenuOpen ? <X /> : <Menu />}</button>
                    </div>
                </div>

                {/* Sidebar Navigation */}
                <div className={`${mobileMenuOpen ? 'flex absolute inset-0 pt-[72px] z-10 bg-slate-50 dark:bg-slate-900' : 'hidden'} md:flex w-full md:w-72 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex-col shrink-0 transition-transform`}>
                    <div className="hidden md:flex font-black text-2xl text-blue-600 dark:text-blue-500 items-center p-6 border-b border-slate-100 dark:border-slate-800 tracking-tight">
                        <Coffee size={28} className="mr-3" /> OOP Learner
                    </div>
                    <nav className="flex-1 p-4 overflow-y-auto space-y-1">
                        <NavItem id="dashboard" label="Dashboard" icon={LayoutDashboard} />
                        <NavItem id="theory" label="Theory & Rules" icon={BookOpen} />
                        <NavItem id="code-learner" label="Code Breakdown" icon={Code2} />
                        <NavItem id="labs" label="Lab Code Viewer" icon={FlaskConical} />
                        <NavItem id="cheat" label="Quick Revision" icon={Flame} />
                    </nav>
                    <div className="mt-auto hidden md:flex items-center justify-between p-6 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50">
                        <span className="text-sm font-bold text-slate-500 dark:text-slate-400 tracking-wide uppercase">Theme</span>
                        <button onClick={toggleTheme} className="p-2.5 bg-white dark:bg-slate-800 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition shadow-sm border border-slate-200 dark:border-slate-700">
                            <Moon size={18} className="hidden dark:block" />
                            <Sun size={18} className="block dark:hidden" />
                        </button>
                    </div>
                </div>

                {/* Main Content Area */}
                <div className="flex-1 overflow-y-auto p-4 md:p-8 relative">
                    <div className="max-w-6xl mx-auto w-full pb-20 md:pb-8">
                        {renderContent()}
                    </div>
                </div>

            </div>
        </div>
    );
}