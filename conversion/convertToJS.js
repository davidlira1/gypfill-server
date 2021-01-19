var convertToJS = (str) => {
    str = str.replace(/'/g,"//");
    
    str = str.replace(/Sub (\w*)(.*)/g,"var $1 = function$2 {");
    str = str.replace(/End Sub/g,"}");
    
    str = str.replace(/Function (\w*)(.*)/g,"var $1 = function$2 {");
    str = str.replace(/End Function/g,"}");
    
    str = str.replace(/ As \w*/g,"");
    
    str = str.replace(/Dim/g,"var");
    
    str = str.replace(/var (\w*): .* =/g,"var $1 =");
    
    str = str.replace(/ElseIf (.*) Then/g,"} else if ($1) {");
    
    str = str.replace(/If (.*) Then/g,"if ($1) {");
    
    str = str.replace(/Else/g,"} else {");
    
    str = str.replace(/End If/g,"}");
    
    str = str.replace(/.Add "(.*?)",/g,".$1 =");
    str = str.replace(/.Add (.*?),/g,"[$1] =");
    
    str = str.replace(/\("(\w*)"\)/g,".$1");
    str = str.replace(/(?<!function)\((\w*)\)/g,"[$1]");
    str = str.replace(/if \[(\w*)\]/g,"if ($1)");
    
    str = str.replace(/For Each (\w*) In (.*).Keys/g,"for($1 in $2) {");
    
    str = str.replace(/<>/g,"!==");
    
    str = str.replace(/Next \w*/g,"}");
    
    str = str.replace(/ And /g," && ");
    
    str = str.replace(/Set (.*) =/g,"$1 =");
    
    str = str.replace(/(if \(.*) = (.*)/g,"$1 === $2");
    
    str = str.replace(/New Dictionary/g,"{}");
    
    str = str.replace(/(\w*).Remove "(.*)"/g,"delete $1.$2");
    
    str = str.replace(/(\w*)\.Exists\.(\w*)/g,"$1.$2");
    
    str = str.replace(/:/g,",");
    
    str = str.replace(/ & /g," + ");
    
    str = str.replace(/True/g,"true");
    
    str = str.replace(/False/g,"false");

    return str;
}

module.exports = convertToJS;